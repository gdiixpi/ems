import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { CommonService } from '../common.service';
import { environment } from '../../environments/environment';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import {BrowserModule} from '@angular/platform-browser';
import 'rxjs/Rx';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-viewreports',
  templateUrl: './viewreports.component.html',
  styleUrls: ['./viewreports.component.scss']
})
export class ViewreportsComponent implements OnInit {
  title = ':: EMS :: View Timesheet';
  @ViewChild(DataTableDirective,{static:false})
  dtElement:DataTableDirective
  parentBreadcumbTitle = 'View Timesheet';
  parentBreadcumbPath = [{path:'', title:'Timesheet Management'}, {path:'', title:'View Timesheet'}];
  userData:any;
  viewTask = [];
  temp_var = false;
  deleteTask = 0;
  modalRef: BsModalRef | null;
  message: string;
  dtOptions: DataTables.Settings = {};
  Payload: any;

  constructor(
    private titleService: Title,
    private common: CommonService,
    private modalService: BsModalService,
    private router:Router
  ) { }

  ngOnInit() {
    this.titleService.setTitle(this.title)
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    this.viewreportapi();
    // let MY = this;
    // MY.common.loader(true);
    // this.common.callApi({
    //   type: 'post',
    //   url: 'task/task-list',
    //   data: {
    //     'user_id': MY.userData['user_id']
    //   },
    //   callback: function (res) {
    //     if (res.task.status == 'success') {
    //       MY.viewTask = res.task.data;
    //       MY.temp_var = true;
    //       MY.common.loader(false);
    //     }
    //   },
    //   onErr: function (res) {
    //   },
    //   onFail: function () {
    //   }
    // });
  }

  viewreportapi() {
    const MY = this;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,

      ajax: (dataTablesParameters: any, callback) => {
        MY.Payload = dataTablesParameters;
        MY.Payload["user_id"] = MY.userData["user_id"];
        MY.common
          .postPrivate("task/task-list", dataTablesParameters)
          .subscribe(
            (res: any) => {
              MY.viewTask = res.task.data;
              callback({
                recordsTotal: res.task.recordsTotal,
                recordsFiltered: res.task.recordsFiltered,
                data: [],
              });
            },
            (err: any) => {}
          );
      },
      columns: [
        { data: "id"},
        { data: "Name"},
        { data: "Date"},
        {data:'TaskUpdateDate'},
        { data: "Hours"},
        { data: "Action"},
      ],
      order: [[2, 'desc']]
    };
  }

  openDeleteModal(template: TemplateRef<any>, id: any) {
    this.deleteTask = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.rerender()
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload()
    });
  }
  confirm(): void {
    // Write delete reports code here
    var MY = this;
    this.common.callApi({
      type: 'post',
      url: 'task/delete-task',
      data: {
        'task_id': MY.deleteTask
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.task.status == 'success') {
          MY.common.notificationMsg('alert-fill-success', res.task.msg);
        } else {
          MY.common.notificationMsg('alert-fill-danger', res.task.msg);
        }
        $('.TaskDeleteClose').trigger('click');
        MY.rerender();
      },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg('alert-fill-danger', res);
        $('.TaskDeleteClose').trigger('click');
      },
      onFail: function () {
      }
    });
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }

  goToAddReport(){
    this.router.navigate(['/addtimesheet']);
  }
  userDatas(userData,type){
    return this.common.userDatas(userData,type);
  }

}
