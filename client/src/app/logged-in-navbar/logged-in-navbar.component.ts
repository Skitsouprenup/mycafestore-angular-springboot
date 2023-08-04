import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LogoutdialogComponent } from '../dashboard-dialogs/logoutdialog/logoutdialog.component';
import { ChangepassdialogComponent } from '../dashboard-dialogs/changepassdialog/changepassdialog.component';

@Component({
  selector: 'app-logged-in-navbar',
  templateUrl: './logged-in-navbar.component.html',
  styleUrls: ['./logged-in-navbar.component.scss']
})
export class LoggedInNavbarComponent {
  private config = new MatDialogConfig()

  constructor(
    private dialog: MatDialog,
  ){
    this.config.width = '600px'
  }

  showLogoutDialog() {
    this.dialog.open(LogoutdialogComponent, this.config)
  }

  showChangePassDialog() {
    this.dialog.open(ChangepassdialogComponent, this.config)
  }
}
