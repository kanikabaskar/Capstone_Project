import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getVendors } from "../api/vendorApi";
import { getCategories } from "../api/materialApi";
import { getMaterialTypes, getUnits } from "../api/materialApi";
import { getPurchaseReport } from "../api/purchaseApi";
import Loading from "../components/Loading";
import { ErrorMessage } from "../components/StateMessage";
import Icon from "../components/Icon";
export default function Dashboard() {
  const [data, setData] = useState({
    vendors: [],
    categories: [],
    types: [],
    units: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.allSettled([
      getVendors(),
      getCategories(),
      getMaterialTypes(),
      getUnits(),
    ]).then((r) => {
      setData({
        vendors: r[0].status === "fulfilled" ? r[0].value : [],
        categories: r[1].status === "fulfilled" ? r[1].value : [],
        types: r[2].status === "fulfilled" ? r[2].value : [],
        units: r[3].status === "fulfilled" ? r[3].value : [],
      });
      if (r.some((x) => x.status === "rejected"))
        setError(
          "One or more services could not be reached. Check the backend URLs and ports.",
        );
      setLoading(false);
    });
  }, []);
  if (loading) return <Loading text="Loading dashboard data..." />;
  return (
    <>
      <div className="page-head">
        <div>
          <span className="eyebrow">OVERVIEW</span>
          <h2>Welcome to Glory Textiles IMS</h2>
          <p>
            Monitor your master data and move quickly into purchase operations.
          </p>
        </div>
        <Link className="btn primary" to="/purchase">
          <Icon name="plus" /> New purchase
        </Link>
      </div>
      {error && <div className="inline-alert">{error}</div>}
      <div className="stats-grid">
        <Stat label="Total Vendors" value={data.vendors.length} icon="vendor" />
        <Stat
          label="Material Categories"
          value={data.categories.length}
          icon="material"
        />
        <Stat
          label="Material Types"
          value={data.types.length}
          icon="material"
        />
        <Stat label="Units" value={data.units.length} icon="dashboard" />
      </div>
      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Quick actions</h3>
              <p>Jump directly to a common task.</p>
            </div>
          </div>
          <div className="quick-grid">
            <Link to="/vendors">
              <Icon name="vendor" />
              <span>Browse vendors</span>
              <Icon name="arrow" />
            </Link>
            <Link to="/materials">
              <Icon name="material" />
              <span>Explore materials</span>
              <Icon name="arrow" />
            </Link>
            <Link to="/purchase">
              <Icon name="purchase" />
              <span>Create purchase</span>
              <Icon name="arrow" />
            </Link>
            <Link to="/reports">
              <Icon name="report" />
              <span>Generate report</span>
              <Icon name="arrow" />
            </Link>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Application status</h3>
              <p>Frontend connectivity overview.</p>
            </div>
          </div>
          <div className="status-list">
            <Status label="Vendor service data" ok={data.vendors.length >= 0} />
            <Status
              label="Material categories"
              ok={data.categories.length >= 0}
            />
            <Status label="Material types" ok={data.types.length >= 0} />
            <Status label="Units" ok={data.units.length >= 0} />
          </div>
        </div>
      </div>
    </>
  );
}
function Stat({ label, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon name={icon} />
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}
function Status({ label, ok }) {
  return (
    <div className="status-item">
      <span>{label}</span>
      <b className={ok ? "ok" : "bad"}>{ok ? "Available" : "Unavailable"}</b>
    </div>
  );
}
