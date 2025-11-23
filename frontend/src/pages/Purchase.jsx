import React, { useEffect, useState } from "react";
import API from "../services/api";
import Pagination from "../components/Pagination";
import PurchaseModal from "../components/PurchaseModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

const Purchase = () => {
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch all data
  const fetchData = async () => {
    try {
      const [purchaseRes, productRes, supplierRes] = await Promise.all([
        API.get("/purchases"),
        API.get("/products"),
        API.get("/suppliers"),
      ]);
      setPurchases(purchaseRes.data.reverse()); // latest first
      setProducts(productRes.data);
      setSuppliers(supplierRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setSelectedPurchase(null);
    setModalOpen(true);
  };

  const handleEdit = (purchase) => {
    setSelectedPurchase(purchase);
    setModalOpen(true);
  };

  const handleDeleteClick = (purchase) => {
    setPurchaseToDelete(purchase);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await API.delete(`/purchases/${purchaseToDelete._id}`);
      setPurchases((prev) =>
        prev.filter((p) => p._id !== purchaseToDelete._id)
      );
      setDeleteModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleModalSave = (newPurchase) => {
    if (selectedPurchase) {
      setPurchases((prev) =>
        prev.map((p) => (p._id === newPurchase._id ? newPurchase : p))
      );
    } else {
      setPurchases((prev) => [newPurchase, ...prev]);
    }
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentPurchases = purchases.slice(indexOfFirst, indexOfLast);

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Purchases</h2>
        <button
          onClick={handleAdd}
          className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          + Add Purchase
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="table-head">Product</th>
              <th className="table-head">Supplier</th>
              <th className="table-head">Quantity</th>
              <th className="table-head">Price</th>
              <th className="table-head">Date</th>
              <th className="table-head">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentPurchases.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-3">{p.product?.name}</td>
                <td className="px-6 py-3">{p.supplier?.name}</td>
                <td className="px-6 py-3">{p.quantity}</td>
                <td className="px-6 py-3">{p.price}</td>
                <td className="px-6 py-3">
                  {new Date(p.purchaseDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-3 flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleEdit(p)}
                    className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(p)}
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

      <Pagination
        totalItems={purchases.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <PurchaseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleModalSave}
        purchase={selectedPurchase}
        products={products}
        suppliers={suppliers}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={purchaseToDelete?.product?.name}
      />
    </div>
  );
};

export default Purchase;
