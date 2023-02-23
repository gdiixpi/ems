import { Component, Input, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { CommonService } from "../common.service";
import { HttpClient } from "@angular/common/http";
import { Title } from "@angular/platform-browser";
import { environment } from "../../environments/environment";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DatePipe } from "@angular/common";
import { DataTablesModule } from "angular-datatables";
import { DataTableDirective } from "angular-datatables";
@Component({
  selector: "app-hiring-module",
  templateUrl: "./hiring-module.component.html",
  styleUrls: ["./hiring-module.component.scss"],
})
export class HiringModuleComponent implements OnInit {
  @Input() padding: string;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  title = ":: EMS :: Hire Candidate";
  parentBreadcumbTitle = "Hiring Process";
  parentBreadcumbPath = [{ path: "", title: "Hiring Process" }];
  userData: any = [];
  viewEmployeeList = [];
  temp_var = false;
  employeeForm: FormGroup;
  reviewEmployeeForm: FormGroup;
  submitted = false;
  modalReference: any;
  HireEmployeeList = [];
  deleteUserId = 0;
  viewEmpName: string;
  viewEmpOverview: string;
  viewEmpAssignerName: string;
  viewEmpRating: any;
  viewEmpReviewStatus: any;
  FormTitle: string;
  empResume: any;
  isShown: boolean = true;
  displayEmpData: boolean = false;
  displayEmpForm: boolean = false;
  viewEmpDetail;
  viewEmpDate;
  viewEmpTime;
  _value;
  label;
  message: any;
  minDate: Date;
  dtOptions: DataTables.Settings = {};
  CustomFile;
  ParentObj: any;
  filterType: any;
  data: any;
  applyFilter: FormGroup;
  filterShow: boolean = false;
  onEditView: boolean = false;

  constructor(
    private titleService: Title,
    private common: CommonService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.empResume = environment.hireEmpResume;
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() - 1);
  }

  ngOnInit() {
    // this.getEmpDetails();
    this.getHireCandidateDetails();

    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 10,
    //   processing: true,
    //   retrieve:true,
    // };
    this.employeeForm = this.formBuilder.group({
      hiringId: [0],
      name: ["", [Validators.required]],
      technology: ["", [Validators.required]],
      mobile_no: ["", [Validators.required]],
      email: ["", [Validators.required]],
      mode: ["", [Validators.required]],
      notice_period: ["", [Validators.required]],
      total_experience: ["", [Validators.required]],
      current_ctc: ["", [Validators.required]],
      expected_ctc: ["", [Validators.required]],
      employeeList: [""],
      updated_at: [""],
      created_at: [""],
      file: ["", [Validators.required]],
      candidateDetails: ["", [Validators.required]],
      time: ["", Validators.required],
      date: [this.minDate, [Validators.required]],
    });
    this.filterForm();
  }

  openAddEmployeeForm(AddEmployeeDetails, admin_addemployee, type) {
    this.modalReference = this.modalService.open(AddEmployeeDetails, {
      windowClass: "myCustomModalClass",
    });
    this.ViewUserList();

    if (type == "add") {
      this.FormTitle = "Add Candidate Details";
      this.employeeForm.reset();
      this.onEditView = false;
    }
    if (type == "edit") {
      this.FormTitle = "Edit Candidate Details";
      this.onEditView = true;
      this.employeeForm.controls.hiringId.setValue(admin_addemployee.hiring_id);
      this.employeeForm.controls.name.setValue(admin_addemployee.name);
      this.employeeForm.controls.current_ctc.setValue(
        admin_addemployee.current_ctc
      );
      this.employeeForm.controls.total_experience.setValue(
        admin_addemployee.total_experience
      );
      this.employeeForm.controls.mode.setValue(admin_addemployee.mode);
      this.employeeForm.controls.notice_period.setValue(
        admin_addemployee.notice_period.value
      );
      this.employeeForm.controls.email.setValue(admin_addemployee.email);
      this.employeeForm.controls.mobile_no.setValue(
        admin_addemployee.mobile_no
      );
      this.employeeForm.controls.expected_ctc.setValue(
        admin_addemployee.expected_ctc
      );
      this.employeeForm.controls.technology.setValue(
        admin_addemployee.technology
      );
      this.employeeForm.controls.created_at.setValue(
        admin_addemployee.created_at
      );
      this.employeeForm.controls.updated_at.setValue(
        admin_addemployee.updated_at
      );
      this.employeeForm.controls.employeeList.setValue(
        admin_addemployee.user_id
      );
      this.employeeForm.controls.candidateDetails.setValue(
        admin_addemployee.detail
      );
      this.employeeForm.controls.date.setValue(
        this.datePipe.transform(admin_addemployee.date, "yyyy-MM-dd")
      );
      this.employeeForm.controls.time.setValue(admin_addemployee.time);
      this.employeeForm.controls.file.setValue("");
      this.employeeForm.get("file").clearValidators();
    }
  }

  getHireCandidateDetails() {
    const MY = this;
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    MY.common.loader(true);
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        MY.ParentObj = dataTablesParameters;
        if (
          MY.userData["access_type"] != "hm" &&
          MY.userData["access_type"] != "admin"
        ) {
          MY.ParentObj["userId"] = MY.userData["user_id"];
        }
        // if (
        //   MY.userData["access_type"] != "hm" &&
        //   MY.userData["access_type"] != "admin"
        // ) {
        //   MY.ParentObj["role_id"] = MY.userData["role_id"];
        // }
        MY.dataPassInDatatable();
        MY.common
          .postPrivate("hiring/get-hiring-detail", dataTablesParameters)
          .subscribe(
            (res: any) => {
              res.hiring.data.sort(
                (a, b) => <any>new Date(b.date) - <any>new Date(a.date)
              );
              MY.HireEmployeeList = res.hiring.data;

              MY.common.loader(false);
              callback({
                recordsTotal: res.hiring.recordsTotal,
                recordsFiltered: res.hiring.recordsFiltered,
                data: [],
              });
            },
            (err: any) => {}
          );
      },

      columns: [
        { data: "id" },
        { data: "candidatename" },
        { data: "Technology" },
        { data: "InterviewerName" },
        { data: "Schedule" },
        { data: "resume" },
        { data: "notice period" },
        { data: "review Status" },
        { data: "Action" },
      ],
      order: [[0, "desc"]],
    };
  }

  ViewUserList() {
    this.titleService.setTitle(this.title);
    let MY = this;
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    this.common.callApi({
      type: "post",
      url: "user/view-user-list",
      callback: function (res) {
        if (res.user.status == "success") {
          MY.viewEmployeeList = [];
          res.user.msg.sort((a, b) => a.first_name.localeCompare(b.first_name));
          res.user.msg.forEach((element) => {
            if (element.role_id != 1) {
              MY.viewEmployeeList.push(element);
              MY.temp_var = true;
            }
          });
        }
        MY.common.loader(false);
      },
      onErr: function (res) {},
      onFail: function () {},
    });
  }
  // getEmpDetails() {
  //   this.titleService.setTitle(this.title);
  //   var user = localStorage.getItem(environment.userSession);
  //   this.userData = JSON.parse(user);
  //   let MY = this;
  //    var Data = {
  //       'userId': MY.userData['id'],
  //       'role_id': MY.userData['role_id'],
  //   }
  //   this.common.callApi({
  //     type: 'post',
  //     url: 'hiring/get-hiring-detail',
  //     data: Data,
  //     callback: function (res) {
  //       if (res.hiring.status == 'success') {
  //         MY.HireEmployeeList = res.hiring.msg;
  //         MY.temp_var = true;
  //       }
  //       MY.common.loader(false);
  //     },
  //     onErr: function (res) {
  //     },
  //     onFail: function () {
  //     }
  //   });
  // }
  get f() {
    return this.employeeForm.controls;
  }
  //file select
  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.CustomFile = file;
    }
  }

  someDetails: any;
  //Add employee form submit
  onSubmit() {
    var MY = this;
    this.submitted = true;
    if (this.employeeForm.invalid) {
      return;
    }
    var empVal = this.employeeForm.getRawValue();
    const formData = new FormData();
    if (empVal.hiringId > 0) {
      formData.append("_id", empVal.hiringId);
      formData.append("name", empVal.name);
      formData.append("current_ctc", empVal.current_ctc);
      formData.append("mobile_no", empVal.mobile_no);
      formData.append("total_experience", empVal.total_experience);
      formData.append("notice_period", empVal.notice_period);
      formData.append("expected_ctc", empVal.expected_ctc);
      formData.append("mode", empVal.mode);
      formData.append("email", empVal.email);
      formData.append("technology", empVal.technology);
      formData.append("user_id", empVal.employeeList);
      if (this.CustomFile && this.CustomFile.size) {
        formData.append("resume", this.CustomFile);
      }
      formData.append("detail", empVal.candidateDetails);
      formData.append("date", empVal.date);
      formData.append("time", empVal.time);
      this.common.callApi({
        type: "post",
        url: "hiring/update-detail",
        data: formData,
        callback: function (res) {
          if (res.hiring.status == "success") {
            MY.common.notificationMsg("alert-fill-success", res.hiring.msg);
            // MY.getEmpDetails();
            MY.rerender();
          }
          MY.common.loader(false);
        },
        onErr: function (res) {},
        onFail: function () {},
      });
    } else {
      formData.append("name", empVal.name);
      formData.append("technology", empVal.technology);
      formData.append("user_id", empVal.employeeList);
      formData.append("resume", this.CustomFile);
      formData.append("detail", empVal.candidateDetails);
      formData.append(
        "date",
        this.datePipe.transform(empVal.date, "yyyy-MM-dd")
      );
      formData.append(
        "time",
        this.datePipe.transform(empVal.time, "H:mm:ss a")
      );
      formData.append("current_ctc", empVal.current_ctc);
      formData.append("mobile_no", empVal.mobile_no);
      formData.append("total_experience", empVal.total_experience);
      formData.append("notice_period", empVal.notice_period);
      formData.append("expected_ctc", empVal.expected_ctc);
      formData.append("mode", empVal.mode);
      formData.append("email", empVal.email);
      this.common.callApi({
        type: "post",
        url: "hiring/add-detail",
        data: formData,
        callback: function (res) {
          if (res.hiring.status == "success") {
            MY.common.notificationMsg("alert-fill-success", res.hiring.msg);
            setTimeout(function () {
              window.location.reload();
            }, 2000);
          }
          MY.common.loader(false);
        },
        onErr: function (res) {},
        onFail: function () {},
      });
    }
    this.modalService.dismissAll();
  }
  //open delet user model
  opendeleteUserModal(deleteEmployee, _id: any) {
    this.deleteUserId = _id;
    this.modalReference = this.modalService.open(deleteEmployee, {
      size: "sm",
    });
  }
  //delete form data
  confirmDeleteEmployee(): void {
    var MY = this;
    this.common.callApi({
      type: "post",
      url: "hiring/delete-detail",
      data: {
        _id: MY.deleteUserId,
      },
      callback: function (res) {
        if (res.hiring.status == "success") {
          MY.common.notificationMsg("alert-fill-success", res.hiring.msg);
          // MY.getEmpDetails();
          MY.rerender();
          MY.common.loader(false);
        }
      },
    });
    this.modalService.dismissAll();
  }

  closeModal() {
    this.modalService.dismissAll();
  }
  reveiwIndex: any;
  //review employee model
  tRate = false;
  openEmpReviewForm(ReviewEmployee, admin_addemployee, type) {
    this.modalReference = this.modalService.open(ReviewEmployee, {
      windowClass: "myCustomModalClass",
    });
    if (type == "addReview") {
      this.FormTitle = "Add Review";
      if (admin_addemployee.status == 0) {
        this.displayEmpData = false;
        this.displayEmpForm = true;
        this.reviewEmployeeForm = this.formBuilder.group({
          reviewId: [admin_addemployee.hiring_id],
          details: ["", [Validators.required]],
          rating: [0, [Validators.required]],
          reviewStatus: ["", [Validators.required]],
        });
      }
    }
    if (type == "viewReview") {
      this.FormTitle = "View Review";
      if (admin_addemployee.status != 0) {
        this.displayEmpData = true;
        this.displayEmpForm = false;
        this.viewEmpName = admin_addemployee.name;
        this.viewEmpAssignerName = admin_addemployee.assign_person;
        this.viewEmpDetail = admin_addemployee.detail;
        this.viewEmpDate = admin_addemployee.date;
        this.viewEmpTime = admin_addemployee.time;
        this.viewEmpOverview = admin_addemployee.overview;
        this.viewEmpRating = admin_addemployee.rating;
        this.viewEmpReviewStatus = admin_addemployee.status;
      }
    }
    if (type == "editReview") {
      this.FormTitle = "Edit Review";
      if (admin_addemployee.status != 0) {
        this.displayEmpData = false;
        this.displayEmpForm = true;
        this.tRate = true;
        this.reviewEmployeeForm = this.formBuilder.group({
          reviewId: [admin_addemployee.hiring_id],
          details: [admin_addemployee.overview],
          rating: [admin_addemployee.rating],
          reviewStatus: [admin_addemployee.status],
        });
        this.viewEmpRating = admin_addemployee.rating;
      }
    }
  }
  //add review form validations
  get review() {
    return this.reviewEmployeeForm.controls;
  }

  //add review form submit
  onSubmitReview() {
    var MY = this;
    this.submitted = true;

    if (this.reviewEmployeeForm.invalid) {
      return;
    }
    var reviewEmp = this.reviewEmployeeForm.getRawValue();
    const formData = new FormData();
    formData.append("_id", reviewEmp.reviewId);
    formData.append("overview", reviewEmp.details);
    formData.append("rating", reviewEmp.rating);
    formData.append("status", reviewEmp.reviewStatus);

    this.common.callApi({
      type: "post",
      url: "hiring/add-review",
      data: formData,
      callback: function (res) {
        if (res.hiring.status == "success") {
          MY.common.notificationMsg("alert-fill-success", res.hiring.msg);
          // MY.getEmpDetails();
          MY.rerender();
        }
        MY.common.loader(false);
      },
      onErr: function (res) {},
      onFail: function () {},
    });
    this.modalService.dismissAll();
  }
  acceptUserId: any;
  openAcceptEmpModal(acceptEmployee, _id: any) {
    this.acceptUserId = _id;
    this.modalReference = this.modalService.open(acceptEmployee, {
      size: "sm",
    });
  }

  confirmAccept() {
    var MY = this;
    this.common.callApi({
      type: "post",
      url: "hiring/update-status",
      data: {
        hiringId: MY.acceptUserId,
        status: "accept",
      },
      callback: function (res) {
        if (res.hiring.status == "success") {
          MY.common.notificationMsg("alert-fill-success", res.hiring.msg);
          // MY.getEmpDetails();
          MY.rerender();
          MY.common.loader(false);
        }
      },
    });
    this.modalService.dismissAll();
  }

  rejectUserId: any;
  openRejectEmpModal(rejectReview, _id: any) {
    this.rejectUserId = _id;
    this.modalReference = this.modalService.open(rejectReview, { size: "sm" });
  }
  confirmReject() {
    var MY = this;
    this.common.callApi({
      type: "post",
      url: "hiring/update-status",
      data: {
        hiringId: MY.rejectUserId,
        status: "",
      },
      callback: function (res) {
        if (res.hiring.status == "success") {
          MY.common.notificationMsg("alert-fill-success", res.hiring.msg);
          // MY.getEmpDetails();
          MY.rerender();
          MY.common.loader(false);
        }
      },
    });
    this.modalService.dismissAll();
  }
  decline(): void {
    this.message = "Declined!";
    this.modalService.dismissAll();
  }
  declineAccept() {
    this.message = "Declined!";
    this.modalService.dismissAll();
  }
  declineReject() {
    this.message = "Declined!";
    this.modalService.dismissAll();
  }

  changeJoinStatus(id, event) {
    const status = event.target.value;
    //   alert(status); return
    var MY = this;
    this.common.callApi({
      type: "post",
      url: "hiring/update-join-status",
      data: {
        hiringId: id,
        joinStatus: status,
      },
      callback: function (res) {
        if (res.hiring.status == "success") {
          MY.common.notificationMsg("alert-fill-success", res.hiring.msg);
          // MY.getEmpDetails();
          MY.rerender();
          MY.common.loader(false);
        }
      },
    });
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }
  userDatas(userData, type) {
    return this.common.userDatas(userData, type);
  }

  filterForm() {
    this.applyFilter = this.formBuilder.group({
      totalExperience: new FormControl(),
      NoticePeriod: new FormControl(),
      mode: new FormControl(),
      expected_ctc: new FormControl(),
      current_ctc: new FormControl(),
      reviewStatus: new FormControl(),
      joiningStatus: new FormControl(),
      end_date: new FormControl(),
      start_date: new FormControl(),
      technology: new FormControl(),
    });
  }

  onapplyFilterSubmit(type: string) {
    this.common.loader(true);
    var user = localStorage.getItem(environment.userSession);
    let value = this.applyFilter.value;
    this.userData = JSON.parse(user);
    let MY = this;
    MY.rerender();
  }

  applyFilterreset() {
    this.applyFilter.reset();
    this.rerender();
  }

  dataPassInDatatable() {
    let value = this.applyFilter.value;
    if (value.totalExperience != null) {
      this.ParentObj["total_experience"] = value.totalExperience;
    }
    if (value.NoticePeriod != null) {
      this.ParentObj["notice_period"] = value.NoticePeriod;
    }
    if (value.expected_ctc != null) {
      this.ParentObj["expected_ctc"] = value.expected_ctc;
    }
    if (value.current_ctc != null) {
      this.ParentObj["current_ctc"] = value.current_ctc;
    }
    if (value.reviewStatus != null) {
      this.ParentObj["status"] = value.reviewStatus;
    }
    if (value.joiningStatus != null) {
      this.ParentObj["join_status"] = value.joiningStatus;
    }
    if (value.mode != null) {
      this.ParentObj["mode"] = value.mode;
    }
    if (value.start_date != null) {
      this.ParentObj["start_date"] = this.datePipe.transform(
        value.start_date,
        "yyyy-MM-dd"
      );
    }
    if (value.end_date != null) {
      this.ParentObj["end_date"] = this.datePipe.transform(
        value.end_date,
        "yyyy-MM-dd"
      );
    }
    if (value.technology != null) {
      this.ParentObj["technology"] = value.technology;
    }
  }
}
