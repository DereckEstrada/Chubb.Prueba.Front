import { Component, inject, OnInit } from '@angular/core';
import { InsuranceModel } from '../../Models/insurance.model';
import { InsuranceService } from '../../services/insurance.service';
import Swal from 'sweetalert2';
import { RequestInterface } from '../../Interfaces/request.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrl: './insurance.component.css'
})
export class InsuranceComponent implements OnInit {
  private _services=inject(InsuranceService);
  private _formBuilder=inject(FormBuilder);
  insuranceList:InsuranceModel[]=[];
  form!:FormGroup;
  formCreate!:FormGroup;
  screenWidth: number=0;
  registarInsurance=new InsuranceModel();
  constructor(){
    this.screenWidth = window.innerWidth
    this.initForm();
    this.initFormCreate();
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
  initFormCreate(){
    this.formCreate=this._formBuilder.group(
      { 
        codigo:["", [Validators.required,Validators.pattern('^[0-9]+$')]],
        nombre:["", [Validators.required]],
        description:["", [Validators.required]],
        suma:["", [Validators.required,Validators.pattern("^[0-9]+([.,][0-9]+)?$")]],
        prima:["", [Validators.required,Validators.pattern("^[0-9]+([.,][0-9]+)?$")]],
        legal:["", [Validators.required]],
      }
    )
  }
  getInvalidCreate(argument:string){
    return this.formCreate.get(argument)?.invalid && this.formCreate.get(argument)?.touched;

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
    this._services.GetInsuranceByCode(this.generateRequest(buscar)).subscribe({
      next:resp=> {
        if(resp.code=='200'){
          this.insuranceList=resp.data
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
  editar(index:number, item:InsuranceModel){
    debugger
    let codeInsurance=document?.getElementById('codeInsurance'+index) as HTMLInputElement;
    if(codeInsurance.disabled){
      Swal.fire({
        title: "Deseas editar este registro?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Editar",
        denyButtonText: `Cancelar`
      }).then((result) => {
        if (result.isConfirmed) {
          let nameInsurance=document?.getElementById('nameInsurance'+index) as HTMLInputElement;
          let description=document?.getElementById('description'+index) as HTMLInputElement;
          let sumaAsegurada=document?.getElementById('sumaAsegurada'+index) as HTMLInputElement;
          let prima=document?.getElementById('prima'+index) as HTMLInputElement;
          let legalAge=document?.getElementById('legalAge'+index) as HTMLInputElement;
            codeInsurance.disabled=false;
            nameInsurance.disabled=false;
            description.disabled=false;
            sumaAsegurada.disabled=false;
            prima.disabled=false;
            legalAge.disabled=false;
          }
        })
  }else{
        Swal.fire({
          title: "Deseas actualizar el registro?",
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: "Actualizar",
          denyButtonText: `Cancel`
        }).then((result) => {
          if (result.isConfirmed) {
            this._services.UpdateTypeInsurance(this.generateRequest(item)).subscribe({
              next:resp=>{
               if(resp.code=='201'){
                Swal.fire({
                  icon:"success",
                  title:"El registro ha sido actualizado  correctamente",
                  showConfirmButton: false,
                  timer: 1500
                })
               } 
              }
              })
          } 
        });
      }
}
eliminar( item:InsuranceModel){
    Swal.fire({
      title: "Deseas eliminar este registro?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`
    }).then((result) => {
      if (result.isConfirmed) {
            item.statusId=2;
            this._services.UpdateTypeInsurance(this.generateRequest(item)).subscribe({
              next:resp=>{
                if(resp.code=='201'){
                  Swal.fire({
                    icon:"success",
                    title:"El registro ha sido eliminado correctamente",
                    showConfirmButton: false,
                    timer: 1500
                  })
                  this.insuranceList=this.insuranceList.filter(insurance=>insurance.typeInsuranceId!=item.typeInsuranceId)
                } 
              }
            })            

        }
        }
    )}
    registrar(){
      if(this.formCreate.invalid){
        Swal.fire({
          icon: "error",
          title: "Oops...\nCampo invalido",
          
          showConfirmButton: false,
          timer: 1500
        }) 
        console.log(this.formCreate)
        Object.values(this.formCreate.controls).forEach(controls=>controls.markAllAsTouched());
        return;
      }
      Swal.fire({
        title: "Deseas registrar esta informacion?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Registrar",
        denyButtonText: `Cancelar`
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            icon:'info',
            title:'Registrando',
            showConfirmButton: false,
            allowOutsideClick:false,
            allowEscapeKey:false,
          })
          Swal.showLoading()
          this._services.PostTypeInsurance(this.generateRequest(this.registarInsurance)).subscribe({
            next:resp=> {
              if(resp.code=='201'){
                this.insuranceList=resp.data
                Swal.fire({
                  icon:'success',
                  title:'Registrado correctamente',
                  showConfirmButton: false,
                  allowOutsideClick:false,
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
        }});
     
    }
  }
