import { Routes } from '@angular/router';
import { MapComponent } from './pages/map/map';

export const routes: Routes = [
  { path: '', redirectTo: 'map', pathMatch: 'full' },
  { path: 'map', component: MapComponent },
  { path: '**', redirectTo: 'map' },
];
