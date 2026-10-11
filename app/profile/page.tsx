"use client";
import Link from "next/link";
import useGuard from "@/components/useGuard";
export default function Profile() {
  const { user, ready } = useGuard();
  if (!ready)
    return <div className="skeleton h-48 max-w-xl mx-auto rounded-xl" />;
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-3">আমার প্রোফাইল</h1>
      <div className="bg-white rounded-xl p-5 flex items-center gap-4">
        <img
          src={
            user.image ||
            `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.name)}`
          }
          alt=""
          className="w-16 h-16 rounded-full"
        />
        <div className="flex-1">
          <b>{user.name}</b>
          <p className="text-sm text-gray-500 break-all">{user.email}</p>
        </div>
        <Link
          href="/profile/update"
          className="btn btn-sm btn-outline border-red-300 text-red-600"
        >
          তথ্য আপডেট
        </Link>
      </div>
    </div>
  );
}
