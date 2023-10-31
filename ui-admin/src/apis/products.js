import axios from 'axios'
import { BACKEND_URL } from './consts'

export async function getAllProducts() {
    const response = await axios.get(`${BACKEND_URL}/api/admin/products`)
    return response.data.products
}
