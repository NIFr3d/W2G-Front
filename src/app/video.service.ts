import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'src/app/types/episode';
import 'src/app/types/resumewatching';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  constructor(private http: HttpClient) {}

  getVideos(serverIp: string): Observable<string[]> {
    return this.http.get<string[]>(`http://${serverIp}:8080/videos`);
  }

  getSeries(serverIp: string): Observable<string[]> {
    return this.http.get<string[]>(`http://${serverIp}:8080/series`);
  }

  getSeasons(serverIp: string, serie: string): Observable<string[]> {
    return this.http.get<string[]>(
      `http://${serverIp}:8080/series/${serie}/seasons`
    );
  }

  getEpisodes(
    serverIp: string,
    serie: string,
    season: string
  ): Observable<string[]> {
    return this.http.get<string[]>(
      `http://${serverIp}:8080/series/${serie}/${season}/episodes`
    );
  }

  getOtherSeries(serverIp: string): Observable<string[]> {
    return this.http.get<string[]>(`http://${serverIp}:8080/otherSeries`);
  }

  searchSeries(serverIp: string, search: string): Observable<string[]> {
    return this.http.get<string[]>(`http://${serverIp}:8080/search/${search}`);
  }

  getNextEpisode(
    serverIp: string,
    serie: string,
    season: string,
    episode: string
  ): Observable<Episode> {
    return this.http.get<Episode>(
      `http://${serverIp}:8080/nextEpisode/${serie}/${season}/${episode}`
    );
  }

  getResumeWatching(
    serverIp: string,
    username: String
  ): Observable<resumeWatching[]> {
    return this.http.get<resumeWatching[]>(
      `http://${serverIp}:8080/resumeWatching/${username}`
    );
  }

  getAvailableSubtitles(
    serverIp: string,
    serie: string,
    season: string,
    episode: string
  ): Observable<string[]> {
    return this.http.get<string[]>(
      `http://${serverIp}:8080/subtitles/${serie}/${season}/${episode}`
    );
  }
}
