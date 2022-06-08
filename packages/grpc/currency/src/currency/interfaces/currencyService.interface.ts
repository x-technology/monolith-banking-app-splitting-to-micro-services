import { Observable } from "rxjs";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FindAllRequest {}

export interface Currency {
    name: string
    uuid: string
    currentExchangeRate: number
}

export interface PageMeta {
    page: number
    take: number
    itemCount: number
    pageCount: number
}

export interface FindAllResponse {
    currencies: Currency[]
    meta: PageMeta
}

export interface CurrencyServiceInterface {
    findAll(FindAllRequest): Observable<FindAllResponse>;
}
