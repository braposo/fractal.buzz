import type { NextApiRequest, NextApiResponse } from "next";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ status: string; message?: string }>
) {
  const { address } = req.query;

  if (
    supabaseUrl &&
    supabaseKey &&
    typeof address === "string" &&
    address.trim().length > 0 &&
    address !== "null"
  ) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    let { error } = await supabase
      .from("connectedWallets")
      .delete()
      .eq("address", address);

    if (error !== null) {
      return res.status(500).send({ status: "error", message: error.message });
    }
  }

  res.status(200).send({ status: "ok" });
}
