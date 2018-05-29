import { Component,ChangeDetectorRef, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Select2ServiceProxy,QuotationServiceProxy, CreateQuotationInput,Select2salesDto, Contactdto,InquiryListDto, Datadto, Select2InquiryDto, NullableIdDto } from "shared/service-proxies/service-proxies";
import { Router } from '@angular/router';
export interface SelectOption{
   id?: number;
   text?: string;
}

@Component({
    selector: 'createNewQuotationModal',
    templateUrl: './create-or-edit-new-quotation.component.html',
        styleUrls: ['./create-or-edit-new-quotation.component.less']

})
export class CreateOrEditNewQuotationModalComponent extends AppComponentBase implements AfterViewInit {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    quotation:CreateQuotationInput = new CreateQuotationInput();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;

    company_Dto:Select2salesDto[];
    company:Array<any>;
    enquiryDetail:InquiryListDto = new InquiryListDto();
    inquirydetailDto: Select2InquiryDto[];
    inquiryDto: Datadto[];
    inquiry:Array<any>;
    active_inquiry:SelectOption[];
    optionalquotation:NullableIdDto=new NullableIdDto(); 

    contactDto: Contactdto[];
    contact:Array<any>;
    active_contact:SelectOption[];

    salesMan:Array<any>;
    active_sales:SelectOption[];
    active_company:SelectOption[];

    active:boolean;
    saving:boolean;
    constructor(
        injector: Injector,
        private _select2Service: Select2ServiceProxy,
        private route:Router,
        private _quotationService:QuotationServiceProxy
    ){
        super(injector);
    }

    ngAfterViewInit(): void {
      
    }




   show(enquiry?: any): void {

          this.active_sales =[];
          this.active_contact =[];
          this._select2Service.getInquiry().subscribe(result=>{
            console.log(13,result.select2data);
            if(result.select2data!=null){
                this.inquiryDto=result.select2data;
                this.inquiry=[];
                this.inquiryDto.forEach((inq:{id:number,name:string})=>{
                    this.inquiry.push({
                        id:inq.id,
                        text: inq.name
                    });
                });
            }
        }) 
          this.active = true;
          this.modal.show();
           
    }
    
    selectInquiry(data:any){
        this.active_inquiry =[{id:data.id,text:data.text}];
        this.quotation.inquiryId = data.id; 
        this.getenquirydetail(data.id);
      }

      removeInquiry(data:any){
        this.quotation.inquiryId = null;
        this.active_inquiry =[]; 
        this.quotation.newCompanyId=null;
        this.active_company=[];
        this.quotation.attentionContactId=null;
        this.active_contact=[];
        this.quotation.salesPersonId=null;
        this.active_sales=[];       
      }

getenquirydetail(data){
    this._select2Service.getInquiryDetails(data).subscribe(result=>{
        if(result.select2inq!=null)
        {
            this.inquirydetailDto=result.select2inq;
             this.inquirydetailDto.forEach((inq:{salesManId:number,salesMan:string,companyId:number,companyName:string,contactId:number,contactName:string})=>{
                            this.active_company=[{id:inq.companyId,text:inq.companyName}];
                            this.quotation.newCompanyId=inq.companyId;
                            this.active_contact=[{id:inq.contactId,text:inq.contactName}];
                            this.quotation.attentionContactId=inq.contactId;
                            this.active_sales=[{id:inq.salesManId,text:inq.salesMan}];
                            this.quotation.salesPersonId=inq.salesManId;   
                           });
        }
        this.getContacts(this.quotation.newCompanyId);
    });
}

   save(): void {
        this.saving = true;
           if (this.quotation.id == null) {
               this.quotation.id = 0;
           }
           if (this.quotation.inquiryId == 0) {
            this.quotation.inquiryId = null;
        }
        if (this.quotation.mileStoneId == 0) {
            this.quotation.mileStoneId = null;
        }
           this.quotation.quotationStatusId =1;
           this.quotation.termsandCondition = "";
           this.quotation.customerId = "null";
           this.quotation.refNo = "null";
           this.optionalquotation.id=this.quotation.inquiryId;
           this._quotationService.createOrUpdateQuotation(this.quotation)
                        .finally(() => this.saving = false)
                        .subscribe((result) => {
                            if(result){
                                this.route.navigate(['app/main/quotation',result]);
                                this.modalSave.emit(this.quotation);
                                this.close();
                            }
                        });

    }
    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.quotation.name = '';
        this.active_inquiry =[];
        this.active_company=[];
        this.modal.hide();
        this.active = false;
    }
	  selectCompany(data:any){
        this.active_contact = [];
        this.quotation.attentionContactId = null;
      this.quotation.newCompanyId = data.id;
          var index = this.company_Dto.findIndex(x=> x.id==data.id);
          if(this.company_Dto[index].salesManId){
              this.active_sales = [{id: this.company_Dto[index].salesManId,text: this.company_Dto[index].salesMan}];
              this.quotation.salesPersonId = this.company_Dto[index].salesManId;
          }else{
              this.active_sales = [];
              this.quotation.salesPersonId = null;
          }
      this.getContacts(data.id);
    }
    removeCompany(data:any){
        this.active_contact = [];
      this.quotation.newCompanyId = null;
      this.quotation.attentionContactId = null;
    }
    selectSalesMan(data:any){
      this.quotation.salesPersonId = data.id;
    }
    removeSalesMan(data:any){
      this.quotation.salesPersonId = null;
    }
    selectContact(data:any){
      this.active_contact =[{id:data.id,text:data.text}];
      this.quotation.attentionContactId = data.id;
    }
    removeContact(data:any){
      this.quotation.attentionContactId = null;
      this.active_contact =[];
    }
    getContacts(data){
      this.active_contact =[];
      this._select2Service.getCompanyContacts(data).subscribe(result=>{
          if(result.select2data!=null){
              this.contactDto = result.select2data;
              this.contact = [];

              this.contactDto.forEach((con:{id:number,fullName:string})=>{
                  this.contact.push({
                      id:con.id,
                      text: con.fullName
                  });

              });
          }
      });
    }
}