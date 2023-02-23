import { DatePipe } from "@angular/common";
import {
  Component,
  OnInit,
  TemplateRef,
  ViewEncapsulation,
} from "@angular/core";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import * as $ from "jquery";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { environment } from "../../environments/environment";
import { CommonService } from "../common.service";
import dayGridPlugin from "@fullcalendar/daygrid";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["../app.component.scss", "./dashboard.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  title = ":: EMS :: Dashboard";
  parentBreadcumbTitle = "Dashboard";
  parentBreadcumbPath = [{ path: "", title: "Dashboard" }];
  CurrentYear = new Date().getFullYear();
  closeResult: string;
  userData: any;
  profileImage = "assets/images/faces/face1.jpg";
  holiday = [];
  dob = [];
  leave_balance = [];
  totalLeaveBalance = 0;
  totalPaidLeave = 0;
  totalUnpaidLeave = 0;
  totalDaysLeave = 0;
  view_leave = [];
  users = 0;
  probation = 0;
  trainee = 0;
  modalRef: BsModalRef | null;
  colorTheme = "theme-dark-blue";
  message: string;
  minDate: Date;
  maxDate: Date;
  deleteHoliday = 0;
  editHoliday = 0;
  holiday_date: any;
  holiday_name = "";
  holiday_day = "";
  new_emp_profile_pic = "";
  viewleave = [];
  EmployeeOfQuarter = [];
  EmployeeOfQuarterSelect = [];
  event: any;
  holidayData: any;
  noticeUser: any;
  probationData: any;
  appraisalData: any;
  workFromhome: any;
  ParticularEmpLeave = [
    (paid_leave) => "",
    (unpaid_leave) => "",
    (leaves) => "",
  ];
  totalLeave: any;
  bsConfig = Object.assign(
    {},
    {
      containerClass: this.colorTheme,
      dateInputFormat: "MM/DD/YYYY",
      isAnimated: true,
    }
  );
  bsInlineValue = new Date();

  constructor(
    private router: Router,
    private common: CommonService,
    private modalService: BsModalService,
    private datePipe: DatePipe,
    private titleService: Title
  ) {
    if (localStorage.getItem(environment.userSession) == null) {
      this.router.navigate(["/login"]);
    }
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    this.profileImage =
      environment.proPicURL +
      this.userData["id"] +
      "/" +
      this.userData["profile_pic"];
    this.maxDate = new Date();
    // this.minDate.setDate(this.minDate.getDate() - 1);
    this.maxDate.setDate(this.maxDate.getDate() - 18 * 365);
  }

  calendarPlugins = [dayGridPlugin];
  ngOnInit() {
    this.titleService.setTitle(this.title);
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    let MY = this;

    // $(".top, .bottom").lettering();
    if (MY.userData["access_type"] !== "admin" && MY.userData["count_id"] > 0) {
      this.common.callApi({
        type: "post",
        url: "leaves/view-leave",
        data: {
          superior_id: MY.userData["user_id"],
        },
        callback: function (res) {
          if (res.status == "success") {
            MY.view_leave = res.viewleave;
          }
          MY.common.loader(false);
        },
        onErr: function (res) {},
        onFail: function () {},
      });
    }

    this.common.callApi({
      type: "post",
      url: "user/deshboard",
      data: {
        user_id: this.userData["user_id"],
      },
      callback: function (res) {
        if (res.status == "success") {
          MY.holiday = [];
          MY.holidayData = res.data.holiday;
          MY.totalLeave = res.data.viewleave;
          MY.noticeUser = res.data.noticeperiod;
          MY.probationData = res.data.probation_data;
          MY.appraisalData = res.data.appraisal;
          MY.workFromhome = res.data.work_from_home;
          res.data.holiday.forEach((element) => {
            var currentDate = new Date();
            var HolidayDate = new Date(element.h_date);
            var currentDateString = currentDate.getMonth() + 1;
            var getholidayMonth = HolidayDate.getMonth() + 1;
            if (currentDateString == getholidayMonth) {
              element.className = "text-success";
            } else if (currentDateString > getholidayMonth) {
              element.className = "text-danger";
            } else {
              element.className = "text-black";
            }
            MY.holiday.push(element);
          });
          MY.dob = res.data.dob;
          MY.leave_balance = res.data.leave_balance;
          if (MY.userData["access_type"] == "admin") {
            MY.view_leave = res.data.viewleave;
          }
          MY.users = res.data.users;
          MY.probation = res.data.probation;
          MY.EmployeeOfQuarter = res.data.employee_of_quarter;
          if (MY.EmployeeOfQuarter["emp_profile"] != "") {
            MY.new_emp_profile_pic =
              environment.employeeOfQuarterImageURL +
              "/" +
              MY.EmployeeOfQuarter["emp_profile"];
          } else {
            MY.new_emp_profile_pic = "assets/images/faces/face1.jpg";
          }
          MY.trainee = res.data.trainee;
          MY.leave_balance.forEach((element) => {
            if (
              element.id == MY.userData["id"] &&
              MY.userData["access_type"] !== "admin"
            ) {
              MY.totalLeaveBalance = element.leaves;
            } else if (MY.userData["access_type"] == "admin") {
              MY.totalLeaveBalance += element.leaves;
            }
          });
          MY.ParticularEmpLeave = MY.leave_balance.find(
            (x) => x.id == MY.userData["user_id"]
          );
          if (MY.userData["access_type"] == "admin") {
            MY.view_leave.forEach((element) => {
              if (
                element.id == MY.userData["id"] &&
                MY.userData["access_type"] !== "admin"
              ) {
                MY.totalPaidLeave = element.paid_leave;
              } else if (MY.userData["access_type"] == "admin") {
                MY.totalPaidLeave += element.paid_leave;
              }
            });
            MY.view_leave.forEach((element) => {
              if (
                element.id == MY.userData["id"] &&
                MY.userData["access_type"] !== "admin"
              ) {
                MY.totalUnpaidLeave = element.unpaid_leave;
              } else if (MY.userData["access_type"] == "admin") {
                MY.totalUnpaidLeave += element.unpaid_leave;
              }
            });
          }
          MY.view_leave.forEach((element) => {
            if (
              element.id == MY.userData["id"] &&
              MY.userData["access_type"] !== "admin"
            ) {
              MY.totalDaysLeave = element.total_days;
            } else if (MY.userData["access_type"] == "admin") {
              MY.totalDaysLeave += element.total_days;
            }
          });
        }
        MY.common.loader(false);
      },
      onErr: function (res) {},
      onFail: function () {},
    });

    this.common.callApi({
      type: "post",
      url: "user/view-user-list",
      data: {
        user_status: 1,
      },
      callback: function (res) {
        if (res.user.status == "success") {
          MY.EmployeeOfQuarterSelect = res.user.msg;
          MY.event = [];
          res.user.msg.forEach((element) => {
            if (element.dob != undefined) {
              let date = new Date();
              let date2 = element.dob.split("-");
              MY.event.push({
                title: element.first_name + " " + element.last_name,
                date: date.getFullYear() + "-" + date2[1] + "-" + date2[2],
                className: "mdi mdi-cake",
              });
            }
          });
        }
        MY.common.loader(false);
      },
      onErr: function (res) {},
      onFail: function () {},
    });
  }

  // Code for addholiday
  onSubmit(val: any): void {
    var MY = this;
    this.common.callApi({
      type: "post",
      url: "holiday/add-holiday",
      data: {
        h_date: val.holiday_date,
        h_name: val.holiday_name,
        h_day: val.holiday_day,
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.holiday.status == "success") {
          MY.common.notificationMsg("alert-fill-success", res.holiday.msg);
        } else {
          MY.common.notificationMsg("alert-fill-danger", res.holiday.msg);
        }
        $(".HolidayClose").trigger("click");
        MY.ngOnInit();
      },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg("alert-fill-danger", res);
      },
      onFail: function () {},
    });
  }
  // Code for open modal
  EditHolidayModalOpen(key: any) {
    var ddta = this.holiday[key];
    this.editHoliday = ddta.id;
    var tempDate = new Date(ddta.h_date);
    this.holiday_date = this.datePipe.transform(tempDate, "MM/dd/yyyy");
    this.holiday_name = ddta.h_name;
    this.holiday_day = ddta.h_day;
    $(".EditHolidayModal").trigger("click");
  }

  // Code for editholiday
  onEditSubmit(val: any): void {
    var MY = this;
    var temp_date = MY.holiday_date;
    var temp_name = MY.holiday_name;
    var temp_day = MY.holiday_day;
    if (val.holiday_date != "holiday_date") {
      temp_date = this.datePipe.transform(val.holiday_date, "yyyy-MM-dd");
    }
    if (val.holiday_day != "holiday_day") {
      temp_day = val.holiday_day;
    }
    if (val.holiday_name != "holiday_name") {
      temp_name = val.holiday_name;
    }

    this.common.callApi({
      type: "post",
      url: "holiday/update-holiday",
      data: {
        h_date: temp_date,
        h_name: temp_name,
        h_day: temp_day,
        id: MY.editHoliday,
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.holiday.status == "success") {
          MY.common.notificationMsg("alert-fill-success", res.holiday.msg);
        } else {
          MY.common.notificationMsg("alert-fill-danger", res.holiday.msg);
        }
        $(".EditHolidayClose").trigger("click");
        MY.ngOnInit();
      },

      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg("alert-fill-danger", res);
      },
      onFail: function () {},
    });
  }

  // Code for delete holiday
  confirm(): void {
    var MY = this;
    this.common.callApi({
      type: "post",
      url: "holiday/delete-holiday",
      data: {
        id: MY.deleteHoliday,
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.holiday.status == "success") {
          MY.common.notificationMsg("alert-fill-success", res.holiday.msg);
        } else {
          MY.common.notificationMsg("alert-fill-danger", res.holiday.msg);
        }
        $(".HolidayDeleteClose").trigger("click");
        MY.ngOnInit();
      },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg("alert-fill-danger", res);
        $(".HolidayDeleteClose").trigger("click");
      },
      onFail: function () {},
    });
  }

  decline(): void {
    this.message = "Declined!";
    this.modalRef.hide();
  }

  // Code for add employee of the quarter
  onAddEmployeeQuarterSubmit(val: any) {
    var MY = this;
    this.common.callApi({
      type: "post",
      url: "user/update-employee-quarter",
      data: {
        emp_name: val.assignEmployee,
        image: (<any>document).getElementById("hidden_val").value,
        description: val.quarter_description,
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.eoq.status == "success") {
          MY.common.notificationMsg("alert-fill-success", res.eoq.msg);
        } else {
          MY.common.notificationMsg("alert-fill-danger", res.eoq.msg);
        }
        $(".EditEmployeeQuarterClose").trigger("click");
        MY.ngOnInit();
      },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg("alert-fill-danger", res);
      },
      onFail: function () {},
    });
  }

  FileOpen() {
    $("input#file-input").trigger("click");
  }

  readURL(input) {
    if (input.target.files && input.target.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e: any) {
        $("#ProPic").attr("src", e.target.result);
        $("#hidden_val").val(e.target.result);
      };
      reader.readAsDataURL(input.target.files[0]);
    }
  }
  openModal(template: TemplateRef<any>, id: any) {
    this.deleteHoliday = id;
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  openModalHoliday(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }

  // Code for open edit employee of quarter modal
  EditEmployeeOfQuarterModalOpen(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }
  userDatas(userData, type) {
    return this.common.userDatas(userData, type);
  }
}
