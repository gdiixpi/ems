import { Component, OnInit, Renderer2, TemplateRef, NgModule, ViewChild } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { NgbDropdownConfig, NgbModule, ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Title } from '@angular/platform-browser';
import { CommonService } from '../common.service';
import { environment } from '../../environments/environment';
import * as $ from 'jquery';
import { DataTableDirective } from 'angular-datatables';


class dataTablesParameters {
  id: number;
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-viewleave',
  templateUrl: './viewownleaves.component.html',
  styleUrls: ['./viewownleaves.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewownleavesComponent implements OnInit {
  @ViewChild(DataTableDirective,{static:false})
  dtElement:DataTableDirective
  title = ':: EMS :: View Own Leaves';
  CurrentYear = new Date().getFullYear();
  parentBreadcumbTitle = 'View Own Leaves';
  parentBreadcumbPath = [{path:'', title:'Leave Management'}, {path:'', title:'View Own Leaves'}];
  closeResult: string;
  userData = [];
  profileImage = 'assets/images/faces/face1.jpg';
  viewleave = [];
  modalRef: BsModalRef | null;
  colorTheme = 'theme-dark-blue';
  cancelLeaveId = 0;
  cancelLeaveUserId = 0;
  rejectLeaveId = 0;
  rejectLeaveUserId = 0;
  rejectLeaveUserName = '';
  message: string;
  filtertype:string = "datalist"
  viewUserData = [
    viewLeaveId => '',
    viewLeaveUserId => '',
    viewLeaveUserName => '',
    viewLeaveFromDate => '',
    viewLeaveEndDate => '',
    viewLeaveTotalDays => '',
    viewLeaveType => '',
    viewLeaveHalfType => '',
    viewLeavePidLeave => '',
    viewLeaveUnpaidLeave => '',
    viewLeaveStatus => '',
    viewLeaveReason => '',
    viewLeaveRejectReason => ''
  ];
  temp_var = false;
  dtOptions: DataTables.Settings = {};
  data:any;
  end_date:any;
  start_date:any;
  leave_status:any;



  bsConfig = Object.assign({}, {
    containerClass: this.colorTheme
  });
  bsInlineValue = new Date();
  constructor(
    private router: Router, 
    private titleService: Title,
    private common: CommonService, 
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.titleService.setTitle(this.title)
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    // let MY = this;
    // MY.temp_var = false;
    // this.common.callApi({
    //   type: 'post',
    //   url: 'leaves/view-leave',
    //   data: {
    //     'user_id': MY.userData['user_id']
    //   },
    //   callback: function (res) {
    //     if (res.status == 'success') {
    //       MY.viewleave = res.viewleave;
    //       MY.temp_var = true;
    //     }
    //     MY.common.loader(false);
    //   },
    //   onErr: function (res) {
    //   },
    //   onFail: function () {
    //   }
    // });

    this.viewownleaveapi('');
  }

  dataPassInDatatable(){
    if(this.filtertype == 'datalist'){
      this.data["user_id"] = this.userData["user_id"];
    }
    if(this.filtertype == 'datawithfilter'){
      this.data["user_id"] = this.userData["user_id"];
      this.data['end_date'] = this.end_date
      this.data['from_date'] =  this.start_date,
      this.data['leave_status'] = this.leave_status
    }
    if(this.filtertype == 'currentMonthLeave'){
      this.data["user_id"] = this.userData["user_id"];
      this.data['current_month_year'] = 1;
    }
  }
  viewownleaveapi(val:any){
    const MY = this;
    MY.common.loader(true);
    MY.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        MY.data = dataTablesParameters;
        MY.dataPassInDatatable();
        MY.common
          .postPrivate("leaves/get-view-leave-list", dataTablesParameters)
          .subscribe(
            (res: any) => {
              if(this.filtertype == 'datawithfilter'){
                this.modalRef.hide();
              }
              MY.viewleave = res.leave.data;
              MY.common.loader(false);
              callback({
                recordsTotal: res.leave.recordsTotal,
                recordsFiltered: res.leave.recordsFiltered,
                data: [],
                
              });
            },
            (err: any) => {}
          );
      },
      
      columns: [
        { data: "id" },
        { data: "EmployeeName" },
        { data: "FromDate" },
        { data: "EndDate" },
        { data: "LeaveType" },
        { data: "TotalDays" },
        { data: "PaidLeave" },
        { data: "UnpaidLeave" },
        { data: "LeaveStatus" },
        { data: "Action" }
      ],
      order: [[2, 'desc']]
    };
  }

  onViewInactiveUserLeave(): void {
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    let MY = this;
    MY.temp_var = false;
    this.common.callApi({
      type: 'post',
      url: 'leaves/inactive-user-leave',
      data: {
        'user_id': MY.userData['user_id']
      },
      callback: function (res) {
        if (res.status == 'success') {
          MY.viewleave = res.viewleave;
          MY.temp_var = true;
        }
        MY.common.loader(false);
      },
      onErr: function (res) {
      },
      onFail: function () {
      }
    });
  }

  onRejectSubmit(val: any): void {
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    var MY = this;
    MY.temp_var = false;
    this.common.callApi({
      type: 'post',
      url: 'leaves/reject-leave-status',
      data: {
        'id': val.rleave_id,
        'user_id': val.rleaveuser_id,
        'reason': val.reason,
        'rejected_by': MY.userData['id'],
        'user_name': val.user_name
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.leaves.status == 'success') {
          MY.common.notificationMsg('alert-fill-success', res.leaves.msg);
          MY.temp_var = true;
        } else {
          MY.common.notificationMsg('alert-fill-danger', res.leaves.msg);
        }
        $('.rejectLeaveClose').trigger('click');
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
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload()
    });

  }
  viewCurrentMonthLeave(type:string){
    this.common.loader(true);
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    let MY = this;
    MY.filtertype = type;
    MY.rerender();
  }
  onLeaveFilter(val: any,type:string): void {
    this.common.loader(true);
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    let MY = this;
    MY.temp_var = false;
    MY.end_date = val.end_date,
    MY.start_date = val.start_date,
    MY.leave_status = val.leave_status
    MY.filtertype = type;
    MY.rerender();
    // this.common.callApi({
    //   type: 'post',
    //   url: 'leaves/leave-filter',
    //   data: {
    //     'user_id': MY.userData['user_id'],
    //     'end_date': val.end_date,
    //     'from_date': val.start_date,
    //     'leave_status': val.leave_status,
    //   },
    //   callback: function (res) {
    //     if (res.status == 'success') {
    //       MY.viewownleaveapi();
    //       MY.viewleave = res.viewleave;
    //       MY.temp_var = true;
    //     }
    //     MY.common.loader(false);
    //     $('.LeaveFilterClose').trigger('click');
    //   },
    //   onErr: function (res) {
    //   },
    //   onFail: function () {
    //   }
    // });
  }

  // Code for cancel leave
  confirmCancel(): void {
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    var MY = this;
    this.common.callApi({
      type: 'post',
      url: 'leaves/cancel-leave-status',
      data: {
        'id': MY.cancelLeaveId,
        'approved_by': MY.userData['id'],
        'user_id': MY.cancelLeaveUserId
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.leaves.status == 'success') {
          MY.common.notificationMsg('alert-fill-success', res.leaves.msg);
        } else {
          MY.common.notificationMsg('alert-fill-danger', res.leaves.msg);
        }
        $('.cancelLeaveClose').trigger('click');
        MY.rerender();
      },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg('alert-fill-danger', res);
        $('.cancelLeaveClose').trigger('click');
      },
      onFail: function () {
      }
    });
    // localStorage.clear();
    // sessionStorage.clear();
    // this.router.navigate(['/login']);
    // this.modalRef.hide();
  }

  declineCancel(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }

  openModalLeaveFilter(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  openCancelModal(template: TemplateRef<any>, id: any, user_id: any) {
    // alert('come');
    // this.modalRef = this.modalService.show(template);
    this.cancelLeaveId = id;
    this.cancelLeaveUserId = user_id;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  openViewLeaveModal(template: TemplateRef<any>,
    id: any,
    user_id: any,
    user_name: any,
    from_dt: any,
    end_dt: any,
    created_dt: any,
    total_days: any,
    leave_type: any,
    half_leave_type: any,
    paid_leave: any,
    unpaid_leave: any,
    leave_status: any,
    reason: any,
    reject_reason: any) {
    // this.modalRef = this.modalService.show(template);

    this.viewUserData['viewLeaveId'] = id;
    this.viewUserData['ViewLeaveUserId'] = user_id;
    this.viewUserData['viewLeaveUserName'] = user_name;
    this.viewUserData['viewLeaveFromDate'] = from_dt;
    this.viewUserData['viewLeaveEndDate'] = end_dt;
    this.viewUserData['viewLeaveApplyDate'] = created_dt; 
    this.viewUserData['viewLeaveTotalDays'] = total_days;
    this.viewUserData['viewLeaveType'] = leave_type;
    this.viewUserData['viewLeaveHalfType'] = half_leave_type;
    this.viewUserData['viewLeavePidLeave'] = paid_leave;
    this.viewUserData['viewLeaveUnpaidLeave'] = unpaid_leave;
    this.viewUserData['viewLeaveStatus'] = leave_status;
    this.viewUserData['viewLeaveReason'] = reason;
    this.viewUserData['viewLeaveRejectReason'] = reject_reason;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

}
