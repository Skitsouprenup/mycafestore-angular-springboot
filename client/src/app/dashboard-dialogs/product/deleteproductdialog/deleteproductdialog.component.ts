import { Component, EventEmitter, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { NgxUiLoaderService } from 'ngx-ui-loader'
import { AuthService } from 'src/app/services/auth.service'
import { ProductService } from 'src/app/services/product.service'
import { SnackbarService } from 'src/app/services/snackbar.service'

@Component({
  selector: 'app-deleteproductdialog',
  templateUrl: './deleteproductdialog.component.html',
  styleUrls: ['./deleteproductdialog.component.scss']
})
export class DeleteproductdialogComponent {

  public onDelete = new EventEmitter<{id: number}>()
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {id: string, productName: string},
    private productService: ProductService,
    private auth: AuthService,
    private snackBarService: SnackbarService,
    public dialogRef: MatDialogRef<DeleteproductdialogComponent>,
    private ngxService: NgxUiLoaderService
  ){}

  deleteProduct() {
    this.ngxService.start()
    this.dialogRef.close()

    const token = this.auth.getTokenLocal()
    if(!token) {
      this.ngxService.stop()
      this.snackBarService.openSnackBar('Incomplete Authentication', 'error')
      return
    }

    this.productService.deleteProduct(token, this.data.id).subscribe({

      next: () => {
        this.onDelete.emit({ id: Number(this.data.id) })
        this.snackBarService.openSnackBar(this.data.productName + ' has been deleted.', '')
        this.ngxService.stop()
      },
      error: (error) => {
        if(error?.error)
          this.snackBarService.openSnackBar(error.error?.message, 'error')
        this.ngxService.stop()
      },
    })
  }
}
