import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient:HttpClient) { }

  getStatsCount(token: string) {
    const endpoint = environment.apiUrl + '/dashboard/get/stats/count'
    return this.httpClient.get(endpoint, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    });
  }

  
}
