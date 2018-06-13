import { Component, ChangeDetectorRef,OnInit, Injector,AfterViewInit,ViewChild } from '@angular/core';
import { appModuleAnimation } from "shared/animations/routerTransition";
import { AppComponentBase } from "shared/common/app-component-base";
import { Router,ActivatedRoute } from "@angular/router";
import { Http } from "@angular/http";
import { Select2ServiceProxy, Datadto, QuotationServiceProxy, QuotationListDto, Select2salesDto, Contactdto, QuotationProductListDto, CreateQuotationInput, TenantDashboardServiceProxy, CreateDiscountInput,QuotationStatusServiceProxy,QuotationStatusList, NullableIdDto, EnquiryUpdateServiceProxy, QuotationStatusUpdateInput, EnquiryUpdateInputDto, QuotationRevisionInput } from "shared/service-proxies/service-proxies";
import { CreateQuotationSectionModalComponent } from "./create-or-edit-quotation-section.component";
import { CreateQuotationProductModalComponent } from "./create-or-edit-quotation-product.component";
import { ProductImportModalComponent } from "./product-import-modal.component";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import {ProductServiceProxy} from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { QuotationPreviewModalComponent } from "./quotation-preview.component";
import { ProductChangeModalComponent } from "./unlock-product.component";
import { AppConsts } from "shared/AppConsts";
import { RevisedQuotationComponent } from 'app/main/quotation/revisedQuotationComponent';
import { DiscountModalComponent } from '@app/main/quotation/discount.component';
import * as moment from "moment";

export interface SelectOption{
  id?:number,
  text?:string
}
@Component({
    templateUrl: './quotation_edit.component.html',
    styleUrls: ['./custom.component.css'],
    animations: [appModuleAnimation()]
})
export class QuotationEditComponent extends AppComponentBase implements OnInit,AfterViewInit {
  svatamount: string;
  showStage: boolean;
  submitted: boolean;
  ViewLinkedDetails: boolean;

@ViewChild('createQuotationSectionModal') createQuotationSectionModal: CreateQuotationSectionModalComponent;
@ViewChild('createQuotationProductModal') createQuotationProductModal  : CreateQuotationProductModalComponent;
@ViewChild('ProductImportModal') ProductImportModal: ProductImportModalComponent;
@ViewChild('quotationPreviewModal') quotationPreviewModal: QuotationPreviewModalComponent;
@ViewChild('productChangeModal') productChangeModal: ProductChangeModalComponent;
@ViewChild('RevisedQuotationModel') RevisedQuotationModel: RevisedQuotationComponent;
@ViewChild('discountModal') discountModal: DiscountModalComponent;
@ViewChild('dataTable') dataTable: DataTable;
@ViewChild('paginator') paginator: Paginator;
disemailinput:NullableIdDto=new NullableIdDto();
negotiationSwitch:boolean = false;
filterText: string = '';
  competitor_data:Datadto[];
  competators:Array<any>;
  active_competators:SelectOption[]=[];
  reason_data:Datadto[];
  reasons:Array<any>;
  active_reason:SelectOption[]=[];
  quotations :QuotationListDto[] = [];
  revisedQuotationArray:Array<any>;
  quotationRevisedArrayCount:number = 0;
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
  statusId:number;
  pointenable:string="yes";
  q_product:Array<any>;
  saving:boolean = false;
  quotationTotal:number = 0;
  squotationTotal:string;
  active_email:SelectOption[];
  con_email:Array<any>;
  con_email_dto:Datadto[];
  allowedChars = new Set('0123456789'.split('').map(c => c.charCodeAt(0)));
  active_phone:SelectOption[];
  con_phone:Array<any>;
  con_phone_dto:Datadto[];

  path : string = AppConsts.remoteServiceBaseUrl;

  status:boolean=false;
  sales_error:boolean = false;
  discountInput:CreateDiscountInput = new CreateDiscountInput();
  quotationStatus:QuotationStatusList[];
  stat_all:Array<any>;

  nextActivity:string;
  QStatusUpdateInput: QuotationStatusUpdateInput = new QuotationStatusUpdateInput();
  updateInquiryIn: EnquiryUpdateInputDto = new EnquiryUpdateInputDto();
  QRevisionInput: QuotationRevisionInput = new QuotationRevisionInput();

  enq_id: number;

   constructor(
        injector: Injector,
        private _http: Http,
        private router: Router,
        private _activatedRoute: ActivatedRoute,
        private _select2Service: Select2ServiceProxy,
        private _quoatationService: QuotationServiceProxy,
        private cdr: ChangeDetectorRef,
        private _tenantDashboardService:TenantDashboardServiceProxy,
        private _quotationStatusService:QuotationStatusServiceProxy,
        private _enquiryUpdateService: EnquiryUpdateServiceProxy
    )
    {
        super(injector); 
        this._activatedRoute.params.subscribe(params => {
            this.id = +params['id'];   
            this.enq_id = +params['enq_id'];
      	});
        // console.log(this.id,this.enq_id);

    }
  ngOnInit() {
    this.pointenable ="yes";
    var the_arr = this.router.url.split('/');
    the_arr.pop();
    this.which_located = the_arr[3];
    if(this.which_located=='openquotation')
    {
       this.non_editable = true;
    }
    this.loading = true;
    this.quotationList = new QuotationListDto();
    this.quotation = new CreateQuotationInput();
    this.sales_error = false;
    this.quotationTotal = 0;
    this.squotationTotal = "0",
  		this.active_sales =[];
        this.active_contact =[]; 
        this.getData();
        this.getDiscounts();
      // console.log(this.company,'Data company');  
      this.getQuotationProduct(); 
      this.subTotal = 0;
      this._quoatationService.getInquiryWiseQuotation(this.id).subscribe(result => {
        this.quotations = result.items;
       });
  		this._quoatationService.getQuotationForEdit(this.id).subscribe(result=>{
  			if(result.quotation!=null){         
          this.quotationList = result.quotation;
          this.Totalamount = this.quotationList.total;
          if(this.quotationList.negotiation == true){
            this.negotiationSwitch = true;
            this.quotation.overAllDiscountAmount = this.quotationList.overAllDiscountAmount;
            this.quotation.overAllDiscountPercentage = this.quotationList.overAllDiscountPercentage;
            this.Totalamount = this.Totalamount - this.quotationList.overAllDiscountAmount;
            this.sTotalamount=this.Totalamount.toLocaleString('en', { minimumFractionDigits: 2 }); 
          }
          console.log(this.quotationList);
          this.loading = false;
          if(this.quotationList.isVat==true){
            this.isvatswitch=true;
          this.Totalamount=(this.quotationList.vatAmount)+(this.Totalamount);
          this.sTotalamount=this.Totalamount.toLocaleString('en', { minimumFractionDigits: 2 }); 
          this.svatamount=this.quotationList.vatAmount.toLocaleString('en', { minimumFractionDigits: 2 }); 
          }
          else
          {
            this.sTotalamount=this.Totalamount.toLocaleString('en', { minimumFractionDigits: 2 });

          }  
          if(this.quotationList.compatitorId){
            this.quotation.compatitorId = this.quotationList.compatitorId;
            this.active_competators = [{id:this.quotationList.compatitorId,text:this.quotationList.compatitorName}];
          }
          if(this.quotationList.reasonId){
            this.quotation.reasonId = this.quotationList.reasonId;
            this.active_reason = [{id:this.quotationList.reasonId,text:this.quotationList.reasonName}];
          }
          if(this.quotationList.discountEmail== true || this.quotationList.won == true || this.quotationList.lost == true)
          {
            this.pointenable = "no";
          }
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
          this.quotation.revisionId = this.quotationList.revisionId;
          this.statusId = this.quotationList.quotationStatusId;
          this.quotation.stageId = this.quotationList.stageId;
          this.quotation.refQNo = this.quotationList.refQNo;
          this.quotation.rfqNo = this.quotationList.rfqNo;
          this.quotation.total = this.quotationList.total;
          this.quotation.discountEmail = this.quotationList.discountEmail;

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
            if(this.quotationList.quotationStatusId == 3)
            {
              let revised_ind = this.stat_all.findIndex(x=> x.name == "Revised");

              this.stat_all[revised_ind].stat_switch = true;

            }
          
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
       this._select2Service.getEnquiryStages(6).subscribe(result=>{
        if (result.select2data != null) {
            this.stage_list = result.select2data;
            this.stages = [];
           this.stage_list.forEach((stage: {id: number, name: string}) => {
             this.stages.push({
               id: stage.id,
               text: stage.name,
             });
           });
        }
      });
       this._select2Service.getLeadReason().subscribe((result)=>{
        this.reasons = [];
        if(result.select2data!=null){
          this.reason_data = result.select2data;
          this.reason_data.forEach((compte:{id:number,name:string})=>{
            this.reasons.push({
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

  }
  ngAfterViewInit(): void {

  }
  getQuotationProduct(){
    this._quoatationService.getQuotationProduct(this.id).subscribe(result=>{
          if(result!=null){
            console.log(result,' Quotation Product ');
              this.q_product = result;
              // this.subTotal = result[0].subtotal;
          }
      });
  }
  goToCompany(){
   
    this.router.navigate(['app/main/quotation']);
  
  }
  check(event: KeyboardEvent) {
    if (event.keyCode > 31 && !this.allowedChars.has(event.keyCode)) {
      event.preventDefault();
    }
  }

  save() {
    this.quotation.negotiation = this.negotiationSwitch;
    this.quotation.name = this.quotation.name ? this.quotation.name : null;
    this.quotation.overAllDiscountAmount = this.quotation.overAllDiscountAmount ? this.quotation.overAllDiscountAmount : 0 ;
    this.quotation.overAllDiscountPercentage = this.quotation.overAllDiscountPercentage ? this.quotation.overAllDiscountPercentage : 0;

    if(this.statusId != 3 && this.quotation.quotationStatusId == 3)
    {
       this.QRevisionInput.id = this.id;
       let lst= moment(moment(this.nextActivity).toDate().toString());
       this.QRevisionInput.nextActivity = moment(lst).add(6,'hours');
      this._quoatationService.quotationRevision(this.QRevisionInput).subscribe(result=>{
        if(result){
          console.log(result);
          this.notify.success("Quotation Revised successfully");
          this.redirectQuotation(result);
        }
       });
    }
    
    else
    {
      this.saving = true;
      this.quotation.isVat = this.isvatswitch;
      if (this.quotation.id == null) {
        this.quotation.id = 0;
       }
      if (this.quotation.inquiryId == 0) {
        this.quotation.inquiryId = null;
       }
    if (this.quotation.mileStoneId == 0) {
     this.quotation.mileStoneId = null;
     }
      this.quotation.customerId = "null";
      console.log(this.quotation);
      if(this.statusId !=2 && this.quotation.quotationStatusId == 2){
        let lst= moment(moment(this.nextActivity).toDate().toString());
        this.quotation.nextActivity = moment(lst).add(6,'hours');
      }
      this._quoatationService.createOrUpdateQuotation(this.quotation)
         .finally(() => this.saving = false)
         .subscribe((result) => {
          if(result){
           this.notify.success(this.l('SavedSuccessfully'));
           this.ngOnInit();
          }
      });
    }
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
    createSection(){
      this.createQuotationSectionModal.show(0,this.id);
    }
    createQuotationProduct(){
    	this.createQuotationProductModal.show(0,this.id,this.quotation.newCompanyId);
    }
    productEdit(product){
      this.createQuotationProductModal.show(product.id,this.id,this.quotation.newCompanyId);
    }
    deleteProduct(product){
      this.message.confirm(
          this.l('Are you sure to Delete the Quotation Product', product),
              isConfirmed => {
              if (isConfirmed) {
                  this._quoatationService.deleteQuotationProduct(product.id).subscribe(result=>{
                      this.ngOnInit();
                      this.notify.success("Deleted successfully");
                  });
              }
          }
      );
  }

    relock(product){
    //   if(this.isGranted('Pages.Tenant.Quotation.Quotation.Edit.QuotationProductLink')){
    //       this.message.confirm(
    //         this.l('Are you sure to link the Product'),
    //             isConfirmed => {
    //             if (isConfirmed) {
    //                 /*this._quoatationService.getQuotationProductUnlock(product).subscribe(result=>{
    //                     this.ngOnInit();
    //                     this.notify.success("Unlocked successfully");
    //                 });*/
    //                 this.productChangeModal.show(product);                 
    //               }
    //         }
    //     );
    //   }
    }
    
    getRevisedQuotation(event?: LazyLoadEvent){
      let data;
        
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }
        this.primengDatatableHelper.showLoadingIndicator();

        this._quoatationService.getRevisedQuotation(this.id).subscribe(result => {
            this.quotationRevisedArrayCount = result.totalCount;
            this.revisedQuotationArray = result.items;
            console.log(this.revisedQuotationArray);
            this.primengDatatableHelper.hideLoadingIndicator();
        });
    }

    editRevisedQuotation(data){
      this.RevisedQuotationModel.show(data.id);
    }
   
   editQuotation(data): void {
      if(this.enq_id > 0){
         this.router.navigate(['app/main/sales-enquiry/'+data.id,this.enq_id]);
      }
      else{
        this.router.navigate(['app/main/quotation/'+data.id,this.enq_id]);
     }
     this.id = data.id;
     this.ngOnInit();
   }
   redirectQuotation(data): void {
     if(this.enq_id > 0){
        this.router.navigate(["app/main/sales-enquiry/",data,this.enq_id]);  
     }else{
        this.router.navigate(['app/main/quotation/'+data,this.enq_id]);
     }
      this.id = data;
      this.ngOnInit();
      this._quoatationService.getRevisedQuotation(data).subscribe(result => {
         this.quotationRevisedArrayCount = result.totalCount;
         this.revisedQuotationArray = result.items;
         this.primengDatatableHelper.hideLoadingIndicator();
      });
  }
    expand(){
      this.ViewLinkedDetails = this.ViewLinkedDetails?false:true;
    }
    productUpload(){
      this.ProductImportModal.show(this.id);
    }
    goToQuotation(){
      if(this.enq_id > 0){
        this.router.navigate(['app/main/sales-enquiry']);
      }
      else{
        this.router.navigate(['app/main/quotation']);
      }
       //this.router.navigate(['app/main/quotation']);
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
    sectionEdit(quot_product:any){
      this.createQuotationSectionModal.show(quot_product.sectionId,this.id)
    }
    setDiscount(){
      this.discountModal.show(this.id)
    }
    getData(event?: LazyLoadEvent){
      let data;
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }
        this.primengDatatableHelper.showLoadingIndicator();

        this._quoatationService.getImportHistory(
            this.id,
            this.primengDatatableHelper.getSorting(this.dataTable),
            data,
            this.primengDatatableHelper.getSkipCount(this.paginator, event)
        ).subscribe(result => {
            this.primengDatatableHelper.totalRecordsCount = result.totalCount;
            this.primengDatatableHelper.records = result.items;
            this.primengDatatableHelper.hideLoadingIndicator();
        });
    }
    quot_preview(i:number){
      this.quotationPreviewModal.show(this.id,i);
    }
    getDiscounts(){
        this._tenantDashboardService.getDiscountForEdit(1).subscribe(result=>{
            if(result.discount!=null){
                this.discountInput =  result.discount;
            }
        });
        //console.log(this.discountInput.unDiscountable, "GetDiscounts");
    }
    
    isValidQuotation(data){
      if(this.quotation.lost == true){
        if(!data.form.valid || !this.quotation.compatitorId || !this.quotation.reasonId || !this.quotation.reasonRemark){
          return true;
        }
        else{
          return false;
        }
      }
      else if((this.statusId !=2 && this.quotation.quotationStatusId == 2) || (this.statusId !=3 && this.quotation.quotationStatusId == 3)){
        if(!data.form.valid || !this.nextActivity){
          return true;
        }
        else{
          return false;
        }
      }
      else{
        if(!data.form.valid){
          return true;
        }
        else{
          return false;
        }
      }
      
    }

    sendDiscountMail(): void {
      this.message.confirm(
          this.l('Are you sure want to send Discount Mail'),
          isConfirmed => {
              if (isConfirmed) {
                this.disemailinput.id = this.id;
                this._quoatationService.sendDiscountMail(this.disemailinput)
              .finally(() => { this.saving = false; }).subscribe((result) => {
                if(result){
                  this.ngOnInit();
                 this.notify.success('Email Send Successfully');
                }
            });
            }
          }
      );
    }
    discountApproveAll(): void {
      this.message.confirm(
          this.l('Are you sure want to approve Discount for all Quotation Product'),
          isConfirmed => {
              if (isConfirmed) {
                this.disemailinput.id = this.id;
                this._quoatationService.overAllApproveQuote(this.disemailinput)
              .finally(() => { this.saving = false;
                this.ngOnInit();
                this.saving = false; 
                this.notify.success('Discount Approved Successfully');
               }).subscribe((result) => {
                if(result){
                  this.ngOnInit();
                 this.notify.success('Discount Approved Successfully');
                }
            });
            }
          }
      );
    }
    getQuotationStatusId(name:string,status_val:boolean){
      this.showStage = false;
      var index = this.stat_all.findIndex(x=> x.name == name);
      var won_index = this.stat_all.findIndex(x=> x.name == 'Won');
      var lost_index = this.stat_all.findIndex(x=> x.name == 'Lost');
      var submitted_index = this.stat_all.findIndex(x=> x.name == 'Submitted');
      var revised_index = this.stat_all.findIndex(x=> x.name == "Revised");
      if(revised_index && name=='Revised'){
        this.stat_all[won_index].switch_disable = false;
        this.stat_all[lost_index].switch_disable = false;
        this.stat_all[submitted_index].stat_switch = false;
        document.getElementById('Revised').click();
      }
      
      if(this.stat_all[won_index].stat_switch && this.stat_all[lost_index].stat_switch && name=='Won'){
          this.stat_all[lost_index].stat_switch = false;
          document.getElementById('Lost').click();
      }
      if(this.stat_all[lost_index].stat_switch && this.stat_all[won_index].stat_switch && name=='Lost'){
          
          document.getElementById('Won').click();
      }
      if(this.stat_all[submitted_index].stat_switch){
        if(this.submitted == false)
        {
         this.showStage = true;
        }
          this.stat_all[won_index].switch_disable = false;
          this.stat_all[lost_index].switch_disable = false;
          this.stat_all[revised_index].stat_switch = false;
      }else{
        this.stat_all[won_index].switch_disable = true;
        this.stat_all[lost_index].switch_disable = true;
        if(this.quotationList.quotationStatusId == 3)
        {
          this.stat_all[revised_index].stat_switch = true;
        }
        
      }
      this.quotation.won = this.stat_all[won_index].stat_switch;
      this.quotation.lost = this.stat_all[lost_index].stat_switch;
      this.quotation.submitted = this.stat_all[submitted_index].stat_switch;
      if(!this.quotation.submitted && this.quotation.won){
        document.getElementById('Won').click(); 
      }else if(!this.quotation.submitted && this.quotation.lost){
          document.getElementById("Lost").click();
      }
      if(status_val){
        this.quotation.quotationStatusId = this.stat_all[index].id;
      }else if(this.quotation.submitted){
        this.quotation.quotationStatusId = this.stat_all[submitted_index].id;
      }else if(!this.quotation.submitted){
        var new_index = this.quotationStatus.findIndex(x=>x.name == 'New');

        this.quotation.quotationStatusId = this.quotationStatus[new_index].id;
      }else{
        this.quotation.quotationStatusId = this.quotationList.quotationStatusId;
      }
      if(!this.quotation.submitted && this.negotiationSwitch){
        document.getElementById('negotiation').click(); 
      }
    }
    getValStat(stat?:string){
      
    }

    getAmount(value,data){
      let tot ;
      if(this.quotationList.isVat==true){
        tot= (this.quotationList.vatAmount)+(this.quotationList.total);
        }
        else
        {
          tot=this.quotationList.total;
        }  
      if(data == 1)
      {
        if(value < tot){
          this.quotation.overAllDiscountPercentage = Math.round((value * 100) / tot);
         }
         else{
          this.notify.warn("DiscountAmount must be less than TotalAmount");
        }
      }
      else{
        if(value < 100){
          this.quotation.overAllDiscountAmount = Math.round((tot * value)/100);
        }
        else{
          this.notify.warn("DiscountPercentage must be less than 100");
        }
      }
    }

    getApproval(data:number,approved){      
      if(this.isGranted('Pages.Tenant.Quotation.Quotation.Edit.QuotationDetails.QuotationproductDiscountApproval')){
        this.message.confirm(
          this.l('Are you sure to Approved the Product'),
                isConfirmed => {
                if (isConfirmed) {
                  this._quoatationService.getApproveProduct(data).subscribe(result=>{
                      this.notify.success("Approved successfully");
                      this.ngOnInit();
                  });
                }
              }
          );
      }else{
        this.message.info("You have no permission for this action");
      }
    }
    goToEnquiry(){
      this.router.navigate(['app/main/sales-enquiry/'+ this.quotation.inquiryId]);
    }
}