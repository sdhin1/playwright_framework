import dotenv from 'dotenv';
import { appUrl } from './url';
import { creds as encryptedCreds} from './credentials';

//load env variables from .env file
dotenv.config();

//env variables
export const env = process.env.ENVIRONMENT || 'qa';
export const apienv = process.env.API_ENVIRONMENT || env;
export const appenv = process.env.APP_ENVIRONMENT || env;

//base urls
export const baseApiUrl = `${appUrl[apienv as keyof typeof appUrl]}`;
export const baseAppUrl = `${appUrl[appenv as keyof typeof appUrl]}`;

//credentials
export const credentials = encryptedCreds[env as keyof typeof encryptedCreds];