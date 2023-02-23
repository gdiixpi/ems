import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { DatePipe } from '@angular/common';
import { CommonService } from '../common.service';
import { environment } from '../../environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as $ from 'jquery';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public samplePagesCollapsed = true;
  userData: any;
  uesrSuperiors = [];
  uesrSuperiorsSecond = [];
  userNonSuperiors = [];
  userView = [];
  userLeaveCount:any;
  profileImage = 'assets/images/faces/face1.jpg';
  modalRef: BsModalRef | null;
  modalRefAddLeave: BsModalRef | null;
  primary_superior_id = '';
  minDatestartDate: Date;
  maxDatestartDate: Date;
  maxDateHalfDate: Date;
  minDateendDate: Date;
  maxDateendDate: Date;
  StartDate: any;
  EndDate: any;
  HalfLeaveDate: any;
  AddLeaveValue: any;
  EmpNoOfPaidLeave: any;
  TotalUnpaidLeave = 0;
  TotalPaidLeave = 0;


  constructor(private router: Router, private common: CommonService, private modalService: BsModalService, private datePipe: DatePipe) {
    this.minDatestartDate = new Date();
    this.maxDatestartDate = new Date();
    this.maxDateHalfDate = new Date();
    // this.minDatestartDate.setDate(this.minDatestartDate.getDate() - 60);
    this.minDatestartDate.setDate(this.minDatestartDate.getDate() - 7);
    this.maxDatestartDate.setDate(this.maxDatestartDate.getDate() + 60);
    this.maxDateHalfDate.setDate(this.maxDateHalfDate.getDate() + 60);
    this.minDateendDate = new Date();
    this.maxDateendDate = new Date();
    this.minDateendDate.setDate(this.minDateendDate.getDate());
    this.maxDateendDate.setDate(this.maxDateendDate.getDate());
  }

  ngOnInit() {
    if (localStorage.getItem(environment.userSession) == null) {
      this.router.navigate(['/login']);
    }
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
        if(this.userData['profile_pic'] != '')
          this.profileImage = environment.proPicURL + this.userData['id'] + '/' + this.userData['profile_pic'];
    var MY = this;
    if (this.userData['access_type'] != 'admin') {
    this.common.callApi({
      type: 'post',
      url: 'leaves/number-of-paidleave',
      data: {
        'id': this.userData['id']
      },
      callback: function (res) {
        if (res.leaves.status == 'success') {
          MY.EmpNoOfPaidLeave = res.leaves.msg[0].leaves;
        }
        MY.common.loader(false);
      },
      onErr: function (res) {
      },
      onFail: function () {
      }
    });
  }
  }

  onValueChange(value: Date): void {
    var data = value;
    if (data) {
      this.minDateendDate.setMonth(data.getMonth(), data.getDate());
      this.maxDateendDate.setMonth(data.getMonth(), (data.getDate() + 14));
      // this.maxDateendDate.setMonth(data.getMonth(), (data.getDate() + 60));
    }
    this.show_days(data, 'start');
  }

  CalculateWeekendDays(fromDate, toDate){
    var weekendDayCount = 0;
    while(fromDate < toDate){
        fromDate.setDate(fromDate.getDate() + 1);
        if(fromDate.getDay() === 0 || fromDate.getDay() == 6){
            ++weekendDayCount ;
        }
    }
    return weekendDayCount ;
  }
  show_days(value: Date, type: any) {
    if (type == 'start') {
      this.StartDate = value;
    } else {
      this.EndDate = value;
    }
    if (this.StartDate && this.EndDate) {
      var StartDateNew = new Date(this.StartDate);
      this.StartDate = this.datePipe.transform(StartDateNew, "yyyy-MM-dd");
      var EndDateNew = new Date(this.EndDate);
      this.EndDate = this.datePipe.transform(EndDateNew, "yyyy-MM-dd");
      let MY = this;

      // var date1 = StartDateNew
      // var date2 = EndDateNew
      var date1:any = this.datePipe.transform(StartDateNew, "dd");
      var date2:any = this.datePipe.transform(EndDateNew, "dd");

      const oneDay = 1000 * 60 * 60 * 24;
      var weekendCount = MY.CalculateWeekendDays(new Date(this.StartDate), new Date(this.EndDate));
      
      // var Difference_In_Time = date2.getTime() - date1.getTime();
      
      // const diffInDays = Math.round(Difference_In_Time / oneDay);
      const diffInDays = date2 - date1
      var daysCount =  (diffInDays + 1) - weekendCount;
      MY.userLeaveCount = daysCount
      
      if (this.EndDate < this.StartDate) {
      MY.common.notificationMsg('alert-fill-danger', 'Insert valid End Date.');
      // } else {
      //   this.common.callApi({
      //     type: 'post',
      //     url: 'leaves/sandwich-leave',
      //     data: {
      //       'end_date': this.EndDate,
      //       'start_date': this.StartDate
      //     },
      //     callback: function (res) {
      //       if (res.leaves.status == 'success') {
      //         MY.userLeaveCount = res.leaves.count;
      //         if (res.leaves.sandwich == 'Yes') {
      //           MY.common.notificationMsg('alert-fill-success', 'Sandwich Leave Apply');
      //         }
      //       }
      //       MY.common.loader(false);
      //     },
      //     onErr: function (res) {
      //     },
      //     onFail: function () {
      //     }
      //   });
      }
    }
  }

  /* Code For Apply Leave Start */
  onApplyLeaveSubmit(val: any): void {
    $('.AddLeaveConfirmationButton').trigger('click');
    this.AddLeaveValue = val;
    // if (this.AddLeaveValue.leave_type == 1) {
    //   if (this.AddLeaveValue.total_days < this.EmpNoOfPaidLeave) {
    //     this.TotalUnpaidLeave = parseInt(this.AddLeaveValue.total_days) - parseInt(this.AddLeaveValue.total_days);
    //     this.TotalPaidLeave = parseInt(this.AddLeaveValue.total_days) - this.TotalUnpaidLeave;
    //   } else if (this.AddLeaveValue.total_days > this.EmpNoOfPaidLeave) {
    //     this.TotalUnpaidLeave = parseInt(this.AddLeaveValue.total_days) - this.EmpNoOfPaidLeave;
    //     this.TotalPaidLeave = parseInt(this.AddLeaveValue.total_days) - this.TotalUnpaidLeave;
    //   } else if (this.AddLeaveValue.total_days == this.EmpNoOfPaidLeave) {
    //     this.TotalUnpaidLeave = parseInt(this.AddLeaveValue.total_days) - this.EmpNoOfPaidLeave;
    //     this.TotalPaidLeave = parseInt(this.AddLeaveValue.total_days);
    //   }
    // } else {
    //   this.AddLeaveValue.total_days = 0.5;
    //   if (this.EmpNoOfPaidLeave > 0) {
    //     this.TotalPaidLeave = 0.5;
    //     this.TotalUnpaidLeave = 0;
    //   } else {
    //     this.TotalPaidLeave = 0;
    //     this.TotalUnpaidLeave = 0.5;
    //   }
    // }
  }

  confirmAddLeave(): void {
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    var MY = this;
    var Data: any;
    if (this.AddLeaveValue.leave_type == 1) {
      var StartDateAdd = new Date(this.AddLeaveValue.startdate);
      this.StartDate = this.datePipe.transform(StartDateAdd, "yyyy-MM-dd");
      var EndDateAdd = new Date(this.AddLeaveValue.enddate);
      this.EndDate = this.datePipe.transform(EndDateAdd, "yyyy-MM-dd");
      Data = {
        'end_dt': this.EndDate,
        'from_dt': this.StartDate,
        'half_leave_type': this.AddLeaveValue.half_leave_type,
        'leave_type': this.AddLeaveValue.leave_type,
        'paid_leave': this.TotalPaidLeave,
        'reason': this.AddLeaveValue.reason,
        'total_days': this.AddLeaveValue.total_days,
        'unpaid_leave': this.TotalUnpaidLeave,
        'user_id': this.AddLeaveValue.EmployeeId
      };
    } else if (this.AddLeaveValue.leave_type == 0) {
      var HalftStartDate = new Date(this.AddLeaveValue.from_dt);
      this.HalfLeaveDate = this.datePipe.transform(HalftStartDate, "yyyy-MM-dd");
      Data = {
        'end_dt': this.HalfLeaveDate,
        'from_dt': this.HalfLeaveDate,
        'half_leave_type': this.AddLeaveValue.half_leave_type,
        'leave_type': this.AddLeaveValue.leave_type,
        'paid_leave': this.TotalPaidLeave,
        'reason': this.AddLeaveValue.reason,
        'total_days': this.AddLeaveValue.total_days,
        'unpaid_leave': this.TotalUnpaidLeave,
        'user_id': this.AddLeaveValue.EmployeeId
      };
    }
    this.common.callApi({
      type: 'post',
      url: 'leaves/add-leave',
      data: Data,
      callback: function (res) {
        MY.common.loader(false);
        if (res.leaves.status == 'success') {
          MY.common.notificationMsg('alert-fill-success', res.leaves.msg);
          MY.modalRefAddLeave.hide();
          MY.router.navigate(['/viewownleaves']);
          MY.ngOnInit();
        } else {
          MY.common.notificationMsg('alert-fill-danger', res.leaves.msg);
        }
        $('.ApplyLeaveModalClose').trigger('click');
        //MY.ngOnInit();
      },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg('alert-fill-danger', res);
      },
      onFail: function () {
      }
    });

    this.modalRef.hide();
  }

  declineAddLeave(): void {
    this.modalRef.hide();
  }

  AddLeaveConfirmayionOpenModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }
  /* Code For Apply Leave End */

  openModalSuperior(template: TemplateRef<any>) {
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    let MY = this;
    this.common.callApi({
      type: 'post',
      url: 'superiors/superior-list',
      callback: function (res) {
        if (res.superior.status == 'success') {
          MY.uesrSuperiorsSecond = MY.uesrSuperiors = res.superior.msg;
        }
        MY.common.loader(false);
      },
      onErr: function (res) {
      },
      onFail: function () {
      }
    });
    this.common.callApi({
      type: 'post',
      url: 'superiors/non-superior-employees',
      callback: function (res) {
        if (res.user.status == 'success') {
          MY.userNonSuperiors = res.user.msg;
        }
        MY.common.loader(false);
      },
      onErr: function (res) {
      },
      onFail: function () {
      }
    });
    this.common.callApi({
      type: 'post',
      url: 'user/view-user',
      data: {
        'user_id': MY.userData['id']
      },
      callback: function (res) {
        if (res.user.status == 'success') {
          MY.userView = res.user.msg;
        }
        MY.common.loader(false);
      },
      onErr: function (res) {
      },
      onFail: function () {
      }
    });

    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

    /* Code For Logout */
    LogOut() {
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['/login']);
    }
    /* Logout Code End */

  onChange(primary_superior_id) {
    $('#second_div').removeClass('d-none');
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    let MY = this;
    this.common.callApi({
      type: 'post',
      url: 'superiors/superior-list',
      data: {
        'superior_id': primary_superior_id
      },
      callback: function (res) {
        if (res.superior.status == 'success') {
          MY.uesrSuperiorsSecond = res.superior.msg;
        }
        MY.common.loader(false);
      },
      onErr: function (res) {
      },
      onFail: function () {
      }
    });
  }

  onSubmit(val: any): void {
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    var MY = this;
    this.common.callApi({
      type: 'post',
      url: 'superiors/add-superiors',
      data: {
        'user_id': val.assignEmployee,
        'primary_superior_id': $('#primarySuperior').val(),
        'assign_by': MY.userData['id'],
        'superior_id': val.secondarySuperior
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.superior.status == 'success') {
          MY.common.notificationMsg('alert-fill-success', res.superior.msg);
          // MY.router.navigate(['/viewsuperior']);
        } else {
          MY.common.notificationMsg('alert-fill-danger', res.superior.msg);
        }
        $('.SuperiorClose').trigger('click');
        MY.ngOnInit();
      },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg('alert-fill-danger', res);
      },
      onFail: function () {
      }
    });
  }

  openModalLeave(template: TemplateRef<any>) {
    this.modalRefAddLeave = this.modalService.show(template, { class: 'modal-md' });
    this.userLeaveCount = ''
  }
  userDatas(userData,type){
    return this.common.userDatas(userData,type);
  }

}
