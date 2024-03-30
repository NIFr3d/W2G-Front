import { Component, OnInit, inject } from '@angular/core';
import { VideoService } from '../../video.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-serie',
  templateUrl: './serie.component.html',
  styleUrls: ['./serie.component.scss'],
})
export class SerieComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);

  constructor(private videoService: VideoService) {}

  serverIp: string = window.location.hostname;

  serie = this.activatedRoute.snapshot.params['serie'];

  selectedSeason = '';

  seasons: string[] = [];

  episodes: string[] = [];

  ngOnInit() {
    this.videoService
      .getSeasons(this.serverIp, this.serie)
      .subscribe((seasons) => {
        seasons = seasons.map((season) => season.replace(/^(0)/, ''));
        this.seasons = seasons;
        this.selectedSeason = seasons[0];
        this.getEpisodes(this.selectedSeason);
      });
  }

  getEpisodes(season: string) {
    this.videoService
      .getEpisodes(this.serverIp, this.serie, season)
      .subscribe((episodes) => {
        episodes = episodes.map((episode) => episode.replace(/^(0)/, ''));
        this.episodes = episodes;
      });
  }
  updateEpisodes() {
    this.getEpisodes(this.selectedSeason);
  }
}
