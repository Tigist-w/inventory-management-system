import React, { useState, useEffect } from "react";
import API from "../services/api";

const SupplierModal = ({ isOpen, onClose, onSave, supplier }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (supplier) {
      setFormData(supplier);
    } else {
      setFormData({ name: "", email: "", phone: "", address: "" });
    }
  }, [supplier]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (supplier?._id) {
        // UPDATE
        await API.put(`/suppliers/${supplier._id}`, formData);
      } else {
        // CREATE
        await API.post("/suppliers", formData);
      }

      onSave(); // refresh table
      onClose(); // close modal
    } catch (err) {
      console.error("Save supplier error:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {supplier ? "Edit Supplier" : "Add Supplier"}
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 mb-3"
        />

        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName || ""}
          onChange={handleChange}
          className="w-full border p-2 mb-3"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border p-2 mb-3"
        />

        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 mb-3"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplierModal;
