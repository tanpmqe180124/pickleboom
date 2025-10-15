import React, { useState } from 'react';

interface CustomTimePickerProps {
  value: string;
  onChange: (time: string) => void;
  label: string;
  required?: boolean;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({ value, onChange, label, required = false }) => {
  const [hours, minutes] = value ? value.split(':') : ['', ''];
  const [showPicker, setShowPicker] = useState(false);

  const handleHourChange = (hour: string) => {
    const newTime = `${hour.padStart(2, '0')}:${minutes || '00'}`;
    onChange(newTime);
  };

  const handleMinuteChange = (minute: string) => {
    const newTime = `${hours || '00'}:${minute.padStart(2, '0')}`;
    onChange(newTime);
  };

  const formatDisplayTime = (time: string) => {
    if (!time) return '--:--';
    const [h, m] = time.split(':');
    return `${h}:${m}`;
  };

  const generateHours = () => {
    return Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  };

  const generateMinutes = () => {
    return Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && '*'}
      </label>
      <div
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer bg-white"
        onClick={() => setShowPicker(!showPicker)}
      >
        <div className="flex items-center justify-between">
          <span className="text-gray-900">
            {formatDisplayTime(value)}
          </span>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {showPicker && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-4">
            <div className="flex items-center justify-center space-x-4">
              {/* Hours */}
              <div className="flex flex-col items-center">
                <div className="text-xs font-medium text-gray-500 mb-2">Giờ</div>
                <div className="h-32 overflow-y-auto border border-gray-200 rounded-lg w-16">
                  {generateHours().map((hour) => (
                    <button
                      key={hour}
                      type="button"
                      className={`w-full py-2 text-sm hover:bg-blue-50 transition-colors ${
                        hours === hour ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'
                      }`}
                      onClick={() => handleHourChange(hour)}
                    >
                      {hour}
                    </button>
                  ))}
                </div>
              </div>

              {/* Separator */}
              <div className="text-lg font-bold text-gray-400 mt-8">:</div>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <div className="text-xs font-medium text-gray-500 mb-2">Phút</div>
                <div className="h-32 overflow-y-auto border border-gray-200 rounded-lg w-16">
                  {generateMinutes().map((minute) => (
                    <button
                      key={minute}
                      type="button"
                      className={`w-full py-2 text-sm hover:bg-blue-50 transition-colors ${
                        minutes === minute ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'
                      }`}
                      onClick={() => handleMinuteChange(minute)}
                    >
                      {minute}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowPicker(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => setShowPicker(false)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Xong
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTimePicker;
