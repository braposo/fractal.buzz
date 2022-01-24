import { Item } from "@components/home/item";
import React from "react";
import { FractalData } from "@pages/api/fractals/[address]";

type Props = {
  items: Array<FractalData> | undefined;
};

export function ItemList({ items }: Props) {
  if (!items) {
    return null;
  }

  return (
    <div className="grid grid-flow-row auto-rows-max">
      {items.map((item) => (
        <Item data={item} key={item.tokenAddress} />
      ))}
    </div>
  );
}
