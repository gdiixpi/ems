import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonService } from '../common.service';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { data } from 'jquery';
import { dateSelectionJoinTransformer } from '@fullcalendar/core';
@Component({
  selector: 'app-work-from-home',
  templateUrl: './work-from-home.component.html',
  styleUrls: ['./work-from-home.component.scss']
})
export class WorkFromHomeComponent implements OnInit {
  title = ':: EMS :: Work From Home';
  parentBreadcumbTitle = 'Work From Home';
  parentBreadcumbPath = [{path:'', title:'Work From Home'}];
  modalRef: BsModalRef | null;
  public addWfhDetailForm:FormGroup;
  colorTheme = 'theme-dark-blue';
  maxDatestartDate: Date;
  tempJson:any;
  dtOptions: DataTables.Settings = {};
  newdata: any;
  config: any;
  wfhList:any = [];
  userData = [];
  detail_id:any;
  detail_Edit:any;
  editStartDate:any;
  EndDate:any;
  StartDate:any;
  submitted = false;
  maxStartEndDate:Date;
  minDatestartDate:Date;
  minDateendDate:Date;
  maxDateendDate:Date;
  bsConfig = Object.assign({}, {
    containerClass: this.colorTheme,
    dateInputFormat: 'YYYY-MM-DD',
    isAnimated: true,
    timezone: 'utc'
  });

  constructor(private common: CommonService,private titleService: Title,  private route: ActivatedRoute,private router: Router,private datepipe:DatePipe,private formBuilder: FormBuilder) {
    this.minDatestartDate = new Date();
    this.maxDatestartDate = new Date();
    this.minDateendDate = new Date();
    this.maxDateendDate = new Date();
    this.minDateendDate.setDate(this.minDateendDate.getDate());
    this.maxDateendDate.setDate(this.maxDateendDate.getDate());
   }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.config = {
      toolbar: [
        ['Maximize'],
        ['Format', 'FontSize'],
        ['Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat'],
        ['TextColor', 'BGColor'],
        ['NumberedList', 'BulletedList'],
        ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
        ['Table'],
        ['Cut', 'Copy'],
        ['Link', 'Unlink'],
        ['Undo', 'Redo']
      ]
    };
    this.addWfhDetailForm =  this.formBuilder.group({
      wfh_start_date: ['', Validators.required],
      wfh_end_date: ['', Validators.required],
      reason: ['', Validators.required],
    })
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    let MY = this;
    var paramMap = MY.route.snapshot.paramMap;
    MY.detail_id = paramMap.get('id');
    MY.afterAPICall();
  }
  get f() { return this.addWfhDetailForm.controls; }

  onAddDetails(val: any): void {
    var MY = this;
    var Data: any;
    this.submitted = true;
    if (this.addWfhDetailForm.invalid) {
      return;
    }
    if (MY.detail_id) {
      Data = {
        'user_id': MY.userData['user_id'],
        'start_date': this.datepipe.transform(val.wfh_start_date, 'yyyy-MM-dd'),
        'end_date':  this.datepipe.transform(val.wfh_end_date, 'yyyy-MM-dd'),
        'reason':val.reason,
        'id': MY.detail_id,
      };
    }else{
      Data = {
        'user_id': MY.userData['user_id'],
        'start_date': val.wfh_start_date,
        'end_date':  val.wfh_end_date,
        'reason':val.reason,
      };
    }
    MY.common.callApi({
        type: 'post',
        url: 'work-from-home/save-workfromhome-record',
        data: Data,
        callback: function (res) {
          MY.common.loader(false);
          if (res.workFromHomeRequest.status == 'success') {
            MY.common.notificationMsg('alert-fill-success', res.workFromHomeRequest.msg);
            MY.router.navigate(['/wfh-details']);
          } else {
            MY.common.notificationMsg('alert-fill-danger', res.workFromHomeRequest.msg);
          }
        },
        onErr: function (res) {
          MY.common.loader(false);
          MY.common.notificationMsg('alert-fill-danger', res);
        },
        onFail: function () {
        }
    });
  }

  afterAPICall() {
    this.detail_Edit= [];
    var MY = this;
    var paramMap = MY.route.snapshot.paramMap;
    MY.detail_id = paramMap.get('id');
    if (MY.detail_id) {
      MY.title = ':: EMS :: Edit Work From Home Details';
      MY.parentBreadcumbTitle = 'Work From Home';
      MY.parentBreadcumbPath = [{ path: '', title: 'Work From Home Details Management' }, { path: '', title: 'Edit Work From Home Details' }];
      MY.titleService.setTitle(MY.title);
      this.common.callApi({
        type: 'post',
        url: 'work-from-home/view-workfromhome',
        data: { 'id': MY.detail_id },
        callback: function (res) {
          if (res.work_from_home.status == 'success') {
            MY.detail_Edit = res.work_from_home.data;
            MY.addWfhDetailForm.controls.wfh_start_date.setValue(MY.detail_Edit.start_date);
            MY.addWfhDetailForm.controls.wfh_end_date.setValue(MY.detail_Edit.end_date);
            MY.addWfhDetailForm.controls.reason.setValue(MY.detail_Edit.reason);
          }
          MY.common.loader(false);
        },
        onErr: function (res) {
        },
        onFail: function () {
        }
      });
    } else {
      MY.title = ':: EMS :: Work From Home';
      MY.parentBreadcumbTitle = 'Work From Home';
      MY.parentBreadcumbPath = [{path:'', title:'Work From Home'}];
      MY.titleService.setTitle(MY.title);
    }
  }
  show_start_days(value,type){
    if(type == 'start'){
      var data = value;
      if (data) {
        this.minDateendDate.setMonth(data.getMonth(), data.getDate());
        this.maxDateendDate.setMonth(data.getMonth(), (data.getDate() + 40));
      }
    }else{
        this.EndDate = value;
    }
  }
}
