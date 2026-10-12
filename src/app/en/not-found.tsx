import Link from "next/link";

export default function EnglishNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-28 text-center sm:px-6">
      <h1 className="text-5xl text-navy">Page not found</h1>
      <p className="mt-4 text-muted-foreground">
        The page you were looking for does not exist or has moved.
      </p>
      <Link
        href="/en"
        className="mt-8 inline-flex h-11 items-center rounded-md bg-navy px-6 font-semibold text-white hover:bg-navy-light"
      >
        Go to the home page
      </Link>
    </div>
  );
}
