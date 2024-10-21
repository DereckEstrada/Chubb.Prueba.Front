import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResultResponse } from '../Interfaces/result.interface';
import { RequestInterface } from '../Interfaces/request.interface';

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {
  private _http=inject(HttpClient);
  private baseUrl=environment.baseUrl;
  constructor(){}
  GetTypeInsurance(request:RequestInterface):Observable<ResultResponse>{
    
    const GetTypeInsurance =this.baseUrl+environment.GetTypeInsurance
    return this._http.post(GetTypeInsurance,request);
  }
  GetInsuranceByCode(request:RequestInterface):Observable<ResultResponse>{
    const GetInsuranceByCode =this.baseUrl+environment.GetInsuranceByCode
    return this._http.post(GetInsuranceByCode,request);
  }
  PostTypeInsurance(request:RequestInterface):Observable<ResultResponse>{
    const PostTypeInsurance=this.baseUrl+environment.PostTypeInsurance
    return this._http.post(PostTypeInsurance,request);
  }
  UpdateTypeInsurance(request:RequestInterface):Observable<ResultResponse>{
    const UpdateTypeInsurance =this.baseUrl+environment.UpdateTypeInsurance
    return this._http.post(UpdateTypeInsurance,request);
  }  
}
