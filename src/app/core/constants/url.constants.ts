// const ENVIROMENT: string = 'DEV';
const ENVIROMENT: string = 'PROD';


let MAIN_PATH_NET  = '';
let MAIN_PATH_AUTH = '';
switch (ENVIROMENT) {
  case 'DEV':
    // MAIN_PATH_NET  = 'https://localhost:3061/api/configurador/';
    // MAIN_PATH_AUTH = 'http://seguridadweb.indratools.com/aut/seguridad';
    break;
  case 'QA':
    MAIN_PATH_AUTH = '';
    break;
  case 'PROD':
    // MAIN_PATH_NET  = 'https://localhost:3061/api/configurador/';
    MAIN_PATH_AUTH = 'http://seguridadweb.indratools.com/aut/seguridad';
    MAIN_PATH_NET = 'http://backsupport.indratools.com/api/configurador/';
    break;
  default:
    break;
}

export const API_AUTH_SESSION = MAIN_PATH_AUTH + '/login';

// REGISTRO
export const API_DYNAMO = MAIN_PATH_NET + 'ExecuteQuery';




