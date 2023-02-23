import {
  Component,
  OnInit,
  TemplateRef,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { BsModalService, BsModalRef, ModalModule } from "ngx-bootstrap/modal";
import { CommonService } from "../common.service";
import { HttpClient } from "@angular/common/http";
import "datatables.net";
import "datatables.net-buttons";
import "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import * as $ from "jquery";
import { Router, ActivatedRoute } from "@angular/router";
import { DataTableDirective } from "angular-datatables";
import { NgForm } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { environment } from '../../environments/environment';
@Component({
  selector: "app-viewtasks",
  templateUrl: "./viewtasks.component.html",
  styleUrls: ["./viewtasks.component.scss"],
})
export class ViewtasksComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  title = ":: EMS :: View Task";
  parentBreadcumbTitle = "View Task";
  parentBreadcumbPath = [
    { path: "", title: "Task Management" },
    { path: "", title: "View Task" },
  ];
  userData: any;
  userRole: any;
  viewTaskProject = [];
  viewprojects = [];
  viewtitles = [];
  viewemployee = [];
  temp_var = false;
  heroes: [];
  deleteTask = 0;
  modalRef: BsModalRef | null;
  message: string;
  total: number;
  dtOptions: any = {};
  ParentObj: any;
  newdata: any;
  colorTheme = "theme-dark-blue";
  projectName: any;
  status: any;
  priority: any;
  label: any;
  start_date: any;
  end_date: any;

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
    private modalService: BsModalService,
    private router: Router,
    public datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.titleService.setTitle(this.title);
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    let MY = this;

    this.common.callApi({
      type: "post",
      url: "project/project-list",
      data: {
        user_id: this.userData["user_id"],
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
    this.callFilterApi("");
  }
  dataPassWithValue() {
    this.userRole = this.userData["role_id"];
    if (this.userRole <= 3) {
        this.newdata["user_id"] = "",
        this.newdata["project_id"] = this.projectName
        this.newdata["status"] = this.status
        this.newdata["priority"] = this.priority
        this.newdata["label"] = this.label
        if(this.start_date != ''){
          this.newdata["from"] =  this.datePipe.transform(this.start_date, 'yyyy-MM-dd');
        }else{
          this.newdata["from"] = this.start_date
        }
        if(this.end_date != ''){
          this.newdata["to"] = this.datePipe.transform(this.end_date, 'yyyy-MM-dd');
        }else{
          this.newdata["to"] = this.end_date
        }
    } else {
        this.newdata["user_id"] = this.userData["user_id"],
        this.newdata["project_id"] = this.projectName
        this.newdata["status"] = this.status
        this.newdata["priority"] = this.priority
        this.newdata["label"] = this.label
        if(this.start_date != ''){
          this.newdata["from"] =  this.datePipe.transform(this.start_date, 'yyyy-MM-dd');
        }else{
          this.newdata["from"] = this.start_date
        }
        if(this.end_date != ''){
          this.newdata["to"] = this.datePipe.transform(this.end_date, 'yyyy-MM-dd');
        }else{
          this.newdata["to"] = this.end_date
        }
    }
  }
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
        MY.dataPassWithValue();
        MY.common
          .postPrivate("task-manage/view-task", dataTablesParameters)
          .subscribe(
            (res: any) => {
              MY.viewTaskProject = res.Task.data;
              MY.dtOptions = {
                dom: "<lBfrtip>",
                // Configure the buttons
                buttons: ["copy", "print", "csv", "excel", "pdf"],
              };
              MY.common.loader(false);
              callback({
                recordsTotal: res.Task.recordsTotal,
                recordsFiltered: res.Task.recordsFiltered,
                data: [],
              });
            },
            (err: any) => {}
          );
      },
      columns: [
        { data: "id"},
        { data: "Priority"},
        { data: "Project_Name"},
        { data: "Task_Name"},
        {data:'Deadline'},
        { data: "Label"},
        { data: "Status"},
      ],
      order: [[0, 'desc']]
    };
  }
  // callFilterApi(val: any) {
  //   var user = localStorage.getItem(environment.userSession);
  //   this.userData = JSON.parse(user);
  //   var MY = this;
  //   var Data: any;
  //   MY.userRole = MY.userData["role_id"];
  //   if (MY.userRole <= 3) {
  //     Data = {
  //       user_id: "",
  //       project_id: val.project_name != "" ? val.project_name : "",
  //       status: val.status != "" ? val.status : "",
  //       priority: val.priority != "" ? val.priority : "",
  //       label: val.label != "" ? val.label : "",
  //       start_date: val.from_date != "" ? val.from_date : "",
  //       end_date: val.to_date != "" ? val.to_date : "",
  //     };
  //   } else {
  //     Data = {
  //       user_id: MY.userData["user_id"],
  //       project_id: val.project_name != "" ? val.project_name : "",
  //       status: val.status != "" ? val.status : "",
  //       priority: val.priority != "" ? val.priority : "",
  //       label: val.label != "" ? val.label : "",
  //       start_date: val.from_date != "" ? val.from_date : "",
  //       end_date: val.to_date != "" ? val.to_date : "",
  //     };
  //   }
  //   MY.viewTaskProject = [];
  //   MY.temp_var = false;
  //   this.common.callApi({
  //     type: "post",
  //     url: "task-manage/view-task",
  //     data: Data,
  //     callback: function (res) {
  //       if (res.status == true) {
  //         if (res.task_detail.length > 0) {
  //           MY.viewTaskProject = res.task_detail;
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
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  onapplyFilterSubmit(val: any): void {
    this.common.loader(true);
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    (this.projectName = val.project_name != "" ? val.project_name : ""),
      (this.status = val.status != "" ? val.status : ""),
      (this.priority = val.priority != "" ? val.priority : ""),
      (this.label = val.label != "" ? val.label : ""),
      (this.start_date = val.from_date != "" ? val.from_date : ""),
      (this.end_date = val.to_date != "" ? val.to_date : "");
    this.rerender();
  }

  openDeleteModal(template: TemplateRef<any>, id: any) {
    this.deleteTask = id;
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  confirm(): void {
    // Write delete reports code here
    var MY = this;
    this.common.callApi({
      type: "post",
      url: "task-manage/delete-task",
      data: {
        task_id: MY.deleteTask,
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.status == true) {
          MY.common.notificationMsg("alert-fill-success", res.msg);
        } else {
          MY.common.notificationMsg("alert-fill-danger", res.msg);
        }
        $(".TaskDeleteClose").trigger("click");
        MY.rerender();
      },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg("alert-fill-danger", res);
        $(".TaskDeleteClose").trigger("click");
      },
      onFail: function () {},
    });
  }

  decline(): void {
    this.message = "Declined!";
    this.modalRef.hide();
  }
  goToAddTaskPage() {
    this.router.navigate(["/addtask"]);
  }
  reset(applyFilter:NgForm){
    applyFilter.reset(); 
    this.onapplyFilterSubmit('')
  }
  userDatas(userData,type){
    return this.common.userDatas(userData,type);
  }
}
