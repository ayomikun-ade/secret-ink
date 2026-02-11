import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, LockKeyIcon } from "@hugeicons/core-free-icons";

export default async function AdminBoardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
        <HugeiconsIcon
          icon={LockKeyIcon}
          size={32}
          color="currentColor"
          strokeWidth={2}
          className="w-8 h-8 text-rose-600"
        />
      </div>
      <h1 className="font-serif text-3xl font-bold text-rose-950 mb-4">
        Admin Dashboard
      </h1>
      <p className="text-rose-700/90 mb-8 text-lg">
        This is a placeholder for the future admin dashboard for board:{" "}
        <span className="font-mono font-semibold">{slug}</span>
      </p>
      <Link
        href="/"
        className="text-rose-500 font-semibold hover:underline flex items-center justify-center gap-2"
      >
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          size={16}
          color="currentColor"
          strokeWidth={2}
          className="w-4 h-4"
        />{" "}
        Go Home
      </Link>
    </div>
  );
}
