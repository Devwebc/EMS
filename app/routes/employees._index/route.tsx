import type {
  Key,
  ReactElement,
  JSXElementConstructor,
  ReactNode,
} from "react";
import {
  useLoaderData,
  Link,
  type LoaderFunction,
  type ActionFunction,
  redirect,
} from "react-router";
import { getDB } from "~/db/getDB";

interface Employee {
  id: Key | null | undefined;
  full_name: string | null | undefined;
  job_title: string | null | undefined;
  department: string | null | undefined;
  salary: string | number | null | undefined;
}

export const loader: LoaderFunction = async () => {
  const db = await getDB();
  const employees = await db.all(
    "SELECT id, full_name, job_title, department, salary FROM employees"
  );
  return employees;
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const employee_id = formData.get("employee_id");

  if (!employee_id) {
    return new Response("Employee ID is required", { status: 400 });
  }

  const db = await getDB();
  await db.run("DELETE FROM employees WHERE id = ?", [employee_id]);

  return redirect("/employees");
};

const deleteEmployee = async (id: Key | null | undefined) => {
  if (!id) return;

  const formData = new FormData();
  formData.append("employee_id", id.toString());

  const response = await fetch("/employees", {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    // Redirect or update the UI after successful deletion
    window.location.reload();
  } else {
    // Handle error (e.g., show a message to the user)
    alert("Error deleting employee");
  }
};

export default function EmployeesListPage() {
  const employees = useLoaderData<Employee[]>();

  return (
    <div>
      <h1>Employees</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Job Title</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.full_name}</td>
              <td>{employee.job_title}</td>
              <td>{employee.department}</td>
              <td>{employee.salary}</td>
              <td>
                <Link to={`/employees/${employee.id}`}>View and Edit</Link>
              </td>
              <td>
                <button onClick={() => deleteEmployee(employee.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
      <Link to="/employees/new">Create New Employee</Link>
      <br />
      <Link to="/timesheets">View Timesheets</Link>
    </div>
  );
}
