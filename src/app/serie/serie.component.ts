import { Component, OnInit, inject } from '@angular/core';
import { VideoService } from '../video.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-serie',
  templateUrl: './serie.component.html',
  styleUrls: ['./serie.component.scss']
})
export class SerieComponent implements OnInit{

  private activatedRoute = inject(ActivatedRoute);

  constructor(videoService: VideoService) { }

  serverIp : string = window.location.hostname;

  serie =  this.activatedRoute.snapshot.params['serie'];
  
  ngOnInit() {

  }

}
