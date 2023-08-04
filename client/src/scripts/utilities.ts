import { CategoryType } from "./types/categorypayload"
import { BackendProductObject } from "./types/productpayload"


export const downloadFile = (file: Blob, fileName: string, extension: string) => {
    const anchorElement = document.createElement('a')
    anchorElement.style.display = 'none'

    const fileLink = window.URL.createObjectURL(
    new Blob([file], {type: "application/octet-stream"})
    )
    
    anchorElement.href = fileLink;
    anchorElement.download = fileName;

    document.body.appendChild(anchorElement)
    anchorElement.click();

    window.URL.revokeObjectURL(fileLink)
    anchorElement.remove()
}

export const findCategoryName = (categories: CategoryType[], id: number) => {
    let result = ''
    if(!categories) return result

    for(const item of categories) {
        if(item.id === id) {
        result = item.name
        break;
        }
    }

    return result
}

export const findProductName = (products: BackendProductObject[], id: number) => {
    if(!products) return ''

    let result = ''
    for(const item of products) {
        if(item.id.toString() === id.toString()) {
        result = item.name
        break;
        }
    }

    return result
}