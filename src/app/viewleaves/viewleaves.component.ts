import {
  Component,
  OnInit,
  Renderer2,
  TemplateRef,
  NgModule,
  ViewChild,
} from "@angular/core";
import { ViewEncapsulation } from "@angular/core";
import {
  NgbDropdownConfig,
  NgbModule,
  ModalDismissReasons,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";
import { BsModalService, BsModalRef, ModalModule } from "ngx-bootstrap/modal";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { DatePipe } from "@angular/common";
import { CommonService } from "../common.service";
import { environment } from "../../environments/environment";
import * as $ from "jquery";
import { DataTableDirective } from "angular-datatables";

@Component({
  selector: "app-viewleave",
  templateUrl: "./viewleaves.component.html",
  styleUrls: ["./viewleaves.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ViewleavesComponent implements OnInit {
  @ViewChild(DataTableDirective,{static:false})
  dtElement:DataTableDirective
  title = ":: EMS :: View Leaves";
  CurrentYear = new Date().getFullYear();
  parentBreadcumbTitle = "View Leaves";
  parentBreadcumbPath = [
    { path: "", title: "Leave Management" },
    { path: "", title: "View Leaves" },
  ];
  closeResult: string;
  userData = [];
  profileImage = "assets/images/faces/face1.jpg";
  viewleave = [];
  modalRef: BsModalRef | null;
  colorTheme = "theme-dark-blue";
  approveLeaveId = 0;
  approveLeaveUserId = 0;
  rejectLeaveId = 0;
  rejectLeaveUserId = 0;
  rejectLeaveUserName = "";
  message: string;
  userRoles = [];
  viewUserLeavesEdit = [];
  EmpNoOfPaidLeave: any;
  modalRefEditLeave: BsModalRef | null;
  modalRefAddLeave: BsModalRef | null;
  viewemployee = [];
  viewUserData = [
    (viewLeaveId) => "",
    (viewLeaveUserId) => "",
    (viewLeaveUserName) => "",
    (viewLeaveFromDate) => "",
    (viewLeaveEndDate) => "",
    (viewLeaveApplyDate) => "",
    (viewLeaveTotalDays) => "",
    (viewLeaveType) => "",
    (viewLeaveHalfType) => "",
    (viewLeavePidLeave) => "",
    (viewLeaveUnpaidLeave) => "",
    (viewLeaveStatus) => "",
    (viewLeaveReason) => "",
    (viewLeaveRejectReason) => "",
  ];
  minDatestartDate: Date;
  maxDatestartDate: Date;
  minDateendDate: Date;
  maxDateendDate: Date;
  maxDateHalfDate: Date;
  StartDate: any;
  EndDate: any;
  HalfLeaveDate: any;
  AddLeaveValue: any;
  TotalUnpaidLeave = 0;
  TotalPaidLeave = 0;
  userLeaveCount:any;
  FinalEditFromDate: any;
  FinalEditEndDate: any;
  FinalEditHalfFromDate: any;
  temp_var = false;
  dtOptions: DataTables.Settings = {};
  data:any;
  filterType:string = 'noDataFilter';
  end_date:any;
  start_date:any;
  leave_status:any;
  userrole:any;
  adminView:boolean = false;
  bsConfig = Object.assign(
    {},
    {
      containerClass: this.colorTheme,
    }
  );
  bsInlineValue = new Date();
  constructor(
    private router: Router,
    private titleService: Title,
    private common: CommonService,
    private modalService: BsModalService,
    private datePipe: DatePipe
  ) {
    this.minDatestartDate = new Date();
    this.maxDatestartDate = new Date();
    this.maxDateHalfDate = new Date();
    // this.minDatestartDate.setDate(this.minDatestartDate.getDate() - 60);
    this.minDatestartDate.setDate(this.minDatestartDate.getDate() - 60);
    this.maxDatestartDate.setDate(this.maxDatestartDate.getDate());
    this.maxDateHalfDate.setDate(this.maxDateHalfDate.getDate() + 60);
    this.minDateendDate = new Date();
    this.maxDateendDate = new Date();
    this.minDateendDate.setDate(this.minDateendDate.getDate());
    this.maxDateendDate.setDate(this.maxDateendDate.getDate());
  }
  ngOnInit() {
    this.titleService.setTitle(this.title);
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    let MY = this;
    if(MY.userData["access_type"] == "admin"){
      this.adminView = true;
    }
    if (MY.userData["role_id"] !== 1 && MY.userData["count_id"] > 0) {
      var Data = {
        superior_id: MY.userData["user_id"],
      };
    }
    this.viewuserApi();
    this.viewleaveApi('');
    this.common.callApi({
      type: "post",
      url: "role/view-roles",
      callback: function (res) {
        if (res.userRoles.status == "success") {
          MY.userRoles = res.userRoles.msg;
        }
        MY.common.loader(false);
      },
      onErr: function (res) {},
      onFail: function () {},
    });
    
  }
  viewuserApi(){
    const MY = this;
    this.common.callApi({
      type: 'post',
      url: 'user/view-user-list',
      callback: function (res) {
        MY.viewemployee = res.user.msg;
        MY.common.loader(false);
      },
      onErr: function (res) {
      },
      onFail: function () {
      }
    });
    // const MY = this;
    // this.dtOptions = {
    //   pagingType: "full_numbers",
    //   pageLength: 10,
    //   serverSide: true,
    //   processing: true,
    //   ajax: (dataTablesParameters: any, callback) => {
    //     MY.common.postPrivate("user/get-view-user-list", dataTablesParameters).subscribe(
    //         (res: any) => {
    //           MY.viewemployee = res.user.data;
    //           callback({
    //             recordsTotal: res.user.recordsTotal,
    //             recordsFiltered: res.user.recordsFiltered,
    //             data: [],
    //           });
    //         },
    //         (err: any) => {}
    //       );
    //   },
    //   columns: [],
    // };
  }
  dataPassInDatatable(){
    if(this.filterType == 'noDataFilter'){
      this.data["superior_id"] = this.userData["user_id"];
    }
    if(this.filterType == 'datawithFilter'){
      if (this.userData["role_id"] !== 1 && this.userData["count_id"] > 0) {
        this.data["superior_id"] = this.userData["user_id"];
        this.data['end_date'] = this.end_date
        this.data['from_date'] =  this.start_date,
        this.data['leave_status'] = this.leave_status,
        this.data['role'] = this.userrole,
        this.data["user_id"] = ''
      } else if (this.userData["role_id"] == 1) {
        // this.data["user_id"] = this.userData["user_id"];
        this.data['end_date'] = this.end_date
        this.data['from_date'] =  this.start_date,
        this.data['leave_status'] =  this.leave_status
      }
    }
    if(this.filterType == 'inactiveUser'){
        if(this.userData["role_id"] !== 1 && this.userData["count_id"] > 0){
          this.data['user_status'] = 0;
          this.data["superior_id"] = this.userData["user_id"];
        }else{
          this.data['user_status'] = 0;
        }
    }
    if(this.filterType == 'currentMonthLeave'){
      if(this.userData["role_id"] !== 1 && this.userData["count_id"] > 0){
        this.data['current_month_year'] = 1;
        this.data["superior_id"] = this.userData["user_id"];
      }else{
        this.data['current_month_year'] = 1;
      }
    }
  }
  viewleaveApi(val:any) {
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
              if(this.filterType == 'datawithFilter'){
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
        { data: "PaidLeaves" },
        { data: "UnpaidLeaves" },
        { data: "LeaveStatus" },
      ],
      order: [[2, 'desc']]
    };
  }
  viewCurrentMonthLeave(type:string){
    this.common.loader(true);
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    let MY = this;
    MY.filterType = type;
    MY.rerender();
  }
  onViewInactiveUserLeave(type:string): void {
    this.common.loader(true);
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    let MY = this;
    MY.filterType = type;
    MY.rerender();
    // if (MY.userData["role_id"] !== 1 && MY.userData["count_id"] > 0) {
    //   var Data = {
    //     superior_id: MY.userData["user_id"],
    //   };
    // }
    // MY.temp_var = false;
    // this.common.callApi({
    //   type: "post",
    //   url: "leaves/inactive-user-leave",
    //   data: Data,
    //   callback: function (res) {
    //     if (res.status == "success") {
    //       MY.viewleave = res.viewleave;
    //       MY.temp_var = true;
    //     }
    //     MY.common.loader(false);
    //   },
    //   onErr: function (res) {},
    //   onFail: function () {},
    // });
  }

  onRejectSubmit(val: any): void {
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    var MY = this;
    this.common.callApi({
      type: "post",
      url: "leaves/reject-leave-status",
      data: {
        id: val.rleave_id,
        user_id: val.rleaveuser_id,
        reason: val.reason,
        rejected_by: MY.userData["id"],
        user_name: val.user_name,
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.leaves.status == "success") {
          MY.common.notificationMsg("alert-fill-success", res.leaves.msg);
        } else {
          MY.common.notificationMsg("alert-fill-danger", res.leaves.msg);
        }
        $(".rejectLeaveClose").trigger("click");
        MY.rerender();
      },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg("alert-fill-danger", res);
      },
      onFail: function () {},
    });
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload()
    });
  }
  onLeaveFilter(val: any,type:string): void {
    this.common.loader(true);
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    let MY = this;
    this.filterType = type;
    MY.end_date = val.end_date,
    MY.start_date = val.start_date,
    MY.leave_status = val.leave_status
    MY.userrole = val.userrole
    MY.rerender();
    // MY.temp_var = false;
    // MY.viewleaveApi('');
    // this.common.callApi({
    //   type: "post",
    //   url: "leaves/leave-filter",
    //   data: Data,
    //   callback: function (res) {
    //     if (res.status == "success") {
    //       MY.viewleave = res.viewleave;
    //       MY.temp_var = true;
    //     }
    //     MY.common.loader(false);
    //     $(".LeaveFilterClose").trigger("click");
    //   },
    //   onErr: function (res) {},
    //   onFail: function () {},
    // });
  }
  // }

  // Code for delete holiday
  confirmApprove(): void {
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    var MY = this;
    this.common.callApi({
      type: "post",
      url: "leaves/approve-leave-status",
      data: {
        id: MY.approveLeaveId,
        approved_by: MY.userData["id"],
        user_id: MY.approveLeaveUserId,
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.leaves.status == "success") {
          MY.common.notificationMsg("alert-fill-success", res.leaves.msg);
        } else {
          MY.common.notificationMsg("alert-fill-danger", res.leaves.msg);
        }
        $(".approveLeaveClose").trigger("click");
        MY.rerender();
      },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg("alert-fill-danger", res);
        $(".approveLeaveClose").trigger("click");
      },
      onFail: function () {},
    });
    // localStorage.clear();
    // sessionStorage.clear();
    // this.router.navigate(['/login']);
    // this.modalRef.hide();
  }

  declineApprove(): void {
    this.message = "Declined!";
    this.modalRef.hide();
  }

  openModalLeaveFilter(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }

  openApproveModal(template: TemplateRef<any>, id: any, user_id: any) {
    // this.modalRef = this.modalService.show(template);
    this.approveLeaveId = id;
    this.approveLeaveUserId = user_id;
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  openRejectModal(
    template: TemplateRef<any>,
    id: any,
    user_id: any,
    user_name: any
  ) {
    //this.modalRef = this.modalService.show(template);
    this.rejectLeaveId = id;
    this.rejectLeaveUserId = user_id;
    this.rejectLeaveUserName = user_name;
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
    // this.rerender();
  }

  openViewLeaveModal(
    template: TemplateRef<any>,
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
    reject_reason: any
  ) {
    // this.modalRef = this.modalService.show(template);
    this.viewUserData["viewLeaveId"] = id;
    this.viewUserData["ViewLeaveUserId"] = user_id;
    this.viewUserData["viewLeaveUserName"] = user_name;
    this.viewUserData["viewLeaveFromDate"] = from_dt;
    this.viewUserData["viewLeaveEndDate"] = end_dt;
    this.viewUserData["viewLeaveApplyDate"] = created_dt;
    this.viewUserData["viewLeaveTotalDays"] = total_days;
    this.viewUserData["viewLeaveType"] = leave_type;
    this.viewUserData["viewLeaveHalfType"] = half_leave_type;
    this.viewUserData["viewLeavePidLeave"] = paid_leave;
    this.viewUserData["viewLeaveUnpaidLeave"] = unpaid_leave;
    this.viewUserData["viewLeaveStatus"] = leave_status;
    this.viewUserData["viewLeaveReason"] = reason;
    this.viewUserData["viewLeaveRejectReason"] = reject_reason;
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }

  // Code for open modal
  EditLeaveModalOpen(template: TemplateRef<any>, key: any) {
    this.viewUserData = this.viewleave[key];
    this.userLeaveCount = this.viewUserData["total_days"];
    var EditFromDate = new Date(this.viewUserData["from_dt"]);
    this.FinalEditFromDate = this.datePipe.transform(
      EditFromDate,
      "MM/dd/yyyy"
    );
    var EditEndDate = new Date(this.viewUserData["end_dt"]);
    this.FinalEditEndDate = this.datePipe.transform(EditEndDate, "MM/dd/yyyy");
    var EditHalfFromDate = new Date(this.viewUserData["from_dt"]);
    this.FinalEditHalfFromDate = this.datePipe.transform(
      EditHalfFromDate,
      "MM/dd/yyyy"
    );
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    let MY = this;
    this.common.callApi({
      type: "post",
      url: "leaves/number-of-paidleave",
      data: {
        id: this.viewUserData["user_id"],
      },
      callback: function (res) {
        if (res.leaves.status == "success") {
          MY.EmpNoOfPaidLeave = res.leaves.msg[0].leaves;
          MY.minDateendDate = new Date(MY.viewUserData["from_dt"]);
          MY.minDateendDate.setDate(MY.minDateendDate.getDate());
        }
        MY.common.loader(false);
      },
      onErr: function (res) {},
      onFail: function () {},
    });

    this.modalRefEditLeave = this.modalService.show(template, {
      class: "modal-md",
    });
  }

  onValueChange(value: Date): void {
    var data = value;
    if (data) {
      this.minDateendDate.setDate(data.getDate());
      this.maxDateendDate.setDate(data.getDate() + 14);
    }
    this.show_days(data, "start");
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
    var FromDaateChangeFormate = new Date(this.viewUserData["from_dt"]);
    this.EndDate = value;
    this.StartDate = FromDaateChangeFormate;

    if (this.StartDate && this.EndDate) {
      var StartDateNew = new Date(this.StartDate);
      this.StartDate = this.datePipe.transform(StartDateNew, "yyyy-MM-dd");
      var EndDateNew = new Date(this.EndDate);
      this.EndDate = this.datePipe.transform(EndDateNew, "yyyy-MM-dd");
      let MY = this;
      var date1 = StartDateNew
      var date2 = EndDateNew
      const oneDay = 1000 * 60 * 60 * 24;
      var weekendCount = MY.CalculateWeekendDays(new Date(this.StartDate), new Date(this.EndDate));
      
      var Difference_In_Time = date2.getTime() - date1.getTime();
      const diffInDays = Math.round(Difference_In_Time / oneDay);
      var daysCount =  (diffInDays + 1) - weekendCount;
      MY.userLeaveCount = daysCount

      if (this.EndDate < this.StartDate) {
        MY.common.notificationMsg(
          "alert-fill-danger",
          "Insert valid End Date."
        );
      // } else {
      //   this.common.callApi({
      //     type: "post",
      //     url: "leaves/sandwich-leave",
      //     data: {
      //       end_date: this.EndDate,
      //       start_date: this.StartDate,
      //     },
      //     callback: function (res) {
      //       if (res.leaves.status == "success") {
      //         MY.userLeaveCount = res.leaves.count;
      //         if (res.leaves.sandwich == "Yes") {
      //           MY.common.notificationMsg(
      //             "alert-fill-success",
      //             "Sandwich Leave Apply"
      //           );
      //         }
      //       }
      //       MY.common.loader(false);
      //     },
      //     onErr: function (res) {},
      //     onFail: function () {},
      //   });
      }
    }
  }

  /* Code For Apply Leave Start */
  onEditLeaveSubmit(val: any): void {
    $(".EditLeaveConfirmationButton").trigger("click");
    this.AddLeaveValue = val;
    // if (this.AddLeaveValue.leave_type == 1) {
    //   alert("Full Day");
    //   if (this.AddLeaveValue.total_days < this.EmpNoOfPaidLeave) {
    //     this.TotalUnpaidLeave =
    //       parseInt(this.AddLeaveValue.total_days) -
    //       parseInt(this.AddLeaveValue.total_days);
    //     this.TotalPaidLeave =
    //       parseInt(this.AddLeaveValue.total_days) - this.TotalUnpaidLeave;
    //   } else if (this.AddLeaveValue.total_days > this.EmpNoOfPaidLeave) {
    //     this.TotalUnpaidLeave =
    //       parseInt(this.AddLeaveValue.total_days) - this.EmpNoOfPaidLeave;
    //     this.TotalPaidLeave =
    //       parseInt(this.AddLeaveValue.total_days) - this.TotalUnpaidLeave;
    //   } else if (this.AddLeaveValue.total_days == this.EmpNoOfPaidLeave) {
    //     this.TotalUnpaidLeave =
    //       parseInt(this.AddLeaveValue.total_days) - this.EmpNoOfPaidLeave;
    //     this.TotalPaidLeave = parseInt(this.AddLeaveValue.total_days);
    //   }
    // } else {
    //   alert("Half Day");
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

  confirmEditLeave(): void {
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
        end_dt: this.EndDate,
        from_dt: this.StartDate,
        half_leave_type: this.AddLeaveValue.half_leave_type,
        leave_type: this.AddLeaveValue.leave_type,
        paid_leave: this.TotalPaidLeave,
        reason: this.AddLeaveValue.reason,
        total_days: this.AddLeaveValue.total_days,
        unpaid_leave: this.TotalUnpaidLeave,
        user_id: this.AddLeaveValue.EmployeeId,
      };
    } else if (this.AddLeaveValue.leave_type == 0) {
      var HalftStartDate = new Date(this.AddLeaveValue.from_dt);
      this.HalfLeaveDate = this.datePipe.transform(
        HalftStartDate,
        "yyyy-MM-dd"
      );
      Data = {
        end_dt: this.HalfLeaveDate,
        from_dt: this.HalfLeaveDate,
        half_leave_type: this.AddLeaveValue.half_leave_type,
        leave_type: this.AddLeaveValue.leave_type,
        paid_leave: this.TotalPaidLeave,
        reason: this.AddLeaveValue.reason,
        total_days: this.AddLeaveValue.total_days,
        unpaid_leave: this.TotalUnpaidLeave,
        user_id: this.AddLeaveValue.EmployeeId,
      };
    }
    this.common.callApi({
      type: "post",
      url: "leaves/update-leave",
      data: Data,
      callback: function (res) {
        MY.common.loader(false);
        if (res.leaves.status == "success") {
          MY.common.notificationMsg("alert-fill-success", res.leaves.msg);
          MY.modalRefEditLeave.hide();
          MY.router.navigate(["/viewownleaves"]);
        } else {
          MY.common.notificationMsg("alert-fill-danger", res.leaves.msg);
        }
        $(".ApplyLeaveModalClose").trigger("click");
        //MY.ngOnInit();
      },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg("alert-fill-danger", res);
      },
      onFail: function () {},
    });

    this.modalRef.hide();
  }

  declineAddLeave(): void {
    this.modalRef.hide();
  }

  EditLeaveConfirmayionOpenModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  AddEmployeesLeave(template: TemplateRef<any>) {
    this.modalRefAddLeave = this.modalService.show(template, {
      class: "modal-md",
    });
    this.userLeaveCount = ''
  }

  /* Code For Apply Leave Start */

  onEValueChange(value: Date): void {
    var data = value;
    if (data) {
      this.minDateendDate.setMonth(data.getMonth(), data.getDate());
      this.maxDateendDate.setMonth(data.getMonth(), data.getDate() + 14);
      // this.maxDateendDate.setMonth(data.getMonth(), (data.getDate() + 60));
    }
    this.Eshow_days(data, "start");
  }
  Eshow_days(value: Date, type: any) {
    if (type == "start") {
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
      var date1 = StartDateNew
      var date2 = EndDateNew
      const oneDay = 1000 * 60 * 60 * 24;
      var weekendCount = MY.CalculateWeekendDays(new Date(this.StartDate), new Date(this.EndDate));
      
      var Difference_In_Time = date2.getTime() - date1.getTime();
      const diffInDays = Math.round(Difference_In_Time / oneDay);
      var daysCount =  (diffInDays + 1) - weekendCount;
      MY.userLeaveCount = daysCount

      if (this.EndDate < this.StartDate) {
        MY.common.notificationMsg(
          "alert-fill-danger",
          "Insert valid End Date."
        );
      // } else {
      //   this.common.callApi({
      //     type: "post",
      //     url: "leaves/sandwich-leave",
      //     data: {
      //       end_date: this.EndDate,
      //       start_date: this.StartDate,
      //     },
      //     callback: function (res) {
      //       if (res.leaves.status == "success") {
      //         MY.userLeaveCount = res.leaves.count;
      //         if (res.leaves.sandwich == "Yes") {
      //           MY.common.notificationMsg(
      //             "alert-fill-success",
      //             "Sandwich Leave Apply"
      //           );
      //         }
      //       }
      //       MY.common.loader(false);
      //     },
      //     onErr: function (res) {},
      //     onFail: function () {},
      //   });
      }
    }
  }

  setLeave() {
    var MY = this;
    var valEmp = $("#emp").val();
    this.common.callApi({
      type: "post",
      url: "leaves/number-of-paidleave",
      data: {
        id: valEmp, //this.viewUserData['user_id']
      },
      callback: function (res) {
        if (res.leaves.status == "success") {
          MY.EmpNoOfPaidLeave = res.leaves.msg[0].leaves;
          //this.minDateendDate = new Date(this.viewUserData['from_dt']);
          //this.minDateendDate.setDate(this.minDateendDate.getDate());
          //$('.AddLeaveConfirmationModalButton').trigger('click');
        }
        MY.common.loader(false);
      },
      onErr: function (res) {},
      onFail: function () {},
    });
  }

  onApplyLeaveSubmit(val: any): void {
    var MY = this;
    var valEmp = $("#emp").val();
    var strUser = $("#emp :selected").text();
    val.EmployeeName = strUser;
    val.EmployeeId = valEmp;
    //this.userData['id'] = valEmp;
    // this.common.callApi({
    //   type: 'post',
    //   url: 'leaves/number-of-paidleave',
    //   data: {
    //     'id': valEmp //this.viewUserData['user_id']
    //   },
    //   callback: function (res) {
    //     if (res.leaves.status == 'success') {
    //       this.EmpNoOfPaidLeave = res.leaves.msg[0].leaves;
    //this.minDateendDate = new Date(this.viewUserData['from_dt']);
    //this.minDateendDate.setDate(this.minDateendDate.getDate());
    $(".AddLeaveConfirmationModalButton").trigger("click");
    this.AddLeaveValue = val;
    // if (this.AddLeaveValue.leave_type == 1) {
    //   if (this.AddLeaveValue.total_days < this.EmpNoOfPaidLeave) {
    //     this.TotalUnpaidLeave =
    //       parseInt(this.AddLeaveValue.total_days) -
    //       parseInt(this.AddLeaveValue.total_days);
    //     this.TotalPaidLeave =
    //       parseInt(this.AddLeaveValue.total_days) - this.TotalUnpaidLeave;
    //   } else if (this.AddLeaveValue.total_days > this.EmpNoOfPaidLeave) {
    //     this.TotalUnpaidLeave =
    //       parseInt(this.AddLeaveValue.total_days) - this.EmpNoOfPaidLeave;
    //     this.TotalPaidLeave =
    //       parseInt(this.AddLeaveValue.total_days) - this.TotalUnpaidLeave;
    //   } else if (this.AddLeaveValue.total_days == this.EmpNoOfPaidLeave) {
    //     this.TotalUnpaidLeave =
    //       parseInt(this.AddLeaveValue.total_days) - this.EmpNoOfPaidLeave;
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
    //}
    MY.common.loader(false);
    //   },
    //   onErr: function (res) {
    //   },
    //   onFail: function () {
    //   }
    // });
  }

  AddLeaveConfirmationOpenModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
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
        end_dt: this.EndDate,
        from_dt: this.StartDate,
        half_leave_type: this.AddLeaveValue.half_leave_type,
        leave_type: this.AddLeaveValue.leave_type,
        paid_leave: this.TotalPaidLeave,
        reason: this.AddLeaveValue.reason,
        total_days: this.AddLeaveValue.total_days,
        unpaid_leave: this.TotalUnpaidLeave,
        user_id: this.AddLeaveValue.EmployeeId,
      };
    } else if (this.AddLeaveValue.leave_type == 0) {
      var HalftStartDate = new Date(this.AddLeaveValue.from_dt);
      this.HalfLeaveDate = this.datePipe.transform(
        HalftStartDate,
        "yyyy-MM-dd"
      );
      Data = {
        end_dt: this.HalfLeaveDate,
        from_dt: this.HalfLeaveDate,
        half_leave_type: this.AddLeaveValue.half_leave_type,
        leave_type: this.AddLeaveValue.leave_type,
        paid_leave: this.TotalPaidLeave,
        reason: this.AddLeaveValue.reason,
        total_days: this.AddLeaveValue.total_days,
        unpaid_leave: this.TotalUnpaidLeave,
        user_id: this.AddLeaveValue.EmployeeId,
      };
    }
    this.common.callApi({
      type: "post",
      url: "leaves/add-leave",
      data: Data,
      callback: function (res) {
        MY.common.loader(false);
        if (res.leaves.status == "success") {
          MY.common.notificationMsg("alert-fill-success", res.leaves.msg);
          MY.modalRefAddLeave.hide();
          MY.router.navigate(["/viewleaves"]);
          MY.rerender();
        } else {
          MY.common.notificationMsg("alert-fill-danger", res.leaves.msg);
        }
        $(".ApplyLeaveModalClose").trigger("click");
        //MY.ngOnInit();
      },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg("alert-fill-danger", res);
      },
      onFail: function () {},
    });

    this.modalRef.hide();
  }
  userDatas(userData,type){
    return this.common.userDatas(userData,type);
  }

  approveBdayleave(){
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    let MY = this;
    this.common.callApi({
      type: "post",
      url: "leaves/approve-birthday-leave",
      data: {
        id: MY.approveLeaveId,
        approved_by: MY.userData["id"],
        user_id: MY.approveLeaveUserId,
       },
        callback: function (res) {
          MY.common.loader(false);
          if (res.leaves.status == "success") {
            MY.common.notificationMsg("alert-fill-success", res.leaves.msg);
          } else {
            MY.common.notificationMsg("alert-fill-danger", res.leaves.msg);
          }
          $(".approvebdayLeave").trigger("click");
          MY.rerender();
        },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg("alert-fill-danger", res);
      },
      onFail: function () {},
    });
  }
}
