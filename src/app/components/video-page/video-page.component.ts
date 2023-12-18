import { Component, OnInit } from '@angular/core';
import Player from "video.js/dist/types/player";
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { tap } from 'rxjs';



@Component({
  selector: 'app-video-page',
  templateUrl: './video-page.component.html',
  styleUrls: ['./video-page.component.scss']
})
export class VideoPageComponent implements OnInit{
  videoJsOptions = {
    autoplay: false,
    controls: true,
    sources: [{
      src: 'videos/Bakemonogatari_Episode_1_VF_BD.mp4',
      type: 'video/mp4'
    }]
  };
  player : Player | undefined;
  webSocket! : WebSocketSubject<any>;

  ngOnInit(): void {
    this.webSocket = webSocket('ws://localhost:8081');
    this.webSocket.pipe(
      tap({
        next: (msg : any) => this.handleWsMessage(msg),
        error: (err) => console.log(err),
        complete: () => console.log('complete')
      })
    ).subscribe();
  }
  setPlayer(player: Player) {
    this.player = player;
    this.player.on('play', () => {
      console.log('play');
      this.webSocket.next(JSON.stringify({event: 'play'}));
    });
    this.player.on('pause', () => {
      console.log('pause');
      this.webSocket.next(JSON.stringify({event: 'pause'}));
    });
  }
  

  handleWsMessage(msg: any) {
    console.dir(msg);
    if(!this.player) return;
    switch(msg.event) {
      case 'welcome':
        console.log('Connected to server');
        this.player.currentTime(msg.time);
        msg.paused? this.player.pause() : this.player.play();
        break;
      case 'play':
        this.player.play();
        break;
      case 'pause':
        this.player.pause();
        break;
      case 'setTime':
        this.player?.currentTime(msg.time);
        break;
    }
  }
  

}
interface WsMessage {
  event: string;
}