// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appName: "HR-Management",
  //   serverUrl: 'http://192.168.1.106/projects/Ang-Admin-Panel/API/public/index.php/api/',
  //  proPicURL: 'http://192.168.1.106/projects/Ang-Admin-Panel/API/public/profile-pic/',

  // serverUrl:
  //   "https://techcronus.com/staging/ems_development/API/public/index.php/api/",
  // userSession: "userSessionDev",
  // salarySheet: "https://techcronus.com/staging/ems_development/API/public/",
  // TBSsalarySheet:
  //   "https://techcronus.com/staging/ems_development/API/storage/app/",
  // LoggedInUser: "LoggedInUserDev",

  LoggedInUser: "LoggedInUserLive",
  serverUrl: "https://techcronus.com/staging/EMS/API/public/index.php/api/",
  userSession: "userSessionLive",
  salarySheet: "https://techcronus.com/staging/EMS/API/public/",
  TBSsalarySheet: "https://techcronus.com/staging/EMS/API/storage/app/",

  proPicURL: "https://techcronus.com/staging/EMS/API/public/profile-pic/",
  departmentImageURL:
    "https://techcronus.com/staging/EMS/API/public/department-image/",
  employeeOfQuarterImageURL:
    "https://techcronus.com/staging/EMS/API/public/employee-quarter-image/",
  authKey: "Mh15kgl4PPFt07M",
  loginType: "App",
  appType: "Web",
  generalErrorMsg: "Something went wrong please try again after sometime.",
  hireEmpResume: "https://techcronus.com/staging/EMS/API/public/resume/",
  encryptSecretKey: "TBSSALARYSLIPEMS",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
