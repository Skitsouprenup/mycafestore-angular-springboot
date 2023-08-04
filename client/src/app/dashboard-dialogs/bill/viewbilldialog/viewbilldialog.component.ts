import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table'
import { BillDialogData, BillDialogTableDataSource } from 'src/scripts/types/bill'

@Component({
  selector: 'app-viewbilldialog',
  templateUrl: './viewbilldialog.component.html',
  styleUrls: ['./viewbilldialog.component.scss']
})
export class ViewbilldialogComponent {

  tableColumnHeaders = ['name', 'category', 'quantity', 'price', 'total']
  dataSource: MatTableDataSource<BillDialogTableDataSource, 
                MatTableDataSourcePaginator> = new MatTableDataSource()
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: BillDialogData,
    private dialogRef: MatDialogRef<ViewbilldialogComponent>
  ) {
    this.dataSource.data = JSON.parse(data.productDetails)
  }

}
