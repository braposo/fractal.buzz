import { useWallet } from "@solana/wallet-adapter-react";
import React from "react";
import { useDataFetch } from "@utils/use-data-fetch";
import { FractalData } from "@pages/api/fractals/[room]";
import { ItemList } from "@components/home/item-list";
import { ConnectedWallets } from "@pages/api/wallets/[room]";

export function HomeContent() {
  const { publicKey, connected } = useWallet();

  const address = React.useRef(publicKey);

  React.useEffect(() => {
    if (address.current !== publicKey) {
      address.current = publicKey;
    }
  }, [publicKey]);

  useDataFetch<Array<FractalData>>(
    connected
      ? `/api/wallets/connect?address=${address.current}`
      : `/api/wallets/disconnect?address=${address.current}`
  );

  const { data: walletsConnected, error: walletsError } =
    useDataFetch<Array<ConnectedWallets>>("/api/wallets/test");

  const { data: fractals, error: fractalsError } = useDataFetch<
    Array<FractalData>
  >(walletsConnected ? `/api/fractals/test` : null);

  const [state, setState] = React.useState<"initial" | "success" | "error">(
    "initial"
  );

  React.useEffect(() => {
    if (state !== "initial" && !address.current) {
      setState("initial");
    }
  }, [address.current]);

  if (fractalsError) {
    return (
      <p className="text-center p-4">
        Failed to load fractals, please try connecting again
      </p>
    );
  }

  if (address.current && !fractals) {
    return (
      <p className="text-center p-4">
        Searching for fractals in your wallet...
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5">
      {walletsConnected && walletsConnected.length > 0 ? (
        <>
          {fractals && (
            <div className="card shadow-xl bg-neutral mb-5 col-span-2 text-center">
              <div className="card-body ">
                <h2 className="card-title">Current generated Buzz</h2>
                <p className="text-8xl text-bold">
                  {fractals.reduce((total, fractal) => {
                    return total + fractal.power * fractal.purity;
                  }, 0)}{" "}
                  <span className="text-3xl">Bz</span>
                </p>
              </div>
            </div>
          )}

          <div className="card shadow-xl bg-neutral mb-5">
            <div className="card-body ">
              <h2 className="card-title">Connected wallets</h2>
              {walletsConnected.map((wallet) => (
                <p key={wallet.address}>{wallet.address}</p>
              ))}
            </div>
          </div>
          <div className="card shadow-xl bg-neutral mb-5">
            <div className="card-body ">
              <h2 className="card-title">Fractals buzzing</h2>
              <ItemList items={fractals} />
            </div>
          </div>
        </>
      ) : (
        <p className="text-center p-4 col-span-2">No wallets connected</p>
      )}
    </div>
  );
}
