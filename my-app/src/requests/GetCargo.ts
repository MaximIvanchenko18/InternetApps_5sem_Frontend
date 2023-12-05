import { cargos } from './MockData';
import { ICargoProps } from '../components/CargoCard';

const api = '/api/cargo/'

export async function getCargo(cargoId?: string): Promise<ICargoProps | undefined> {
    if (cargoId === undefined) {
        return undefined
    }
    let url = api + cargoId
    return fetch(url)
        .then(response => {
            if (response.status >= 500 || response.headers.get("Server") == "GitHub.com") {
                return cargos.get(cargoId)
            }
            return response.json() as Promise<ICargoProps | undefined>
        })
        .catch(_ => {
            return cargos.get(cargoId)
        })
}