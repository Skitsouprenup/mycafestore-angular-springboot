import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { SnackbarService } from 'src/app/services/snackbar.service'
import { UserService } from 'src/app/services/user.service'
import { NgxUiLoaderService } from 'ngx-ui-loader'
import { GlobalConstants } from 'src/scripts/global_constants'
import { loginPayload } from 'src/scripts/types/userpayload'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  showPass = false
  loginForm : any = FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private snackBarService: SnackbarService,
    public dialogRef: MatDialogRef<LoginComponent>,
    private ngxService: NgxUiLoaderService
  ){}

  ngOnInit(): void {
    const defaultFormControlState = { value: "", disabled: false }

    this.loginForm = this.formBuilder.group({
      email: [
        defaultFormControlState, 
        [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]
      ],
      password: [
        defaultFormControlState, [Validators.required]
      ],
    })
  }

  submitForm() {
    this.ngxService.start()
    let formData = this.loginForm.value
    let data: loginPayload = {
      email: formData.email,
      password: formData.password
    }

    this.userService.login(data).subscribe({

      next: (response: any) => {
        this.dialogRef.close()
        localStorage.setItem('token', response.Token)
        this.router.navigate(['/dashboard'])
      },
      error: (error) => {
        this.dialogRef.close()

        let message = GlobalConstants.genericError
        if(error.error?.message)
          message = error.error?.message
        
        this.snackBarService.openSnackBar(message, 'error')

        this.ngxService.stop()
      },
      complete: () => this.ngxService.stop()

    })
  }

}
