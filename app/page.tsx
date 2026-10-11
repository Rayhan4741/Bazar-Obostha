"use client";
import { useState } from "react";
import { useApi, type Product } from "@/lib/utils";
import { Grid, GridSkeleton } from "@/components/ProductCard";

function Sec({
  title,
  sub,
  id,
  items,
  loading,
}: {
  title: string;
  sub?: string;
  id?: string;
  items: Product[];
  loading: boolean;
}) {
  return (
    <section id={id} className="mt-8 scroll-mt-4">
      <h2 className="text-lg font-bold">{title}</h2>
      {sub && <p className="text-sm text-gray-500">{sub}</p>}
      <div className="mt-3">
        {loading ? <GridSkeleton /> : <Grid items={items} />}
      </div>
    </section>
  );
}

function HeroImage() {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className="text-center text-[8rem] md:text-[10rem] leading-none select-none"
        aria-hidden
      >
        🧺
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/hero.png"
      alt="তাজা সবজি ও ফলের ঝুড়ি"
      className="w-full max-w-sm mx-auto h-auto"
      onError={() => setFailed(true)}
    />
  );
}

export default function Home() {
  const { data, loading, error } = useApi("/products");
  const products = data ?? [];

  const top = (dir: string) =>
    products
      .filter((p) => p.change?.dir === dir)
      .sort(
        (a, b) => Math.abs(b.change?.pct ?? 0) - Math.abs(a.change?.pct ?? 0),
      )
      .slice(0, 6);

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
        <HeroImage />
      </section>

      {error ? (
        <p className="text-center text-red-600 py-10">
          ডেটা লোড করা যায়নি। ইন্টারনেট সংযোগ দেখে পেজটি রিলোড করুন।
        </p>
      ) : (
        <>
          <Sec title="▲ আজ দাম বেড়েছে" items={top("up")} loading={loading} />
          <Sec title="▼ আজ দাম কমেছে" items={top("down")} loading={loading} />
          <Sec
            id="সব-পণ্য"
            title="সব পণ্য"
            sub="সকল পণ্যের আজকের দাম ও পরিবর্তন"
            items={products}
            loading={loading}
          />
        </>
      )}
    </>
  );
}
