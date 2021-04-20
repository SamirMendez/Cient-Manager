import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { StatusPipe } from './pipes/status/status.pipe';



@NgModule({
  declarations: [
    StatusPipe
  ],
  imports: [
    CommonModule,
    AuthenticationModule
  ]
})
export class CoreModule { }
