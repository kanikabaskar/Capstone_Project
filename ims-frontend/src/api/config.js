export const API = {
  vendorBase: import.meta.env.VITE_VENDOR_SERVICE_URL || 'http://localhost:8087',
  materialBase: import.meta.env.VITE_MATERIAL_SERVICE_URL || 'http://localhost:8088',
  imsBase: import.meta.env.VITE_IMS_SERVICE_URL || 'http://localhost:8085'
};
