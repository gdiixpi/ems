import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig } from "@ng-bootstrap/ng-bootstrap";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { CommonService } from "../common.service";
import { environment } from "../../environments/environment";
import { templateJitUrl } from "@angular/compiler";
import { formatDate } from "@angular/common";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
  providers: [NgbDropdownConfig],
})
export class NavbarComponent implements OnInit {
  public sidebarOpened = false;
  profileImage = "assets/images/faces/face1.jpg";
  LoginUserId = "";
  userData = [];
  NotificationCount = 0;
  NotificationList = [];
  Clockindisabled;
  Clockoutdisabled;
  navDetails: any;
  navtime: any;

  toggleOffcanvas() {
    this.sidebarOpened = !this.sidebarOpened;
    if (this.sidebarOpened) {
      document.querySelector(".sidebar-offcanvas").classList.add("active");
    } else {
      document.querySelector(".sidebar-offcanvas").classList.remove("active");
    }
  }
  constructor(
    config: NgbDropdownConfig,
    private router: Router,
    private common: CommonService
  ) {
    config.placement = "bottom-right";
  }
  ngOnInit() {
    if (localStorage.getItem(environment.userSession) == null) {
      this.router.navigate(["/login"]);
    }
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    this.LoginUserId = this.userData["id"];
    if (this.userData["profile_pic"] != "")
      this.profileImage =
        environment.proPicURL +
        this.userData["id"] +
        "/" +
        this.userData["profile_pic"];
    var MY = this;
    this.common.callApi({
      type: "post",
      url: "notification/get-count",
      data: {
        user_id: this.userData["id"],
      },
      callback: function (res) {
        if (res.notification.status == "success") {
          MY.NotificationCount = res.notification.data.total;
          MY.NotificationList = res.notification.data.list;
        }
        MY.common.loader(false);
      },
      onErr: function (res) {},
      onFail: function () {},
    });

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
          if (res.attendance.attendance.length > 0) {
            MY.CounttotalTime(res);
            MY.Clockindisabled = true;
            MY.Clockoutdisabled = false;

            for (let i = 0; i < res.attendance.attendance.length; i++) {
              if (res.attendance.attendance[i].log_type == "break-in") {
                MY.Clockoutdisabled = true;
              }
              if (res.attendance.attendance[i].log_type == "break-out") {
                MY.Clockoutdisabled = false;
              }
              if (res.attendance.attendance[i].log_type == "log-out") {
                MY.Clockindisabled = true;
                MY.Clockoutdisabled = true;
              }
            }
          } else {
            MY.Clockindisabled = false;
            MY.Clockoutdisabled = true;
          }
        }
      },
      onErr: function (res) {
        MY.common.loader(false);
      },
      onFail: function () {},
    });
  }

  convertTZ() {
    const date = new Date();
    // var dtTOKYO = date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    // return this.formatDateTimedynamic(dtTOKYO);

    var dtTOKYO = formatDate(new Date(), "yyyy-MM-dd H:mm:ss", "en-IN");
    return dtTOKYO;
  }
  convertTZdate() {
    const date = new Date();
    var dtTOKYO = date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    return this.formatDatedynamic(dtTOKYO);
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
  formatDate() {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
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

    return (
      [year, month, day].join("-") + " " + [hour, minutes, seconds].join(":")
    );
  }
  notificationList() {
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    var MY = this;
    this.common.callApiWithOutLoader({
      type: "post",
      url: "notification/get-list",
      data: {
        user_id: this.userData["id"],
      },
      callback: function (res) {
        if (res.notification.status == "success") {
          // MY.NotificationList = res.notification.data;
          //  MY.ngOnInit();
        }
        MY.common.loader(false);
      },
      onErr: function (res) {},
      onFail: function () {},
    });
  }
  Clockin() {
    var MY = this;
    this.common.callApi({
      type: "post",
      url: "attendance/add-attendance",
      data: {
        userId: this.userData["id"],
        log_type: "log-in",
        logtime: this.convertTZ(),
        ismanual: 0,
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.attendance.status == "success") {
          MY.common.notificationMsg(
            "alert-fill-success",
            "Attendance Added Successfully"
          );
          MY.Clockindisabled = true;
          MY.Clockoutdisabled = false;
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
  Clockout() {
    var MY = this;
    this.common.callApi({
      type: "post",
      url: "attendance/add-attendance",
      data: {
        userId: this.userData["id"],
        log_type: "log-out",
        logtime: this.convertTZ(),
        ismanual: 0,
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.attendance.status == "success") {
          MY.common.notificationMsg(
            "alert-fill-success",
            "Clock-Out done Successfully"
          );
          MY.Clockindisabled = true;
          MY.Clockoutdisabled = true;
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
  /* Code For Logout */
  LogOut() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(["/login"]);
  }
  /* Logout Code End */

  CounttotalTime(res) {
    setInterval(() => {
      for (let i = 0; i < res.attendance.attendance.length; i++) {
        var first,
          second,
          logdiff: any = 0,
          totalTime: any = 0;
        var t = res.attendance.attendance;
        var ct = res.attendance.attendance[i].length;
        if (t.filter((r) => r.log_type == "log-in").length == 0) {
          totalTime = 0;
        } else {
          totalTime = this.cttotalhours(
            t,
            res.attendance.attendance[i].logtime.slice(0, 10)
          );
        }
        this.navtime = totalTime;
        for (let i = 0; i < res.attendance.attendance.length; i++) {
          if (
            res.attendance.attendance[i].log_type == "log-in" ||
            res.attendance.attendance[i].log_type == "break-out"
          ) {
            this.navDetails = "IN" + " : " + this.navtime;
          }
          if (
            res.attendance.attendance[i].log_type == "break-in" ||
            res.attendance.attendance[i].log_type == "log-out"
          ) {
            this.navDetails = "OUT" + " : " + this.navtime;
          }
        }
      }
    }, 1000);
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
}
