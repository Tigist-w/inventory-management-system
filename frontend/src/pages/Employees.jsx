import React, { useEffect, useState } from "react";
import API from "../services/api";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import EmployeeModal from "../components/EmployeeModal";

const Employees = ({ searchTerm }) => {
  const [employees, setEmployees] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployees = async () => {
    const res = await API.get("/employees");
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ✅ Safe filtering (fixes toLowerCase error)
  const filteredEmployees = employees.filter((emp) => {
    const name = emp?.name ? emp.name.toLowerCase() : "";
    const term = searchTerm ? searchTerm.toLowerCase() : "";
    return name.includes(term);
  });

  const handleDeleteClick = (emp) => {
    setEmployeeToDelete(emp);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await API.delete(`/employees/${employeeToDelete._id}`);
    fetchEmployees();
    setDeleteModalOpen(false);
  };

  const handleAdd = () => {
    setSelectedEmployee(null);
    setModalOpen(true);
  };

  const handleEdit = (emp) => {
    setSelectedEmployee(emp);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">Employees</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 rounded text-white hover:bg-green-600"
        >
          Add Employee
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.position}</td>
                <td>{emp.phone}</td>
                <td>{emp.email}</td>
                <td>{emp.salary}</td>
                <td className="flex gap-2">
                  <button
                    onClick={() => handleEdit(emp)}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(emp)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <EmployeeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={fetchEmployees}
        employee={selectedEmployee}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={employeeToDelete?.name}
      />
    </div>
  );
};

export default Employees;
