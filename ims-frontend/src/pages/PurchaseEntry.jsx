import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getImsVendors,
  getImsCategories,
  getUnitAndTypeList,
  addPurchaseDetail,
} from "../api/purchaseApi";

import Loading from "../components/Loading";
import Icon from "../components/Icon";
import Toast from "../components/Toast";

const initial = {
  vendorName: "",
  materialCategoryId: "",
  materialTypeId: "",
  brandName: "",
  unitId: "",
  quantity: "",
  purchaseAmount: "",
  purchaseDate: "",
};

export default function PurchaseEntry() {
  const nav = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [units, setUnits] = useState([]);

  const [form, setForm] = useState(initial);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [dependentLoading, setDependentLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  /*
   * Load vendors and material categories
   * when the Purchase Entry page opens.
   */
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError("");

      try {
        const [vendorData, categoryData] = await Promise.all([
          getImsVendors(),
          getImsCategories(),
        ]);

        setVendors(Array.isArray(vendorData) ? vendorData : []);
        setCategories(Array.isArray(categoryData) ? categoryData : []);
      } catch (e) {
        console.error("Failed to load purchase entry data:", e);

        setError(
          e?.message ||
            "Unable to load vendors and material categories."
        );
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  /*
   * Handle all form field changes.
   */
  const change = async (e) => {
    const { name, value } = e.target;

    setError("");

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    /*
     * When category changes:
     *
     * 1. Save selected category
     * 2. Clear old material type
     * 3. Clear old unit
     * 4. Call IMS getUnitAndTypeList
     * 5. IMS calls MaterialService
     * 6. Populate type and unit dropdowns
     */
    if (name === "materialCategoryId") {
      setForm((previous) => ({
        ...previous,
        materialCategoryId: value,
        materialTypeId: "",
        unitId: "",
      }));

      setTypes([]);
      setUnits([]);

      if (!value) {
        return;
      }

      setDependentLoading(true);

      try {
        console.log(
          "Loading types and units for category:",
          value
        );

        const response = await getUnitAndTypeList(value);

        console.log(
          "getUnitAndTypeList response:",
          response
        );

        /*
         * Backend UnitAndTypeResponse:
         *
         * unitList
         * materialTypeList
         */
        setUnits(
          Array.isArray(response?.unitList)
            ? response.unitList
            : []
        );

        setTypes(
          Array.isArray(response?.materialTypeList)
            ? response.materialTypeList
            : []
        );
      } catch (e) {
        console.error(
          "Failed to load material types and units:",
          e
        );

        setError(
          e?.message ||
            "Unable to load material types and units."
        );

        setTypes([]);
        setUnits([]);
      } finally {
        setDependentLoading(false);
      }

      return;
    }

    /*
     * Normal form field.
     */
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
   * Validate PurchaseBean fields before sending
   * the request to IMS.
   */
  const validate = () => {
    const validationErrors = {};

    const requiredFields = [
      "vendorName",
      "materialCategoryId",
      "materialTypeId",
      "brandName",
      "unitId",
      "quantity",
      "purchaseAmount",
      "purchaseDate",
    ];

    requiredFields.forEach((field) => {
      if (!String(form[field] ?? "").trim()) {
        validationErrors[field] = "This field is required.";
      }
    });

    /*
     * Quantity must be positive.
     */
    if (
      form.quantity &&
      Number(form.quantity) <= 0
    ) {
      validationErrors.quantity =
        "Quantity must be positive.";
    }

    /*
     * Purchase amount must be positive.
     */
    if (
      form.purchaseAmount &&
      Number(form.purchaseAmount) <= 0
    ) {
      validationErrors.purchaseAmount =
        "Purchase amount must be positive.";
    }

    /*
     * Purchase date must be before today.
     */
    if (form.purchaseDate) {
      const today = new Date()
        .toISOString()
        .slice(0, 10);

      if (form.purchaseDate >= today) {
        validationErrors.purchaseDate =
          "Purchase date must be in the past.";
      }
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  /*
   * Submit purchase.
   */
  const submit = async (e) => {
    e.preventDefault();

    setError("");

    if (!validate()) {
      return;
    }

    setSaving(true);

    try {
      /*
       * Prepare payload according to PurchaseBean.
       */
      const payload = {
        vendorName: form.vendorName,
        materialCategoryId: form.materialCategoryId,
        materialTypeId: form.materialTypeId,
        brandName: form.brandName,
        unitId: form.unitId,
        quantity: Number(form.quantity),
        purchaseAmount: Number(form.purchaseAmount),
        purchaseDate: form.purchaseDate,
      };

      console.log(
        "Submitting purchase payload:",
        payload
      );

      const result = await addPurchaseDetail(payload);

      console.log(
        "Purchase saved successfully:",
        result
      );

      setToast(
        "Purchase details saved successfully."
      );

      setTimeout(() => {
        nav("/purchase/success", {
          state: result,
        });
      }, 350);
    } catch (err) {
      console.error(
        "Failed to save purchase:",
        err
      );

      setError(
        err?.message ||
          "Unable to save purchase details."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * Reset the complete form.
   */
  const resetForm = () => {
    setForm(initial);
    setErrors({});
    setTypes([]);
    setUnits([]);
    setError("");
  };

  if (loading) {
    return (
      <Loading text="Preparing purchase entry..." />
    );
  }

  return (
    <>
      <Toast
        message={toast}
        onClose={() => setToast("")}
      />

      <div className="purchase-entry-page">
        {error && (
          <div className="inline-alert error-alert">
            {error}
          </div>
        )}

        <form
          className="purchase-entry-form"
          onSubmit={submit}
        >
          <div className="purchase-field-row">
            <Field label="Vendor Name" error={errors.vendorName}>
              <select
                name="vendorName"
                value={form.vendorName}
                onChange={change}
              >
                <option value="">Select vendor</option>
                {vendors.map((vendor) => (
                  <option
                    key={vendor.vendorId}
                    value={vendor.vendorName}
                  >
                    {vendor.vendorName}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="purchase-field-row">
            <Field
              label="Material Category"
              error={errors.materialCategoryId}
            >
              <select
                name="materialCategoryId"
                value={form.materialCategoryId}
                onChange={change}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option
                    key={category.categoryId}
                    value={category.categoryId}
                  >
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="purchase-field-row">
            <Field
              label="Material Type"
              error={errors.materialTypeId}
            >
              <select
                name="materialTypeId"
                value={form.materialTypeId}
                onChange={change}
                disabled={!form.materialCategoryId || dependentLoading}
              >
                <option value="">
                  {dependentLoading ? "Loading..." : "Select material type"}
                </option>
                {types.map((type) => (
                  <option key={type.typeId} value={type.typeId}>
                    {type.typeName}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="purchase-field-row">
            <Field label="Unit" error={errors.unitId}>
              <select
                name="unitId"
                value={form.unitId}
                onChange={change}
                disabled={!form.materialCategoryId || dependentLoading}
              >
                <option value="">
                  {dependentLoading ? "Loading..." : "Select unit"}
                </option>
                {units.map((unit) => (
                  <option key={unit.unitId} value={unit.unitId}>
                    {unit.unitName}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="purchase-field-row">
            <Field label="Brand Name" error={errors.brandName}>
              <input
                name="brandName"
                value={form.brandName}
                onChange={change}
              />
            </Field>
          </div>

          <div className="purchase-field-row">
            <Field label="Quantity" error={errors.quantity}>
              <input
                name="quantity"
                type="number"
                min="1"
                value={form.quantity}
                onChange={change}
              />
            </Field>
          </div>

          <div className="purchase-field-row">
            <Field
              label="Purchase Amount"
              error={errors.purchaseAmount}
            >
              <input
                name="purchaseAmount"
                type="number"
                min="0.01"
                step="0.01"
                value={form.purchaseAmount}
                onChange={change}
              />
            </Field>
          </div>

          <div className="purchase-field-row">
            <Field label="Purchase Date" error={errors.purchaseDate}>
              <input
                name="purchaseDate"
                type="date"
                value={form.purchaseDate}
                max={new Date(Date.now() - 86400000)
                  .toISOString()
                  .slice(0, 10)}
                onChange={change}
              />
            </Field>
          </div>

          <div className="purchase-entry-actions">
            <button
              type="submit"
              className="btn primary"
              disabled={saving || dependentLoading}
            >
              {saving ? "Saving..." : "Submit"}
            </button>

            <button
              type="button"
              className="btn secondary"
              onClick={resetForm}
              disabled={saving}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </>
  );

}

/*
 * Reusable form field component.
 */
function Field({
  label,
  error,
  children,
}) {
  return (
    <label
      className={`field ${
        error ? "has-error" : ""
      }`}
    >
      <span>{label}</span>

      {children}

      {error && (
        <small>{error}</small>
      )}
    </label>
  );
}