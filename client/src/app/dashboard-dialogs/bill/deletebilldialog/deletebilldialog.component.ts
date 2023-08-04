import { Component, EventEmitter, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { NgxUiLoaderService } from 'ngx-ui-loader'
import { AuthService } from 'src/app/services/auth.service'
import { BillService } from 'src/app/services/bill.service'
import { SnackbarService } from 'src/app/services/snackbar.service'

@Component({
  selector: 'app-deletebilldialog',
  templateUrl: './deletebilldialog.component.html',
  styleUrls: ['./deletebilldialog.component.scss']
})
export class DeletebilldialogComponent {

  onDelete = new EventEmitter<string>()

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { name: string, id: string },
    private billService: BillService,
    private ngxService: NgxUiLoaderService,
    private auth: AuthService,
    private snackBarService: SnackbarService,
    private dialogRef: MatDialogRef<DeletebilldialogComponent>
  ) {}

  deleteBill() {
    this.ngxService.start()
    this.dialogRef.close()

    const token = this.auth.getTokenLocal()
    if(!token) {
      console.error('Incomplete Authentication')
      this.snackBarService.openSnackBar('Server Error: Bill can\'t be deleted.', 'error')
      this.ngxService.stop()
      return
    }

    this.billService.deleteBill(token, this.data.id).subscribe({

      next: (response: any) => {
        this.ngxService.stop()
        this.onDelete.emit(this.data.id)

        if(response?.message)
          this.snackBarService.openSnackBar(response.message, '')
        else this.snackBarService.openSnackBar('Product has been deleted', '')
      },
      error: (error) => {
        this.ngxService.stop()

        if(error?.error)
          this.snackBarService.openSnackBar(error.error?.message, 'error')
        else this.snackBarService.
              openSnackBar('Server Error: Bill can\'t be deleted.', 'error')
      }
    })
  }

}
