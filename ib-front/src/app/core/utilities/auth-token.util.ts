import {User} from "../models/user";
import jwt_decode from "jwt-decode";
import {mapRole} from "./role-mapper.util";

export function extractUserFromToken(token: string | null): User | null {
  try {
    token = token || JSON.parse(localStorage.getItem('user') || '{}').token;
  } catch (error) {
    localStorage.removeItem('user');
  }

  if (!token) {
    return null;
  }

  try {
    const decodedToken: any = jwt_decode(token);
    const current_time = Date.now().valueOf() / 1000;
    if (decodedToken.exp < current_time) {
      localStorage.removeItem('user');
      return null;
    }

    const role = mapRole(decodedToken.role);
    return {
      id: decodedToken.jti,
      email: decodedToken.sub,
      role: role,
      token,
    };
  } catch (error) {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const decodedToken: any = jwt_decode(token);
    const expirationDate = decodedToken.exp;
    const now = (new Date()).getTime() / 1000;
    return expirationDate < now;
  } catch (error) {
    return true;
  }
}
