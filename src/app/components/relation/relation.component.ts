import { Component, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { CustomerModel } from '../../Models/customer.model';
import { RequestInterface } from '../../Interfaces/request.interface';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { RelationService } from '../../services/relation.service';
import { RelationCustomerModel } from '../../Models/relation.customer.model';
import { InsuranceService } from '../../services/insurance.service';
import { InsuranceModel } from '../../Models/insurance.model';
import { RelationModel } from '../../Models/relation.model';
import { InsuranceModule } from '../insurance/insurance.module';

@Component({
  selector: 'app-relation',
  templateUrl: './relation.component.html',
  styleUrl: './relation.component.css'
})
export class RelationComponent {
  private _router=inject(Router);
  private _formBuilder=inject(FormBuilder);
  private _service=inject(RelationService);
  private _serviceInsurance=inject(InsuranceService);
  private _serviceCustomer=inject(CustomerService);
  form!:FormGroup;
  screenWidth: number=0;
  relationList:RelationCustomerModel[]=[];
  insuranceList:InsuranceModel[]=[];
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
    this._service.RelationGetInsuranceForCedula(this.generateRequest(buscar)).subscribe({
      next:resp=> {
        if(resp.code=='200'){          
          this.relationList=resp.data
          console.log(this.relationList);
          let legalAge=this.typeInsurance(this.relationList[0].dateBorn as Date);
          this._serviceInsurance.GetTypeInsurance(this.generateRequest(legalAge)).subscribe({
            next:resp=>{
              if(resp.code=='200'){
                this.insuranceList=resp.data
                this.relationList.forEach(insuranceId=>this.insuranceList=this.insuranceList.filter(insuranceAsigados=>insuranceAsigados.typeInsuranceId!=insuranceId.typeInsuranceId))  
              }
            }
          })
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
  asignarInsurance(item:InsuranceModel){
    debugger
    console.log(this.insuranceList)
    console.log(item)
      Swal.fire({
        title: "Deseas asignar este registro?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Asignar",
        denyButtonText: `Cancelar`
      }).then((result) => {
        if (result.isConfirmed) {
          debugger
          let relation=new RelationModel();
          relation.customerId=this.relationList[0].customerId;
          relation.typeInsuranceId=item.typeInsuranceId
            this._service.PostRelationCustomerInsurance(this.generateRequest(relation)).subscribe({
              next:resp=>{
               if(resp.code=='201'){
                Swal.fire({
                  icon:"success",
                  title:"El registro ha sido actualizado  correctamente",
                  showConfirmButton: false,
                  timer: 1500
                })           
                this._service.RelationGetInsuranceForCedula(this.generateRequest(this.form.get('cedula')?.value)).subscribe({
                  next:resp=>{
                    if(resp.code=="200"){
                      this.relationList=resp.data;
                      this.relationList.forEach(insuranceId=>this.insuranceList=this.insuranceList.filter(insuranceAsigados=>insuranceAsigados.typeInsuranceId!=insuranceId.typeInsuranceId))  
                    }
                  }
                })     
               } 
              }
              })
          } 
        });
}
eliminar( item:RelationCustomerModel){
    Swal.fire({
      title: "Deseas eliminar este registro?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`
    }).then((result) => {
      if (result.isConfirmed) {
            item.statusId=2;
            this._service.UpdateRelationCustomerInsurance(this.generateRequest(item)).subscribe({
              next:resp=>{
                if(resp.code=='201'){
                  Swal.fire({
                    icon:"success",
                    title:"El registro ha sido eliminado correctamente",
                    showConfirmButton: false,
                    timer: 1500
                  })
                    this.relationList=this.relationList.filter(customer=>customer.customerInsuranceId!=item.customerInsuranceId);
                    this.AgregarInsurance(item);
                  } 
              }
            })            

        }
        }
    )}

    calculateAge(birthbron: Date): number {
      const birthbronDate = new Date(birthbron);
        const today = new Date();
        let age = today.getFullYear() - birthbronDate.getFullYear();
        const monthDifference = today.getMonth() - birthbronDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthbronDate.getDate())) {
          age--;
        } 
        return age;
    }
    typeInsurance(nacimiento:Date){
      let legalAge=false;
      if(this.calculateAge(nacimiento)>=20){
        legalAge=true;
      }
      return legalAge;
    } 
    AgregarInsurance(item:RelationCustomerModel){
      let insurance=new InsuranceModel();
      insurance.typeInsuranceId=item.typeInsuranceId;
      insurance.codeInsurance=item.codeInsurance;
      insurance.nameInsurance=item.nameInsurance;
      insurance.sumaAsegurada=item.sumaAsegurada;
      insurance.prima=item.prima
      this.insuranceList.push(insurance);
    }
    getFile(event:any){
      Swal.fire({
        title: "Deseas registrar este archivo?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Registrar",
        denyButtonText: `Cancelar`
      }).then((result) => {
        if (result.isConfirmed) {
          const file: File | null = event.target.files[0];

          if (file) {
            const formData = new FormData();
            formData.append('file', file);
            this._serviceCustomer.UploadFile(formData).subscribe({
              next:resp=>{
                if(resp.code=='201'){
                  Swal.fire({
                    icon:"success",
                    title:"El archivo ha sido registrado correctamente",
                    showConfirmButton: false,
                    timer: 1500
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
            });
          }
      }
      })
    }
}
