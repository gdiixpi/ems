import { Component, OnInit, Renderer2, TemplateRef } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import { Title } from '@angular/platform-browser';
import { CommonService } from '../common.service';
import * as $ from 'jquery';

@Component({
    selector: 'app-setpassword',
    templateUrl: './setpassword.component.html',
    styleUrls: ['./setpassword.component.scss']
})
export class SetpasswordComponent implements OnInit {

    title = ':: EMS :: Set Password';
    userId: any;
    emailId: any;

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
        this.titleService.setTitle(this.title)
        let parts = [], answer = '', decode_str = '', json_data: any = {};

        parts = this.router.url.split('?q=');
        answer = parts[parts.length - 1];
        decode_str = decodeURIComponent(answer);
        json_data = JSON.parse(atob(decode_str));

        //(<any>document).getElementById('email').value = json_data.email;
        this.emailId = json_data.email;
        this.userId = json_data.userId;
    }

    onSubmit(val: any): void {
        var MY = this;
        this.common.callApi({
            type: 'post',
            url: 'user/set-password',
            data: {
                'user_id': MY.userId,
                'password': val.password,
                'cnpassword': val.cnpassword
            },
            callback: function (res) {
                MY.common.loader(false);
                if (res.setpassword.status == 'success') {
                    MY.common.notificationMsg('alert-fill-success', res.setpassword.msg);
                    localStorage.clear();
                    sessionStorage.clear();
                    MY.router.navigate(['/login']);
                } else {
                    MY.common.notificationMsg('alert-fill-danger', res.setpassword.msg);
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
    // openModal(template: TemplateRef<any>) {
    //     this.modalRef = this.modalService.show(template, { class: 'modal-md' });
    // }

}
