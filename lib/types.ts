export type Serie = {
  id: number;
  title: string;
  description: string;
};

export type Season = {
  id: number;
  number: number;
  serie: Serie;
};

export type Video = {
  id: number;
  episode: number;
  description: string;
  filename: string;
  season: Season;
};

export type WatchHistory = {
  id: number;
  video: Video;
  watchTime: number;
};

export type ConversionTask = {
  taskId: string;
  status: string;
  episodeNumber: number;
  season: number;
  serie: string;
  progress: number;
};

export type User = {
  id?: number;
  username: string;
  role: string;
  password: string;
};

export type Viewer = {
  id: number;
  username: string;
  watchTime: string;
};
