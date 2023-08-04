import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import jwt_decode from "jwt-decode"
import { environment } from 'src/environments/environment'
import { tokenPayload } from 'src/scripts/types/userpayload'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient:HttpClient
  ) { }

  checkToken(token: string) {
    const endpoint = environment.apiUrl + '/users/token/verify'
    return this.httpClient.get(endpoint, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    })
  }

  getTokenLocal() {
    return localStorage.getItem('token')
  }

  clearTokenLocal() {
    localStorage.removeItem('token')
  }

  getUsernameFromTokenLocal() {
    const token = localStorage.getItem('token')
    if(!token) return ''

    const decoded_token = jwt_decode(token) as tokenPayload
    return decoded_token?.sub
  }

  getRoleFromTokenLocal() {
    const token = localStorage.getItem('token')
    if(!token) return ''

    const decoded_token = jwt_decode(token) as tokenPayload
    return decoded_token?.role
  }

}
