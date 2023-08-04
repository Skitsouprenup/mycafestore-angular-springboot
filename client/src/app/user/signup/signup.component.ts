import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { UserService } from '../../services/user.service'
import { SnackbarService } from '../../services/snackbar.service'
import { MatDialogRef } from '@angular/material/dialog'
import { NgxUiLoaderService } from 'ngx-ui-loader'
import { GlobalConstants } from '../../../../src/scripts/global_constants'
import { signupPayload } from '../../../../src/scripts/types/userpayload'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit{
  public showPass = false
  public showConfirmPass = false
  public signupForm: any = FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackBarService: SnackbarService,
    public dialogRef: MatDialogRef<SignupComponent>,
    private ngxService: NgxUiLoaderService
  ) {}

  /*
    ngOnInit() is Initialized when this component is created

    Note: the properties syntax in group() is equivalent
    to initializing FormControl:
    e.g.
    name: [null, [validators...]] is equal to  
    name: new FormControl(FormControlState, validators...)
  */
  ngOnInit(): void {
    const defaultFormControlState = { value: "", disabled: false }

    this.signupForm = this.formBuilder.group({
      name: [
        defaultFormControlState, 
        [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]
      ],
      email: [
        defaultFormControlState, 
        [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]
      ],
      contactNumber: [
        defaultFormControlState, 
        [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]
      ],
      password: [
        defaultFormControlState, 
        [Validators.required]
      ],
      confirmPassword: [
        defaultFormControlState, 
        [Validators.required]
      ],
    })
  }

  validatePassword() {
    let result = true

    if(this.signupForm.controls['password'].value !== 
       this.signupForm.controls['confirmPassword'].value) {
        result = false
    }

    return result
  }

  submitForm() {
    this.ngxService.start()
    let formData = this.signupForm.value
    let data: signupPayload = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password
    }

    this.userService.signup(data).subscribe({

      next: (response: any) => {
        this.dialogRef.close()
        const message = response?.message
        this.snackBarService.openSnackBar(message, "")
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
