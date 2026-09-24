import { useEffect, useState } from "react";
import { getVendors } from "../api/vendorApi";
import Loading from "../components/Loading";
import { EmptyMessage, ErrorMessage } from "../components/StateMessage";
import Icon from "../components/Icon";
export default function Vendors() {
  const [vendors, setVendors] = useState([]),
    [q, setQ] = useState(""),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const load = () => {
    setLoading(true);
    setError("");
    getVendors()
      .then(setVendors)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);
  const filtered = vendors.filter((v) =>
    Object.values(v).join(" ").toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <div className="page-head">
        <div>
          
          <h2>Vendors</h2>
          <p>Vendor master data provided by the Vendor Microservice.</p>
        </div>
        <button className="btn secondary" onClick={load}>
          <Icon name="refresh" /> Refresh
        </button>
      </div>
      <div className="panel">
        <div className="toolbar">
          <div className="search">
            <Icon name="search" />
            <input
              placeholder="Search vendors..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <span className="result-count">{filtered.length} vendors</span>
        </div>
        {loading ? (
          <Loading text="Fetching vendors..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={load} />
        ) : filtered.length === 0 ? (
          <EmptyMessage
            title="No vendors found"
            text={
              q
                ? "Try another search."
                : "The Vendor Microservice returned no records."
            }
          />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Vendor ID</th>
                  <th>Vendor Name</th>
                  <th>Address</th>
                  <th>Contact Person</th>
                  <th>Contact Number</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr key={v.vendorId}>
                    <td>
                      <span className="mono">{v.vendorId}</span>
                    </td>
                    <td>
                      <strong>{v.vendorName}</strong>
                    </td>
                    <td>{v.vendorAddress}</td>
                    <td>{v.contactPerson}</td>
                    <td>{v.contactNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
