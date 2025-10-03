import { create } from 'zustand';
import { BookingState } from '@/types/BookingState';
import { TimeSlot, Court } from '@/services/bookingService';

export const useBookingStore = create<BookingState>((set) => ({
  selectedDate: null,
  selectedTime: null,
  duration: 60,
  fieldId: null,
  note: '',
  price: null,
  hasClickedDate: false,
  selectedTimes: [],
  selectedTimeSlots: [],
  selectedTimeSlotIds: [], // New: Array of time slot IDs
  selectedCourt: null,
  drinkOption: '',
  
  // API Data
  allTimeSlots: [], // New: All available time slots from API
  availableTimeSlots: [], // New: Available time slots for selected court/date
  userID: null, // New: User ID for booking
  customerName: '', // New: Customer name for booking

  setSelectedDate: (date) => set({ selectedDate: date, hasClickedDate: true }),
  setSelectedTime: (time) => set({ selectedTime: time }),
  setDuration: (duration) => set({ duration }),
  setFieldId: (id) => set({ fieldId: id }),
  setNote: (note) => set({ note }),
  setPrice: (price) => set({ price }),
  setHasClickedDate: (value) => set({ hasClickedDate: value }),
  setSelectedTimes: (times) => set({ selectedTimes: times }),
  setSelectedTimeSlots: (slots) => set({ selectedTimeSlots: slots }),
  setSelectedTimeSlotIds: (ids) => set({ selectedTimeSlotIds: ids }), // New setter
  setSelectedCourt: (court) => set({ selectedCourt: court }),
  setDrinkOption: (option) => set({ drinkOption: option }),
  
  // New setters for API data
  setAllTimeSlots: (slots) => set({ allTimeSlots: slots }),
  setAvailableTimeSlots: (slots) => set({ availableTimeSlots: slots }),
  setUserID: (id) => set({ userID: id }),
  setCustomerName: (name) => set({ customerName: name }),

  resetBooking: () =>
    set({
      selectedDate: null,
      selectedTime: null,
      duration: 60,
      fieldId: null,
      note: '',
      price: null,
      hasClickedDate: false,
      selectedTimes: [],
      selectedTimeSlots: [],
      selectedTimeSlotIds: [], // Reset new fields
      selectedCourt: null,
      drinkOption: '',
      allTimeSlots: [], // Reset API data
      availableTimeSlots: [],
      userID: null,
      customerName: '',
    }),
}));
