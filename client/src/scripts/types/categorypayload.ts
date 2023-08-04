
export interface UpdateCategoryPayload {
    name: string,
    id: string
}

export interface AddCategoryPayload {
    name: string
}

export interface CategoryType extends Object {
    id: number,
    name: string
}