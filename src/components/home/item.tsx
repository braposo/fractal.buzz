import React from "react";
import { FractalData } from "@pages/api/fractals/[address]";
import Image from "next/image";
import { useDataFetch } from "@utils/use-data-fetch";
import { MetadataJson } from "@metaplex/js";

type Props = {
  data: FractalData;
};

export function Item({ data }: Props) {
  const buzz = data.power * data.purity;
  return (
    <div className="flex flex-row">
      <div className="grow">
        <Image
          src={data.image}
          alt={`Picture of ${data.tokenAddress}`}
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>
      <div className="flex-none">
        <strong>{buzz}</strong> Bz
      </div>
    </div>
  );
}
