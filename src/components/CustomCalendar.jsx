import { useState, useRef, useEffect } from "react"
import { format, addMonths, subMonths, isSameDay, startOfDay, isBefore } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { ChevronDown } from "lucide-react";

export default function CustomDatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(value || new Date())
  const [currentMonth, setCurrentMonth] = useState(value || new Date())
  const [view, setView] = useState("date")
  const [currentYear, setCurrentYear] = useState(currentMonth.getFullYear())
  const [selectedTime, setSelectedTime] = useState({
    hours: (value || new Date()).getHours(),
    minutes: (value || new Date()).getMinutes(),
    ampm: (value || new Date()).getHours() >= 12 ? "PM" : "AM",
  })
  const ref = useRef()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
        setView("date")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
  const startDay = startDate.getDay()
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()

  const combineDateTime = (date, time) => {
    const combined = new Date(date)
    let hours = time.hours
    if (time.ampm === "PM" && hours !== 12) hours += 12
    if (time.ampm === "AM" && hours === 12) hours = 0
    combined.setHours(hours, time.minutes, 0, 0)
    return combined
  }

  const generateDates = () => {
    const dates = []
    const prevMonth = subMonths(currentMonth, 1)
    const daysInPrevMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0).getDate()

    for (let i = startDay - 1; i >= 0; i--) {
      dates.push({
        date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), daysInPrevMonth - i),
        current: false,
      })
    }

    for (let i = 1; i <= daysInMonth; i++) {
      dates.push({
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i),
        current: true,
      })
    }

    const nextDays = 42 - dates.length
    const nextMonth = addMonths(currentMonth, 1)
    for (let i = 1; i <= nextDays; i++) {
      dates.push({
        date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i),
        current: false,
      })
    }

    return dates
  }

  const handleDateClick = (date) => {
    if (isDateDisabled(date)) return
    setSelectedDate(date)
    setView("time")
  }

  const handleTimeChange = (type, value) => {
    const newTime = { ...selectedTime, [type]: value }
    setSelectedTime(newTime)
    const combined = combineDateTime(selectedDate, newTime)
    onChange?.(combined)
  }

  const handleConfirm = () => {
    const combined = combineDateTime(selectedDate, selectedTime)
    onChange?.(combined)
    setOpen(false)
    setView("date")
  }

  const handleToday = () => {
    const today = new Date()
    setSelectedDate(today)
    setCurrentMonth(today)
    setCurrentYear(today.getFullYear())
    setSelectedTime({
      hours: today.getHours(),
      minutes: today.getMinutes(),
      ampm: today.getHours() >= 12 ? "PM" : "AM",
    })
    const combined = combineDateTime(today, {
      hours: today.getHours(),
      minutes: today.getMinutes(),
      ampm: today.getHours() >= 12 ? "PM" : "AM",
    })
    onChange?.(combined)
    setOpen(false)
    setView("date")
  }

  const isDateDisabled = (date) => {
    const today = startOfDay(new Date())
    return isBefore(startOfDay(date), today)
  }

  const yearGrid = () => {
    const start = Math.floor(currentYear / 12) * 12
    return Array.from({ length: 12 }).map((_, i) => start + i)
  }

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-2 border border-slate-300 rounded-md bg-gray-50 text-left text-slate-900 focus:outline-none focus:border-[#374A8C] cursor-pointer hover:border-slate-400 transition-colors"
      >
        <span className="flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5 text-slate-500" />
          {/* format(combineDateTime(selectedDate, selectedTime), "ddMMMuuuu, h:mm a") */}
          <span>
            {value ? formatDate(value) :'mm-dd-yyyy hh:mm' }
          </span>
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
        <div className="absolute z-50 mt-2 w-full rounded-lg shadow-lg bg-white ring-1 ring-slate-200 p-4 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            {view === "date" && (
              <>
                <button
                  onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
                  className="text-sm px-2 py-1 hover:bg-slate-100 rounded transition-colors"
                >
                  ←
                </button>
                <button
                  onClick={() => setView("month")}
                  className="text-sm font-medium text-slate-800 hover:text-[#374A8C] transition-colors"
                >
                  {format(currentMonth, "MMMM yyyy")}
                </button>
                <button
                  onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
                  className="text-sm px-2 py-1 hover:bg-slate-100 rounded transition-colors"
                >
                  →
                </button>
              </>
            )}

            {view === "month" && (
              <>
                <button
                  onClick={() => setCurrentYear((prev) => prev - 1)}
                  className="text-sm px-2 py-1 hover:bg-slate-100 rounded transition-colors"
                >
                  ←
                </button>
                <button
                  onClick={() => setView("year")}
                  className="text-sm font-medium text-slate-800 hover:text-[#374A8C] transition-colors"
                >
                  {currentYear}
                </button>
                <button
                  onClick={() => setCurrentYear((prev) => prev + 1)}
                  className="text-sm px-2 py-1 hover:bg-slate-100 rounded transition-colors"
                >
                  →
                </button>
              </>
            )}

            {view === "year" && (
              <>
                <button
                  onClick={() => setCurrentYear((prev) => prev - 12)}
                  className="text-sm px-2 py-1 hover:bg-slate-100 rounded transition-colors"
                >
                  ←
                </button>
                <div className="text-sm font-medium text-slate-800">
                  {yearGrid()[0]} - {yearGrid()[11]}
                </div>
                <button
                  onClick={() => setCurrentYear((prev) => prev + 12)}
                  className="text-sm px-2 py-1 hover:bg-slate-100 rounded transition-colors"
                >
                  →
                </button>
              </>
            )}

            {view === "time" && (
              <div className="flex items-center justify-between w-full">
                <button
                  onClick={() => setView("date")}
                  className="text-sm px-2 py-1 hover:bg-slate-100 rounded transition-colors"
                >
                  ← Back to Date
                </button>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-800">Select Time</span>
                </div>
                <div></div>
              </div>
            )}
          </div>

          {/* Body */}
          {view === "date" && (
            <>
              <div className="grid grid-cols-7 text-xs text-center text-slate-500 font-medium mb-2">
                {days.map((day) => (
                  <div key={day} className="py-1">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-sm">
                {generateDates().map(({ date, current }, idx) => {
                  const isSelected = isSameDay(date, selectedDate)
                  const isDisabled = isDateDisabled(date)
                  return (
                    <button
                      key={idx}
                      onClick={() => handleDateClick(date)}
                      disabled={isDisabled}
                      className={`p-2 rounded-lg transition-colors ${isSelected
                        ? "bg-[#374A8C] text-white" : isDisabled
                          ? "text-slate-300 cursor-not-allowed opacity-50"
                          : current
                            ? "text-slate-800 hover:bg-indigo-50"
                            : "text-slate-300 hover:bg-slate-50"
                        }`}
                    >
                      {date.getDate()}
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {view === "month" && (
            <div className="grid grid-cols-3 gap-2 text-sm">
              {Array.from({ length: 12 }).map((_, i) => {
                const monthDate = new Date(currentYear, i, 1)
                const isCurrent = currentMonth.getMonth() === i && currentMonth.getFullYear() === currentYear
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentMonth(monthDate)
                      setView("date")
                    }}
                    className={`p-3 rounded-lg text-center transition-colors ${isCurrent ? "bg-[#374A8C] text-white" : "hover:bg-slate-100 text-slate-800"
                      }`}
                  >
                    {format(monthDate, "MMM")}
                  </button>
                )
              })}
            </div>
          )}

          {view === "year" && (
            <div className="grid grid-cols-3 gap-2 text-sm">
              {yearGrid().map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    setCurrentYear(year)
                    setView("month")
                  }}
                  className={`p-3 rounded-lg text-center transition-colors ${currentYear === year ? "bg-[#374A8C] text-white" : "hover:bg-slate-100 text-slate-800"
                    }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          {view === "time" && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-4">
                {/* Hours */}
                <TimeSelectDropdown
                  label="Hour"
                  options={Array.from({ length: 12 }, (_, i) => i + 1)}
                  value={
                    selectedTime.hours > 12
                      ? selectedTime.hours - 12
                      : selectedTime.hours === 0
                        ? 12
                        : selectedTime.hours
                  }
                  onChange={(hour) => {
                    // let adjusted = hour;
                    // if (selectedTime.ampm === "PM" && hour !== 12) adjusted += 12;
                    // if (selectedTime.ampm === "AM" && hour === 12) adjusted = 0;
                    handleTimeChange("hours", hour);
                  }}
                />


                <div className="text-2xl font-bold text-slate-400 mt-6">:</div>

                {/* Minutes */}
                <div className="text-center">
                  <TimeSelectDropdown
                    label="Minute"
                    options={Array.from({ length: 60 }, (_, i) => i)}
                    value={selectedTime.minutes}
                    onChange={(minute) => handleTimeChange("minutes", minute)}
                  />
                </div>

                {/* AM/PM */}
                <div className="text-center">
                  <label className="block text-xs font-medium text-slate-600 mb-2">Period</label>
                  <div className="flex rounded-lg border border-slate-300 overflow-hidden">
                    <button
                      onClick={() => {
                        let newHours = selectedTime.hours
                        if (selectedTime.ampm === "PM") {
                          // Converting from PM to AM
                          // if (newHours >= 12) {
                          //   newHours = newHours - 12
                          // }
                        }
                        setSelectedTime((prev) => ({ ...prev, ampm: "AM", hours: newHours }))
                        const combined = combineDateTime(selectedDate, { ...selectedTime, ampm: "AM", hours: newHours })
                        onChange?.(combined)
                      }}
                      className={`px-3 py-2 text-sm font-medium transition-colors ${selectedTime.ampm === "AM"
                        ? "bg-[#374A8C] text-white"
                        : "bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                    >
                      AM
                    </button>
                    <button
                      onClick={() => {
                        let newHours = selectedTime.hours
                        if (selectedTime.ampm === "AM") {
                          // Converting from AM to PM
                          // if (newHours < 12) {
                          //   newHours = newHours + 12
                          // }
                        }
                        setSelectedTime((prev) => ({ ...prev, ampm: "PM", hours: newHours }))
                        const combined = combineDateTime(selectedDate, { ...selectedTime, ampm: "PM", hours: newHours })
                        onChange?.(combined)
                      }}
                      className={`px-3 py-2 text-sm font-medium transition-colors ${selectedTime.ampm === "PM"
                        ? "bg-[#374A8C] text-white"
                        : "bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                    >
                      PM
                    </button>
                  </div>
                </div>
              </div>

              {/* Confirm button for time view */}
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setView("date")}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-[#374A8C] text-white text-sm rounded-lg hover:bg-[#2f47a0] transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}

          {view !== "time" && (
            <div className="mt-4 flex justify-between items-center">
              <button onClick={handleToday} className="text-sm text-[#374A8C] hover:text-[#294196] transition-colors">
                Now
              </button>
              {view === "date" && (
                <button
                  onClick={() => setView("time")}
                  className="flex items-center space-x-1 text-sm text-slate-600 hover:text-[#374A8C] transition-colors"
                >
                  <Clock className="w-4 h-4" />
                  <span>Set Time</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}


const TimeSelectDropdown = ({
  label,
  options = [],
  value,
  onChange,
  className = "w-16",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="text-center">
      {label && (
        <label className="block text-xs font-medium text-slate-600 mb-2">
          {label}
        </label>
      )}
      <div ref={dropdownRef} className={`relative ${className}`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center border border-slate-300 rounded-lg px-2 py-2 text-sm bg-gray-50 focus:outline-none focus:border-[#374A8C]"
        >
          <span className="truncate text-slate-800">
            {value.toString().padStart(2, "0")}
          </span>
          <ChevronDown
            className={`ml-1 h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
              }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 max-h-40 overflow-auto">
            <ul className="py-1 px-1">
              {options.map((opt) => (
                <li
                  key={opt}
                  className={`cursor-pointer px-3 py-1.5 text-sm rounded-md ${value === opt
                    ? "bg-[#F4F5F6] text-[#374A8C]"
                    : "text-slate-700 hover:bg-[#F4F5F6] hover:text-[#314cae]"
                    }`}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                >
                  {opt.toString().padStart(2, "0")}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};


