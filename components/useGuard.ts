"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
export default function useGuard() {
  const { data, isPending } = useSession(); const router = useRouter();
  useEffect(() => { if (!isPending && !data) { toast.error("এই পাতা দেখতে আগে সাইন ইন করুন"); router.replace("/signin"); } }, [isPending, data, router]);
  return { user: data?.user, ready: !isPending && !!data };
}
