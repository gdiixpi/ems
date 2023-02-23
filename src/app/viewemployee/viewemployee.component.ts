import {
  Component,
  OnInit,
  Renderer2,
  TemplateRef,
  NgModule,
  ViewChild,
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
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CommonService } from "../common.service";
import { environment } from "../../environments/environment";
import { DataTablesModule } from "angular-datatables";
import { BrowserModule } from "@angular/platform-browser";
import "rxjs/Rx";
import { Observable } from "rxjs/Rx";
import { CommonModule } from "@angular/common";
import * as $ from "jquery";
import { data } from "jquery";
import { DataTableDirective } from "angular-datatables";

class dataTablesParameters {
  id: number;
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: "app-viewemployee",
  templateUrl: "./viewemployee.component.html",
  styleUrls: ["./viewemployee.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ViewEmployeeComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  title = ":: EMS :: View Employees";
  CurrentYear = new Date().getFullYear();
  parentBreadcumbTitle = "View Employee";
  parentBreadcumbPath = [
    { path: "", title: "EMP Management" },
    { path: "", title: "View Employee" },
  ];
  closeResult: string;
  userData = [];
  profileImage = "assets/images/faces/face1.jpg";
  viewemployee = [];
  modalRef: BsModalRef | null;
  colorTheme = "theme-dark-blue";
  approveLeaveId = 0;
  approveLeaveUserId = 0;
  ViewEmployeeId = 0;
  ViewEmployeeImage = "";
  rejectLeaveUserId = 0;
  rejectLeaveUserName = "";
  message: string;
  viewUserData = [];
  deleteUserId = 0;
  new_user_status = 9;
  temp_var = false;
  dtOptions: DataTables.Settings = {};
  httpData: any;
  pageDraw: any;
  SalarySlip: boolean = false;
  SalarySheet: boolean = false;
  pfSheet: boolean = false;

  bsConfig = Object.assign(
    {},
    {
      containerClass: this.colorTheme,
    }
  );
  bsInlineValue = new Date();
  environment: any;
  filterType: string = "noDataFilter";
  data: any;
  constructor(
    private router: Router,
    private titleService: Title,
    private common: CommonService,
    private modalService: BsModalService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.titleService.setTitle(this.title);
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    // let MY = this;
    // this.common.callApi({
    //   type: "post",
    //   url: "user/view-user-list",
    //   callback: function (res) {
    //     if (res.user.status == "success") {
    //       MY.viewemployee = [];
    //       res.user.msg.forEach((element) => {
    //         if (element.profile_pic != "") {
    //           element.new_profile_pic =
    //             environment.proPicURL +
    //             element.user_id +
    //             "/" +
    //             element.profile_pic;
    //         } else {
    //           element.new_profile_pic = "assets/images/faces/face1.jpg";
    //         }
    //         MY.viewemployee.push(element);
    //         MY.temp_var = true;
    //       });
    //       localStorage.setItem(
    //         "view_user_list",
    //         JSON.stringify(MY.viewemployee)
    //       );
    //     }
    //     MY.common.loader(false);
    //   },
    //   onErr: function (res) {},
    //   onFail: function () {},
    // });
    this.tabledata();
    // this.profilepic();
    // this.callApi();
  }

  // callApi() {
  //   this.http.get<any>(this.url).subscribe(data => {
  //     this.httpData = data;
  //   });
  // }

  tabledata() {
    const MY = this;

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        MY.data = dataTablesParameters;
        MY.dataPassInDatatable();
        MY.common
          .postPrivate("user/get-view-user-list", dataTablesParameters)
          .subscribe(
            (res: any) => {
              MY.viewemployee = res.user.data;
              MY.common.loader(false);
              callback({
                recordsTotal: res.user.recordsTotal,
                recordsFiltered: res.user.recordsFiltered,
                data: [],
              });
              localStorage.setItem(
                "view_user_list",
                JSON.stringify(MY.viewemployee)
              );
            },
            (err: any) => {}
          );
      },

      columns: [
        { data: "id" },
        { data: "firstName" },
        { data: "lastName" },
        { data: "Email" },
        { data: "Leave Balance" },
        { data: "Department" },
        { data: "Service Status" },
        { data: "User Status" },
        { data: "Action" },
      ],
      order: [[2, "asc"]],
    };
  }

  public profilepic() {
    const pro = environment.proPicURL;
    return pro;
  }

  // profilepic(){
  //   let MY = this;
  //   this.common.callApi({
  //     type: "post",
  //     url: "user/get-view-user-list",
  //     callback: function (res) {
  //       if (res.user.status == "success") {
  //         MY.viewemployee = [];
  //         res.user.msg.forEach((element) => {
  //           if (element.profile_pic != "") {
  //             element.new_profile_pic = environment.proPicURL +
  //               element.user_id +
  //               "/" +
  //               element.profile_pic;
  //           } else {
  //             element.new_profile_pic = "assets/images/faces/face1.jpg";
  //           }
  //           MY.viewemployee.push(element);
  //         });
  //       }
  //     },
  //     onErr: function (res) {},
  //     onFail: function () {},
  //   });
  // }

  openProfileImageModal(
    template: TemplateRef<any>,
    user_id: any,
    profile_pic: any
  ) {
    // this.modalRef = this.modalService.show(template);
    if (profile_pic != "") {
      this.ViewEmployeeId = user_id;
      this.ViewEmployeeImage =
        environment.proPicURL + user_id + "/" + profile_pic;
    } else {
      this.ViewEmployeeImage = "assets/images/faces/face1.jpg";
    }

    this.modalRef = this.modalService.show(template, {
      class: "modal-sm Enlarge-Profile-Image-View",
    });
  }

  // Code for delete employee
  confirm(type: any): void {
    var MY = this;
    if (type == "delete") {
      this.common.callApi({
        type: "post",
        url: "user/delete-user",
        data: {
          user_id: MY.deleteUserId,
          user_status: MY.new_user_status,
        },
        callback: function (res) {
          MY.common.loader(false);
          if (res.user.status == "success") {
            MY.common.notificationMsg("alert-fill-success", res.user.msg);
            MY.ngOnInit();
          } else {
            MY.common.notificationMsg("alert-fill-danger", res.user.msg);
          }
          $(".EmployeeDeleteClose").trigger("click");
          MY.ngOnInit();
        },
        onErr: function (res) {
          MY.common.loader(false);
          MY.common.notificationMsg("alert-fill-danger", res);
          $(".EmployeeDeleteClose").trigger("click");
        },
        onFail: function () {},
      });
    }
    if (type == "PFSheet") {
      this.common
        .getPrivate("salary-slip/generate-techcronus-salary-sheet")
        .subscribe(
          (res: any) => {
            window.open(environment.TBSsalarySheet + res.salary.url);
          },
          (res: any) => {
            this.common.notificationMsg("alert-fill-danger", res.salary.msg);
          }
        );
    }
    if (type == "SalarySheet") {
      this.common.getPrivate("salary-slip/generate-salary-sheet").subscribe(
        (res: any) => {
          window.open(environment.salarySheet + res.salary.url);
        },
        (res: any) => {
          this.common.notificationMsg("alert-fill-danger", res.salary.msg);
        }
      );
    }
    if (type == "SalarySlip") {
      this.common.callApi({
        type: "get",
        url: "salary-slip/save-monthly-salary-record",
        callback: function (res) {
          MY.common.loader(false);
          if (res.status == "success") {
            MY.common.notificationMsg("alert-fill-success", res.msg);
          } else {
            MY.common.notificationMsg("alert-fill-danger", res.msg);
          }
          MY.ngOnInit();
        },
        onErr: function (res) {
          MY.common.loader(false);
          MY.common.notificationMsg("alert-fill-danger", res);
        },
        onFail: function () {},
      });
    }
  }

  decline(): void {
    this.message = "Declined!";
    this.modalRef.hide();
  }

  // Code for add monthly paid leave
  confirmAddMonthlyLeave(): void {
    var MY = this;
    this.common.callApi({
      type: "post",
      url: "leaves/add-monthly-leave",
      callback: function (res) {
        MY.common.loader(false);
        if (res.leaves.status == "success") {
          MY.common.notificationMsg("alert-fill-success", res.leaves.msg);
        } else {
          MY.common.notificationMsg("alert-fill-danger", res.leaves.msg);
        }
        $(".monthlyLeaveClose").trigger("click");
        MY.ngOnInit();
      },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg("alert-fill-danger", res);
        $(".monthlyLeaveClose").trigger("click");
      },
      onFail: function () {},
    });
  }

  declineAddMonthlyLeave(): void {
    this.message = "Declined!";
    this.modalRef.hide();
  }

  opendeleteUserModal(
    template: TemplateRef<any>,
    user_id: any,
    user_status: number
  ) {
    this.deleteUserId = user_id;
    this.new_user_status = user_status;
    // if(this.new_user_status == 1 || this.new_user_status == 0){
    //   this.new_user_status = 9
    // }
    // console.log(this.new_user_status,'new_user_status');

    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  openConfirmModal(template: TemplateRef<any>, type: any) {
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
    if (type == "monthlyLeave") {
      this.message = "Add Monthly Leave";
    }
    if (type == "PFSheet") {
      this.message = "Generate Monthly PF Sheet";
      this.SalarySheet = false;
      this.pfSheet = true;
      this.SalarySlip = false;
    }
    if (type == "SalarySheet") {
      this.message = "Generate Monthly Salary Sheet";
      this.SalarySheet = true;
      this.pfSheet = false;
      this.SalarySlip = false;
    }
    if (type == "SalarySlip") {
      this.message = "Generate Salary Slip";
      this.SalarySheet = false;
      this.pfSheet = false;
      this.SalarySlip = true;
    }
  }

  openViewEmployeeModal(template: TemplateRef<any>, index: any) {
    this.viewUserData = this.viewemployee[index];
    this.modalRef = this.modalService.show(template, { class: "modal-custom" });
  }

  // generateSalarySlip(): void {
  //   var MY = this;
  //   this.common.callApi({
  //     type: "get",
  //     url: "salary-slip/save-monthly-salary-record",
  //     callback: function (res) {
  //       MY.common.loader(false);
  //       if (res.status == "success") {
  //         MY.common.notificationMsg("alert-fill-success", res.msg);
  //       } else {
  //         MY.common.notificationMsg("alert-fill-danger", res.msg);
  //       }
  //       MY.ngOnInit();
  //     },
  //     onErr: function (res) {
  //       MY.common.loader(false);
  //       MY.common.notificationMsg("alert-fill-danger", res);
  //     },
  //     onFail: function () {},
  //   });
  // }

  // exportCSV() {
  //   this.common.getPrivate("salary-slip/generate-salary-sheet").subscribe(
  //     (res: any) => {
  //       window.open(environment.salarySheet + res.salary.url);
  //     },
  //     (res: any) => {
  //       this.common.notificationMsg("alert-fill-danger", res.salary.msg);
  //     }
  //   );
  // }

  // exportSalarySlip() {
  //   this.common
  //     .getPrivate("salary-slip/generate-techcronus-salary-sheet")
  //     .subscribe(
  //       (res: any) => {
  //         window.open(environment.TBSsalarySheet + res.salary.url);
  //       },
  //       (res: any) => {
  //         this.common.notificationMsg("alert-fill-danger", res.salary.msg);
  //       }
  //     );
  // }

  openModalLeaveFilter(type: string) {
    this.common.loader(true);
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    let MY = this;
    MY.filterType = type;
    MY.rerender();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  dataPassInDatatable() {
    if (this.filterType == "All") {
      this.data["user_status"] = "";
    }
    if (this.filterType == "activeEmployee") {
      if (this.userData["role_id"] !== 1 && this.userData["count_id"] > 0) {
        this.data["user_status"] = 1;
        this.data["superior_id"] = this.userData["user_id"];
      } else {
        this.data["user_status"] = 1;
      }
    }
    if (this.filterType == "inactiveEmployee") {
      if (this.userData["role_id"] !== 1 && this.userData["count_id"] > 0) {
        this.data["user_status"] = 0;
        this.data["superior_id"] = this.userData["user_id"];
      } else {
        this.data["user_status"] = 0;
      }
    }
    if (this.filterType == "deleteEmployee") {
      if (this.userData["role_id"] !== 1 && this.userData["count_id"] > 0) {
        this.data["user_status"] = 9;
        this.data["superior_id"] = this.userData["user_id"];
      } else {
        this.data["user_status"] = 9;
      }
    }
  }
}
