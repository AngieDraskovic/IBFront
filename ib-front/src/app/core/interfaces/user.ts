import {Role} from "../enums/role";

export interface User {
  id: string;
  email: string;
  role: Role;
  token: string;
}
