import { Component, OnInit } from '@angular/core';
import { VideoService } from '../video.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit{

  constructor(private videoService: VideoService) { }

  serverIp : string = window.location.hostname;

  otherSeries: string[] = [];

  isSearching = false;

  searchResults: string[] = [];

  search = "";

  ngOnInit() {
    this.videoService.getOtherSeries(this.serverIp).subscribe(series => {
      this.otherSeries = series;
    });
  }

  searchSeries() {
    if(this.search.length > 2) {
        this.isSearching = true;
        this.videoService.searchSeries(this.serverIp, this.search).subscribe(series => {
          this.searchResults = series;
        });
    } else {
      this.isSearching = false;
      this.searchResults = [];
    }
    
  }
}
