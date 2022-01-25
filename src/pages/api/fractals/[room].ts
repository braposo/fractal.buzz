import type { NextApiRequest, NextApiResponse } from "next";
import { NETWORK } from "@utils/endpoints";
import { PublicKey } from "@solana/web3.js";
import { Connection } from "@metaplex/js";
import { createClient } from "@supabase/supabase-js";

export type FractalData = {
  tokenAddress: string;
  faction: string;
  purity: number;
  power: number;
  velocity: number;
  sping: number;
  altitude: number;
  image: string;
};

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<FractalData>>
) {
  const { room } = req.query;

  if (room.length > 0 && supabaseUrl && supabaseKey) {
    const connection = new Connection(NETWORK);
    const getTokensForWallet = async (walletAddress: PublicKey) => {
      const tokens = await connection.getParsedTokenAccountsByOwner(
        walletAddress,
        {
          // This is the address of the SPL Token program
          programId: new PublicKey(
            "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          ),
        }
      );
      return tokens;
    };

    const supabase = createClient(supabaseUrl, supabaseKey);

    let { data: walletsConnected, error: walletsError } = await supabase
      .from("connectedWallets")
      .select("*");

    if (walletsConnected && walletsConnected.length > 0) {
      const allFractals = await Promise.all(
        walletsConnected.map(async (wallet) => {
          const walletAddress = new PublicKey(wallet.address);
          const tokens = await getTokensForWallet(walletAddress);

          const parsedTokens = tokens.value.map((token) => {
            const accountInfo = token.account.data.parsed.info;
            const mintKey = new PublicKey(accountInfo.mint);

            return {
              key: mintKey.toString(),
              amount: parseInt(accountInfo.tokenAmount.uiAmount),
              decimals: parseInt(accountInfo.tokenAmount.decimals),
            };
          });

          const nftTokens = parsedTokens.filter(
            (item) => item.amount === 1 && item.decimals === 0
          );

          let fractalTokens: Array<any> = [];

          if (nftTokens.length > 0) {
            const tokensData = await Promise.all(
              nftTokens.map(async (token) => {
                let { data, error } = await supabase
                  .from("fractals")
                  .select("*")
                  .eq("tokenAddress", token.key);

                if (!error && data && data.length === 1) {
                  return data[0];
                } else {
                  return undefined;
                }
              })
            );

            fractalTokens = tokensData.filter(Boolean);
          }

          return fractalTokens;
        })
      );

      res.status(200).json(allFractals.flat());
    }
  }

  res.status(400);
}
