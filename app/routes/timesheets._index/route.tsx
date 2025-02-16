import { Link, useLoaderData } from "react-router";
import { useState, useEffect } from "react";
import { getDB } from "~/db/getDB";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewWeek,
  createViewMonthGrid,
  createViewMonthAgenda,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";

// Define the TypeScript type for timesheet data
type Timesheet = {
  id: number;
  employee_id: number;
  full_name: string;
  start_time: string;
  end_time: string;
};

export async function loader() {
  const db = await getDB();
  const timesheetsAndEmployees: Timesheet[] = await db.all(
    "SELECT timesheets.*, employees.full_name, employees.id AS employee_id FROM timesheets JOIN employees ON timesheets.employee_id = employees.id"
  );

  return { timesheetsAndEmployees };
}

export default function TimesheetsPage() {
  const { timesheetsAndEmployees } = useLoaderData() as {
    timesheetsAndEmployees: Timesheet[];
  };
  const [view, setView] = useState("table");

  const eventsService = useState(() => createEventsServicePlugin())[0];

  // Convert timesheets data to Schedule-X compatible event format
  const events = timesheetsAndEmployees
    .map((timesheet: Timesheet) => {
      const start = timesheet.start_time;
      const end = timesheet.end_time;

      if (isNaN(new Date(start).getTime()) || isNaN(new Date(end).getTime())) {
        console.error(
          "Invalid date format:",
          timesheet.start_time,
          timesheet.end_time
        );
        return null;
      }

      return {
        id: timesheet.id.toString(),
        title: `Timesheet #${timesheet.id} - ${timesheet.full_name}`,
        start,
        end,
      };
    })
    .filter((event) => event !== null); // Remove invalid entries

  const calendar = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    events,
    plugins: [eventsService],
  });

  useEffect(() => {
    eventsService.getAll();
  }, [eventsService]);

  return (
    <div>
      <div>
        <button onClick={() => setView("table")}>Table View</button>
        <button onClick={() => setView("calendar")}>Calendar View</button>
      </div>
      {view === "table" ? (
        <div>
          {timesheetsAndEmployees.map((timesheet: Timesheet) => (
            <div key={timesheet.id}>
              <ul>
                <li>Timesheet #{timesheet.id}</li>
                <ul>
                  <li>
                    Employee: {timesheet.full_name} (ID: {timesheet.employee_id}
                    )
                  </li>
                  <li>Start Time: {timesheet.start_time}</li>
                  <li>End Time: {timesheet.end_time}</li>
                  <li>
                    <Link to={`/timesheets/${timesheet.id}`}>Edit</Link>
                  </li>
                </ul>
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="sx-react-calendar-wrapper">
          <ScheduleXCalendar calendarApp={calendar} />
        </div>
      )}
      <hr />
      <ul>
        <li>
          <a href="/timesheets/new">New Timesheet</a>
        </li>
        <li>
          <a href="/employees">Employees</a>
        </li>
      </ul>
    </div>
  );
}
