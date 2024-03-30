import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { VjsPlayerComponent } from './components/vjs-player/vjs-player.component';
import { VideoService } from './video.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { IndexComponent } from './components/index/index.component';
import { SerieComponent } from './components/serie/serie.component';
import { EpisodeComponent } from './components/episode/episode.component';
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    VjsPlayerComponent,
    IndexComponent,
    SerieComponent,
    EpisodeComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [VideoService, AuthService, CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
