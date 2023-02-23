import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { CommonService } from '../common.service';
import { Router, ActivatedRoute } from "@angular/router";
import { DatePipe } from '@angular/common';
import { environment } from '../../environments/environment';
import { DataTablesModule } from 'angular-datatables';
import {BrowserModule} from '@angular/platform-browser';
import 'rxjs/Rx';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import * as $ from 'jquery';

@Component({
  selector: 'app-viewreports',
  templateUrl: './reportdetails.component.html',
  styleUrls: ['./reportdetails.component.scss']
})
export class ReportdetailsComponent implements OnInit {
  title = ':: EMS :: Timesheet Details';
  parentBreadcumbTitle = 'Timesheet Details';
  parentBreadcumbPath = [{path:'', title:'Timesheet Management'}, {path:'', title:'View Timesheet'}, {path:'', title:'Timesheet Details'}];
  userData = [];
  viewTaskData: any;
  viewTaskDetail = [];
  report_id = '';
  temp_var = false;

  constructor(
    private router: Router,
    private titleService: Title, 
    private common: CommonService, 
    private route: ActivatedRoute, 
    private modalService: BsModalService, 
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.titleService.setTitle(this.title)
    var paramMap = this.route.snapshot.paramMap;
    this.report_id = paramMap.get('id');
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    let MY = this;
    this.common.callApi({
      type: 'post',
      url: 'task/task-details',
      data: {
        'task_id': MY.report_id
      },
      callback: function (res) {
        if (res.task.status == 'success') {
          MY.viewTaskData = res.task.data;
          MY.viewTaskDetail = res.task.data.task_details;
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
