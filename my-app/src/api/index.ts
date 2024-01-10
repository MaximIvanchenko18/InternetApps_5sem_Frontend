import { cargos, draft_flight } from './MockData';
import { ICargo } from '../models';
import axios, { AxiosRequestConfig } from 'axios';


const ip = 'localhost'
const port = '3000'
export const imagePlaceholder = `${import.meta.env.BASE_URL}placeholder.jpeg`

export const axiosAPI = axios.create({ baseURL: `http://${ip}:${port}/api/`, timeout: 5000 });

export type Response = {
    draft_flight: string | null;
    cargos: ICargo[];
}

export async function getAllCargo(name?: string, low_price?: number, high_price?: number): Promise<Response> {
    let url = 'cargo'
    let several_args = false
    if (name !== undefined || low_price !== undefined || high_price !== undefined) {
        url += `?`
    }
    if (name !== undefined) {
        url += `name=${name}`
        several_args = true
    }
    if (low_price !== undefined && low_price >= 0) {
        if (several_args) url += `&`
        url += `low_price=${low_price}`
        several_args = true
    }
    if (high_price !== undefined && high_price > 0) {
        if (several_args) url += `&`
        url += `high_price=${high_price}`
    }

    const headers: AxiosRequestConfig['headers'] = {};
    let accessToken = localStorage.getItem('access_token');
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return axiosAPI.get<Response>(url, { headers })
        .then(response => response.data)
        .catch(_ => fromMock(name, low_price, high_price))
}

function fromMock(name?: string, low_price?: number, high_price?: number): Response {
    let filteredCargo = Array.from(cargos.values())
    if (name !== undefined) {
        let lower_name = name.toLowerCase()
        filteredCargo = filteredCargo.filter(
            (cargo) => cargo.name.toLowerCase().includes(lower_name)
        )
    }
    if (low_price !== undefined) {
        filteredCargo = filteredCargo.filter(
            (cargo) => cargo.price >= low_price
        )
    }
    if (high_price !== undefined) {
        filteredCargo = filteredCargo.filter(
            (cargo) => cargo.price <= high_price
        )
    }

    return { draft_flight, cargos: filteredCargo }
}

export async function getCargo(cargoId?: string): Promise<ICargo | undefined> {
    if (cargoId === undefined) {
        return undefined
    }

    let url = 'cargo/' + cargoId
    return axiosAPI.get<ICargo>(url)
        .then(response => response.data)
        .catch(_ => cargos.get(cargoId))
}