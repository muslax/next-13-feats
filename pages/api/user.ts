import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/session";

export type SessionUser = {
  username: string;
  fullname: string;
  ts: number;
};

export default withIronSessionApiRoute(handler, sessionOptions);

async function handler(req: NextApiRequest, res: NextApiResponse<SessionUser>) {
  if (req.session.user) {
    res.json({
      ...req.session.user,
    });
  } else {
    res.status(404).json({
      username:'',
      fullname:'',
      ts: 0,
    });
  }
}
