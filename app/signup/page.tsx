"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name")).trim();
    const email = String(f.get("email"));
    const password = String(f.get("password"));
    if (!name) return toast.error("নাম লিখুন");
    if (password.length < 8)
      return toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");

    setBusy(true);
    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
      });
      if (error) {
        //console.error("signup error:", error);
        return toast.error(
          error.message || `অ্যাকাউন্ট তৈরি করা যায়নি (কোড ${error.status})`,
        );
      }
      await authClient.signOut();
      toast.success("অ্যাকাউন্ট তৈরি হয়েছে, এবার সাইন ইন করুন");
      router.push("/signin");
    } catch {
      //console.error("signup failed:", err);
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
      <h1 className="text-2xl font-bold text-center mb-4">
        অ্যাকাউন্ট তৈরি করুন
      </h1>

      <form onSubmit={submit} className="space-y-3">
        <input
          name="name"
          required
          placeholder="নাম"
          className="input w-full"
        />
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
          placeholder="পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)"
          className="input w-full"
        />
        <button
          disabled={busy}
          className="btn w-full bg-green-700 text-white border-0"
        >
          {busy ? "অপেক্ষা করুন..." : "অ্যাকাউন্ট তৈরি করুন"}
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
        আগে থেকেই অ্যাকাউন্ট আছে?{" "}
        <Link className="text-green-700 font-semibold" href="/signin">
          সাইন ইন করুন
        </Link>
      </p>
    </div>
  );
}
