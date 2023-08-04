export interface RetrieveBillObject {
    isGenerate?: string,
    name?: string,
    email?: string,
    contactNumber?: string,
    paymentMethod?: string,
    productDetails?: string,
    total?: string,
    uuid: string
}

export interface GenerateBillObject {
    isGenerate: string,
    name: string,
    email: string,
    contactNumber: string,
    paymentMethod: string,
    productDetails: string,
    total: string,
}

export interface BackendBillObject {
    contactNumber: string,
    createdBy: string,
    email: string,
    id: number
    name: string,
    paymentMethod: string,
    productDetails: string,
    total: number,
    uuid: string
}

export interface BillDialogData {
    name: string,
    email: string,
    contactNumber: string,
    paymentMethod: string,
    productDetails: string,
    totalExpense: number
}

export interface BillDialogTableDataSource {
    name: string,
    category: string,
    quantity: string,
    price: string,
    total: string
}