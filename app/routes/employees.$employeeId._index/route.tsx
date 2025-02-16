import {
  Form,
  redirect,
  useLoaderData,
  type LoaderFunction,
  type ActionFunction,
} from "react-router";
import { getDB } from "~/db/getDB";
import { uploadFile } from "~/utils/fileUpload"; // Utility function for handling uploads

export const loader: LoaderFunction = async ({ params }) => {
  const db = await getDB();
  const employee = await db.get("SELECT * FROM employees WHERE id = ?", [
    params.employeeId,
  ]);
  if (!employee) throw new Response("Not Found", { status: 404 });
  return employee;
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();

  const full_name = formData.get("full_name");
  const email = formData.get("email");
  const phone_number = formData.get("phone_number");
  const date_of_birth = formData.get("date_of_birth");
  const job_title = formData.get("job_title");
  const department = formData.get("department");
  const salary = formData.get("salary");
  const start_date = formData.get("start_date");
  const end_date = formData.get("end_date");

  // Handle file uploads
  const photo = formData.get("photo_path") as File;
  const document = formData.get("document_path") as File;

  let photo_path = null;
  let document_path = null;

  if (photo && photo.size > 0) {
    photo_path = await uploadFile(photo, "photos/");
  }
  if (document && document.size > 0) {
    document_path = await uploadFile(document, "documents/");
  }

  const db = await getDB();
  await db.run(
    `UPDATE employees 
    SET full_name = ?, email = ?, phone_number = ?, date_of_birth = ?, 
        job_title = ?, department = ?, salary = ?, start_date = ?, end_date = ?,
        photo_path = COALESCE(?, photo_path), document_path = COALESCE(?, document_path)
    WHERE id = ?`,
    [
      full_name,
      email,
      phone_number,
      date_of_birth,
      job_title,
      department,
      salary,
      start_date,
      end_date,
      photo_path,
      document_path,
      params.employeeId,
    ]
  );

  return redirect("/employees");
};

export default function EditEmployeePage() {
  const employee = useLoaderData();

  return (
    <div>
      <h1>Edit Employee</h1>
      <Form method="post" encType="multipart/form-data">
        <div>
          <label htmlFor="full_name">Full Name</label>
          <input
            type="text"
            name="full_name"
            id="full_name"
            defaultValue={employee.full_name}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            defaultValue={employee.email}
            required
          />
        </div>
        <div>
          <label htmlFor="phone_number">Phone Number</label>
          <input
            type="tel"
            name="phone_number"
            id="phone_number"
            defaultValue={employee.phone_number}
            required
          />
        </div>
        <div>
          <label htmlFor="date_of_birth">Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            id="date_of_birth"
            defaultValue={employee.date_of_birth}
            required
          />
        </div>
        <div>
          <label htmlFor="job_title">Job Title</label>
          <input
            type="text"
            name="job_title"
            id="job_title"
            defaultValue={employee.job_title}
            required
          />
        </div>
        <div>
          <label htmlFor="department">Department</label>
          <input
            type="text"
            name="department"
            id="department"
            defaultValue={employee.department}
            required
          />
        </div>
        <div>
          <label htmlFor="salary">Salary</label>
          <input
            type="number"
            name="salary"
            id="salary"
            defaultValue={employee.salary}
            required
          />
        </div>
        <div>
          <label htmlFor="start_date">Start Date</label>
          <input
            type="date"
            name="start_date"
            id="start_date"
            defaultValue={employee.start_date}
            required
          />
        </div>
        <div>
          <label htmlFor="end_date">End Date</label>
          <input
            type="date"
            name="end_date"
            id="end_date"
            defaultValue={employee.end_date}
          />
        </div>
        <div>
          <label htmlFor="photo_path">Photo</label>
          <input type="file" name="photo_path" id="photo_path" />
          {employee.photo_path && (
            <div>
              <img src={employee.photo_path} alt="Employee Photo" width="100" />
            </div>
          )}
        </div>
        <div>
          <label htmlFor="document_path">Document</label>
          <input type="file" name="document_path" id="document_path" />
          {employee.document_path && (
            <p>
              Current Document:{" "}
              <a href={employee.document_path} target="_blank">
                View
              </a>
            </p>
          )}
        </div>
        <button type="submit">Update Employee</button>
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
