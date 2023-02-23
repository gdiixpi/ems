import {
  Component,
  OnInit,
  Renderer2,
  TemplateRef,
  NgModule,
} from "@angular/core";
import { ViewEncapsulation } from "@angular/core";
import { DatePipe } from "@angular/common";
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
import * as $ from "jquery";
import { timeout } from "q";

@Component({
  selector: "app-editemployee",
  templateUrl: "./editprofile.component.html",
  styleUrls: ["./editprofile.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class EditProfileComponent implements OnInit {
  title = ":: EMS :: Edit Profile";
  CurrentYear = new Date().getFullYear();
  parentBreadcumbTitle = "Edit Profile";
  parentBreadcumbPath = [{ path: "", title: "Edit Profile" }];
  closeResult: string;
  userData = [];
  uesrLoginData: any;
  uesrDepartment = [];
  userRoles = [];
  userService = [];
  id = "";
  EditUserData = [];
  profileImage = "assets/images/faces/face1.jpg";
  modalRef: BsModalRef | null;
  colorTheme = "theme-dark-blue";
  message: string;
  new_profile_pic = "";
  SalarySlipValue = 1;

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
    private router: Router,
    private titleService: Title,
    private common: CommonService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.titleService.setTitle(this.title);
    var paramMap = this.route.snapshot.paramMap;
    this.id = paramMap.get("id");
    this.EditUserData = JSON.parse(localStorage.getItem("view_user_list"));

    //let MY = this;
    this.common.callApi({
      type: "post",
      url: "department/view-departments",
      callback: function (res) {
        if (res.department.status == "success") {
          MY.uesrDepartment = res.department.msg;
        }
        MY.common.loader(false);
      },
      onErr: function (res) {},
      onFail: function () {},
    });
    this.common.callApi({
      type: "post",
      url: "role/view-roles",
      callback: function (res) {
        if (res.userRoles.status == "success") {
          MY.userRoles = res.userRoles.msg;
        }
        MY.common.loader(false);
      },
      onErr: function (res) {},
      onFail: function () {},
    });
    this.common.callApi({
      type: "post",
      url: "service/view-status",
      callback: function (res) {
        if (res.service.status == "success") {
          MY.userService = res.service.msg;
        }
        MY.common.loader(false);
      },
      onErr: function (res) {},
      onFail: function () {},
    });
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    let MY = this;
    this.common.callApi({
      type: "post",
      url: "user/view-user",
      data: {
        user_id: this.userData["user_id"],
      },
      callback: function (res) {
        if (res.user.status == "success") {
          MY.uesrLoginData = res.user.msg;
          MY.uesrLoginData["id"] = MY.uesrLoginData["user_id"];
          localStorage.setItem(
            environment.userSession,
            JSON.stringify(MY.uesrLoginData)
          );
          if (MY.uesrLoginData["profile_pic"] != "") {
            MY.new_profile_pic =
              environment.proPicURL +
              MY.uesrLoginData["user_id"] +
              "/" +
              MY.uesrLoginData["profile_pic"];
          } else {
            MY.new_profile_pic = "assets/images/faces/face1.jpg";
          }
          var tempDatedob = new Date(MY.uesrLoginData["dob"]);
          MY.uesrLoginData["dob"] = MY.datePipe.transform(
            tempDatedob,
            "MM/dd/yyyy"
          );
          var tempDate = new Date(MY.uesrLoginData["joining_date"]);
          MY.uesrLoginData["joining_date"] = MY.datePipe.transform(
            tempDate,
            "MM/dd/yyyy"
          );
          if (res.user.msg["service_status"] == 2) {
            var tempDateconfirmation = new Date(
              MY.uesrLoginData["confirmation_date"]
            );
            MY.uesrLoginData["confirmation_date"] = MY.datePipe.transform(
              tempDateconfirmation,
              "MM/dd/yyyy"
            );
          } else if (res.user.msg["service_status"] == 1) {
            var tempDateprobation = new Date(
              MY.uesrLoginData["probation_date"]
            );
            MY.uesrLoginData["probation_date"] = MY.datePipe.transform(
              tempDateprobation,
              "MM/dd/yyyy"
            );
          } else if (res.user.msg["service_status"] == 4) {
            var tempDateprobation = new Date(
              MY.uesrLoginData["noticeperiod_date"]
            );
            MY.uesrLoginData["noticeperiod_date"] = MY.datePipe.transform(
              tempDateprobation,
              "MM/dd/yyyy"
            );
          }
        }
        MY.common.loader(false);
      },
      onErr: function (res) {},
      onFail: function () {},
    });
  }

  getEditUserDataById(user_id) {
    return this.EditUserData.find((x) => x.user_id == user_id);
  }

  // Code for edit employee profile
  onEditEmployee(val: any): void {
    var MY = this;
    // var tempDate = new Date(val.dob);

    // val.dob = this.datePipe.transform(tempDate, "MM/dd/yyyy");
    this.common.callApi({
      type: "post",
      url: "user/update-user",
      data: {
        user_id: this.userData["user_id"],
        leaves: MY.uesrLoginData["leaves"],
        dob: MY.uesrLoginData["dob"],
        email: MY.uesrLoginData["email"],
        first_name: val.first_name,
        gender: val.gender,
        last_name: val.last_name,
        mobile_number: val.mobile_number,
        address: val.address,
        role: 0,
        userrole: this.userData["role_id"],
        password: val.password,
        profile_pic: (<any>document).getElementById("hidden_val").value,
        noticeperiod_date: val.noticeperiod_date,
        // 'profile_pic': val.profile_pic
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.user.status == "success") {
          MY.common.notificationMsg("alert-fill-success", res.user.msg);
          MY.ngOnInit();
          //localStorage.setItem(environment.userSession, JSON.stringify(res.user.msg));
          //MY.router.navigate(['/dashboard']);
          setTimeout(function () {
            location.reload();
          }, 1000);
        } else {
          MY.common.notificationMsg("alert-fill-danger", res.user.msg);
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

  FileOpen() {
    $("input#file-input").trigger("click");
  }
  changeSalarySlipValues(e) {
    this.SalarySlipValue = e;
  }
  sendSalarySlip(val: any): void {
    var MY = this;
    this.common.callApi({
      type: "get",
      url:
        "salary-slip/generate-salary-slip?userId=" +
        parseInt(this.userData["user_id"]) +
        "&month=" +
        parseInt(val),
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

  readURL(input) {
    if (input.target.files && input.target.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e: any) {
        $("#ProPic").attr("src", e.target.result);
        $("#hidden_val").val(e.target.result);
      };
      reader.readAsDataURL(input.target.files[0]);
    }
  }
  //   readURL(input) {
  //     if (input.target.files && input.target.files[0]) {
  //         var reader = new FileReader();
  //         reader.onload = function (e: any) {
  //             $('#ProPic').attr('src', e.target.result);
  //             // $('#hidden_val').val(e.target.result);
  //         };
  //         reader.readAsDataURL(input.target.files[0]);
  //     }
  // }
}
