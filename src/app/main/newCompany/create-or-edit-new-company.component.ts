import { Component,ChangeDetectorRef, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Select2ServiceProxy, Datadto, InquiryServiceProxy,CreateCompanyOrContact,EnquiryContactServiceProxy,EnquiryContactInputDto, CompanyServiceProxy, CustomerTypeDto, ContactViewDto,NewCompanyContactServiceProxy, CompanyInputDto } from "shared/service-proxies/service-proxies";
import { Router } from '@angular/router';
export interface SelectOption{
   id?: number;
   text?: string;
}

@Component({
    selector: 'createNewCompanyModal',
    templateUrl: './create-or-edit-new-company.component.html',
        styleUrls: ['./create-or-edit-new-company.component.less']

})
export class CreateOrEditNewCompanyModalComponent extends AppComponentBase implements AfterViewInit {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;

    company: CreateCompanyOrContact = new CreateCompanyOrContact();
    SelectedCityId:number = 0;
    SelectedCityName:string = "";
    SelectedCustomerTypeId:number = 0;
    SelectedCutomerTypeName:string = "";
    SelectedAccountId:number = 0;
    SelectedAccountName:string = "";
    active_tagCompany: SelectOption[];
    private companies:Array<any> = [];
    private items:Array<any> = [];
    companyId:number;
    LocText:string = null;
    citys: Datadto[] = [];
    AccountHandlers: Datadto[] = [];
    types: CustomerTypeDto[] = [];
    contacts:ContactViewDto[] = [];
    companys: Datadto[] = [];
    private custType:Array<any> = [];
    private location:Array<any> = [];
    eventCompany = this.company;
    eventContact = this.contacts;
    company_name:string="";
    inq_id:number = 0;
    active = false;
    saving = false;
    private AccountHandler:Array<any> = [];
    companyType:Datadto[]=[];
    managedType:Datadto[]=[];
    active_accHand:SelectOption[];
    plusvalid:boolean=false;
    c_name:string='';
    comp_type:boolean=false;
    private managedBy:Array<any> = [];
    CompanyDuplicate:boolean = false;
    companyInput:CompanyInputDto = new CompanyInputDto();
    private indus:Array<any>=[];
    allIndustry:Datadto[];
    active_indus:SelectOption[];
    
	contactInput:EnquiryContactInputDto = new EnquiryContactInputDto();
    constructor(
        injector: Injector,
        private _companyServiceProxy: CompanyServiceProxy,
        private _inquiryServiceProxy: InquiryServiceProxy,
        private _select2Service: Select2ServiceProxy,
        private route:Router,
        private _newCompanyContactServiceProxy:NewCompanyContactServiceProxy,
        private cdr: ChangeDetectorRef,
        private _enquiryContactServiceProxy: EnquiryContactServiceProxy,
    ){
        super(injector);
    }

    ngAfterViewInit(): void {
      this.cdr.detectChanges();
    }

   show(companyId?: number,companyName?:string,inquiryId?:number): void {
        this.company = this.eventCompany;
        this.SelectedCityId = 0;
        this.SelectedCityName = "";
        this.SelectedCustomerTypeId = 0;
        this.SelectedCutomerTypeName = "";
        this.SelectedAccountId = 0; 
        this.SelectedAccountName = "";
        this.contacts = this.eventContact;
        this.companyId = companyId;
        this.company_name = companyName;
        this.inq_id = inquiryId;
       

          //  this._select2Service.getAllCompany().subscribe((result) => { 
          //   if (result.select2data != null) { 
          //       this.companys = result.select2data;
          //        this.companies = [];
          //        this.companys.forEach((company:{id:number, name:string}) => {
          //                    this.companies.push({
          //                          id: company.id,
          //                          text: company.name
          //                          });
          //                       });
          //                   } 
          //             });
           
           this._select2Service.getNewCompanyType().subscribe((result) => {
           if (result.select2data != null) {
            this.companyType=result.select2data;
            this.custType=[];
            this.companyType.forEach((company:{id:number,name:string})=>{
              this.custType.push({
                id:company.id,
                text:company.name
              });
            });
           } });
           this._select2Service.getSalesman().subscribe((result) => {
           if (result.select3data != null) {
            this.managedType=result.select3data;
            this.managedBy=[];
            this.managedType.forEach((managedtype:{id:number,name:string})=>{
              this.managedBy.push({
                id:managedtype.id,
                text:managedtype.name
              });
            });
           } });

           this._select2Service.getIndustry().subscribe((result) => {
            if (result.select2data != null) {
             this.allIndustry=result.select2data;
             this.indus=[];
             this.allIndustry.forEach((industry:{id:number,name:string})=>{
               this.indus.push({
                 id:industry.id,
                 text:industry.name
               });
               if(this.company.industryId==industry.id){
                 this.active_indus = [{id:industry.id,text:industry.name}];
               }
             });
            } });
           
           this.active = true;
           this.comp_type = false;
             this.modal.show();
           
    }
     doSomethingType(data): void {
        console.log(data);
        this.company.newCustomerTypeId = data.id;
        this.comp_type = true; 
    }
    removeCompany(data):void{
      this.comp_type = false; 
    }
    selectManagedBy(data):void{
      this.company.accountManagerId=data.id;
    }
    removeManagedBy(data):void{
      this.company.accountManagerId=null;
    }
    
    isValidCompany(data){
      if(data.form.valid && this.comp_type){
        return false;
      }else{
        return true;
      }
    }
    refreshIndus(value:any){
      this.company.industryId = value.id;
    }
    removedIndus(value:any){
      this.company.industryId =null;
    }
  

    CheckCompanyDuplicate(data){
      this.companyInput.companyName = data;
      console.log(this.companyInput);
      this._newCompanyContactServiceProxy.checkDuplicateCompany(this.companyInput).subscribe((result) =>{
          this.CompanyDuplicate = result;

      });
  
    }

   save(): void {
        this.saving = true;
           if (this.company.id == null) {
               this.company.id = 0;
           }
           if(!this.company.industryId)
           {
            this.company.industryId = null;
           }
           this.company.newCompanyId = null;
           this.company.name = this.company_name;

if(this.CompanyDuplicate == false)
{
  this._newCompanyContactServiceProxy.createOrUpdateCompanyOrContact(this.company)
  .finally(() => this.saving = false)
  .subscribe((result) => {
       this.notify.success(this.l('SavedSuccessfully'));
       this.modalSave.emit(this.company);
       console.log(6,this.company);
       this.close();
  });
}
   else{
    this.notify.error(this.l('This Company Already Exist'));
    this.saving = false;
   }      
    }
    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.modal.hide();
        this.active = false;
        this.company = this.eventCompany;
        this.contacts = this.eventContact;
        this.company_name ="";
        this.companyId =null;

    }
	
}
