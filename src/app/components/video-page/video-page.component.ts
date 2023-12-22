import { Component, OnInit } from '@angular/core';
import Player from "video.js/dist/types/player";
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { tap } from 'rxjs';
import { VideoService } from 'src/app/video.service';
import videojs from 'video.js';



@Component({
  selector: 'app-video-page',
  templateUrl: './video-page.component.html',
  styleUrls: ['./video-page.component.scss']
})
export class VideoPageComponent implements OnInit{

  constructor(private videoService: VideoService) { }
  serverIp : string = window.location.hostname;
  videoJsOptions = {
    autoplay: false,
    controls: true,
    sources: [{
      src: 'videos/Bakemonogatari_Episode_1_VF_BD.mp4',
      type: 'video/mp4'
    }],
    textTrackSettings: true
  };
  player : Player | undefined;
  webSocket! : WebSocketSubject<any>;
  connectionError? : boolean;
  videos: string[] = [];
  videoUrl = "";

  didSeek = false;

  
  ngOnInit(): void {
    this.videoService.getVideos(this.serverIp).subscribe(videos => {
      this.videos = videos;
    });
    this.webSocket = webSocket(`ws://${this.serverIp}:8081`);
    this.webSocket.pipe(
      tap({
        next: (msg : any) => this.handleWsMessage(msg),
        error: (err) => {
          console.log(err)
          this.connectionError = true;
        },
        complete: () => {
          console.log('complete');
          this.connectionError = true;
        }
      })
    ).subscribe();
  }

  setPlayer(player: Player) {
    this.player = player;
    this.player.on('play', () => {
      if(!this.player) return;
      this.webSocket.next(JSON.stringify({event: 'play'}));
    });
    this.player.on('pause', () => {
      if(!this.player) return;
      this.webSocket.next(JSON.stringify({event: 'pause', currentTime: this.player.currentTime()}));
    });
    this.player.on('seeked', () => {
      if(!this.player || this.didSeek) return;
      this.webSocket.next(JSON.stringify({event: 'setTime', currentTime: this.player.currentTime()}));
    });
    this.player.on('waiting', () => {
      if(!this.player) return;
      this.webSocket.next(JSON.stringify({event: 'pause', currentTime: this.player.currentTime()}));
    });
  }
  
  changeVideo() {
    if(!this.player) return;
    let videourlsplit = this.videoUrl.split(".");
    let videoType = '';
    switch(videourlsplit[videourlsplit.length - 1]) {
      case 'mp4':
        videoType = 'video/mp4';
        break;
      case 'mkv':
        videoType = 'video/webm';
        break;
      case 'avi':
        videoType = 'video/x-msvideo';
        break;
      case 'webm':
        videoType = 'video/webm';
        break;
      default:
        videoType = 'video/mp4';
        break;
    }
    this.player.src({ type: videoType, src: `http://${this.serverIp}:8080/videos/${this.videoUrl}` });
    this.player.load();

  }

  handleWsMessage(msg: any) {
    this.connectionError = false;
    console.dir(msg);
    if(!this.player) return;
    switch(msg.event) {
      case 'welcome':
        console.log('Connected to server');
        this.player.currentTime(msg.currentTime);
        msg.paused? this.player.pause() : this.player.play();
        break;
      case 'play':
        this.player.play();
        break;
      case 'pause':
        this.player.pause();
        this.player.currentTime(msg.currentTime);
        break;
      case 'setTime':
        this.player.currentTime(msg.currentTime);
        this.didSeek = true;
        setTimeout(() => { this.didSeek = false; }, 300);
        break;
    }
  } 

}
