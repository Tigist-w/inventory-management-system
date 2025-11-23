import React, { useState, useEffect } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

const EmployeeModal = ({ isOpen, onClose, onSave, employee }) => {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    phone: "",
    email: "",
    salary: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employee) {
      // copy specific fields to avoid extra props
      setFormData({
        name: employee.name || "",
        position: employee.position || "",
        phone: employee.phone || "",
        email: employee.email || "",
        salary: employee.salary ?? "",
      });
    } else {
      setFormData({ name: "", position: "", phone: "", email: "", salary: "" });
    }
  }, [employee, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    if (!formData.name.trim()) return "Name is required";
    if (!formData.position.trim()) return "Position is required";
    // optional: phone/email pattern checks
    return null;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    setLoading(true);
    try {
      if (employee && employee._id) {
        console.debug("Updating employee:", employee._id, formData);
        const res = await API.put(`/employees/${employee._id}`, formData);
        console.debug("Update response:", res.data);
        toast.success("Employee updated");
      } else {
        console.debug("Creating employee:", formData);
        const res = await API.post("/employees", formData);
        console.debug("Create response:", res.data);
        toast.success("Employee created");
      }
      if (typeof onSave === "function") await onSave();
      onClose();
    } catch (error) {
      console.error("Employee save error:", error);
      const msg =
        error?.response?.data?.message || error.message || "Save failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4">
          {employee ? "Edit Employee" : "Add Employee"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="input-field"
            required
          />
          <input
            name="position"
            value={formData.position}
            onChange={handleChange}
            placeholder="Position"
            className="input-field"
            required
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="input-field"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="input-field"
            type="email"
          />
          <input
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="Salary"
            className="input-field col-span-1"
            type="number"
            min="0"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white ${
              loading ? "bg-indigo-300" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Saving..." : employee ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeModal;
