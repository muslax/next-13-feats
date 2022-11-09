import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/session";

export default withIronSessionApiRoute(handler, sessionOptions);

function handler(req: NextApiRequest, res: NextApiResponse) {
  req.session.destroy();
  res.json({ });
}
