import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function HomePage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get("/salesorders");
        setOrders(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load sales orders from server.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Home
          </h1>
          <p className="text-slate-500 text-sm">
            View existing orders or create a new one.
          </p>
        </div>
        <Link
          to="/orders/new"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          + New Sales Order
        </Link>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        {loading && (
          <p className="text-slate-600 text-sm">Loading orders...</p>
        )}

        {error && !loading && (
          <div>
            <p className="text-red-600 text-sm mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <p className="text-slate-500 text-sm">
            No orders found. Click &quot;New Sales Order&quot; to create one.
          </p>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="px-3 py-2 text-left">Order No</th>
                  <th className="px-3 py-2 text-left">Client</th>
                  <th className="px-3 py-2 text-left">Order Date</th>
                  <th className="px-3 py-2 text-right">Total Excl</th>
                  <th className="px-3 py-2 text-right">Total Tax</th>
                  <th className="px-3 py-2 text-right">Total Incl</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o.salesOrderId}
                    className="border-b hover:bg-slate-50"
                    onDoubleClick={() => navigate(`/orders/${o.salesOrderId}`)}
                  >
                    <td className="px-3 py-2">{o.orderNumber}</td>
                    <td className="px-3 py-2">{o.clientName}</td>
                    <td className="px-3 py-2">
                      {o.orderDate
                        ? new Date(o.orderDate).toLocaleDateString()
                        : ""}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {o.totalExcl.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {o.totalTax.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {o.totalIncl.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
