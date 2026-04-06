"use client";

import Image from "next/image";
import { useState } from "react";

import Container from "@/shared/ui/Container/Container";
import { ModalWindow } from "@/shared/ui/ModalWindow/ModalWindow";

import { demoVideos, getVideoId } from "../model/demo-videos";

const DemoVideosGallery = () => {
  const [modalState, setModalState] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("");

  return (
    <Container className="space-y-5 py-10">
      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {demoVideos.map((item) => {
          const videoId = getVideoId(item.url);

          return (
            <li key={item.url}>
              <button
                type="button"
                className="flex h-full w-full flex-col overflow-hidden border border-[#dfbeaf] bg-white text-left transition-transform hover:-translate-y-0.5"
                onClick={() => {
                  setCurrentVideo(videoId);
                  setModalState(true);
                }}
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-white">
                  <Image
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#497274]">
                    Demo video
                  </p>
                  <h3 className="text-lg font-semibold text-[#81453e]">
                    {item.title}
                  </h3>
                  <p className="line-clamp-3 text-sm leading-6 text-[#4f2a26]">
                    {item.description}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <ModalWindow onModalClose={() => setModalState(false)} showModal={modalState}>
        <iframe
          className="h-[600px] w-full"
          src={`https://www.youtube.com/embed/${currentVideo}`}
          title="Demo video"
          allowFullScreen
        />
      </ModalWindow>
    </Container>
  );
};

export default DemoVideosGallery;
