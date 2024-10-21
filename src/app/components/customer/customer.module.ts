import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RegisterCostumerComponent } from './register-costumer/register-costumer.component';


@NgModule({
  declarations: [
    CustomerComponent,
    RegisterCostumerComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ], 
  exports:[
    CustomerComponent,
    RegisterCostumerComponent
  ]
})
export class CustomerModule { }
