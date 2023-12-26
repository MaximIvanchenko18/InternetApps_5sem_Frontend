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
    formation_date: string
    completion_date: string
    customer: string
    moderator: string
    rocket_type: string
    shipment_status: string
}