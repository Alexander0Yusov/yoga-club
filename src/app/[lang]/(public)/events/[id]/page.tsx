export default function EventDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-semibold text-[#81453e]">Event Details</h1>
      <p className="mt-4 text-[#497274]">
        Content-only placeholder for event <span className="font-semibold">{params.id}</span>.
      </p>
    </main>
  );
}
