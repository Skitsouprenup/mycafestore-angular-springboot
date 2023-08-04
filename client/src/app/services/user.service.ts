import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { 
UpdateUserStatusPayload,
  changePassPayload, 
  forgotPassPayload, 
  loginPayload, 
  signupPayload 
} from '../../scripts/types/userpayload'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient:HttpClient){}

  signup(payload: signupPayload) {
      const endpoint = environment.apiUrl + '/users/signup'

      return this.httpClient.post(endpoint, payload, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      });
  }

  changePass(token: string, payload: changePassPayload) {
    const endpoint = environment.apiUrl + '/users/password/change'

    return this.httpClient.patch(endpoint, payload, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }

  forgotPass(payload: forgotPassPayload) {
    const endpoint = environment.apiUrl + '/users/password/forgot'

    return this.httpClient.post(endpoint, payload, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  login(payload: loginPayload) {
    const endpoint = environment.apiUrl + '/users/login'

    return this.httpClient.post(endpoint, payload, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  logout(token: string) {
    const endpoint = environment.apiUrl + '/users/logout'
    return this.httpClient.get(endpoint, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    })
  }

  getUsers(token: string) {
    const endpoint = environment.apiUrl + '/users/all'
    return this.httpClient.get(endpoint, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    })
  }

  updateUser(token: string, payload: UpdateUserStatusPayload) {
    const endpoint = environment.apiUrl + '/users/update/status'

    return this.httpClient.patch(endpoint, payload, {
      headers: new HttpHeaders()
              .set('Authorization', `Bearer ${token}`)
              .set('Content-Type', 'application/json')
    })
  }

}
