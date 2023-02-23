import {
  Component,
  OnInit,
  Renderer2,
  TemplateRef,
  NgModule,
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
import { CommonService } from "../common.service";
import { environment } from "../../environments/environment";
import { DataTablesModule } from "angular-datatables";
import { BrowserModule } from "@angular/platform-browser";
import "rxjs/Rx";
import { Observable } from "rxjs/Rx";
import { CommonModule, DatePipe } from "@angular/common";
import {
  FormGroup,
  FormControl,
  FormArray,
  FormBuilder,
  Validators,
} from "@angular/forms";
import * as $ from "jquery";
// import { exists } from 'fs';
import * as moment from "moment";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { element } from "protractor";
import { MapType } from "@angular/compiler";

@Component({
  selector: "app-reports",
  templateUrl: "./addreports.component.html",
  styleUrls: ["./addreports.component.scss"],
})
export class AddreportsComponent implements OnInit {
  public project_description: string = "";
  userData = [];
  viewprojects = [];
  viewtitles = [];
  tempVar = 0;
  task_id = "";
  maxDatestartDate: Date;
  colorTheme = "theme-dark-blue";
  public addreportForm: FormGroup;
  config: any;
  Task_Edit: any;
  Task_EditDate: any;
  details: any;
  todayDate: any;
  title: any;
  minDate = new Date();
  parentBreadcumbTitle: any;
  parentBreadcumbPath: any;
  bsConfig = Object.assign(
    {},
    {
      containerClass: this.colorTheme,
      dateInputFormat: "DD/MM/YYYY",
      isAnimated: true,
    }
  );
  projectId: any;
  bsInlineValue = new Date();
  currentdate: any;
  selectdate: any;
  newCurrentDate: any;
  nDate: any;
  cdate: any;
  showErrorMsg: boolean = true;
  taskName = [];
  userTaskDetails: any;
  total_hours: any;
  mainArray = [];
  dayType: any = "1";
  constructor(
    private router: Router,
    private titleService: Title,
    private route: ActivatedRoute,
    private common: CommonService,
    private modalService: BsModalService,
    private _fb: FormBuilder,
    public datepipe: DatePipe
  ) {
    this.maxDatestartDate = new Date();
    this.maxDatestartDate.setDate(this.maxDatestartDate.getDate());
  }

  ngOnInit() {
    this.Task_Edit = [];
    var paramMap = this.route.snapshot.paramMap;
    this.task_id = paramMap.get("id");
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
    this.todayDate = this.datepipe.transform(new Date(), "dd/MM/yyyy");
    this.addreportForm = this._fb.group({
      itemRows: this._fb.array([this.initItemRows(false)]),
      report_date: new FormControl(this.todayDate, [Validators.required]),
      report_day_type: new FormControl(this.dayType, [Validators.required]),
    });
    if (
      this.addreportForm.value.report_date != "" &&
      this.addreportForm.value.report_date != null
    ) {
      this.addreportForm.get("report_date").clearValidators();
    }
    if (this.addreportForm.value.report_date == null) {
      this.showErrorMsg = true;
    }
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

    this.common.callApi({
      type: "post",
      url: "task/title-list",
      data: {
        role_id: this.userData["role_id"],
      },
      callback: function (res) {
        if (res.title.status == "success") {
          MY.viewtitles = res.title.data;
          MY.afterAPICall();
        }
        MY.common.loader(false);
      },
      onErr: function (res) {},
      onFail: function () {},
    });
    this.common.callApi({
      type: "post",
      url: "leaves/get-user-leave",
      data: {
        user_id: MY.userData["user_id"],
        date: new Date(),
      },
      callback: function (res) {
        if (res.status == "success") {
          if (res.userLeave.leave_type == "0") {
            MY.addreportForm.controls.report_day_type.setValue("1");
          } else {
            MY.addreportForm.controls.report_day_type.setValue("2");
          }
        } else {
          MY.addreportForm.controls.report_day_type.setValue("2");
        }
      },
      onErr: function (res) {},
      onFail: function () {},
    });
  }

  statusVal(val) {
    this.tempVar = val;
  }
  onDayChange(event) {
    if (event == null) {
      this.showErrorMsg = true;
    } else {
      this.nDate = new Date();
      this.currentdate = this.datepipe.transform(this.nDate, "yyyy-MM-dd");
      this.selectdate = this.datepipe.transform(event, "yyyy-MM-dd");
      this.cdate = this.nDate - 7 * 24 * 60 * 60 * 1000;
      this.newCurrentDate = moment(this.cdate).format("YYYY-MM-DD");
      this.showErrorMsg = true;
      if (this.selectdate <= this.newCurrentDate) {
        this.showErrorMsg = false;
      } else {
        this.showErrorMsg = true;
      }
      var MY = this;
      MY.common.callApi({
        type: "post",
        url: "leaves/get-user-leave",
        data: {
          user_id: MY.userData["user_id"],
          date: event,
        },
        callback: function (res) {
          if (res.status == "success") {
            if (res.userLeave.leave_type == "0") {
              MY.addreportForm.controls.report_day_type.setValue("1");
            } else {
              MY.addreportForm.controls.report_day_type.setValue("2");
            }
          } else {
            MY.addreportForm.controls.report_day_type.setValue("2");
          }
          MY.common.loader(false);
        },
        onErr: function (res) {},
        onFail: function () {},
      });
    }
  }
  afterAPICall() {
    this.common.loader(true);
    var MY = this;
    if (MY.task_id) {
      MY.title = ":: EMS :: Edit Timesheet";
      MY.parentBreadcumbTitle = "Edit Timesheet";
      MY.parentBreadcumbPath = [
        { path: "", title: "Timesheet Management" },
        { path: "", title: "Edit Timesheet" },
      ];
      MY.titleService.setTitle(MY.title);
      this.common.callApi({
        type: "post",
        url: "task/task-details",
        data: { task_id: MY.task_id },
        callback: function (res) {
          if (res.task.status == "success") {
            MY.Task_Edit = res.task.data;
            MY.Task_EditDate = new Date(MY.Task_Edit.date);
            MY.Task_Edit["task_details"].forEach((element) => {
              if (element.details != "" && element.details != null) {
                MY.formArr.push(MY.initItemRows(element));
              }
            });
            MY.deleteRow(0);
          }
          MY.common.loader(false);
        },
        onErr: function (res) {},
        onFail: function () {},
      });
    } else {
      MY.title = ":: EMS :: Add Timesheet";
      MY.parentBreadcumbTitle = "Add Timesheet";
      MY.parentBreadcumbPath = [
        { path: "", title: "Timesheet Management" },
        { path: "", title: "Add Timesheet" },
      ];
      MY.titleService.setTitle(MY.title);
    }
  }

  get formArr() {
    return this.addreportForm.get("itemRows") as FormArray;
  }

  initItemRows(value: any) {
    this.onChangeProjectName(value.project_id, "");
    return this._fb.group({
      project_id: new FormControl(value != false ? value.project_id : "", [
        Validators.required,
      ]),
      task_title: new FormControl(value != false ? value.task_title : "", [
        Validators.required,
      ]),
      working_hours: [value != false ? value.hours : "0"],
      working_minutes: [value != false ? value.minutes : "0"],
      details: new FormControl(value != false ? value.details : "<p></p>"),
      assign_task_id: new FormControl(
        value != false ? value.assign_task_id : "",
        [Validators.required]
      ),
    });
  }

  addNewRow() {
    this.formArr.push(this.initItemRows(false));
  }

  deleteRow(index: number) {
    this.formArr.removeAt(index);
  }

  // Code for add task (report)
  onAddReport(): void {
    var MY = this;
    MY.details = [];
    MY.total_hours = 0;
    MY.formArr.value.forEach((element) => {
      let hours =
        parseInt(element.working_hours) * 60 +
        parseInt(element.working_minutes);
      MY.total_hours = MY.total_hours + hours;
      element.hours = hours;
      MY.details.push(element);
    });
    if (
      (MY.total_hours < 270 &&
        MY.addreportForm.value["report_day_type"] == 1 &&
        this.tempVar == 1) ||
      (MY.total_hours < 480 &&
        MY.addreportForm.value["report_day_type"] == 2 &&
        this.tempVar == 1)
    ) {
      MY.common.notificationMsg(
        "alert-fill-danger",
        "Please complete your total working hours"
      );
    } else {
      var Data: any;
      if (MY.task_id) {
        Data = {
          date: moment(MY.addreportForm.value["report_date"]).format(
            "MM/DD/YYYY"
          ),
          report_day_type: MY.addreportForm.value["report_day_type"],
          details: JSON.stringify(MY.details),
          user_id: this.userData["user_id"],
          status: this.tempVar,
          task_id: MY.task_id,
        };
      } else {
        Data = {
          date: moment(MY.addreportForm.value["report_date"]).format(
            "MM/DD/YYYY"
          ),
          report_day_type: MY.addreportForm.value["report_day_type"],
          details: JSON.stringify(MY.details),
          user_id: this.userData["user_id"],
          status: this.tempVar,
        };
      }
      this.common.callApi({
        type: "post",
        url: "task/save-task",
        data: Data,
        callback: function (res) {
          MY.common.loader(false);
          if (res.task.status == "success") {
            MY.common.notificationMsg("alert-fill-success", res.task.msg);
            // if(MY.tempVar == 1) {
            MY.router.navigate(["/Viewtimesheet"]);
            // }
          } else {
            MY.common.notificationMsg("alert-fill-danger", res.task.msg);
          }
          MY.ngOnInit();
        },
        onErr: function (res) {
          MY.common.loader(false);
          MY.common.notificationMsg("alert-fill-danger", res);
        },
        onFail: function (res) {
          MY.common.loader(false);
          MY.common.notificationMsg("alert-fill-danger", res);
        },
      });
    }
  }
  public destroyEditor(): void {
    const editor = window["CKEDITOR"];
    if (editor.instances) {
      for (const editorInstance in editor.instances) {
        if (
          editor.instances.hasOwnProperty(editorInstance) &&
          editor.instances[editorInstance]
        ) {
          editor.instances[editorInstance].destroy();
          editor.instances[editorInstance] = {
            destroy: () => true,
          };
        }
      }
    }
  }

  onChangeProjectName(event, type) {
    var MY = this;
    MY.projectId = Number(event);
    this._fb.group({
      project_id: new FormControl(MY.projectId, [Validators.required]),
    });
    MY.common.callApi({
      type: "post",
      url: "task/user-task",
      data: {
        user_id: MY.userData["user_id"],
        project_id: MY.projectId,
      },
      callback: function (res) {
        if (res.assign_task_list.status == "success") {
          MY.mainArray = res.assign_task_list.data;
          // if(type == 'changeN'){
          //   MY.mainArray[MY.projectId] = res.assign_task_list.data;
          // }else{
          //   MY.mainArray.push(res.assign_task_list.data);
          // }
        }
        MY.common.loader(false);
      },
      onErr: function (res) {},
      onFail: function () {},
    });
  }

  ngOnDestroy() {
    this.destroyEditor();
  }
}
