import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { SnackbarService } from 'src/app/services/snackbar.service'
import { UserService } from 'src/app/services/user.service'
import { NgxUiLoaderService } from 'ngx-ui-loader'
import { GlobalConstants } from 'src/scripts/global_constants'
import { forgotPassPayload } from 'src/scripts/types/userpayload'

@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.component.html',
  styleUrls: ['./forgotpass.component.scss']
})
export class ForgotpassComponent implements OnInit{
  forgotPassForm: any = FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackBarService: SnackbarService,
    public dialogRef: MatDialogRef<ForgotpassComponent>,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    const defaultFormControlState = { value: "", disabled: false }

    this.forgotPassForm = this.formBuilder.group({
      email: [
        defaultFormControlState, 
        [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]
      ],
    })
  }

  submitForm() {
    this.ngxService.start()
    let formData = this.forgotPassForm.value
    let data: forgotPassPayload = {
      email: formData.email
    }

    this.userService.forgotPass(data).subscribe({

      next: (response: any) => {
        this.dialogRef.close()
        const message = response?.message
        this.snackBarService.openSnackBar(message, '')
      },
      error: (error) => {
        this.dialogRef.close()

        let message = GlobalConstants.genericError
        if(error.error?.message)
          message = error.error?.message
        
        this.snackBarService.openSnackBar(message, "error")
      },
      complete: () => this.ngxService.stop()

    })
  }

}
