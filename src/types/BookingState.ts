import { TimeSlot, Court } from '@/services/bookingService';

export interface BookingState {
  selectedDate: Date | null;
  selectedTime: string | null;
  duration: number;
  fieldId: string | null;
  note: string;
  price: number | null;
  hasClickedDate: boolean;
  selectedTimes: string[];
  selectedTimeSlots: string[];
  selectedTimeSlotIds: string[]; // New: Array of time slot IDs
  selectedCourt: Court | null; // Updated: Proper Court type
  drinkOption: string;
  
  // API Data
  allTimeSlots: TimeSlot[]; // New: All available time slots from API
  availableTimeSlots: TimeSlot[]; // New: Available time slots for selected court/date
  userID: string | null; // New: User ID for booking
  customerName: string; // New: Customer name for booking

  // Setters
  setSelectedDate: (date: Date | null) => void;
  setSelectedTime: (time: string | null) => void;
  setDuration: (duration: number) => void;
  setFieldId: (id: string | null) => void;
  setNote: (note: string) => void;
  setPrice: (price: number | null) => void;
  setHasClickedDate: (value: boolean) => void;
  setSelectedTimes: (times: string[]) => void;
  setSelectedTimeSlots: (slots: string[]) => void;
  setSelectedTimeSlotIds: (ids: string[]) => void; // New setter
  setSelectedCourt: (court: Court | null) => void; // Updated: Proper Court type
  setDrinkOption: (option: string) => void;
  
  // New setters for API data
  setAllTimeSlots: (slots: TimeSlot[]) => void;
  setAvailableTimeSlots: (slots: TimeSlot[]) => void;
  setUserID: (id: string | null) => void;
  setCustomerName: (name: string) => void;

  resetBooking: () => void;
}
