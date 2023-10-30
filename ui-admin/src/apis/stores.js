import axios from 'axios'
import { BACKEND_URL } from './consts'

export async function getAllStores() {
    const response = await axios.get(`${BACKEND_URL}/api/admin/store`)
    return response.data.stores
}

export function insertStore() {
    return axios.get(`${BACKEND_URL}/api/admin/store`)
}

export function updateStore() {
    return axios.get(`${BACKEND_URL}/api/admin/store`)
}

export function deleteStore(storeId) {
    return axios.delete(`${BACKEND_URL}/api/admin/store/`)
}
