// import Image from "next/image";
import Container from "@/components/0_ui/Container/Container";
import ButtonCreateEvent from "@/components/ButtonCreateEvent/ButtonCreateEvent";
import SwiperEvent from "@/components/SwiperEvent/SwiperEvent";
import React from "react";

const EventPage = async ({ params: { id } }: { params: { id: string } }) => {
  const fetchEvent = await import("../../../api/event/route");

  const { timeTarget, title, description, picsArray, createdAt } = await (
    await fetchEvent.GET(id as any)
  ).json();

  const arrayWithoutIds: any = picsArray?.map(
    ({ _id, value }: { _id: string; value: string }) => ({ id: _id, value })
  );

  return (
    <Container className="">
      <ButtonCreateEvent
        idEvent={id}
        timeTarget={timeTarget}
        title={title}
        description={description}
        picsArray={arrayWithoutIds}
      />

      <h1 className="text-center">{title}</h1>

      <p className="text-center">{createdAt}</p>

      {/* <div className="relative w-[320px] h-[280px] mx-auto"> */}
      {/* <Image
          src={picsArray[0]?.value as string}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw"
          style={{ objectFit: "cover" }}
          alt={title}
        /> */}
      <SwiperEvent pictures={arrayWithoutIds} />
      {/* </div> */}
      <p>{description}</p>
    </Container>
  );
};

export default EventPage;
