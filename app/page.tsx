"use client";
import { useApi, type Product } from "@/lib/utils";
import { Grid, GridSkeleton } from "@/components/ProductCard";
export default function Home() {
  const { data, loading } = useApi("/products");
  const top = (dir: string) =>
    (data || [])
      .filter((p) => p.change?.dir === dir)
      .sort((a, b) => (b.change?.pct ?? 0) - (a.change?.pct ?? 0))
      .slice(0, 6);
  const Sec = ({
    title,
    sub,
    id,
    items,
  }: {
    title: string;
    sub?: string;
    id?: string;
    items: Product[];
  }) => (
    <section id={id} className="mt-8 scroll-mt-4">
      <h2 className="text-lg font-bold">{title}</h2>
      {sub && <p className="text-sm text-gray-500">{sub}</p>}
      <div className="mt-3">
        {loading ? <GridSkeleton /> : <Grid items={items} />}
      </div>
    </section>
  );
  return (
    <>
      <section className="grid md:grid-cols-2 items-center gap-6 py-6">
        <div>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
            প্রতিদিনের হালনাগাদ বাজারদর
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold my-3 leading-snug">
            আজকের বাজারের দাম এক নজরে
          </h1>
          <p className="text-gray-600 mb-5">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস ও ডিমসহ নিত্যপ্রয়োজনীয় পণ্যের আজকের
            দাম, গতকালের সাথে তুলনা ও বাজারভিত্তিক তথ্য।
          </p>
          <a href="#সব-পণ্য" className="btn bg-green-700 text-white border-0">
            সব দাম দেখুন
          </a>
        </div>
        <div
          className="text-center text-[8rem] md:text-[10rem] leading-none select-none"
          aria-hidden
        >
          🧺
        </div>
      </section>
      <Sec title="▲ আজ দাম বেড়েছে" items={top("up")} />
      <Sec title="▼ আজ দাম কমেছে" items={top("down")} />
      <Sec
        id="সব-পণ্য"
        title="সব পণ্য"
        sub="সকল পণ্যের আজকের দাম ও পরিবর্তন"
        items={data || []}
      />
    </>
  );
}
