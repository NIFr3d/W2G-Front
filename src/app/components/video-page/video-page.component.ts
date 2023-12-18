import { Component, OnInit } from '@angular/core';
import videojs from 'video.js';
import Player from "video.js/dist/types/player";


@Component({
  selector: 'app-video-page',
  templateUrl: './video-page.component.html',
  styleUrls: ['./video-page.component.scss']
})
export class VideoPageComponent{
  videoJsOptions = {
    autoplay: false,
    controls: true,
    sources: [{
      src: 'videos/Bakemonogatari_Episode_1_VF_BD.mp4',
      type: 'video/mp4'
    }]
  };
  player : Player | undefined;

  setPlayer(player: Player) {
    this.player = player;
    console.log('Player: ', player);
  }

  playPause() {
    if (this.player) {
      if (this.player.paused()) {
        this.player.play();
      } else {
        this.player.pause();
      }
    }
  }
  

}
