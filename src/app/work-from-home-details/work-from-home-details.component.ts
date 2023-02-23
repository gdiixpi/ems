import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { DataTableDirective } from 'angular-datatables';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-work-from-home-details',
  templateUrl: './work-from-home-details.component.html',
  styleUrls: ['./work-from-home-details.component.scss']
})
export class WorkFromHomeDetailsComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  title = ':: EMS :: Work From Home Details';
  parentBreadcumbTitle = 'Work From Home';
  parentBreadcumbPath = [{path:'', title:'Work From Home Details'}];
  modalRef: BsModalRef | null;
  public addWfhDetailForm:FormGroup;
  colorTheme = 'theme-dark-blue';
  maxDatestartDate: Date;
  tempJson:any;
  dtOptions: DataTables.Settings = {};
  newdata: any;
  wfhList:any = [];
  userData:any;
  startDate;
  endDate;
  filterType:any;
  deleteTask:any;
  approveWfhId:any;
  approveWfhUserId:any;
  rejectWfhId:any;
  rejectWfhUserId:any;
  rejectWfhUserName:any;
  message:any;
  minDatestartDate:Date;
  minDateendDate:Date;
  maxDateendDate:Date;
  EndDate:any;
  bsConfig = Object.assign(
    {},
    {
      containerClass: this.colorTheme,
    }
  );

  constructor(private modalService: BsModalService, private _fb: FormBuilder,  private common: CommonService,private titleService: Title,public datepipe: DatePipe,)  {
   }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    let MY = this;
    MY.getWfhDetails();
  }
  datapass() {
    if(this.filterType == 'filter'){
      this.newdata["user_id"] = this.userData['user_id'];
      this.newdata["start_date"] = this.startDate
      this.newdata["end_date"] = this.endDate
    }else{
      this.newdata["user_id"] = this.userData['user_id'];
    }
  }
  getWfhDetails(){
    let MY = this;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
    
    ajax: (dataTablesParameters: any, callback) => {
      MY.newdata = dataTablesParameters;
      MY.datapass();
      MY.common
        .postPrivate("work-from-home/view-workfromhome-request", dataTablesParameters)
        .subscribe(
          (res: any) => {
            res.workFromHomeRequest.data.sort((a, b) => <any>new Date(b.start_date) -<any>new Date(a.start_date));;
            MY.wfhList = res.workFromHomeRequest.data;
            this.common.loader(false);
            callback({
              recordsTotal: res.workFromHomeRequest.recordsTotal,
              recordsFiltered: res.workFromHomeRequest.recordsFiltered,
              data: [],
            });
          },
          (err: any) => {}
        );
    },
    columns: [
      { data: "id" },
      { data: "user_name" },
      { data: "start_date" },
      { data: "end_date" },
      { data: "reason" },
      { data: "status" },
      // {data:"end_date"},
    ],
    order: [[0, 'desc']]
  };

  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }
  onapplyFilterSubmit(val: any,type:any): void {
    this.common.loader(true);
    this.filterType = type;
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    this.startDate = val.start_date.toLocaleDateString()
    this.endDate = val.end_date.toLocaleDateString()
    this.rerender();
  }
  openDeleteModal(template: TemplateRef<any>, id: any) {
    this.deleteTask = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.rerender()
  }
  confirm(): void {
    // Write delete reports code here
    var MY = this;
    this.common.callApi({
      type: 'post',
      url: 'work-from-home/cancel-workfromhome-request',
      data: {
        'work_from_home_id': MY.deleteTask
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.workFromHomeRequest.status == 'success') {
          MY.common.notificationMsg('alert-fill-success', res.workFromHomeRequest.msg);
        } else {
          MY.common.notificationMsg('alert-fill-danger', res.workFromHomeRequest.msg);
        }
        $('.TaskDeleteClose').trigger('click');
        MY.rerender();
      },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg('alert-fill-danger', res);
        $('.TaskDeleteClose').trigger('click');
      },
      onFail: function () {
      }
    });
  }
  confirmApprove(): void {
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    var MY = this;
    this.common.callApi({
      type: "post",
      url: "work-from-home/approve-workfromhome-request",
      data: {
        id: MY.approveWfhId,
        approved_by: MY.userData["id"],
        user_id: MY.approveWfhUserId,
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.workFromHomeRequest.status == "success") {
          MY.common.notificationMsg("alert-fill-success", res.workFromHomeRequest.msg);
        } else {
          MY.common.notificationMsg("alert-fill-danger", res.workFromHomeRequest.msg);
        }
        $(".approveWfhClose").trigger("click");
        MY.rerender();
      },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg("alert-fill-danger", res);
        $(".approveWfhClose").trigger("click");
      },
      onFail: function () {},
    });
  }
  declineApprove(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }
  openApproveModal(template: TemplateRef<any>, id: any, user_id: any) {
    this.approveWfhId = id;
    this.approveWfhUserId = user_id;
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  openRejectModal(
    template: TemplateRef<any>,
    id: any,
    user_id: any,
    user_name: any
  ) {
    this.rejectWfhId = id;
    this.rejectWfhUserId = user_id;
    this.rejectWfhUserName = user_name;
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }
  StartDate:Date;
  onRejectSubmit(val: any): void {
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    var MY = this;
    this.common.callApi({
      type: "post",
      url: "work-from-home/reject-workfromhome-request",
      data: {
        id: val.wfh_id,
        user_id: val.wfh_uid,
        reject_reason: val.reason,
        rejected_by: MY.userData["id"],
        user_name: val.user_name,
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.workFromHomeRequest.status == "success") {
          MY.common.notificationMsg("alert-fill-success", res.workFromHomeRequest.msg);
        } else {
          MY.common.notificationMsg("alert-fill-danger", res.workFromHomeRequest.msg);
        }
        $(".rejectWfhClose").trigger("click");
        MY.rerender();
      },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg("alert-fill-danger", res);
      },
      onFail: function () {},
    });
  }
  reset(applyFilter:NgForm){
    applyFilter.reset(); 
    this.filterType = ''
    this.rerender();
  }
  userDatas(userData,type){
    return this.common.userDatas(userData,type);
  }
}

