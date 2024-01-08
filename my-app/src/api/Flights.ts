import { format } from 'date-fns';

import { axiosAPI } from ".";
import { ICargo, IFlight } from "../models";

interface FlightsResponse {
    flights: IFlight[]
}

function formatDate(date: Date | null): string {
    if (!date) {
        return ""
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes} ${day}.${month}.${year}`;
}

export async function getFlights(
    status: string,
    startDate: string | null,
    endDate: string | null
): Promise<IFlight[]> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        return [];
    }
    return axiosAPI
        .get<FlightsResponse>('/flights', {
            params: {
                ...(status && { status: status }),
                ...(startDate && {
                    form_date_start: format(new Date(startDate), 'yyyy-MM-dd HH:mm'),
                }),
                ...(endDate && {
                    form_date_end: format(new Date(endDate), 'yyyy-MM-dd HH:mm'),
                }),
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        })
        .then((response) =>
            response.data.flights.map((fl: IFlight) => ({
                ...fl,
                creation_date: formatDate(new Date(fl.creation_date)),
                formation_date: fl.formation_date
                    ? formatDate(new Date(fl.formation_date))
                    : null,
                completion_date: fl.completion_date
                    ? formatDate(new Date(fl.completion_date))
                    : null,
            }))
        );
}

export interface FlightComposition {
    cargo_info: ICargo
    cargo_quantity: number
}

interface FlightResponse {
    cargos: FlightComposition[]
    flight: IFlight
}

export async function getFlight(id: string | undefined): Promise<FlightResponse | null> {
    if (id === undefined) { return null; }
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        return null;
    }

    return axiosAPI.get<FlightResponse>(`/flights/${id}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            const modifiedFlight: IFlight = {
                ...response.data.flight,
                creation_date: formatDate(new Date(response.data.flight.creation_date)),
                formation_date: response.data.flight.formation_date
                    ? formatDate(new Date(response.data.flight.formation_date))
                    : null,
                completion_date: response.data.flight.completion_date
                    ? formatDate(new Date(response.data.flight.completion_date))
                    : null,
            };

            return {
                ...response.data,
                flight: modifiedFlight,
            };
        })
}