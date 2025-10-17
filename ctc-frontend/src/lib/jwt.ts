import { jwtDecode } from "jwt-decode";

export const decodeToken = (token: string) => {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};
