import { Component, OnInit, Renderer2, TemplateRef, NgModule, ViewChild } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbDropdownConfig, NgbModule, ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { Title } from '@angular/platform-browser';
import { CommonService } from '../common.service';
import { environment } from '../../environments/environment';
import * as $ from 'jquery';
import * as CryptoJS from "crypto-js";
import { parse } from 'querystring';

@Component({
  selector: 'app-editemployee',
  templateUrl: './editemployee.component.html',
  styleUrls: ['./editemployee.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditEmployeeComponent implements OnInit {
  isDisabled:boolean;
  title = ':: EMS :: Edit Employee Details';
  CurrentYear = new Date().getFullYear();
  parentBreadcumbTitle = 'Add Employee';
  parentBreadcumbPath = [{path:'', title:'EMP Management'}, {path:'', title:'View Employee'}, {path:'', title:'Edit Employee'}];
  closeResult: string;
  userData = [];
  uesrDepartment = [];
  userRoles = [];
  userService = [];
  id = '';
  loginUserRoleId: any;
  EditUserData: any;
  profileImage = 'assets/images/faces/face1.jpg';
  modalRef: BsModalRef | null;
  colorTheme = 'theme-dark-blue';
  message: string;
  showModal: boolean;
  bsConfig = Object.assign({}, {
    containerClass: this.colorTheme,
    dateInputFormat: 'MM/DD/YYYY',
    isAnimated: true
  });
  appraisalDate:any;
  bsInlineValue = new Date();
  isViewSalary = false;
  inputType = "password";
  SalarySlipValue = 1;
  transactionValue = 'N';
  transactionData =  [{val:'N',name:'NEFT'}, {val:'R',name:'RTGS'}];
  accountNum:any;
  ifscCode:any;
  constructor(
    private router: Router,
    private titleService: Title,
    private common: CommonService, 
    private route: ActivatedRoute, 
    private modalService: BsModalService, 
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('custom-clock-calendar-ui');
    this.showModal = false;
    this.titleService.setTitle(this.title)
    var paramMap = this.route.snapshot.paramMap;
    this.id = paramMap.get('id');
    this.EditUserData = JSON.parse(localStorage.getItem('view_user_list'));
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    this.loginUserRoleId = this.userData['role_id'];
    let MY = this;
    this.common.callApi({
      type: 'post',
      url: 'department/view-departments',
      callback: function (res) {
        if (res.department.status == 'success') {
          MY.uesrDepartment = res.department.msg;
        }
        MY.common.loader(false);
      },
      onErr: function (res) {
      },
      onFail: function () {
      }
    });
    this.common.callApi({
      type: 'post',
      url: 'role/view-roles',
      callback: function (res) {
        if (res.userRoles.status == 'success') {
          MY.userRoles = res.userRoles.msg;
        }
        MY.common.loader(false);
      },
      onErr: function (res) {
      },
      onFail: function () {
      }
    });
    this.common.callApi({
      type: 'post',
      url: 'service/view-status',
      callback: function (res) {
        if (res.service.status == 'success') {
          MY.userService = res.service.msg;
        }
        MY.common.loader(false);
      },
      onErr: function (res) {
      },
      onFail: function () {
      }
    });

    if (this.EditUserData != undefined) {
      this.EditUserData = this.getEditUserDataById(this.id);
      if (this.EditUserData == undefined) {
        this.router.navigate(['/viewemployee']);
      }
      if(this.EditUserData['appraisal_date'] == ''){
        this.EditUserData['appraisal_date'] = '';
      }else{
        var tempDateapd = new Date(this.EditUserData['appraisal_date']);
        this.EditUserData['appraisal_date'] = this.datePipe.transform(tempDateapd, "MM/dd/yyyy");
      }
      var tempDate = new Date(this.EditUserData['joining_date']);
      this.EditUserData['joining_date'] = this.datePipe.transform(tempDate, "MM/dd/yyyy");
      var tempDatedob = new Date(this.EditUserData['dob']);
      this.EditUserData['dob'] = this.datePipe.transform(tempDatedob, "MM/dd/yyyy");
      if (this.EditUserData['service_status'] == 2) {
        var tempDateconfirmation = new Date(this.EditUserData['confirmation_date']);
        this.EditUserData['confirmation_date'] = this.datePipe.transform(tempDateconfirmation, "MM/dd/yyyy");
      } else if (this.EditUserData['service_status'] == 1) {
        var tempDateprobation = new Date(this.EditUserData['probation_date']);
        this.EditUserData['probation_date'] = this.datePipe.transform(tempDateprobation, "MM/dd/yyyy");
      }
      else if (this.EditUserData['service_status'] == 4) {
        var tempDatenotice = new Date(this.EditUserData['noticeperiod_date']);
        this.EditUserData['noticeperiod_date'] = this.datePipe.transform(tempDatenotice, "MM/dd/yyyy");
      }
      // if(this.EditUserData['transaction_type'] == 'N'){
      //   this.transactionValue = 'N'
      // }else{
      //   this.transactionValue = this.EditUserData['transaction_type']
      // }
      // if(this.EditUserData['account_number'] == ''){
      //   this.accountNum = ''
      // }else{
      //   this.accountNum = this.EditUserData['account_number']
      // }
      // if(this.EditUserData['ifsc_code'] == ''){
      //   this.ifscCode = ''
      // }else{
      //   this.ifscCode = this.EditUserData['ifsc_code']
      // }      
    }
  }
  getServiceData(event){
    if (event.target.value == 2) {
      if(this.EditUserData['confirmation_date'] == null || this.EditUserData['confirmation_date'] == ''){
        this.EditUserData['confirmation_date'] = ''
      }else{
        var tempDateconfirmation = new Date(this.EditUserData['confirmation_date']);
        this.EditUserData['confirmation_date'] = this.datePipe.transform(tempDateconfirmation, "MM/dd/yyyy");
      }
    } else if (event.target.value == 1) {
      if(this.EditUserData['probation_date'] == null || this.EditUserData['probation_date'] == ''){
        this.EditUserData['probation_date'] = ''
      }else{
      var tempDateprobation = new Date(this.EditUserData['probation_date']);
      this.EditUserData['probation_date'] = this.datePipe.transform(tempDateprobation, "MM/dd/yyyy");
      }
    }
    else if (event.target.value == 4) {
      if(this.EditUserData['noticeperiod_date'] == null || this.EditUserData['noticeperiod_date'] == ''){
        this.EditUserData['noticeperiod_date'] = ''
      }else{
      var tempDatenotice = new Date(this.EditUserData['noticeperiod_date']);
      this.EditUserData['noticeperiod_date'] = this.datePipe.transform(tempDatenotice, "MM/dd/yyyy");
      }
    }
  }
  ngDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('custom-clock-calendar-ui');
  }
  
  getEditUserDataById(user_id) {
    return this.EditUserData.find(x => x.user_id == user_id);
  }

  // Code for add employee
  onEditEmployee(val: any): void {
    var MY = this;
    var user = localStorage.getItem(environment.userSession);
    MY.userData = JSON.parse(user);
    var tempDate = new Date(val.dob);
    val.dob = MY.datePipe.transform(tempDate, "MM/dd/yyyy");
    var tempDatejod = new Date(val.joining_date);
    val.joining_date = MY.datePipe.transform(tempDatejod, "MM/dd/yyyy");
    if (val.service_status == 2) {
      var tempDateconfirmation = new Date(val.confirmation_date);
      val.confirmation_date = MY.datePipe.transform(tempDateconfirmation, "MM/dd/yyyy");
    } else if (val.service_status == 1) {
      var tempDateprobation = new Date(val.probation_date);
      val.probation_date = MY.datePipe.transform(tempDateprobation, "MM/dd/yyyy");
    }
    else if (val.service_status == 4) {
      var tempDateprobation = new Date(val.noticeperiod_date);
      val.noticeperiod_date = MY.datePipe.transform(tempDateprobation, "MM/dd/yyyy");
    }
    if(val.appraisal_date == '' || val.appraisal_date == null ){
      MY.appraisalDate = ''
    }else{
      var tempDateapd = new Date(val.appraisal_date);
      MY.appraisalDate = MY.datePipe.transform(tempDateapd, "MM/dd/yyyy");
    }
     
    MY.common.callApi({
      type: 'post',
      url: 'user/update-user',
      data: {
        'user_id': MY.id,
        'login_user_id': MY.userData['user_id'],
        'leaves': val.leaves,
        'dob': val.dob,
        'confirmation_date': val.confirmation_date,
        'probation_date': val.probation_date,
        'department': val.department,
        'email': val.email,
        'first_name': val.first_name,
        'gender': val.gender,
        'joining_date': val.joining_date,
        'last_name': val.last_name,
        'mobile_number': val.mobile_number,
        'service_status': val.service_status,
        'address': val.address,
        'role': MY.userData['role_id'],
        'userrole': val.userrole,
        'user_status': val.user_status,
        'noticeperiod_date':val.noticeperiod_date,
        'appraisal_date':MY.appraisalDate,
        'transaction_type':val.transaction_type,
        'account_number':val.account_number,
        'ifsc_code':val.ifsc_code,
        'personal_email':val.bank_email,
        'beneficiary_name':val.beneficiary_name,
        'bank_name':val.bank_name,
        'pf':val.pf_number,
        'esic':val.esic_code
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.user.status == 'success') {
          MY.common.notificationMsg('alert-fill-success', res.user.msg);
          MY.router.navigate(['/viewemployee']);
        } else {
          MY.common.notificationMsg('alert-fill-danger', res.user.msg);
        }
        MY.ngOnInit();
      },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg('alert-fill-danger', res);
      },
      onFail: function () {
      }
    });
  }

  // Code for add employee salary
  AddUpdateEmployeeSalaryModal(template: TemplateRef<any>) {
    this.inputType = "password";
    this.isDisabled = true;
    if(!this.isViewSalary){
      this.EditUserData = JSON.parse(localStorage.getItem('view_user_list'));
      if (this.EditUserData != undefined) {
        this.EditUserData = this.getEditUserDataById(this.id);
        if (this.EditUserData == undefined) {
          this.router.navigate(['/viewemployee']);
        }
        if(this.EditUserData['appraisal_date'] == ''){
          this.EditUserData['appraisal_date'] = '';
        }else{
          var tempDateapd = new Date(this.EditUserData['appraisal_date']);
          this.EditUserData['appraisal_date'] = this.datePipe.transform(tempDateapd, "MM/dd/yyyy");
        }
        var tempDate = new Date(this.EditUserData['joining_date']);
        this.EditUserData['joining_date'] = this.datePipe.transform(tempDate, "MM/dd/yyyy");
        var tempDatedob = new Date(this.EditUserData['dob']);
        this.EditUserData['dob'] = this.datePipe.transform(tempDatedob, "MM/dd/yyyy");
        if (this.EditUserData['service_status'] == 2) {
          var tempDateconfirmation = new Date(this.EditUserData['confirmation_date']);
          this.EditUserData['confirmation_date'] = this.datePipe.transform(tempDateconfirmation, "MM/dd/yyyy");
        } else if (this.EditUserData['service_status'] == 1) {
          var tempDateprobation = new Date(this.EditUserData['probation_date']);
          this.EditUserData['probation_date'] = this.datePipe.transform(tempDateprobation, "MM/dd/yyyy");
      } else if (this.EditUserData['service_status'] == 4) {
        var tempDatenotice = new Date(this.EditUserData['noticeperiod_date']);
        this.EditUserData['noticeperiod_date'] = this.datePipe.transform(tempDatenotice, "MM/dd/yyyy");
      }
      }

      // this.EditUserData.basic_pay = this.EditUserData.basic_pay;
      // this.EditUserData.house_rent_allowence = this.EditUserData.house_rent_allowence;
      // this.EditUserData.conveyance_allowence = this.EditUserData.conveyance_allowence;
      // this.EditUserData.medical_allowence = this.EditUserData.medical_allowence;
      // this.EditUserData.other_allowence = this.EditUserData.other_allowence;
      // this.EditUserData.total_ctc = this.EditUserData.total_ctc;
      // this.EditUserData.professional_tax = this.EditUserData.professional_tax;
      // this.EditUserData.income_tax = this.EditUserData.income_tax;
      // this.EditUserData.provident_fund = this.EditUserData.provident_fund;
      // this.EditUserData.emp_state_insurance = this.EditUserData.emp_state_insurance;
    }
    this.isViewSalary = false;
    this.getSalaryData();
    this.modalRef = this.modalService.show(template, { class: 'modal-custom' });
  }
  onEditEmployeeSalary(val: any): void{
    var MY = this;
    var currentUserId = this.id;
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    this.common.callApi({
      type: 'post',
      url: 'salary-slip/add-salary',
      data:{
        'userId': this.id,
        'basic_pay': val.basic_pay,
        'house_rent_allowence': val.house_rent_allowence,
        'conveyance_allowence': val.conveyance_allowence,
        'medical_allowence': val.medical_allowence,
        'other_allowence': val.other_allowence,
        'total_ctc': val.total_ctc,
        'professional_tax': val.professional_tax,
        'income_tax': val.income_tax,
        'provident_fund': val.provident_fund,
        'emp_state_insurance': val.emp_state_insurance
      },
      callback: function (res) {
        if (res.status == 'success') {
          MY.common.notificationMsg('alert-fill-success', res.msg);
          $('.AddUpdateEmployeeSalaryClose').trigger('click');
          var tempAllEmp = JSON.parse(localStorage.getItem('view_user_list'));
          localStorage.removeItem("view_user_list");
          var currentEmp = tempAllEmp.find(x => x.user_id == currentUserId);
          if (currentEmp != null){
            currentEmp.basic_pay = MY.setEnc(parseFloat(val.basic_pay));
            currentEmp.house_rent_allowence = MY.setEnc(parseFloat(val.house_rent_allowence));
            currentEmp.conveyance_allowence = MY.setEnc(parseFloat(val.conveyance_allowence));
            currentEmp.medical_allowence = MY.setEnc(parseFloat(val.medical_allowence));
            currentEmp.other_allowence = MY.setEnc(parseFloat(val.other_allowence));
            currentEmp.total_ctc = MY.setEnc(parseFloat(val.total_ctc));
            currentEmp.professional_tax = MY.setEnc(parseFloat(val.professional_tax));
            currentEmp.income_tax = MY.setEnc(parseFloat(val.income_tax));
            currentEmp.provident_fund = MY.setEnc(parseFloat(val.provident_fund));
            currentEmp.emp_state_insurance = MY.setEnc(parseFloat(val.emp_state_insurance));
          }
          localStorage.setItem('view_user_list', JSON.stringify(tempAllEmp));
          MY.ngOnInit();
        } else {
          MY.common.notificationMsg('alert-fill-danger', res.msg);
        }
        MY.common.loader(false); 
      },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg('alert-fill-danger', res);
      },
      onFail: function () {
      }
    });
  }
  ViewSalaryInfo(): void{
    //  debugger;//
    this.isDisabled = false;
    this.inputType = "text";
    this.isViewSalary = true;

    if (this.EditUserData.basic_pay != "" && this.EditUserData.basic_pay != '0'){
      this.EditUserData.basic_pay = parseFloat(this.getDec(this.EditUserData.basic_pay));
    }else{
      this.EditUserData.basic_pay = this.EditUserData.basic_pay;
    }
    if (this.EditUserData.house_rent_allowence != "" && this.EditUserData.house_rent_allowence != '0'){
      this.EditUserData.house_rent_allowence = parseFloat(this.getDec(this.EditUserData.house_rent_allowence));
    }else{
      this.EditUserData.house_rent_allowenc = this.EditUserData.house_rent_allowenc;
    }   
    if(this.EditUserData.conveyance_allowence != "" && this.EditUserData.conveyance_allowence != '0'){
      this.EditUserData.conveyance_allowence = parseFloat(this.getDec(this.EditUserData.conveyance_allowence));
    }else{
      this.EditUserData.conveyance_allowence = this.EditUserData.conveyance_allowence;
    } 
    if(this.EditUserData.medical_allowence != "" && this.EditUserData.medical_allowence != '0'){
      this.EditUserData.medical_allowence = parseFloat(this.getDec(this.EditUserData.medical_allowence));
    }else{
     this.EditUserData.medical_allowence = this.EditUserData.medical_allowence;
    } 
    if(this.EditUserData.other_allowence != "" && this.EditUserData.other_allowence != '0'){
      this.EditUserData.other_allowence = parseFloat(this.getDec(this.EditUserData.other_allowence));
    }else{
      this.EditUserData.other_allowence = this.EditUserData.other_allowence;
    } 
    if(this.EditUserData.total_ctc != "" && this.EditUserData.total_ctc != '0'){
      this.EditUserData.total_ctc = parseFloat(this.getDec(this.EditUserData.total_ctc));
    }else{
      this.EditUserData.total_ctc = this.EditUserData.total_ctc;
    } 
    if(this.EditUserData.professional_tax != "" && this.EditUserData.professional_tax != '0'){
      this.EditUserData.professional_tax = parseFloat(this.getDec(this.EditUserData.professional_tax));
    }else{
      this.EditUserData.professional_tax = this.EditUserData.professional_tax;
    } 
    if(this.EditUserData.income_tax != "" && this.EditUserData.income_tax != '0'){
      this.EditUserData.income_tax = parseFloat(this.getDec(this.EditUserData.income_tax));
    }else{
      this.EditUserData.income_tax = this.EditUserData.income_tax;
    } 
    if(this.EditUserData.provident_fund != "" && this.EditUserData.provident_fund != '0'){
      this.EditUserData.provident_fund = parseFloat(this.getDec(this.EditUserData.provident_fund));
    }else{
      this.EditUserData.provident_fund = this.EditUserData.provident_fund;
    } 
    if(this.EditUserData.emp_state_insurance != "" && this.EditUserData.emp_state_insurance != '0'){
      this.EditUserData.emp_state_insurance = parseFloat(this.getDec(this.EditUserData.emp_state_insurance));
    }else{
      this.EditUserData.emp_state_insurance = this.EditUserData.emp_state_insurance ;
    } 
    
  }

  setEnc(value: any) {
    var key = CryptoJS.enc.Utf8.parse(environment.encryptSecretKey);
    var encrypted = CryptoJS.AES.encrypt(JSON.stringify(value), key, {
      keySize: 128,
      mode: CryptoJS.mode.ECB,
    });
    return encrypted.toString();
  }

  getDec(value: any) {
    var key = CryptoJS.enc.Utf8.parse(environment.encryptSecretKey);
    var decrypted = CryptoJS.AES.decrypt(value, key, {
      keySize: 128,
      mode: CryptoJS.mode.ECB,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  changeSalarySlipValues(e) {
    this.SalarySlipValue = e;
  }
  sendSalarySlip(val: any) : void {
    var MY = this;    
    this.common.callApi({
      type: 'get',
      url: 'salary-slip/generate-salary-slip?userId='+ parseInt(this.id) +'&month=' + parseInt(val),
      callback: function (res) {
        MY.common.loader(false);
        if (res.status == 'success') {
          MY.common.notificationMsg('alert-fill-success', res.msg);
        } else {
          MY.common.notificationMsg('alert-fill-danger', res.msg);
        }
        MY.ngOnInit();
      },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg('alert-fill-danger', res);
      },
      onFail: function () {
      }
    });
  }
  getSalaryData(){
    var MY = this;
    MY.common.callApi({
      type: 'post',
      url: 'salary-slip/get-employee-salary',
      data :{
        userId : MY.EditUserData.user_id
      },
      callback: function (res) {
        var salaryData = res.user.msg;
        MY.EditUserData.basic_pay = salaryData.basic_pay;
        MY.EditUserData.house_rent_allowence = salaryData.house_rent_allowence;
        MY.EditUserData.conveyance_allowence = salaryData.conveyance_allowence;
        MY.EditUserData.medical_allowence = salaryData.medical_allowence;
        MY.EditUserData.other_allowence = salaryData.other_allowence;
        MY.EditUserData.total_ctc = salaryData.total_ctc;
        MY.EditUserData.professional_tax = salaryData.professional_tax;
        MY.EditUserData.income_tax = salaryData.income_tax;
        MY.EditUserData.provident_fund = salaryData.provident_fund;
        MY.EditUserData.emp_state_insurance = salaryData.emp_state_insurance;
        MY.common.loader(false);
      }
    });
  }
}
