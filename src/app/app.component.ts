import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import * as $ from 'jquery';
import { environment } from '../environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = ':: EMS :: Dashboard';
  isLogin = '0';

  constructor(
    private router: Router, 
    private titleService: Title
    ) { }

  ngOnInit(): void {
    this.titleService.setTitle(this.title)
    var userdata = localStorage.getItem(environment.userSession);
    if(userdata){
      this.isLogin = '0';
    } else {
      this.isLogin = '0';
    }
    
  }
}
