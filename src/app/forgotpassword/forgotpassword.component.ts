import { Component, OnInit, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Title } from '@angular/platform-browser';
import { CommonService } from '../common.service';
@Component({
    selector: 'app-login',
    templateUrl: './forgotpassword.component.html',
    styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

    title = ':: EMS :: Forgot Password';

    constructor(
        private http: HttpClient,
        private router: Router,
        private titleService: Title,
        private renderer: Renderer2,
        private common: CommonService
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
            url: 'user/forgot-password',
            data: { 'email': val.email },
            callback: function (res) {
                MY.common.loader(false);
                if (res.forgotPassword.status == 'success') {
                    MY.common.notificationMsg('alert-fill-success', res.forgotPassword.msg);
                    if (res.status == 1) {
                        localStorage.setItem('forgotpassword', 'true');
                    }
                } else {
                    MY.common.notificationMsg('alert-fill-danger', res.forgotPassword.msg);
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

}
