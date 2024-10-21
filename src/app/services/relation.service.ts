import { RequestInterface } from '../Interfaces/request.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { ResultResponse } from '../Interfaces/result.interface';

@Injectable({
  providedIn: 'root'
})
export class RelationService {
  private _http=inject(HttpClient);
  private baseUrl=environment.baseUrl;
  constructor() { }
  RelationGetInsuranceForCedula(request:RequestInterface):Observable<ResultResponse>{
    const RelationGetInsuranceForCedula=this.baseUrl+environment.RelationGetInsuranceForCedula;
    return this._http.post(RelationGetInsuranceForCedula,request);
  }
  RelationGetCustomerForCodeInsurance(request:RequestInterface):Observable<ResultResponse>{
    const RelationGetCustomerForCodeInsurance=this.baseUrl+environment.RelationGetCustomerForCodeInsurance;
    return this._http.post(RelationGetCustomerForCodeInsurance,request);
  }
  PostRelationCustomerInsurance(request:RequestInterface):Observable<ResultResponse>{
    const PostRelationCustomerInsurance=this.baseUrl+environment.PostRelationCustomerInsurance;
    return this._http.post(PostRelationCustomerInsurance,request);
  }
  UpdateRelationCustomerInsurance(request:RequestInterface):Observable<ResultResponse>{
    const UpdateRelationCustomerInsurance=this.baseUrl+environment.UpdateRelationCustomerInsurance;
    return this._http.post(UpdateRelationCustomerInsurance,request);
  }  
}
