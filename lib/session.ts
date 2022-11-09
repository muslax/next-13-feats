// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import { IronSessionOptions } from "iron-session";
import type { SessionUser } from "@/api/user";

export const sessionOptions: IronSessionOptions = {
  password: process.env.SESSION_COOKIE_PASSWORD as string,
  cookieName: process.env.SESSION_COOKIE_NAME as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

// This is where we specify the typings of req.session.*
declare module "iron-session" {
  interface IronSessionData {
    user: SessionUser;
  }
}
