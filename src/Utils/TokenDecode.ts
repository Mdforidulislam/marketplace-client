// Utils/TokenDecode.ts
import {jwtDecode} from "jwt-decode";

export interface CustomJwtPayload {
  user_Id: string;
  user_Email: string;
  user_Role: string;
  user_Name?: string;
  iat: number;
  exp: number;
}


export const decodedToken = (token: string): CustomJwtPayload => {
  return jwtDecode<CustomJwtPayload>(token);
}
