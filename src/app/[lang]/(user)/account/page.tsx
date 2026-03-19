import Link from "next/link";

export default function AccountPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-semibold text-[#81453e]">User Dashboard</h1>
      <p className="mt-4 text-[#497274]">
        General info, bookings, and reviews stay in one flat account surface for this phase.
      </p>

      <nav className="mt-8 flex flex-wrap gap-3">
        <Link href="?tab=general" className="rounded-full border border-[#81453e] px-4 py-2 text-sm text-[#81453e]">
          General Info
        </Link>
        <Link href="?tab=bookings" className="rounded-full border border-[#81453e] px-4 py-2 text-sm text-[#81453e]">
          My Bookings
        </Link>
        <Link href="?tab=reviews" className="rounded-full border border-[#81453e] px-4 py-2 text-sm text-[#81453e]">
          My Reviews
        </Link>
      </nav>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <article className="rounded-[24px] border border-[#dfbeaf] bg-white p-6">
          <h2 className="text-2xl font-semibold text-[#81453e]">Global Bookings</h2>
          <p className="mt-3 text-sm leading-6 text-[#4f2a26]">
            Booking history will remain a global module and will not be tied to a specific event entity yet.
          </p>
        </article>
        <article className="rounded-[24px] border border-[#dfbeaf] bg-[#faf7f4] p-6">
          <h2 className="text-2xl font-semibold text-[#81453e]">Feedback / Reviews</h2>
          <p className="mt-3 text-sm leading-6 text-[#4f2a26]">
            Review history stays visible here as an independent account module for guests and authenticated users.
          </p>
        </article>
      </section>
    </main>
  );
}
