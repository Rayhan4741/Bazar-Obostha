"use client";
import { use } from "react";
import { useApi, bn, unitBn } from "@/lib/utils";
import { Badge, NotFoundBox } from "@/components/ProductCard";
import useGuard from "@/components/useGuard";
function Stat({ l, v }: { l: string; v: number }) {
  return (
    <div className="border border-green-100 rounded-lg p-3">
      <p className="text-xs text-gray-500">{l}</p>
      <b className="text-green-700 text-lg">{bn(v)} টাকা</b>
    </div>
  );
}

export default function Product({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { ready } = useGuard();
  const { data, loading } = useApi("/products");
  if (!ready || loading) return <div className="skeleton h-96 rounded-xl" />;
  const p = (data || []).find((x) => x.slug === slug);
  if (!p) return <NotFoundBox msg="এই পণ্যটি পাওয়া যায়নি।" />;
  const m = p.markets || [];
  const min = Math.min(...m.map((x) => x.min)),
    max = Math.max(...m.map((x) => x.max));
  const avg = Math.round(
    m.reduce((s, x) => s + (x.min + x.max) / 2, 0) / (m.length || 1),
  );
  return (
    <div className="bg-white rounded-xl p-5 space-y-6">
      <div className="flex flex-wrap justify-between gap-4">
        <div className="flex gap-3 items-center">
          <span className="w-14 h-14 rounded-xl bg-green-50 grid place-items-center text-3xl">
            {p.image}
          </span>
          <div>
            <h1 className="text-2xl font-bold">{p.nameBn}</h1>
            <p className="text-sm text-gray-500">
              {p.categoryIcon} {p.categoryNameBn} · {unitBn(p.unit)}
            </p>
            <p className="text-sm text-gray-600">
              আজকের দাম ও বাজারভিত্তিক তথ্য
            </p>
          </div>
        </div>
        <div className="border border-green-100 rounded-lg p-3 text-right">
          <p className="text-xs text-gray-500">আজকের দাম</p>
          <b className="text-2xl">{bn(p.today)} টাকা</b>
          <div>
            <Badge change={p.change} />
          </div>
        </div>
      </div>
      <div>
        <h2 className="font-bold mb-2">মূল্য সারসংক্ষেপ</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <Stat l="সর্বনিম্ন দাম" v={min} />
          <Stat l="সর্বোচ্চ দাম" v={max} />
          <Stat l="গড় দাম" v={avg} />
        </div>
      </div>
      <div>
        <h2 className="font-bold mb-2">বাজারভিত্তিক আজকের দাম</h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra text-sm">
            <thead>
              <tr>
                <th>বাজার</th>
                <th>বিভাগ</th>
                <th>সর্বনিম্ন</th>
                <th>সর্বোচ্চ</th>
                <th>গড়</th>
              </tr>
            </thead>
            <tbody>
              {m.map((x, i) => (
                <tr key={i}>
                  <td>{x.market}</td>
                  <td>{x.division}</td>
                  <td>{bn(x.min)} টাকা</td>
                  <td>{bn(x.max)} টাকা</td>
                  <td>{bn(Math.round((x.min + x.max) / 2))} টাকা</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
