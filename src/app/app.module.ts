import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { VjsPlayerComponent } from './components/vjs-player/vjs-player.component';
import { VideoPageComponent } from './components/video-page/video-page.component';
import { VideoService } from './video.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { IndexComponent } from './index/index.component';
import { SerieComponent } from './serie/serie.component';
import { EpisodeComponent } from './episode/episode.component';


@NgModule({
  declarations: [
    AppComponent,
    VideoPageComponent,
    VjsPlayerComponent,
    IndexComponent,
    SerieComponent,
    EpisodeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [VideoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
