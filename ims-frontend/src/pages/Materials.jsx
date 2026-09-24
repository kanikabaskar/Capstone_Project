import { useEffect, useState } from "react";
import { getCategories, getMaterialTypes, getUnits } from "../api/materialApi";
import Loading from "../components/Loading";
import { ErrorMessage, EmptyMessage } from "../components/StateMessage";
export default function Materials() {
  const [categories, setCategories] = useState([]),
    [types, setTypes] = useState([]),
    [units, setUnits] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const load = () => {
    setLoading(true);
    setError("");
    Promise.all([getCategories(), getMaterialTypes(), getUnits()])
      .then(([c, t, u]) => {
        setCategories(c);
        setTypes(t);
        setUnits(u);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);
  if (loading) return <Loading text="Fetching material master data..." />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;
  return (
    <>
      <div className="page-head">
        <div>
        
          <h2>Materials Data</h2>
          <p>
            Categories, types and units supplied by the Material Microservice.
          </p>
        </div>
        <button className="btn secondary" onClick={load}>
          Refresh
        </button>
      </div>
      <div className="material-columns">
        <List
          title="Material Categories"
          items={categories}
          id="categoryId"
          name="categoryName"
        />
        <List
          title="Material Types"
          items={types}
          id="typeId"
          name="typeName"
          extra="categoryId"
        />
        <List
          title="Units"
          items={units}
          id="unitId"
          name="unitName"
          extra="categoryId"
        />
      </div>
    </>
  );
}
function List({ title, items, id, name, extra }) {
  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3>{title}</h3>
          <p>{items.length} records</p>
        </div>
      </div>
      {items.length ? (
        <div className="mini-list">
          {items.map((x) => (
            <div className="mini-row" key={x[id]}>
              <div>
                <strong>{x[name]}</strong>
                <small>{x[id]}</small>
              </div>
              {extra && <span>{x[extra]}</span>}
            </div>
          ))}
        </div>
      ) : (
        <EmptyMessage title={`No ${title.toLowerCase()}`} />
      )}
    </div>
  );
}
