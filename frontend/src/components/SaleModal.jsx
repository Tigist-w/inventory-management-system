import React, { useState, useEffect } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

const SaleModal = ({ isOpen, onClose, onSave, sale, products, customers }) => {
  const [formData, setFormData] = useState({
    product: "",
    customer: "",
    quantity: "",
    price: "",
  });

  useEffect(() => {
    if (sale) {
      setFormData({
        product: sale.product._id || sale.product,
        customer: sale.customer._id || sale.customer,
        quantity: sale.quantity,
        price: sale.price,
      });
    } else {
      setFormData({
        product: "",
        customer: "",
        quantity: "",
        price: "",
      });
    }
  }, [sale]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.product || !formData.customer) {
      toast.error("Please select a product and customer");
      return;
    }

    const payload = {
      product: formData.product,
      customer: formData.customer,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
    };

    try {
      let res;
      if (sale) {
        res = await API.put(`/sales/${sale._id}`, payload);
        toast.success("Sale updated");
      } else {
        res = await API.post("/sales", payload);
        toast.success("Sale added");
      }

      onSave(res.data); // pass new/updated sale to parent
      onClose();
    } catch (error) {
      toast.error("Failed to save sale");
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          {sale ? "Edit Sale" : "Add Sale"}
        </h2>

        <div className="space-y-4">
          <select
            name="product"
            value={formData.product}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.quantity}
            onChange={handleChange}
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            onClick={handleSave}
          >
            {sale ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaleModal;
