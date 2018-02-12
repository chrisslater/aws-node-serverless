import * as Hapi from 'hapi';
import * as Users from '../schema/users';
export declare const routes: Hapi.RouteConfiguration[];
export declare function getUsersHandler(request: Hapi.Request): Promise<Users.IUser[]>;
export declare function postUsersHandler(request: Hapi.Request): Promise<Users.IUser>;
