import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { 
  AddCategoryPayload, 
  CategoryType, 
  UpdateCategoryPayload 
} from 'src/scripts/types/categorypayload'

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClient:HttpClient) {}

  addCategory(token: string, payload: AddCategoryPayload) {
    const endpoint = environment.apiUrl + '/categories/add'
    return this.httpClient.post(endpoint, payload, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    })
  }

  updateCategory(token: string, payload: UpdateCategoryPayload) {
    const endpoint = environment.apiUrl + '/categories/update'
    return this.httpClient.put(endpoint, payload, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    })
  }

  getCategories(token: string) {
    const endpoint = environment.apiUrl + '/categories/get/all'
    return this.httpClient.get(endpoint, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    })
  }

  getCategoriesWithActiveProducts(token: string) {
    const endpoint = environment.apiUrl + '/categories/get/all?filterValue=true'
    return this.httpClient.get(endpoint, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    })
  }

}
