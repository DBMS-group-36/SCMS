import axios from 'axios'
import { BACKEND_URL } from './consts'

export async function getAllTransportationTrainTrips() {
    const response = await axios.get(`${BACKEND_URL}/api/admin/transportation_train_trips`)
    return response.data.transportation_train_trips
}

