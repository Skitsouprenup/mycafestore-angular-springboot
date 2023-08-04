import { Component, OnInit } from '@angular/core'
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table'
import { BillService } from '../services/bill.service'
import { AuthService } from '../services/auth.service'
import { SnackbarService } from '../services/snackbar.service'
import { NgxUiLoaderService } from 'ngx-ui-loader'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { ViewbilldialogComponent } from '../dashboard-dialogs/bill/viewbilldialog/viewbilldialog.component'
import { BackendBillObject, BillDialogData } from 'src/scripts/types/bill'
import { DeletebilldialogComponent } from '../dashboard-dialogs/bill/deletebilldialog/deletebilldialog.component'
import { downloadFile } from 'src/scripts/utilities'

@Component({
  selector: 'app-dashboard-bill-view',
  templateUrl: './dashboard-bill-view.component.html',
  styleUrls: ['./dashboard-bill-view.component.scss']
})
export class DashboardBillViewComponent implements OnInit{

  tableColumnHeaders = ['name', 'email', 'contact', 'paymentMethod', 'total', 'actions']
  dataSource: MatTableDataSource<BackendBillObject, 
                MatTableDataSourcePaginator> = new MatTableDataSource()

  private dialogConfig = new MatDialogConfig()
  constructor(
    private ngxService: NgxUiLoaderService,
    private snackBarService: SnackbarService,
    private auth: AuthService,
    private billService: BillService,
    private dialog: MatDialog
  ) {
    this.dialogConfig.width = '100%'
  }

  ngOnInit(): void {
    this.getBills()
  }

  private getBills() {
    this.ngxService.start()

    const token = this.auth.getTokenLocal()
    if(!token) {
      console.error('Incomplete Authentication')
      this.snackBarService.openSnackBar('Server error: can\'t fetch bills', 'error')
      this.ngxService.stop()
      return
    }

    this.billService.getBills(token).subscribe({
      next: (response: unknown) => {
        this.ngxService.stop()
        //console.log(response)
        this.dataSource.data = response as BackendBillObject[]
      },
      error: (error) => {
        this.ngxService.stop()
        if(error?.error) console.error(error.error?.message)
        
        this.snackBarService.openSnackBar('Server error: can\'t fetch bills', 'error')
      }
    })
  }

  applyFilter(event: Event) {
    const filterText = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterText.trim().toLocaleLowerCase()
  }

  viewBill(columnData: BackendBillObject) {
    const dialogPayload: BillDialogData = {
      name: columnData.name,
      email: columnData.email,
      contactNumber: columnData.contactNumber,
      paymentMethod: columnData.paymentMethod,
      productDetails: columnData.productDetails,
      totalExpense: columnData.total
    }

    this.dialogConfig.data = dialogPayload
    this.dialog.open(ViewbilldialogComponent, this.dialogConfig)
  }

  deleteBill(name: string, id: number) {
    this.dialogConfig.data = { 
      name, 
      id: id.toString() 
    }
    const deleteDialog = this.dialog.open(DeletebilldialogComponent, this.dialogConfig)

    deleteDialog.componentInstance.onDelete.subscribe({

      next: (id: string) => {
        const dataSourceCopy = this.dataSource.data
        this.dataSource.data = dataSourceCopy.filter((item: BackendBillObject) => {
          return item.id.toString() !== id
        })
      },
      error: (error: any) => {
        console.error('onDelete deletebilldialog error: ' + error)
      }
    })
  }

  downloadBill(uuid: string) {
    this.ngxService.start()

    const token = this.auth.getTokenLocal()
    if(!token) {
      console.error('Incomplete Authentication')
      this.snackBarService.openSnackBar('Server error: can\'t download bill', 'error')
      this.ngxService.stop()
      return
    }

    this.billService.getPdf(token, { uuid }).subscribe({

      next: (response: unknown) => {
        this.ngxService.stop()
        downloadFile(response as Blob, uuid, '.pdf')

        this.snackBarService.openSnackBar('Bill record has been downloaded!', '')
      },
      error: (error) => {
        this.ngxService.stop()

        if(error?.error) {
          this.snackBarService.openSnackBar(error.error?.message, 'error')
        }
        else 
          this.snackBarService.openSnackBar('Server error: can\'t fetch data from server', 'error')
        
      }
    })
  }
}
