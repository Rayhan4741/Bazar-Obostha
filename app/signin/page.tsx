"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password"));
    if (password.length < 8)
      return toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");

    setBusy(true);
    try {
      const { error } = await authClient.signIn.email({ email, password });
      if (error) return toast.error(error.message || "ইমেইল বা পাসওয়ার্ড ভুল");
      toast.success("সাইন ইন সফল হয়েছে");
      router.push("/");
    } catch {
      toast.error("সার্ভারে সংযোগ হচ্ছে না, আবার চেষ্টা করুন");
    } finally {
      setBusy(false);
    }
  };

  const social = async (provider: "google" | "github") => {
    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
      if (error)
        toast.error(error.message || `${provider} লগইন এখনো সেট করা হয়নি`);
    } catch {
      toast.error("সার্ভারে সংযোগ হচ্ছে না, আবার চেষ্টা করুন");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-center mb-4">সাইন ইন</h1>

      <form onSubmit={submit} className="space-y-3">
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
          {busy ? "অপেক্ষা করুন..." : "সাইন ইন"}
        </button>
      </form>

      <div className="divider text-xs">অথবা</div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => social("google")}
          className="btn btn-sm sm:btn-md"
        >
          Google দিয়ে চালিয়ে যান
        </button>
        <button
          type="button"
          onClick={() => social("github")}
          className="btn btn-sm sm:btn-md"
        >
          GitHub দিয়ে চালিয়ে যান
        </button>
      </div>

      <p className="text-sm text-center mt-4">
        অ্যাকাউন্ট নেই?{" "}
        <Link className="text-green-700 font-semibold" href="/signup">
          সাইন আপ করুন
        </Link>
      </p>
    </div>
  );
}
