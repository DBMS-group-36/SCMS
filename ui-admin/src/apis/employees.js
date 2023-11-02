import axios from 'axios'
import { BACKEND_URL } from './consts'

export async function getAllDrivers() {
    const response = await axios.get(`${BACKEND_URL}/api/admin/drivers`)
    return response.data.drivers
}
export async function getAllDriverAssistants() {
    const response = await axios.get(`${BACKEND_URL}/api/admin/driverAssistants`)
    return response.data.driverAssistants
}

