export type DemoVideoItem = {
  title: string;
  url: string;
  description: string;
};

export const demoVideos: DemoVideoItem[] = [
  {
    title: "Демо заняття 1",
    url: "https://www.youtube.com/watch?v=a3uNHHLe06E",
    description: "Короткий демонстраційний відео-ролик для перевірки макета та подачі.",
  },
  {
    title: "Демо заняття 2",
    url: "https://www.youtube.com/watch?v=CfvceanvDk8",
    description: "Короткий демонстраційний відео-ролик для перевірки макета та подачі.",
  },
  {
    title: "Демо заняття 3",
    url: "https://www.youtube.com/watch?v=gJoUCdGqYSY",
    description: "Короткий демонстраційний відео-ролик для перевірки макета та подачі.",
  },
  {
    title: "Демо заняття 4",
    url: "https://www.youtube.com/watch?v=xtbLzPGnGNE",
    description: "Короткий демонстраційний відео-ролик для перевірки макета та подачі.",
  },
  {
    title: "Демо заняття 5",
    url: "https://www.youtube.com/watch?v=Vkw1eELgieU",
    description: "Короткий демонстраційний відео-ролик для перевірки макета та подачі.",
  },
];

export const getVideoId = (url: string) => url.split("v=")[1] || url;
