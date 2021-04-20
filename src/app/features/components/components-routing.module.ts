import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from 'src/app/core/guards/authentication/authentication.guard';

const routes: Routes = [
  { path: 'dashboard', loadChildren: () => import('./private/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthenticationGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
