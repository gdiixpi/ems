import { Component, OnInit, Renderer2} from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Title } from '@angular/platform-browser';
import { CommonService } from '../common.service';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    passwordNew = 'password';
    show = false;
    title = ':: EMS :: Login';
    constructor(
        private http: HttpClient, 
        private router: Router,
        private titleService: Title, 
        private renderer: Renderer2, 
        private common: CommonService,
        private auth: AuthService
    ) {
        this.http = http;
        this.router = router;
    }

    ngOnInit() {
        this.titleService.setTitle(this.title);
        var body = document.getElementsByTagName('body')[0];
        body.classList.add('ems-authentication-page');
    }

    ngOnDestroy() {
        var body = document.getElementsByTagName('body')[0];
        body.classList.remove('ems-authentication-page');
    }

    onSubmit(val: any): void {
        var MY = this;
        this.common.callApi({
            type: 'post',
            url: 'user/login',
            data: {
                'email': val.email,
                'password': val.password,
                'login_type': environment.loginType,
                'device_token': '',
                'device_type': ''
            },
            callback: function (res) {
                MY.common.loader(false);
                if (res.user.status == 'success') {
                    MY.common.notificationMsg('alert-fill-success','Login Successfully');
                    if (res.user.status == 'success') {
                        if (window.localStorage) {
                            res.user.msg['user_id'] = res.user.msg['id'];
                            localStorage.setItem(environment.userSession, JSON.stringify(res.user.msg));
                            MY.auth.sendToken(val.email)
                            MY.router.navigate(['/dashboard']);
                        }
                    }
                } else {
                    MY.common.notificationMsg('alert-fill-danger',res.user.msg);
                }
            },
            onErr: function (res) {
                MY.common.loader(false);
                MY.common.notificationMsg('alert-fill-danger',res);
            },
            onFail: function () {
            }
        });
    }
    hideShowPassNew(){
        if(this.passwordNew === 'password'){
            this.passwordNew = 'text';
            this.show = true;
        }
        else {
            this.passwordNew = 'password'
            this.show = false;
        }
    }
}