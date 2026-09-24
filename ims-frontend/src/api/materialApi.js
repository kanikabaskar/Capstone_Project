import { createClient } from './http';
import { API } from './config';
const client = createClient(API.materialBase);
export const getCategories = () => client.get('/material/controller/getMaterialCategories').then(r => r.data || []);
export const getCategoryById = id => client.get(`/material/controller/getMaterialCategoryById/${encodeURIComponent(id)}`).then(r => r.data);
export const getMaterialTypes = () => client.get('/type/controller/getTypeDetails').then(r => r.data || []);
export const getMaterialTypesByCategory = id => client.get(`/type/controller/getTypeDetailsByCategoryId/${encodeURIComponent(id)}`).then(r => r.data || []);
export const getUnits = () => client.get('/unit/controller/getUnitDetails').then(r => r.data || []);
export const getUnitsByCategory = id => client.get(`/unit/controller/getUnitsByCategoryId/${encodeURIComponent(id)}`).then(r => r.data || []);
