import { Component, EventEmitter, Inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { NgxUiLoaderService } from 'ngx-ui-loader'
import { AuthService } from 'src/app/services/auth.service'
import { ProductService } from 'src/app/services/product.service'
import { SnackbarService } from 'src/app/services/snackbar.service'
import { CategoryType } from 'src/scripts/types/categorypayload'
import { UpdateProductPayload, BackendProductObject } from 'src/scripts/types/productpayload'

@Component({
  selector: 'app-editproductdialog',
  templateUrl: './editproductdialog.component.html',
  styleUrls: ['./editproductdialog.component.scss']
})
export class EditproductdialogComponent {
  public editProductForm: any = FormGroup
  public onEdit = new EventEmitter<BackendProductObject>()

  constructor(
    @Inject(MAT_DIALOG_DATA) 
    public data: { categories: CategoryType[], sourceData: UpdateProductPayload },
    private formBuilder: FormBuilder,
    private snackBarService: SnackbarService,
    public dialogRef: MatDialogRef<EditproductdialogComponent>,
    private ngxService: NgxUiLoaderService,
    private productService: ProductService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {

    this.editProductForm = this.formBuilder.group({
      name: [
        { value: this.data.sourceData.name, disabled: false }, 
        [Validators.required]
      ],
      price: [
        { value: this.data.sourceData.price, disabled: false }, 
        [Validators.required]
      ],
      categoryId: [
        { value: this.data.sourceData.categoryId, disabled: false }, 
        [Validators.required]
      ],
      description: [
        { value: this.data.sourceData.description, disabled: false },
        [Validators.required]
      ]
    })
  }

  submitForm() {
    this.ngxService.start()
    this.dialogRef.close()

    let formData = this.editProductForm.value
    let payloadData: UpdateProductPayload = {
      name: formData.name,
      categoryId: formData.categoryId,
      description: formData.description,
      price: formData.price,
      id: this.data.sourceData.id
    }

    const token = this.auth.getTokenLocal()
    if(!token) {
      this.ngxService.stop()
      return
    }

    this.productService.updateProduct(token, payloadData).subscribe({

      next: (response: any) => {
        //console.log(response)
        this.onEdit.emit(response)
        this.ngxService.stop()
        
        this.snackBarService.openSnackBar('Category "' + payloadData.name + '" has been edited!', '')
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
