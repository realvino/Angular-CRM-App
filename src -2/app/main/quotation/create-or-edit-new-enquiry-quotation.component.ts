import { Component,ChangeDetectorRef, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Select2ServiceProxy,QuotationServiceProxy, CreateQuotationInput,Select2salesDto, Contactdto,InquiryListDto, Datadto, NullableIdDto, Select2InquiryDto, EnquiryUpdateInputDto, EnquiryUpdateServiceProxy } from "shared/service-proxies/service-proxies";
import { Router } from '@angular/router';
export interface SelectOption{
   id?: number;
   text?: string;
}

@Component({
    selector: 'createNewEnQuotationModal',
    templateUrl: './create-or-edit-new-enquiry-quotation.component.html',
        styleUrls: ['./create-or-edit-new-quotation.component.less']

})
export class CreateOrEditNewEnQuotationModalComponent extends AppComponentBase implements AfterViewInit {
    inquirydetailDto: Select2InquiryDto[];
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    quotation:CreateQuotationInput = new CreateQuotationInput();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    optionalquotation:NullableIdDto=new NullableIdDto(); 
    updateInquiryIn: EnquiryUpdateInputDto = new EnquiryUpdateInputDto();

    company_Dto:Select2salesDto[]; 
    company:Array<any>;
    enquiryDetail:InquiryListDto = new InquiryListDto();

    inquiryDto: Datadto[];
    inquiry:Array<any>;
    active_inquiry:SelectOption[];
    
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
        private _quotationService:QuotationServiceProxy,
        private _enquiryUpdateServiceProxy:EnquiryUpdateServiceProxy

    ){
        super(injector);
    }

    ngAfterViewInit(): void {
      
    }

   show(enquiryDetails?: any): void {
       this.enquiryDetail=enquiryDetails;
       console.log(enquiryDetails);
       let detail =this.enquiryDetail;
          this.active_sales =[];
          this.active_contact =[];
          this.active_inquiry = [{id:this.enquiryDetail.id,text:this.enquiryDetail.name}];
          this.quotation.stageId=this.enquiryDetail.statusId;                         
          this._select2Service.getInquiryDetails(this.enquiryDetail.id).subscribe(result=>{
            if(result.select2inq!=null)
            {
                this.inquirydetailDto=result.select2inq;
                 this.inquirydetailDto.forEach((inq:{salesManId:number,salesMan:string,companyId:number,companyName:string,contactId:number,contactName:string})=>{
                               
                                this.active_company=[{id:inq.companyId,text:inq.companyName}];
                                this.active_contact=[{id:inq.contactId,text:inq.contactName}];
                                this.active_sales=[{id:inq.salesManId,text:inq.salesMan}];

                                this.quotation.newCompanyId=inq.companyId;
                                this.quotation.attentionContactId=inq.contactId;
                                this.quotation.salesPersonId=inq.salesManId;                         
             });
            }
        });
        
          this.getContacts(this.enquiryDetail.companyId);
          this.quotation.attentionContactId=this.enquiryDetail.contactId;
          this.active = true;
          this.modal.show();
           
    }
    

   save(): void {
        this.saving = true;
           if (this.quotation.id == null) {
               this.quotation.id = 0;
           }
           this.quotation.quotationStatusId =1;
           this.quotation.termsandCondition = "null";
           this.quotation.customerId = "null";
           this.quotation.refNo = "null";
           this.quotation.mileStoneId = this.enquiryDetail.mileStoneId;           
		   this.quotation.inquiryId = this.enquiryDetail.id;
           this.optionalquotation.id=this.quotation.inquiryId;

           this._quotationService.createOrUpdateQuotation(this.quotation)
                        .finally(() => this.saving = false)
                        .subscribe((result) => {
                            if(result){
                                // this.editEnqQuotationModal.show(result,this.quotation.inquiryId); 
                                // this.router.navigate(["/app/main/sales-enquiry",data,this.enq_id]);    
                                if(this.quotation.mileStoneId == 4){
                                    this.activityDefault();
                                }
                                this.modalSave.emit(this.quotation);
                                this.close();
                            }
                        });
    }

    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }

    close(): void {
        this.modal.hide();
        this.quotation.name = "";
        this.active = false;
    }
    activityDefault(): void {
        this.updateInquiryIn.id = this.quotation.inquiryId;
        this.updateInquiryIn.currentStatusName = this.enquiryDetail.mileStoneName +"("+ this.enquiryDetail.statusName +")";
        this.updateInquiryIn.updateStatusName = "Pre-Quote(Initiate Contact)";
        this.updateInquiryIn.stageId = 2;
         console.log(this.updateInquiryIn);
         this._enquiryUpdateServiceProxy.createActivityDefault(this.updateInquiryIn).subscribe(result => {});
     }
	  selectCompany(data:any){
      this.quotation.newCompanyId = data.id;

      this.getSalesman(data.id);
      this.getContacts(data.id);
    }
    removeCompany(data:any){
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
                  if(this.enquiryDetail.contactId==con.id){
                      console.log(con.id);
                      this.active_contact=[{id:con.id,text:con.fullName}];
                      this.quotation.attentionContactId=con.id;
                  }
              });
          }
      });
    }

   getSalesman(id){
       console.log(id,56);
       var index = this.company_Dto.findIndex(x=> x.id==id);
       if(this.company_Dto[index].salesManId){
           this.active_sales = [{id: this.company_Dto[index].salesManId,text: this.company_Dto[index].salesMan}];
           this.quotation.salesPersonId = this.company_Dto[index].salesManId;
       }else{
           this.active_sales = [];
           this.quotation.salesPersonId = null;
       }
   }
}
