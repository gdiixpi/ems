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

class dataTablesParameters {
  id: number;
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-viewsuperior',
  templateUrl: './viewsuperior.component.html',
  styleUrls: ['./viewsuperior.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewSuperiorsComponent implements OnInit {
  title = ':: EMS :: View Superiors';
  CurrentYear = new Date().getFullYear();
  parentBreadcumbTitle = 'View Superior';
  parentBreadcumbPath = [{path:'', title:'Superior Management'}, {path:'', title:'View Superior'}];
  closeResult: string;
  userData = [];
  profileImage = 'assets/images/faces/face1.jpg';
  viewsuperiors = [];
  modalRef: BsModalRef | null;
  colorTheme = 'theme-dark-blue';
  approveLeaveId = 0;
  approveLeaveUserId = 0;
  ViewEmployeeId = 0;
  ViewEmployeeImage = '';
  rejectLeaveUserId = 0;
  rejectLeaveUserName = '';
  message: string;
  viewUserData = [];
  deleteUserId = 0;
  uesrSuperiors = [];
  uesrSuperiorsSecond = [];
  userNonSuperiors = [];
  userView = [];
  temp_var = false;
  dtOptions: DataTables.Settings = {};
  pageDraw:any;

  bsConfig = Object.assign({}, {
    containerClass: this.colorTheme
  });
  bsInlineValue = new Date();
  constructor(
    private router: Router,
    private titleService: Title, 
    private common: CommonService, 
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.titleService.setTitle(this.title)
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    // let MY = this;
    // this.common.callApi({
    //   type: 'post',
    //   url: 'superiors/view-superiors',
    //   callback: function (res) {
    //     if (res.superior.status == 'success') {
    //       MY.viewsuperiors = res.superior.msg;
    //       MY.temp_var = true;
    //     }
    //     MY.common.loader(false);
    //   },
    //   onErr: function (res) {
    //   },
    //   onFail: function () {
    //   }
    // });
    this.superiorsapi();
  }

  superiorsapi(){
    let MY = this;
    
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      
      ajax:(dataTablesParameters:any, callback)=>{
        
        MY.common.postPrivate('superiors/view-superiors',dataTablesParameters)
        .subscribe(
          (res: any) => {  
            MY.viewsuperiors = res.user.data;
            callback({
              recordsTotal: res.user.recordsTotal,
              recordsFiltered: res.user.recordsFiltered,
              data:[],
              
            });
          },
          (err: any) => {}
        );
      },
      columns: [  { data: "id" },
      { data: "EmployeeName",orderable:false },
      { data: "PrimarySuperiors",orderable:false },
      { data: "SecondarySuperiors",orderable:false },
      { data: "Action",orderable:false }]
    }
  }
sid:any;
    // Code for open modal
    EditSuperiorModalOpen(template: TemplateRef<any>, key: any,id:any) {
      this.viewUserData = this.viewsuperiors[key];
      this.sid = id;
      var user = localStorage.getItem(environment.userSession);
      this.userData = JSON.parse(user);
      let MY = this;
      this.common.callApi({
        type: 'post',
        url: 'superiors/superior-list',
        callback: function (res) {
          if (res.superior.status == 'success') {
            MY.uesrSuperiorsSecond = MY.uesrSuperiors = res.superior.msg;
            setTimeout(function(){ 
              MY.viewUserData['superior_id'].forEach(element => {
                $("#secondarySuperior option[ng-reflect-value='"+element+"']").attr("selected", 1);
              });
             }, 200);
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
            MY.userNonSuperiors = res.user.msg;
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
        url: 'user/view-user',
        data: {
          'user_id': MY.userData['id']
        },
        callback: function (res) {
          if (res.user.status == 'success') {
            MY.userView = res.user.msg;
          }
          MY.common.loader(false);
        },
        onErr: function (res) {
        },
        onFail: function () {
        }
      });
      this.modalRef = this.modalService.show(template, { class: 'modal-md' });
    }

    onChange(primary_superior_id) {
      var user = localStorage.getItem(environment.userSession);
      this.userData = JSON.parse(user);
      let MY = this;
      this.common.callApi({
        type: 'post',
        url: 'superiors/superior-list',
        data: {
          'superior_id': primary_superior_id
        },
        callback: function (res) {
          if (res.superior.status == 'success') {
            MY.uesrSuperiorsSecond = res.superior.msg;
          }
          MY.common.loader(false);
        },
        onErr: function (res) {
        },
        onFail: function () {
        }
      });
    }

    onEditSubmit(val: any): void {
      var user = localStorage.getItem(environment.userSession);
      this.userData = JSON.parse(user);
      var MY = this;
      this.common.callApi({
        type: 'post',
        url: 'superiors/update-superiors',
        data: {
          'id':this.sid,
          'user_id': val.edit_employee_id,
          'primary_superior_id': $('#primarySuperior').val(),
          'assign_by':  MY.userData['id'],
          'superior_id': val.secondarySuperior
        },
        callback: function (res) {
          MY.common.loader(false);
          if (res.superior.status == 'success') {
            MY.common.notificationMsg('alert-fill-success', res.superior.msg);
            // MY.router.navigate(['/viewsuperior']);
          } else {
            MY.common.notificationMsg('alert-fill-danger', res.superior.msg);
          }
          $('.editSuperiorsClose').trigger('click');
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

}
