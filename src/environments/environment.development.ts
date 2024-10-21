export const environment = {
    production:false,

    //Backend 
    baseUrl:"http://localhost:5207/",
    //Relation
    RelationGetInsuranceForCedula:"Relation/GetInsuranceForCedula",
    RelationGetCustomerForCodeInsurance:"Relation/GetCustomerForCodeInsurance",
    PostRelationCustomerInsurance:"Relation/PostRelationCustomerInsurance",
    UpdateRelationCustomerInsurance:"Relation/UpdateRelationCustomerInsurance",
    //Customer
    GetCustomerByCedulaRepresent:"Customer/GetCustomerByCedulaRepresent",
    GetCustomersWithoutInsurance:"Customer/GetCustomersWithoutInsurance",
    GetCustomerByCedula:"Customer/GetCustomerByCedula",
    PostCustomer:"Customer/PostCustomer",
    UpdateCustomer:"Customer/UpdateCustomer",
    UploadFile:"Customer/UploadFile",
    //Insurance
    GetTypeInsurance:"TypeInsurance/GetTypeInsurance",
    GetInsuranceByCode:"TypeInsurance/GetInsuranceByCode",
    PostTypeInsurance:"TypeInsurance/PostTypeInsurance",
    UpdateTypeInsurance:"TypeInsurance/UpdateTypeInsurance"
};
