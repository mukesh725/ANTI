import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  selectedDate: string;
  onSelect: (date: string) => void;
  minDate: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onSelect, minDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate || minDate));

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
  }

  const minDateObj = new Date(minDate + "T00:00:00");

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dateObj = new Date(dateStr + "T00:00:00");
    const isPast = dateObj < minDateObj;
    const isSelected = dateStr === selectedDate;

    days.push(
      <button
        key={d}
        disabled={isPast}
        onClick={() => {
          onSelect(dateStr);
        }}
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${
          isPast 
            ? 'text-gray-300 cursor-not-allowed opacity-50' 
            : isSelected 
              ? 'bg-[#0A1128] text-white font-bold shadow-lg transform scale-110' 
              : 'text-gray-700 hover:bg-gray-100 font-medium'
        }`}
      >
        {d}
      </button>
    );
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-5 mt-4">
      <div className="flex justify-between items-center mb-6">
        <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-50 rounded-full transition-colors border border-gray-100">
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <p className="font-bold text-gray-900 text-sm tracking-wide">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </p>
        <button onClick={handleNextMonth} className="p-2 hover:bg-gray-50 rounded-full transition-colors border border-gray-100">
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-2 gap-x-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="w-8 text-center text-[10px] uppercase tracking-widest font-bold text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-2 gap-x-1 justify-items-center">
        {days}
      </div>
    </div>
  );
};
