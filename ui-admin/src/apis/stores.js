import axios from 'axios'
import { BACKEND_URL } from './consts'

export async function getAllStores() {
    const response = await axios.get(`${BACKEND_URL}/api/admin/store`)
    return response.data.stores
}

export function insertStore(data) {
    console.log("Inserting store", data)
    return axios.post(`${BACKEND_URL}/api/admin/store`, {
        City: data?.city,
        Capacity: data?.capacity
    })
}

export function updateStore() {
    return axios.put(`${BACKEND_URL}/api/admin/store`)
}

export function deleteStore(storeId) {
    return axios.delete(`${BACKEND_URL}/api/admin/store/`)
}
