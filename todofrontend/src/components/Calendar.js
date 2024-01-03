import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
} from "date-fns";

const Calendar = ({ selectedDate, onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const handleDateClick = (day) => {
    onSelectDate(day);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      (prevMonth) => new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      (nextMonth) => new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1)
    );
  };

  const handlePrevYear = () => {
    setCurrentMonth(
      (prevMonth) =>
        new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 12)
    );
  };

  const handleNextYear = () => {
    setCurrentMonth(
      (nextMonth) =>
        new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 12)
    );
  };

  return (
    <div className="calendar-section">
      <div className="calendar-header">
        <a onClick={handlePrevMonth}>{"<"}</a>
        <a onClick={handlePrevYear}>{"<<"}</a>
        <h3>{format(currentMonth, "MMMM yyyy")}</h3>
        <a onClick={handleNextYear}>{">>"}</a>
        <a onClick={handleNextMonth}>{">"}</a>
      </div>
      <div className="calendar-grid">
        {daysInMonth.map((day) => (
          <div
            key={day.toISOString()}
            className={`calendar-day ${
              isSameMonth(day, currentMonth) ? "current-month" : "other-month"
            }`}
            onClick={() => handleDateClick(day)}
          >
            {format(day, "d")}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
