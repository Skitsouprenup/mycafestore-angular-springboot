import { Component, EventEmitter, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { NgxUiLoaderService } from 'ngx-ui-loader'
import { AuthService } from 'src/app/services/auth.service'
import { CategoryService } from 'src/app/services/category.service'
import { SnackbarService } from 'src/app/services/snackbar.service'
import { UpdateCategoryPayload } from 'src/scripts/types/categorypayload'

@Component({
  selector: 'app-editcategorydialog',
  templateUrl: './editcategorydialog.component.html',
  styleUrls: ['./editcategorydialog.component.scss']
})
export class EditcategorydialogComponent implements OnInit{
  editCategoryForm: any = FormGroup
  public onEdit = new EventEmitter<{id: number, name: string, oldName: string}>()

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {id: number, name: string},
    private formBuilder: FormBuilder,
    private snackBarService: SnackbarService,
    public dialogRef: MatDialogRef<EditcategorydialogComponent>,
    private ngxService: NgxUiLoaderService,
    private categoryService: CategoryService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {

    this.editCategoryForm = this.formBuilder.group({
      name: [
        { value: this.data.name, disabled: false }, 
        [Validators.required]
      ],
    })
  }

  submitForm() {

    this.ngxService.start()
    this.dialogRef.close()

    let formData = this.editCategoryForm.value
    let payloadData: UpdateCategoryPayload = {
      name: formData.name,
      id: this.data.id.toString()
    }

    const token = this.auth.getTokenLocal()
    if(!token) {
      this.ngxService.stop()
      return
    }

    this.categoryService.updateCategory(token, payloadData).subscribe({

      next: (response: any) => {
        this.onEdit.emit({id: response?.id, name: response?.name, oldName: this.data.name})
        this.ngxService.stop()
        
        this.snackBarService.
        openSnackBar('Category "' + payloadData.name + '" has been edited!', '')
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
