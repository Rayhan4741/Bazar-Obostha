"use client";
import { use, useState } from "react";
import { useApi, type Category as Cat } from "@/lib/utils";
import { Grid, GridSkeleton, NotFoundBox } from "@/components/ProductCard";
export default function Category({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data, loading } = useApi(`/products?category=${slug}`);
  const { data: cats } = useApi<Cat>("/categories");
  const [sort, setSort] = useState("default");
  const items = (data || []).filter((p) => p.category === slug);
  const sorted = [...items].sort((a, b) =>
    sort === "asc"
      ? a.today - b.today
      : sort === "desc"
        ? b.today - a.today
        : a.id - b.id,
  );
  const cat =
    (cats || []).find((c) => c.slug === slug) ||
    (items[0] && {
      icon: items[0].categoryIcon,
      nameBn: items[0].categoryNameBn,
    });
  if (!loading && !items.length)
    return <NotFoundBox msg="এই ক্যাটাগরিতে কোনো পণ্য নেই।" />;
  return (
    <>
      <div className="bg-white rounded-xl p-4 flex items-center gap-3 mb-4">
        <span className="text-3xl">{cat?.icon}</span>
        <div>
          <h1 className="text-xl font-bold">{cat?.nameBn || "..."}</h1>
          <p className="text-sm text-gray-500">
            {loading ? "" : `${items.length.toLocaleString("bn-BD")}টি পণ্য`}
          </p>
        </div>
      </div>
      <div className="flex justify-end items-center gap-2 mb-3 text-sm">
        <label htmlFor="s">সাজান:</label>
        <select
          id="s"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="select select-sm w-auto"
        >
          <option value="default">ডিফল্ট</option>
          <option value="asc">দাম: কম থেকে বেশি</option>
          <option value="desc">দাম: বেশি থেকে কম</option>
        </select>
      </div>
      {loading ? <GridSkeleton /> : <Grid items={sorted} />}
    </>
  );
}
