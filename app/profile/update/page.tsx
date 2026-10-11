"use client";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useGuard from "@/components/useGuard";
import { authClient } from "@/lib/auth-client";
export default function Update() {
  const { user, ready } = useGuard();
  const router = useRouter();
  if (!ready || !user)
    return <div className="skeleton h-48 max-w-xl mx-auto rounded-xl" />;
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = String(new FormData(e.currentTarget).get("name")).trim();
    if (!name) return toast.error("নাম খালি রাখা যাবে না");
    const { error } = await authClient.updateUser({ name });
    if (error) return toast.error(error.message || "আপডেট হয়নি");
    toast.success("তথ্য আপডেট হয়েছে");
    router.push("/profile");
  };
  return (
    <form
      onSubmit={submit}
      className="max-w-xl mx-auto bg-white rounded-xl p-5 space-y-3"
    >
      <h1 className="text-xl font-bold">তথ্য আপডেট করুন</h1>
      <input
        name="name"
        defaultValue={user.name}
        placeholder="নাম"
        className="input w-full"
        required
      />
      <button className="btn w-full bg-green-700 text-white border-0">
        তথ্য আপডেট করুন
      </button>
    </form>
  );
}
