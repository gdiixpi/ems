import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../common.service';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-task-report',
  templateUrl: './task-report.component.html',
  styleUrls: ['./task-report.component.scss']
})
export class TaskReportComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  title = ":: EMS :: Task Reports";
  parentBreadcumbTitle = "Task Reports";
  parentBreadcumbPath = [
    { path: "", title: "Report Management" },
    { path: "", title: "Task Reports" },
  ];
  userData: any;
  viewemployee = [];
  viewprojects = [];
  viewtitles = [];
  viewTaskNames = [];
  colorTheme = "theme-dark-blue";
  public min: Date = new Date(2017, 10, 30);
  dtOptions: DataTables.Settings = {};
  ParentObj: any;
  taskTableList = []
  filterType:any;
  projectName: any;
  task_title: any;
  start_date: any;
  end_date: any;
  userId: any;
  newdata: any;
  totalData;
  totals = 0;
  totalsEstimate = 0;
  total:any;
  totalEstimate:any;
  totalCounts:any;
  totalEstimateCounts:any;
  bsConfig = Object.assign(
    {},
    {
      containerClass: this.colorTheme,
      dateInputFormat: "MM/DD/YYYY",
      isAnimated: true,
    }
  );

  constructor(
    private common: CommonService,
    private titleService: Title,
    public datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    let MY = this;

    MY.common.callApi({
      type: "post",
      url: "user/view-user-list",
      callback: function (res) {
        if (res.user.status == "success") {
          res.user.msg.sort((a, b) => a.first_name.localeCompare(b.first_name));
          MY.viewemployee = res.user.msg;
        }
      },
      onErr: function (res) {},
      onFail: function () {},
    });

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
    this.taskReportList();
  }

  taskReportList(){
      const MY = this;
      this.dtOptions = {
        pagingType: "full_numbers",
        pageLength: 10,
        serverSide: true,
        processing: true,
  
        ajax: (dataTablesParameters: any, callback) => {
          MY.newdata = dataTablesParameters;
          MY.datapass();
          MY.common
            .postPrivate("report/task-report", dataTablesParameters)
            .subscribe(
              (res: any) => {
                MY.taskTableList = res.report.data;
                MY.findsum(MY.taskTableList)
                this.common.loader(false);
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
          { data: "emp_name" },
          { data: "project_name" },
          { data: "task_name" },
          { data: "task_type" },
          { data: "total_hours" },
          // {data:"end_date"},
        ],
        order: [[0, 'desc']]
      };

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
  }
  
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }
  reset(applyTaskReportFilter:NgForm){
    applyTaskReportFilter.reset();
    this.onapplyFilterSubmit('','')
  }

  findsum(data){ 
    this.totalData = [];  
    this.totals = 0;
    this.totalsEstimate = 0;
    this.totalData=data    
    for(let j=0;j<this.totalData.length;j++){  
      if(this.totalData.length > 1){
        this.totals += parseFloat( this.totalData[j].total_hours);
        this.totalsEstimate += parseFloat( this.totalData[j].estimated_time);
      }else{
        this.totals = this.totalData[j].total_hours;
        this.totalsEstimate = this.totalData[j].estimated_time;
      }
    } 
    if(this.totalData.length > 1){
      this.totalCounts = this.totals;
      this.totalEstimateCounts = this.totalsEstimate;
      this.total =  this.totalCounts.toFixed(3).slice(0,-1);
      this.totalEstimate = this.totalEstimateCounts.toFixed(3).slice(0,-1);
    }else{
      this.total = this.totals;
      this.totalEstimate = this.totalsEstimate;
    }
  }  
  userDatas(userData,type){
    return this.common.userDatas(userData,type);
  }
}
