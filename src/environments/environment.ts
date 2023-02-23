// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appName: "HR-Management",
  // serverUrl: 'https://techcronus.com/staging/EMS/API/public/index.php/api/',
  // userSession : 'userSessionLive',
  // proPicURL: 'https://techcronus.com/staging/EMS/API/public/profile-pic/',
  // serverUrl:'https://techcronus.com/staging/ems_development/API/public/index.php/api/',
  // userSession : 'userSessionDev',
  // LoggedInUser:'LoggedInUserDev',
  LoggedInUser: "LoggedInUserLocal",
  userSession: "userSessionLocal",
  serverUrl: "http://192.168.1.44/ems/public/index.php/api/",
  proPicURL: "http://192.168.1.44/ems/public/profile-pic/",
  departmentImageURL: "http://192.168.1.44/ems/public/department-image/",
  employeeOfQuarterImageURL:
    "http://192.168.1.44/ems/public/employee-quarter-image/",
  hireEmpResume: "http://192.168.1.44/ems/public/resume/",
  authKey: "Mh15kgl4PPFt07M",
  loginType: "App",
  appType: "Web",
  generalErrorMsg: "Something went wrong please try again after sometime.",
  encryptSecretKey: "TBSSALARYSLIPEMS",
  salarySheet: "http://192.168.1.44/ems/public/",
  TBSsalarySheet: " http://192.168.1.44/ems/storage/app/",
  // salarySheet:'https://techcronus.com/staging/ems_development/API/public/',
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
