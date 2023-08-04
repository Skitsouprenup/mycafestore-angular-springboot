import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { GenerateBillObject, RetrieveBillObject } from 'src/scripts/types/bill'

@Injectable({
  providedIn: 'root'
})
export class BillService {

  constructor(private httpClient:HttpClient) {}

  getBills(token: string) {
    const endpoint = environment.apiUrl + '/bills/get'

    return this.httpClient.get(endpoint, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    })
  }

  generateReport(token: string, data: GenerateBillObject) {
    const endpoint = environment.apiUrl + '/bills/generate/report'

    return this.httpClient.post(endpoint, data, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    })
  }

  getPdf(token: string, data: RetrieveBillObject): Observable<Blob> {
    const endpoint = environment.apiUrl + '/bills/retrieve/report'

    return this.httpClient.post(endpoint, data, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json'),
      responseType: 'blob'
    })
  }
  
  deleteBill(token: string, id: string) {
    const endpoint = environment.apiUrl + `/bills/delete/${id}`

    return this.httpClient.delete(endpoint, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    })
  }

}
