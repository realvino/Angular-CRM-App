import { Component,ChangeDetectorRef, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Select2ServiceProxy, Datadto, InquiryServiceProxy,CreateCompanyOrContact, CompanyServiceProxy, CustomerTypeDto, ContactViewDto,NewCompanyContactServiceProxy } from "shared/service-proxies/service-proxies";
//import { CreateOrEditCompanyContactModalComponent } from "app/main/company/create-edit-companycontact.component";
import { Router } from '@angular/router';
export interface SelectOption{
   id?: number;
   text?: string;
}

@Component({
    selector: 'createNewEnqCompanyModal',
    templateUrl: './create-or-edit-new-company.component.html',
        styleUrls: ['./create-or-edit-new-company.component.less']

})
export class CreateEnqNewCompanyModalComponent extends AppComponentBase implements AfterViewInit {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    //@ViewChild('companyCombobox') companyCombobox: ElementRef;


    //@ViewChild('createCompanyModal') modal: ModalDirective;
    //@ViewChild('createCompanyContactModal') createCompanyContactModal: CreateOrEditCompanyContactModalComponent;

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
    
    active = false;
    saving = false;
    private AccountHandler:Array<any> = [];
    companyType:Datadto[]=[];
    active_accHand:SelectOption[];
    plusvalid:boolean=false;
    c_name:string='';
    enquiry_id:number=0;
    constructor(
        injector: Injector,
        private _companyServiceProxy: CompanyServiceProxy,
        private _inquiryServiceProxy: InquiryServiceProxy,
        private _select2Service: Select2ServiceProxy,
        private route:Router,
        private _newCompanyContactServiceProxy:NewCompanyContactServiceProxy,
        private cdr: ChangeDetectorRef
    ){
        super(injector);
    }
    ngAfterViewInit(): void {
      this.cdr.detectChanges();
    }

   show(companyId?: number,companyName?:string,enqId?:number): void {
        this.company = this.eventCompany;
        this.SelectedCityId = 0;
        this.SelectedCityName = "";
        this.SelectedCustomerTypeId = 0;
        this.SelectedCutomerTypeName = "";
        this.SelectedAccountId = 0; 
        this.SelectedAccountName = "";
        this.contacts = this.eventContact;
        this.companyId = companyId;
        this.company.name = companyName;
        this.enquiry_id = enqId;
        //    this._select2Service.getAllCompany().subscribe((result) => { 
        //     if (result.select2data != null) { 
        //         this.companys = result.select2data;
        //          this.companies = [];
        //          this.companys.forEach((company:{id:number, name:string}) => {
        //                      this.companies.push({
        //                            id: company.id,
        //                            text: company.name
        //                            });
        //                         });
        //                     } 
        //               });
           
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
           this.active = true;
             this.modal.show();
           
    }
     doSomethingType(data): void {
        console.log(data);
        this.company.newCustomerTypeId = data.id; 
    }

    /*createContact(data): void {
        this.createCompanyContactModal.show(data,0);
    }

    editContact(comp,cont): void {
     this.createCompanyContactModal.show(comp,cont);
    }*/
    
  
    /*saveCompany(): void {
      this.company=this.eventCompany;
       this.message.confirm(
                this.l('Are You Sure To Add Company'),
                (isConfirmed) => {
             if (isConfirmed) {
             this._companyServiceProxy.newCompanyCreate(this.company)
            .subscribe((result) => {
                this.notify.info(this.l('SavedSuccessfully'));
                //this.inquiry.companyId = result;
                this.plusvalid = false;
            });
                    }
                }
            );
    }*/

   save(): void {
        this.saving = true;
           if (this.company.id == null) {
               this.company.id = 0;
           }
           this.company.newCompanyId = null;
           console.log(this.company);
             this._newCompanyContactServiceProxy.createOrUpdateCompanyOrContact(this.company)
            .finally(() => this.saving = false)
            .subscribe((result) => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.company = this.eventCompany;
                this.close();
                this.modalSave.emit(this.company);
                console.log(result);
                this.route.navigate(['app/main/company/'+result,this.enquiry_id]);
            });
    }
    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.modal.hide();
        this.active = false;
        this.company = this.eventCompany;
        this.contacts = this.eventContact;
    }
}
