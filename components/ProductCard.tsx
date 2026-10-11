import Link from "next/link";
import { bn, bnPct, unitBn, type Change, type Product } from "@/lib/utils";
export function Badge({ change }: { change?: Change }) {
  const d = change?.dir;
  const cls =
    d === "up"
      ? "bg-green-100 text-green-700"
      : d === "down"
        ? "bg-red-100 text-red-600"
        : "bg-gray-100 text-gray-500";
  return (
    <span className={`text-xs px-2 py-0.5 rounded ${cls}`}>
      {d === "up" ? "▲" : d === "down" ? "▼" : "—"} {bnPct(change?.pct ?? 0)}%
    </span>
  );
}
export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link
      href={`/product/${p.slug}`}
      className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="w-10 h-10 rounded-lg bg-green-50 grid place-items-center text-xl">
          {p.image}
        </span>
        <div>
          <h3 className="font-semibold leading-tight">{p.nameBn}</h3>
          <p className="text-xs text-gray-500">{unitBn(p.unit)}</p>
        </div>
      </div>
      <p className="text-[11px] text-gray-500">আজকের দাম</p>
      <div className="flex items-center justify-between">
        <b className="text-lg">
          {bn(p.today)} <small className="font-normal">টাকা</small>
        </b>
        <Badge change={p.change} />
      </div>
    </Link>
  );
}
export const Grid = ({ items }: { items: Product[] }) => (
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {items.map((p) => (
      <ProductCard key={p.id} p={p} />
    ))}
  </div>
);
export const GridSkeleton = ({ n = 6 }: { n?: number }) => (
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: n }).map((_, i) => (
      <div key={i} className="skeleton h-28 rounded-xl" />
    ))}
  </div>
);
export const NotFoundBox = ({
  msg = "দুঃখিত, এই পাতাটি খুঁজে পাওয়া যায়নি।",
}: {
  msg?: string;
}) => (
  <div className="text-center py-20">
    <p className="text-6xl mb-3">🧺</p>
    <h2 className="text-2xl font-bold mb-1">৪০৪</h2>
    <p className="text-gray-500 mb-4">{msg}</p>
    <Link href="/" className="btn bg-green-700 text-white border-0">
      হোম পেজে ফিরে যান
    </Link>
  </div>
);
