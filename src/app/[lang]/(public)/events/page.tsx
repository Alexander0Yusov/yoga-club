import { redirect } from "next/navigation";

const EventsPage = ({ params }: { params: { lang: string } }) => {
  redirect(`/${params.lang}/events/upcoming`);
};

export default EventsPage;
