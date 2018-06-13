import { Component, ChangeDetectorRef,OnInit, Injector,AfterViewInit,ViewChild } from '@angular/core';
import { appModuleAnimation } from "shared/animations/routerTransition";
import { AppComponentBase } from "shared/common/app-component-base";
import { Router,ActivatedRoute } from "@angular/router";
import { Http } from "@angular/http";
import { Select2ServiceProxy, Datadto, QuotationServiceProxy, QuotationListDto, Select2salesDto, Contactdto, QuotationProductListDto, CreateQuotationInput, TenantDashboardServiceProxy, CreateDiscountInput,QuotationStatusServiceProxy,QuotationStatusList, NullableIdDto } from "shared/service-proxies/service-proxies";
import { AppConsts } from "shared/AppConsts";
import {Location} from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap';

export interface SelectOption{
  id?:number,
  text?:string
}
@Component({
    templateUrl: './revisedQuotationComponent.html',
    styleUrls: ['./custom.component.css'],
    selector: 'RevisedQuotationModel',
    animations: [appModuleAnimation()]
})
export class RevisedQuotationComponent extends AppComponentBase{
  @ViewChild('modal') modal: ModalDirective;
  showStage: boolean;
  submitted: boolean;
  ViewLinkedDetails: boolean;
  filterText: string = '';
  competitor_data:Datadto[];
  competators:Array<any>;
  active_competators:SelectOption[]=[];
  reason_data:Datadto[];
  reasons:Array<any>;
  active_reason:SelectOption[]=[];
  quotations :QuotationListDto[] = [];
  id:number;
  sTotalamount:string;
  Totalamount:number;
  quotationList:QuotationListDto =new QuotationListDto();
  quotation:CreateQuotationInput = new CreateQuotationInput();
  optionalquotation:NullableIdDto=new NullableIdDto();
  loading:boolean;
  company_Dto:Select2salesDto[];
  company:Array<any>;
  active_company:SelectOption[];
  non_editable:boolean=false;
  which_located:string='';
  contactDto: Contactdto[];
  contact:Array<any>;
  active_contact:SelectOption[];
  stage_list: Datadto[];
  stages:Array<any>;
  salesMan:Array<any>;
  active_sales:SelectOption[];
  isvatswitch:boolean=false;
  subTotal:number;

  q_product:Array<any>;

  saving:boolean = false;
  quotationTotal:number = 0;
  squotationTotal:string;
  active_email:SelectOption[];
  con_email:Array<any>;
  con_email_dto:Datadto[];

  active_phone:SelectOption[];
  con_phone:Array<any>;
  con_phone_dto:Datadto[];

  path : string = AppConsts.remoteServiceBaseUrl;

  status:boolean=false;
  sales_error:boolean = false;
  discountInput:CreateDiscountInput = new CreateDiscountInput();
  quotationStatus:QuotationStatusList[];
  stat_all:Array<any>;
 

   constructor(
        injector: Injector,
        private _select2Service: Select2ServiceProxy,
        private _quoatationService: QuotationServiceProxy,
        private _tenantDashboardService:TenantDashboardServiceProxy,
        private _quotationStatusService:QuotationStatusServiceProxy,
    )
    {
        super(injector); 
    }
  show(data) {
    this.id = data;
    this.non_editable = true;
    this.loading = true;
    this.quotationList = new QuotationListDto();
    this.quotation = new CreateQuotationInput();
    this.sales_error = false;
    this.quotationTotal = 0;
    this.squotationTotal = "0",
  		this.active_sales =[];
        this.active_contact =[]; 
        
      this.getDiscounts();
      this.getQuotationProduct(); 
      this.subTotal = 0;
  		this._quoatationService.getQuotationRevisionForEdit(this.id).subscribe(result=>{
  			if(result.quotation!=null){         
          this.quotationList = result.quotation;
          
          this.loading = false;
          if(this.quotationList.isVat==true){
            this.isvatswitch=true;
          this.Totalamount=(this.quotationList.vatAmount)+(this.quotationList.total);
          this.sTotalamount=this.Totalamount.toLocaleString('en'); 
          }
          else
          {
              this.sTotalamount=this.quotationList.totalFormat;
          } 
          this.active_competators = [{id:this.quotationList.compatitorId,text:this.quotationList.compatitorName}];
          this.active_reason = [{id:this.quotationList.reasonId,text:this.quotationList.reasonName}];
          this.quotation.id = this.quotationList.id;
          this.quotation.refNo = this.quotationList.refNo;
          this.quotation.termsandCondition = this.quotationList.termsandCondition;
          this.quotation.inquiryId = this.quotationList.inquiryId;
          this.quotation.mileStoneId = this.quotationList.mileStoneId;
          this.quotation.optional = this.quotationList.optional;
          this.quotation.reasonRemark = this.quotationList.reasonRemark;
          this.submitted = this.quotationList.submitted;
          this.quotation.poNumber = this.quotationList.poNumber;
          this.quotation.isVat = this.quotationList.isVat;
          this.quotation.vat = this.quotationList.vat;
          this.quotation.vatAmount = this.quotationList.vatAmount;
          if(this.quotationList.compatitorId)
          this.quotation.compatitorId = this.quotationList.compatitorId;
          if(this.quotationList.reasonId)
          this.quotation.reasonId = this.quotationList.reasonId;
          
          this.quotation.poNumber = this.quotationList.poNumber;

          if(this.quotationList.attentionContactId){
            this.active_contact = [{id: this.quotationList.attentionContactId, text:this.quotationList.attentionName}];
            this.quotation.attentionContactId = this.quotationList.attentionContactId;
            this.getEmailAndPhone(this.quotationList.attentionContactId);
          }
          this.quotation.name = this.quotationList.name;
          if(this.quotationList.email){
            this.active_email = [{id:0,text:this.quotationList.email}];
            this.quotation.email = this.quotationList.email;
          }
          if(this.quotationList.mobileNumber){
            this.active_phone = [{id:0,text:this.quotationList.mobileNumber}];
            this.quotation.mobileNumber = this.quotationList.mobileNumber;
          }
          if(this.quotationList.total){
            this.quotationTotal = this.quotationList.total;
            this.squotationTotal = this.quotationList.totalFormat;
          }else{
            this.quotationTotal = 0;
          }
          if(this.quotationList.newCompanyId){
            this.quotation.newCompanyId = this.quotationList.newCompanyId;
            this.active_company = [{id: this.quotationList.newCompanyId, text: this.quotationList.companyName}];
            this.getContacts(this.quotationList.newCompanyId);
          }
          if(this.quotationList.salesPersonId){
            this.active_sales = [{id: this.quotationList.salesPersonId,text: this.quotationList.salesPersonName}];
            this.quotation.salesPersonId = this.quotationList.salesPersonId;
          }
          this.quotation.quotationStatusId = this.quotationList.quotationStatusId;
          this.quotation.won = this.quotationList.won;
          this.quotation.lost = this.quotationList.lost;
          this.quotation.submitted = this.quotationList.submitted;
          

          this._quotationStatusService.getQuotationStatus(this.filterText).subscribe(result=>{
          if(result.items!=null){
            this.quotationStatus = result.items;
            this.stat_all =[];
            
            this.quotationStatus.forEach((stat:{id:number, name:string})=>{
                  //console.log(this.quotation.submitted,'Submitted.....');
                 this.stat_all.push({
                      id:stat.id,
                      name:stat.name,
                      stat_switch:stat.name=='Won'?this.quotation.won:false || stat.name=='Lost'?this.quotation.lost:false || stat.name=='Submitted'?this.quotation.submitted:false,
                      switch_disable:false
                    });
            });
          
          }
      });
  			}
          });
          
          this._select2Service.getCompatitorCompany().subscribe((result)=>{
            this.competators = [];
            if(result.select2data!=null){
              this.competitor_data = result.select2data;
              this.competitor_data.forEach((compte:{id:number,name:string})=>{
                this.competators.push({
                  id:compte.id,
                  text: compte.name
                })
              });
            }
       });
      

      
      this._select2Service.getCompanyWithSales().subscribe(result=>{
		  //console.log(result,'data');
              if(result.selectCompdata!=null){
				  console.log(result.selectCompdata,'data' );
                  this.company_Dto = result.selectCompdata;
                  this.company = [];
                  this.company_Dto.forEach((comp:{id:number,name:string})=>{
                      this.company.push({
                        id:comp.id,
                        text:comp.name
                      });
                  });
                  //SalesMan Id get and set
                  if( (this.company_Dto!=null || this.company_Dto!=undefined) && (this.quotationList.newCompanyId) ){
                  var index = this.company_Dto.findIndex(x=> x.id==this.quotationList.newCompanyId);
				  //console.log(this.quotationList.salesPersonId,'personId');
				  //console.log(this.company_Dto[index].salesManId,'salesmanId');
                  if(!this.quotationList.salesPersonId && this.company_Dto[index].salesManId){
                      this.active_sales = [{id: this.company_Dto[index].salesManId,text: this.company_Dto[index].salesMan}];
                      this.quotation.salesPersonId = this.company_Dto[index].salesManId;
                      this.sales_error = true;
                  }else if(this.quotationList.salesPersonId){
                      this.active_sales = [{id: this.quotationList.salesPersonId,text: this.quotationList.salesPersonName}];
                      this.quotation.salesPersonId = this.quotationList.salesPersonId;
                  }else{
                      this.active_sales = [];
                      this.quotation.salesPersonId = null;
                  }
                }
              }
          });
          this.modal.show();
  }
  onShown(): void {
        
  }
  getQuotationProduct(){
    this._quoatationService.getQuotationProduct(this.id).subscribe(result=>{
          if(result!=null){
            console.log(result,' Quotation Product ');
              this.q_product = result;
          }
      });
  }

  
  getContacts(companyId:number){
	  this._select2Service.getCompanyContacts(companyId).subscribe(result=>{
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
  selectCompany(data:any){
      this.quotationList.newCompanyId = data.id;
      this.quotation.newCompanyId = data.id;
      this.active_phone = [];
      this.active_email = [];
      var index = this.company_Dto.findIndex(x=> x.id==data.id);
      if(this.company_Dto[index].salesManId){
          this.active_sales = [{id: this.company_Dto[index].salesManId,text: this.company_Dto[index].salesMan}];
          this.quotation.salesPersonId = this.company_Dto[index].salesManId;
      }else{
          this.active_sales = [];
          this.quotation.salesPersonId = null;
      }
        this.active_contact = [];
        this.quotationList.attentionContactId = null;
        this.quotation.attentionContactId = null;
      this.getContacts(data.id);
    }
    removeCompany(data:any){
      this.quotationList.newCompanyId = null;
      this.quotationList.attentionContactId = null;
      this.quotation.newCompanyId = null;
      this.quotation.attentionContactId = null;
      this.active_sales =[];
      this.active_contact = [];
      this.active_phone = [];
      this.active_email = [];
      this.quotation.email =null;
      this.quotation.mobileNumber = null;
    }
    public selectedStage(value:any):void {
      this.quotation.stageId = value.id;
    }
    public removedStage(value:any):void {
    }
    selectedCompetitor(data:any){
        this.quotation.compatitorId = data.id;
        this.active_competators = [{id:data.id,text:data.text}];
      }
    removedCompetitor(data:any){
        this.quotation.compatitorId = null;
        this.active_competators = [];
      }

    selectedReason(data:any){
        this.quotation.reasonId = data.id;
        this.active_reason = [{id:data.id,text:data.text}];
      }
    removedReason(data:any){
        this.quotation.reasonId = null;
        this.active_reason = [];
      }

    selectSalesMan(data:any){
      this.quotationList.salesPersonId = data.id;
      this.quotation.salesPersonId = data.id;
    }
    removeSalesMan(data:any){
      this.quotationList.salesPersonId = null;
      this.quotation.salesPersonId = null;
    }
    selectContact(data:any){
      this.active_contact =[{id:data.id,text:data.text}];
      this.quotationList.attentionContactId = data.id;
      this.quotation.attentionContactId =data.id;
      this.active_phone = [];
      this.active_email = [];
      this.quotation.email =null;
      this.quotation.mobileNumber = null;
      this.getEmailAndPhone(data.id);
    }
    removeContact(data:any){
      this.quotationList.attentionContactId = null;
      this.quotation.attentionContactId = null;
      this.active_contact =[];
      this.active_phone = [];
      this.active_email = [];
      this.quotation.email =null;
      this.quotation.mobileNumber = null;
    }
    getEmailAndPhone(data){
        this._select2Service.getContactEmail(data).subscribe(result=>{
            if(result.select2data!=null){
            this.con_email_dto = result.select2data;
            this.con_email = [];

            this.con_email_dto.forEach((con:{id:number,name:string})=>{
                this.con_email.push({
                    id:con.id,
                    text: con.name
                });
            });
        }
        });
        this._select2Service.getContactMobile(data).subscribe(result=>{
            if(result.select2data!=null){
            this.con_phone_dto = result.select2data;
            this.con_phone = [];

            this.con_phone_dto.forEach((con:{id:number,name:string})=>{
                this.con_phone.push({
                    id:con.id,
                    text: con.name
                });
            });
        }
        });
    }
    
    close(): void {
      this.modal.hide();
  }

    selectEmail(data:any){
      this.quotation.email = data.text;
    }
    removeEmail(data:any){
      this.quotation.email = null;
    }
    selectPhone(data:any){
      this.quotation.mobileNumber = data.text;
    }
    removePhone(data:any){
      this.quotation.mobileNumber = null;
    }
    
    
    
    getDiscounts(){
        this._tenantDashboardService.getDiscountForEdit(1).subscribe(result=>{
            if(result.discount!=null){
                this.discountInput =  result.discount;
            }
        });
    }
}