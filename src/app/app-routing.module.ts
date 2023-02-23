import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { TimeclockComponent } from './timeclock/timeclock.component';
import { LoginComponent } from './login/login.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ViewleavesComponent } from './viewleaves/viewleaves.component';
import { ViewownleavesComponent } from './viewownleaves/viewownleaves.component';
import { ViewEmployeeComponent } from './viewemployee/viewemployee.component';
import { AddEmployeeComponent } from './addemployee/addemployee.component';
import { EditEmployeeComponent } from './editemployee/editemployee.component';
import { EditProfileComponent } from './editprofile/editprofile.component';
import { SetpasswordComponent } from './setpassword/setpassword.component';
import { ViewSuperiorsComponent } from './viewsuperior/viewsuperior.component';
import { TooltipsComponent } from './tooltips/tooltips.component';
import { EventcalendarComponent } from './eventcalendar/eventcalendar.component';
import { AddprojectsComponent } from './addprojects/addprojects.component';
import { ViewprojectsComponent } from './viewprojects/viewprojects.component';
import { ProjectDetailsComponent } from './projectdetails/projectdetails.component';
import { ViewTeamComponent } from './viewteam/viewteam.component';
import { AddreportsComponent } from './addreports/addreports.component';
import { ViewreportsComponent } from './viewreports/viewreports.component';
import { ReportdetailsComponent } from './reportdetails/reportdetails.component';
import { ViewprojectreportsComponent } from './viewprojectreports/viewprojectreports.component';
import { DepartmentteamsComponent } from './departmentteams/departmentteams.component';
import { ViewtasksComponent } from './viewtasks/viewtasks.component';
import { AddtaskComponent } from './addtask/addtask.component';
import { AddcommentComponent } from './addcomment/addcomment.component';
import { HiringModuleComponent } from './hiring-module/hiring-module.component';
import { MultieventCalenderComponent } from './multievent-calender/multievent-calender.component';
import { TaskReportComponent } from './task-report/task-report.component';
import { AuthGuard } from './services/auth.guard';
import { WorkFromHomeComponent } from './work-from-home/work-from-home.component';
import { WorkFromHomeDetailsComponent } from './work-from-home-details/work-from-home-details.component';
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full',canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent,canActivate: [AuthGuard]  },
  { path: 'timeclock', component: TimeclockComponent ,canActivate: [AuthGuard] },
  { path: 'login', component:LoginComponent },  
  { path: 'forgotpassword', component: ForgotpasswordComponent},
  { path: 'viewleaves', component: ViewleavesComponent,canActivate: [AuthGuard]  },
  { path: 'viewownleaves', component: ViewownleavesComponent,canActivate: [AuthGuard]  },
  { path: 'viewemployee', component: ViewEmployeeComponent ,canActivate: [AuthGuard] },
  { path: 'addemployee', component: AddEmployeeComponent,canActivate: [AuthGuard]  },
  { path: 'editemployee/:id', component: EditEmployeeComponent,canActivate: [AuthGuard]  },
  { path: 'editprofile', component: EditProfileComponent,canActivate: [AuthGuard]  },
  { path: 'setpassword', component: SetpasswordComponent},
  { path: 'viewsuperior', component: ViewSuperiorsComponent,canActivate: [AuthGuard]  },
  { path: 'tooltips', component: TooltipsComponent,canActivate: [AuthGuard]  },
  { path: 'calendar', component: EventcalendarComponent,canActivate: [AuthGuard]  },
  { path: 'addprojects', component: AddprojectsComponent,canActivate: [AuthGuard]  },
  { path: 'editprojects/:id', component: AddprojectsComponent ,canActivate: [AuthGuard] },
  { path: 'viewprojects', component: ViewprojectsComponent ,canActivate: [AuthGuard] },
  { path: 'projectdetails/:id', component: ProjectDetailsComponent ,canActivate: [AuthGuard] },
  { path: 'viewteam', component: ViewTeamComponent,canActivate: [AuthGuard]  },
  { path: 'addtimesheet', component: AddreportsComponent,canActivate: [AuthGuard]  },
  { path: 'Viewtimesheet', component: ViewreportsComponent ,canActivate: [AuthGuard] },
  { path: 'reportdetails/:id', component: ReportdetailsComponent,canActivate: [AuthGuard]  },
  { path: 'projectreports', component: ViewprojectreportsComponent,canActivate: [AuthGuard]  },
  { path: 'departmentteams', component: DepartmentteamsComponent,canActivate: [AuthGuard]  },
  { path: 'editreports/:id', component: AddreportsComponent ,canActivate: [AuthGuard] },
  { path: 'viewtasklist', component: ViewtasksComponent,canActivate: [AuthGuard]  },
  { path: 'addtask', component: AddtaskComponent,canActivate: [AuthGuard]  },
  { path: 'edittask/:id', component: AddtaskComponent,canActivate: [AuthGuard]  },
  { path: 'addcomment/:id/:projectid', component: AddcommentComponent,canActivate: [AuthGuard]  },
  { path: 'hiring-process', component: HiringModuleComponent,canActivate: [AuthGuard]  },
  { path: 'multievent-calendar', component: MultieventCalenderComponent ,canActivate: [AuthGuard] },
  { path: 'work-from-home', component: WorkFromHomeComponent ,canActivate: [AuthGuard] },
  { path: 'edit-wfh-details/:id', component: WorkFromHomeComponent ,canActivate: [AuthGuard] },
  { path: 'wfh-details', component: WorkFromHomeDetailsComponent ,canActivate: [AuthGuard] },
  { path: 'taskreports', component: TaskReportComponent ,canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes, {
      useHash: false,
      }
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
