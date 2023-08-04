import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { 
  AddProductPayload, 
  UpdateProductPayload,
  UpdateProductStatusPayload
} from 'src/scripts/types/productpayload'

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient:HttpClient) {}

  addProduct(token: string, payload: AddProductPayload) {
    const endpoint = environment.apiUrl + '/products/add'
    return this.httpClient.post(endpoint, payload, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    })
  }

  updateProduct(token: string, payload: UpdateProductPayload) {
    const endpoint = environment.apiUrl + '/products/update'
    return this.httpClient.put(endpoint, payload, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    })
  }

  updateProductStatus(token: string, payload: UpdateProductStatusPayload) {
    const endpoint = environment.apiUrl + '/products/update/status'
    return this.httpClient.patch(endpoint, payload, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    })
  }

  deleteProduct(token: string, id: string) {
    const endpoint = environment.apiUrl + `/products/delete/${id}`
    return this.httpClient.delete(endpoint, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    })
  }

  getProducts(token: string) {
    const endpoint = environment.apiUrl + '/products/get/all'
    return this.httpClient.get(endpoint, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    })
  }

  getProductsByCategory(token: string, categoryId: string) {
    const endpoint = environment.apiUrl + `/products/get/category/${categoryId}`

    return this.httpClient.get(endpoint, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    })
  }

  getProductById(token: string, id: string) {
    const endpoint = environment.apiUrl + `/products/get/product/${id}`

    return this.httpClient.get(endpoint, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    })
  }
}
