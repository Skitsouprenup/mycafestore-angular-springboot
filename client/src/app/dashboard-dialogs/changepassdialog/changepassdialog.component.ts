import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { NgxUiLoaderService } from 'ngx-ui-loader'
import { AuthService } from 'src/app/services/auth.service'
import { SnackbarService } from 'src/app/services/snackbar.service'
import { UserService } from 'src/app/services/user.service'
import { GlobalConstants } from 'src/scripts/global_constants'
import { changePassPayload } from 'src/scripts/types/userpayload'

@Component({
  selector: 'app-changepassdialog',
  templateUrl: './changepassdialog.component.html',
  styleUrls: ['./changepassdialog.component.scss']
})
export class ChangepassdialogComponent implements OnInit{
  public changePassForm: any = FormGroup

  public passwordFields = [
    {
      label: 'Current Password',
      controlName: 'currentPassword',
      visible: false,
      ariaLabel: 'Toggle Show/Hide current password',
      ariaPressed: 'Current password',
      requiredCondition: `changePassForm.controls.currentPassword.errors.required`,
      invalidCondition: 
      'changePassForm.controls.currentPassword.touched && ' +
      'changePassForm.controls.currentPassword.invalid'
    },
    {
      label: 'New Password',
      controlName: 'newPassword',
      visible: false,
      ariaLabel: 'Toggle Show/Hide current password',
      ariaPressed: 'New password',
      requiredCondition: 'changePassForm.controls.newPassword.errors.required',
      invalidCondition: 
      'changePassForm.controls.newPassword.touched && ' +
      'changePassForm.controls.newPassword.invalid'
    },
    {
      label: 'Confirm Password',
      controlName: 'confirmNewPassword',
      visible: false,
      ariaLabel: 'Toggle Show/Hide current password',
      ariaPressed: 'Confirm new password',
      requiredCondition: 'changePassForm.controls.confirmNewPassword.errors.required',
      invalidCondition: 
      'changePassForm.controls.confirmNewPassword.touched && ' +
      'changePassForm.controls.confirmNewPassword.invalid'
    }
  ]

  validatePassword() {
    let result = true

    if(this.changePassForm.controls['newPassword'].value !== 
       this.changePassForm.controls['confirmNewPassword'].value) {
        result = false
    }

    return result
  }

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackBarService: SnackbarService,
    public dialogRef: MatDialogRef<ChangepassdialogComponent>,
    private ngxService: NgxUiLoaderService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const defaultFormControlState = { value: "", disabled: false }

    this.changePassForm = this.formBuilder.group({
      currentPassword: [
        defaultFormControlState, 
        [Validators.required]
      ],
      newPassword: [
        defaultFormControlState, [Validators.required]
      ],
      confirmNewPassword: [
        defaultFormControlState, [Validators.required]
      ],
    })
  }

  submitForm() {
    this.ngxService.start()
    this.dialogRef.close()

    const token = this.auth.getTokenLocal()
    if(!token) {
      this.snackBarService.openSnackBar('Incomplete Authentication', 'error')
      this.ngxService.stop()
      return
    }

    let formData = this.changePassForm.value
    let data: changePassPayload = {
      oldPass: formData.currentPassword,
      newPass: formData.newPassword
    }

    this.userService.changePass(token, data).subscribe({

      next: (response: any) => {
        const message = response?.message
        this.snackBarService.openSnackBar(message, '')
      },
      error: (error) => {

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
