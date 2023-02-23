import { Component, OnInit, Renderer2, TemplateRef, NgModule } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { NgbDropdownConfig, NgbModule, ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Title } from '@angular/platform-browser';
import { CommonService } from '../common.service';
import { environment } from '../../environments/environment';
import * as $ from 'jquery';

@Component({
  selector: 'app-viewteam',
  templateUrl: './viewteam.component.html',
  styleUrls: ['./viewteam.component.scss']
})
export class ViewTeamComponent implements OnInit {
  title = ':: EMS :: View Team';
  parentBreadcumbTitle = 'View Your Team';
  parentBreadcumbPath = [{path:'', title:'Superior Management'}, {path:'', title:'View Your Team'}];
  userData: any;
  userDataFirstName: any;
  userDataLastName: any;
  viewTeam: any;
  viewTeamSecondarySup = [];
  viewTeamMemberofPu = [];
  UserProfileImage = 'assets/images/faces/face1.jpg';
  PSprofileImage = 'assets/images/faces/face1.jpg';
  constructor(
    private router: Router, 
    private titleService: Title,
    private common: CommonService, 
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.titleService.setTitle(this.title)
    var user = localStorage.getItem(environment.userSession);
    this.userData = JSON.parse(user);
    this.userDataFirstName = this.userData['first_name'];
    this.userDataLastName = this.userData['last_name'];
    if (this.userData['profile_pic'] != '')
      this.UserProfileImage = environment.proPicURL + this.userData['id'] + '/' + this.userData['profile_pic'];
    let MY = this;
    this.common.callApi({
      type: 'post',
      url: 'user/view-team',
      data: {
        'user_id': MY.userData['id']
      },
      callback: function (res) {
        if (res.team.status == 'success') {
          MY.viewTeam = res.team.msg;
          MY.viewTeamSecondarySup = [];
          if (MY.viewTeam['primary_sup_name'].profile_pic != '') {
            MY.PSprofileImage = environment.proPicURL + MY.viewTeam['primary_sup_name'].superior_id + '/' + MY.viewTeam['primary_sup_name'].profile_pic;
          }
          res.team.msg.superior_name.forEach(element => {
            if (element.profile_pic != '') {
              element.new_profile_pic = environment.proPicURL + element.superior_id + '/' + element.profile_pic;
            } else {
              element.new_profile_pic = 'assets/images/faces/face1.jpg';
            }
            element.ss_first_name = element.first_name;
            element.ss_last_name = element.last_name;
            element.ss_role_id = element.role_id;
            MY.viewTeamSecondarySup.push(element);
          });
          res.team.msg.team_member_primary_superior.forEach(element => {
            if (element.profile_pic != '') {
              element.new_profile_pic_team = environment.proPicURL + element.user_id + '/' + element.profile_pic;
            } else {
              element.new_profile_pic_team = 'assets/images/faces/face1.jpg';
            }
            element.team_user_name = element.user_name;
            element.team_role_id= element.role_id;
            MY.viewTeamMemberofPu.push(element);
          });
        } else {
          MY.viewTeam = false;
        }
        MY.common.loader(false);
      },
      onErr: function (res) {
      },
      onFail: function () {
      }
    });
  }
  userDatas(userData,type){
    return this.common.userDatas(userData,type);
  }
}
