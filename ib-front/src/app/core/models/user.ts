import {UserRoleEnum} from "../enums/user-role.enum";

export interface User {
  id: string;
  email: string;
  role: UserRoleEnum;
  token: string;
}
