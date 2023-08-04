import { Component, OnInit } from '@angular/core'
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table'
import { NgxUiLoaderService } from 'ngx-ui-loader'
import { AuthService } from 'src/app/services/auth.service'
import { SnackbarService } from 'src/app/services/snackbar.service'
import { UserService } from 'src/app/services/user.service'
import { GetUsersObject, UpdateUserStatusPayload } from 'src/scripts/types/userpayload'

@Component({
  selector: 'app-updateuserstatus',
  templateUrl: './updateuserstatus.component.html',
  styleUrls: ['./updateuserstatus.component.scss']
})
export class UpdateuserstatusComponent implements OnInit{

  tableColumnHeaders = ['name', 'email', 'contact', 'actions']
  dataSource: MatTableDataSource<GetUsersObject, 
                MatTableDataSourcePaginator> = new MatTableDataSource()

  constructor(
    private ngxService: NgxUiLoaderService,
    private userService: UserService,
    private snackBarService: SnackbarService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.ngxService.start()

    const token = this.auth.getTokenLocal()
    if(!token) {
      console.error('Incomplete Authentication')
      this.snackBarService.openSnackBar('Server error: can\'t fetch users', 'error')
      this.ngxService.stop()
      return
    }

    this.userService.getUsers(token).subscribe({

      next: (response: unknown) => {
        this.ngxService.stop()
        this.dataSource.data = response as GetUsersObject[]
      },
      error: (error) => {
        this.ngxService.stop()

        if(error?.error)
          this.snackBarService.openSnackBar(error.error?.message, 'error')
        else 
          this.snackBarService.openSnackBar('Server Error: can\'t fetch users', 'error')
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    if(this.dataSource)
      this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  updateUserStatus(checked: boolean, id: number) {
    this.ngxService.start()

    const token = this.auth.getTokenLocal()
    if(!token) {
      console.error('can\'t find authorization token')
      this.snackBarService.openSnackBar('Incomplete Authentication', 'error')
      this.ngxService.stop()
      return
    }

    const payload: UpdateUserStatusPayload = 
    { 
      id: id.toString(), 
      status: checked.toString() 
    }
    this.userService.updateUser(token, payload).subscribe({
      next: () => {
        this.ngxService.stop()
      },
      error: (error) => {
        this.ngxService.stop()

        if(error?.error)
          this.snackBarService.openSnackBar(error.error?.message, 'error')
        else this.snackBarService.openSnackBar('User status can\'t be updated', 'error')
      }
    })
  }
}
