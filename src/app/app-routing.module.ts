import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:"", redirectTo:"Relation", pathMatch:"full"},
  {path:"Relation", loadChildren:()=>import("./components/relation/relation.module").then(m=>m.RelationModule)},
  {path:"Customer", loadChildren:()=>import("./components/customer/customer.module").then(m=>m.CustomerModule)},
  {path:"Insurance", loadChildren:()=>import("./components/insurance/insurance.module").then(m=>m.InsuranceModule)},
  {path:"RelationInsurance", loadChildren:()=>import("./components/realtion-insurance/realtion-insurance.module").then(m=>m.RealtionInsuranceModule)},
  {path:"**", redirectTo:"Relation", pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
