import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/session";
import { SessionUser } from "./user";

export default withIronSessionApiRoute(handler, sessionOptions);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.body

  if (username == 'muslax') {
    const user: SessionUser = {
      username: 'muslax',
      fullname: 'Arif Muslax',
      ts: new Date().getTime(),
    }

    req.session.user = user;
    await req.session.save();
    res.json(user);
  } else {
    res.status(404).json({ message: "Invalid username" });
  }
}