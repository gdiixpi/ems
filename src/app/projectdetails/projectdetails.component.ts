import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Title } from '@angular/platform-browser';
import * as $ from 'jquery';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from '../../environments/environment';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-projectdetails',
  templateUrl: './projectdetails.component.html',
  styleUrls: ['./projectdetails.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  title = ':: EMS :: Project Detail';
  parentBreadcumbTitle = 'Project Detail';
  parentBreadcumbPath = [{path:'', title:'Project Management'}, {path:'', title:'View Projects'}, {path:'', title:'Projrct Detail'}];
  EditUserData = [];
  project_id = '';
  projrctDetails: any;
  projrctDetailsTeam = [];
  projectType = '';
  projectName = '';
  startDate:any;
  endDate:any;
  status:any;
  description:any;
  document_link:any;

  constructor(
    private router: Router,
    private titleService: Title, 
    private common: CommonService, 
    private route: ActivatedRoute, 
    private modalService: BsModalService, 
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.titleService.setTitle(this.title)
    var MY = this;
    var paramMap = this.route.snapshot.paramMap;
    this.project_id = paramMap.get('id');
    this.EditUserData = JSON.parse(localStorage.getItem('view_user_list'));
    this.common.callApi({
      type: 'post',
      url: 'project/project-details',
      data: {
        'project_id': this.project_id
      },
      callback: function (res) {
        if (res.project.status == 'success') {
          MY.projrctDetails = res.project.data;
          MY.projectName = MY.projrctDetails.project_name;
          MY.startDate = MY.projrctDetails.start_date;;
          MY.endDate = MY.projrctDetails.end_date;
          MY.description = MY.projrctDetails.description;
          MY.document_link = MY.projrctDetails.document_link;

          if(MY.projrctDetails.type == 'new'){
            MY.projectType = 'New'
          }else if(MY.projrctDetails.type == 'internal'){
            MY.projectType = 'Internal'
          }else if(MY.projrctDetails.type == 'support'){
            MY.projectType = 'Support'
          }

          if(MY.projrctDetails.status == 0){
            MY.status = 'In progress'
          }else if(MY.projrctDetails.status == 1){
            MY.status = 'Completed'
          }


          MY.projrctDetailsTeam = [];
          res.project.data.user_list.forEach(element => {
            if (element.profile_pic != '') {
              element.new_profile_pic = environment.proPicURL + element.user_id + '/' + element.profile_pic;
            } else {
              element.new_profile_pic = 'assets/images/faces/face1.jpg';
            }
            MY.projrctDetailsTeam.push(element);
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
