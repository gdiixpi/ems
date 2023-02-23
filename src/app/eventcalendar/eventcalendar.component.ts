import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Router, ActivatedRoute } from "@angular/router";
import { Title } from '@angular/platform-browser';
import { CommonService } from '../common.service';
import { environment } from '../../environments/environment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-eventcalendar',
  templateUrl: './eventcalendar.component.html',
  styleUrls: ['./eventcalendar.component.scss']
})
export class EventcalendarComponent implements OnInit {
  title = ':: EMS :: Event Calendar';
  event: any;
  userData = [];

  constructor(
    private router: Router,
    private titleService: Title,
    private common: CommonService,
    public datepipe: DatePipe
  ) { }

  calendarPlugins = [dayGridPlugin];
  ngOnInit() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('custom-event-calendar-ui');
    this.titleService.setTitle(this.title)
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    let MY = this;
    this.common.callApi({
      type: 'post',
      url: 'user/view-user-list',
      callback: function (res) {
        if (res.user.status == 'success') {
          MY.event = [];
          res.user.msg.forEach(element => {
            if (element.dob != undefined) {
              let date = new Date();
              let date2 = element.dob.split("-");
              if (element.user_status == 1) {
                MY.event.push({ title: element.first_name + ' ' + element.last_name + ' ' + 'Birthday', date: date.getFullYear() + '-' + date2[1] + '-' + date2[2] });
              }
            }
          });
        }
        MY.common.loader(false);
      },
      onErr: function (res) {
      },
      onFail: function () {
      }
    });

    // this.event = [
    //   { title: 'Ahmadali Maknojiya Birthday', date: '2019-10-04' },
    //   { title: 'Pravin Dangar Birthday', date: '2019-10-08' },
    //   { title: 'Khush Patel Birthday', date: '2019-10-30' }
    // ]
  }

  ngDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('custom-event-calendar-ui');
  }

}
