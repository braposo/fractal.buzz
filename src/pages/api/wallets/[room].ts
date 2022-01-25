import type { NextApiRequest, NextApiResponse } from "next";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export type ConnectedWallets = {
  address: string;
  room: string | null;
  created_at: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<ConnectedWallets>>
) {
  const { room } = req.query;

  if (
    supabaseUrl &&
    supabaseKey &&
    typeof room === "string" &&
    room.trim().length > 0 &&
    room !== "null"
  ) {
    const supabase = createClient(supabaseUrl, supabaseKey);

    let { data, error } = await supabase.from("connectedWallets").select("*");

    if (error !== null) {
      return res.status(400);
    }

    return res.status(200).send(data || []);
  }
}
