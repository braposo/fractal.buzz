import { TwitterResponse } from "@pages/api/twitter/[key]";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useDataFetch } from "@utils/use-data-fetch";
import React from "react";

export function Header() {
  const { publicKey } = useWallet();
  const { data } = useDataFetch<TwitterResponse>(
    publicKey ? `/api/twitter/${publicKey}` : null
  );

  const twitterHandle = data && data.handle;

  return (
    <div className="navbar mb-6 shadow-lg bg-neutral text-neutral-content rounded-box">
      <div className="flex-1 px-2 mx-2">
        <span className="text-lg font-bold">Fractal Buzz</span>
      </div>
      <div className="flex-none">
        {publicKey ? (
          twitterHandle && (
            <span className="mr-4">
              Welcome <strong>@{twitterHandle}</strong>
            </span>
          )
        ) : (
          <p className="text-center p-4 col-span-2">
            Connect your wallet to start buzzing →
          </p>
        )}
        <WalletMultiButton className="btn btn-ghost" />
      </div>
    </div>
  );
}
