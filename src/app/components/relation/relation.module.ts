import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RelationRoutingModule } from './relation-routing.module';
import { RelationComponent } from './relation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RelationComponent
  ],
  imports: [
    CommonModule,
    RelationRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports:[
    RelationComponent
  ]
})
export class RelationModule { }
