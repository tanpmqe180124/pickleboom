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
  message: string;
  statusCode: number;
  data: {
    orderCode: number;
    checkoutUrl: string;
    amount: number;
    qrCode?: string;
  };
}

export interface BookingStatusResponse {
  message: string;
  statusCode: number;
  data: {
    orderCode: string;
    bookingStatus: number; // 0: Free, 1: Pending, 2: Paid, 3: Cancelled
    customerName: string;
    phoneNumber: string;
    email: string;
    totalAmount: number;
    bookingDate: string;
    courtName: string;
    createdAt: string;
    expiredAt: string;
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
    partnerId: string; // Thêm PartnerId
  }): Promise<PaymentResponse> {
    try {
      // Map timeSlots to BookingTimeSlot để match với backend
      const payload = {
        courtID: bookingData.courtID,
        bookingDate: bookingData.bookingDate,
        partnerId: bookingData.partnerId, // Thêm PartnerId
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

  // Kiểm tra trạng thái booking theo orderCode
  async checkBookingStatus(orderCode: string): Promise<BookingStatusResponse> {
    try {
      const response = await api.get<BookingStatusResponse>(`/Common/booking/status/${orderCode}`);
      return response.data;
    } catch (error) {
      console.error('Error checking booking status:', error);
      throw error;
    }
  },

  // Polling để kiểm tra trạng thái booking
  async pollBookingStatus(
    orderCode: string, 
    onStatusChange: (status: BookingStatusResponse) => void,
    maxAttempts: number = 30,
    intervalMs: number = 3000
  ): Promise<BookingStatusResponse> {
    let attempts = 0;
    
    const poll = async (): Promise<BookingStatusResponse> => {
      try {
        const status = await this.checkBookingStatus(orderCode);
        onStatusChange(status);
        
        // 2 = Paid, 3 = Cancelled
        if (status.data.bookingStatus === 2 || status.data.bookingStatus === 3) {
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


