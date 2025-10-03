'use client';

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import * as React from 'react';
import { DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker';

import { Button, buttonVariants } from '@/components/ui/button';
import { handleDayClick } from '@/lib/handleDayClick';
import { cn } from '@/lib/utils';
import { useBookingStore } from '@/stores/useBookingStore';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
}) {
  const defaultClassNames = getDefaultClassNames();
  const { setSelectedDate, setHasClickedDate } = useBookingStore();

  return (
    <DayPicker
      onDayClick={handleDayClick({
        setSelectedDate,
        setHasClickedDate,
        externalCallback: props?.onDayClick,
      })}
      showOutsideDays={showOutsideDays}
      weekStartsOn={1}
      className={cn(
        'group/calendar bg-white rounded-2xl shadow-lg p-6 w-[370px] flex flex-col items-center',
        className,
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn('flex flex-col gap-2', defaultClassNames.months),
        month: cn('flex w-full flex-col gap-2', defaultClassNames.month),
        nav: cn('flex w-full items-center justify-between mb-2', defaultClassNames.nav),
        button_previous: cn(
          'w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center p-0 border-none shadow-sm',
          'hover:bg-blue-100',
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          'w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center p-0 border-none shadow-sm',
          'hover:bg-blue-100',
          defaultClassNames.button_next,
        ),
        month_caption: cn('flex w-full items-center justify-center font-bold text-blue-600 text-lg', defaultClassNames.month_caption),
        dropdowns: cn('hidden', defaultClassNames.dropdowns),
        dropdown_root: cn('hidden', defaultClassNames.dropdown_root),
        dropdown: cn('hidden', defaultClassNames.dropdown),
        caption_label: cn('select-none font-bold text-blue-600 text-lg', defaultClassNames.caption_label),
        table: 'w-full border-collapse',
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn('flex-1 text-center text-xs font-semibold text-gray-500', defaultClassNames.weekday),
        week: cn('flex w-full', defaultClassNames.week),
        day: cn(
          'flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-700 font-medium text-base transition-all duration-150',
          'hover:bg-blue-100',
          '[data-selected=true]:bg-blue-500 [data-selected=true]:text-white',
          '[data-today=true]:border-blue-400 [data-today=true]:border',
          '[data-weekend=true]:text-red-500',
          defaultClassNames.day,
        ),
        today: cn('border border-blue-400', defaultClassNames.today),
        outside: cn('text-gray-300', defaultClassNames.outside),
        disabled: cn('text-gray-300 opacity-50', defaultClassNames.disabled),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          );
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === 'left') {
            return (
              <ChevronLeftIcon className={cn('size-4', className)} {...props} />
            );
          }

          if (orientation === 'right') {
            return (
              <ChevronRightIcon
                className={cn('size-4', className)}
                {...props}
              />
            );
          }

          return (
            <ChevronDownIcon className={cn('size-4', className)} {...props} />
          );
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-[--cell-size] items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);
  // Xác định cuối tuần
  const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;
  return (
    <Button
      ref={ref}
      variant="ghost"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      data-today={modifiers.today}
      data-weekend={isWeekend}
      className={cn(
        'flex items-center justify-center w-10 h-10 rounded-full font-medium text-base transition-all duration-150',
        'hover:bg-blue-100',
        '[data-selected=true]:bg-blue-500 [data-selected=true]:text-white',
        '[data-today=true]:border-blue-400 [data-today=true]:border',
        isWeekend ? 'text-red-500' : '',
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
