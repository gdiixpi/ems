import {
  Component,
  OnInit,
  Renderer2,
  TemplateRef,
  NgModule,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { ViewEncapsulation } from "@angular/core";
import {
  NgbDropdownConfig,
  NgbModule,
  ModalDismissReasons,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";
import { BsModalService, BsModalRef, ModalModule } from "ngx-bootstrap/modal";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { DatePipe, Time } from "@angular/common";
import { CommonService } from "../common.service";
import { environment } from "../../environments/environment";
import * as $ from "jquery";
import { NgForm } from "@angular/forms";
import * as moment from "moment";
@Component({
  selector: "app-addtask",
  templateUrl: "./addtask.component.html",
  styleUrls: ["./addtask.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AddtaskComponent implements OnInit {
  @ViewChild("addTask", { static: false }) addTaskFrom: NgForm;
  public task_description: string = "";
  userData = [];
  viewprojects = [];
  viewAssignemployee = [];
  config: any;
  title: any;
  Task_Edit: any;
  parentBreadcumbTitle: any;
  parentBreadcumbPath: any;
  task_id = "";
  colorTheme = "theme-dark-blue";
  Task_EditDate: any;
  minDateStart: Date;
  bsConfig = Object.assign(
    {},
    {
      containerClass: this.colorTheme,
      dateInputFormat: "MM/DD/YYYY",
      isAnimated: true,
    }
  );
  showMe = true;
  projectType: any;
  totalHours: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private common: CommonService,
    public datepipe: DatePipe
  ) {
    this.minDateStart = new Date();
    // this.maxDatestartDate.setDate(this.maxDatestartDate.getDate());
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    /* Code for project list */
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    let MY = this;
    var paramMap = MY.route.snapshot.paramMap;
    MY.task_id = paramMap.get("id");
    this.Task_Edit = [];
    // if (MY.task_id) {
    //   $("#project_name").attr("disabled", "disabled");
    // }
    // else {
    //   $("#project_name").removeAttr("disabled");
    // }
    this.config = {
      toolbar: [
        ["Maximize"],
        ["Format", "FontSize"],
        ["Bold", "Italic", "Underline", "Strike", "RemoveFormat"],
        ["TextColor", "BGColor"],
        ["NumberedList", "BulletedList"],
        ["JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock"],
        ["Table"],
        ["Cut", "Copy"],
        ["Link", "Unlink"],
        ["Undo", "Redo"],
      ],
    };
    this.common.callApi({
      type: "post",
      url: "project/project-list",
      data: {
        user_id: this.userData["user_id"],
      },
      callback: function (res) {
        if (res.project.status == "success") {
          MY.viewprojects = res.project.data;
          MY.afterAPICall();
        }
        MY.common.loader(false);
      },
      onErr: function (res) {},
      onFail: function () {},
    });
  }

  afterAPICall() {
    var MY = this;
    var paramMap = MY.route.snapshot.paramMap;
    MY.task_id = paramMap.get("id");
    if (MY.task_id) {
      MY.title = ":: EMS :: Edit Task";
      MY.parentBreadcumbTitle = "Edit Task";
      MY.parentBreadcumbPath = [
        { path: "", title: "Task Management" },
        { path: "", title: "Edit Task" },
      ];
      MY.titleService.setTitle(MY.title);
      this.common.callApi({
        type: "post",
        url: "task-manage/task-detail",
        data: { task_id: MY.task_id },
        callback: function (res) {
          if (res.status == true) {
            MY.Task_Edit = res.task_detail.detail;
            // MY.Task_EditDate = this.datepipe.transform( MY.Task_Edit.deadline,'dd/MM/yyyy');
            MY.onChange(MY.Task_Edit["project_id"]);
            MY.task_description = MY.Task_Edit.description;
          }
          MY.common.loader(false);
        },
        onErr: function (res) {},
        onFail: function () {},
      });
    } else {
      MY.title = ":: EMS :: Add Task";
      MY.parentBreadcumbTitle = "Add Task";
      MY.parentBreadcumbPath = [
        { path: "", title: "Task Management" },
        { path: "", title: "Add Task" },
      ];
      MY.titleService.setTitle(MY.title);
    }
  }

  /* Code for add task */
  onAddTask(val: any): void {
    // if(this.addTaskFrom.valid){
    //   this.showMe = false;
    //   return;
    // }else{
    //   this.showMe = true;
    // }
    var MY = this;
    var paramMap = MY.route.snapshot.paramMap;
    MY.task_id = paramMap.get("id");
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    var MY = this;
    var Data: any;
    let selectedViewemployee = [];
    $(".projectViewemployee:checked").each(function () {
      selectedViewemployee.push($(this).val());
    });
    if (MY.task_id) {
      Data = {
        project_id: val.project_name,
        task_name: val.task_name,
        status: val.status,
        priority: val.priority,
        label: val.label,
        description: val.task_description,
        assign_id: this.userData["user_id"],
        memeber_id: selectedViewemployee,
        id: MY.task_id,
        estimated_time: val.estimated_time,
        deadline: moment(val.deadline).format("MM/DD/YYYY"),
      };
    } else {
      Data = {
        project_id: val.project_name,
        task_name: val.task_name,
        status: val.status,
        priority: val.priority,
        label: val.label,
        description: val.task_description,
        assign_id: this.userData["user_id"],
        memeber_id: selectedViewemployee,
        estimated_time: val.estimated_time,
        deadline: moment(val.deadline).format("MM/DD/YYYY"),
      };
    }
    this.common.callApi({
      type: "post",
      url: "task-manage/add-task",
      data: Data,
      callback: function (res) {
        MY.common.loader(false);
        if (res.status == true) {
          MY.common.notificationMsg("alert-fill-success", res.msg);
          MY.router.navigate(["/viewtasklist"]);
        } else {
          MY.common.notificationMsg("alert-fill-danger", res.msg);
        }
      },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg("alert-fill-danger", res);
      },
      onFail: function () {},
    });
  }

  /* Change project dropdown */
  onChange(project_id) {
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    let MY = this;
    this.common.callApi({
      type: "post",
      url: "task-manage/get-project-detail",
      data: {
        project_id: project_id,
      },
      callback: function (res) {
        if (res.status == true) {
          MY.viewAssignemployee = res.project_detail;
          MY.viewAssignemployee.forEach((elementNew) => {
            if (elementNew.user_id == MY.userData["user_id"]) {
              elementNew.checked = true;
            }
            MY.totalHours = elementNew.total_hours;
            MY.projectType = elementNew.type;
          });
          let tempArray = [];
          MY.viewAssignemployee.forEach((elementNew) => {
            if (MY.Task_Edit["user_list"] != undefined) {
              MY.Task_Edit["user_list"].forEach((element) => {
                if (elementNew.user_id == element) {
                  elementNew.checked = true;
                }
              });
            }
            tempArray.push(elementNew);
          });
          MY.viewAssignemployee = tempArray;
        }
        MY.common.loader(false);
      },
      onErr: function (res) {},
      onFail: function () {},
    });
  }
}
