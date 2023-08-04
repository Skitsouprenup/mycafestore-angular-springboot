import { Component, OnInit } from '@angular/core'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { SignupComponent } from '../user/signup/signup.component'
import { ForgotpassComponent } from '../user/forgotpass/forgotpass.component'
import { LoginComponent } from '../user/login/login.component'
import { Router } from '@angular/router'
import { AuthService } from '../services/auth.service'
import { NgxUiLoaderService } from 'ngx-ui-loader'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  private config = new MatDialogConfig()
  
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private auth: AuthService,
    private ngxService: NgxUiLoaderService
  ) {
    this.config.width = "600px"
  }

  ngOnInit(): void {
    const token = this.auth.getTokenLocal()
    if(!token) return;

    this.ngxService.start()
    this.auth.checkToken(token).subscribe({

      next: () => {
        this.router.navigate(['/dashboard'])
      },
      error: (error) => {
        if(error?.error)
          console.error(error.error?.message)
        this.ngxService.stop()
      },
      complete: () => this.ngxService.stop()

    })
  }

  showSignupDialog() {
    this.dialog.open(SignupComponent, this.config)
  }

  showForgotPassDialog() {
    this.dialog.open(ForgotpassComponent, this.config)
  }

  showLoginDialog() {
    this.dialog.open(LoginComponent, this.config)
  }
}
