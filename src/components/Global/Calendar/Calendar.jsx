import { useState, useEffect, useMemo } from "react";
import icons from "~/assets/js/icons";

const Calendar = ({ defaultDate, onDateSelect = console.log, options = {} }) => {
  const {
    prevYearIcon = icons.chevronLeftDouble,
    prevMonthIcon = icons.chevronLeft,
    nextMonthIcon = icons.chevronRight,
    nextYearIcon = icons.chevronRightDouble,
    displayMonthFormat = "long",
    displayYearFormat = "numeric",
  } = options;
  const today = useMemo(() => (defaultDate ? new Date(defaultDate) : new Date()), [defaultDate]);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today);

  useEffect(() => {
    setSelectedDate(today);
    console.log(today);
  }, [today]);

  const generateCalendar = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const calendarDays = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="text-center"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentYear, currentMonth, day);
      const isSelectedDate =
        selectedDate &&
        selectedDate.getFullYear() === currentYear &&
        selectedDate.getMonth() === currentMonth &&
        selectedDate.getDate() === day;

      calendarDays.push(
        <div
          key={`day-${day}`}
          className={`text-center py-2 border text-sm font-medium rounded cursor-pointer ${isSelectedDate ? "bg-primary text-white" : ""}`}
          onClick={() => handleDateClick(currentDate)}
        >
          {day}
        </div>
      );
    }

    return (
      <>
        {daysOfWeek.map((day) => (
          <div key={`header-${day}`} className="text-center text-sm font-semibold">
            {day}
          </div>
        ))}
        {calendarDays}
      </>
    );
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  const prevMonth = () => {
    setCurrentMonth((prevMonth) => prevMonth - 1);
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prevYear) => prevYear - 1);
    }
  };

  const nextMonth = () => {
    setCurrentMonth((prevMonth) => prevMonth + 1);
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prevYear) => prevYear + 1);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden h-full">
      <div className="flex items-center gap-4 px-4 py-3 bg-primary">
        <button className="text-white text-sm font-semibold" onClick={() => setCurrentYear((prevYear) => prevYear - 1)}>
          {prevYearIcon || "PY"}
        </button>
        <button className="text-white text-sm font-semibold" onClick={prevMonth}>
          {prevMonthIcon || "PM"}
        </button>
        <h2 className="text-white font-semibold flex-1 text-center">{`${new Date(
          currentYear,
          currentMonth
        ).toLocaleDateString("en-US", {
          month: displayMonthFormat,
          year: displayYearFormat,
        })}`}</h2>
        <button className="text-white text-sm font-semibold" onClick={nextMonth}>
          {nextMonthIcon || "NM"}
        </button>
        <button className="text-white text-sm font-semibold" onClick={() => setCurrentYear((prevYear) => prevYear + 1)}>
          {nextYearIcon || "NY"}
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 p-4">{generateCalendar()}</div>
    </div>
  );
};

export default Calendar;
