import { Button } from "antd";
import {
  addDays,
  addMonths,
  addWeeks,
  format,
  getWeek,
  isPast,
  isSameDay,
  lastDayOfWeek,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import { useState } from "react";
import "./styles.css";

const WeekCalendar = ({ showDetailsHandle }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(getWeek(currentMonth));
  const [selectedDate, setSelectedDate] = useState(new Date());

  const changeMonthHandle = (btnType) => {
    if (btnType === "prev") {
      setCurrentMonth(subMonths(currentMonth, 1));
    }
    if (btnType === "next") {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
  };

  const changeWeekHandle = (btnType) => {
    //console.log("current week", currentWeek);
    if (btnType === "prev") {
      //console.log(subWeeks(currentMonth, 1));
      setCurrentMonth(subWeeks(currentMonth, 1));
      setCurrentWeek(getWeek(subWeeks(currentMonth, 1)));
    }
    if (btnType === "next") {
      //console.log(addWeeks(currentMonth, 1));
      setCurrentMonth(addWeeks(currentMonth, 1));
      setCurrentWeek(getWeek(addWeeks(currentMonth, 1)));
    }
  };

  const onDateClickHandle = (day, dayStr) => {
    console.log({ day, dayStr });
    setSelectedDate(day);
    showDetailsHandle(dayStr);
  };

  const renderHeader = () => {
    const dateFormat = "MMM yyyy";
    // console.log("selected day", selectedDate);
    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          {/* <div className="icon" onClick={() => changeMonthHandle("prev")}>
            prev month
          </div> */}
          <Button
            className="icon"
            style={{ margin: 5 }}
            type="primary"
            onClick={() => changeWeekHandle("prev")}
          >
            Prev week
          </Button>
        </div>
        <div className="col col-center">
          <span>{format(currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end">
          <Button
            className="icon"
            style={{ margin: 5 }}
            type="primary"
            onClick={() => changeWeekHandle("next")}
          >
            Next week
          </Button>
          {/* <div className="icon" onClick={() => changeMonthHandle("next")}>next month</div> */}
        </div>
      </div>
    );
  };
  const renderDays = () => {
    const dateFormat = "EEE";
    const days = [];
    let startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="days row">{days}</div>;
  };
  const renderCells = () => {
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    const endDate = lastDayOfWeek(currentMonth, { weekStartsOn: 1 });
    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`col cell ${
              isSameDay(day, new Date())
                ? "today"
                : isSameDay(day, selectedDate)
                ? "selected"
                : ""
            }`}
            style={{
              backgroundColor: !isPast(cloneDay)
                ? "white"
                : isSameDay(cloneDay, new Date())
                ? "white"
                : "#8080804d",
            }}
            key={day}
            onClick={() => {
              console.log("isPast(cloneDay): =>" + isPast(cloneDay));
              console.log(
                "isSameDay(day, selectedDate): =>" +
                  isSameDay(cloneDay, new Date())
              );
              if (isSameDay(cloneDay, new Date()) || !isPast(cloneDay)) {
                const dayStr = format(cloneDay, "dd MMM YYY");
                onDateClickHandle(cloneDay, dayStr);
              }
            }}
          >
            <span className="number">{formattedDate}</span>
            <span className="bg">{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  };
  const renderFooter = () => {
    const dateFormat = "MMM yyyy";
    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <Button
            className="icon"
            style={{ margin: 5 }}
            type="primary"
            onClick={() => changeWeekHandle("prev")}
          >
            Prev week
          </Button>
        </div>
        {/* <div>{currentWeek}</div> */}
        <div className="col col-center">
          <span>{format(currentMonth, dateFormat)}</span>
        </div>
        <Button
          className="icon"
          style={{ margin: 5 }}
          type="primary"
          onClick={() => changeWeekHandle("next")}
        >
          Next week
        </Button>
      </div>
    );
  };
  return (
    <div className="calendar">
      {renderHeader()}
      {/* {renderFooter()} */}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default WeekCalendar;
/**
 * Header:
 * icon for switching to the previous month,
 * formatted date showing current month and year,
 * another icon for switching to next month
 * icons should also handle onClick events to change a month
 */
