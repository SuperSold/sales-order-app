import { useState, useMemo, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const createEmptyLine = () => ({
  itemId: "",
  itemCode: "",
  description: "",
  quantity: 1,
  price: 0,
  taxRate: 15,
});

export default function SalesOrderFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [clients, setClients] = useState([]);
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [clientId, setClientId] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const [orderDate, setOrderDate] = useState(
    () => new Date().toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState("");

  const [lines, setLines] = useState([createEmptyLine()]);

 
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [clientsRes, itemsRes] = await Promise.all([
          api.get("/clients"),
          api.get("/items"),
        ]);

        setClients(clientsRes.data || []);
        setItems(itemsRes.data || []);

        if (isEdit) {
          const orderRes = await api.get(`/salesorders/${id}`);
          const data = orderRes.data;

          setClientId(String(data.clientId));
          setOrderDate(data.orderDate.slice(0, 10));
          setNotes(data.notes || "");

          setLines(
            (data.lines || []).map((l) => ({
              itemId: String(l.itemId),
              itemCode: "",
              description: l.description || "",
              quantity: l.quantity,
              price: l.price,
              taxRate: l.taxRate,
            }))
          );

          
          const client = (clientsRes.data || []).find(
            (c) => c.clientId === data.clientId
          );
          if (client) {
            setAddressLine1(client.addressLine1 || "");
            setAddressLine2(client.addressLine2 || "");
            setCity(client.city || "");
            setContactNumber(client.contactNumber || "");
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load data from server.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isEdit]);

  
  const handleClientChange = (e) => {
    const selectedId = e.target.value;
    setClientId(selectedId);

    const client = clients.find((c) => c.clientId.toString() === selectedId);
    if (client) {
      setAddressLine1(client.addressLine1 || "");
      setAddressLine2(client.addressLine2 || "");
      setCity(client.city || "");
      setContactNumber(client.contactNumber || "");
    } else {
      setAddressLine1("");
      setAddressLine2("");
      setCity("");
      setContactNumber("");
    }
  };

  const handleLineChange = (index, field, value) => {
    setLines((prev) => {
      const copy = [...prev];
      const line = { ...copy[index] };

      if (field === "itemId") {
        line.itemId = value;
        const item = items.find((i) => i.itemId.toString() === value);
        if (item) {
          line.itemCode = item.code;
          line.description = item.description;
          line.price = item.price;
        } else {
          line.itemCode = "";
          line.description = "";
          line.price = 0;
        }
      } else if (field === "quantity" || field === "price" || field === "taxRate") {
        line[field] = value === "" ? "" : Number(value);
      } else {
        line[field] = value;
      }

      copy[index] = line;
      return copy;
    });
  };

  const addLine = () => {
    setLines((prev) => [...prev, createEmptyLine()]);
  };

  const removeLine = (index) => {
    setLines((prev) => prev.filter((_, i) => i !== index));
  };

  const totals = useMemo(() => {
    let totalExcl = 0;
    let totalTax = 0;
    let totalIncl = 0;

    for (const line of lines) {
      const qty = Number(line.quantity) || 0;
      const price = Number(line.price) || 0;
      const taxRate = Number(line.taxRate) || 0;

      const excl = qty * price;
      const tax = (excl * taxRate) / 100;
      const incl = excl + tax;

      totalExcl += excl;
      totalTax += tax;
      totalIncl += incl;
    }

    return { totalExcl, totalTax, totalIncl };
  }, [lines]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clientId) {
      alert("Please select a client.");
      return;
    }

    if (!lines.length || lines.some((l) => !l.itemId)) {
      alert("Please select at least one item.");
      return;
    }

    const payload = {
      clientId: Number(clientId),
      orderDate,
      notes,
      addressLine1,
      addressLine2,
      city,
      contactNumber,
      lines: lines.map((l) => ({
        itemId: Number(l.itemId),
        quantity: Number(l.quantity) || 0,
        price: Number(l.price) || 0,
        taxRate: Number(l.taxRate) || 0,
        description: l.description,
      })),
    };

    try {
      setSaving(true);
      let res;
      if (isEdit) {
        res = await api.put(`/salesorders/${id}`, payload);
        alert(`Order updated. Order Number: ${res.data.orderNumber}`);
      } else {
        res = await api.post("/salesorders", payload);
        alert(`Order saved. Order Number: ${res.data.orderNumber}`);
      }

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to save order. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-slate-600 text-sm">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600 text-sm mb-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
     
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          {isEdit ? "Edit Sales Order" : "New Sales Order"}
        </h1>
        <Link
          to="/"
          className="px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 hover:bg-slate-50"
        >
          ← Home
        </Link>
      </div>

      
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm p-6 space-y-6"
      >
        
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Customer
            </label>
            <select
              value={clientId}
              onChange={handleClientChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select customer</option>
              {clients.map((client) => (
                <option key={client.clientId} value={client.clientId}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Order Date
            </label>
            <input
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-slate-50"
            />
          </div>
        </div>

        {/* Address */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Address Line 1
            </label>
            <input
              type="text"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Address Line 2
            </label>
            <input
              type="text"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contact No
            </label>
            <input
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Lines table */}
        {/* (same as before, unchanged) */}
        {/* ... keep your existing lines table & totals & buttons, they’re already correct ... */}

        {/* Lines table */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-slate-700">
              Order 
            </h2>
            <button
              type="button"
              onClick={addLine}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700"
            >
              + Add item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="px-2 py-2 text-left">Item</th>
                  <th className="px-2 py-2 text-left">Description</th>
                  <th className="px-2 py-2 text-right">Qty</th>
                  <th className="px-2 py-2 text-right">Price</th>
                  <th className="px-2 py-2 text-right">Tax %</th>
                  <th className="px-2 py-2 text-right">Excl</th>
                  <th className="px-2 py-2 text-right">Tax</th>
                  <th className="px-2 py-2 text-right">Incl</th>
                  <th className="px-2 py-2 text-center">#</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, index) => {
                  const qty = Number(line.quantity) || 0;
                  const price = Number(line.price) || 0;
                  const taxRate = Number(line.taxRate) || 0;

                  const excl = qty * price;
                  const tax = (excl * taxRate) / 100;
                  const incl = excl + tax;

                  return (
                    <tr key={index} className="border-b">
                      <td className="px-2 py-1">
                        <select
                          value={line.itemId}
                          onChange={(e) =>
                            handleLineChange(index, "itemId", e.target.value)
                          }
                          className="w-full rounded border border-slate-300 px-2 py-1"
                        >
                          <option value="">Select item</option>
                          {items.map((item) => (
                            <option key={item.itemId} value={item.itemId}>
                              {item.code}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-1">
                        <input
                          type="text"
                          value={line.description}
                          onChange={(e) =>
                            handleLineChange(index, "description", e.target.value)
                          }
                          className="w-full rounded border border-slate-300 px-2 py-1"
                        />
                      </td>
                      <td className="px-2 py-1 text-right">
                        <input
                          type="number"
                          min="0"
                          value={line.quantity}
                          onChange={(e) =>
                            handleLineChange(index, "quantity", e.target.value)
                          }
                          className="w-20 text-right rounded border border-slate-300 px-2 py-1"
                        />
                      </td>
                      <td className="px-2 py-1 text-right">
                        <input
                          type="number"
                          min="0"
                          value={line.price}
                          onChange={(e) =>
                            handleLineChange(index, "price", e.target.value)
                          }
                          className="w-24 text-right rounded border border-slate-300 px-2 py-1"
                        />
                      </td>
                      <td className="px-2 py-1 text-right">
                        <input
                          type="number"
                          min="0"
                          value={line.taxRate}
                          onChange={(e) =>
                            handleLineChange(index, "taxRate", e.target.value)
                          }
                          className="w-16 text-right rounded border border-slate-300 px-2 py-1"
                        />
                      </td>
                      <td className="px-2 py-1 text-right">
                        {excl.toFixed(2)}
                      </td>
                      <td className="px-2 py-1 text-right">
                        {tax.toFixed(2)}
                      </td>
                      <td className="px-2 py-1 text-right">
                        {incl.toFixed(2)}
                      </td>
                      <td className="px-2 py-1 text-center">
                        {lines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLine(index)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        
        <div className="grid md:grid-cols-[2fr,1fr] gap-6 items-start">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Total Excl</span>
              <span className="font-semibold">
                {totals.totalExcl.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Total Tax</span>
              <span className="font-semibold">
                {totals.totalTax.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-slate-800 font-semibold">Total Incl</span>
              <span className="font-semibold text-emerald-700">
                {totals.totalIncl.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 hover:bg-slate-50"
            disabled={saving}
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
            disabled={saving}
          >
            {isEdit ? "Update Order" : "Save Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
