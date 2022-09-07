// const ENVIROMENT: string = 'DEV';
const ENVIROMENT: string = 'PROD';

let MAIN_PATH_NET  = '';
// let MAIN_PATH_AUTH = '';
let AUTH_B2B = '';
switch (ENVIROMENT) {
  case 'DEV':
    // MAIN_PATH_NET  = 'https://localhost:3061/api/configurador/';
    // AUTH_B2B       = 'http://b2bsecurityservice.indratools.com/aut/seguridad/';
    break;
  case 'QA':
    AUTH_B2B = '';
    break;
  case 'PROD':
    AUTH_B2B       = 'http://b2bsecurityservice.indratools.com/aut/seguridad/';
    MAIN_PATH_NET  = 'http://backsupport.indratools.com/api/configurador/';
    // MAIN_PATH_AUTH = 'http://seguridadweb.indratools.com/aut/seguridad';
    break;
  default:
    break;
}

// export const API_AUTH_SESSION = MAIN_PATH_AUTH + '/login';
export const AUTH_SESSION_B2B = AUTH_B2B + '/login';

// REGISTRO
export const API_DYNAMO = MAIN_PATH_NET + 'ExecuteQuery';
