import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Title } from '@angular/platform-browser';
import * as $ from 'jquery';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from '../../environments/environment';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-departmentteams',
  templateUrl: './departmentteams.component.html',
  styleUrls: ['./departmentteams.component.scss']
})
export class DepartmentteamsComponent implements OnInit {
  // title = ':: EMS :: Department Wise Teams';
  // parentBreadcumbTitle = 'Department Wise Teams';
  // parentBreadcumbPath = [{path:'', title:'Department Wise Teams'}];
  EditUserData = [];
  project_id = '';
  viewdepartment = [];
  viewemployee = [];
  userData = [];
  title: any;
  role_id: any;
  access_type: any;
  parentBreadcumbTitle: any;
  parentBreadcumbPath: any;

  constructor(
    private router: Router,
    private titleService: Title, 
    private common: CommonService, 
    private route: ActivatedRoute, 
    private modalService: BsModalService, 
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    this.titleService.setTitle(this.title)
    var MY = this;
    MY.role_id = this.userData['role_id'];
    MY.access_type = this.userData['access_type'];
    if (MY.access_type == 'admin') {
      MY.title = ':: EMS :: Department Wise Teams';
      MY.parentBreadcumbTitle = 'Department Wise Teams';
      MY.parentBreadcumbPath = [{ path: '', title: 'EMP Management' }, { path: '', title: 'Department Wise Teams' }];
    } else {
      MY.title = ':: EMS :: Department Wise Teams';
      MY.parentBreadcumbTitle = 'Department Wise Teams';
      MY.parentBreadcumbPath = [{ path: '', title: 'Department Wise Teams' }];
    }
    
    this.common.callApi({
      type: 'post',
      url: 'department/view-departments',
      callback: function (res) {
        if (res.department.status == 'success') {
          MY.viewdepartment = [];
          res.department.msg.forEach(element => {
            element.department_image = environment.departmentImageURL + element.id + '.png';
            MY.viewdepartment.push(element);
          });
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
      url: 'user/view-user-list',
      callback: function (res) {
        if (res.user.status == 'success') {
          MY.viewemployee = [];
          res.user.msg.forEach(elementNew => {
          if (elementNew.profile_pic != '') {
              elementNew.new_profile_pic = environment.proPicURL + elementNew.user_id + '/' + elementNew.profile_pic;
            } else {
              elementNew.new_profile_pic = 'assets/images/faces/face1.jpg';
            }
            MY.viewemployee.push(elementNew);
          });
        }
        MY.common.loader(false);
      },
      onErr: function (res) {
      },
      onFail: function () {
      }
    });
    

  }

}
