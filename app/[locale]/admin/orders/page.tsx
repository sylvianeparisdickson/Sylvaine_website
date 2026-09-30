"use client";
import { useState, useEffect } from "react";
import { supabase, type Order } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/routing";

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: "all",
    source: "all",
    country: "all",
    taxExempt: "all",
    international: "all",
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [updating, setUpdating] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  // Fetch orders when authenticated
  useEffect(() => {
    if (status === "authenticated") {
      fetchOrders();
    }
  }, [status]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter.status !== "all" && order.payment_status !== filter.status) return false;
    if (filter.source !== "all" && order.order_source !== filter.source) return false;
    if (filter.country !== "all" && order.country !== filter.country) return false;
    if (filter.taxExempt === "taxable" && order.tax_exempt) return false;
    if (filter.taxExempt === "exempt" && !order.tax_exempt) return false;
    if (filter.international === "domestic" && order.country !== "US") return false;
    if (filter.international === "international" && order.country === "US") return false;
    return true;
  });

  const handleUpdateStatus = async (orderId: string, newStatus: Order["payment_status"]) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: newStatus })
        .eq('id', orderId);
      
      if (error) throw error;
      await fetchOrders();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateTracking = async () => {
    if (!selectedOrder || !trackingNumber) return;
    
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          tracking_number: trackingNumber,
          payment_status: "shipped",
          date_shipped: new Date().toISOString()
        })
        .eq('id', selectedOrder.id);
      
      if (error) throw error;
      await fetchOrders();
      setSelectedOrder(null);
      setTrackingNumber("");
    } catch (error) {
      console.error("Failed to update tracking:", error);
      alert("Failed to update tracking number");
    } finally {
      setUpdating(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Order Number",
      "Date",
      "Customer Name",
      "Customer Email",
      "Customer Phone",
      "Product",
      "Price",
      "Tax Amount",
      "Tax Rate",
      "Tax Exempt",
      "Exemption Reason",
      "Shipping Cost",
      "Shipping Method",
      "Total",
      "Status",
      "Source",
      "Country",
      "Shipping Address",
      "Tracking Number",
      "Date Shipped",
      "HS Code",
      "Country of Origin",
      "Customs Notes",
    ];
    
    const rows = filteredOrders.map(order => [
      order.order_number || "",
      new Date(order.created_at || "").toLocaleDateString(),
      order.customer_name,
      order.customer_email,
      order.customer_phone || "",
      order.painting_title || order.description || "",
      order.price.toFixed(2),
      order.tax_amount.toFixed(2),
      order.tax_rate ? (order.tax_rate * 100).toFixed(2) + "%" : "",
      order.tax_exempt ? "Yes" : "No",
      order.exemption_reason || "",
      order.shipping_cost.toFixed(2),
      order.shipping_method || "",
      order.total_amount.toFixed(2),
      order.payment_status,
      order.order_source,
      order.country,
      order.shipping_address,
      order.tracking_number || "",
      order.date_shipped ? new Date(order.date_shipped).toLocaleDateString() : "",
      order.hs_code || "",
      order.country_of_origin || "",
      order.customs_notes || "",
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const getStatusColor = (status: Order["payment_status"]) => {
    switch (status) {
      case "paid": return "text-green-600";
      case "processing": return "text-blue-600";
      case "ready_to_ship": return "text-purple-600";
      case "shipped": return "text-orange-600";
      case "delivered": return "text-green-700";
      case "cancelled": return "text-red-600";
      case "refunded": return "text-gray-600";
      default: return "text-gray-500";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f5ef] p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-[#6a6560]">Loading orders...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5ef] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif italic text-[32px] md:text-[40px] text-[#1a1816] mb-2">
              Orders
            </h1>
            <p className="text-[11px] tracking-[.14em] uppercase text-[#9a9188]">
              Manage and track all sales
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              className="px-6 py-3 bg-[#1a1816] text-white text-[10px] tracking-[.18em] uppercase hover:bg-[#3a3836] transition-colors"
            >
              Export CSV
            </button>
            <button
              onClick={() => signOut({ redirectTo: "/admin/login" })}
              className="px-6 py-3 bg-transparent text-[#1a1816] text-[10px] tracking-[.18em] uppercase border border-black/20 hover:border-[#1a1816] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 md:p-6 mb-6 flex flex-wrap gap-4">
          <div>
            <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">
              Status
            </label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="px-4 py-2 bg-transparent border border-black/20 text-[13px] text-[#1a1816] outline-none focus:border-[#1a1816]"
            >
              <option value="all">All</option>
              <option value="pending_payment">Pending Payment</option>
              <option value="paid">Paid</option>
              <option value="processing">Processing</option>
              <option value="ready_to_ship">Ready to Ship</option>
              <option value="_shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">
              Source
            </label>
            <select
              value={filter.source}
              onChange={(e) => setFilter({ ...filter, source: e.target.value })}
              className="px-4 py-2 bg-transparent border border-black/20 text-[13px] text-[#1a1816] outline-none focus:border-[#1a1816]"
            >
              <option value="all">All</option>
              <option value="website">Website</option>
              <option value="studio">Studio</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">
              Country
            </label>
            <select
              value={filter.country}
              onChange={(e) => setFilter({ ...filter, country: e.target.value })}
              className="px-4 py-2 bg-transparent border border-black/20 text-[13px] text-[#1a1816] outline-none focus:border-[#1a1816]"
            >
              <option value="all">All</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="other">Other International</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">
              Tax Status
            </label>
            <select
              value={filter.taxExempt}
              onChange={(e) => setFilter({ ...filter, taxExempt: e.target.value })}
              className="px-4 py-2 bg-transparent border border-black/20 text-[13px] text-[#1a1816] outline-none focus:border-[#1a1816]"
            >
              <option value="all">All</option>
              <option value="taxable">Taxable</option>
              <option value="exempt">Tax Exempt</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">
              Order Type
            </label>
            <select
              value={filter.international}
              onChange={(e) => setFilter({ ...filter, international: e.target.value })}
              className="px-4 py-2 bg-transparent border border-black/20 text-[13px] text-[#1a1816] outline-none focus:border-[#1a1816]"
            >
              <option value="all">All</option>
              <option value="domestic">Domestic (US)</option>
              <option value="international">International</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left p-4 text-[10px] tracking-[.14em] uppercase text-[#9a9188]">
                  Order #
                </th>
                <th className="text-left p-4 text-[10px] tracking-[.14em] uppercase text-[#9a9188]">
                  Date
                </th>
                <th className="text-left p-4 text-[10px] tracking-[.14em] uppercase text-[#9a9188]">
                  Customer
                </th>
                <th className="text-left p-4 text-[10px] tracking-[.14em] uppercase text-[#9a9188]">
                  Product
                </th>
                <th className="text-right p-4 text-[10px] tracking-[.14em] uppercase text-[#9a9188]">
                  Total
                </th>
                <th className="text-left p-4 text-[10px] tracking-[.14em] uppercase text-[#9a9188]">
                  Status
                </th>
                <th className="text-left p-4 text-[10px] tracking-[.14em] uppercase text-[#9a9188]">
                  Source
                </th>
                <th className="text-left p-4 text-[10px] tracking-[.14em] uppercase text-[#9a9188]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-black/5 hover:bg-black/5">
                  <td className="p-4 text-[13px] text-[#1a1816] font-medium">
                    {order.order_number || order.id.slice(0, 8)}
                  </td>
                  <td className="p-4 text-[13px] text-[#6a6560]">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : ""}
                  </td>
                  <td className="p-4 text-[13px] text-[#1a1816]">
                    <div>
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-[11px] text-[#9a9188]">{order.customer_email}</p>
                    </div>
                  </td>
                  <td className="p-4 text-[13px] text-[#1a1816]">
                    {order.painting_title || order.description || "Custom"}
                  </td>
                  <td className="p-4 text-right text-[13px] text-[#1a1816] font-medium">
                    ${order.total_amount.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span className={`text-[11px] tracking-[.12em] uppercase ${getStatusColor(order.payment_status)}`}>
                      {order.payment_status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="p-4 text-[11px] tracking-[.12em] uppercase text-[#6a6560]">
                    {order.order_source}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1 text-[10px] tracking-[.12em] uppercase border border-black/20 hover:border-[#1a1816] transition-colors"
                      >
                        View
                      </button>
                      {order.payment_status === "paid" && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, "ready_to_ship")}
                          disabled={updating}
                          className="px-3 py-1 text-[10px] tracking-[.12em] uppercase bg-[#1a1816] text-white hover:bg-[#3a3836] transition-colors disabled:opacity-50"
                        >
                          Ready
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredOrders.length === 0 && (
            <div className="p-8 text-center text-[#6a6560]">
              No orders found matching the current filters.
            </div>
          )}
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,9,8,.9)" }}>
            <div className="bg-[#f8f5ef] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="font-serif italic text-[24px] text-[#1a1816] mb-2">
                    {selectedOrder.order_number || selectedOrder.id.slice(0, 8)}
                  </h2>
                  <p className="text-[11px] tracking-[.14em] uppercase text-[#9a9188]">
                    {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : ""}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-[#9a9188] hover:text-[#1a1816] text-[24px]"
                >
                  ×
                </button>
              </div>

              {/* Customer Info */}
              <div className="mb-6 pb-6 border-b border-black/10">
                <h3 className="text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-3">
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-[13px]">
                  <div>
                    <p className="text-[#6a6560]">Name</p>
                    <p className="text-[#1a1816]">{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-[#6a6560]">Email</p>
                    <p className="text-[#1a1816]">{selectedOrder.customer_email}</p>
                  </div>
                  {selectedOrder.customer_phone && (
                    <div>
                      <p className="text-[#6a6560]">Phone</p>
                      <p className="text-[#1a1816]">{selectedOrder.customer_phone}</p>
                    </div>
                  )}
                  <div className="col-span-2">
                    <p className="text-[#6a6560]">Shipping Address</p>
                    <p className="text-[#1a1816]">{selectedOrder.shipping_address}</p>
                    <p className="text-[#1a1816]">{selectedOrder.country}</p>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="mb-6 pb-6 border-b border-black/10">
                <h3 className="text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-3">
                  Product Information
                </h3>
                <div className="text-[13px]">
                  <p className="text-[#6a6560]">Product</p>
                  <p className="text-[#1a1816] font-medium mb-2">
                    {selectedOrder.painting_title || selectedOrder.description || "Custom Studio Purchase"}
                  </p>
                  {selectedOrder.painting_id && (
                    <>
                      <p className="text-[#6a6560]">Edition</p>
                      <p className="text-[#1a1816]">{selectedOrder.edition}</p>
                      <p className="text-[#6a6560]">Size</p>
                      <p className="text-[#1a1816]">{selectedOrder.size_label}</p>
                    </>
                  )}
                  <p className="text-[#6a6560] mt-2">Type</p>
                  <p className="text-[#1a1816] capitalize">{selectedOrder.product_type}</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-6 pb-6 border-b border-black/10">
                <h3 className="text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-3">
                  Pricing
                </h3>
                <div className="space-y-2 text-[13px]">
                  <div className="flex justify-between">
                    <span className="text-[#6a6560]">Product</span>
                    <span className="text-[#1a1816]">${selectedOrder.price.toFixed(2)}</span>
                  </div>
                  {selectedOrder.tax_amount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#6a6560]">
                        Sales Tax {selectedOrder.tax_rate ? `(${(selectedOrder.tax_rate * 100).toFixed(2)}%)` : ""}
                      </span>
                      <span className="text-[#1a1816]">${selectedOrder.tax_amount.toFixed(2)}</span>
                    </div>
                  )}
                  {selectedOrder.tax_exempt && (
                    <div className="flex justify-between text-green-600">
                      <span className="text-[#6a6560]">Tax Exempt</span>
                      <span className="text-[#1a1816]">Yes</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#6a6560]">Shipping ({selectedOrder.shipping_method || "Standard"})</span>
                    <span className="text-[#1a1816]">${selectedOrder.shipping_cost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t border-black/10">
                    <span className="text-[#1a1816]">Total</span>
                    <span className="text-[#1a1816]">${selectedOrder.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div className="mb-6 pb-6 border-b border-black/10">
                <h3 className="text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-3">
                  Shipping
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">
                      Status
                    </label>
                    <select
                      value={selectedOrder.payment_status}
                      onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value as Order["payment_status"])}
                      disabled={updating}
                      className="w-full px-4 py-2 bg-transparent border border-black/20 text-[13px] text-[#1a1816] outline-none focus:border-[#1a1816]"
                    >
                      <option value="pending_payment">Pending Payment</option>
                      <option value="paid">Paid</option>
                      <option value="processing">Processing</option>
                      <option value="ready_to_ship">Ready to Ship</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">
                      Tracking Number
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={trackingNumber || selectedOrder.tracking_number || ""}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Enter tracking number"
                        className="flex-1 px-4 py-2 bg-transparent border border-black/20 text-[13px] text-[#1a1816] outline-none focus:border-[#1a1816]"
                      />
                      <button
                        onClick={handleUpdateTracking}
                        disabled={updating || !trackingNumber}
                        className="px-4 py-2 bg-[#1a1816] text-white text-[10px] tracking-[.12em] uppercase hover:bg-[#3a3836] transition-colors disabled:opacity-50"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                  {selectedOrder.date_shipped && (
                    <div>
                      <p className="text-[#6a6560]">Date Shipped</p>
                      <p className="text-[#1a1816]">{new Date(selectedOrder.date_shipped).toLocaleDateString()}</p>
                    </div>
                  )}
                  {selectedOrder.shipping_method && (
                    <div>
                      <p className="text-[#6a6560]">Shipping Method</p>
                      <p className="text-[#1a1816]">{selectedOrder.shipping_method}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Customs Information (for international orders) */}
              {(selectedOrder.country !== "US" || selectedOrder.hs_code) && (
                <div className="mb-6 pb-6 border-b border-black/10">
                  <h3 className="text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-3">
                    Customs / USPS Information
                  </h3>
                  <div className="space-y-3 text-[13px]">
                    <div>
                      <p className="text-[#6a6560]">Destination Country</p>
                      <p className="text-[#1a1816]">{selectedOrder.country}</p>
                    </div>
                    <div>
                      <p className="text-[#6a6560]">Declared Value</p>
                      <p className="text-[#1a1816]">${selectedOrder.total_amount.toFixed(2)}</p>
                    </div>
                    {selectedOrder.hs_code && (
                      <div>
                        <p className="text-[#6a6560]">HS Code</p>
                        <p className="text-[#1a1816]">{selectedOrder.hs_code}</p>
                      </div>
                    )}
                    {selectedOrder.country_of_origin && (
                      <div>
                        <p className="text-[#6a6560]">Country of Origin</p>
                        <p className="text-[#1a1816]">{selectedOrder.country_of_origin}</p>
                      </div>
                    )}
                    {selectedOrder.customs_notes && (
                      <div>
                        <p className="text-[#6a6560]">Customs Notes</p>
                        <p className="text-[#1a1816]">{selectedOrder.customs_notes}</p>
                      </div>
                    )}
                    <div className="pt-2 border-t border-black/10">
                      <p className="text-[10px] text-[#9a9188] italic">
                        Use this information when preparing international shipments for USPS
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tax Exemption Details */}
              {selectedOrder.tax_exempt && (
                <div className="mb-6 pb-6 border-b border-black/10">
                  <h3 className="text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-3">
                    Tax Exemption
                  </h3>
                  <div className="space-y-2 text-[13px]">
                    <div className="flex justify-between text-green-600">
                      <span className="text-[#6a6560]">Status</span>
                      <span className="text-[#1a1816]">Exempt</span>
                    </div>
                    {selectedOrder.exemption_reason && (
                      <div>
                        <p className="text-[#6a6560]">Reason</p>
                        <p className="text-[#1a1816]">{selectedOrder.exemption_reason}</p>
                      </div>
                    )}
                    {selectedOrder.exemption_reference && (
                      <div>
                        <p className="text-[#6a6560]">Reference</p>
                        <p className="text-[#1a1816]">{selectedOrder.exemption_reference}</p>
                      </div>
                    )}
                    {selectedOrder.exemption_date && (
                      <div>
                        <p className="text-[#6a6560]">Date Recorded</p>
                        <p className="text-[#1a1816]">{new Date(selectedOrder.exemption_date).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="mb-6">
                <h3 className="text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-3">
                  Notes
                </h3>
                <textarea
                  value={selectedOrder.notes || ""}
                  onChange={async (e) => {
                    try {
                      await supabase
                        .from('orders')
                        .update({ notes: e.target.value })
                        .eq('id', selectedOrder.id);
                    } catch (error) {
                      console.error("Failed to update notes:", error);
                    }
                  }}
                  rows={3}
                  className="w-full px-4 py-2 bg-transparent border border-black/20 text-[13px] text-[#1a1816] outline-none focus:border-[#1a1816] resize-none"
                  placeholder="Add notes about this order..."
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 px-6 py-3 bg-transparent text-[#1a1816] text-[10px] tracking-[.18em] uppercase border border-black/20 hover:border-[#1a1816] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
