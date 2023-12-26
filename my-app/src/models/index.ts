export interface ICargo {
    uuid: string
    name: string
    en_name: string
    photo: string
    category: string
    price: number
    weight: number
    capacity: number
    description: string
}

export interface IFlight {
    uuid: string
    status: string
    creation_date: string
    formation_date: string | null
    completion_date: string | null
    customer: string
    moderator: string | null
    rocket_type: string | null
    shipment_status: string | null
}