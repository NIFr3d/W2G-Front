import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { SerieComponent } from './components/serie/serie.component';
import { EpisodeComponent } from './components/episode/episode.component';

const routes: Routes = [
  {
    path: '',
    // component: VideoPageComponent
    redirectTo: '/index',
    pathMatch: 'full',
  },
  {
    path: 'index',
    component: IndexComponent,
  },
  {
    path: 'serie/:serie',
    component: SerieComponent,
  },
  {
    path: 'serie/:serie/:season/:episode',
    component: EpisodeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
