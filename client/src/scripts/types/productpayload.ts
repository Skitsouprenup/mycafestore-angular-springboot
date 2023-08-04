
export interface AddProductPayload {
    name: string,
    categoryId: string,
    description: string,
    price: string
}

export interface BackendProductObject {
    categoryId: string,
    categoryName: string,
    description: string,
    id: number,
    name: string,
    price: number,
    status: string
}

export interface UpdateProductPayload {
    name: string,
    categoryId: string,
    description: string,
    price: string,
    id: string
}

export interface UpdateProductStatusPayload {
    id: string,
    status: string
}