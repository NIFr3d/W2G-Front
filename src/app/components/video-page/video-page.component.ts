import { Component, OnInit } from '@angular/core';
import Player from "video.js/dist/types/player";
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { tap } from 'rxjs';
import { VideoService } from 'src/app/video.service';
declare var SubtitlesOctopus: any;
declare global {
  interface Window {
    octopusInstance: typeof SubtitlesOctopus;
  }
}

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
    sources: [],
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

  chargeSubtitles() {
    var options = {
      video: document.getElementById('videojs-player_html5_api'),

      subUrl: `http://${this.serverIp}:8080/subtitles/${this.videoUrl}`,
      workerUrl: "/assets/js/subtitles-octopus-worker.js"
    };
    window.octopusInstance = new SubtitlesOctopus(options);
  }
  deleteSubtitles(){
    if(window.octopusInstance) {
      window.octopusInstance.dispose();
      window.octopusInstance = undefined;
    }
  }
  
  changeVideo() {
    if(!this.player) return;
    let videourlsplit = this.videoUrl.split(".");
    let videoType = '';
    switch(videourlsplit[videourlsplit.length - 1]) {
      case 'mp4':
        this.deleteSubtitles();
        videoType = 'video/mp4';
        this.chargeSubtitles();
        break;
      case 'mkv':
        videoType = 'video/webm';
        this.deleteSubtitles();
        this.chargeSubtitles();
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
    if (!this.player) return;
    switch (msg.event) {
      case 'welcome':
        console.log('Connected to server');
        this.player.currentTime(msg.currentTime);
        msg.paused ? this.player.pause() : this.player.play();
        break;
      case 'play':
        this.player.play();
        break;
      case 'pause':
        this.player.pause();
        this.player.currentTime(msg.currentTime);
        break;
      case 'setTime':
        if (this.didSeek) return;
        this.player.currentTime(msg.currentTime);
        this.didSeek = true;
        setTimeout(() => {
          this.didSeek = false;
        }, 500);
        break;
    }
  } 


}
