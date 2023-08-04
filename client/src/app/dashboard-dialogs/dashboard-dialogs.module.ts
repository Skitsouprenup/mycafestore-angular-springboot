import { NgModule } from '@angular/core'
import { LogoutdialogComponent } from './logoutdialog/logoutdialog.component'
import { ChangepassdialogComponent } from './changepassdialog/changepassdialog.component'
import { UiMaterialModule } from 'src/modules/ui-material/ui-material.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { AddcategorydialogComponent } from './category/addcategorydialog/addcategorydialog.component';
import { EditcategorydialogComponent } from './category/editcategorydialog/editcategorydialog.component';
import { AddproductdialogComponent } from './product/addproductdialog/addproductdialog.component';
import { EditproductdialogComponent } from './product/editproductdialog/editproductdialog.component';
import { DeleteproductdialogComponent } from './product/deleteproductdialog/deleteproductdialog.component';
import { ViewbilldialogComponent } from './bill/viewbilldialog/viewbilldialog.component';
import { DeletebilldialogComponent } from './bill/deletebilldialog/deletebilldialog.component'

@NgModule({
  declarations: [
    LogoutdialogComponent,
    ChangepassdialogComponent,
    AddcategorydialogComponent,
    EditcategorydialogComponent,
    AddproductdialogComponent,
    EditproductdialogComponent,
    DeleteproductdialogComponent,
    ViewbilldialogComponent,
    DeletebilldialogComponent
  ],
  imports :[
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiMaterialModule
  ]
})
export class DashboardDialogsModule { }
