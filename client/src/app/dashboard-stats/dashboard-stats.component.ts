import { Component, OnInit } from '@angular/core'
import { statsCount } from 'src/scripts/types/dashboard'

import { DashboardService } from '../services/dashboard.service'
import { AuthService } from '../services/auth.service'
import { NgxUiLoaderService } from 'ngx-ui-loader'
import { SnackbarService } from '../services/snackbar.service'

@Component({
  selector: 'app-dashboard-stats',
  templateUrl: './dashboard-stats.component.html',
  styleUrls: ['./dashboard-stats.component.scss']
})
export class DashboardStatsComponent implements OnInit{
  public statsCount: statsCount | null = null

  constructor(
    private dasboardService: DashboardService,
    public auth: AuthService,
    private ngxService: NgxUiLoaderService,
    private snackBarService: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.ngxService.start()
    const token = this.auth.getTokenLocal()
    if(!token) {
      console.error('can\'t find authorization token')
      this.snackBarService.openSnackBar('Server error: can\'t fetch stats', 'error')
      this.ngxService.stop()
      return
    }

    this.dasboardService.getStatsCount(token).subscribe({

      next: (response: any) => {
        this.statsCount = response
        this.ngxService.stop()
      },
      error: (error) => {
        if(error?.error)
          console.error(error.error?.message)

        this.snackBarService.openSnackBar('Server error: can\'t fetch stats', 'error')
        this.ngxService.stop()
      }

    })
  }
}
