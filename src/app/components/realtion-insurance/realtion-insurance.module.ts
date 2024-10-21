import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RealtionInsuranceRoutingModule } from './realtion-insurance-routing.module';
import { RealtionInsuranceComponent } from './realtion-insurance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RealtionInsuranceComponent
  ],
  imports: [
    CommonModule,
    RealtionInsuranceRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ], exports:[
    RealtionInsuranceComponent
  ]
})
export class RealtionInsuranceModule { }
