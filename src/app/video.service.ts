import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  constructor(private http: HttpClient) { }

  getVideos(serverIp : string): Observable<string[]> {
    return this.http.get<string[]>(`http://${serverIp}:8080/videos`);
  }

  getSeries(serverIp : string): Observable<string[]> {
    return this.http.get<string[]>(`http://${serverIp}:8080/series`);
  }

  getSeasons(serverIp : string, serie : string): Observable<string[]> {
    return this.http.get<string[]>(`http://${serverIp}:8080/series/${serie}/seasons`);
  }
  
  getEpisodes(serverIp : string, serie : string, season : string): Observable<string[]> {
    return this.http.get<string[]>(`http://${serverIp}:8080/series/${serie}/${season}/episodes`);
  }

  getOtherSeries(serverIp : string): Observable<string[]> {
    return this.http.get<string[]>(`http://${serverIp}:8080/otherSeries`);
  }

  searchSeries(serverIp : string, search : string): Observable<string[]> {
    return this.http.get<string[]>(`http://${serverIp}:8080/search/${search}`);
  }

}