import { Component, inject, OnInit } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerModel } from '../../../Models/customer.model';
import { InsuranceService } from '../../../services/insurance.service';
import { RequestInterface } from '../../../Interfaces/request.interface';
import { InsuranceModel } from '../../../Models/insurance.model';
import Swal from 'sweetalert2';
import { RelationComponent } from '../../relation/relation.component';
import { RelationService } from '../../../services/relation.service';
import { RelationModel } from '../../../Models/relation.model';

@Component({
  selector: 'app-register-costumer',
  templateUrl: './register-costumer.component.html',
  styleUrl: './register-costumer.component.css'
})
export class RegisterCostumerComponent  implements OnInit{
  private _services=inject(CustomerService);
  private _formBuilder=inject(FormBuilder);
  private _servicesInsurance=inject(InsuranceService);
  private _servicesRelation=inject(RelationService);
  customerCreate=new CustomerModel();
  mostrarInsurances:InsuranceModel[]=[];
  legalInsurances:InsuranceModel[]=[];
  noLegalInsurances:InsuranceModel[]=[];
  AgregadosInsurances:InsuranceModel[]=[];
  form!:FormGroup;
  constructor(){
    this.initForm();
  }
  ngOnInit(): void {

    Swal.fire({
      icon:'info',
      title:'Cargando respuestas',
      showConfirmButton: false,
      allowOutsideClick:false,
      allowEscapeKey:false,
    })
    Swal.showLoading()
    this._servicesInsurance.GetTypeInsurance(this.generateRequest(false)).subscribe({
      next:resp=>{
        if(resp.code=='200' || resp.code=='201'){
          console.log(resp);
          this.noLegalInsurances=resp.data;
          this._servicesInsurance.GetTypeInsurance(this.generateRequest(true)).subscribe({
            next:resp=>{
              if(resp.code=='200'){
                console.log(resp);
                this.legalInsurances=resp.data;
              }
            }
          })
        }else if(resp.code=='400'){
          Swal.fire({
            icon: "error",
            title: "Oops...\nHa ocurrido un error",
            showConfirmButton: false,
            timer: 1500
          }) 
        }
        Swal.close(); 
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
  initForm(){
    this.form=this._formBuilder.group(
      {
        FirstName:["", [Validators.required,  Validators.pattern('^[A-Za-z]+$')]], 
        LastName:["", [Validators.required, Validators.pattern('^[A-Za-z]+$')]], 
        Cedula:["", [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(10), Validators.maxLength(10)]], 
        Telephone:["", [Validators.required, Validators.pattern('^[0-9+]+$'), Validators.minLength(5)]], 
        DateBorn:["", [Validators.required, ]], 
        Email:["", [Validators.required, Validators.pattern("[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}")]],                 
      }
    )
    
  } 
  getInvalid(argument:string){
    return this.form.get(argument)?.invalid && this.form.get(argument)?.touched;
  }
  generateRequest(data:any){
    let request: RequestInterface={
      Ip:"0.0.0",
      UserId:"1",
      Data:data
    }
    return request
  }
  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const birthDate = new Date(input.value);
    let edad= this.calculateAge(birthDate); 
    this.AgregadosInsurances=[];
    if(edad>=20){
      this.mostrarInsurances=this.legalInsurances;
    }else{
      this.mostrarInsurances=this.noLegalInsurances;
    }
   }

  calculateAge(birthdate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDifference = today.getMonth() - birthdate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }

    return age;
  }
  agregarSeguro(item:any){
    this.AgregadosInsurances.push(item);
    this.mostrarInsurances=this.mostrarInsurances.filter(insurance=>insurance.typeInsuranceId!=item.typeInsuranceId)
  }
  eliminarSeguro(item:any){
    this.mostrarInsurances.push(item);
    this.AgregadosInsurances=this.AgregadosInsurances.filter(insurance=>insurance.typeInsuranceId!=item.typeInsuranceId)
  }
  guardarCliente(){
    debugger
    if(this.form.invalid){
      Swal.fire({
        icon: "error",
        title: "Oops...\nCampo invalido",
        showConfirmButton: false,
        timer: 1500
      }) 
      Object.values(this.form.controls).forEach(controls=>controls.markAllAsTouched());
      return;
    }
    Swal.fire({
      title: "Deseas Guardar la informacion?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Guardar",
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
        Swal.showLoading();
        this._services.PostCustomer(this.generateRequest(this.customerCreate)).subscribe({
          next:resp=>{
            if(resp.code=="201"){
              debugger
              this.AgregadosInsurances.forEach(agregados=>{
                let relation=new RelationModel();
                relation.customerCedula=this.customerCreate.cedula;
                relation.typeInsuranceId=agregados.typeInsuranceId
                this._servicesRelation.PostRelationCustomerInsurance(this.generateRequest(relation)).subscribe({
                   next:resp=>{
                    if(resp.code=='201'){
                      Swal.fire({
                        icon:'success',
                        title:'Registrado correctamente',
                        showConfirmButton: false,
                        allowOutsideClick:false,
                        timer: 1500
                      })            
                      this.AgregadosInsurances=[];
                      this.customerCreate=new CustomerModel();
                      Object.values(this.form.controls).forEach(controls=>controls.markAsUntouched());
      
                    }else{
                      Swal.fire({
                        icon: "error",
                        title: "Oops...\nHa ocurrido un error",
                        text:resp["message"],
                        showConfirmButton: false,
                        timer: 1500
                      }) 
                    }
                   } 
                })
              })
            }else{
              Swal.fire({
                icon: "error",
                title: "Oops...\nHa ocurrido un error",
                text:resp["message"],
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
    })
   
  }
}
