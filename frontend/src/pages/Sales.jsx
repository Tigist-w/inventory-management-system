import React, { useEffect, useState } from "react";
import API from "../services/api";
import Pagination from "../components/Pagination";
import SaleModal from "../components/SaleModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);

  const fetchData = async () => {
    try {
      const [salesRes, productsRes, customersRes] = await Promise.all([
        API.get("/sales"),
        API.get("/products"),
        API.get("/customers"),
      ]);

      setSales(salesRes.data);
      setProducts(productsRes.data);
      setCustomers(customersRes.data);
    } catch (error) {
      console.error("Fetch sales data error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleModalSave = (newSale) => {
    if (selectedSale) {
      setSales((prev) =>
        prev.map((s) => (s._id === newSale._id ? newSale : s))
      );
    } else {
      setSales((prev) => [newSale, ...prev]);
    }
  };

  const handleAdd = () => {
    setSelectedSale(null);
    setModalOpen(true);
  };

  const handleEdit = (sale) => {
    setSelectedSale(sale);
    setModalOpen(true);
  };

  const handleDeleteClick = (sale) => {
    setSaleToDelete(sale);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await API.delete(`/sales/${saleToDelete._id}`);
      setSales((prev) => prev.filter((s) => s._id !== saleToDelete._id));
      setDeleteModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-gray-700">Sales</h2>
        <button
          onClick={handleAdd}
          className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
        >
          + Add Sale
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="table-head">Product</th>
              <th className="table-head">Customer</th>
              <th className="table-head">Quantity</th>
              <th className="table-head">Price</th>
              <th className="table-head">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.map((s) => (
              <tr key={s._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-3">{s.product?.name}</td>
                <td className="px-6 py-3">{s.customer?.name}</td>
                <td className="px-6 py-3">{s.quantity}</td>
                <td className="px-6 py-3">{s.price}</td>
                <td className="px-6 py-3 flex gap-3">
                  <button
                    onClick={() => handleEdit(s)}
                    className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(s)}
                    className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SaleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleModalSave}
        sale={selectedSale}
        products={products}
        customers={customers}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={saleToDelete?.product?.name}
      />
    </div>
  );
};

export default Sales;
