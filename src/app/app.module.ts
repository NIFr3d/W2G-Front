import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { VjsPlayerComponent } from './components/vjs-player/vjs-player.component';
import { VideoPageComponent } from './components/video-page/video-page.component';

@NgModule({
  declarations: [
    AppComponent,
    VideoPageComponent,
    VjsPlayerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
