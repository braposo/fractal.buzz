import { useWallet } from "@solana/wallet-adapter-react";
import React from "react";
import { useDataFetch } from "@utils/use-data-fetch";
import { FractalData } from "@pages/api/fractals/[address]";
import { ItemList } from "@components/home/item-list";

export function HomeContent() {
  const { publicKey } = useWallet();
  const { data, error } = useDataFetch<Array<FractalData>>(
    publicKey ? `/api/fractals/${publicKey}` : null
  );
  const [state, setState] = React.useState<"initial" | "success" | "error">(
    "initial"
  );

  React.useEffect(() => {
    if (state !== "initial" && !publicKey) {
      setState("initial");
    }
  }, [publicKey]);

  if (error) {
    return (
      <p className="text-center p-4">
        Failed to load items, please try connecting again
      </p>
    );
  }

  if (publicKey && !data) {
    return <p className="text-center p-4">Loading wallet information...</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-5">
      {publicKey ? (
        <>
          <div className="card shadow-xl bg-neutral mb-5">
            <div className="card-body ">
              <h2 className="card-title">Connected wallets</h2>
              <p>{publicKey.toBase58()}</p>
            </div>
          </div>
          <div className="card shadow-xl bg-neutral mb-5">
            <div className="card-body ">
              <h2 className="card-title">Fractals buzzing</h2>
              <ItemList items={data} />
            </div>
          </div>
        </>
      ) : (
        <p className="text-center p-4 col-span-2">
          Connect your wallet to start buzzing
        </p>
      )}
    </div>
  );
}
