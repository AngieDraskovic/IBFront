import {UserRoleEnum} from "../enums/user-role.enum";

const ROLE_ADMIN = 'ROLE_ADMIN';
const ROLE_USER = 'ROLE_USER';

export function mapRole(roleString: string): UserRoleEnum {
  switch (roleString) {
    case ROLE_ADMIN:
      return UserRoleEnum.Admin;
    case ROLE_USER:
      return UserRoleEnum.User;
    default:
      return UserRoleEnum.Guest;
  }
}
