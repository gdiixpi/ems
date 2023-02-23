import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { BsModalService, BsModalRef, ModalModule } from "ngx-bootstrap/modal";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CommonService } from "../common.service";
import {
  FullCalendarComponent,
  FullCalendarModule,
} from "@fullcalendar/angular";
import { EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DatePipe } from "@angular/common";
import { environment } from "../../environments/environment";
import { formatDate } from "@angular/common";

@Component({
  selector: "app-timeclock",
  templateUrl: "./timeclock.component.html",
  styleUrls: ["./timeclock.component.scss"],
})
export class TimeclockComponent implements OnInit {
  time1 = { hour: 13, minute: 30 };
  meridian1 = false;
  time2 = { hour: 13, minute: 30 };
  meridian2 = false;
  time3 = { hour: 13, minute: 30 };
  meridian3 = false;
  title = ":: EMS :: TimeClock";
  CurrentYear = new Date().getFullYear();
  logindatetime;
  hours = 25;
  userid;
  totalhours;
  totalworkinghours;
  nomessage;
  breakdate;
  Breakindisabled = true;
  Breakoutdisabled = true;
  Breakdisabled = true;
  parentBreadcumbTitle = "View TimeClock";
  parentBreadcumbPath = [{ path: "", title: "TimeClock" }];
  closeResult: string;
  userData = [];
  profileImage = "assets/images/faces/face1.jpg";
  modalRef: BsModalRef | null;
  colorTheme = "theme-dark-blue";
  message: string;
  showModal: boolean;
  showDetail: boolean;
  showdeleteicon: boolean;
  showAllEmployeeData: boolean;
  viewemployee = [];
  showbttons: boolean = false;
  titlee = "ngularfullcalendarbootstrap";
  name: string;
  date: string;
  modaldate: string;
  @ViewChild("calendar", null) calendarComponent: FullCalendarComponent;
  // @ViewChild('external') external: ElementRef;
  options: any;
  detaillist: any;
  eventsModel: any[] = [];
  calendarVisible = true;
  calendarWeekends = true;
  calendarEvents;
  temp_var = false;
  AttandanceDetail: any;
  DateList: any[] = [];
  AttandanceList: any[] = [];
  realTime: any;
  // calendarEvents: EventInput[] = [
  //   { title: 'Event Now', start: new Date() }
  // ];
  toggleVisible() {
    this.calendarVisible = !this.calendarVisible;
  }
  constructor(
    private router: Router,
    private common: CommonService,
    private modalService: BsModalService,
    private titleService: Title,
    private datePipe: DatePipe,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("custom-clock-calendar-ui");
    this.options = {
      editable: false,
      disableDragging: false,
      selectable: true,
      timeZone: "Asia/Kolkata",
      theme: "standart",
      header: {
        right: "prev,next, today",
        left: "title",
      },
      validRange: {
        start: "2017-05-01",
        end: "2022-06-01",
      },
      plugins: [dayGridPlugin, interactionPlugin],
    };
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    this.userid = this.userData["id"];
    var MY = this;
    var datemnth = new Date();
    var firstDay = MY.formatdynamicDate(
      new Date(datemnth.getFullYear(), datemnth.getMonth(), 1)
    );
    var lastDay = MY.formatdynamicDate(
      new Date(datemnth.getFullYear(), datemnth.getMonth() + 1, 1)
    );
    this.counthours(firstDay, lastDay);
    this.disablebuttons();
    if (
      this.userData["id"] == 29 ||
      this.userData["id"] == 102 ||
      this.userData["id"] == 88 ||
      this.userData["id"] == 166 ||
      this.userData["id"] == 96 ||
      this.userData["id"] == 158 ||
      this.userData["id"] == 110 ||
      this.userData["id"] == 144
    ) {
      MY.temp_var = true;
      this.common.callApi({
        type: "post",
        url: "user/view-user-list",
        callback: function (res) {
          if (res.user.status == "success") {
            MY.viewemployee = [];
            res.user.msg.sort((a, b) =>
              a.first_name.localeCompare(b.first_name)
            );
            res.user.msg.forEach((element) => {
              MY.viewemployee.push(element);
            });
          }
          MY.common.loader(false);
        },
        onErr: function (res) {},
        onFail: function () {},
      });
    }
  }

  public disablebuttons() {
    var MY = this;
    this.common.callApi({
      type: "post",
      url: "attendance/get-attendance",
      data: {
        userId: this.userData["id"],
        logtime: this.convertTZdate(),
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.attendance.status == "success") {
          MY.showbttons == false;
          if (res.attendance.attendance.length > 0) {
            for (let i = 0; i < res.attendance.attendance.length; i++) {
              if (res.attendance.attendance[i].log_type == "log-in") {
                MY.Breakindisabled = false;
                MY.Breakdisabled = false;
                MY.Breakoutdisabled = true;
                MY.showbttons = true;
                MY.logindatetime = res.attendance.attendance[i].logtime;
              }
              if (res.attendance.attendance[i].log_type == "break-in") {
                MY.Breakindisabled = true;
                MY.Breakdisabled = true;
                MY.Breakoutdisabled = false;
              }
              if (res.attendance.attendance[i].log_type == "break-out") {
                MY.Breakindisabled = false;
                MY.Breakoutdisabled = true;
                MY.Breakdisabled = false;
              }
              if (res.attendance.attendance[i].log_type == "log-out") {
                MY.Breakindisabled = true;
                MY.Breakoutdisabled = true;
                MY.Breakdisabled = true;
                MY.showbttons = false;
                MY.showdeleteicon = false;
                if (MY.temp_var) {
                  MY.showdeleteicon = true;
                }
              }
            }
          }
        }
      },
      onErr: function (res) {
        MY.common.loader(false);
      },
      onFail: function () {},
    });
  }

  handleDateClick(info) {
    // debugger
    if (localStorage.getItem(environment.userSession) != null) {
      this.modaldate = this.convertLocalDate(info.event._instance.range.start);
      if (this.modaldate <= this.convertTZdate()) {
        var MY = this;
        this.common.callApi({
          type: "post",
          url: "attendance/get-attendance",
          data: {
            userId: this.userData["id"],
            logtime: this.modaldate,
          },
          callback: function (res) {
            MY.common.loader(false);
            if (res.attendance.status == "success") {
              if (res.attendance.attendance.length > 0) {
                MY.detaillist = res.attendance.attendance;
                this.modaldate = MY.convertLocalDate(
                  info.event._instance.range.start
                );
                // Totalworkinghourscount
                var total: any = 0;
                var t = res.attendance.attendance;
                total = MY.cttotalhours(t, this.modaldate);
                MY.totalworkinghours = "Total Working Hours : " + total;
                $("#myModal ngb-timepicker button").css("display", "none");
                MY.nomessage = "";
                MY.showModal = true;
                if (this.modaldate == MY.formatDate()) {
                  // debugger
                  MY.showdeleteicon = true;
                  MY.disablebuttons();
                } else {
                  MY.showdeleteicon = false;
                }
                if (MY.temp_var) {
                  MY.showdeleteicon = true;
                }
              } else {
                MY.detaillist = res.attendance.attendance;
                MY.nomessage =
                  "No Working details available for this date: " +
                  this.modaldate;
                MY.totalworkinghours = "";
                $("#myModal ngb-timepicker button").css("display", "none");
                MY.showModal = true;
              }
            }
          },
        });
      }
    }
  }

  convertTZ() {
    const date = new Date();
    // var dtTOKYO = date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    // return this.formatDateTimedynamic(dtTOKYO);
    var dtTOKYO = formatDate(new Date(), "yyyy-MM-dd H:mm:ss", "en-IN");
    return dtTOKYO;
  }

  convertTZdate() {
    const date = new Date();
    var dtTOKYO = date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    return this.formatDatedynamic(dtTOKYO);
  }
  convertLocalDate(date: any) {
    var dtTOKYO = date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    return this.formatDatedynamic(dtTOKYO);
  }

  counthours(firstDay, lastDay) {
    var MY = this;
    this.common.callApi({
      type: "post",
      url: "attendance/sync-attendance",
      data: {
        userId: this.userData["id"],
        startDate: firstDay,
        endDate: lastDay,
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.attendance.status == "success") {
          MY.Counttotalhours(res);

          //  MY.calendarEvents = arrayhours;
        }
      },
      onErr: function (res) {
        MY.common.loader(false);
      },
      onFail: function () {},
    });
  }

  timediff(date1: any, date2: any) {
    var start_actual_time = date1;
    var end_actual_time = date2;
    start_actual_time = new Date(start_actual_time);
    end_actual_time = new Date(end_actual_time);
    var diff = end_actual_time - start_actual_time;
    var diffSeconds = diff / 1000;
    var HH: any = Math.floor((diff % 86400000) / 3600000) * 60;
    var MM: any = Math.round(((diff % 86400000) % 3600000) / 60000) + HH;
    var formatted = MM;
    return formatted;
  }
  hide() {
    this.showModal = false;
    $("#myModal").hide();
    this.bindcalendardata();
  }
  hidebreakmodal() {
    $("#breakmodal").hide();
  }
  showbreakmodal() {
    $("#breakmodal").show();
  }
  formatDate() {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  formatdynamicDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  formatDateTime() {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear(),
      hour = d.getHours(),
      minutes = d.getMinutes(),
      seconds = d.getSeconds();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  formatDateTimedynamic(date) {
    var d = date.split("/");
    var day = d[0];
    var month = d[1];
    var year = d[2].split(",")[0];
    var hour: any = date.split(", ")[1].split(":")[0];
    var minutes = date.split(", ")[1].split(":")[1];
    var seconds = "00";

    var m = date.split(", ")[1].split(":")[2].split(" ")[1];

    if (m == "pm" && hour != 12) {
      hour = parseInt(hour) + 12;
    }

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    if (hour.length < 2) hour = "0" + hour;
    if (minutes.length < 2) minutes = "0" + minutes;

    return (
      [year, month, day].join("-") + " " + [hour, minutes, seconds].join(":")
    );
  }
  formatDatedynamic(date) {
    var d = date.split("/");
    var day = d[0];
    var month = d[1];
    var year = d[2].split(",")[0];
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  Setuser() {
    var val = $("#emp").val();
    this.userData["id"] = val;
    if (this.userid != val) {
      this.Breakindisabled = true;
      this.Breakoutdisabled = true;
      this.Breakdisabled = true;
    } else {
      this.disablebuttons();
    }
    var month: any = $(".fc-left h2").text().split(" ")[0];
    var year: any = $(".fc-left h2").text().split(" ")[1];
    var dt = new Date(year + "-" + month + "01");
    var firstDay = this.formatdynamicDate(
      new Date(dt.getFullYear(), dt.getMonth(), 1)
    );
    var lastDay = this.formatdynamicDate(
      new Date(dt.getFullYear(), dt.getMonth() + 1, 1)
    );
    this.counthours(firstDay, lastDay);
  }
  Breakin() {
    var MY = this;
    this.common.callApi({
      type: "post",
      url: "attendance/add-attendance",
      data: {
        userId: this.userData["id"],
        log_type: "break-in",
        logtime: this.convertTZ(),
        ismanual: 0,
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.attendance.status == "success") {
          MY.common.notificationMsg("alert-fill-success", "Enjoy Break...!!!");
          MY.Breakindisabled = true;
          MY.Breakoutdisabled = false;
          MY.Breakdisabled = true;
          window.location.reload();
        } else {
          MY.common.notificationMsg("alert-fill-danger", res.user.msg);
        }
      },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg("alert-fill-danger", res);
      },
      onFail: function () {},
    });
  }
  BreakOut() {
    var MY = this;
    this.common.callApi({
      type: "post",
      url: "attendance/add-attendance",
      data: {
        userId: this.userData["id"],
        log_type: "break-out",
        logtime: this.convertTZ(),
        ismanual: 0,
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.attendance.status == "success") {
          MY.common.notificationMsg(
            "alert-fill-success",
            "get back to work...!!!"
          );
          MY.Breakindisabled = false;
          MY.Breakoutdisabled = true;
          MY.Breakdisabled = false;
          window.location.reload();
        } else {
          MY.common.notificationMsg("alert-fill-danger", res.user.msg);
        }
      },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg("alert-fill-danger", res);
      },
      onFail: function () {},
    });
  }
  AddEntry() {
    if ($("#actiontype").val() != "") {
      var MY = this;
      this.common.callApi({
        type: "post",
        url: "attendance/add-attendance",
        data: {
          userId: this.userData["id"],
          log_type: $("#actiontype").val(),
          logtime: this.Entrytime(),
          ismanual: 1,
        },
        callback: function (res) {
          MY.common.loader(false);
          if (res.attendance.status == "success") {
            MY.Updateattendancelist();
            MY.bindcalendardata();
            MY.common.notificationMsg(
              "alert-fill-success",
              "Record Added Successfully"
            );
          } else {
            MY.common.notificationMsg(
              "alert-fill-danger",
              "Something went wrong to add this data"
            );
          }
        },
        onErr: function (res) {
          MY.common.loader(false);
          MY.common.notificationMsg("alert-fill-danger", res);
        },
        onFail: function () {},
      });
    }
  }
  AddBreak() {
    var MY = this;
    var timeflag: boolean = false;
    var ctimeflag: boolean = false;
    var logintimeflag: boolean = false;
    var cdate = MY.convertTZ();
    var chour: any = cdate.split(" ")[1].split(":")[0];
    var cminutes: any = cdate.split(" ")[1].split(":")[1];
    var logintimehour = MY.logindatetime.split(" ")[1].split(":")[0];
    var logintimemin = MY.logindatetime.split(" ")[1].split(":")[1];
    if (MY.time1.hour >= logintimehour) {
      if (MY.time1.hour > logintimehour) {
        logintimeflag = true;
      } else if (MY.time1.hour == logintimehour) {
        if (MY.time1.minute > logintimemin) {
          logintimeflag = true;
        } else {
          logintimeflag = false;
        }
      }
    }
    if (MY.time1.hour <= chour && MY.time2.hour <= chour) {
      if (MY.time1.hour == chour) {
        if (MY.time1.minute <= cminutes) {
          ctimeflag = true;
        } else {
          ctimeflag = false;
        }
      } else if (MY.time1.hour < chour) {
        ctimeflag = true;
      }
      if (ctimeflag == true) {
        if (MY.time2.hour == chour) {
          if (MY.time2.minute <= cminutes) {
            ctimeflag = true;
          } else {
            ctimeflag = false;
          }
        } else if (MY.time2.hour < chour) {
          ctimeflag = true;
        }
      }
    }
    if (MY.time1.hour <= MY.time2.hour) {
      if (MY.time1.hour == MY.time2.hour) {
        if (MY.time1.minute < MY.time2.minute) {
          timeflag = true;
        } else {
          timeflag = false;
        }
      } else if (MY.time1.hour < MY.time2.hour) {
        timeflag = true;
      }
    }
    if ($("#start_date").val() != "") {
      if (logintimeflag == true) {
        if (timeflag == true && ctimeflag == true) {
          this.common.callApi({
            type: "post",
            url: "attendance/add-attendance",
            data: {
              userId: this.userData["id"],
              log_type: "break-in",
              logtime: this.BreakInManuall(),
              ismanual: 1,
            },
            callback: function (res) {
              MY.common.loader(false);
              if (res.attendance.status == "success") {
                MY.breakoutmenual();
              } else {
                MY.common.notificationMsg("alert-fill-danger", res.user.msg);
              }
            },
            onErr: function (res) {
              MY.common.loader(false);
              MY.common.notificationMsg("alert-fill-danger", res);
            },
            onFail: function () {},
          });
        } else {
          MY.common.notificationMsg(
            "alert-fill-danger",
            "Please Enter Correct Time"
          );
        }
      } else {
        MY.common.notificationMsg(
          "alert-fill-danger",
          "Please Enter Breakin Time greater than login time"
        );
      }
    } else {
      MY.common.notificationMsg("alert-fill-danger", "Please Select Date");
    }
  }
  breakoutmenual() {
    var MY = this;
    this.common.callApi({
      type: "post",
      url: "attendance/add-attendance",
      data: {
        userId: this.userData["id"],
        log_type: "break-out",
        logtime: this.BreakoutManuall(),
        ismanual: 1,
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.attendance.status == "success") {
          MY.common.notificationMsg(
            "alert-fill-success",
            "Break Added Successfully"
          );
          MY.bindcalendardata();
          MY.hidebreakmodal();
        }
      },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg("alert-fill-danger", res);
      },
      onFail: function () {},
    });
  }

  BreakInManuall() {
    this.breakdate = this.datePipe.transform(
      $("#start_date").val(),
      "yyyy-MM-dd"
    );
    var d = new Date(this.breakdate),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear(),
      hour = this.time1.hour,
      minutes = this.time1.minute,
      seconds = "00";

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return (
      [year, month, day].join("-") +
      " " +
      [
        hour < 10 ? "0" + hour : hour,
        minutes < 10 ? "0" + minutes : minutes,
        seconds,
      ].join(":")
    );
  }
  Entrytime() {
    var t = this.modaldate;
    var d = new Date(this.modaldate),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear(),
      hour = this.time3.hour,
      minutes = this.time3.minute,
      seconds = "00";

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return (
      [year, month, day].join("-") +
      " " +
      [
        hour < 10 ? "0" + hour : hour,
        minutes < 10 ? "0" + minutes : minutes,
        seconds,
      ].join(":")
    );
  }
  BreakoutManuall() {
    this.breakdate = this.datePipe.transform(
      $("#start_date").val(),
      "yyyy-MM-dd"
    );
    var d = new Date(this.breakdate),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear(),
      hour = this.time2.hour,
      minutes = this.time2.minute,
      seconds = "00";

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return (
      [year, month, day].join("-") +
      " " +
      [
        hour < 10 ? "0" + hour : hour,
        minutes < 10 ? "0" + minutes : minutes,
        seconds,
      ].join(":")
    );
  }
  Deleterecord(id) {
    var MY = this;
    this.common.callApi({
      type: "post",
      url: "attendance/delete-attendance",
      data: {
        attendanceId: id,
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.attendance.status == "success") {
          MY.Updateattendancelist();
          MY.bindcalendardata();
          MY.common.notificationMsg(
            "alert-fill-success",
            "Record Deleted Successfully"
          );
        }
      },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg("alert-fill-danger", res);
      },
      onFail: function () {},
    });
  }
  Updateattendancelist() {
    var MY = this;
    this.common.callApi({
      type: "post",
      url: "attendance/get-attendance",
      data: {
        userId: this.userData["id"],
        logtime: MY.modaldate,
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.attendance.status == "success") {
          if (res.attendance.attendance.length > 0) {
            MY.detaillist = res.attendance.attendance;
            var total: any = 0;
            var t = res.attendance.attendance;
            total = MY.cttotalhours(t, MY.modaldate);
            MY.totalworkinghours = "Total Working Hours : " + total;
            MY.nomessage = "";
            this.showModal = true;
            $("#myModal ngb-timepicker button").css("display", "none");
            $("#myModal").show();
          } else {
            MY.detaillist = res.attendance.attendance;
            MY.totalworkinghours = "";
            MY.nomessage =
              "No Working details available for this date: " + MY.modaldate;
            this.showModal = true;
            $("#myModal ngb-timepicker button").css("display", "none");
            $("#myModal").show();
          }
        }
      },
    });
  }
  ngAfterViewInit() {
    this.elementRef.nativeElement
      .querySelector(".fc-next-button")
      .addEventListener("click", this.nextClick.bind(this));

    this.elementRef.nativeElement
      .querySelector(".fc-prev-button")
      .addEventListener("click", this.prevClick.bind(this));

    this.elementRef.nativeElement
      .querySelector(".fc-today-button")
      .addEventListener("click", this.prevClick.bind(this));
  }

  nextClick(event) {
    var month: any = $(".fc-left h2").text().split(" ")[0];
    var year: any = $(".fc-left h2").text().split(" ")[1];
    var dt = new Date(year + "-" + month + "01");
    var firstDay = this.formatdynamicDate(
      new Date(dt.getFullYear(), dt.getMonth(), 1)
    );
    var lastDay = this.formatdynamicDate(
      new Date(dt.getFullYear(), dt.getMonth() + 1, 1)
    );
    this.counthours(firstDay, lastDay);
    // this.ngAfterViewInit();
  }

  bindcalendardata() {
    var month: any = $(".fc-left h2").text().split(" ")[0];
    var year: any = $(".fc-left h2").text().split(" ")[1];
    var dt = new Date(year + "-" + month + "01");
    var firstDay = this.formatdynamicDate(
      new Date(dt.getFullYear(), dt.getMonth(), 1)
    );
    var lastDay = this.formatdynamicDate(
      new Date(dt.getFullYear(), dt.getMonth() + 1, 1)
    );
    this.counthours(firstDay, lastDay);
  }

  prevClick(event) {
    var month: any = $(".fc-left h2").text().split(" ")[0];
    var year: any = $(".fc-left h2").text().split(" ")[1];
    var dt = new Date(year + "-" + month + "01");
    var firstDay = this.formatdynamicDate(
      new Date(dt.getFullYear(), dt.getMonth(), 1)
    );
    var lastDay = this.formatdynamicDate(
      new Date(dt.getFullYear(), dt.getMonth() + 1, 1)
    );
    this.counthours(firstDay, lastDay);
    // this.ngAfterViewInit();
  }

  ngDestroy() {
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("custom-clock-calendar-ui");
  }

  Counttotalhours(res) {
    var arrayhours = [];
    for (let i = 0; i < res.attendance.attendance.length; i++) {
      var first,
        second,
        logdiff: any = 0,
        total: any = 0;
      var t = res.attendance.attendance[i].log;
      var ct = res.attendance.attendance[i].log.length;
      if (t.filter((r) => r.log_type == "log-in").length == 0) {
        total = 0;
      } else {
        total = this.cttotalhours(t, res.attendance.attendance[i].date);
      }
      // this.common.passTime(total);
      var hrtotal = {
        title: "Total Hours: " + total,
        date: res.attendance.attendance[i].date,
      };
      arrayhours.push(hrtotal);
    }
    this.calendarEvents = arrayhours;
  }
  cttotalhours(t, cdaydate) {
    var logdiff: any = 0,
      total: any = 0;
    var logincount = t.filter((r) => r.log_type == "log-in").length;
    var breakincount = t.filter((r) => r.log_type == "break-in").length;
    var logoutcount = t.filter((r) => r.log_type == "log-out").length;
    var breakoutcount = t.filter((r) => r.log_type == "break-out").length;
    if (
      logincount == 1 &&
      logoutcount == 1 &&
      breakincount == 0 &&
      breakoutcount == 0
    ) {
      var loginc = t.filter((r) => r.log_type == "log-in")[0].logtime;
      var logOutc = t.filter((r) => r.log_type == "log-out")[0].logtime;
      logdiff = this.timediff(loginc, logOutc);
      total = parseFloat(logdiff).toFixed(2);
    } else if (
      logincount == 1 &&
      logoutcount == 0 &&
      cdaydate == this.formatDate()
    ) {
      if (
        logincount == 1 &&
        logoutcount == 0 &&
        breakincount == 0 &&
        breakoutcount == 0
      ) {
        var loginc = t.filter((r) => r.log_type == "log-in")[0].logtime;
        logdiff = this.timediff(loginc, this.convertTZ());
        total = parseFloat(logdiff).toFixed(2);
      } else if (logincount == 1 && breakincount >= 1) {
        var loginc = t.filter((r) => r.log_type == "log-in")[0].logtime;
        var logOutc =
          logoutcount == 0
            ? null
            : t.filter((r) => r.log_type == "log-out")[0].logtime;
        if (breakincount >= 1) {
          var breakout;
          logdiff =
            logoutcount == 0
              ? breakincount == breakoutcount
                ? this.timediff(loginc, this.convertTZ())
                : this.timediff(
                    loginc,
                    t.filter((r) => r.log_type == "break-in")[breakincount - 1]
                      .logtime
                  )
              : this.timediff(loginc, logOutc);
          total = parseFloat(logdiff).toFixed(2);
          for (let j = 0; j < breakincount; j++) {
            var breakin = t.filter((r) => r.log_type == "break-in")[j].logtime;
            breakout =
              breakoutcount > 0
                ? t.filter((r) => r.log_type == "break-out")[j] != undefined
                  ? t.filter((r) => r.log_type == "break-out")[j].logtime
                  : ""
                : "";
            logdiff =
              logoutcount == 0
                ? breakincount == breakoutcount
                  ? this.timediff(
                      t.filter((r) => r.log_type == "break-in")[j].logtime,
                      t.filter((r) => r.log_type == "break-out")[j].logtime
                    )
                  : breakincount > 1
                  ? j < breakincount - 1
                    ? t.filter((r) => r.log_type == "break-out")[j] != undefined
                      ? this.timediff(
                          t.filter((r) => r.log_type == "break-in")[j].logtime,
                          t.filter((r) => r.log_type == "break-out")[j].logtime
                        )
                      : 0
                    : 0
                  : 0
                : this.timediff(breakin, breakout == "" ? logOutc : breakout);
            total = (parseFloat(total) - parseFloat(logdiff)).toFixed(2);
          }
        }
      }
    } else if (logincount == 1 && breakincount >= 1) {
      var loginc = t.filter((r) => r.log_type == "log-in")[0].logtime;
      var logOutc =
        logoutcount == 0
          ? null
          : t.filter((r) => r.log_type == "log-out")[0].logtime;
      if (breakincount >= 1) {
        var breakout;
        logdiff =
          logoutcount == 0
            ? this.timediff(
                loginc,
                t.filter((r) => r.log_type == "break-in")[breakincount - 1]
                  .logtime
              )
            : this.timediff(loginc, logOutc);
        total = parseFloat(logdiff).toFixed(2);
        for (let j = 0; j < breakincount; j++) {
          var breakin = t.filter((r) => r.log_type == "break-in")[j].logtime;
          breakout =
            breakoutcount > 0
              ? t.filter((r) => r.log_type == "break-out")[j] != undefined
                ? t.filter((r) => r.log_type == "break-out")[j].logtime
                : ""
              : "";
          logdiff =
            logoutcount == 0
              ? breakincount > 1
                ? j < breakincount - 1
                  ? t.filter((r) => r.log_type == "break-out")[j] != undefined
                    ? this.timediff(
                        t.filter((r) => r.log_type == "break-in")[j].logtime,
                        t.filter((r) => r.log_type == "break-out")[j].logtime
                      )
                    : 0
                  : 0
                : 0
              : this.timediff(breakin, breakout == "" ? logOutc : breakout);
          total = (parseFloat(total) - parseFloat(logdiff)).toFixed(2);
        }
      }
    }
    var hours = Math.floor(total / 60);
    var minutes: any = total % 60;
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    total = hours + "." + minutes;
    return total;
  }
}
