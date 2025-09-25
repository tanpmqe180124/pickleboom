import type { DayPickerProps } from 'react-day-picker';

type DayClickEventHandler = NonNullable<DayPickerProps['onDayClick']>;

interface HandleDayClickOptions {
  setSelectedDate: BookingState['setSelectedDate'];
  setHasClickedDate: BookingState['setHasClickedDate'];
  externalCallback?: DayClickEventHandler;
}

export const handleDayClick =
  ({
    setSelectedDate,
    setHasClickedDate,
    externalCallback,
  }: HandleDayClickOptions): DayClickEventHandler =>
  (date, modifiers, event) => {
    if (modifiers.disabled) return;

    setSelectedDate(date);
    setHasClickedDate(true);
    externalCallback?.(date, modifiers, event);
  };
