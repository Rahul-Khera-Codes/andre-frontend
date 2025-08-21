import { useState, useRef, useEffect } from "react";
import { format, addMonths, subMonths, isSameDay } from "date-fns";
import { CalendarIcon } from "lucide-react";

export default function CustomDatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || new Date());
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const [view, setView] = useState("date"); // 'date' | 'month' | 'year'
  const [currentYear, setCurrentYear] = useState(currentMonth.getFullYear());
  const ref = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setView("date");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const startDay = startDate.getDay();
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

  const generateDates = () => {
    const dates = [];
    const prevMonth = subMonths(currentMonth, 1);
    const daysInPrevMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0).getDate();

    for (let i = startDay - 1; i >= 0; i--) {
      dates.push({
        date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), daysInPrevMonth - i),
        current: false,
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      dates.push({
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i),
        current: true,
      });
    }

    const nextDays = 42 - dates.length;
    const nextMonth = addMonths(currentMonth, 1);
    for (let i = 1; i <= nextDays; i++) {
      dates.push({
        date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i),
        current: false,
      });
    }

    return dates;
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setOpen(false);
    setView("date");
    onChange?.(date);
  };

  const handleToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today);
    setCurrentYear(today.getFullYear());
    onChange?.(today);
    setOpen(false);
    setView("date");
  };

  const yearGrid = () => {
    const start = Math.floor(currentYear / 12) * 12;
    return Array.from({ length: 12 }).map((_, i) => start + i);
  };

  return (
    <div className="relative w-full" ref={ref}>
      <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-left text-gray-900 focus:outline-none focus:ring-1 focus:ring-green-500 cursor-pointer"
      >
        <span className="flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5 text-gray-500" />
          <span>{format(selectedDate, "PPP")}</span>
        </span>
        <svg
          className={`w-4 h-4 ml-2 transform transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 p-4 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            {view === "date" && (
              <>
                <button
                  onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
                  className="text-sm px-2 py-1 hover:bg-gray-100 rounded"
                >
                  ←
                </button>
                <button
                  onClick={() => setView("month")}
                  className="text-sm font-medium text-gray-800 hover:underline"
                >
                  {format(currentMonth, "MMMM yyyy")}
                </button>
                <button
                  onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
                  className="text-sm px-2 py-1 hover:bg-gray-100 rounded"
                >
                  →
                </button>
              </>
            )}

            {view === "month" && (
              <>
                <button
                  onClick={() => setCurrentYear((prev) => prev - 1)}
                  className="text-sm px-2 py-1 hover:bg-gray-100 rounded"
                >
                  ←
                </button>
                <button
                  onClick={() => setView("year")}
                  className="text-sm font-medium text-gray-800 hover:underline"
                >
                  {currentYear}
                </button>
                <button
                  onClick={() => setCurrentYear((prev) => prev + 1)}
                  className="text-sm px-2 py-1 hover:bg-gray-100 rounded"
                >
                  →
                </button>
              </>
            )}

            {view === "year" && (
              <>
                <button
                  onClick={() => setCurrentYear((prev) => prev - 12)}
                  className="text-sm px-2 py-1 hover:bg-gray-100 rounded"
                >
                  ←
                </button>
                <div className="text-sm font-medium text-gray-800">
                  {yearGrid()[0]} - {yearGrid()[11]}
                </div>
                <button
                  onClick={() => setCurrentYear((prev) => prev + 12)}
                  className="text-sm px-2 py-1 hover:bg-gray-100 rounded"
                >
                  →
                </button>
              </>
            )}
          </div>

          {/* Body */}
          {view === "date" && (
            <>
              <div className="grid grid-cols-7 text-xs text-center text-gray-500 font-medium mb-1">
                {days.map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-sm">
                {generateDates().map(({ date, current }, idx) => {
                  const isSelected = isSameDay(date, selectedDate);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleDateClick(date)}
                      className={`p-2 rounded-full transition ${
                        isSelected
                          ? "bg-green-800 text-white"
                          : current
                          ? "text-gray-800 hover:bg-green-200"
                          : "text-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {view === "month" && (
            <div className="grid grid-cols-3 gap-2 text-sm">
              {Array.from({ length: 12 }).map((_, i) => {
                const monthDate = new Date(currentYear, i, 1);
                const isCurrent =
                  currentMonth.getMonth() === i && currentMonth.getFullYear() === currentYear;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentMonth(monthDate);
                      setView("date");
                    }}
                    className={`p-2 rounded-md text-center transition ${
                      isCurrent ? "bg-green-700 text-white" : "hover:bg-gray-100 text-gray-800"
                    }`}
                  >
                    {format(monthDate, "MMM")}
                  </button>
                );
              })}
            </div>
          )}

          {view === "year" && (
            <div className="grid grid-cols-3 gap-2 text-sm">
              {yearGrid().map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    setCurrentYear(year);
                    setView("month");
                  }}
                  className={`p-2 rounded-md text-center transition ${
                    currentYear === year
                      ? "bg-green-700 text-white"
                      : "hover:bg-gray-100 text-gray-800"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          <div className="mt-3 flex justify-end">
            <button
              onClick={handleToday}
              className="text-sm text-green-800 hover:underline focus:outline-none"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
