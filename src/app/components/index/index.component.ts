import { Component, OnInit } from '@angular/core';
import { VideoService } from '../../video.service';
import 'src/app/types/resumewatching';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  constructor(
    private videoService: VideoService,
    private authService: AuthService
  ) {}

  serverIp: string = window.location.hostname;

  otherSeries: string[] = [];

  resumeWatching: resumeWatching[] = [];

  isSearching = false;

  searchResults: string[] = [];

  search = '';

  isLoggedIn = false;

  username = '';

  ngOnInit() {
    this.videoService.getOtherSeries(this.serverIp).subscribe((series) => {
      this.otherSeries = series;
    });
    this.videoService
      .getResumeWatching(this.serverIp, this.authService.getUsername())
      .subscribe((resumeWatching) => {
        this.resumeWatching = resumeWatching;
      });
    this.isLoggedIn = this.authService.isLoggedIn();
    this.username = this.authService.getUsername();
  }

  searchSeries() {
    if (this.search.length > 2) {
      this.isSearching = true;
      this.videoService
        .searchSeries(this.serverIp, this.search)
        .subscribe((series) => {
          this.searchResults = series;
        });
    } else {
      this.isSearching = false;
      this.searchResults = [];
    }
  }
  onLogin() {
    this.authService.login(this.username);
    this.isLoggedIn = true;
    window.location.reload();
  }
}
