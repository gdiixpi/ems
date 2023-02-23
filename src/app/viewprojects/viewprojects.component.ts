import { Component, OnInit, ViewChild } from "@angular/core";
import { BsModalService, BsModalRef, ModalModule } from "ngx-bootstrap/modal";
import { CommonService } from "../common.service";
import { environment } from "../../environments/environment";
import { DataTableDirective, DataTablesModule } from "angular-datatables";
import { BrowserModule } from "@angular/platform-browser";
import "rxjs/Rx";
import { CommonModule } from "@angular/common";
import { Title } from "@angular/platform-browser";
import * as $ from "jquery";
@Component({
  selector: "app-viewprojects",
  templateUrl: "./viewprojects.component.html",
  styleUrls: ["./viewprojects.component.scss"],
})
export class ViewprojectsComponent implements OnInit {
  @ViewChild(DataTableDirective,{static:false})
  dtElement:DataTableDirective
  title = ":: EMS :: View Projects";
  parentBreadcumbTitle = "View Projects";
  parentBreadcumbPath = [
    { path: "", title: "Project Management" },
    { path: "", title: "View Projects" },
  ];
  userData = [];
  viewProjects = [];
  profileImage = "assets/images/faces/face1.jpg";
  temp_var = false;
  dtOptions: DataTables.Settings = {};
  ParentObj: any;
  constructor(private titleService: Title, private common: CommonService) {}

  ngOnInit() {
    this.titleService.setTitle(this.title);
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    let MY = this;
    if (MY.userData["role_id"] > 2) {
      var Data = {
        user_id: MY.userData["user_id"],
      };
    }
    this.common.loader(true);
    this.ProjectApi();
    // this.common.callApi({
    //   type: 'post',
    //   url: 'project/project-list',
    //   data: Data,
    //   callback: function (res) {
    //     if (res.project.status == 'success') {
    //       // MY.viewProjects = res.project.data;
    //       MY.viewProjects = [];
    //       res.project.data.forEach(element => {
    //         if (element.last_update_by_pic != '') {
    //           element.new_profile_pic = environment.proPicURL + element.last_updated_by + '/' + element.last_update_by_pic;
    //         } else {
    //           element.new_profile_pic = 'assets/images/faces/face1.jpg';
    //         }
    //         MY.viewProjects.push(element);
    //         MY.temp_var = true;
    //       });
    //     }
    //     MY.common.loader(false);
    //   },
    //   onErr: function (res) {
    //   },
    //   onFail: function () {
    //   }
    // });
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload()
    });
  }
  ProjectApi() {
    const MY = this;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,

      ajax: (dataTablesParameters: any, callback) => {
        MY.ParentObj = dataTablesParameters;
        MY.ParentObj["user_id"] = MY.userData["user_id"];
        MY.common
          .postPrivate("project/get-view-project-list", dataTablesParameters)
          .subscribe(
            (res: any) => {
              MY.viewProjects = res.project.data;
              callback({
                recordsTotal: res.project.recordsTotal,
                recordsFiltered: res.project.recordsFiltered,
                data: [],
              });
            },
            (err: any) => {}
          );
      },
      columns: [
        { data: "id" },
        { data: "project_id" },
        { data: "project_name" },
        { data: "last_update_by_name" },
        { data: "end_date" },
        { data: "status" },
        { data: "type" },
        // {data:"end_date"},
      ],
      order: [[0, 'desc']]
    };
  }

  public profilepic() {
    const pro = environment.proPicURL;
    return pro;
  }

  changestatusclick(val: any, val1: any): void {
    var MY = this;
    this.common.callApi({
      type: "post",
      url: "project/change-status",
      data: {
        project_id: val,
        user_id: MY.userData["user_id"],
        status: val1,
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.project.status == "success") {
          MY.common.notificationMsg("alert-fill-success", res.project.msg);
        } else {
          MY.common.notificationMsg("alert-fill-danger", res.project.msg);
        }
        MY.rerender();
      },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg("alert-fill-danger", res);
      },
      onFail: function () {},
    });
  }
  userDatas(userData,type){
    return this.common.userDatas(userData,type);
  }
}
