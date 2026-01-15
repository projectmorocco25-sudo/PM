import Link from "next/link";
import Image from "next/image";

export function AuthShell({
  backHref = "/",
  children,
}: {
  backHref?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <Link
            href={backHref}
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:underline"
          >
            ← Back
          </Link>
        </div>

        <div className="mt-10 flex flex-col items-center">
          <Image src="/next.svg" alt="MOH Logo" width={120} height={24} priority />
          <div className="mt-8 w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}

