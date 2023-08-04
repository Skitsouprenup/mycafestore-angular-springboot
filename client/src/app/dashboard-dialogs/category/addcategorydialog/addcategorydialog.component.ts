import { Component, EventEmitter, Inject, OnInit } from '@angular/core'
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { NgxUiLoaderService } from 'ngx-ui-loader'
import { AuthService } from 'src/app/services/auth.service'
import { CategoryService } from 'src/app/services/category.service'
import { SnackbarService } from 'src/app/services/snackbar.service'
import { AddCategoryPayload } from 'src/scripts/types/categorypayload'

@Component({
  selector: 'app-addcategorydialog',
  templateUrl: './addcategorydialog.component.html',
  styleUrls: ['./addcategorydialog.component.scss']
})
export class AddcategorydialogComponent implements OnInit{
  private defaultFormControlState = { value: "", disabled: false }
  public onAdd = new EventEmitter<{id: number, name: string}>()
  public addCategoryForm: FormGroup<{ name: FormControl<string | null> }> = 
    new FormGroup({name: new FormControl()})

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {id: number, name: string},
    private snackBarService: SnackbarService,
    public dialogRef: MatDialogRef<AddcategorydialogComponent>,
    private ngxService: NgxUiLoaderService,
    private categoryService: CategoryService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.addCategoryForm = new FormGroup({
      name: new FormControl(this.defaultFormControlState, [Validators.required])
    })

  }

  checkFormRequired() {
    const errors: ValidationErrors = 
      this.addCategoryForm.get('name')?.errors as ValidationErrors

    return errors['required'] ? true : false
  }

  submitForm() {
    this.ngxService.start()
    this.dialogRef.close()

    let formData = this.addCategoryForm.value
    let data: AddCategoryPayload = {
      name: formData.name as string
    }

    const token = this.auth.getTokenLocal()
    if(!token) {
      this.ngxService.stop()
      return
    }

    this.categoryService.addCategory(token, data).subscribe({

      next: (response: any) => {
        console.log(response)
        this.onAdd.emit(response)
        this.ngxService.stop()
        
        this.snackBarService.openSnackBar('Category "' + data.name + '" has been added!', '')
      },
      error: (error) => {
        console.log(error)
        this.ngxService.stop()

        if(error?.error)
          this.snackBarService.openSnackBar(error.error?.message, 'error')
      }

    })
  }

}
