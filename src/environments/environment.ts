// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  TITLE: 'journal',
  AUTH_HOST: 'http://localhost:9004/v1/security',
  API_HOST: 'http://localhost:9005',
  ENABLE_AUTH: true,
  PAGINATION_TYPE: `link`, // Options 'limit_offset' / 'link' / 'page_number'
};

/*
* For easier debugging in development mode, you can import the following file
* to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
*
* This import should be commented out in production mode because it will have a negative impact
* on performance if an error is thrown.
*/
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
