import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import dayGridMonth from "@fullcalendar/daygrid";
import { Router, ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CommonService } from "../common.service";
import { environment } from "../../environments/environment";
import { DatePipe } from "@angular/common";
import { element } from "protractor";
import { ViewownleavesComponent } from "../viewownleaves/viewownleaves.component";
import { FullCalendarComponent } from "@fullcalendar/angular";
import interactionPlugin from "@fullcalendar/interaction";
@Component({
  selector: "app-multievent-calender",
  templateUrl: "./multievent-calender.component.html",
  styleUrls: ["./multievent-calender.component.scss"],
})
export class MultieventCalenderComponent implements OnInit {
  @ViewChild("calendar", { static: false })
  calendarComponent: FullCalendarComponent;
  @Input() holidayData: any = [];
  @Input() viewLeaves: any = [];
  @Input() noticeUserData: any = [];
  @Input() probationData: any = [];
  @Input() appraisalData: any = [];
  @Input() workFromhome: any = [];
  title = ":: EMS :: Event Calendar";
  event: any;
  eventArray: any;
  userData = [];
  userRole: any;
  show: boolean = true;
  // viewOwnleave:any;
  options: any;
  calendarPlugins = [dayGridPlugin, dayGridMonth, interactionPlugin];
  calendarApi: any;
  constructor(
    private router: Router,
    private titleService: Title,
    private common: CommonService,
    public datepipe: DatePipe,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("custom-clock-calendar-ui");
    this.titleService.setTitle(this.title);
    var user = localStorage.getItem(environment.userSession);
    // this.options = {
    //     editable: false,
    //     disableDragging: false,
    //     selectable: true,
    //     theme: 'standart',
    //     header: {
    //       right: 'prev,next, today',
    //       left: 'title',
    //     },
    //     validRange: {
    //       start: '2017-05-01',
    //       end: '2022-06-01'
    //     },
    //     plugins: [dayGridPlugin,dayGridMonth,interactionPlugin],
    //   };
    this.userData = JSON.parse(user);
    let MY = this;
    MY.event = [];
    MY.eventArray = [];

    //holiday event list
    MY.holidayData.forEach((element) => {
      let date = new Date();
      var hname = element.h_name;
      if (element.h_date != undefined) {
        var hdate = element.h_date.split("T");
        var hdate2 = hdate[0].split("-");
        MY.eventArray.push({
          title: hname,
          date: date.getFullYear() + "-" + hdate2[1] + "-" + hdate2[2],
          color: "#80884e",
        });
      }
    });
    MY.viewLeaves.forEach((element, index) => {
      if (element.leave_status == 3) MY.viewLeaves.splice(index, 1);
    });
    MY.viewLeaves.forEach((element) => {
      let date = new Date();
      var leaveEmfname = element.first_name + " " + element.last_name;
      if (element.leave_status == 0) {
        var leave_sts_color = "#ffaf00";
      } else if (element.leave_status == 1) {
        var leave_sts_color = "#00ce68";
      } else if (element.leave_status == 2) {
        var leave_sts_color = "#e65251";
      }

      if (element.half_leave_type == 0) {
        var halfLeaveSts = "First Half";
      } else {
        var halfLeaveSts = "Second Half";
      }
      if (
        element.from_dt != undefined &&
        element.from_dt != null &&
        element.end_dt != undefined &&
        element.end_dt != null
      ) {
        var leaveStartDate = element.from_dt.split(" ");
        var leaveEndDate = element.end_dt.split(" ");
        var leaveStartDate1 = leaveStartDate[0].split("-");
        var leaveEndDate1 = leaveEndDate[0].split("-");
        var enddateTime = "23:59:00";
        MY.eventArray.push({
          title: leaveEmfname,
          start:
            date.getFullYear() +
            "-" +
            leaveStartDate1[1] +
            "-" +
            leaveStartDate1[2] +
            "T" +
            leaveStartDate[1],
          end:
            date.getFullYear() +
            "-" +
            leaveEndDate1[1] +
            "-" +
            leaveEndDate1[2] +
            "T" +
            enddateTime,
          color: leave_sts_color,
        });
      } else {
        var leaveStartDate = element.from_dt.split(" ");
        var leaveStartDate1 = leaveStartDate[0].split("-");
        var enddateTime = "23:59:00";
        if (element.leave_type == 0) {
          MY.eventArray.push({
            title: leaveEmfname + " " + "-" + " " + halfLeaveSts,
            start:
              date.getFullYear() +
              "-" +
              leaveStartDate1[1] +
              "-" +
              leaveStartDate1[2],
            color: leave_sts_color,
          });
        }
      }
    });
    if (MY.userData["access_type"] == "admin") {
      MY.noticeUserData.forEach((element) => {
        let date = new Date();
        var leaveEmfname = element.first_name + " " + element.last_name;
        if (
          element.noticeperiod_date != undefined &&
          element.noticeperiod_date != null
        ) {
          var ndate = element.noticeperiod_date.split("-");
          MY.eventArray.push({
            title: leaveEmfname,
            start: date.getFullYear() + "-" + ndate[1] + "-" + ndate[2],
            color: "#F56093",
          });
        }
      });
    }
    if (MY.userData["access_type"] == "admin") {
      MY.probationData.forEach((element) => {
        let date = new Date();
        var leaveEmfname = element.first_name + " " + element.last_name;
        if (
          element.probation_date != undefined &&
          element.probation_date != null
        ) {
          var pdate = element.probation_date.split("-");
          MY.eventArray.push({
            title: leaveEmfname,
            start: date.getFullYear() + "-" + pdate[1] + "-" + pdate[2],
            color: "#4169E1",
          });
        }
      });
    }
    if (MY.userData["access_type"] == "admin") {
      this.show = false;
      MY.appraisalData.forEach((element) => {
        let date = new Date();
        var leaveEmfname = element.first_name + " " + element.last_name;
        if (
          element.appraisal_date != undefined &&
          element.appraisal_date != null
        ) {
          var adate = element.appraisal_date.split("-");
          MY.eventArray.push({
            title: leaveEmfname,
            start: date.getFullYear() + "-" + adate[1] + "-" + adate[2],
            color: "#391285",
          });
        }
      });
    }

    const wfhFilter = MY.workFromhome.filter((value) => value.status == 1);

    wfhFilter.forEach((element) => {
      let date = new Date();
      var wfhEmfname = element.first_name + " " + element.last_name;
      if (
        element.start_date != undefined &&
        element.start_date != null &&
        element.end_date != undefined &&
        element.end_date != null
      ) {
        var wfhStartDate = element.start_date.split(" ");
        var wfhEndDate = element.end_date.split(" ");
        var wfhStartDate1 = wfhStartDate[0].split("-");
        var wfhEndDate1 = wfhEndDate[0].split("-");
        var enddateTime = "23:59:00";
        MY.eventArray.push({
          title: wfhEmfname,
          start:
            date.getFullYear() +
            "-" +
            wfhStartDate1[1] +
            "-" +
            wfhStartDate1[2],
          end:
            date.getFullYear() +
            "-" +
            wfhEndDate1[1] +
            "-" +
            wfhEndDate1[2] +
            "T" +
            enddateTime,
          color: "#1d0200",
        });
      }
    });
    //Birthday event list
    MY.common.callApi({
      type: "post",
      url: "user/view-user-list",
      callback: function (res) {
        if (res.user.status == "success") {
          //MY.event = [];
          res.user.msg.forEach((element) => {
            if (element.dob != undefined) {
              let date = new Date();
              let date2 = element.dob.split("-");
              if (element.user_status == 1) {
                MY.eventArray.push({
                  title: element.first_name + " " + element.last_name,
                  date: date.getFullYear() + "-" + date2[1] + "-" + date2[2],
                  color: "#5d5242",
                });
              }
            }
          });
          MY.event = MY.eventArray;
        }
        MY.common.loader(false);
      },
      onErr: function (res) {},
      onFail: function () {},
    });
  }
  ngDestroy() {
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("custom-event-calendar-ui");
  }
  // nextClick(){
  //   this.calendarApi = this.calendarComponent.getApi();
  //   console.log( this.calendarApi);
  //   this.calendarApi.next();
  //   const currentDate = this.calendarApi.getDate();
  //   console.log("The current date of the calendar is " + currentDate);
  // }
  //  ngAfterViewInit() {
  //   this.elementRef.nativeElement
  //     .querySelector('.fc-next-button')
  //     .addEventListener('click', this.nextClick.bind(this));
  // }
}
