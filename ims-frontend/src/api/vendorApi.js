import { createClient } from './http';
import { API } from './config';
const client = createClient(API.vendorBase);
export const getVendors = () => client.get('/controller/getVendors').then(r => Array.isArray(r.data) ? r.data : []);
