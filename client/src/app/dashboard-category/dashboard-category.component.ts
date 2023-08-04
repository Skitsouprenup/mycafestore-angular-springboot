import { Component, OnInit } from '@angular/core'
import { CategoryService } from '../services/category.service'
import { NgxUiLoaderService } from 'ngx-ui-loader'
import { SnackbarService } from '../services/snackbar.service'
import { AuthService } from '../services/auth.service'
import { MatTableDataSource } from '@angular/material/table'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { AddcategorydialogComponent } from '../dashboard-dialogs/category/addcategorydialog/addcategorydialog.component'
import { EditcategorydialogComponent } from '../dashboard-dialogs/category/editcategorydialog/editcategorydialog.component'
import { CategoryType } from 'src/scripts/types/categorypayload'

@Component({
  selector: 'app-dashboard-category',
  templateUrl: './dashboard-category.component.html',
  styleUrls: ['./dashboard-category.component.scss']
})
export class DashboardCategoryComponent implements OnInit {

  tableColumnHeaders = ['name','edit']
  dataSource: any;
  private config = new MatDialogConfig()

  constructor(
    private categoryService: CategoryService,
    private ngxService: NgxUiLoaderService,
    private snackBarService: SnackbarService,
    private auth: AuthService,
    private dialog: MatDialog
  ) {
    this.config.width = '600px'
  }

  ngOnInit(): void {
    this.fetchCategories()
  }

  fetchCategories() {
    this.ngxService.start()

    const token = this.auth.getTokenLocal()
    if(!token) {
      console.error('can\'t find authorization token')
      this.snackBarService.openSnackBar('Server error: can\'t fetch categories', 'error')
      this.ngxService.stop()
      return
    }

    this.categoryService.getCategories(token).subscribe({

      next: (response: any) => {
        this.ngxService.stop()
        //console.log(response)
        this.dataSource = new MatTableDataSource(response)
      },
      error: (error) => {
        this.ngxService.stop()

        if(error?.error)
          console.error(error.error?.message)
        
        this.snackBarService.openSnackBar('Server error: can\'t fetch categories', 'error')
      }

    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    if(this.dataSource)
      this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  addCategory() {
    const addCategoryDialog = this.dialog.open(AddcategorydialogComponent, this.config)

    addCategoryDialog.componentInstance.onAdd.subscribe({
      next: (response: {id: number, name: string}) => {
        if(this.dataSource) {
          const data = this.dataSource.data = [...this.dataSource.data, response]
          console.log(data)
        }
      },
      error: (error: any) => {
        console.error(error)
      }
    })
  }

  editCategory(id: string, name: string){
    this.config.data = { id, name }

    const addCategoryDialog = 
      this.dialog.open(EditcategorydialogComponent, this.config)

    addCategoryDialog.componentInstance.onEdit.subscribe({
      next: (response: {id: number, name: string, oldName: string}) => {
        if(this.dataSource) {
          const data = 
            this.dataSource.data.
              filter(
                (item: {id: number, name: string}) => item.name !== response.oldName
              )
          this.dataSource.data = [...data, response]
        }
      },
      error: (error: any) => {
        console.error(error)
      }
    })
  }

}
