import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import videojs from 'video.js';
import Player from "video.js/dist/types/player";

@Component({
  selector: 'app-vjs-player',
  template: `
    <video #target class="video-js" controls muted playsinline preload="none"></video>
  `,
  styleUrls: [
    './vjs-player.component.scss'
  ],
  encapsulation: ViewEncapsulation.None,
})

export class VjsPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('target', { static: true })
  target!: ElementRef;

  // See options: https://videojs.com/guides/options
  @Input()
  options!: {
    fluid?: boolean;
    controls?: boolean;
    aspectRatio?: string;
    autoplay?: boolean;
    sources: {
      src: string;
      type: string;
    }[];
  };

  @Output() sendPlayer = new EventEmitter<Player>();

  player!: Player;

  constructor(
    private elementRef: ElementRef,
  ) {}

  // Instantiate a Video.js player OnInit
  ngOnInit() {
    this.player = videojs(this.target.nativeElement, this.options, function onPlayerReady(this: any) {
      console.log('onPlayerReady', this);
    });
    this.sendPlayer.emit(this.player);
  }

  // Dispose the player OnDestroy
  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
}