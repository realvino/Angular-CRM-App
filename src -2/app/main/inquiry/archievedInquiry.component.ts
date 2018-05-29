import { Component, ViewChild, Injector, Renderer,ElementRef,Input, Output, EventEmitter, OnInit, AfterViewInit ,OnDestroy} from '@angular/core';
import { ModalDirective,TabsetComponent } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Select2ServiceProxy, Datadto, InquiryServiceProxy, InquiryListDto,QuotationListDto, InquiryInputDto, EnqActList, Sourcelist, CompanyServiceProxy, CompanyCreateInput, DesignationInputDto, LocationInputDto, EnquiryContactServiceProxy,EnquiryUpdateInputDto,EnquiryUpdateServiceProxy,NewCompanyContactServiceProxy,CreateAddressInfo,CreateContactInfo,CreateCompanyOrContact,IndustryInputDto,IndustryServiceProxy,LeadDetailInputDto, Select2TeamDto, CheckInquiryInput, JobActivityList, QuotationServiceProxy, Datadto3, Select2CompanyDto, NullableIdDto, SalesmanChange, EnquiryJunkUpdateInputDto, Stagedto } from "shared/service-proxies/service-proxies";
import {Jsonp} from '@angular/http';
import { ActivatedRoute,Router } from '@angular/router';
import * as _ from "lodash";
import { ISlimScrollOptions } from 'ng2-slimscroll';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import * as moment from "moment";

export interface SelectOption{
   id?: number;
   text?: string;
}

@Component({
    selector: 'archievedInquiryModal',
    templateUrl: './archievedInquiry.component.html',
    styleUrls: ['./createOReditModal.component.less']

})
export class ArchievedInquiryComponent extends AppComponentBase implements AfterViewInit{

    lead_source_enable: boolean = false;
    designerr: boolean = false;
    companyDetailsDto:Select2CompanyDto = new Select2CompanyDto();
    activities:any=[];
      @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
      @ViewChild('departmentCombobox') departmentCombobox: ElementRef;
  
      @ViewChild('modal') modal: ModalDirective;
      @ViewChild('nameInput') nameInput: ElementRef;
      @ViewChild('companyCombobox') companyCombobox: ElementRef;
      @ViewChild('accountCombobox') accountCombobox: ElementRef;
      @ViewChild('dataTable') dataTable: DataTable;
      @ViewChild('paginator') paginator: Paginator;
      @ViewChild('staticTabs') staticTabs: TabsetComponent;

      active_tagdept:SelectOption[]; departments:any=[]; depts: Datadto[] = [];
      disabled_indus:boolean = false;
      active_tagCountry: SelectOption[];
      active_tagCompany: SelectOption[];
      active_desg: SelectOption[];
      active_location: SelectOption[];
      active_assigned:SelectOption[];
      salesimg:string = null;
      co_ordimg:string = null;
      desimg:string = null;
      salesName:string = null;
      co_ordName:string = null;
      desName:string = null;
      private designation:Array<any> = [];
      private leaddetails:boolean = true;
      linkedContacts:any = [];
      radioitems:any=[];
      quoat_view:boolean = false;  
    enqActivityList:any=[];
    filter:string =''; 
    active_team:SelectOption[] = [];
    additional:boolean = true;
    active_whybafco:SelectOption[];
    active_opportunity:SelectOption[];
    inquiry:InquiryListDto = new InquiryListDto();
    contact_edit: CreateCompanyOrContact = new CreateCompanyOrContact();
      designations: Datadto[] = [];
      Sources :Sourcelist[];
      AssignedBy_data:Datadto[] = [];
      actTypes: Datadto[];
    public myForm: FormGroup;
      @Output() updateCompany = new EventEmitter<any>();
  
      active = false;
      private id: number;
      assigned:boolean=false;
      linked_disabled:boolean=false;
      opts: ISlimScrollOptions;
      set_opacity:string='1';
      assignedBy:Array<any>=[];
    formdata:any=[];
     dataCon: any=[];
     types:Datadto[];
     active_title:SelectOption[];
     private title:Array<any> = [];
     active_company:SelectOption[];
     new_company_id:number=0;
     new_title_id:number=0;
     cusTypeId:number=0;
     cmpname:string='';
     lname:string='';
    radio_val:string='All';
     active_indus:SelectOption[];
     active_status:SelectOption[];
     status_enable:boolean=false;
     active_lead_category:SelectOption[];
     active_lead_source:SelectOption[];
     active_sales:SelectOption[];
     active_coord:SelectOption[];
     active_designer:SelectOption[];
     saveLeadDetailInput:LeadDetailInputDto = new LeadDetailInputDto();
     active_competators:SelectOption[]=[];
     active_lead_save_category:SelectOption[];
     which_located:string='';
     which_act:number = 0;
     lead_Category:string='';
     lead_Source:string='';
     lead_Sales:string='';
     lead_Coord:string='';
     lead_Designer:string='';
     ViewLinkedDetails:boolean=false;
     ViewJob:boolean=false;
     non_editable:boolean=false;
     closedDate:string;
     lastActivity:string;
  
     filterText: string = '';
     inquiryId:number;
      quotations:QuotationListDto[];
      active_department:SelectOption[]=[];
  
      constructor(
          injector: Injector,
          private _inquiryServiceProxy: InquiryServiceProxy,
          private _select2Service: Select2ServiceProxy,
          private _companyServiceProxy: CompanyServiceProxy,
          private _enquiryContactService: EnquiryContactServiceProxy,
          private renderer:Renderer,
          private _enquiryUpdateServiceProxy: EnquiryUpdateServiceProxy,
          private _jsonp: Jsonp,
          private _fb: FormBuilder,
          private _cfb: FormBuilder,
          private _quoatationService: QuotationServiceProxy,
          private route: ActivatedRoute,
          private router: Router,
          private _newCompanyContactServiceProxy:NewCompanyContactServiceProxy,
          private _industryServiceProxy:IndustryServiceProxy
      ){
          super(injector);
    
      }
      ngAfterViewInit(): void {
      
      }

      
     show(inquiryId?: number) {
      this.inquiryId = inquiryId;
      this.staticTabs.tabs[0].active = true;
         this._enquiryContactService.getEnquiryWiseEnquiryContact(inquiryId).subscribe(contacts => {
         this.linkedContacts = contacts.items;
         if(contacts.items!=null){
            if(this.linkedContacts.length>0){
              this.linked_disabled = true;
              }
         }
      });
         this.getJobActivity();
         this.getEnquiryQuotations();
         this.getEnquiryActivity();
         
         this.radioitems = [];
         var the_arr = this.router.url.split('/');
         the_arr.pop();
         this.which_located = the_arr[3];
         this.which_act = 1;
         if(this.which_located=='sales-enquiry'){
              this.non_editable = true;
         }
         this._select2Service.getActivityTypes().subscribe((result) =>{
            if (result.select2data != null) {
                this.radioitems.push({id:0,name:'All'});
                this.actTypes = result.select2data;
                this.actTypes.forEach((activity:{id:number,name:string}) =>{
                  this.radioitems.push({
                    id:activity.id,
                    name:activity.name
                });
                });
                
            }
  
         });
        
           this._select2Service.getDesignation().subscribe((result) => {
             this.designation = [];
             if (result.select2data != null) {
              this.designations = result.select2data;
  
                this.designations.forEach((desg:{id:number, name:string}) => {
                this.designation.push({
                         id: desg.id,
                         text: desg.name
                });
               });
             } });
           
         this._inquiryServiceProxy.getInquiryForEdit(inquiryId).subscribe((result) => {
          
             this.Sources = result.selectedSource;
             if(result.inquiryDetails!=null){
  
                  this.co_ordimg = result.inquiryDetails.coordinatorImage;
                  this.co_ordName = result.inquiryDetails.coordinatorName;
                  this.desimg = result.inquiryDetails.designerImage;
                  this.desName = result.inquiryDetails.designerName;
                  
                  if(result.inquiryDetails.designerId){
                    this.designerr = true;
                      this.active_designer = [{"id":result.inquiryDetails.designerId,"text":result.inquiryDetails.designerName}];
                      this.lead_Designer = result.inquiryDetails.designerName;
                  }else{
                    this.active_designer=[];
                  }
                  if(result.inquiryDetails.coordinatorName){
                      this.active_coord = [{"id":result.inquiryDetails.coordinatorId,"text":result.inquiryDetails.coordinatorName}];
                      this.lead_Coord = result.inquiryDetails.coordinatorName;
                  }else{
                    this.active_coord =[];
                  }
                  if(result.inquiryDetails.salesManagerName){
                    this.active_sales = [{"id":result.inquiryDetails.salesManagerId,"text":result.inquiryDetails.salesManagerName}];
                    this.lead_Sales = result.inquiryDetails.salesManagerName;
                  }else{
                    this.active_sales = [];
                  }
                 
                  if(result.inquiryDetails.leadTypeName){
                    this.active_lead_save_category = [{"id":result.inquiryDetails.leadTypeId,"text":result.inquiryDetails.leadTypeName}];
                    this.lead_Category = result.inquiryDetails.leadTypeName;
                  }else{
                    this.active_lead_save_category =[];
                  }
  
                  this.saveLeadDetailInput.id = result.inquiryDetails.id?result.inquiryDetails.id:null;
                  this.saveLeadDetailInput.leadSourceId = result.inquiryDetails.leadSourceId?result.inquiryDetails.leadSourceId:null;
                  this.saveLeadDetailInput.leadTypeId = result.inquiryDetails.leadTypeId?result.inquiryDetails.leadTypeId:null;;
                  this.saveLeadDetailInput.salesManagerId = result.inquiryDetails.salesManagerId?result.inquiryDetails.salesManagerId:null;;
                  this.saveLeadDetailInput.coordinatorId = result.inquiryDetails.coordinatorId?result.inquiryDetails.coordinatorId:null;;
                  this.saveLeadDetailInput.designerId = result.inquiryDetails.designerId?result.inquiryDetails.designerId:null;;
                  this.saveLeadDetailInput.inquiryId = result.inquiryDetails.inquiryId?result.inquiryDetails.inquiryId:null;;
                  this.saveLeadDetailInput.estimationValue = result.inquiryDetails.estimationValue;
                  this.saveLeadDetailInput.size = result.inquiryDetails.size;
  
             }
             if (result.inquirys != null) {
              if(result.inquirys.statusName =="New" || result.inquirys.disableQuotation == true)
              {
               this.quoat_view = false;
              }
              if(result.inquirys.closureDate){
                this.closedDate = moment(result.inquirys.closureDate).format('MM/DD/YYYY');
              }
              
              if(result.inquirys.lastActivity){
                this.lastActivity = moment(result.inquirys.lastActivity).format('MM/DD/YYYY');
              }
  
             if(result.inquirys.mileStoneId == 1){
               this.leaddetails = false;
              }  
              this.salesimg = result.inquirys.assignedbyImage;
              this.inquiry = result.inquirys;
              console.log(this.inquiry);
              
  
             
              this.additional = false;
              if(this.inquiry.teamId){
                this.active_team = [{id: this.inquiry.teamId, text: this.inquiry.teamName}];
             }
             if(this.inquiry.industryId){
              this.active_indus = [{id:this.inquiry.industryId,text:this.inquiry.industryName}];
              this.disabled_indus= true;
            }
              this.active_tagCompany = [{id:this.inquiry.companyId,text:this.inquiry.companyName}];
              this.active_indus = [{id:this.inquiry.industryId,text:this.inquiry.industryName}];
              this.active_desg = [{id:this.inquiry.designationId,text:this.inquiry.designationName}];
              console.log(this.active_desg);
              if(this.inquiry.statusId){
                this.active_status = [{id:this.inquiry.statusId,text:this.inquiry.statusName}];
                
              }
              if(this.inquiry.compatitorName){
                this.active_competators = [{id:this.inquiry.compatitorsId,text:this.inquiry.compatitorName}];
                console.log('competetor is',this.inquiry.compatitorName);
              }else{
                this.active_competators =[];
              }
              if(this.inquiry.leadTypeName){
                this.active_lead_category = [{id:this.inquiry.leadTypeId,text:this.inquiry.leadTypeName}];
              }
              if(this.inquiry.locationId){
                this.active_location = [{id:this.inquiry.locationId, text:this.inquiry.locationName}];
              }
  
              if(this.inquiry.whyBafcoName){
                this.active_whybafco = [{id:this.inquiry.whyBafcoId,text:this.inquiry.whyBafcoName}];
                
              }
              if(this.which_located=='sales-enquiry' || this.which_located=='sales-grid'){
                if(this.inquiry.opportunitySourceName){            
                this.lead_Source = this.inquiry.opportunitySourceName;
                this.active_lead_source = [{"id":this.inquiry.opportunitySourceId,"text":this.inquiry.opportunitySourceName}];
                if(this.inquiry.opportunitySourceName == 'Marketing'){ 
                  this.lead_source_enable = true;
                }
              }else{
                this.active_lead_source=[];
              }
           }
           else{
                this.lead_source_enable = true;
           }
             
              if(result.contactEdit!=null){
                console.log(result.contactEdit[0],'ok ok ok');
                  this.formdata=result.contactEdit[0].addressInfo;
                this.dataCon = result.contactEdit[0].contactinfo;
                this.cmpname = result.contactEdit[0].name;
                this.cusTypeId = result.contactEdit[0].newCustomerTypeId;
                this.new_company_id = result.contactEdit[0].companyId;
                this.contact_edit.titleId = result.contactEdit[0].titleId;
                this.lname = result.contactEdit[0].lastName;
                this.contact_edit.id = result.contactEdit[0].id;
                this.contact_edit.industryId = result.contactEdit[0].industryId;
                this.contact_edit.newCustomerTypeId = result.contactEdit[0].newCustomerTypeId;
                this.contact_edit.designationId = result.contactEdit[0].designationId;
                var index = this.designation.findIndex(x => x.id==this.contact_edit.designationId);
              if(index!=-1){
                  this.active_desg = [{id:this.contact_edit.designationId,text:this.designation[index].text}];
              }else{
                this.active_desg =[];
                this.contact_edit.designationId = 0;
              } 
  
              this._select2Service.getTitle().subscribe((result) => {
              if (result.select2data != null) {
                this.types = result.select2data;
                this.title=[];
                  this.types.forEach((titles:{id:number, name:string}) => {
                    this.title.push({
                      id: titles.id,
                      text: titles.name
                    });
          if(this.contact_edit.titleId == titles.id){
                    this.active_title=[{id:titles.id,text:titles.name}];
                    
                  }
                  });
              } 
      });
                         
                this.myForm = this.showConDetails();
                this.addContacts(0);
                this.addAddress(0);
              }else{
                this.myForm = this.showConDetails();
                this.addContacts(1);
                this.addAddress(1);
              }
              var the_arr = this.router.url.split('/');
                          the_arr.pop();
                          var from_location = the_arr[3];
                          console.log(from_location);
                         if(this.inquiry.mileStoneId>=3){
                            this.assigned = true;
                            this._select2Service.getTeamSalesman(this.inquiry.teamId).subscribe(result=>{
                              if(result!=null){
                              this.AssignedBy_data = result.select3data;
                              this.assignedBy = [];
                              this.AssignedBy_data.forEach((assign:{id:number,name:string})=>{
                                this.assignedBy.push({
                                  id:assign.id,
                                  text:assign.name
                                });
                                if(this.inquiry.assignedbyId==assign.id){
                                  this.active_assigned =[{id:assign.id,text:assign.name}];
                                  this.salesName = assign.name;
                                }
                              });
                            }
                            });
                            console.log(this.active_assigned);
                         }
                         if(this.assigned){    
             this._select2Service.getDepartment().subscribe(result => {
  
                     if (result != null ) {
  
                         this.departments =[];
                         this.depts = result.select2data;
  
                         this.depts.forEach((type:{id:number, name:string}) => {
                             this.departments.push({
                                 id: type.id,
                                 text: type.name
                             });
                             if(type.id === this.inquiry.departmentId){
                                 this.active_tagdept = [{id:type.id,text:type.name}];
  
                             }
  
                         });
  
  
  
                     }
  
                 });
           }
  
           
             
  this._select2Service.getCompanyDetails(this.inquiry.companyId ? this.inquiry.companyId:0,this.inquiry.companyName).subscribe((result) => {
    if (result.select2Company != null) {
        this.companyDetailsDto = result.select2Company;
        if(this.companyDetailsDto.email)
        {
          this.inquiry.cEmail = this.companyDetailsDto.email;
        }
        if(this.companyDetailsDto.phonenumber)
        {
          this.inquiry.cLandlineNumber = this.companyDetailsDto.phonenumber;
        }
        if(this.companyDetailsDto.website){
          this.inquiry.cMbNo = this.companyDetailsDto.website;
        }
    }
  });
  
         }
          this.active = true;
          });
        
          this.modal.show();
  }
  showConDetails(){
        return  this._fb.group({
          companyName: [this.cmpname, [Validators.required]],
          lastName: [this.lname, [Validators.required]],
          typeid: this.contact_edit.newCustomerTypeId,
          newtitleid: this.contact_edit.titleId,
          addresses: this._fb.array([]),
          contacts: this._cfb.array([]),
          
          });
  }
  onRadioChange(name:string){
    console.log(name,' activity');
    this.radio_val = name;
  }
  
  
  expand(){
    this.ViewLinkedDetails = this.ViewLinkedDetails?false:true;
  }
  expandJob(){
    this.ViewJob = this.ViewJob?false:true;
  }
  
  getEnquiryActivity():void{ 
          this._inquiryServiceProxy.getEnquiryActivitys(this.filter,this.inquiryId).subscribe((result) => {
              if(result.items != null){
      
                  this.enqActivityList = result.items;
  
              }
  
          });
  
      }
  
    
  onShown(): void {
          $(this.nameInput.nativeElement).focus();
  }
  
  getJobActivity(): void {
    this._inquiryServiceProxy.getJobActivity(this.inquiryId).subscribe(results=> {
      this.activities=results.items;
    });
  }
  
  close() {
    this.active = false;
    this.modal.hide();
  }

  initContact(){
           return this._cfb.group({
              id:0,
              contactinfo: [''],
              infoid: null
          });
      }
  
      addContacts(data) {
          const con = <FormArray>this.myForm.controls['contacts'];
           const addCon = this.initContact();
           if(this.dataCon.length>=1 && !data){
  
            this.dataCon.forEach((country:{infoData:string, newInfoTypeId:number,id:number})=>{
                con.push(
                  this._cfb.group({
                    id:country.id,
              contactinfo: [country.infoData],
              infoid: country.newInfoTypeId
          })
                )
            });
              return 1;
           }
           con.push(addCon);
          }
  
      initAddress() {
        
          return this._fb.group({
              id:0,
              street: [''],
              postcode: [''],
              cityid: null,
              typeid: null,
              company:this.id,
              country:['']
          });
      }
       addAddress(data) {
          const control = <FormArray>this.myForm.controls['addresses'];
          const addrCtrl = this.initAddress();
          if(this.formdata.length>=1 && !data){
              this.formdata.forEach((country:{id:number,address1:string, address2:string,cityId:number,newInfoTypeId:number,newContacId:number,countryName:string}) =>{
              control.push(this._fb.group({
              id: country.id,  
              street: [country.address1],
              postcode: [country.address2],
              cityid: country.cityId,
              typeid: country.newInfoTypeId,
              company:country.newContacId,
              country:country.countryName
          }))
              });
  
           return 1;
          }
          control.push(addrCtrl);
      }
      getEnquiryQuotations(event?: LazyLoadEvent): void {
         let data;
          if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
              data=10;
          }
          else{
              data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
          }
          this.primengDatatableHelper.showLoadingIndicator();
  
          this._inquiryServiceProxy.getEnquiryQuotations(
              this.filterText, this.inquiryId,
              this.primengDatatableHelper.getSorting(this.dataTable),
              data,
              this.primengDatatableHelper.getSkipCount(this.paginator, event)
          ).subscribe(result => {
              this.primengDatatableHelper.totalRecordsCount = result.totalCount;
              this.primengDatatableHelper.records = result.items;
              this.primengDatatableHelper.hideLoadingIndicator();
          });
      } 
      
    }
