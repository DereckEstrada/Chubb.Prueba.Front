import { RequestInterface } from '../Interfaces/request.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { ResultResponse } from '../Interfaces/result.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private _http=inject(HttpClient);
  private baseUrl=environment.baseUrl;
  constructor() { }
  GetCustomerByCedulaRepresent(request:RequestInterface):Observable<ResultResponse>{
    const GetCustomerByCedulaRepresent=this.baseUrl+environment.GetCustomerByCedulaRepresent;
    return this._http.post(GetCustomerByCedulaRepresent, request);
  }
  GetCustomersWithoutInsurance(request:RequestInterface):Observable<ResultResponse>{
    const GetCustomersWithoutInsurance=this.baseUrl+environment.GetCustomersWithoutInsurance;
    return this._http.post(GetCustomersWithoutInsurance, request);
  }
  GetCustomerByCedula(request:RequestInterface):Observable<ResultResponse>{
    const GetCustomerByCedula=this.baseUrl+environment.GetCustomerByCedula;
    return this._http.post(GetCustomerByCedula, request);
  }
  PostCustomer(request:RequestInterface):Observable<ResultResponse>{
    const PostCustomer=this.baseUrl+environment.PostCustomer;
    return this._http.post(PostCustomer, request);
  }
  UpdateCustomer(request:RequestInterface):Observable<ResultResponse>{
    const UpdateCustomer=this.baseUrl+environment.UpdateCustomer;
    return this._http.post(UpdateCustomer, request);
  }  
  UploadFile(formData:FormData):Observable<ResultResponse>{
    const UploadFile=this.baseUrl+environment.UploadFile;
    return this._http.post(UploadFile, formData);
  }
}
