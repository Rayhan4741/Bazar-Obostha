"use client";
import { useApi, bn, bnPct, unitBn } from "@/lib/utils";
export default function Ticker() {
  const { data } = useApi("/products");
  if (!data?.length)
    return <div className="h-9 bg-white border-b border-green-100" />;
  const items = [...data, ...data];
  return (
    <div className="overflow-hidden bg-white border-b border-green-100 py-2 text-sm">
      <div className="ticker flex gap-8">
        {items.map((p, i) => (
          <span key={i} className="whitespace-nowrap">
            {p.image} {p.nameBn} <b>{bn(p.today)} টাকা</b>/
            {unitBn(p.unit).replace("প্রতি ", "")}{" "}
            <span
              className={
                p.change?.dir === "up"
                  ? "text-green-700"
                  : p.change?.dir === "down"
                    ? "text-red-600"
                    : "text-gray-400"
              }
            >
              {p.change?.dir === "up"
                ? "▲"
                : p.change?.dir === "down"
                  ? "▼"
                  : "—"}{" "}
              {bnPct(p.change?.pct ?? 0)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
