import axios from 'axios'
import { BACKEND_URL } from './consts'

export async function getAllTransportation_train_trips() {
    const response = await axios.get(`${BACKEND_URL}/api/admin/transportation_train_trip`)
    return response.data.transportation_train_trips
}

export function insertTransportation_train_trip() {
    return axios.get(`${BACKEND_URL}/api/admin/transportation_train_trip`)
}

export function updateTransportation_train_trip() {
    return axios.get(`${BACKEND_URL}/api/admin/transportation_train_trip`)
}

export function deleteTransportation_train_trip(transportation_train_tripId) {
    return axios.delete(`${BACKEND_URL}/api/admin/transportation_train_trip/`)
}
