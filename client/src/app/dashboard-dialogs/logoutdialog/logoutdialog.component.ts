import { Component } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { NgxUiLoaderService } from 'ngx-ui-loader'
import { AuthService } from 'src/app/services/auth.service'
import { SnackbarService } from 'src/app/services/snackbar.service'
import { UserService } from 'src/app/services/user.service'

@Component({
  selector: 'app-logoutdialog',
  templateUrl: './logoutdialog.component.html',
  styleUrls: ['./logoutdialog.component.scss']
})
export class LogoutdialogComponent {

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private router: Router,
    private snackBarService: SnackbarService,
    public dialogRef: MatDialogRef<LogoutdialogComponent>,
    private ngxService: NgxUiLoaderService
  ){}

  logout() {
    this.ngxService.start()
    this.dialogRef.close()

    const token = this.auth.getTokenLocal()
    if(!token) {
      this.ngxService.stop()
      this.router.navigate(['/'])
      return
    }

    this.userService.logout(token).subscribe({

      next: () => {
        this.auth.clearTokenLocal()
        this.ngxService.stop()
        this.router.navigate(['/'])
      },
      error: (error) => {
        if(error?.error)
          this.snackBarService.openSnackBar(error.error?.message, 'error')
        this.auth.clearTokenLocal()
        this.ngxService.stop()
        this.router.navigate(['/'])
      },
    })
  }
}
