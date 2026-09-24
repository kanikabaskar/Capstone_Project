import { createClient } from "./http";
import { API } from "./config";

const client = createClient(API.imsBase);

// Get the initial Purchase Entry object
export const getPurchaseEntry = () =>
  client.get("/purchaseEntry").then((r) => r.data);

// Get vendors from IMS
export const getImsVendors = () =>
  client.get("/vendors").then((r) => r.data || []);

// Get material categories from IMS
export const getImsCategories = () =>
  client.get("/categories").then((r) => r.data || []);

// Get material types and units based on selected category
export const getUnitAndTypeList = (categoryId) =>
  client
    .post("/getUnitAndTypeList", {
      materialCategoryId: categoryId,
    })
    .then((r) => r.data);

// Save purchase details
export const addPurchaseDetail = (payload) =>
  client
    .post("/addPurchaseDetail", payload)
    .then((r) => r.data);

// Get purchase report
export const getPurchaseReport = (payload) =>
  client
    .post("/report/controller/getPurchaseDetails", payload)
    .then((r) => r.data || []);