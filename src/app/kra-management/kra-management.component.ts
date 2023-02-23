import { Component, OnInit, TemplateRef } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  FormArray,
  AbstractControl,
  Validators,
} from "@angular/forms";
import { timeLog } from "console";
import { data } from "jquery";
import { BsModalService, BsModalRef, ModalModule } from "ngx-bootstrap/modal";
import { environment } from "src/environments/environment";
import { CommonService } from "../common.service";

@Component({
  selector: "app-kra-management",
  templateUrl: "./kra-management.component.html",
  styleUrls: ["./kra-management.component.scss"],
})
export class KraManagementComponent implements OnInit {
  title = ":: EMS :: KRA Managment";
  parentBreadcumbTitle = "SET KRA";
  parentBreadcumbPath = [{ path: "", title: "KRA Managment" }];
  KRAForm: FormGroup;
  createGoalsForm: FormGroup;
  modalRefAddKRA: BsModalRef | null;
  selectedOrderIds: any;
  addGoals: any;
  userData = [];
  goalsList = [];
  addKRAArray: any = [];
  showMe: boolean;
  storedNames: any = [];
  details: any;

  constructor(
    private formBuilder: FormBuilder,
    private common: CommonService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    var profileData = JSON.parse(localStorage.getItem(environment.userSession));
    this.userData = profileData;
    this.selectKraApi();
    this.KRAForm = this.formBuilder.group({
      name: this.userData["first_name"] + " " + this.userData["last_name"],
      financial_year: ["", Validators.required],
      department: this.userData["access_type"],
      employee_code: this.userData["user_id"],
      designation: this.userData["role_name"],
      goals: new FormArray([]),
      finalCheckBox: ["", Validators.required],
    });
  }

  addKRA(template: TemplateRef<any>) {
    this.modalRefAddKRA = this.modalService.show(template, {
      class: "modal-lg",
    });
    this.createGoalsForm = this.formBuilder.group({
      orders: new FormArray([]),
    });
    this.addKRAApi();
  }

  addKRAApi() {
    let MY = this;
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    this.common.callApi({
      type: "post",
      url: "kra/get-kra-details",
      data: {
        role_id: MY.userData["role_id"],
      },
      callback: function (res) {
        if (res.status == true) {
          MY.goalsList = res.kra_details;
          MY.goalsList.forEach((value) => {
            if (value.is_active == 1) {
              value.checked = true;
            }
          });
          MY.addCheckboxesToForm();
        }
        MY.common.loader(false);
      },
      onErr: function (res) {},
      onFail: function () {},
    });
  }

  selectKraApi() {
    let MY = this;
    this.common.callApi({
      type: "post",
      url: "kra/get-kra-user-details",
      data: {
        user_id: MY.userData["user_id"],
      },
      callback: function (res) {
        if (res.kra_details.status == "success") {
          MY.addKRAArray = res.kra_details.data;
          MY.addKRAArray.forEach((value) => {
            if (value.is_active == 1) {
              value.checked = true;
            }
          });
          MY.addNewField();
        }
        MY.common.loader(false);
      },
      onErr: function (res) {},
      onFail: function () {},
    });
  }

  get ordersFormArray() {
    return this.createGoalsForm.controls.orders as FormArray;
  }
  private addCheckboxesToForm() {
    this.goalsList.forEach(() =>
      this.ordersFormArray.push(new FormControl(false))
    );
  }

  get goalsFromselectedOrder() {
    return this.KRAForm.controls.goals as FormArray;
  }

  private addNewField() {
    // var oldArray = this.KRAForm.value.goals;
    // var newArray = this.selectedOrderIds;
    // var Array = oldArray.splice(0,oldArray.length,newArray);

    // this.goalsFromselectedOrder.setValue(this.addKRAArray);
    // this.addKRAArray = [];
    this.addKRAArray.map((item) =>
      this.goalsFromselectedOrder.push(this.createContact(item))
    );
    // this.addKRAArray.push(this.selectedOrderIds[0])
    // console.log(this.addKRAArray, this.selectedOrderIds[0], 'Add');
  }

  // private addNewFieldOnLoad() {
  //   this.storedNames.forEach(() => this.goalsFromselectedOrder.push(new FormControl()));
  // }

  saveGoalList() {
    var obj = this.KRAForm.value;
    this.selectedOrderIds = this.createGoalsForm.value.orders
      .map((checked, i) => (checked ? this.goalsList[i].id : null))
      .filter((v) => v !== null);
    this.details = this.selectedOrderIds.map((x) => ({
      kra_id: x,
    }));
    let MY = this;
    var DATA: any;
    if (MY.addKRAArray.length == 0) {
      DATA = {
        details: JSON.stringify(MY.details),
        user_id: obj.employee_code,
      };
    } else {
      DATA = {
        details: JSON.stringify(MY.details),
        user_id: obj.employee_code,
        kra_user_list_id: MY.addKRAArray[0].kra_user_list_id,
      };
    }
    MY.common.callApi({
      type: "post",
      url: "kra/add-kra-user-details",
      data: DATA,
      callback: function (res) {
        MY.common.loader(false);
        if (res.kra_details.status == "success") {
          MY.common.notificationMsg("alert-fill-success", res.kra_details.msg);
          window.location.reload();
        } else {
          MY.common.notificationMsg("alert-fill-danger", res.kra_details.msg);
        }
        // MY.selectKraApi();
      },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg("alert-fill-danger", res);
      },
      onFail: function () {},
    });
    this.modalRefAddKRA.hide();
    this.showMe = true;
  }

  createContact(item): FormGroup {
    return this.formBuilder.group({
      kra_id: [item.kra_id],
      weightage: [item.weightage],
      goal_expectation: [item.goal_expectation],
      kra_user_list_id: [item.kra_user_list_id],
    });
  }

  closeModal() {
    this.modalRefAddKRA.hide();
  }
  saveForm() {
    var obj = this.KRAForm.value;
    let MY = this;
    this.common.callApi({
      type: "post",
      url: "kra/add-kra-user-details",
      data: {
        user_id: obj.employee_code,
        financial_year: obj.financial_year,
        is_check: 1,
        details: JSON.stringify(obj.goals),
        kra_user_list_id: obj.goals[0].kra_user_list_id,
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.kra_details.status == "success") {
          window.location.reload();
        }
      },
      onErr: function (res) {},
      onFail: function () {},
    });
  }
  removeRow(index) {
    (<FormArray>this.KRAForm.get("goals")).removeAt(index);
  }
}
