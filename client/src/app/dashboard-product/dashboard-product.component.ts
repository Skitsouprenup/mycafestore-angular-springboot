import { Component, OnInit } from '@angular/core'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { ProductService } from '../services/product.service'
import { NgxUiLoaderService } from 'ngx-ui-loader'
import { AuthService } from '../services/auth.service'
import { SnackbarService } from '../services/snackbar.service'
import { MatTableDataSource } from '@angular/material/table'
import { CategoryService } from '../services/category.service'
import { CategoryType } from 'src/scripts/types/categorypayload'
import { AddproductdialogComponent } from '../dashboard-dialogs/product/addproductdialog/addproductdialog.component'
import { 
  AddProductPayload, 
  UpdateProductPayload, 
  BackendProductObject,
  UpdateProductStatusPayload 
} from 'src/scripts/types/productpayload'
import { EditproductdialogComponent } from '../dashboard-dialogs/product/editproductdialog/editproductdialog.component'
import { DeleteproductdialogComponent } from '../dashboard-dialogs/product/deleteproductdialog/deleteproductdialog.component'

@Component({
  selector: 'app-dashboard-product',
  templateUrl: './dashboard-product.component.html',
  styleUrls: ['./dashboard-product.component.scss']
})
export class DashboardProductComponent implements OnInit{

  tableColumnHeaders = ['name','category', 'description', 'price', 'actions']
  dataSource: any
  categorySource: CategoryType[] | null = null
  private config = new MatDialogConfig()

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private ngxService: NgxUiLoaderService,
    private snackBarService: SnackbarService,
    private auth: AuthService,
    private dialog: MatDialog
  ) {
    this.config.width = '600px'
  }

  ngOnInit(): void {
    this.fetchProducts()
  }

  fetchProducts() {
    this.ngxService.start()

    const token = this.auth.getTokenLocal()
    if(!token) {
      console.error('Incomplete Authentication')
      this.snackBarService.openSnackBar('Server error: can\'t fetch products', 'error')
      this.ngxService.stop()
      return
    }

    this.productService.getProducts(token).subscribe({

      next: (response: any) => {
        //console.log(response)
        this.dataSource = new MatTableDataSource(response)

        this.categoryService.getCategories(token).subscribe({

          next: (response: any) => {
            this.ngxService.stop()
            this.categorySource = response
          },
          error: (error) => {
            this.ngxService.stop()

            if(error?.error) console.error(error.error?.message)
            this.snackBarService.openSnackBar('Server error: can\'t fetch products', 'error')
          }
        })
      },
      error: (error) => {
        this.ngxService.stop()

        if(error?.error)
          console.error(error.error?.message)
        
        this.snackBarService.openSnackBar('Server error: can\'t fetch products', 'error')
      }

    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    if(this.dataSource)
      this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  addProduct() {
    if(!this.categorySource) {
      this.snackBarService.openSnackBar('Server error: can\'t fetch categories', 'error')
      return
    }

    this.config.data = this.categorySource
    const addProductDialog = this.dialog.open(AddproductdialogComponent, this.config)

    addProductDialog.componentInstance.onAdd.subscribe({
      next: (response: AddProductPayload) => {
        if(this.dataSource) {
          const data = this.dataSource.data = [...this.dataSource.data, response]
          //console.log(data)
        }
      },
      error: (error: any) => {
        console.error(error)
      }
    })
  }

  editProduct(element: UpdateProductPayload) {
    if(!this.categorySource) {
      this.snackBarService.openSnackBar('Server error: can\'t fetch categories', 'error')
      return
    }

    this.config.data = { 
      categories: this.categorySource,
      sourceData: element
    }
    const addProductDialog = this.dialog.open(EditproductdialogComponent, this.config)

    addProductDialog.componentInstance.onEdit.subscribe({
      next: (response: BackendProductObject) => {
        if(this.dataSource) {
          const dataSourceCopy = this.dataSource.data
          for(let i = 0; i < dataSourceCopy.length; i++) {
            if(this.dataSource.data[i].id.toString() === response.id.toString())
              dataSourceCopy[i] = response
          }
          this.dataSource = dataSourceCopy
        }
      },
      error: (error: any) => {
        console.error(error)
      }
    })
  }

  deleteProduct(id: string, productName: string) {

    this.config.data = { id, productName }
    const addProductDialog = this.dialog.open(DeleteproductdialogComponent, this.config)

    addProductDialog.componentInstance.onDelete.subscribe({
      next: (response: { id: number }) => {
        if(this.dataSource) {
          const dataSourceCopy = 
          this.dataSource.data.filter((item: BackendProductObject) => item.id !== response.id)
          this.dataSource.data = dataSourceCopy
          //console.log(data)
        }
      },
      error: (error: any) => {
        console.error(error)
      }
    })
  }

  updateProductStatus(isChecked: boolean, id: number) {
    this.ngxService.start()

    const token = this.auth.getTokenLocal()
    if(!token) {
      console.error('can\'t find authorization token')
      this.snackBarService.openSnackBar('Incomplete Authentication', 'error')
      this.ngxService.stop()
      return
    }

    const payload: UpdateProductStatusPayload = 
    { id: id.toString(), status: isChecked.toString() }
    this.productService.updateProductStatus(token, payload).subscribe({
      next: () => {
        this.ngxService.stop()
      },
      error: (error) => {
        this.ngxService.stop()

        if(error?.error)
          this.snackBarService.openSnackBar(error.error?.message, 'error')
        else this.snackBarService.openSnackBar('Product status can\'t be updated', 'error')
      }
    })

  }

}
