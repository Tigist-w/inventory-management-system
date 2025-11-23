import Employee from "../models/Employee.js"; // use .js extension

// GET all employees
export const getEmployees = async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
};

// CREATE employee
export const createEmployee = async (req, res) => {
  const emp = new Employee(req.body);
  await emp.save();
  res.json(emp);
};

// UPDATE employee
export const updateEmployee = async (req, res) => {
  const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

// DELETE employee
export const deleteEmployee = async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ message: "Employee deleted" });
};
