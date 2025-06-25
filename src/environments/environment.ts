// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    // urlEndPoint: 'http://localhost:8085/', // URL }base de tu backend Spring Boot
    // urlEndPoint: 'http://localhost:8083/', // URL base de tu backend Spring Boot
    urlEndPoint: 'http://localhost:9090/', // URL base de tu backend Spring Boot
    // urlEndPoint: 'http://180.183.67.228:8080/', // URL base de tu backend Spring Boot
    baseUrl: '/',
};
// export const environment = {
//     production: false,    
//     urlEndPoint:'http://sun23dl04n1.banvendes.corp:7008/asiWS/',
//     baseUrl: '/asi/',

// };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
