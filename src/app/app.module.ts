import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule} from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {DatePipe} from '@angular/common';
import { DataTablesModule } from 'angular-datatables'; // for DataTable
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar
import { CKEditorModule } from 'ngx-ckeditor'; // for CkEditor
import { SafeHtmlPipe } from './safeHtml.pipe';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ViewleavesComponent } from './viewleaves/viewleaves.component';
import { ViewownleavesComponent } from './viewownleaves/viewownleaves.component';
import { ViewEmployeeComponent } from './viewemployee/viewemployee.component';
import { AddEmployeeComponent } from './addemployee/addemployee.component';
import { EditEmployeeComponent } from './editemployee/editemployee.component';
import { EditProfileComponent } from './editprofile/editprofile.component';
import { SetpasswordComponent } from './setpassword/setpassword.component';
import { TooltipsComponent } from './tooltips/tooltips.component';
import { EventcalendarComponent } from './eventcalendar/eventcalendar.component';
import { ViewSuperiorsComponent } from './viewsuperior/viewsuperior.component';
import { AddprojectsComponent } from './addprojects/addprojects.component';
import { ViewprojectsComponent } from './viewprojects/viewprojects.component';
import { ProjectDetailsComponent } from './projectdetails/projectdetails.component';
import { ViewTeamComponent } from './viewteam/viewteam.component';
import { AddreportsComponent } from './addreports/addreports.component';
import { ViewreportsComponent } from './viewreports/viewreports.component';
import { ReportdetailsComponent } from './reportdetails/reportdetails.component';
import { ViewprojectreportsComponent } from './viewprojectreports/viewprojectreports.component';
import { DepartmentteamsComponent } from './departmentteams/departmentteams.component';
import { ClipboardModule } from 'ngx-clipboard';
import { ViewtasksComponent } from './viewtasks/viewtasks.component';
import { AddtaskComponent } from './addtask/addtask.component';
import { AddcommentComponent } from './addcomment/addcomment.component';

import { HiringModuleComponent } from './hiring-module/hiring-module.component';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { TimeclockComponent } from './timeclock/timeclock.component';
import { NumericDirective } from "./numeric.directive";
import { MultieventCalenderComponent } from './multievent-calender/multievent-calender.component';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth.guard';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { WorkFromHomeComponent } from './work-from-home/work-from-home.component';
import { TaskReportComponent } from './task-report/task-report.component';
import { WorkFromHomeDetailsComponent } from './work-from-home-details/work-from-home-details.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    BreadcrumbsComponent,
    FooterComponent,
    DashboardComponent,
    ForgotpasswordComponent,
    ViewleavesComponent,
    ViewownleavesComponent,
    ViewEmployeeComponent,
    AddEmployeeComponent,
    EditEmployeeComponent,
    EditProfileComponent,
    SetpasswordComponent,
    LoginComponent,
    ViewSuperiorsComponent,
    TooltipsComponent,
    EventcalendarComponent,
    AddprojectsComponent,
    ViewprojectsComponent,
    ProjectDetailsComponent,
    ViewTeamComponent,
    AddreportsComponent,
    ViewreportsComponent,
    ReportdetailsComponent,
    ViewprojectreportsComponent,
    DepartmentteamsComponent,
    SafeHtmlPipe,
    ViewtasksComponent,
    AddtaskComponent,
    AddcommentComponent,
    HiringModuleComponent,
    TimeclockComponent,
    NumericDirective,
    MultieventCalenderComponent,
    WorkFromHomeComponent,
    TaskReportComponent,
    WorkFromHomeDetailsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    NgbModule.forRoot(),
    BsDatepickerModule.forRoot(),
    HttpClientModule,
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    DataTablesModule, // for DataTable
    FullCalendarModule, // for FullCalendar
    CKEditorModule, // for CkEditor
    ReactiveFormsModule,
    ClipboardModule,  // for Copy to clipboard
    TimepickerModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [
    DatePipe,AuthService,AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
