import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RelationComponent } from './relation.component';

const routes: Routes = [
  {path:"", component:RelationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RelationRoutingModule { }
