import { Component, OnInit } from '@angular/core'
import { MatDialogConfig } from '@angular/material/dialog'
import { NgxUiLoaderService } from 'ngx-ui-loader'
import { AuthService } from '../services/auth.service'
import { CategoryService } from '../services/category.service'
import { ProductService } from '../services/product.service'
import { SnackbarService } from '../services/snackbar.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { GlobalConstants } from 'src/scripts/global_constants'
import { BackendProductObject } from 'src/scripts/types/productpayload'
import { CategoryType } from 'src/scripts/types/categorypayload'
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table'
import { BillService } from '../services/bill.service'
import { ProductOrderDetails } from 'src/scripts/types/dashboard'
import { GenerateBillObject } from 'src/scripts/types/bill'
import { downloadFile, findCategoryName, findProductName } from 'src/scripts/utilities'
import orderFormGroup from './orderFormGroup'

@Component({
  selector: 'app-dashboard-order',
  templateUrl: './dashboard-order.component.html',
  styleUrls: ['./dashboard-order.component.scss'],
  
})
export class DashboardOrderComponent implements OnInit{
  paymentMethods = ['Cash', 'Credit Card', 'Debit Card']
  tableColumnHeaders = ['name', 'category', 'price', 'quantity', 'total', 'actions']
  orderForm: any = FormGroup
  dataSource: MatTableDataSource<ProductOrderDetails, 
                MatTableDataSourcePaginator> = new MatTableDataSource()
  private config = new MatDialogConfig()

  public subTotal = 0

  private products : BackendProductObject[] | null = null
  public categories : CategoryType[] | null = null
  public filteredProducts : BackendProductObject[] | null = null
  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private ngxService: NgxUiLoaderService,
    private snackBarService: SnackbarService,
    private auth: AuthService,
    private billService: BillService
  ) {
    this.config.width = '600px'
  }

  ngOnInit(): void {
    this.ngxService.start()

    const token = this.auth.getTokenLocal()
    if(!token) {
      console.error('Incomplete Authentication')
      this.snackBarService.openSnackBar('Server error: can\'t fetch products', 'error')
      this.ngxService.stop()
      return
    }

    this.orderForm = orderFormGroup(this.formBuilder)

    this.productService.getProducts(token).subscribe({

      next: (response: unknown) => {
        this.products = response as BackendProductObject[]
        
        this.categoryService.getCategories(token).subscribe({
          next: (response: unknown) => {
            this.categories = response as CategoryType[]
            this.ngxService.stop()
          },
          error: (error) => {
            this.ngxService.stop()
            if(error?.error) console.error(error.error?.message)
        
            this.snackBarService.openSnackBar('Server error: can\'t fetch categories', 'error')
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

  filterProductChoices(categoryIndex: number | undefined) {
    if(categoryIndex === undefined) return
    if(categoryIndex < 0) return

    if(this.categories && this.products) {
      let categoryChoice : CategoryType | null = null
      if(this.categories.length) categoryChoice = this.categories[categoryIndex]
      else return

      this.orderForm.get('productName').setValue('')
      this.filteredProducts = this.products.filter(
        (item: BackendProductObject) => {
          return item.categoryId.toString() === categoryChoice?.id.toString()
        }
      )

      this.orderForm.get('price').setValue('')
      this.orderForm.get('total').setValue('')
      if(this.filteredProducts.length) {
        this.orderForm.get('productName').enable()
        this.orderForm.get('price').setValue(this.filteredProducts[0].price)
        this.displayPrice(this.filteredProducts[0].price)
      }
     
    } else return
  }

  displayPrice(price: number | undefined) {
    if(price === undefined) return
    if(price < 0) return

    this.orderForm.get('price').setValue(price.toString())
    this.computeSubTotal()
  }

  /*
    Not a good way to compute total price of a product per quantity.
    Best way is to compute the total price in the backend and
    use BigDecimal for an accurate price.

    This solution suffers from rounding errors due to floating-point
    values which can lead to imprecise price. Since this is just 
    a demo project, this solution is enough for this project
  */
  computeSubTotal() {
    if(!this.orderForm.get('quantity').invalid && 
       this.orderForm.get('price').value) {
        const total = 
          this.orderForm.get('price').value * 
          this.orderForm.get('quantity').value
        
        if(isNaN(total))this.orderForm.get('total').setValue('')
        else this.orderForm.get('total').setValue(total.toFixed(2))
    } else this.orderForm.get('total').setValue('')
  }

  computeOrderTotal() {
    let result : number = 0
    if(!this.dataSource) return result

    for(const item of this.dataSource.data) {
      result += Number(item.total)
    }

    return result
  }

  placeOrderAndGenerateBill() {
    this.ngxService.start()

    const token = this.auth.getTokenLocal()
    if(!token) {
      this.snackBarService.openSnackBar('Incomplete Authentication', 'error')
      this.ngxService.stop()
      return
    }

    const payload: GenerateBillObject = {
      isGenerate: "true",
      name: this.orderForm.get('customerName').value,
      email: this.orderForm.get('email').value,
      contactNumber: this.orderForm.get('contactNumber').value,
      paymentMethod: this.orderForm.get('paymentMethod').value,
      productDetails: JSON.stringify(this?.dataSource?.data),
      total: this.computeOrderTotal().toFixed(2).toString()
    }

    this.billService.generateReport(token, payload).subscribe({

      next: (response: unknown) => {
        const fileUuid = response as { uuid: string }

        this.billService.getPdf(token,{ uuid: fileUuid.uuid }).subscribe({
          next: (response: unknown) => {
            this.ngxService.stop()
            downloadFile(response as Blob, fileUuid.uuid, '.pdf')
            this.orderForm.reset()
            if(this.dataSource)
              this.dataSource.data = []

            this.snackBarService.openSnackBar('Order has been placed!', '')
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

  deleteProduct(index: number) {
    if(!this.dataSource) return

    const dataSourceCopy = this.dataSource.data

    this.dataSource.data = 
      dataSourceCopy.filter((item: any) => {
        return item.id !== index
      })
  }

  addProduct() {
    if(!this.dataSource)
      this.dataSource = new MatTableDataSource()

    const dataSourceCopy = this.dataSource.data
    const productDetails : ProductOrderDetails = {
      id: this.dataSource.data?.length,
      name: findProductName(
        this.products as BackendProductObject[], 
        this.orderForm.get('productName').value
      ),
      category: findCategoryName(
        this.categories as CategoryType[],
        this.orderForm.get('productCategory').value
      ),
      price: this.orderForm.get('price').value,
      quantity: this.orderForm.get('quantity').value,
      total: this.orderForm.get('total').value
    }
    dataSourceCopy.push(productDetails)

    this.dataSource.data = dataSourceCopy
  }
}
