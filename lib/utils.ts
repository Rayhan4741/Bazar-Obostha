"use client";
import { useEffect, useState } from "react";
export const API = process.env.NEXT_PUBLIC_API || "https://openapi.programming-hero.com/api/bazardor";
export type Change = { dir: "up" | "down" | "flat"; pct: number };
export type Market = { market: string; division: string; min: number; max: number };
export type Product = { id: number; slug: string; nameBn: string; category: string; categoryNameBn: string; categoryIcon: string; unit: string; image: string; today: number; yesterday: number; lastWeek: number; lastMonth: number; change?: Change; markets?: Market[] };
export type Category = { id: number; slug: string; nameBn: string; icon: string };
export const bn = (n: number) => Number(n).toLocaleString("bn-BD");
export const bnPct = (n: number) => Number(n).toLocaleString("bn-BD", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
export const UNITS: Record<string, string> = { kg: "কেজি", litre: "লিটার", liter: "লিটার", l: "লিটার", dozen: "ডজন", piece: "পিস", pcs: "পিস", hali: "হালি" };
export const UNITS_MAP: Record<string, string> = UNITS;
export const unitBn = (u: string) => "প্রতি " + (UNITS[String(u).toLowerCase()] || u);
export const todayBn = () => new Date().toLocaleDateString("bn-BD", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const list = (j: any): any[] => (Array.isArray(j) ? j : j?.data ?? j?.products ?? j?.categories ?? []);
export function useApi<T = Product>(path: string) {
  const [state, set] = useState<{ data: T[] | null; loading: boolean; error: boolean }>({ data: null, loading: true, error: false });
  useEffect(() => {
    let off = false;
    fetch(API + path).then((r) => r.json()).then((j) => !off && set({ data: list(j), loading: false, error: false }))
      .catch(() => !off && set({ data: [], loading: false, error: true }));
    return () => { off = true; };
  }, [path]);
  return state;
}
