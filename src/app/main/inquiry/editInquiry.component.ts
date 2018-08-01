import { Component, ViewChild, Injector, Renderer,ElementRef,Input, Output, EventEmitter, OnInit, AfterViewInit ,OnDestroy,NgZone } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Select2ServiceProxy, Datadto, InquiryServiceProxy, InquiryListDto,QuotationListDto, InquiryInputDto, EnqActList, Sourcelist, CompanyServiceProxy, CompanyCreateInput, DesignationInputDto, LocationInputDto, EnquiryContactServiceProxy,EnquiryUpdateInputDto,EnquiryUpdateServiceProxy,NewCompanyContactServiceProxy,CreateAddressInfo,CreateContactInfo,CreateCompanyOrContact,IndustryInputDto,IndustryServiceProxy,LeadDetailInputDto, Select2TeamDto, CheckInquiryInput, JobActivityList, QuotationServiceProxy, Datadto3, Select2CompanyDto, NullableIdDto, SalesmanChange, EnquiryJunkUpdateInputDto, Stagedto, EntityDto, QuotationRevisionInput } from "shared/service-proxies/service-proxies";
import {Jsonp} from '@angular/http';
import { ActivatedRoute,Router } from '@angular/router';
import * as _ from "lodash";
import { CreateOrEditNewCompanyModalComponent } from "app/main/newCompany/create-or-edit-new-company.component";
import { LinkedContactComponent } from "app/main/inquiry/linkedContact.component";
import { ViewLinkedContactComponent } from "app/main/inquiry/viewLinkedContact.component";
import { CreateOrEditContactNewModalComponent } from "app/main/newContact/create-edit-contact.component";
import { CreateIncActivityModalComponent } from "app/main/inquiry/createActivityModelComponent";
import { createCommentActivityModalComponent } from "app/main/activity_enq/createCommentActivityComponent";
import { ISlimScrollOptions } from 'ng2-slimscroll';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import * as moment from "moment";
import { CreateOrEditNewEnQuotationModalComponent } from "app/main/quotation/create-or-edit-new-enquiry-quotation.component";
import { CreateJobActivityModalComponent } from 'app/main/inquiry/create-or-edit-jobActivity.Component';
import { StageSelectComponent } from 'app/main/kanban/stage.component';
import {Location} from '@angular/common';
import { AppConsts } from '@shared/AppConsts';

export interface SelectOption{
   id?: number;
   text?: string;
}

@Component({
    templateUrl: './editInquiry.component.html',
    styleUrls: ['./createOReditModal.component.less']

})
export class EditInquiryComponent extends AppComponentBase implements AfterViewInit,OnInit,OnDestroy {
  status: any;
  lqref:string='NoQuote';
  lqtot:any=1;
  loading : boolean = false;
  lead_source_enable: boolean = false;
  designerr: boolean = false;
  inquiryDuplicate: boolean = false;
  companyDetailsDto:Select2CompanyDto = new Select2CompanyDto();
  InputDto:EntityDto = new EntityDto();
  assignedDiff:boolean = false;
  checkInquiry: CheckInquiryInput = new CheckInquiryInput();
  @ViewChild('createLinkedModal') createLinkedModal: LinkedContactComponent;
	@ViewChild('viewLinkedModal') viewLinkedModal: ViewLinkedContactComponent;
  @ViewChild('createJobActivityModal') createJobActivityModal:CreateJobActivityModalComponent;
  activities:any=[];
  
	  @ViewChild('createNewEnQuotationModal') createNewEnQuotationModal: CreateOrEditNewEnQuotationModalComponent;
	  @ViewChild('createNewContactModal') createNewContactModal: CreateOrEditContactNewModalComponent;
  	@ViewChild('createInqActivityModal') createInqActivityModal:CreateIncActivityModalComponent;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('createNewCompanyModal') createNewCompanyModal: CreateOrEditNewCompanyModalComponent;
	  @ViewChild('createCommentModal') createCommentModal: createCommentActivityModalComponent;
	  @ViewChild('departmentCombobox') departmentCombobox: ElementRef;

    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    @ViewChild('companyCombobox') companyCombobox: ElementRef;
    @ViewChild('accountCombobox') accountCombobox: ElementRef;
	  @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;
    @ViewChild('selectStageModal') selectStageModal :StageSelectComponent;

    private InqLeadStatus:Array<any>;
    active_inqleadstatus:SelectOption[];
    inqleadstatusData:Datadto[] = [];
    from:number = 0;
    company: CompanyCreateInput = new CompanyCreateInput();
    active_tagdept:SelectOption[]; departments:any=[]; depts: Datadto[] = [];
    companyInput: CreateCompanyOrContact = new CreateCompanyOrContact();
    disabled_indus:boolean = false;
    reverse:NullableIdDto = new NullableIdDto();
    active_tagCountry: SelectOption[];
    active_tagCompany: SelectOption[];
    active_desg: SelectOption[];
    active_location: SelectOption[];
    active_assigned:SelectOption[];
    LocText:string = null;
    descText:string = null;
    salesimg:string = null;
    co_ordimg:string = null;
    desimg:string = null;
    salesName:string = null;
    co_ordName:string = null;
    desName:string = null;
    private items:Array<any> = [];
    private companies:Array<any> = [];
    private designation:Array<any> = [];
    private leaddetails:boolean = true;
    companyEnable:boolean = true;
	  linkedContacts:any = [];
    radioitems:any=[];
    quoat_view:boolean = false;  
    approved:boolean = false;  
    Enabled_Assigned:boolean = false;  
  enqActivityList:any=[];
  filter:string =''; 
  sort:string='Asc';
  active_team:SelectOption[] = [];
  maxResult:number= 10;
  start:number = 0;
  cmpid: number = 0;
  additional:boolean = true;
  active_whybafco:SelectOption[];
  whybafco:Array<any>;
  whybafcodto:Datadto[];
  active_opportunity:SelectOption[];
  opportunity_source:Array<any>;
  opportunitysourcedto:Datadto[];
  private location: Array<any> = [];
  locations:Datadto[];
  inquiryContact:NullableIdDto = new NullableIdDto();
  updateSalesmanInput: SalesmanChange = new SalesmanChange();
  inquiry:InquiryListDto = new InquiryListDto();
  update_details:InquiryInputDto = new InquiryInputDto;
  desid:DesignationInputDto = new DesignationInputDto();
  locat:LocationInputDto = new LocationInputDto();
  updateInquiryIn: EnquiryUpdateInputDto = new EnquiryUpdateInputDto();
  contact_edit: CreateCompanyOrContact = new CreateCompanyOrContact();
  address:CreateAddressInfo =new CreateAddressInfo();
  contact:CreateContactInfo = new CreateContactInfo();
  enquiryjunkinput:EnquiryJunkUpdateInputDto = new EnquiryJunkUpdateInputDto();
  QRevisionInput: QuotationRevisionInput = new QuotationRevisionInput();

    values_company: Datadto[] = [];
    reasons: Datadto[] = [];
    designations: Datadto[] = [];
    companys: Datadto3[] = [];
    countrys: Datadto[] = [];
    lines: Datadto[] = [];
    milestones: Datadto[] = [];
    Sources :Sourcelist[];
    AssignedBy_data:Datadto[] = [];
    actTypes: Datadto[];
	public myForm: FormGroup;
    copy =[];
    vale = [];
    clientip:any;
    private value:any = {};
    CompanyText:string = null;
    @Output() updateCompany = new EventEmitter<any>();


    active = false;
    saving = false;
    private sub: any;
    private id: number;
    assigned:boolean=false;
    linked_disabled:boolean=false;
    opts: ISlimScrollOptions;
    set_opacity:string='1';
    assignedBy:Array<any>=[];
    removed_address_arr:any=[];
  remove_contact_arr:any=[];
  formdata:any=[];
   dataCon: any=[];
   contact_remove_values:any=[];
   address_remove_values:any=[];
   types:Datadto[];
   active_title:SelectOption[];
   private title:Array<any> = [];
   active_company:SelectOption[];
  active_customer:SelectOption[];
   new_company_id:number=0;
   new_title_id:number=0;
   cusTypeId:number=0;
   cmpname:string='';
   lname:string='';
   private companytypes:Array<any> = [];
  companyType:Datadto[]=[];
  radio_val:string='All';
  private indus:Array<any>=[];
   allIndustry:Datadto[];
   active_indus:SelectOption[];
   newIndustry:string='';
   industryInput:IndustryInputDto = new IndustryInputDto();
   statuses:Array<any> = [];
   allStatus:Stagedto[];
   active_status:SelectOption[];
   status_enable:boolean=false;
   //lead_statuses:Array<any> = [{'id':1,'text':'Active'},{'id':2,'text':'Confirmed'},{'id':3,'text':'Cancelled'},{'id':4,'text':'Lost'}];
   lead_category:Array<any>;
   lead_source:Array<any>;
   sales:Array<any>;
   coordinator:Array<any>;
   designer:Array<any>;
   active_lead_category:SelectOption[];
   active_lead_source:SelectOption[];
   active_sales:SelectOption[];
   active_coord:SelectOption[];
   active_designer:SelectOption[];
   leadCategorydto:Datadto[];
   leadSourcedto:Datadto[];
   desinerDto:Datadto[];
   coordDto:Datadto[];
   salesDto:Datadto[];
   estimatedValue:number;
   size:string='';
   saveLeadDetailInput:LeadDetailInputDto = new LeadDetailInputDto();
   competitor_data:Datadto[];
   competators:Array<any>;
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
   dclosedDate:any;
   dlastActivity:any;

   filterText: string = '';
   inquiryId:number;
    quotations:QuotationListDto[];
    teams:Array<any>;
    team_list: Select2TeamDto[];
    active_department:SelectOption[]=[];
  leadstatusId: number;
  unapproved: number = null;
  allowedChars = new Set('0123456789'.split('').map(c => c.charCodeAt(0)));

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
        private _industryServiceProxy:IndustryServiceProxy,
        private zone: NgZone,
        private _location: Location
    ){
        super(injector);
		/*this.radioitems=[{'id':1,'name':'All'},
            {'id':2,'name':'Notes'},
            {'id':3,'name':'Emails'},
            {'id':4,'name':'Calls'},
            {'id':5,'name':'SMS'},
            {'id':6,'name':'Mine'}];*/
    }
    ngAfterViewInit(): void {
      if(this.quoat_view)
      {
        this.getEnquiryQuotations();        
      }
    }
	ngOnInit(){
		this.sub = this.route.params.subscribe(params => {
		   this.id = +params['id']; // (+) converts string 'id' to a number
		   this.show(this.id);
		   this.getEnquiryActivity();
		});
		this.opts = {
      position: 'right',
      barBackground: 'grey',
      barWidth:'7',
      gridWidth:'5',
      gridBackground:'white'

    }
    
	this.myForm = this._fb.group({
            companyName: ['', [Validators.required]],
			      lastName: ['', [Validators.required]],
            typeid: null,
			      newtitleid: null,
            addresses: this._fb.array([]),
            contacts: this._cfb.array([]),
           // empaddress:this._fb.array([])
        });
    if(this.which_located=='kanban' || this.which_located=='enquiry' || this.which_located=='leads'){
          this.quoat_view = false;
      }else{
          this.quoat_view = true;
      }   
      if(this.which_located =='kanban'|| this.which_located =='enquiry'|| this.which_located =='junk-enquiry' ){
        this.Enabled_Assigned = true;
      }
  	}
   
   ngOnDestroy():void {
      this.sub.unsubscribe();
	}
	createLinkedContact(): void {
        this.createLinkedModal.show(this.inquiry.companyId, this.id);
    }
	viewLinkedContact():void{
		this.viewLinkedModal.show(this.id);
	}
	createNewContacts():void{
		this.createNewContactModal.show(this.inquiry.companyId,this.id,'enquiry');
	}
	createEnquiryActivity(companyId): void {

       this.createInqActivityModal.show(companyId);
    }

editEnqActivity(companyId,data): void {
      if(data.activityName != 'Task')
      {
        this.createInqActivityModal.show(companyId,data.id);
      }
      else{
          this.notify.warn(this.l('Cannot Edit Enquiry Activity'));
      }
    }
    
   show(inquiryId?: number) {
    this.inquiryId = inquiryId;
    this.loading = true;
       this._enquiryContactService.getEnquiryWiseEnquiryContact(inquiryId).subscribe(contacts => {
		   this.linkedContacts = contacts.items;
       if(contacts.items!=null){
          if(this.linkedContacts.length>0){
            this.linked_disabled = true;
            }
       }
    });
       this.getJobActivity();
    
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

       this._select2Service.getLeadStatus().subscribe((result)=>{
        this.InqLeadStatus = [];
        if(result.select2data!=null){
          this.inqleadstatusData = result.select2data;
          this.inqleadstatusData.forEach((lstatus:{id:number,name:string})=>{
            this.InqLeadStatus.push({
              id:lstatus.id,
              text: lstatus.name
            })
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
         /*Lead details start*/
         this._select2Service.getLeadType().subscribe((result) => {
          this.lead_category = [];
           if (result.select2data != null) {
            this.leadCategorydto = result.select2data;

              this.leadCategorydto.forEach((l_cat:{id:number, name:string}) => {
              this.lead_category.push({
                       id: l_cat.id,
                       text: l_cat.name
              });
             });
           } });
         this._select2Service.getOpportunitySource().subscribe((result) => {
          this.lead_source =[];
           if (result.select2data != null) {
            this.leadSourcedto = result.select2data;

              this.leadSourcedto.forEach((l_cat:{id:number, name:string}) => {
              this.lead_source.push({
                       id: l_cat.id,
                       text: l_cat.name
              });         
             });
           } });
         this._select2Service.getDesigner().subscribe((result) => {
          this.designer =[];
           if (result.select3data != null) {
            this.desinerDto = result.select3data;

              this.desinerDto.forEach((l_cat:{id:number, name:string}) => {
              this.designer.push({
                       id: l_cat.id,
                       text: l_cat.name
              });
             });
           } });
         this._select2Service.getSalesCoordinator().subscribe((result) => {
          this.coordinator =[];
           if (result.select3data != null) {
            this.coordDto = result.select3data;

              this.coordDto.forEach((l_cat:{id:number, name:string}) => {
              this.coordinator.push({
                       id: l_cat.id,
                       text: l_cat.name
              });
             });
           } });
         this._select2Service.getSalesman().subscribe((result) => {
          this.sales =[];
           if (result.select3data != null) {
            this.salesDto = result.select3data;

              this.salesDto.forEach((l_cat:{id:number, name:string}) => {
              this.sales.push({
                       id: l_cat.id,
                       text: l_cat.name
              });
             });
           } });
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

         this._select2Service.getAllLocation().subscribe((result) => {
          this.location = [];
           if (result.select2data != null) {
              this.locations = result.select2data;
               this.locations.forEach((loc: {id: number, name: string}) => {
                   this.location.push({
                       id: loc.id,
                       text: loc.name
                   });
               });
           } 
     });

     this._select2Service.getWhyBafco().subscribe((result)=>{
          this.whybafco =[];
         if(result.select2data!=null){
           this.whybafcodto=result.select2data;
           this.whybafcodto.forEach((bafco:{id:number,name:string})=>{
             this.whybafco.push({
               id:bafco.id,
               text:bafco.name
             });
           });
         }
     });
             
     this._select2Service.getOpportunitySource().subscribe((result)=>{
               this.opportunity_source =[];
              if(result.select2data!=null){
                this.opportunitysourcedto=result.select2data;
                this.opportunitysourcedto.forEach((opp:{id:number,name:string})=>{
                  this.whybafco.push({
                    id:opp.id,
                    text:opp.name
                  });
                });
              }
     });
         this._select2Service.getTeam().subscribe((result) => { 
          if (result.selectData != null) {
               this.team_list = result.selectData;
               this.teams = [];
              this.team_list.forEach((team: {id: number, name: string}) => {
                this.teams.push({
                  id: team.id,
                  text: team.name,
                });
              });
           }
        });

       if(this.router.url=='/app/main/leads/'+inquiryId){
        this.leaddetails = false;
       }     
       this._inquiryServiceProxy.getInquiryForEdit(inquiryId).subscribe((result) => {
        
           this.Sources = result.selectedSource;
           if(result.inquiryLock !=null)
           {
             this.lqref = result.inquiryLock.quotationRefno;
             this.lqtot = result.inquiryLock.quotationTotal;
           }
           if(result.inquirys.leadStatusId !=0)
           {
            this.update_details.leadStatusId = result.inquirys.leadStatusId;
            this.leadstatusId = result.inquirys.leadStatusId;
            this.active_inqleadstatus = [{"id":result.inquirys.leadStatusId,"text":result.inquirys.leadStatusName}];
           }
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
                // if(result.inquiryDetails.leadSourceName){
                //   this.active_lead_source = [{"id":result.inquiryDetails.leadSourceId,"text":result.inquiryDetails.leadSourceName}];
                //   if(result.inquiryDetails.leadSourceName=='Marketing'){ 
                //     this.lead_source_enable = true;
                //   }
                //   this.lead_Source = result.inquiryDetails.leadSourceName;
                // }else{
                //   this.active_lead_source=[];
                // }
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
                this.saveLeadDetailInput.size = result.inquiryDetails.size;
                if( result.inquirys.designerApproval == false && result.inquiryDetails.designerId > 0)
                {
                  this.unapproved = 1;
                }


           }
           if (result.inquirys != null) {
            if(result.inquirys.statusName =="New" || result.inquirys.disableQuotation == true)
            {
             this.quoat_view = false;
            }
            if(result.inquirys.closureDate){
              this.closedDate = moment(result.inquirys.closureDate).format('MM/DD/YYYY');
              this.dclosedDate = result.inquirys.closureDate;
            }
            
            if(result.inquirys.lastActivity){
              this.lastActivity = moment(result.inquirys.lastActivity).format('MM/DD/YYYY');
              this.dlastActivity = result.inquirys.lastActivity;
            }

           if(result.inquirys.mileStoneId == 1){
             this.leaddetails = false;
            }  
            this.salesimg = result.inquirys.assignedbyImage;
            this.inquiry = result.inquirys;
            
            if(this.which_located=='leads'){
              if(!this.inquiry.assignedbyId && this.inquiry.companyId > 0){
                this._select2Service.getCompanyDetails(this.inquiry.companyId,this.inquiry.companyName).subscribe((result) => {
                  if(result.select2Company.salesManId > 0){
                    this.active_assigned = [{id:result.select2Company.salesManId, text:result.select2Company.salesMan}];
                    this.inquiry.assignedbyId = result.select2Company.salesManId;
                  }
                });
              }
            }

		      	this.update_details.junk = this.inquiry.junk;
            this.update_details.junkDate = this.inquiry.junkDate;
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
            if(this.inquiry.statusId){
              this.active_status = [{id:this.inquiry.statusId,text:this.inquiry.statusName}];
              this.update_details.statusId = this.inquiry.statusId;
            }
            if(this.inquiry.compatitorName){
              this.active_competators = [{id:this.inquiry.compatitorsId,text:this.inquiry.compatitorName}];
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
              this.update_details.whyBafcoId = this.inquiry.whyBafcoId;
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
            var index = this.companies.findIndex(x => x.text==this.inquiry.companyName);
            //console.log(this.companies[index],'its ok for');
            if(result.contactEdit!=null){
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
         this._select2Service.getNewCustomerType().subscribe((result) => {
           if (result.select2data != null) {
            this.companyType=result.select2data;
            this.companytypes=[];
            this.companyType.forEach((customer:{id:number,name:string})=>{
              this.companytypes.push({
                id:customer.id,
                text:customer.name
              });
              if(this.contact_edit.newCustomerTypeId===customer.id){
                   this.active_customer = [{id:customer.id,text:customer.name}];
                }
            });
            
           } });
            
              this.myForm = this.showConDetails();
              this.addContacts(0);
              this.addAddress(0);
            }else{
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
         this._select2Service.getNewCustomerType().subscribe((result) => {
           if (result.select2data != null) {
            this.companyType=result.select2data;
            this.companytypes=[];
            this.companyType.forEach((customer:{id:number,name:string})=>{
              this.companytypes.push({
                id:customer.id,
                text:customer.name
              });
              if(this.contact_edit.newCustomerTypeId===customer.id){
                   this.active_customer = [{id:customer.id,text:customer.name}];
                }
            });
            
           } });
            
              this.myForm = this.showConDetails();
              this.addContacts(1);
              this.addAddress(1);
            }
            if(this.inquiry.companyId==null || this.inquiry.companyId==0){
                var index = this.companies.findIndex(x => x.text==this.inquiry.companyName);

                                if(index>=0){
                                    this.active_tagCompany = [{id:this.companies[index].id,text:this.companies[index].text}];
                                    this.CompanyText=null;
                                    this.linked_disabled = true;
                                    this.update_details.companyId = this.companies[index].id;
                                    this.update_details.companyName = this.inquiry.companyName;
                                    this.sel(this.CompanyText,this.companies[index].id);
                                  }else{
								  	if( this.inquiry.companyName)
                                      this.active_tagCompany = [{id:0,text:this.inquiry.companyName}];
									 else
									  this.active_tagCompany = [];
									  this.linked_disabled = false;
                                      this.CompanyText=this.inquiry.companyName;
                                      this.company.companyName = this.inquiry.companyName;
                                      this.update_details.companyName = this.inquiry.companyName;
                                      this.sel(this.CompanyText,null);
                                  } 
            }else{
              this.linked_disabled = true;
            }
            // if(this.inquiry.designationId==null || this.inquiry.designationId==0){
            //     var index = this.designation.findIndex(x => x.text==this.inquiry.designationName);

            //                     if(index>=0){
            //                         this.active_desg = [{id:this.designation[index].id,text:this.designation[index].text}];
            //                         this.descText=null;
            //                         this.update_details.designationId = this.designation[index].id;
            //                         this.update_details.designationName = this.inquiry.designationName;
            //                         this.selDesc(this.descText,this.designation[index].id);
            //                       }else{
                                      
						// 			 if( this.inquiry.designationName)
            //                           this.active_desg = [{id:0,text:this.inquiry.designationName}];
						// 			 else
						// 			  this.active_desg = [];
									  
            //                           this.descText = this.inquiry.designationName;
            //                           this.desid.desiginationName = this.inquiry.designationName;
            //                           this.update_details.designationName = this.inquiry.designationName;
            //                           this.selDesc(this.descText,null);
            //                       } 
            // }
            var the_arr = this.router.url.split('/');
                        the_arr.pop();
                        var from_location = the_arr[3];
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

         this._select2Service.getEnquiryStages(this.inquiry.mileStoneId).subscribe((result)=>{
          if(result.select2data !=null){
            this.allStatus = result.select2data;
            this.statuses = [];
            this.allStatus.forEach((stat:{id:number,name:string})=>{
              this.statuses.push({
                id:stat.id,
                text:stat.name
              });
            });
          }
       });
           this._select2Service.getIndustry().subscribe((result) => {
           if (result.select2data != null) {
            this.allIndustry=result.select2data;
            this.indus=[];
            this.allIndustry.forEach((industry:{id:number,name:string})=>{
              this.indus.push({
                id:industry.id,
                text:industry.name
              });
              if(this.contact_edit.industryId==industry.id){
                this.active_indus = [{id:industry.id,text:industry.name}];
                this.newIndustry=null;
              }
            });
           } });
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
        this.loading = false;
        });
      
    }
    showConDetails(){
      return  this._fb.group({
        companyName: [this.cmpname, [Validators.required]],
        lastName: [this.lname, [Validators.required]],
        typeid: this.contact_edit.newCustomerTypeId,
        newtitleid: this.contact_edit.titleId,
        addresses: this._fb.array([]),
        contacts: this._cfb.array([]),
        // empaddress:this._fb.array([])
        });
}
onRadioChange(name:string){
  this.radio_val = name;
}

private selectAssigned(data):void{
   this._select2Service.getCompanyDetails(this.inquiry.companyId,this.inquiry.companyName).subscribe((result) => {
    if(result.select2Company != null){
      this.companyDetailsDto = result.select2Company;
      if(data.id != this.companyDetailsDto.salesManId && this.companyDetailsDto.salesManId > 0){
        this.message.confirm(
          this.l('If you Change the Salesperson It will affect All the Open Enquiry and Quotation related to this Company'),
            isConfirmed => {
              if (isConfirmed) {
                this.assignedDiff = true;
                this.inquiry.assignedbyId = data.id;
              }
              else{
                this.active_assigned =[{id:this.inquiry.assignedbyId,text:this.salesName}];
                this.assignedDiff = false;
              }
            });
      }
      else{
        this.assignedDiff = false;
        this.inquiry.assignedbyId = data.id;
      }
    }
    
  }); 
}

sel(value,id){
  this.inquiry.companyId = id;
  this.CompanyText=value;

}
expand(){
  this.ViewLinkedDetails = this.ViewLinkedDetails?false:true;
}
expandJob(){
  this.ViewJob = this.ViewJob?false:true;
}
selDesc(value,id){
  this.inquiry.designationId = id;
  this.descText=value;
}


CheckInquiryDuplicate(data){
  this.checkInquiry.inquiryName = data;
  this._inquiryServiceProxy.checkInquiryDuplicate(this.checkInquiry).subscribe((result) =>{
      this.inquiryDuplicate = result;

  });

}
getEnquiryActivity():void{ 
        this._inquiryServiceProxy.getEnquiryActivitys(this.filter,this.id).subscribe((result) => {
            if(result.items != null){
    
                this.enqActivityList = result.items;

            }

        });

    }

    updateSalesman(){
      if(this.assignedDiff && this.update_details.companyId > 0 && this.update_details.assignedbyId > 0){
      this.updateSalesmanInput.companyId = this.update_details.companyId;
      this.updateSalesmanInput.salesmanId = this.update_details.assignedbyId;
       this._inquiryServiceProxy.updateSalesmanAll(this.updateSalesmanInput).subscribe(result=>{
          this.notify.success(this.l('Updated Successfully'));
      });
    }
    
  }
  updateDesignApproval(data:any){
    this.InputDto.id = data;
     this._inquiryServiceProxy.inquiryDesignerApproval(this.InputDto).subscribe(result=>{
    });
  }
  
	createComActivity(data): void {

        this.createCommentModal.show(data);
    }
    public selectedTeam(value:any):void {
      this.assignedBy = [];
      this.active_assigned =[];
      this.active_team = [{id: value.id, text: value.text}];
      this.inquiry.teamId = value.id;
      var index = this.team_list.findIndex(x=> x.id==value.id);
        if(this.team_list[index].departmentId){
            this.active_tagdept = [{id: this.team_list[index].departmentId,text: this.team_list[index].departmentName}];
            this.inquiry.departmentId = this.team_list[index].departmentId;
       }else{
            this.active_tagdept = [];
            this.inquiry.departmentId = null;
        }
  
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
            }
          });
        }
        });
    }

    selectedLocation(data:any){
      this.inquiry.locationId = data.id;
    }
    removedLocation(data:any){
      this.inquiry.locationId = null;
    }
    typedLocation(data:any){
      this.inquiry.locationId = null;
    }
   selectedOpportunitySource(data:any){
    this.inquiry.opportunitySourceId = data.id;
      // this.active_opportunity = [{"id":data.id,"text":data.text}];
    }
    removedOpportunitySource(data:any){
      this.inquiry.whyBafcoId = null;
      this.active_opportunity = [];
    }
    selectedWhyBafco(data:any){
      this.inquiry.whyBafcoId = data.id;
      // this.active_whybafco = [{"id":data.id,"text":data.text}];
    }
    removedWhyBafco(data:any){
      this.inquiry.whyBafcoId = null;
      this.active_whybafco = [];
    }

    public removedTeam(value:any):void {
      this.inquiry.teamId = value.id;
      this.active_team = [{"id":value.id,"text":value.text}];
    }

 public selectedCompany(value:any):void {
    this.inquiry.companyId = value.id;
    this.inquiry.companyName = value.text;
    this.CompanyText = null;
  }

  public removedCompany(value:any):void {
  }
  public typedCompany(value:any):void {
      this.CompanyText = value;
      this.active_tagCompany = [{id:0,text:value}];
      this.inquiry.companyName = value;
      this.inquiry.companyId = null;
      this.company.companyName = value;
      this.getCompanys(value);
  }

  getCompanys(data):void{
    this._select2Service.getAllCompanyEnquiry(data).subscribe((result) => { 
      if (result.select4data != null) { 
          this.companys = result.select4data; 
           this.companies = [];
           this.companys.forEach((company:{id:number, name:string, industryId:number}) => {
                       this.companies.push({
                             id: company.id,
                             text: company.name
                             });
                          });
                      }
                });
  }
 
  refreshCompanyValue(value:any):void {
    this.value = this.companies;
  }

    saveCompany(form): void {
       this.message.confirm(
                this.l('Are You Sure To Add Company', this.company.companyName),
                (isConfirmed) => {
             if (isConfirmed) {
              this.company.inSales = false;
              this.company.industryId = null;
              this._inquiryServiceProxy.newCompanyCreate(this.company)
            .subscribe((result) => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.inquiry.companyId = result;
			        	this.save(form);
                this.CompanyText = null;
            });
                    }
                }
            );
    }


    public selecteddesc(value: any): void {
      this.descText = null;
     this.inquiry.designationId = value.id;
     this.contact_edit.designationId=value.id;
   }
 
   public removeddesc(value: any): void {
     this.contact_edit.designationId=null;
   }

public typeddesc(event):void {
    this.descText = event;
    this.active_desg = [{id : 0, text : event}];
    this.desid.desiginationName = event;
    this.inquiry.designationId = null;
    this.inquiry.designationName = event;
  }

  saveDesignation(): void {
        this.desid.designationCode = 'AUTO';
       this.message.confirm(
                this.l('Are You Sure To Add Designation'),
                (isConfirmed) => {
             if (isConfirmed) {
             this._inquiryServiceProxy.newDesignationCreate(this.desid)
            .subscribe((result) => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.inquiry.designationId = result;
                this.descText = null;
            });
                    }
                }
        );
    }
public refreshTitle(value:any,model):void{
    this.contact_edit.titleId=value.id;
  }
  public removedTitle(value,model):void{
    this.contact_edit.titleId=0;
  }

  InqClosed(data:number){

    if(this.inquiry.isClosed==true){
     this.message.confirm(
      this.l('To Close the Quotation'),
       isConfirmed => {
       if (isConfirmed) {
           this._enquiryUpdateServiceProxy.inquiryClosed(data).subscribe(result=>{
                  this.notify.success(" Inquiry Closed ");
               this.close();
           });
       }
       else{
         this.inquiry.isClosed=false;
       }
   }
  
);
}
else{
  if(this.inquiry.isClosed == false){
    this.message.confirm(
     this.l('To Close the Quotation'),
      isConfirmed => {
      if (isConfirmed) {
        this.reverse.id=data;
        this._enquiryUpdateServiceProxy.reverseClosed(this.reverse).subscribe(result=>{
               this.notify.success(" Inquiry Opened ");
        });
        
      }
      else{
        this.inquiry.isClosed=true;
      }
  }
 
);
}
  
}
}
  
 save(model): void {
           this.saving = true;
           if(this.closedDate){
            let stdate= moment(moment(this.closedDate).toDate().toString());
            this.update_details.closureDate = moment(stdate).add(6, 'hours');
           }
           if(this.lastActivity){
            let lst= moment(moment(this.lastActivity).toDate().toString());
            this.update_details.lastActivity = moment(lst).add(6, 'hours');
           }
           this.update_details.weightedvalue = this.inquiry.weightedvalue;
           this.update_details.stared = this.inquiry.stared;
           this.update_details.tenderProject = this.inquiry.tenderProject;

           if(!this.update_details.stared){
            this.update_details.weightedvalue =0;
           }
           this.update_details.id = this.inquiry.id;
           this.update_details.name = this.inquiry.name;
           this.update_details.email = this.inquiry.email;
           this.update_details.mbNo = this.inquiry.mbNo;
           this.update_details.landlineNumber = this.inquiry.landlineNumber;
           this.update_details.cEmail = this.inquiry.cEmail;
           this.update_details.cMbNo = this.inquiry.cMbNo;
           this.update_details.cLandlineNumber = this.inquiry.cLandlineNumber;
           this.update_details.remarks = this.inquiry.remarks;
           this.update_details.ipAddress = this.inquiry.ipAddress;
           this.update_details.subMmissionId = this.inquiry.subMmissionId;
           this.update_details.browcerinfo = this.inquiry.browcerinfo;
           this.update_details.disableQuotation = this.inquiry.disableQuotation;
           if(this.update_details.disableQuotation){
            this.update_details.won = this.inquiry.won;
            this.update_details.total = this.inquiry.total;
         }
         else{
            this.update_details.won = false;
            this.update_details.total = 0;
         }
           if(this.inquiry.whyBafcoId > 0){
            this.update_details.whyBafcoId = this.inquiry.whyBafcoId;
           }
           else{
            this.update_details.whyBafcoId = null;
           }

           if(this.inquiry.locationId > 0){
            this.update_details.locationId = this.inquiry.locationId;
           }
           else{
            this.update_details.locationId = null;
           }

           if(this.inquiry.opportunitySourceId > 0){
            this.update_details.opportunitySourceId = this.inquiry.opportunitySourceId;
           }
           else{
            this.update_details.opportunitySourceId = null;
           }

           if(this.inquiry.teamId > 0)
           {
            this.update_details.teamId = this.inquiry.teamId;  
           }
           else
           {
            this.update_details.teamId = null;  
           }
           if( this.inquiry.departmentId==0 || this.inquiry.departmentId==null){
           this.update_details.departmentId = null;
         }else{
            this.update_details.departmentId = this.inquiry.departmentId;
         }

           this.update_details.webSite = this.inquiry.webSite;
           this.update_details.address = this.inquiry.address;
           this.update_details.mileStoneId = this.inquiry.mileStoneId;
           this.update_details.designationId = this.inquiry.designationId?this.inquiry.designationId:null;
           this.update_details.designationName =  this.inquiry.designationName;
           this.update_details.companyName = this.inquiry.companyName;
           this.update_details.companyId = this.inquiry.companyId?this.inquiry.companyId:null;
           this.update_details.assignedbyId = this.inquiry.assignedbyId?this.inquiry.assignedbyId:null;

           this.update_details.designerApproval = this.inquiry.designerApproval;
           this.update_details.revisionApproval = this.inquiry.revisionApproval;
           this.update_details.weightedvalue = this.inquiry.weightedvalue;
           this.update_details.stared = this.inquiry.stared;
           this.update_details.tenderProject = this.inquiry.tenderProject;

           this.update_details.sourceId =  _.map(
                _.filter(this.Sources, { isAssigned: true }), Source => Source.sourceId
            );
           this.update_details.compatitorsId = !this.inquiry.compatitorsId?null:this.inquiry.compatitorsId;
           this.update_details.leadTypeId = !this.inquiry.leadTypeId?null:this.inquiry.leadTypeId;

           this.update_details.size = this.inquiry.size;
           this.update_details.estimationValue = this.inquiry.estimationValue;
           this.update_details.summary = this.inquiry.summary;

                    
          this.contact_edit.name = model._value.companyName;
          this.contact_edit.lastName = model._value.lastName;
          this.contact_edit.newCompanyId = this.inquiry.companyId;
          this.contact_edit.newCustomerTypeId = 4;
        
        if(!this.contact_edit.industryId && this.newIndustry){
            this.industryInput.id = 0;
            this.industryInput.industryCode = 'AUTO_'+Date.now();
            this.industryInput.industryName = this.newIndustry;
            this._industryServiceProxy.createNewIndustry(this.industryInput).subscribe(result=>{
              if(result){
                this.contact_edit.industryId = result;
                this.updateInquiryDetails(model);
              }
            });
          }else{
            this.updateInquiryDetails(model);
          }
           this.saving = false;
    }

    enquiryStatusUpdate(){
      this._enquiryUpdateServiceProxy.createORupdateInquiry(this.updateInquiryIn).subscribe(result => {
      if( !result ){
        //this.getTickets('');
      }else{
        //this.selectleadsDepartmentModal.show(this.updateInquiryIn.id);
        //this.getTickets('');
      }
    });
    }
 
 
 
    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }

  createJobActivity(): void { 
      this.createJobActivityModal.show(0, this.saveLeadDetailInput.designerId,this.inquiryId);
  }

 editJobActivity(data): void {
      this.createJobActivityModal.show(data.id,data.designerId,data.inquiryId);
 }

changeStage():void{
  this.selectStageModal.show(this.inquiry.id,this.inquiry.mileStoneName,this.inquiry.mileStoneName,this.inquiry.mileStoneId,-1,this.inquiry.statusName);
}

 getJobActivity(): void {
  this._inquiryServiceProxy.getJobActivity(this.inquiryId).subscribe(results=> {
    this.activities=results.items;
  });
}

deleteJobActivity(job: JobActivityList): void {
    this.message.confirm(
        this.l('AreYouSureToDeleteTheJobActivity', job.title),
        isConfirmed => {
            if (isConfirmed) {
                this._inquiryServiceProxy.getDeleteJobActivity(job.id).subscribe(() => {
                    this.notify.info(this.l('SuccessfullyDeleted'));
                    _.remove(this.activities, job);
                });
            }
        }
    );
}
    updateInquiryDetails(model){
      if(this.contact_edit.designationId==0)
      {
        this.contact_edit.designationId = null;
      }
      this._newCompanyContactServiceProxy.contactUpdate(this.contact_edit).subscribe((result) => {
                if(result){
                for(var i=0;i<model.value.addresses.length;i++){
            if(model.value.addresses[i].id==0 || model.value.addresses[i].street!=this.formdata[i].address1 || model.value.addresses[i].postcode!=this.formdata[i].address2 || 
              model.value.addresses[i].cityid!=this.formdata[i].cityId || model.value.addresses[i].typeid!=this.formdata[i].newInfoTypeId){
              //this.values_arr.push(model.value.addresses[i]);
              this.address.id = model.value.addresses[i].id;
              this.address.newContacId = result;
              this.address.newInfoTypeId = model.value.addresses[i].typeid;
              this.address.address1 = model.value.addresses[i].street;
              this.address.address2 = model.value.addresses[i].postcode;
              this.address.cityId = model.value.addresses[i].cityid;
              this.address.countryName = model.value.addresses[i].country;
              this._newCompanyContactServiceProxy.createOrUpdateAddressInfo(this.address).subscribe((result)=>{
              

              });
            }
            
        }
        for(var i=0;i<model.value.contacts.length;i++){
            if(model.value.contacts[i].id==0 || model.value.contacts[i].contactinfo!=this.dataCon[i].infoData || model.value.contacts[i].infoid!=this.dataCon[i].newInfoTypeId ){
              //this.contact_arr.push(model.value.contacts[i]);
              this.contact.id =model.value.contacts[i].id;
              this.contact.newContacId = result;
              this.contact.newInfoTypeId = model.value.contacts[i].infoid;
              this.contact.infoData = model.value.contacts[i].contactinfo;
              this._newCompanyContactServiceProxy.createOrUpdateContactInfo(this.contact).subscribe((result)=>{
                  
              });
            }
        }
       this.update_details.contactId = result;
          
          if(this.inquiry.mileStoneId === 3 && this.inquiry.assignedbyId !== null && this.inquiry.assignedbyId !== 0){
            this._select2Service.getEnquiryStages(4).subscribe((result)=>{
              if(result.select2data !=null){
                this.updateInquiryIn.stageId = result.select2data[1].id;
                this._inquiryServiceProxy.createOrUpdateInquiry(this.update_details)
                .finally(() => this.saving = false)
                .subscribe(() => {
                 this.updateSalesman();
                 this.notify.success(this.l('SavedSuccessfully'));
                 this.updateInquiryIn.id = this.inquiry.id;
                 this.updateInquiryIn.updateStatusName = 'Assigned';
                 this.updateInquiryIn.currentStatusName = 'Lead';          
                 this.enquiryStatusUpdate();
                 if(this.from == 1)
                 {
                  this.close();
                 }
               });
              }
              else{
                this.saving = false;
                this.notify.error(this.l('No Stage in Milestone status'));
              }
              });        
          }
          else if(this.status == 'Junk'){
            this.enquiryjunkinput.id = this.update_details.id;
            this.enquiryjunkinput.junk = true;
            this._enquiryUpdateServiceProxy.createORupdateInquiryJunk(this.enquiryjunkinput).subscribe(result=>{
              if(this.from == 1)
              {
               this.close();
              }
            });
          }
          else{
              this._inquiryServiceProxy.createOrUpdateInquiry(this.update_details)
              .finally(() => this.saving = false)
              .subscribe(() => {
                this.updateSalesman();
                this.updateDesignApproval(this.update_details.id);
                if(this.update_details.leadStatusId == 4 && (this.leadstatusId != this.update_details.leadStatusId))
                {
                  this._enquiryUpdateServiceProxy.inquiryClosed(this.update_details.id).subscribe(result=>{
                    this.notify.success(" Inquiry Closed ");
                  this.close();
                });                }
               this.notify.success(this.l('SavedSuccessfully'));
               if(this.from == 1)
               {
                this.close();
               }
               this.show(this.update_details.id);
             });
          }
          }

      });
      if(this.inquiry.industryId == null && this.contact_edit.industryId > 0){
        this._newCompanyContactServiceProxy.getNewCompanyForEdit(this.update_details.companyId).subscribe((result) =>{
          if(result != null){
            this.companyInput.id = result[0].id;
            this.companyInput.name = result[0].name;
            this.companyInput.newCustomerTypeId = result[0].newCustomerTypeId;
            this.companyInput.accountManagerId  = result[0].accountManagerId;
            this.companyInput.industryId = this.contact_edit.industryId;
            this.companyInput.customerId = result[0].customerId;
            this.companyInput.approvedById = result[0].approvedById;
            this.companyInput.isApproved = result[0].isApproved;
            this.companyInput.tradeLicense = result[0].tradeLicense;
            this.companyInput.trNnumber = result[0].trNnumber;
            this._newCompanyContactServiceProxy.createOrUpdateCompanyOrContact(this.companyInput).subscribe((result) =>{
             
            });
          }
        });
      }
    }
close() {
  var self = this;
        this.unapproved = null;
        this.assignedDiff = false;
        this.inquiryDuplicate = false;
        this.active = false;
        var the_url = window.location.pathname;
        var the_arr = the_url.split('/');
        the_arr.pop();
        var located = the_arr.join('/');
       // this._location.go("app/main/sales-enquiry");
        this.router.navigate([located],{ relativeTo: this.route });
        // this.router.navigate([located], { relativeTo: this.route });

        // self.zone.run(() => {
				// 	self.router.navigate([located]);
				// });

        return false;   
    }
initContact(){
         return this._cfb.group({
            id:0,
            contactinfo: [''],
            infoid: null
        });
    }

    addContacts(data) {
        //this.dataCon = [ {id:1,contactinfo: 'NagerCoil',infoid: 1,name:'Email'},{id:2,contactinfo: 'Chennai',infoid: 4,name:'Fax'}];
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
        // console.log(this.myForm.controls['contacts']);
        }

    removeContacts(i: number,data:any) {
        const control = <FormArray>this.myForm.controls['contacts'];
        this.remove_contact_arr.push(data._value);
        this.contact_remove_values.push(data._value);
        
        control.removeAt(i);
    }

// Address
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
            //this.formdata = [{id:1,street:'NGO Colony',postcode:'629502',cityid:1,typeid:6},{id:2,street:'Beach Road',postcode:'629503',cityid:2,typeid:5},{id:3,street:'Anna Salai',postcode:'600028',cityid:3,typeid:7}];
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
    removeAddress(i: number,data:any) {
        const control = <FormArray>this.myForm.controls['addresses'];
        this.removed_address_arr.push(data._value);
        this.address_remove_values.push(data._value);       
        control.removeAt(i);
    }
    refreshIndus(value:any){
      this.contact_edit.industryId = value.id;
      this.newIndustry =null;
    }
    removedIndus(value:any){
      this.contact_edit.industryId =null;
      this.newIndustry =null;
    }
    typedIndus(data:string){
      this.contact_edit.industryId =null;
      this.newIndustry = data;
      this.active_indus = [{id:0,text:this.newIndustry}]
    }
    selectedStatus(data:any){
      this.update_details.statusId = data.id;
      var indexidus = this.allStatus.findIndex(x=> x.name == data.text);
      this.status = this.allStatus[indexidus].status;
    }
    removedStatus(data:any){
      this.update_details.statusId = null;
    }
    typedStatus(data:any){
      this.update_details.statusId = null;
    }
    selectedLeadCategory(data:any){
      this.inquiry.leadTypeId = data.id;
      this.active_lead_category = [{"id":data.id,"text":data.text}];
    }
    removedLeadCategory(data:any){
      this.inquiry.leadTypeId = null;
      this.active_lead_category = [];
    }
    typedLeadCategory(data:any){
      // this.inquiry.leadTypeId = null;
      // this.active_lead_category = [{"id":0,"text":data}];
    }
    selectedLeadSaveCategory(data:any){
      this.saveLeadDetailInput.leadTypeId = data.id;
      // this.active_lead_save_category = [{"id":data.id,"text":data.text}];
    }
    removedLeadSaveCategory(data:any){
      this.saveLeadDetailInput.leadTypeId = null;
      this.active_lead_save_category = [];
    }
    typedLeadSaveCategory(data:any){
      // this.saveLeadDetailInput.leadTypeId = null;
      // this.active_lead_save_category = [{"id":0,"text":data}];
    }
    selectedCompetitor(data:any){
      this.inquiry.compatitorsId = data.id;
      // this.active_competators = [{id:data.id,text:data.text}];
    }
    removedCompetitor(data:any){
      this.inquiry.compatitorsId = null;
      this.active_competators = [];
    }
    typedCompetitor(event:any){
      // this.inquiry.compatitorsId = null;
      // this.active_competators = [{id:0,text:event}];
    }
    selectedLeadSource(data:any){
      this.inquiry.opportunitySourceId =data.id;
      // this.active_lead_source = [{"id":data.id,"text":data.text}];
    }
    removedLeadSource(data:any){
      this.inquiry.opportunitySourceId = null;
      this.saveLeadDetailInput.leadSourceId = null;
      this.active_lead_source = [];
    }
    typedLeadSource(data:any){
      // this.saveLeadDetailInput.leadSourceId = null;
      // this.active_lead_source = [{"id":0,"text":data}];
    }
    /*selectedLeadStatus(data:any){

    }
    removedLeadStatus(data:any){

    }
    typedLeadStatus(data:any){
      
    }*/
    selectedSales(data:any){
      this.saveLeadDetailInput.salesManagerId = data.id;
      // this.active_sales = [{"id":data.id,"text":data.text}];
    }
    removedSales(data:any){

      this.saveLeadDetailInput.salesManagerId = null;
      this.active_sales = [];

    }
    typedSales(event:any){
      // this.saveLeadDetailInput.salesManagerId = null;
      // this.active_sales = [{"id":0,"text":event}];
    }
    selectedCoord(data:any){
      this.saveLeadDetailInput.coordinatorId = data.id;
      // this.active_coord = [{"id":data.id,"text":data.text}];
    }
    removedCoord(data:any){
      this.saveLeadDetailInput.coordinatorId = null;
      this.active_coord = [];
    }
    typedCoord(data:any){
      // this.saveLeadDetailInput.coordinatorId = null;
      // this.active_coord = [{"id":0,"text":data}];
    }
    selectedDesigner(data:any){
      this.saveLeadDetailInput.designerId = data.id;
      // this.active_designer = [{"id":data.id,"text":data.text}];
    }
    removedDesigner(data:any){
      this.saveLeadDetailInput.designerId = null;
      this.active_designer = [];
    }
    typedDesigner(event:any){
      // this.saveLeadDetailInput.designerId = null;
      // this.active_designer = [{"id":0,"text":event}];
    }
    selectedInqLeadStatus(data:any){
      this.update_details.leadStatusId = data.id;
      this.active_inqleadstatus = [{"id":data.id,"text":data.text}];
    }     
    saveLeadDetails(from:any){
      this.from = from;
      if(!this.saveLeadDetailInput.leadTypeId && this.inquiry.leadTypeId)
      this.saveLeadDetailInput.leadTypeId = this.inquiry.leadTypeId;
      if(!this.saveLeadDetailInput.estimationValue && this.inquiry.estimationValue)
      this.saveLeadDetailInput.estimationValue = this.inquiry.estimationValue;
      if(!this.saveLeadDetailInput.size && this.inquiry.size)
      this.saveLeadDetailInput.size = this.inquiry.size;

      if(!this.saveLeadDetailInput.id){
       this.saveLeadDetailInput.id = 0;
       this.saveLeadDetailInput.inquiryId = this.inquiry.id;
       }
       this._inquiryServiceProxy.createOrUpdateLeadDetails(this.saveLeadDetailInput).subscribe(result=>{
          this.save(this.myForm);
       });
    }

	 createQuotation(): void {

    if(this.closedDate != null && this.lastActivity != null)
    {
      this.createNewEnQuotationModal.show(this.inquiry);
    }
    else{
      this.notify.error("Please set Closure and Next Activity date then create Quotation");
    }
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
            this.filterText, this.id,
            this.primengDatatableHelper.getSorting(this.dataTable),
            data,
            this.primengDatatableHelper.getSkipCount(this.paginator, event)
        ).subscribe(result => {
            this.primengDatatableHelper.totalRecordsCount = result.totalCount;
            this.primengDatatableHelper.records = result.items;
            this.primengDatatableHelper.hideLoadingIndicator();
        });
    } 
	
	editQuotation(data): void {
    this.router.navigate(["/app/main/sales-enquiry",data.id,data.inquiryId]);    
    // this.editEnqQuotationModal.show(data.id,data.inquiryId); 
  }
	deleteQuotation(quotation: QuotationListDto): void {
        this.message.confirm(
            this.l('Are you sure to Delete the Quotation', quotation.refNo),
            isConfirmed => {
                if (isConfirmed) {
                  this._quoatationService.getDeleteQuotation(quotation.id).subscribe(result=>{
                    this.notify.success("DeletedSuccessfully");
                    this.getEnquiryQuotations();
                   });
                }
            }
        );
    }

    validatedate(data)
    {
    //  var d = new Date();
    //  var visitDate = new Date (d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    //  var newdate= moment(moment(data).toDate().toString());
    //  var newdate2 = moment(newdate).add(4, 'hours');
    //  if(newdate2 >= d)
    //  {
    //   console.log('----------start--------');
    //   console.log(d);
    //   console.log(data);
    //    console.log('false');
    //   return false;
    //  }
    //  else
    //  {
    //   console.log('----------start--------');
    //   console.log(d);
    //   console.log(data);
    //   console.log('true');
    //   return true;
    //  }
    }
    check(event: KeyboardEvent) {
      if (event.keyCode > 31 && !this.allowedChars.has(event.keyCode)) {
        event.preventDefault();
      }
    }
    checkValue(){
      if(this.inquiry.weightedvalue > 100){
        this.notify.warn("Weighted Value must be less than 100");
      }
    }
    DesigerRequest(): void {
      this.message.confirm(
          this.l('to send the request for Designer Revision'),
          isConfirmed => {
              if (isConfirmed) {

                let download_url = AppConsts.remoteServiceBaseUrl +'Email/SendMail?EnquiryId='+this.id;
               // window.location.assign(download_url);
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.open("GET", download_url, true);
                xmlhttp.send();

                xmlhttp.onreadystatechange = function() {
                  if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
                    
                  }
              };
              this.QRevisionInput.id = this.id;
              this.QRevisionInput.typeId = 4;
              this.QRevisionInput.nextActivity = moment().endOf('day');
              this._quoatationService.quotationRevision(this.QRevisionInput)
            .finally(() => this.saving = false)
            .subscribe(result=>{ 
              if(result){
                this.notify.success('Sent Successfully');
              }
            });
            }
          }
      );
    }

    isValidEnquiry(data){ 
      if(this.inquiry.mileStoneId == 1){
        if(!data.valid || !this.inquiry.name || !this.inquiry.remarks || !this.update_details.statusId || !this.inquiry.cEmail || !this.inquiry.cLandlineNumber || !this.inquiry.mbNo || !this.inquiry.email || !this.contact_edit.titleId)
        {      
            return true;
        }else{
           return false;
         }
      }
      if(this.inquiry.mileStoneId == 2){
        if(!data.valid || !this.inquiry.name || !this.inquiry.remarks || !this.update_details.statusId || !this.inquiry.cEmail || !this.inquiry.cLandlineNumber || !this.inquiry.mbNo || !this.inquiry.email || !this.contact_edit.titleId || !this.inquiry.estimationValue)
        {      
           return true;
        }else{
            return false;
         }
      }
      if(this.inquiry.mileStoneId == 3){
        if(!data.valid || !this.inquiry.name || !this.inquiry.remarks || !this.update_details.statusId || !this.inquiry.cEmail || !this.inquiry.cLandlineNumber || !this.inquiry.mbNo || !this.inquiry.email || !this.contact_edit.titleId || !this.inquiry.estimationValue || !this.inquiry.teamId || !this.inquiry.departmentId)
        {      
           return true;
        }else{
            return false;
         }
      }
      else{
        if(this.which_located =='sales-enquiry' || this.which_located =='sales-grid'){
          if(this.inquiry.stared){
            if(!data.valid || !this.inquiry.name || !this.inquiry.remarks || !this.update_details.statusId || !this.inquiry.cEmail || !this.inquiry.cLandlineNumber || !this.inquiry.mbNo || !this.inquiry.email || !this.contact_edit.titleId || !this.saveLeadDetailInput.estimationValue || !this.inquiry.teamId || !this.inquiry.departmentId || !this.inquiry.assignedbyId || !this.closedDate || !this.lastActivity || !this.inquiry.weightedvalue || !this.inquiry.opportunitySourceId)
            {      
               return true;
            }else{
                return false;
             }
          }
          else{
            if(!data.valid || !this.inquiry.name || !this.inquiry.remarks || !this.update_details.statusId || !this.inquiry.cEmail || !this.inquiry.cLandlineNumber || !this.inquiry.mbNo || !this.inquiry.email || !this.contact_edit.titleId || !this.saveLeadDetailInput.estimationValue || !this.inquiry.teamId || !this.inquiry.departmentId || !this.inquiry.assignedbyId || !this.closedDate || !this.lastActivity || !this.inquiry.opportunitySourceId)
          {      
             return true;
          }else{
              return false;
           }
          }
        }
        else{
          if(!data.valid || !this.inquiry.name || !this.inquiry.remarks || !this.update_details.statusId || !this.inquiry.cEmail || !this.inquiry.cLandlineNumber || !this.inquiry.mbNo || !this.inquiry.email || !this.contact_edit.titleId || !this.inquiry.estimationValue || !this.inquiry.teamId || !this.inquiry.departmentId || !this.inquiry.assignedbyId)
          {      
             return true;
          }else{
              return false;
           }
        }
        
      }
      
    }
    
}
