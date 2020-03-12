export const environment = {
  production: true,
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
