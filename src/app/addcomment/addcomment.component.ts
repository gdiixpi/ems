import { Component, OnInit, TemplateRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { CommonService } from '../common.service';
import { Router, ActivatedRoute } from "@angular/router";
import {HttpClient} from '@angular/common/http';
import 'datatables.net';
import 'datatables.net-buttons';
import 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { Title } from '@angular/platform-browser';
import * as $ from 'jquery';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-addcomment',
  templateUrl: './addcomment.component.html',
  styleUrls: ['./addcomment.component.scss']
})
export class AddcommentComponent implements OnInit {
  @ViewChild(DataTableDirective,{static:false})
  dtElement:DataTableDirective
  title = ':: EMS :: View Comments';
  parentBreadcumbTitle = 'View Comments';
  parentBreadcumbPath = [{path:'', title:'Task Management'}, {path:'', title:'View Task'}, {path:'', title:'View Comments'}];
  userData: any;
  modalRef: BsModalRef | null;
  taskDetail:any;
  taskAssignUsers  = [];
  taskComments  = [];
  task_id = '';
  loginUserId = '';
  CommentPopupTitle = ''
  project_id = '';
  comment_id = '';
  userCommentsData : any;
  task_comment : any;
  userCommentsWorkinH : any;
  userCommentsStatus : any;
  temp_var = false;
  config: any;
  deleteComment = 0;
  message: string;
  Payload:any;
  dtOptions: DataTables.Settings = {};
  constructor(
    private titleService: Title,
    private common: CommonService,
    private http: HttpClient,             
    private chRef: ChangeDetectorRef,
    private modalService: BsModalService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.titleService.setTitle(this.title)
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    var paramMap = this.route.snapshot.paramMap;
    this.task_id = paramMap.get('id');
    this.project_id = paramMap.get('projectid');
    let MY = this;
    this.loginUserId = this.userData['user_id'];
    this.config = {
      toolbar: [
        ['Maximize'],
        ['Format', 'FontSize'],
        ['Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat'],
        ['TextColor', 'BGColor'],
        ['NumberedList', 'BulletedList'],
        ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
        ['Table'],
        ['Cut', 'Copy'],
        ['Link', 'Unlink'],
        ['Undo', 'Redo']
      ]
    };

    this.common.callApi({
      type: 'post',
      url: 'task-manage/view-task-detail',
      data: {
        'task_id': MY.task_id,
        'project_id': MY.project_id,
      },
      callback: function (res) {
        if (res.status == true) {
          MY.taskDetail = res.task_detail;
          MY.taskAssignUsers = [];
          res.task_detail.user_list.forEach(elementNew => {
            if (elementNew.profile_pic != '') {
                elementNew.new_profile_pic = environment.proPicURL + elementNew.user_id + '/' + elementNew.profile_pic;
              } else {
                elementNew.new_profile_pic = 'assets/images/faces/face1.jpg';
              }
              MY.taskAssignUsers.push(elementNew);
            });
        }
        MY.common.loader(false);
      },
      onErr: function (res) {
      },
      onFail: function () {
      }
    });

    // this.common.callApi({
    //   type: 'post',
    //   url: 'task-manage/comment-list',
    //   data: {
    //     'task_id': MY.task_id
    //   },
    //   callback: function (res) {
    //     if (res.status == true) {
    //       MY.taskComments = res.comment_list;
    //       MY.temp_var = true;
    //     }
    //     MY.common.loader(false);
    //   },
    //   onErr: function (res) {
    //   },
    //   onFail: function () {
    //   }
    // });
    this.commentlistapi();
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload()
    });
  }
  commentlistapi(){
    const MY = this;
    MY.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,

      ajax: (dataTablesParameters: any, callback) => {
        MY.Payload = dataTablesParameters;
        MY.Payload["task_id"] = MY.task_id
        MY.common
          .postPrivate("task-manage/comment-list", dataTablesParameters)
          .subscribe(
            (res: any) => {             
                MY.taskComments = res.task.data;           
              callback({
                recordsTotal: res.task.recordsTotal,
                recordsFiltered: res.task.recordsFiltered,
                data: [],
              });
            },
            (err: any) => {}
          );
      },
      columns: [
        { data: "id" },
        { data: "Comment" },
        { data: "Comment_by" },
        { data: "Status" },
        { data: "Action" },
      ],
    };
  }

  onAddComment(val: any, id: any): void {
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    var MY = this;
    var Data: any;
    if (val.comment_id) {
      Data = {
        'id': val.comment_id,
        'task_id': MY.task_id,
        'project_id': MY.project_id,
        'status': val.status,
        // 'working_hours': val.working_hours,
        'description': val.task_comment,
        'memeber_id': this.userData['user_id']
      };
    }else{
      Data = {
        'task_id': MY.task_id,
        'project_id': MY.project_id,
        'status': val.status,
        // 'working_hours': val.working_hours,
        'description': val.task_comment,
        'memeber_id': this.userData['user_id']
      };
    }
    this.common.callApi({
      type: 'post',
      url: 'task-manage/add-comment',
      data: Data,
      callback: function (res) {
        MY.common.loader(false);
        if (res.status == true) {
          MY.common.notificationMsg('alert-fill-success', res.msg);
          $('.AddCommentClose').trigger('click');
          // setTimeout(function(){ 
          //   window.location.reload();
          //  }, 1000);
          MY.rerender();
        } else {
          MY.common.notificationMsg('alert-fill-danger', res.msg);
        }
      },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg('alert-fill-danger', res);
      },
      onFail: function () {
      }
    });
  }

  openModalAddComment(template: TemplateRef<any>, UserCommentsid : any,  UserCommentsdescription : any, UserCommentsworking_hours : any, UserCommentsstatus : any) {
    this.userCommentsData = '';
    this.task_comment = '';
    if(UserCommentsid != '')
      this.userCommentsData = UserCommentsid;
    if(UserCommentsdescription != '')
      this.task_comment = UserCommentsdescription;

    this.userCommentsWorkinH = UserCommentsworking_hours;
    this.userCommentsStatus = UserCommentsstatus;
    
    if(this.userCommentsData){
      this.CommentPopupTitle = 'Edit Comment';
    }else{
      this.CommentPopupTitle = 'Add Comment';
    }
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  openDeleteModal(template: TemplateRef<any>, id: any) {
    this.deleteComment = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  openTaskDescriptionModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  confirm(): void {
    var MY = this;
    this.common.callApi({
      type: 'post',
      url: 'task-manage/delete-comment',
      data: {
        'id': MY.deleteComment,
        'task_id': MY.task_id,
        'member_id': this.userData['user_id']
      },
      callback: function (res) {
        MY.common.loader(false);
        if (res.status == true) {
          MY.common.notificationMsg('alert-fill-success', res.msg);
          MY.rerender();
        } else {
          MY.common.notificationMsg('alert-fill-danger', res.msg);
        }
        $('.CommentDeleteClose').trigger('click');
      },
      onErr: function (res) {
        MY.common.loader(false);
        MY.common.notificationMsg('alert-fill-danger', res);
        $('.CommentDeleteClose').trigger('click');
      },
      onFail: function () {
      }
    });
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }  

}
