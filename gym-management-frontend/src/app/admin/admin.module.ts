import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'; 

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminGuard } from '../guards/admin.guard';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard] }
    ])
  ],
  providers: [AdminGuard]
})
export class AdminModule { }
