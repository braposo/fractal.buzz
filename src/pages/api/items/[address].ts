import { NETWORK } from "@utils/endpoints";
import type { NextApiRequest, NextApiResponse } from "next";

import { PublicKey } from "@solana/web3.js";
import { programs, Connection } from "@metaplex/js";

export type ItemData = {
  key: string;
  amount: number;
  metadata?: programs.metadata.Metadata;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<ItemData>>
) {
  const { address } = req.query;

  if (address.length > 0) {
    const walletAddress = new PublicKey(address);
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

    // TODO: Filter by Fractal IDs
    const filteredTokens = parsedTokens.filter(
      (item) => item.amount === 1 && item.decimals === 0
    );

    res.status(200).json(filteredTokens);
  }

  res.status(400);
}
