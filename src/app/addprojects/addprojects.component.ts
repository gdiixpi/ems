import { Component, OnInit, Renderer2, TemplateRef, NgModule } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { NgbDropdownConfig, NgbModule, ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { Title } from '@angular/platform-browser';
import { CommonService } from '../common.service';
import { environment } from '../../environments/environment';
import { DataTablesModule } from 'angular-datatables';
import { BrowserModule } from '@angular/platform-browser';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { CommonModule } from '@angular/common';
import * as $ from 'jquery';
import * as moment from 'moment';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
@Component({
  selector: 'app-tooltips',
  templateUrl: './addprojects.component.html',
  styleUrls: ['./addprojects.component.scss']
})
export class AddprojectsComponent implements OnInit {
  public project_description: string = '';
  userData = [];
  viewemployee = [];
  viewdepartment = [];
  project_id = '';
  title: any;
  Project_Edit: any;
  parentBreadcumbTitle: any;
  parentBreadcumbPath: any;
  colorTheme = 'theme-dark-blue';
  config: any;
  totalHours:any;
  // description : any;

  bsConfig = Object.assign({}, {
    containerClass: this.colorTheme,
    dateInputFormat: 'MM/DD/YYYY',
    isAnimated: true,
    timezone: 'utc'
  });
  bsInlineValue = new Date();
  constructor(
    private router: Router,
    private titleService: Title,
    private route: ActivatedRoute,
    private common: CommonService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.Project_Edit= [];
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

    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    let MY = this;

    this.common.callApi({
      type: 'post',
      url: 'department/view-departments',
      callback: function (res) {
        if (res.department.status == 'success') {
          MY.viewdepartment = res.department.msg;
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
      url: 'user/view-user-list',
      callback: function (res) {
        if (res.user.status == 'success') {
          MY.viewemployee = res.user.msg;
          MY.viewemployee.forEach(elementNew => {
            if (elementNew.user_id == MY.userData['user_id']) {
              elementNew.checked = true;
            }
          })
          MY.afterAPICall();
        }
        MY.common.loader(false);
      },
      onErr: function (res) {
      },
      onFail: function () {
      }
    });

    
  }

  afterAPICall(){
    var MY = this;
    var paramMap = MY.route.snapshot.paramMap;
    MY.project_id = paramMap.get('id');
    if (MY.project_id) {
      MY.title = ':: EMS :: Edit Project';
      MY.parentBreadcumbTitle = 'Edit Project';
      MY.parentBreadcumbPath = [{ path: '', title: 'Project Management' }, { path: '', title: 'Edit Project' }];
      MY.titleService.setTitle(MY.title);
      this.common.callApi({
        type: 'post',
        url: 'project/project-details',
        data: { 'project_id': MY.project_id },
        callback: function (res) {
          if (res.project.status == 'success') {
            MY.Project_Edit = res.project.data;
            MY.totalHours = MY.Project_Edit.type;
            MY.project_description = MY.Project_Edit['description'];
            let tempArray = [];
           
            MY.viewemployee.forEach(elementNew => {
              MY.Project_Edit['user_list'].forEach(element => {
                if (elementNew.user_id == element.user_id) {
                  elementNew.checked = true;
                }
              });
              tempArray.push(elementNew);
            });
            MY.viewemployee = tempArray;
            
          }
          MY.common.loader(false);
        },
        onErr: function (res) {
        },
        onFail: function () {
        }
      });
    } else {
      MY.title = ':: EMS :: Add Project';
      MY.parentBreadcumbTitle = 'Add Project';
      MY.parentBreadcumbPath = [{ path: '', title: 'Project Management' }, { path: '', title: 'Add Project' }];
      MY.titleService.setTitle(MY.title);
    }
  }
  totalHrs:any;
  onAddProject(val: any): void {
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    var MY = this;
    var Data: any;
    let selectedViewemployee = [];
    $(".projectViewemployee:checked").each(function () {
      selectedViewemployee.push($(this).val());
    });
    if(val.total_hours == undefined){
      this.totalHrs = 0
    }else{
      this.totalHrs = val.total_hours
    }
    if (MY.project_id) {
      Data = {
        'type': val.project_type,
        'project_name': val.project_name,
        'start_date': moment(val.project_start_date).format('MM/DD/YYYY'),
        'end_date':  moment(val.project_end_date).format('MM/DD/YYYY'),
        'link': val.project_document_link,
        'description': val.project_description,
        'user_id': this.userData['user_id'],
        'users': selectedViewemployee,
        'id': MY.project_id,
        'total_hours':this.totalHrs
      };
    }else{
      Data = {
        'type': val.project_type,
        'project_name': val.project_name,
        'start_date': moment(val.project_start_date).format('MM/DD/YYYY'),
        'end_date':moment(val.project_end_date).format('MM/DD/YYYY'),
        'link': val.project_document_link,
        'description': val.project_description,
        'user_id': this.userData['user_id'],
        'users': selectedViewemployee,
        'total_hours':this.totalHrs
      };
    }
    this.common.callApi({
      type: 'post',
      url: 'project/save-project',
      data: Data,
      callback: function (res) {
        MY.common.loader(false);
        if (res.project.status == 'success') {
          MY.common.notificationMsg('alert-fill-success', res.project.msg);
          MY.router.navigate(['/viewprojects']);
        } else {
          MY.common.notificationMsg('alert-fill-danger', res.project.msg);
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
  getProjectType(event){
    this.totalHours = event;
  }
}
