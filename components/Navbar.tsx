"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useApi, todayBn, type Category } from "@/lib/utils";
import { authClient, useSession } from "@/lib/auth-client";
export default function Navbar() {
  const path = usePathname(),
    router = useRouter();
  const { data: cats } = useApi<Category>("/categories");
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const link = (href: string, label: string, active: boolean) => (
    <Link
      key={href}
      href={href}
      className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${active ? "bg-green-700 text-white" : "hover:bg-green-50"}`}
    >
      {label}
    </Link>
  );
  const signOut = async () => {
    await authClient.signOut();
    toast.success("সাইন আউট হয়েছে");
    router.push("/");
  };
  return (
    <header className="bg-white border-b border-green-100">
      <div className="max-w-6xl mx-auto px-4 pt-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-lg bg-green-700 grid place-items-center text-lg">
            🛒
          </span>
          <span>
            <b className="block leading-tight">বাজার দর</b>
            <small className="text-[11px] text-gray-500">{todayBn()}</small>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="skeleton h-8 w-28" />
          ) : user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="flex items-center gap-2 cursor-pointer"
              >
                <img
                  src={
                    user.image ||
                    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.name)}`
                  }
                  alt=""
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm hidden sm:block">{user.name}</span>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-white rounded-box shadow w-56 p-2 z-20 text-sm"
              >
                <li className="px-3 py-1 font-semibold">{user.name}</li>
                <li className="px-3 pb-2 text-xs text-gray-500 break-all">
                  {user.email}
                </li>
                <li>
                  <Link href="/profile">আমার প্রোফাইল</Link>
                </li>
                <li>
                  <button onClick={signOut} className="text-red-600">
                    সাইন আউট
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link href="/signin" className="btn btn-sm sm:btn-md btn-ghost">
                সাইন ইন
              </Link>
              <Link
                href="/signup"
                className="btn btn-sm sm:btn-md bg-green-700 text-white border-0"
              >
                সাইন আপ
              </Link>
            </>
          )}
        </div>
      </div>
      <nav className="max-w-6xl mx-auto px-4 py-2 flex gap-1 overflow-x-auto">
        {link("/", "🏠 হোম", path === "/")}
        {(cats || []).map((c) =>
          link(
            `/category/${c.slug}`,
            `${c.icon} ${c.nameBn}`,
            path === `/category/${c.slug}`,
          ),
        )}
      </nav>
    </header>
  );
}
