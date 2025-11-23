import React, { useState, useEffect } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

const PurchaseModal = ({
  isOpen,
  onClose,
  onSave,
  purchase,
  products,
  suppliers,
}) => {
  const [formData, setFormData] = useState({
    product: "",
    supplier: "",
    quantity: "",
    price: "",
  });

  useEffect(() => {
    if (purchase) {
      setFormData({
        product: purchase.product._id || purchase.product,
        supplier: purchase.supplier._id || purchase.supplier,
        quantity: purchase.quantity,
        price: purchase.price,
      });
    } else {
      setFormData({
        product: "",
        supplier: "",
        quantity: "",
        price: "",
      });
    }
  }, [purchase]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.product || !formData.supplier) {
      toast.error("Please select a product and supplier");
      return;
    }

    const payload = {
      product: formData.product,
      supplier: formData.supplier,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
    };

    try {
      let res;
      if (purchase) {
        res = await API.put(`/purchases/${purchase._id}`, payload);
        toast.success("Purchase updated");
      } else {
        res = await API.post("/purchases", payload);
        toast.success("Purchase added");
      }

      onSave(res.data); // pass new/updated purchase to parent
      onClose();
    } catch (error) {
      toast.error("Failed to save purchase");
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          {purchase ? "Edit Purchase" : "Add Purchase"}
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
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
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
            {purchase ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
