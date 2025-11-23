import React, { useState, useEffect } from "react";
import API from "../services/api";
import SupplierModal from "../components/SupplierModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import Pagination from "../components/Pagination";

const Suppliers = ({ searchTerm }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  // ✅ Fetch suppliers (fixed correct API path)
  const fetchSuppliers = async () => {
    try {
      const res = await API.get("/suppliers");
      setSuppliers(res.data);
      setFilteredSuppliers(res.data);
    } catch (err) {
      console.error("Fetch suppliers error:", err);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // ✅ Search Filter (safe version)
  useEffect(() => {
    if (!searchTerm) {
      setFilteredSuppliers(suppliers);
      return;
    }

    const search = searchTerm.toLowerCase();

    const filtered = suppliers.filter((s) => {
      const name = s?.name?.toLowerCase() || "";
      const company = s?.companyName?.toLowerCase() || "";
      const phone = s?.phone?.toLowerCase() || "";
      return (
        name.includes(search) ||
        company.includes(search) ||
        phone.includes(search)
      );
    });

    setFilteredSuppliers(filtered);
    setCurrentPage(1);
  }, [searchTerm, suppliers]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(indexOfFirst, indexOfLast);

  // Button handlers
  const handleAdd = () => {
    setSelectedSupplier(null);
    setModalOpen(true);
  };

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setModalOpen(true);
  };

  const handleDeleteClick = (supplier) => {
    setSupplierToDelete(supplier);
    setDeleteModalOpen(true);
  };

  // ✅ Delete (fixed API route)
  const handleDeleteConfirm = async () => {
    try {
      await API.delete(`/suppliers/${supplierToDelete._id}`);
      fetchSuppliers();
      setDeleteModalOpen(false);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="mt-4">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-gray-700">Suppliers</h2>
        <button
          onClick={handleAdd}
          className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
        >
          + Add Supplier
        </button>
      </div>

      {/* Suppliers Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {currentSuppliers.map((supplier) => (
              <tr key={supplier._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-3 font-medium text-gray-800">
                  {supplier.name}
                </td>
                <td className="px-6 py-3 text-gray-700">
                  {supplier.companyName}
                </td>
                <td className="px-6 py-3 text-gray-700">{supplier.phone}</td>
                <td className="px-6 py-3 text-gray-700">{supplier.email}</td>

                <td className="px-6 py-3 flex gap-3">
                  <button
                    onClick={() => handleEdit(supplier)}
                    className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(supplier)}
                    className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {/* If no data */}
            {currentSuppliers.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 font-medium"
                >
                  No suppliers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        totalItems={filteredSuppliers.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Modals */}
      <SupplierModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={fetchSuppliers}
        supplier={selectedSupplier}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={supplierToDelete?.name}
      />
    </div>
  );
};

export default Suppliers;
