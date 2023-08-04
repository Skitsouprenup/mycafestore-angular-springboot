import { Component, EventEmitter, Inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { NgxUiLoaderService } from 'ngx-ui-loader'
import { AuthService } from 'src/app/services/auth.service'
import { ProductService } from 'src/app/services/product.service'
import { SnackbarService } from 'src/app/services/snackbar.service'
import { CategoryType } from 'src/scripts/types/categorypayload'
import { BackendProductObject, AddProductPayload } from 'src/scripts/types/productpayload'

@Component({
  selector: 'app-addproductdialog',
  templateUrl: './addproductdialog.component.html',
  styleUrls: ['./addproductdialog.component.scss']
})
export class AddproductdialogComponent {
  public addProductForm: any = FormGroup
  public onAdd = new EventEmitter<BackendProductObject>()

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CategoryType[] | null,
    private formBuilder: FormBuilder,
    private snackBarService: SnackbarService,
    public dialogRef: MatDialogRef<AddproductdialogComponent>,
    private ngxService: NgxUiLoaderService,
    private productService: ProductService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const defaultFormControlState = { value: "", disabled: false }

    this.addProductForm = this.formBuilder.group({
      name: [
        defaultFormControlState, 
        [Validators.required]
      ],
      price: [
        defaultFormControlState,
        [Validators.required]
      ],
      categoryId: [
        defaultFormControlState,
        [Validators.required]
      ],
      description: [
        defaultFormControlState,
        [Validators.required]
      ]
    })
  }

  submitForm() {
    this.ngxService.start()
    this.dialogRef.close()

    let formData = this.addProductForm.value
    let payloadData: AddProductPayload = {
      name: formData.name,
      categoryId: formData.categoryId,
      description: formData.description,
      price: formData.price
    }

    const token = this.auth.getTokenLocal()
    if(!token) {
      this.ngxService.stop()
      return
    }

    this.productService.addProduct(token, payloadData).subscribe({

      next: (response: any) => {
        this.onAdd.emit(response)
        this.ngxService.stop()
        
        this.snackBarService.openSnackBar('Category "' + payloadData.name + '" has been added!', '')
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
