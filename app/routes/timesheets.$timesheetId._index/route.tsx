import {
  Form,
  redirect,
  useLoaderData,
  type LoaderFunction,
  type ActionFunction,
} from "react-router";
import { getDB } from "~/db/getDB";

export const loader: LoaderFunction = async ({ params }) => {
  const db = await getDB();
  const timesheet = await db.get("SELECT * FROM timesheets WHERE id = ?", [
    params.timesheetId,
  ]);
  if (!timesheet) throw new Response("Not Found", { status: 404 });
  return timesheet;
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const employee_id = formData.get("employee_id");
  const start_time = formData.get("start_time");
  const end_time = formData.get("end_time");
  const summary = formData.get("summary");

  const db = await getDB();
  await db.run(
    "UPDATE timesheets SET employee_id = ?, start_time = ?, end_time = ?, summary = ? WHERE id = ?",
    [employee_id, start_time, end_time, summary, params.timesheetId]
  );

  return redirect("/timesheets");
};

export default function EditTimesheetPage() {
  const timesheet = useLoaderData();

  return (
    <div>
      <h1>Edit Timesheet</h1>
      <Form method="post">
        <div>
          <label htmlFor="employee_id">Employee ID</label>
          <input
            type="text"
            name="employee_id"
            id="employee_id"
            defaultValue={timesheet.employee_id}
            required
          />
        </div>
        <div>
          <label htmlFor="start_time">Start Time</label>
          <input
            type="datetime"
            name="start_time"
            id="start_time"
            defaultValue={timesheet.start_time}
            required
          />
        </div>
        <div>
          <label htmlFor="end_time">End Time</label>
          <input
            type="datetime"
            name="end_time"
            id="end_time"
            defaultValue={timesheet.end_time}
            required
          />
        </div>
        <div>
          <label htmlFor="summary">Summary</label>
          <input
            type="text"
            name="summary"
            id="summary"
            defaultValue={timesheet.summary}
            required
          />
        </div>

        <button type="submit">Update Timesheet</button>
      </Form>
      <hr />
      <ul>
        <li>
          <a href="/employees">Employees</a>
        </li>
        <li>
          <a href="/timesheets">Timesheets</a>
        </li>
      </ul>
    </div>
  );
}
