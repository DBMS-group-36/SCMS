import axios from 'axios'
import { BACKEND_URL } from './consts'

export async function getAllStores() {
    const response = await axios.get(`${BACKEND_URL}/api/admin/stores`)
    return response.data.stores
}

export function insertStore(data) {
    return axios.post(`${BACKEND_URL}/api/admin/stores`, {
        City: data?.City,
        Capacity: data?.Capacity
    })
}

export function updateStore() {
    return axios.put(`${BACKEND_URL}/api/admin/stores`)
}

export function deleteStore(storeId) {
    return axios.delete(`${BACKEND_URL}/api/admin/stores/${storeId}`)
}
