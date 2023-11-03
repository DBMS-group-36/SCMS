import axios from 'axios'
import { BACKEND_URL } from './consts'


export async function getOrdersStillInWareHouse() {
    const response = await axios.get(`${BACKEND_URL}/api/admin/orders/stillInWarehouse`)
    return response.data.orders
}

export async function getOrdersOnTrain(storeId) {
    const response = await axios.get(`${BACKEND_URL}/api/admin/orders/onTrain?storeId=${storeId}`)
    return response.data.orders
}

export async function getOrdersAtStore(storeId) {
    const response = await axios.get(`${BACKEND_URL}/api/admin/orders/atStore?storeId=${storeId}`)
    return response.data.orders
}

export async function getOrdersDelivering(storeId) {
    const response = await axios.get(`${BACKEND_URL}/api/admin/orders/delivering?storeId=${storeId}`)
    return response.data.orders
}

export async function getOrdersDelivered(storeId) {
    const response = await axios.get(`${BACKEND_URL}/api/admin/orders/delivered?storeId=${storeId}`)
    return response.data.orders
}

export async function getOrdersCancelled() {
    const response = await axios.get(`${BACKEND_URL}/api/admin/orders/cancelled`)
    return response.data.orders
}

