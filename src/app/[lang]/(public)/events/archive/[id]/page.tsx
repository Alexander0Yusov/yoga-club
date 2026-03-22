import { redirect } from "next/navigation";

const ArchiveEventPage = ({ params }: { params: { lang: string; id: string } }) => {
  redirect(`/${params.lang}/events/${params.id}`);
};

export default ArchiveEventPage;
