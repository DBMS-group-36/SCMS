import axios from 'axios'
import { BACKEND_URL } from './consts'


export async function getOrdersStillInWareHouse() {
    const response = await axios.get(`${BACKEND_URL}/api/admin/orders/stillInWarehouse`)
    return response.data.orders
}

export async function getOrdersOnTrain() {
    const response = await axios.get(`${BACKEND_URL}/api/admin/orders/onTrain`)
    return response.data.orders
}

export async function getOrdersAtStore() {
    const response = await axios.get(`${BACKEND_URL}/api/admin/orders/atStore`)
    return response.data.orders
}

export async function getOrdersDelivering() {
    const response = await axios.get(`${BACKEND_URL}/api/admin/orders/delivering`)
    return response.data.orders
}

export async function getOrdersDelivered() {
    const response = await axios.get(`${BACKEND_URL}/api/admin/orders/delivered`)
    return response.data.orders
}

export async function getOrdersCancelled() {
    const response = await axios.get(`${BACKEND_URL}/api/admin/orders/cancelled`)
    return response.data.orders
}

