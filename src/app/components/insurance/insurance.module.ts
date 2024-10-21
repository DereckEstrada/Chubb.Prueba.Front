import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsuranceRoutingModule } from './insurance-routing.module';
import { InsuranceComponent } from './insurance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    InsuranceComponent
  ],
  imports: [
    CommonModule,
    InsuranceRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports:[
    InsuranceComponent
  ]
})
export class InsuranceModule { }
