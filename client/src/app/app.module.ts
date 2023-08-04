import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { UiMaterialModule } from '../modules/ui-material/ui-material.module'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { SignupComponent } from './user/signup/signup.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HomeComponent } from './home/home.component'
import { NgxUiLoaderConfig, NgxUiLoaderModule, SPINNER } from 'ngx-ui-loader'
import { ForgotpassComponent } from './user/forgotpass/forgotpass.component'
import { LoginComponent } from './user/login/login.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { LoggedInNavbarComponent } from './logged-in-navbar/logged-in-navbar.component'
import { DashboardDialogsModule } from './dashboard-dialogs/dashboard-dialogs.module';
import { DashboardCategoryComponent } from './dashboard-category/dashboard-category.component';
import { DashboardStatsComponent } from './dashboard-stats/dashboard-stats.component';
import { DashboardProductComponent } from './dashboard-product/dashboard-product.component';
import { DashboardOrderComponent } from './dashboard-order/dashboard-order.component';
import { DashboardBillViewComponent } from './dashboard-bill-view/dashboard-bill-view.component';
import { UpdateuserstatusComponent } from './user/updateuserstatus/updateuserstatus.component'

const ngxLoaderConfig: NgxUiLoaderConfig = {
  text: "Loading...",
  textColor:"#FFFFFF",
  fgsType: SPINNER.threeStrings,
  fgsSize: 100,
  hasProgressBar: false
}

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    HomeComponent,
    ForgotpassComponent,
    LoginComponent,
    DashboardComponent,
    LoggedInNavbarComponent,
    DashboardCategoryComponent,
    DashboardStatsComponent,
    DashboardProductComponent,
    DashboardOrderComponent,
    DashboardBillViewComponent,
    UpdateuserstatusComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    UiMaterialModule,
    DashboardDialogsModule,
    NgxUiLoaderModule.forRoot(ngxLoaderConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
