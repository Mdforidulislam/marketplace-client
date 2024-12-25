// Utils/TokenDecode.ts
import {jwtDecode} from "jwt-decode";

interface CustomJwtPayload {
  user_role: string; 
  user_Email: string;
  exp: number; 
}

export const decodedToken = (token: string): CustomJwtPayload => {
  return jwtDecode<CustomJwtPayload>(token);
}
