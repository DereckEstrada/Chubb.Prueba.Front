import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer.component';
import { RegisterCostumerComponent } from './register-costumer/register-costumer.component';

const routes: Routes = [
  {path:"", component:CustomerComponent},
  {path:"RegisterCustomer", component:RegisterCostumerComponent},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
