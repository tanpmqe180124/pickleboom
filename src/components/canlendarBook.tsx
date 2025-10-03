'use client';

import * as React from 'react';

import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useBookingStore } from '@/stores/useBookingStore';
import { ChevronLeft } from 'lucide-react';

export function Calendar13() {
  const [dropdown, setDropdown] =
    React.useState<React.ComponentProps<typeof Calendar>['captionLayout']>(
      'dropdown',
    );
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2025, 5, 12),
  );

  const hasClickedDate = useBookingStore((state) => state.hasClickedDate);
  return (
    <div
      className={cn(
        'mx-auto mt-10 flex w-full min-w-[550px] items-stretch justify-center gap-0 rounded-lg border shadow-sm transition-all duration-300',
        hasClickedDate ? 'max-w-[850px]' : 'max-w-[750px]',
      )}
    >
      {/* Bên trái */}
      <div className="w-full max-w-[362px] space-y-4 border-r border-gray-200 px-6 py-4">
        <button className="back-button">
          <ChevronLeft size={20} />
        </button>

        <p className="booking-title">Pickle Boom</p>
        <h2 className="text-lg">Dịch vụ đặt sân</h2>

        <div className="flex flex-col items-center justify-start space-y-4">
          <span className="block text-lg font-medium">
            Quý khách có muốn thêm nước uống giải khát vào đơn đặt sân không?
          </span>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="radio"
                name="drink"
                value="yes"
                className="accent-[#2F3C54]"
              />
              Có, tôi muốn sử dụng
            </label>

            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="radio"
                name="drink"
                value="no"
                className="accent-[#2F3C54]"
              />
              Không, tôi không có nhu cầu
            </label>
          </div>
        </div>
      </div>

      {/* Bên phải */}
      <div className="border-l border-gray-200 px-6 py-4">
        <Calendar
          style={{ '--cell-size': '3rem' } as React.CSSProperties}
          mode="single"
          defaultMonth={date}
          selected={date}
          onSelect={setDate}
          captionLayout={dropdown}
          className=""
          classNames={{
            day: cn(
              'group/day relative h-full w-full select-none p-0 text-center',
              'transition-colors duration-150',
              'data-[selected=true]:bg-blue-500 data-[selected=true]:text-white data-[selected=true]:rounded-full',
            ),
            today: cn(
              'relative text-blue-600 font-medium',
              'after:content-[""] after:absolute after:bottom-[5px] after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-blue-500',
              'data-[selected=true]:after:hidden',
            ),
          }}
        />

        <div className="mt-4 flex flex-col gap-3">
          <Select
            value={dropdown}
            onValueChange={(value) =>
              setDropdown(
                value as React.ComponentProps<typeof Calendar>['captionLayout'],
              )
            }
          >
            <SelectTrigger id="dropdown" className="w-full bg-background">
              <SelectValue placeholder="Dropdown" />
            </SelectTrigger>
            <SelectContent
              side="bottom"
              align="center"
              position="popper"
              avoidCollisions={false}
              className="max-h-32"
            >
              <SelectItem value="dropdown" className="px-2 py-2 text-xs">
                Month and Year
              </SelectItem>
              <SelectItem value="dropdown-months" className="px-2 py-2 text-xs">
                Month Only
              </SelectItem>
              <SelectItem value="dropdown-years" className="px-2 py-2 text-xs">
                Year Only
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
