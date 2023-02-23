import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {
  HttpClientModule,
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { environment } from "../environments/environment";
import * as $ from "jquery";
import { catchError, map } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  private message: string;
  httpHeaders: any;

  constructor(private http: HttpClient, private _router: Router) {}

  /**
   * this is used to clear anything that needs to be removed
   */
  clear(): void {
    localStorage.clear();
  }

  /**
   *
   * @param type strin post|get
   * @param url string url of api
   * @param header add header if required or asend blank
   * @param parameter value to pass in post request
   * @param callback
   * @param callbackErr
   */
  callApi(parameter): any {
    var MY = this;
    const headers = new HttpHeaders().set("Auth", environment.authKey);
    MY.loader(true);
    if (parameter.type.toLowerCase() == "post") {
      this.http
        .post(environment.serverUrl + parameter.url, parameter.data, {
          headers: headers,
        })
        .subscribe(
          (res: any) => {
            if (parameter.callback) parameter.callback(res);
          },
          (error: any[]) => {
            if (parameter.onErr) {
              parameter.onErr(environment.generalErrorMsg);
            }
          }
        );
    } else if (parameter.type.toLowerCase() == "get") {
      this.http
        .get(environment.serverUrl + parameter.url, { headers: headers })
        .subscribe(
          (res: any) => {
            if (parameter.callback) parameter.callback(res);
          },
          (error: any[]) => {
            if (parameter.onErr) parameter.onErr(environment.generalErrorMsg);
          }
        );
    }
  }
  postApi(url, data) {
    return this.http.post(environment.serverUrl + url, data);
  }

  postPrivate(url, data) {
    const headers = new HttpHeaders().set("Auth", environment.authKey);

    return this.http
      .post(environment.serverUrl + url, data, { headers: headers })
      .pipe(catchError(this.handleError));
  }

  getPrivate(url) {
    const headers = new HttpHeaders().set("Auth", environment.authKey);
    return this.http
      .get(environment.serverUrl + url, { headers: headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error("An error occurred:", error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }

    return throwError(error.error);
  }

  userDatas(userData, type) {
    if (userData == "admin" && type == "onlyAdmin") {
      return true;
    } else if (userData !== "admin" && type == "all") {
      return true;
    } else if (
      userData !== "admin" &&
      userData !== "hm" &&
      type == "allHrNone"
    ) {
      return true;
    } else if (
      (userData == "admin" || userData == "manager") &&
      type == "admin&manager"
    ) {
      return true;
    } else if (
      (userData == "admin" || userData == "hm") &&
      type == "admin&hm"
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   *
   * @param type strin post|get
   * @param url string url of api
   * @param header add header if required or asend blank
   * @param parameter value to pass in post request
   * @param callback
   * @param callbackErr
   */
  callApiWithOutLoader(parameter): any {
    var MY = this;
    const headers = new HttpHeaders().set("Auth", environment.authKey);
    if (parameter.type.toLowerCase() == "post") {
      this.http
        .post(environment.serverUrl + parameter.url, parameter.data, {
          headers: headers,
        })
        .subscribe(
          (res: any) => {
            if (parameter.callback) parameter.callback(res);
          },
          (error: any[]) => {
            if (parameter.onErr) parameter.onErr(environment.generalErrorMsg);
          }
        );
    } else if (parameter.type.toLowerCase() == "get") {
      this.http
        .get(environment.serverUrl + parameter.url, { headers: headers })
        .subscribe(
          (res: any) => {
            if (parameter.callback) parameter.callback(res);
          },
          (error: any[]) => {
            if (parameter.onErr) parameter.onErr(environment.generalErrorMsg);
          }
        );
    }
  }

  /**
   *
   * @param display True | False
   */
  loader(display: boolean): void {
    $("#loader")[display ? "show" : "hide"]();
  }

  /**
   *
   * @param className
   * @param msg
   */
  notificationMsg(className, msg): void {
    $("#notificationMsg").show();
    $("#notificationMsg").addClass(className);
    $("#notificationMsg").text(msg);
    setTimeout(function () {
      $("#notificationMsg").hide();
      $("#notificationMsg").removeClass(className);
      $("#notificationMsg").text("");
    }, 6000);
  }
}
