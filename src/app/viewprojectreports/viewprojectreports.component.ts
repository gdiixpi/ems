import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";
import { BsModalService, BsModalRef, ModalModule } from "ngx-bootstrap/modal";
import { CommonService } from "../common.service";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import "datatables.net";
import "datatables.net-buttons";
import { environment } from "../../environments/environment";
import { DataTablesModule } from "angular-datatables";
import { BrowserModule } from "@angular/platform-browser";
import "rxjs/Rx";
import { CommonModule, NgForOf } from "@angular/common";
import { Title } from "@angular/platform-browser";
import * as $ from "jquery";
import { DataTableDirective } from "angular-datatables";
import { NgForm } from "@angular/forms";
import * as moment from 'moment';
import {DatePipe } from '@angular/common';
@Component({
  selector: "app-viewprojectreports",
  templateUrl: "./viewprojectreports.component.html",
  styleUrls: ["./viewprojectreports.component.scss"],
})
export class ViewprojectreportsComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  title = ":: EMS :: Project Reports";
  parentBreadcumbTitle = "Project Reports";
  parentBreadcumbPath = [
    { path: "", title: "Report Management" },
    { path: "", title: "Project Reports" },
  ];
  filterType:any;
  userData: any;
  viewTaskProject = [];
  viewprojects = [];
  viewtitles = [];
  viewemployee = [];
  temp_var = false;
  heroes: [];
  total:any;
  dtOptions: any = {};
  colorTheme = "theme-dark-blue";
  newdata: any;
  userRole: any;
  projectName: any;
  task_title: any;
  start_date: any;
  end_date: any;
  userId: any;
  public min: Date = new Date(2017, 10, 30);
  totalData;
  totals = 0;
  totalCounts:any;
  // public rows: any[] = [];
  bsConfig = Object.assign(
    {},
    {
      containerClass: this.colorTheme,
      dateInputFormat: "MM/DD/YYYY",
      isAnimated: true,
    }
  );
  bsInlineValue = new Date();
  constructor(
    private titleService: Title,
    private common: CommonService,
    private http: HttpClient,
    private chRef: ChangeDetectorRef,
    public datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.titleService.setTitle(this.title);
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    let MY = this;
    // $('#ViewEmployeeTable').DataTable( {

    // });

    this.common.callApi({
      type: "post",
      url: "project/project-list",
      data:{
        user_id:this.userData['user_id']
      },
      callback: function (res) {
        if (res.project.status == "success") {
          MY.viewprojects = res.project.data;
        }
        MY.common.loader(false);
      },
      onErr: function (res) {},
      onFail: function () {},
    });

    this.common.callApi({
      type: "post",
      url: "task/title-list",
      callback: function (res) {
        if (res.title.status == "success") {
          MY.viewtitles = res.title.data;
        }
        MY.common.loader(false);
      },
      onErr: function (res) {},
      onFail: function () {},
    });

    this.common.callApi({
      type: "post",
      url: "user/view-user-list",
      callback: function (res) {
        if (res.user.status == "success") {
          res.user.msg.sort((a, b) => a.first_name.localeCompare(b.first_name));
          MY.viewemployee = res.user.msg;
        }
        MY.common.loader(false);
      },
      onErr: function (res) {},
      onFail: function () {},
    });
    this.callFilterApi("");
  }

  datapass() {
    if(this.filterType == 'filter'){
      this.newdata["user_id"] = this.userId;
      this.newdata["project_id"] = this.projectName;
      this.newdata["title_id"] = this.task_title;
      this.newdata["start_date"] = this.datePipe.transform(this.start_date, 'yyyy-MM-dd');
      this.newdata["end_date"] = this.datePipe.transform(this.end_date, 'yyyy-MM-dd');
    }else{
      this.newdata["user_id"] = this.userData['user_id'];
    }
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  // callFilterAp(val: any) {
  //   var MY = this;
  //   var Data: any;
  //   Data = {
  //     user_id:MY.userData["role_id"] <= 5 ? val.employee_name != ""? val.employee_name: "" : MY.userData["user_id"],
  //     project_id: val.project_name != "" ? val.project_name : "",
  //     title_id: val.task_title != "" ? val.task_title : "",
  //     start_date: val.from_date != "" ? val.from_date : "",
  //     end_date: val.to_date != "" ? val.to_date : "",
  //   };
  //   MY.viewTaskProject = [];
  //   MY.temp_var = false;
  //   this.common.callApi({
  //     type: "post",
  //     url: "report/project",
  //     data: Data,
  //     callback: function (res) {
  //       if (res.project.status == "success") {
  //         if (res.project.data.length > 0) {
  //           MY.viewTaskProject = res.project.data;
  //           this.dtOptions = {
  //             dom: "<lBfrtip>",
  //             // Configure the buttons
  //             buttons: ["copy", "print", "csv", "excel", "pdf"],
  //           };
  //           MY.temp_var = true;
  //         } else {
  //           MY.temp_var = false;
  //         }
  //       }
  //       MY.common.loader(false);
  //     },
  //     onErr: function (res) {},
  //     onFail: function () {},
  //   });
  // }

  callFilterApi(val: any) {
    const MY = this;
    MY.common.loader(true);
    MY.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,

      ajax: (dataTablesParameters: any, callback) => {
        MY.newdata = dataTablesParameters;
        MY.datapass();
        MY.common.postPrivate("report/project", dataTablesParameters).subscribe(
          (res: any) => {
            MY.viewTaskProject = res.report.data;
            MY.findsum(MY.viewTaskProject);  
            MY.dtOptions = {
              dom: "<lBfrtip>",
              // Configure the buttons
              buttons: ["copy", "print", "csv", "excel", "pdf"],
            };
            MY.common.loader(false);
            callback({
              recordsTotal: res.report.recordsTotal,
              recordsFiltered: res.report.recordsFiltered,
              data: [],
            });
          },
          (err: any) => {}
        );
      },
      columns: [
        { data: "id" },
        { data: "Name" },
        { data: "Project_Name" },
        { data: "Task_Title" },
        { data: "Total_Hours" },
      ],
    };
  }

  onapplyFilterSubmit(val: any,type:any): void {
    this.common.loader(true);
    this.filterType = type;
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    this.userId = this.userData["role_id"] <= 5? val.employee_name != ""? val.employee_name: "": this.userData["user_id"],
      this.projectName = val.project_name != "" ? val.project_name : "",
      this.task_title = val.task_title != "" ? val.task_title : "",
      this.start_date = val.from_date != "" ? val.from_date : "",
      this.end_date = val.to_date != "" ? val.to_date : "",
      this.rerender();
    // this.callFilterApi(val);
  }
  reset(applyFilter:NgForm){
    applyFilter.reset();
    this.onapplyFilterSubmit('','')
  }

  findsum(data){  
    this.totalData = [];  
    this.totals = 0;  
    this.totalData=data    
    for(let j=0;j<this.totalData.length;j++){  
      if(this.totalData.length > 1){
        this.totals += parseFloat( this.totalData[j].totalhours);
      }else{
        this.totals = this.totalData[j].totalhours;
      }
    } 
    if(this.totalData.length > 1){
      this.totalCounts = this.totals;
      this.total =  this.totalCounts.toFixed(3).slice(0,-1);
    }else{
      this.total = this.totals;
    }
  }  
  userDatas(userData,type){
    return this.common.userDatas(userData,type);
  }
}
