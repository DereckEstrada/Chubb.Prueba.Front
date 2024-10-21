import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CustomerModel } from '../../Models/customer.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { RequestInterface } from '../../Interfaces/request.interface';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent implements OnInit{
  private _router=inject(Router);
  private _formBuilder=inject(FormBuilder);
  private _service=inject(CustomerService);
  form!:FormGroup;
  screenWidth: number=0;
  customerList:CustomerModel[]=[];
  constructor(){
    this.screenWidth = window.innerWidth
    this.initForm();
  }
  ngOnInit(): void {
  }
  initForm(){
    this.form=this._formBuilder.group(
      { 
        cedula:["", [Validators.required, Validators.pattern('^[0-9]+$')]]
      }
    )
  }
  getInvalid(argument:string){
    return this.form.get(argument)?.invalid && this.form.get(argument)?.touched;
  }
  buscarByCedula(){
    debugger
    if(this.form.invalid){
      Swal.fire({
        icon: "error",
        title: "Oops...\nCampo invalido",

        showConfirmButton: false,
        timer: 1500
      }) 
      return;
    }
    let buscar=this.form.get('cedula')?.value;
    Swal.fire({
      icon:'info',
      title:'Cargando respuestas',
      showConfirmButton: false,
      allowOutsideClick:false,
      allowEscapeKey:false,
    })
    Swal.showLoading()
    this._service.GetCustomerByCedula(this.generateRequest(buscar)).subscribe({
      next:resp=> {
        if(resp.code=='200'){
          
          this.customerList=resp.data
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
  editar(item:CustomerModel){
    debugger
    let firstName=document?.getElementById('firstName'+item.customerId) as HTMLInputElement;
    let lastName=document?.getElementById('lastName'+item.customerId) as HTMLInputElement;
    let cedula=document?.getElementById('cedula'+item.customerId) as HTMLInputElement;
    let telephone=document?.getElementById('telephone'+item.customerId) as HTMLInputElement;
    let email=document?.getElementById('email'+item.customerId) as HTMLInputElement;
    if(firstName.disabled){
      Swal.fire({
        title: "Deseas editar este registro?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Editar",
        denyButtonText: `Cancelar`
      }).then((result) => {
        if (result.isConfirmed) {
          if(firstName.disabled){
            firstName.disabled=false;
            lastName.disabled=false;
            cedula.disabled=false;
            telephone.disabled=false;
            email.disabled=false;
            }
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
            
            this._service.UpdateCustomer(this.generateRequest(item)).subscribe({
              next:resp=>{
               if(resp.code=='201'){
                Swal.fire({
                  icon:"success",
                  title:"El registro ha sido actualizado  correctamente",
                  showConfirmButton: false,
                  timer: 1500
                })
                firstName.disabled=true;
                lastName.disabled=true;
                cedula.disabled=true;
                telephone.disabled=true;
                email.disabled=true;
               } 
              }
              })
          } 
        });
      }
}
eliminar( item:CustomerModel){
    Swal.fire({
      title: "Deseas eliminar este registro?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`
    }).then((result) => {
      if (result.isConfirmed) {
            item.statusId=2;
            this._service.UpdateCustomer(this.generateRequest(item)).subscribe({
              next:resp=>{
                if(resp.code=='201'){
                  Swal.fire({
                    icon:"success",
                    title:"El registro ha sido eliminado correctamente",
                    showConfirmButton: false,
                    timer: 1500
                  })
                    this.customerList=this.customerList.filter(customer=>customer.customerId!=item.customerId);
                 }else{
                  Swal.fire({
                    icon: "error",
                    title: "Oops...\nHa ocurrido un error",
                    showConfirmButton: false,
                    timer: 1500
                  })                 
                 } 
              }, error:err=>{
                Swal.fire({
                  icon: "error",
                  title: "Oops...\nHa ocurrido un error",
                  showConfirmButton: false,
                  timer: 1500
                }) 
              }
            })            

        }
        }
    )}
    Registrar(){
      this._router.navigateByUrl("Customer/RegisterCustomer");    }
    }


