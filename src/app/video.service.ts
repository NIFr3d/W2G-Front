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
}