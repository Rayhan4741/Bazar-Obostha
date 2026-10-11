"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
const SIGNUP = "in" === "up";
export default function Page() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")),
      password = String(f.get("password")),
      name = String(f.get("name"));
    if (password.length < 8)
      return toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
    setBusy(true);
    const { error } = SIGNUP
      ? await authClient.signUp.email({ name, email, password })
      : await authClient.signIn.email({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message || "কিছু একটা ভুল হয়েছে");
    if (SIGNUP) {
      await authClient.signOut();
      toast.success("অ্যাকাউন্ট তৈরি হয়েছে, এবার সাইন ইন করুন");
      router.push("/signin");
    } else {
      toast.success("সাইন ইন সফল হয়েছে");
      router.push("/");
    }
  };
  const social = (provider: "google" | "github") =>
    authClient.signIn.social({ provider, callbackURL: "/" });
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-center mb-4">
        {SIGNUP ? "অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন"}
      </h1>
      <form onSubmit={submit} className="space-y-3">
        {SIGNUP && (
          <input
            name="name"
            required
            placeholder="নাম"
            className="input w-full"
          />
        )}
        <input
          name="email"
          type="email"
          required
          placeholder="ইমেইল"
          className="input w-full"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="পাসওয়ার্ড"
          className="input w-full"
        />
        <button
          disabled={busy}
          className="btn w-full bg-green-700 text-white border-0"
        >
          {busy
            ? "অপেক্ষা করুন..."
            : SIGNUP
              ? "অ্যাকাউন্ট তৈরি করুন"
              : "সাইন ইন"}
        </button>
      </form>
      <div className="divider text-xs">অথবা</div>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => social("google")}
          className="btn btn-sm sm:btn-md"
        >
          Google দিয়ে চালিয়ে যান
        </button>
        <button
          onClick={() => social("github")}
          className="btn btn-sm sm:btn-md"
        >
          GitHub দিয়ে চালিয়ে যান
        </button>
      </div>
      <p className="text-sm text-center mt-4">
        {SIGNUP ? "আগে থেকেই অ্যাকাউন্ট আছে?" : "অ্যাকাউন্ট নেই?"}{" "}
        <Link
          className="text-green-700 font-semibold"
          href={SIGNUP ? "/signin" : "/signup"}
        >
          {SIGNUP ? "সাইন ইন করুন" : "সাইন আপ করুন"}
        </Link>
      </p>
    </div>
  );
}
