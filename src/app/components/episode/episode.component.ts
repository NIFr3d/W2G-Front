import { Component, OnInit } from '@angular/core';
import Player from 'video.js/dist/types/player';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { tap } from 'rxjs';
import { VideoService } from 'src/app/video.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import 'src/app/types/member';
declare var SubtitlesOctopus: any;
declare global {
  interface Window {
    octopusInstance: typeof SubtitlesOctopus;
  }
}
@Component({
  selector: 'app-episode',
  templateUrl: './episode.component.html',
  styleUrls: ['./episode.component.scss'],
})
export class EpisodeComponent {
  constructor(
    private videoService: VideoService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  serverIp: string = window.location.hostname;
  videoJsOptions = {
    autoplay: false,
    controls: true,
    sources: [],
    textTrackSettings: true,
    fluid: true,
  };
  player: Player | undefined;
  webSocket!: WebSocketSubject<any>;
  connectionError?: boolean;
  didSeek = false;
  serie: string = this.activatedRoute.snapshot.params['serie'];
  season: string =
    this.activatedRoute.snapshot.params['season'].length == 1
      ? '0' + this.activatedRoute.snapshot.params['season']
      : this.activatedRoute.snapshot.params['season'];
  episode: string =
    this.activatedRoute.snapshot.params['episode'].length == 1
      ? '0' + this.activatedRoute.snapshot.params['episode']
      : this.activatedRoute.snapshot.params['episode'];
  nextEpisode: Episode | undefined;
  private triggeredByServer = false;
  private lastSentTime = 0;
  private username = '';
  members: Member[] = [];
  subtitlesAvailable: string[] = [];
  selectedSubtitle: string | null = null;

  ngOnInit(): void {
    this.webSocket = webSocket(`ws://${this.serverIp}:8081`);
    this.webSocket
      .pipe(
        tap({
          next: (msg: any) => this.handleWsMessage(msg),
          error: (err) => {
            console.log(err);
            this.connectionError = true;
          },
          complete: () => {
            console.log('complete');
            this.connectionError = true;
          },
        })
      )
      .subscribe();

    this.videoService
      .getNextEpisode(this.serverIp, this.serie, this.season, this.episode)
      .subscribe((nextEpisode) => {
        this.nextEpisode = nextEpisode;
      });

    this.username = this.authService.getUsername();

    this.videoService
      .getAvailableSubtitles(
        this.serverIp,
        this.serie,
        this.season,
        this.episode
      )
      .subscribe((subtitles) => {
        this.subtitlesAvailable = subtitles;
        this.selectedSubtitle = this.subtitlesAvailable[0];

        this.chargeSubtitles();
      });
  }

  setPlayer(player: Player) {
    this.player = player;
    this.player.on('playing', () => {
      if (!this.player) return;
      if (this.triggeredByServer) {
        this.triggeredByServer = false;
        return;
      }
      this.webSocket.next(JSON.stringify({ event: 'play' }));
    });
    this.player.on('pause', () => {
      if (!this.player) return;
      if (this.triggeredByServer) {
        this.triggeredByServer = false;
        return;
      }
      this.webSocket.next(
        JSON.stringify({
          event: 'pause',
          currentTime: this.player.currentTime(),
        })
      );
    });
    this.player.on('seeked', () => {
      if (!this.player || this.didSeek) return;
      if (this.triggeredByServer) {
        this.triggeredByServer = false;
        return;
      }
      this.webSocket.next(
        JSON.stringify({
          event: 'setTime',
          currentTime: this.player.currentTime(),
        })
      );
    });
    this.player.on('waiting', () => {
      if (!this.player) return;
      this.webSocket.next(
        JSON.stringify({
          event: 'pause',
          currentTime: this.player.currentTime(),
        })
      );
    });
    this.player.on('loadedmetadata', () => {
      if (!this.player) return;
      const t = this.activatedRoute.snapshot.queryParamMap.get('t');
      if (t) this.player.currentTime(parseInt(t));
    });
    this.player.src({
      type: 'video/mp4',
      src: `http://${this.serverIp}:8080/episode/${this.serie}/${this.season}/${this.episode}`,
    });
    this.player.load();

    setInterval(() => {
      if (
        this.player &&
        this.player.currentTime() &&
        this.player.currentTime() !== this.lastSentTime
      ) {
        this.webSocket.next(
          JSON.stringify({
            event: 'updateResumeWatching',
            currentTime: this.player.currentTime(),
            serie: this.serie,
            season: this.season,
            episode: this.episode,
            username: this.username,
          })
        );
        this.lastSentTime = this.player.currentTime() || 0;
      }
    }, 1000);
  }

  chargeSubtitles(): void {
    if (!document.getElementById('videojs-player_html5_api')) {
      setTimeout(() => this.chargeSubtitles(), 1000);
      return;
    }
    console.log(this.selectedSubtitle);
    if (this.selectedSubtitle === null) {
      window.octopusInstance.dispose();
      return;
    } else {
      var options = {
        video: document.getElementById('videojs-player_html5_api'),
        subUrl: `http://${this.serverIp}:8080/subtitles/${this.serie}/${this.season}/${this.episode}/${this.selectedSubtitle}`,
        workerUrl: '/assets/js/subtitles-octopus-worker.js',
      };
      window.octopusInstance = new SubtitlesOctopus(options);
    }
  }

  handleWsMessage(msg: any) {
    this.connectionError = false;
    console.dir(msg);
    if (!this.player) return;
    switch (msg.event) {
      case 'welcome':
        console.log('Connected to server');
        this.webSocket.next(
          JSON.stringify({
            event: 'joinRoom',
            room: `${this.serie}/${this.season}/${this.episode}`,
            username: this.username,
          })
        );
        break;
      case 'joinedRoom':
        this.triggeredByServer = true;
        this.player.currentTime(msg.currentTime);
        msg.paused ? this.player.pause() : this.player.play();
        this.members = msg.members;
        break;
      case 'play':
        this.triggeredByServer = true;
        this.player.play();
        break;
      case 'pause':
        this.triggeredByServer = true;
        this.player.pause();
        this.player.currentTime(msg.currentTime);
        break;
      case 'setTime':
        if (this.didSeek) return;
        this.triggeredByServer = true;
        this.player.currentTime(msg.currentTime);
        this.didSeek = true;
        setTimeout(() => {
          this.didSeek = false;
        }, 500);
        break;
      case 'updateMembers':
        this.members = msg.members;
        break;
    }
  }
  goToNextEpisode() {
    let nextEpisodeUrl = `/serie/${this.serie}/${this.nextEpisode?.season}/${this.nextEpisode?.episode}`;
    window.location.href = nextEpisodeUrl;
  }

  convertTimeFormat(time: string) {
    const seconds = parseInt(time, 10);
    const minutes = Math.floor(seconds / 60);
    const formattedSeconds = seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60;
    const formattedMinutes = minutes % 60 < 10 ? `0${minutes}` : minutes;
    const formattedTime = `${formattedMinutes}:${formattedSeconds}`;
    return formattedTime;
  }
  ngOnDestroy() {
    this.webSocket.complete();
  }

}
