// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  hmr: false,
  apiUrl: 'http://52.43.219.64:3000/api/v1',
  whiteListDomains: ['52.43.219.64:3000'],
  blackListRoutes: ['52.43.219.64:3000/api/v1/user/login'],
  googleApiKey: 'AIzaSyAUTXuvamxi59Ux0XwCoYHpcnI01dpIsyU',
  firebaseConfig : {
    apiKey: 'AIzaSyCT9uBZHuNBN5HShnWHi6qVXzOZlH-jMIo',
    authDomain: 'overhear-2.firebaseapp.com',
    databaseURL: 'https://overhear-2.firebaseio.com',
    projectId: 'overhear-2',
    storageBucket: 'overhear-2.appspot.com',
    messagingSenderId: '316383840582'
  }
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
