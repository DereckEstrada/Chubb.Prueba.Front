import { Component, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { RequestInterface } from '../../Interfaces/request.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RelationService } from '../../services/relation.service';
import { RelationInsuranceModel } from '../../Models/relation.insurance';

@Component({
  selector: 'app-realtion-insurance',
  templateUrl: './realtion-insurance.component.html',
  styleUrl: './realtion-insurance.component.css'
})
export class RealtionInsuranceComponent {
  private _services=inject(RelationService);
  private _formBuilder=inject(FormBuilder);
  relationList:RelationInsuranceModel[]=[];
  form!:FormGroup;
  screenWidth: number=0;
  constructor(){
    this.screenWidth = window.innerWidth
    this.initForm();
  }
  ngOnInit(): void {
    
  }
  initForm(){
    this.form=this._formBuilder.group(
      { 
        code:["", [Validators.required, Validators.pattern('^[0-9]+$')]]
      }
    )
  }

  getInvalid(argument:string){
    return this.form.get(argument)?.invalid && this.form.get(argument)?.touched;
  }
  buscarByCedula(){
    if(this.form.invalid){
      Swal.fire({
        icon: "error",
        title: "Oops...\nCampo invalido",

        showConfirmButton: false,
        timer: 1500
      }) 
      return;
    }
    let buscar=this.form.get('code')?.value;
    Swal.fire({
      icon:'info',
      title:'Cargando respuestas',
      showConfirmButton: false,
      allowOutsideClick:false,
      allowEscapeKey:false,
    })
    Swal.showLoading()
    this._services.RelationGetCustomerForCodeInsurance(this.generateRequest(buscar)).subscribe({
  
      next:resp=> {
        debugger
        if(resp.code=='200'){
          console.log(resp.data)
          this.relationList=resp.data
          console.log(this.relationList)
          Swal.close();
        }
          else if(resp.code=='201'){
            Swal.fire({
              icon: "success",
              title: "La peticion no devolvio respuesta",
              showConfirmButton: false,
              timer: 1500
            })
          }
          else{
            Swal.fire({
              icon: "error",
              title: "Oops...\nHa ocurrido un error",
              showConfirmButton: false,
              timer: 1500
            }) 
          }
        },
        error:err=>{
          Swal.fire({
            icon: "error",
            title: "Oops...\nHa ocurrido un error",
            showConfirmButton: false,
            timer: 1500
          }) 
        }
      })
  }
  generateRequest(data:any){
    let request: RequestInterface={
      Ip:"0.0.0",
      UserId:"1",
      Data:data
    }
    return request
  }
 
}
