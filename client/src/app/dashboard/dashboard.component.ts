import { Component, OnInit } from '@angular/core'
import { AuthService } from '../services/auth.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  public activeSidebarBtn = 'Dashboard'

  constructor(
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    if(this.auth.getRoleFromTokenLocal() !== 'admin')
      this.activeSidebarBtn = 'Order'
  }

  setSidebarButtonActive(name: string) {
    this.activeSidebarBtn = name
  }
}
