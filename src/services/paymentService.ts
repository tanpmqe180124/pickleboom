import { api } from '@/infrastructure/api/axiosClient';

export interface PaymentStatus {
  orderCode: string;
  status: 'pending' | 'paid' | 'cancelled' | 'expired';
  amount: number;
  bookingId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingStatus {
  id: string;
  courtId: string;
  bookingDate: string;
  customerName: string;
  phoneNumber: string;
  email: string;
  totalAmount: number;
  status: 'pending' | 'paid' | 'cancelled';
  timeSlots: Array<{
    id: string;
    startTime: string;
    endTime: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentResponse {
  Message: string;
  StatusCode: number;
  Data: {
    orderCode: number;
    checkoutUrl: string;
    amount: number;
  };
}

export const paymentService = {
  // Tạo payment link - Match với backend BookingRequest
  async createPayment(bookingData: {
    courtID: string;
    bookingDate: string;
    customerName: string;
    phoneNumber: string;
    email: string;
    amount: number;
    timeSlots: string[]; // Array of Guid strings
  }): Promise<PaymentResponse> {
    try {
      // Map timeSlots to BookingTimeSlot để match với backend
      const payload = {
        courtID: bookingData.courtID,
        bookingDate: bookingData.bookingDate,
        customerName: bookingData.customerName,
        phoneNumber: bookingData.phoneNumber,
        email: bookingData.email,
        amount: bookingData.amount,
        BookingTimeSlot: bookingData.timeSlots // Map timeSlots -> BookingTimeSlot
      };
      
      const response = await api.post<PaymentResponse>('/Payment', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  // Kiểm tra trạng thái booking theo orderCode - Sẽ cần thêm endpoint này vào backend
  async checkBookingStatus(orderCode: string): Promise<BookingStatus> {
    try {
      const response = await api.get<BookingStatus>(`/Booking/order/${orderCode}`);
      return response.data;
    } catch (error) {
      console.error('Error checking booking status:', error);
      throw error;
    }
  },

  // Polling để kiểm tra trạng thái booking
  async pollBookingStatus(
    orderCode: string, 
    onStatusChange: (status: BookingStatus) => void,
    maxAttempts: number = 30,
    intervalMs: number = 3000
  ): Promise<BookingStatus> {
    let attempts = 0;
    
    const poll = async (): Promise<BookingStatus> => {
      try {
        const status = await this.checkBookingStatus(orderCode);
        onStatusChange(status);
        
        if (status.status === 'paid' || status.status === 'cancelled') {
          return status;
        }
        
        if (attempts >= maxAttempts) {
          throw new Error('Booking status check timeout');
        }
        
        attempts++;
        await new Promise(resolve => setTimeout(resolve, intervalMs));
        return poll();
      } catch (error) {
        console.error('Error polling booking status:', error);
        throw error;
      }
    };
    
    return poll();
  }
};

export default paymentService;


