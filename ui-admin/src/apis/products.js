import axios from 'axios'
import { BACKEND_URL } from './consts'

export async function getAllProducts() {
    const response = await axios.get(`${BACKEND_URL}/api/admin/product`)
    return response.data.products
}

export function insertProduct() {
    return axios.get(`${BACKEND_URL}/api/admin/product`)
}

export function updateProduct() {
    return axios.get(`${BACKEND_URL}/api/admin/product`)
}

export function deleteProduct(productId) {
    return axios.delete(`${BACKEND_URL}/api/admin/product/`)
}
