import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

import { AcountSettingsComponent } from './acount-settings/acount-settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { PagesComponent } from './pages.component';
import { ProgressComponent } from './progress/progress.component';

const routes: Routes = [
  { path:'dashboard', component: PagesComponent,
    canActivate:[AuthGuard],/* Protegemos nuestras RUTAS con el GUARD */
    children:[
      {path:'', component: DashboardComponent, data:{titulo:'Dashboard x'}},
      {path:'progress',component: ProgressComponent, data:{titulo:'ProgressBar'}},
      {path:'graficas1', component: Grafica1Component, data:{titulo:'Graficas #1'}},
      {path:'account-settings', component: AcountSettingsComponent, data:{titulo:'Ajustes de cuenta'}}
    ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
