import { useEffect, useState } from "react";
import { getVendors } from "../api/vendorApi";
import { getPurchaseReport } from "../api/purchaseApi";
import Loading from "../components/Loading";
import { EmptyMessage, ErrorMessage } from "../components/StateMessage";

export default function Reports() {
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState({
    vendorName: "",
    fromDate: "",
    toDate: "",
  });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getVendors()
      .then((data) => setVendors(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const submit = (e) => {
    e.preventDefault();

    if (!form.vendorName || !form.fromDate || !form.toDate) {
      return setError("Vendor, from date and to date are required.");
    }

    if (form.fromDate > form.toDate) {
      return setError("From date cannot be after to date.");
    }

    setSearching(true);
    setError("");

    getPurchaseReport(form)
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setSearching(false));
  };

  const selectedVendor = vendors.find(
    (vendor) => vendor.vendorName === form.vendorName
  );

  const reset = () => {
    setForm({ vendorName: "", fromDate: "", toDate: "" });
    setRows([]);
    setError("");
  };

  if (loading) {
    return <Loading text="Preparing vendor purchase report..." />;
  }

  return (
    <>
      {error && <ErrorMessage message={error} />}

      <div className="vendor-report-page">
        <form className="vendor-report-filters" onSubmit={submit}>
          <label className="report-field vendor-filter">
            <span>Vendor Name</span>
            <select
              name="vendorName"
              value={form.vendorName}
              onChange={change}
            >
              <option value="">Select vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.vendorId} value={vendor.vendorName}>
                  {vendor.vendorName}
                </option>
              ))}
            </select>
          </label>

          <label className="report-field">
            <span>From date</span>
            <input
              type="date"
              name="fromDate"
              value={form.fromDate}
              onChange={change}
            />
          </label>

          <label className="report-field">
            <span>To date</span>
            <input
              type="date"
              name="toDate"
              value={form.toDate}
              onChange={change}
            />
          </label>

          <div className="report-buttons">
            <button className="btn primary" disabled={searching}>
              {searching ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {selectedVendor && (
          <div className="vendor-contact-details">
            <div>
              <strong>Address:</strong>
              <span>{selectedVendor.vendorAddress || "—"}</span>
            </div>
            <div>
              <strong>Contact Number:</strong>
              <span>{selectedVendor.contactNumber || "—"}</span>
            </div>
            <div>
              <strong>Contact person:</strong>
              <span>{selectedVendor.contactPerson || "—"}</span>
            </div>
          </div>
        )}

        <div className="vendor-report-results">
          {searching ? (
            <Loading text="Searching purchase records..." />
          ) : rows.length === 0 ? (
            <EmptyMessage
              title="No purchase records found"
              text="Select a vendor and date range to generate the report."
            />
          ) : (
            <div className="table-wrap vendor-report-table-wrap">
              <table className="vendor-report-table">
                <thead>
                  <tr>
                    <th>Material Category</th>
                    <th>Material Type</th>
                    <th>Brand</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Price</th>
                    <th>Purchase Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.purchaseId || r.transactionId || i}>
                      <td>{r.materialCategoryName || r.materialCategoryId || "—"}</td>
                      <td>{r.materialTypeName || r.materialTypeId || "—"}</td>
                      <td>{r.brandName || "—"}</td>
                      <td>{r.quantity ?? "—"}</td>
                      <td>{r.materialUnitName || r.unitName || r.unitId || "—"}</td>
                      <td>{r.purchaseAmount ?? "—"}</td>
                      <td>{r.purchaseDate || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
