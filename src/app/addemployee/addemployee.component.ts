import { Component, OnInit, Renderer2, TemplateRef, NgModule } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { NgbDropdownConfig, NgbModule, ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Title } from '@angular/platform-browser';
import { CommonService } from '../common.service';
import { environment } from '../../environments/environment';
import * as $ from 'jquery';

@Component({
  selector: 'app-addemployee',
  templateUrl: './addemployee.component.html',
  styleUrls: ['./addemployee.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddEmployeeComponent implements OnInit {
  title = ':: EMS :: Add Employee';
  CurrentYear = new Date().getFullYear();
  parentBreadcumbTitle = 'Add Employee';
  parentBreadcumbPath = [{path:'', title:'EMP Management'}, {path:'', title:'Add Employee'}];
  closeResult: string;
  userData = [];
  uesrDepartment = [];
  userRoles = [];
  userService = [];
  profileImage = 'assets/images/faces/face1.jpg';
  modalRef: BsModalRef | null;
  colorTheme = 'theme-dark-blue';
  message: string;
  appraisalDate:any;
  bsConfig = Object.assign({}, {
    containerClass: this.colorTheme
  });
  bsInlineValue = new Date();
  constructor(
    private router: Router, 
    private common: CommonService, 
    private modalService: BsModalService,
    private titleService: Title
    ) { }

  ngOnInit() {
    this.titleService.setTitle(this.title)
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    let MY = this;
    this.common.callApi({
      type: 'post',
      url: 'department/view-departments',
      callback: function (res) {
        if (res.department.status == 'success') {
          MY.uesrDepartment = res.department.msg;
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
      url: 'role/view-roles',
      callback: function (res) {
        if (res.userRoles.status == 'success') {
          MY.userRoles = res.userRoles.msg;
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
      url: 'service/view-status',
      callback: function (res) {
        if (res.service.status == 'success') {
          MY.userService = res.service.msg;
        }
        MY.common.loader(false);
      },
      onErr: function (res) {
      },
      onFail: function () {
      }
    });
    this.disabled;
  }

  // Code for add employee
  onAddEmployee(val: any): void {
    var MY = this;
    if(val.appraisal_date == ''){
      MY.appraisalDate = ''
    }else{
      MY.appraisalDate = val.appraisal_date
    }
    this.common.callApi({
      type: 'post',
      url: 'user/register',
      data: {
        'confirmation_date': val.confirmation_date,
        'probation_date': val.probation_date,
        'department': val.department,
        'email': val.email,
        'first_name': val.first_name,
        'gender': val.gender,
        'joining_date': val.joining_date,
        'dob': val.dob,
        'last_name': val.last_name,
        'mobile_number': val.mobile_number,
        'service_status': val.service_status,
        'address': val.address,
        'userrole': val.userrole,
        'appraisal_date':MY.appraisalDate
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.user.status == 'success') {
          MY.common.notificationMsg('alert-fill-success', res.user.msg);
          MY.router.navigate(['/viewemployee']);
        } else {
          MY.common.notificationMsg('alert-fill-danger', res.user.msg);
        }
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

  disabled(i){
    return i === 3;
    
  }

}
