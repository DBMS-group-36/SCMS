import axios from 'axios'
import { BACKEND_URL } from './consts'

export async function getAllTrucks() {
    const response = await axios.get(`${BACKEND_URL}/api/admin/trucks`)
    return response.data.trucks
}
