import { cargos, draft_flight } from './MockData';
import { ICargoProps } from '../components/CargoCard';

export type Response = {
    draft_flight: string | null;
    cargos: ICargoProps[];
}

export async function getAllCargo(name?: string, low_price?: number, high_price?: number): Promise<Response> {
    let url = '/api/cargo'
    let several_args = false
    if (name !== undefined || low_price !== undefined || high_price !== undefined) {
        url += `?`
    }
    if (name !== undefined) {
        url += `name=${name}`
        several_args = true
    }
    if (low_price !== undefined) {
        if (several_args) url += `&`
        url += `low_price=${low_price}`
        several_args = true
    }
    if (high_price !== undefined) {
        if (several_args) url += `&`
        url += `high_price=${high_price}`
    }

    return fetch(url)
        .then(response => {
            if (response.status >= 500 || response.headers.get("Server") == "GitHub.com") {
                return fromMock(name, low_price, high_price)
            }
            return response.json() as Promise<Response>
        })
        .catch(_ => {
            return fromMock(name, low_price, high_price)
        })
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