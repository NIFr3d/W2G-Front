export type Serie = {
  id: number;
  title: string;
  description: string;
};

export type Season = {
  id: number;
  number: number;
};

export type Video = {
  id: number;
  episode: number;
  url: string;
  season: Season;
};
