export interface FindAllRequest {}

export interface Currency {
    name: string
    uuid: string
    currentExchangeRate: number
}

export interface FindAllResponse {
    currencies: Currency[]
}