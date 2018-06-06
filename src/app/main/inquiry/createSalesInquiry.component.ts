import { Component, ViewChild, Injector, Renderer, ElementRef, Input, Output, EventEmitter, OnInit, OnDestroy,AfterViewInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Select2ServiceProxy, Datadto, InquiryServiceProxy, Sourcelist, InquiryListDto, CreateCompanyInput, CompanyServiceProxy, CompanyCreateInput, DesignationInputDto, LocationInputDto,NewCompanyContactServiceProxy,CreateAddressInfo,CreateContactInfo,CreateCompanyOrContact,NewContactListDto,Contactdto,IndustryServiceProxy,IndustryInputDto, Select2TeamDto, EnquiryContactInput, LeadDetailInputDto, Datadto3, Select2CompanyDto, InquiryInputDto, NullableIdDto, SalesmanChange } from 'shared/service-proxies/service-proxies';
import {Jsonp} from '@angular/http';
import * as _ from "lodash";
import { ChatSignalrService } from 'app/shared/layout/chat/chat-signalr.service';
import { SignalRHelper } from 'shared/helpers/SignalRHelper';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Select2Option } from 'app/main/attributeGroup/create-or-edit-attributeGroup.component';
import * as moment from "moment";
import { selectOption } from '@app/main/productSpecification/create-or-edit-product-specification.component';
import { Router } from '@angular/router';

export interface SelectOption{
   id?: number;
   text?: string;
}

@Component({
    templateUrl: './createSalesInquiry.component.html'
})

export class CreateSalesInquiryComponent extends AppComponentBase implements OnInit,AfterViewInit {
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @Output() updateCompany = new EventEmitter<any>();

    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;

    inquiryContact:NullableIdDto = new NullableIdDto();
    updateSalesmanInput: SalesmanChange = new SalesmanChange();    
    assignedDiff: boolean = false;
    private value: any = {};
    private value1: any = {};
    private items: Array<any> = [];
    private companies: Array<any> = [];
    private designation: Array<any> = [];
    private assignedapp: Array<any> = [];
    private subscription: Subscription;
    private id: number;
    active_status:Select2Option[]=[];
    private title:Array<any> = [];
    private companytypes:Array<any> = [];
    private fname:Array<any> = [];
    private indus:Array<any>=[];
    public myForm: FormGroup;

    CompanyText: string = null;
    IpAddress: string;
    descText: string = null;
    clientip: any;
    i: number = 0;
    active = false;
    saving = false;
    pageTitle: string = "";
	  pageTag: string = "";
    dataCon: any=[];
    disabled_indus:boolean = false;
    dept_dis:boolean = true;
    assigned_dis:boolean = true;
    contact_remove_values:any=[];
    address_remove_values:any=[];
    removed_address_arr:any=[];
    remove_contact_arr:any=[];
    formdata:any=[];
    cusTypeId:number=0;
    cmpname:string='';
    lname:string='';
    new_company_id:number=0;
    new_title_id:number=0;
    con_name:any=[];
    newIndustry:string='';
    statuses:Array<any> = [];
    assignedBy:Array<any>=[];
    departments:any=[]; 
    active_tags: SelectOption[];
    active_desg: SelectOption[];
    active_fname: SelectOption[];
    active_customer:SelectOption[];
    active_title:SelectOption[];
    newContactlist:Contactdto[];
    active_indus:SelectOption[];
    active_assigned:SelectOption[];
    team_list: Select2TeamDto[];
    teams:Array<any>;
    company: CompanyCreateInput = new CompanyCreateInput();
    inquiry: InquiryInputDto = new InquiryInputDto();
    desid: DesignationInputDto = new DesignationInputDto();
    contact_edit: CreateCompanyOrContact = new CreateCompanyOrContact();
    address:CreateAddressInfo =new CreateAddressInfo();
    contact:CreateContactInfo = new CreateContactInfo();
    contactlist:NewContactListDto[];
    industryInput:IndustryInputDto = new IndustryInputDto(); 
    companyType:Datadto[]=[];
    designations: Datadto[] = [];
    companys: Datadto3[] = [];
    types:Datadto[];
    allIndustry:Datadto[];
    Sources: Sourcelist[];
    allStatus:Datadto[];
    AssignedBy_data:Datadto[] = [];
    depts: Datadto[] = [];
    active_department:SelectOption[]=[];
    active_team:SelectOption[] = [];
    searchContact: EnquiryContactInput = new EnquiryContactInput();
    active_whybafco:SelectOption[];
    whybafco:Array<any>;
    whybafcodto:Datadto[];
    active_opportunity:SelectOption[];
    opportunity_source:Array<any>;
    opportunitysourcedto:Datadto[];
    active_location:SelectOption[];
    private location: Array<any> = [];
    locations:Datadto[];
    companyDetailsDto:Select2CompanyDto = new Select2CompanyDto();
    CompanyDuplicate: boolean = false;
    disabled_team: boolean = false;
    disabled_assigned: boolean = false; 
    closedDate:string;
    lastActivity:string;
    leadCategoryDto:Datadto[] = [];
    competitorData:Datadto[] = [];
    coordinatorData:Datadto[] = [];
    designerData:Datadto[] = [];

    private lead_category:Array<any>;
    private competators:Array<any>;
    private coordinators:Array<any>;
    private designers:Array<any>;
    
    active_leadCategory:SelectOption[];
    active_Competitors:SelectOption[];
    active_Coordinator:SelectOption[];
    active_designer:SelectOption[];
    designerr: boolean = false;
    saveLeadDetailInput:LeadDetailInputDto = new LeadDetailInputDto();
   
    constructor(
        injector: Injector,
        private _inquiryServiceProxy: InquiryServiceProxy,
        private _select2Service: Select2ServiceProxy,
        private _companyServiceProxy: CompanyServiceProxy,
        private renderer: Renderer,
		    private _fb: FormBuilder,
        private _cfb: FormBuilder,
        private _jsonp: Jsonp,
        private _chatSignalrService: ChatSignalrService,
        private _newCompanyContactServiceProxy:NewCompanyContactServiceProxy,
        private _industryServiceProxy:IndustryServiceProxy,
        private  router: Router
    ){
        super(injector);
        this.subscription = _chatSignalrService.getMessage().subscribe(message => { 
        if( message.eventName == 'pageInfo' ){
           this.pageTitle   =  _chatSignalrService.getPageTitle();
           this.pageTag     =  _chatSignalrService.getPageTag();
        }
        });
     }
    
    
    ngOnInit(): void {
        SignalRHelper.initSignalR(() => { this._chatSignalrService.init(); });
		    this.myForm = this._fb.group({
			      lastName: ['', [Validators.required]],
            typeid: null,
            newcompanyid: null,
			      newtitleid: null,
            addresses: this._fb.array([]),
            contacts: this._cfb.array([])
        });
        this.addContacts(1);
        this.addAddress(1);
        this.show(0);
    }
    ngAfterViewInit(): void {
      
    }

   show(inquiryId?: number): void {
    this.dept_dis = true;
    this.assigned_dis = true;
    this.getContactdetails(0);
    this.contact_edit = new CreateCompanyOrContact();
    this.inquiry= new InquiryListDto();
       
    console.log(this.pageTitle,' title');
        this.i = 0;
        this.items = [];
        this.companies = [];      
         this._select2Service.getDesignation().subscribe((result) => {
           this.designation = [];
           if (result.select2data != null) {
            this.designations = result.select2data;
              this.designations.forEach((desg: {id: number, name: string}) => {
              this.designation.push({
                       id: desg.id,
                       text: desg.name
              });
             });
           } });

        this._select2Service.getTitle().subscribe((result) => {
            if (result.select2data != null) {
              this.types = result.select2data;
              this.title=[];
                this.types.forEach((titles:{id:number, name:string}) => {
                  this.title.push({
                    id: titles.id,
                    text: titles.name
                  });
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
              this.opportunity_source.push({
                id:opp.id,
                text:opp.name
              });
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
            });
            
           } });
         this._select2Service.getIndustry().subscribe((result) => {
           if (result.select2data != null) {
            this.allIndustry=result.select2data;
            this.indus=[];
            this.allIndustry.forEach((customer:{id:number,name:string})=>{
              this.indus.push({
                id:customer.id,
                text:customer.name
              });
            });
            
           } });
           this._select2Service.getEnquiryStages(4).subscribe((result)=>{
            if(result.select2data !=null){
              this.allStatus = result.select2data.filter( item => item.status != 'Junk');
              this.statuses = [];
              this.allStatus.forEach((stat:{id:number,name:string})=>{
                this.statuses.push({
                  id:stat.id,
                  text:stat.name
                });
              });
              if(this.statuses.length > 0)
              {
                  var index = this.allStatus.findIndex(x=> x.name=='Awareness');
                  if(this.allStatus[index].name){
                    this.active_status = [{id: this.allStatus[index].id,text: this.allStatus[index].name}];
                    this.inquiry.statusId = this.allStatus[index].id;
                  }
              }
             
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
              if(this.teams.length == 1)
              {
                this.active_team = [{id: this.teams[0].id, text: this.teams[0].text}];
                  this.inquiry.teamId = this.teams[0].id;
                  var index = this.team_list.findIndex(x=> x.id==this.teams[0].id);
                  if(this.team_list[index].departmentId){
                    this.active_department = [{id: this.team_list[index].departmentId,text: this.team_list[index].departmentName}];
                    this.inquiry.departmentId = this.team_list[index].departmentId;
                  }else{
                     this.active_department = [];
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
                        });
                        if(this.assignedBy.length == 1)
                        {
                          this.active_assigned =[{id:this.assignedBy[0].id,text:this.assignedBy[0].text}];
                          this.inquiry.assignedbyId = this.assignedBy[0].id;
                        }
                    }
                  });
              }
           }
        });

         this._select2Service.getDepartment().subscribe(result => {

                   if (result != null ) {

                       this.departments =[];
                       this.depts = result.select2data;

                       this.depts.forEach((type:{id:number, name:string}) => {
                           this.departments.push({
                               id: type.id,
                               text: type.name
                           });
                           /*if(type.id === this.inquiry.departmentId){
                               this.active_tagdept = [{id:type.id,text:type.name}];

                           }*/

                       });



                   }

               });

               this._select2Service.getLeadType().subscribe((result) => {
                this.lead_category = [];
                 if (result.select2data != null) {
                  this.leadCategoryDto = result.select2data;
      
                    this.leadCategoryDto.forEach((l_cat:{id:number, name:string}) => {
                    this.lead_category.push({
                             id: l_cat.id,
                             text: l_cat.name
                    });
                   });
                 } });
                 this._select2Service.getCompatitorCompany().subscribe((result)=>{
                  this.competators = [];
                  if(result.select2data!=null){
                    this.competitorData = result.select2data;
                    this.competitorData.forEach((compte:{id:number,name:string})=>{
                      this.competators.push({
                        id:compte.id,
                        text: compte.name
                      })
                    });
                  }
             });
             this._select2Service.getSalesCoordinator().subscribe((result) => {
              this.coordinators =[];
               if (result.select3data != null) {
                this.coordinatorData = result.select3data;
    
                  this.coordinatorData.forEach((l_cat:{id:number, name:string}) => {
                  this.coordinators.push({
                           id: l_cat.id,
                           text: l_cat.name
                  });
                 });
               } });
               this._select2Service.getDesigner().subscribe((result) => {
                this.designers =[];
                 if (result.select3data != null) {
                  this.designerData = result.select3data;
      
                    this.designerData.forEach((l_cat:{id:number, name:string}) => {
                    this.designers.push({
                             id: l_cat.id,
                             text: l_cat.name
                    });
                   });
                 } });

       this._inquiryServiceProxy.getInquiryForEdit(inquiryId).subscribe((result) => {
           this.Sources = result.selectedSource;
            console.log(result);
           if (result.inquirys != null) {
              console.log(result);
            this.inquiry = result.inquirys;
           }
        });
      this.active = true;
      //this.modal.show();
    }
    getClientIp(data: string): void{
           this.IpAddress = data + '/' + window.location.hostname;
        }

  public removedCountry(value: any): void {
    console.log('Removed value is: ', value);
  }

  public typedCountry(value: any): void {
    console.log('New search input: ', value);
  }

  public refreshCountryValue(value: any): void {
    this.value = value;
  }

 public selectedCompany(value: any): void {
  this.CompanyDuplicate = false;
  this.disabled_team = false;
  this.disabled_assigned = false;
    this.CompanyText = null;
    console.log('Selected value is: ', value);
    this.inquiry.companyId = value.id;
    this.inquiry.companyName = value.text;
    this.dept_dis = false; 
    this.getContacts(value.id);
    this.getCompanyDetails(value.id,value.text);
    var indexidus = this.companies.findIndex(x=> x.id==value.id);
    var induid = this.companies[indexidus].industryId;
    var index = this.indus.findIndex(x => x.id==induid);
    if(index!=-1){
      this.active_indus = [{id:this.indus[index].id,text:this.indus[index].text}];
      this.company.industryId = this.indus[index].id;
      this.disabled_indus = true;
  }else{
    this.active_indus =[];
    this.company.industryId = null;
    this.disabled_indus = false;
  } 

  }

  getCompanyDetails(Id,Name){
    this._select2Service.getCompanyDetails(Id,Name).subscribe((result) => {
      if (result.select2Company != null) {
          this.companyDetailsDto = result.select2Company;
          if(this.companyDetailsDto.email)
          {
            this.inquiry.cEmail = this.companyDetailsDto.email;
          }else{
            this.inquiry.cEmail = null;
          }
          if(this.companyDetailsDto.phonenumber)
          {
            this.inquiry.cLandlineNumber = this.companyDetailsDto.phonenumber;
          }else{
             this.inquiry.cLandlineNumber = null;
            }
          if(this.companyDetailsDto.website){
            this.inquiry.cMbNo = this.companyDetailsDto.website;
          }else{
            this.inquiry.cMbNo = null;
          }
          if(this.companyDetailsDto.teamId > 0){
            this.active_team = [{id: this.companyDetailsDto.teamId,text: this.companyDetailsDto.teamName}];
            this.active_department = [{id: this.companyDetailsDto.divisionId,text: this.companyDetailsDto.divisionName}];
            this.inquiry.teamId = this.companyDetailsDto.teamId;
            this.inquiry.departmentId = this.companyDetailsDto.divisionId;
          }
          else{
            this.active_team = [];
            this.active_department = [];
            this.inquiry.teamId = null;
            this.inquiry.departmentId = null;
          }
          if(this.companyDetailsDto.salesManId > 0){
            this.active_assigned = [{id: this.companyDetailsDto.salesManId,text: this.companyDetailsDto.salesMan}];
            this.inquiry.assignedbyId = this.companyDetailsDto.salesManId;
          }
          else{
            this.active_assigned = [];
            this.inquiry.assignedbyId = null;
          }
      }
    });
  }


  public removedCompany(value: any): void {
      this.active_team = [];
      this.active_department = [];
      this.inquiry.teamId = null;
      this.inquiry.departmentId = null;
      this.active_assigned = [];
      this.inquiry.assignedbyId = null;
      this.active_indus =[];
      this.disabled_indus = false;
      this.company.industryId = null;
      this.CompanyDuplicate = false;
      this.inquiry.companyName = null;
      this.inquiry.cEmail = null;
      this.inquiry.cLandlineNumber = null;
      this.inquiry.cMbNo = null;
  }

  public selectedTeam(value:any):void {
    this.assignedBy = [];
    this.active_assigned =[];
    this.active_team = [{id: value.id, text: value.text}];
    this.inquiry.teamId = value.id;
    var index = this.team_list.findIndex(x=> x.id==value.id);
      if(this.team_list[index].departmentId){
          this.active_department = [{id: this.team_list[index].departmentId,text: this.team_list[index].departmentName}];
          this.inquiry.departmentId = this.team_list[index].departmentId;
     }else{
          this.active_department = [];
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

  public removedTeam(value:any):void {
    this.inquiry.assignedbyId = null;
this.active_assigned =[];
    console.log('Removed value is: ', value);
    this.inquiry.teamId = null;
    this.inquiry.departmentId = null;
    this.active_team = [];
    this.active_department = [];
  }

  public typedCompany(event): void {
    this.companyDetailsDto = new Select2CompanyDto();
      this.CompanyText = event.target.value;
      this.active_tags = [{id: 0, text: event.target.value}];
      this.inquiry.companyName = event.target.value;
      this.inquiry.cEmail = null;
      this.inquiry.cLandlineNumber = null;
      this.inquiry.cMbNo = null;
      this.inquiry.companyId = null;
      this.fname=[];
      this.getCompanys(event.target.value);
      if(this.contact_edit.id)
      {
        this.getContactdetails(0);
      }      
      this._select2Service.getCompanyDetails(0,event.target.value).subscribe((result) => {
        if(result.select2Company != null){
          this.companyDetailsDto = result.select2Company;
          this.CompanyDuplicate = true;
        }
        else{
          this.CompanyDuplicate = false;
        }
      });
  }

  getCompanys(data):void{
    this._select2Service.getAllCompanyEnquiry(data).subscribe((result) => { 
      if (result.select4data != null) { 
          this.companys = result.select4data; 
           this.companies = [];
           this.companys.forEach((company:{id:number, name:string, industryId:number}) => {
                       this.companies.push({
                             id: company.id,
                             text: company.name,
                             industryId: company.industryId
                             });
                          });
                      }
                });
        
  }
  
  isValidInquiry(data){
    if(!data.valid || !this.inquiry.name || !this.inquiry.statusId || !this.inquiry.companyName || !this.inquiry.cEmail || !this.inquiry.cLandlineNumber || !this.inquiry.departmentId || !this.inquiry.teamId || !this.inquiry.assignedbyId || !this.inquiry.email || !this.inquiry.mbNo  || !this.contact_edit.titleId || !this.contact_edit.name || this.CompanyDuplicate || !this.inquiry.estimationValue || !this.inquiry.remarks)
      {      
      return true;
    }else{
        return false;
        }
    }

    
public removedAssigned(value:any):void {
  this.inquiry.assignedbyId = null;
  this.active_assigned =[];
}

  createInquiryContactInfo(InqId){
    if(InqId){
      this.inquiryContact.id = InqId;
      this._inquiryServiceProxy.createInquiryContactInfo(this.inquiryContact).subscribe(result=>{
      });
    }
  }  
  createInquiryCompanyInfo(InqId){
    if(InqId){
      this.inquiryContact.id = InqId;
      this._inquiryServiceProxy.createInquiryCompanyInfo(this.inquiryContact).subscribe(result=>{
      });
    }
  }  
  public typeddesc(value: any): void {
    this.descText = value;
    this.active_desg = [{id: 0, text: value}];
    console.log('New search input: ', value);
    this.desid.desiginationName = value;
    this.inquiry.designationName = value;
    this.inquiry.designationId = null;
    this.contact_edit.designationId =null;
  }
  refreshCompanyValue(value: any): void {
    this.value = this.companies;
        console.log('refresh company input: ', this.companies);
  }
  public refreshFname(value:any,data:any):void{
    console.log('refresh is working here');
    var index = this.con_name.findIndex(x => x.id==value.id);
    this.contact_edit.name = this.con_name[index].name;
    this.contact_edit.id = value.id;
    this.inquiry.contactId = value.id;
    this.active_fname =[{id:value.id,text:this.con_name[index].name}];
    this.getContactdetails(value.id);
  }
  public removedFname(value:any):void{
    this.contact_edit.name = null;
    this.contact_edit.id = null;
    this.inquiry.contactId = null;
    console.log(value);
    //this.getContactdetails(0);
  }
  public typedFname(event):void{
    this.active_fname = [{id: 0, text: event.target.value}];
    this.contact_edit.name = event.target.value;
    this.contact_edit.id = 0;
    this.inquiry.contactId = null;
    //this.getContactdetails(0);
    console.log(this.contact_edit.name);
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
    this.active_opportunity = [{"id":data.id,"text":data.text}];
  }
  removedOpportunitySource(data:any){
    this.inquiry.whyBafcoId = null;
    this.active_opportunity = [];
  }
  selectedWhyBafco(data:any){
    this.inquiry.whyBafcoId = data.id;
    this.active_whybafco = [{"id":data.id,"text":data.text}];
  }
  removedWhyBafco(data:any){
    this.inquiry.whyBafcoId = null;
    this.active_whybafco = [];
  }
  
  getContacts(data){
    this._select2Service.getCompanyContacts(data).subscribe((result)=>{
        console.log(result.select2data,' company contacts');
        if(result.select2data!=null){
            this.newContactlist = result.select2data;
            this.fname = [];
            this.con_name=[];
            this.newContactlist.forEach((customer:{id:number,name:string,fullName:string})=>{
              this.con_name.push({id:customer.id,name:customer.name});
              this.fname.push({
                id:customer.id,
                text: customer.fullName
              });
            });
            
        }
    });
    
    if(this.contact_edit.id)
    {
      this.getContactdetails(0);
    }
  }
  getContactdetails(contact_id){
      this.dataCon=[];
        this.formdata=[];
        //this.cdr.detectChanges();
        if(contact_id){
          this.contact_edit.id =contact_id;
        this._newCompanyContactServiceProxy.getNewContactForEdit(contact_id).subscribe((result)=>{
            if(result!=null){
              this.formdata=result[0].addressInfo;
              this.dataCon = result[0].contactinfo;

              if(this.dataCon.length > 0){
                var contactEmail = this.dataCon.findIndex(x => x.newInfoTypeId == 4);
                if(contactEmail != -1 && this.dataCon[contactEmail].infoData){
                  this.inquiry.email = this.dataCon[contactEmail].infoData;
                }
                var contactMbNo = this.dataCon.findIndex(x => x.newInfoTypeId == 7);
                if(contactMbNo != -1 && this.dataCon[contactMbNo].infoData){
                  this.inquiry.mbNo = this.dataCon[contactMbNo].infoData;
                }
                var contactPhone = this.dataCon.findIndex(x => x.newInfoTypeId == 9);
                if(contactPhone != -1 && this.dataCon[contactPhone].infoData){
                  this.inquiry.landlineNumber = this.dataCon[contactPhone].infoData;
                }
              }

              this.cmpname = result[0].name;
              this.cusTypeId = result[0].newCustomerTypeId;
              this.new_company_id = result[0].companyId;
              this.contact_edit.titleId= result[0].titleId;
              this.new_title_id = result[0].titleId;
              this.lname = result[0].lastName;
              this.contact_edit.designationId = result[0].designationId;
              if(result[0].companyId > 0)
              {
                this.inquiry.companyId = result[0].companyId;
                this.inquiry.companyName = result[0].companyName;
                this.active_tags = [{id: 0, text: result[0].companyName}];
              }           
              this.active_fname = [{id: 0, text: this.cmpname}];
 
            var index = this.designation.findIndex(x => x.id==this.contact_edit.designationId);
            //console.log(this.indus);
            if(index!=-1){
                this.active_desg = [{id:this.contact_edit.designationId,text:this.designation[index].text}];
            }else{
              this.active_desg =[];
              this.contact_edit.designationId = 0;
            } 
            this._select2Service.getNewCustomerType().subscribe((result) => {
           if (result.select2data != null) {
            this.companyType=result.select2data;
            this.companytypes=[];
            this.companyType.forEach((customer:{id:number,name:string})=>{
              this.companytypes.push({
                id:customer.id,
                text:customer.name
              });
              if(this.cusTypeId===customer.id){
                   this.active_customer = [{id:customer.id,text:customer.name}];
                }
            });
            
           } });
    this._select2Service.getTitle().subscribe((result) => {
            if (result.select2data != null) {
              this.types = result.select2data;
              this.title=[];
                this.types.forEach((titles:{id:number, name:string}) => {
                  this.title.push({
                    id: titles.id,
                    text: titles.name
                  });
        if(this.new_title_id == titles.id){
                  this.active_title=[{id:titles.id,text:titles.name}];
                }
                });
            } 
    });

            this.myForm = this.showConDetails();

            this.addAddress(0);
            // // add contact
            this.addContacts(0);

            
          }

        });
      }else{
          this.contact_edit.titleId=0;
          this.contact_edit.industryId = null;
          this.contact_edit.id = 0;
          this.cmpname = '';
          this.cusTypeId = 0;
          this.new_company_id = 0;
          this.new_title_id = 0;
          this.lname = '';
          this.active_title=[];
          this.active_desg=[];
          this.active_customer=[];
          this.inquiry.email = "";
          this.inquiry.mbNo = "";
          this.inquiry.landlineNumber = "";
          this.active_fname =[];
          this.active_indus = [];
          this.newIndustry=null;
          this.myForm = this.showConDetails();
          this.addAddress(1);
          // // add contact
          this.addContacts(1);
      }
  }
  showConDetails(){
      return  this._fb.group({
        lastName: [this.lname, [Validators.required]],
        typeid: this.contact_edit.newCustomerTypeId,
        newtitleid: this.contact_edit.titleId,
        addresses: this._fb.array([]),
        contacts: this._cfb.array([])
        });
}
 public selecteddesc(value: any): void {
     this.descText = null;
    this.inquiry.designationId = value.id;
    this.contact_edit.designationId=value.id;
    console.log('Selected value is: ', value);
  }

  public removeddesc(value: any): void {
     this.contact_edit.designationId =null;
    console.log('Removed value is: ', value);
  }


    public refreshTitle(value:any,model):void{
    this.contact_edit.titleId=value.id;
    console.log(value);
    
  }
  public removedTitle(value,model):void{
    console.log(value);
    this.contact_edit.titleId=0;
  }

  searchContactInfo(value,from):void {
    /* if(from == 1)
    {
      this.searchContact.mobileNo = value;
    }
    else{
      this.searchContact.email = value;
    }
    this._newCompanyContactServiceProxy.searchContactInfoId(this.searchContact).subscribe((result)=>{
      this.getContactdetails(result);
    }); */
  }

  
   save(model): void {    
    this.saving = true;
    if(this.inquiry.id == null) {
      this.inquiry.id = 0;
      this.inquiry.mileStoneId = 4;
    }
    if(this.closedDate){
      let stdate= moment(moment(this.closedDate).toDate().toString());
      this.inquiry.closureDate = moment(stdate).add(6, 'hours');
    }
    if(this.lastActivity){
      let lst= moment(moment(this.lastActivity).toDate().toString());
      this.inquiry.lastActivity = moment(lst).add(6, 'hours');
    }
    this.inquiry.sourceId =  _.map(
       _.filter(this.Sources, { isAssigned: true }), Source => Source.sourceId
    );

   

    this.inquiry.browcerinfo = navigator.userAgent;
    if(this.inquiry.companyName != null && this.inquiry.companyId == null){
        this.company.companyName = this.inquiry.companyName;
        this.company.inSales = true;
          this._inquiryServiceProxy.newCompanyCreate(this.company).subscribe((result) => {
            if(result){
                  this.inquiry.companyId = result;
                  this.CompanyText = null;
                  this.contact_edit.lastName = model._value.lastName;
                  this.contact_edit.newCompanyId = this.inquiry.companyId;
                  this.contact_edit.newCustomerTypeId = 4;
                  this.assignedDiff = true;
                  console.log(this.contact_edit);

                  if(this.inquiry.designationId == null && this.descText != null){
                    this.desid.designationCode = 'AUTO'
                    this._inquiryServiceProxy.newDesignationCreate(this.desid).subscribe((result) => {
                      if(result)
                      {
                        this.inquiry.designationId = result;
                        this.contact_edit.designationId = result;
                        this.descText = null;
                        this.createContacts(model,this.contact_edit);
                      }
                    });
                  } 
                  else{
                    this.createContacts(model,this.contact_edit);
                  }                         
            }

  
          });
    }
    else if(this.contact_edit.id == 0 && this.inquiry.contactId == null && this.inquiry.companyId > 0){
        this.contact_edit.lastName = model._value.lastName;
        this.contact_edit.newCompanyId = this.inquiry.companyId;
        this.contact_edit.newCustomerTypeId = 4;
        if(this.inquiry.designationId == null && this.descText != null){
          this.desid.designationCode = 'AUTO'
          this._inquiryServiceProxy.newDesignationCreate(this.desid).subscribe((result) => {
            if(result)
            {
              this.inquiry.designationId = result;
              this.contact_edit.designationId = result;
              this.descText = null;
              this.createContacts(model,this.contact_edit);
            }
          });
        } 
        else{
          this.createContacts(model,this.contact_edit);
        }  
      }
      else{
        if(this.inquiry.designationId == null && this.descText != null){
          this.desid.designationCode = 'AUTO'
          this._inquiryServiceProxy.newDesignationCreate(this.desid).subscribe((result) => {
            if(result)
            {
              this.inquiry.designationId = result;
              this.contact_edit.designationId = result;
              this.descText = null;
              this.contact_edit.lastName = model._value.lastName;
              this.contact_edit.newCompanyId = this.inquiry.companyId;
              this.contact_edit.newCustomerTypeId = 4;
              this._newCompanyContactServiceProxy.createOrUpdateCompanyOrContact(this.contact_edit).subscribe((result) => {
              });
        this._inquiryServiceProxy.createSalesInquiryInformation(this.inquiry).finally(() => this.saving = false)
          .subscribe((result) => {
            if(result){
              this.saveLeadInformation(result);
              this.updateSalesman();
              this.notify.info(this.l('Saved Successfully'));
              this.close();
              this.modalSave.emit(this.inquiry);
            }
              
          });
              
            }
          });
        } 
        else{
          this.contact_edit.lastName = model._value.lastName;
          this.contact_edit.newCompanyId = this.inquiry.companyId;
          this.contact_edit.newCustomerTypeId = 4;
          this._newCompanyContactServiceProxy.createOrUpdateCompanyOrContact(this.contact_edit).subscribe((result) => {
          });
        this._inquiryServiceProxy.createSalesInquiryInformation(this.inquiry).finally(() => this.saving = false)
          .subscribe((result) => {
            if(result){
              this.saveLeadInformation(result);
              this.updateSalesman();
              this.notify.info(this.l('Saved Successfully'));
              this.close();
              this.modalSave.emit(this.inquiry);
            }
              
          });
          
        }  
       
      }
        
}

updateSalesman(){
  if(this.assignedDiff && this.inquiry.companyId > 0 && this.inquiry.assignedbyId > 0){
   this.updateSalesmanInput.companyId = this.inquiry.companyId;
   this.updateSalesmanInput.salesmanId = this.inquiry.assignedbyId;
   this._inquiryServiceProxy.updateSalesmanAll(this.updateSalesmanInput).subscribe(result=>{
       this.notify.success(this.l('Updated Successfully'));
   });
 }
 
}

createContacts(model,contactedit)
{
  this._newCompanyContactServiceProxy.createContact(contactedit).subscribe((result) => {
    if(result){
    this.inquiry.contactId = result;
    for(var i=0;i<model.value.addresses.length;i++){
      if(model.value.addresses[i].id==0 || model.value.addresses[i].street!='' || model.value.addresses[i].postcode!='' || 
            model.value.addresses[i].cityid!=null || model.value.addresses[i].typeid!=null){
                this.address.id = model.value.addresses[i].id;
                this.address.newContacId = this.inquiry.contactId;
                this.address.newInfoTypeId = model.value.addresses[i].typeid;
                this.address.address1 = model.value.addresses[i].street;
                this.address.address2 = model.value.addresses[i].postcode;
                this.address.cityId = model.value.addresses[i].cityid;
                this._newCompanyContactServiceProxy.createOrUpdateAddressInfo(this.address).subscribe((result)=>{
                });
      }
    }
    for(var i=0;i<model.value.contacts.length;i++){
        if(model.value.contacts[i].id==0 || model.value.contacts[i].contactinfo!='' || model.value.contacts[i].infoid!=null ){
            this.contact.id =model.value.contacts[i].id;
            this.contact.newContacId = result;
            this.contact.newInfoTypeId = model.value.contacts[i].infoid;
            this.contact.infoData = model.value.contacts[i].contactinfo;
            this._newCompanyContactServiceProxy.createOrUpdateContactInfo(this.contact).subscribe((result)=>{
            });
        }
    }
}
console.log(this.inquiry);
this._inquiryServiceProxy.createSalesInquiryInformation(this.inquiry).finally(() => this.saving = false)
.subscribe((result) => {
  if(result)
  {
     this.saveLeadInformation(result);
     this.createInquiryContactInfo(result);
     this.createInquiryCompanyInfo(result);
  }
  this.updateSalesman();
    this.notify.info(this.l('Saved Successfully'));
    this.close();
    this.modalSave.emit(this.inquiry);
});

}); 
}

saveLeadInformation(InquiryId){
  console.log(InquiryId);
  if(InquiryId){
    this.saveLeadDetailInput.id = 0;
    this.saveLeadDetailInput.inquiryId = InquiryId;
    this.saveLeadDetailInput.estimationValue = this.inquiry.estimationValue;
    this.saveLeadDetailInput.size = this.inquiry.size;
    this.saveLeadDetailInput.leadSourceId = this.inquiry.opportunitySourceId;
    this.saveLeadDetailInput.leadTypeId = this.inquiry.leadTypeId;
    //this.saveLeadDetailInput.salesManagerId = this.inquiry.assignedbyId;
    console.log('form submitted',this.saveLeadDetailInput);
    this._inquiryServiceProxy.createOrUpdateLeadDetails(this.saveLeadDetailInput).subscribe(result=>{
    });
  }
    
}

    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }

    close(): void {
        this.active_assigned = [];
        this.active_whybafco = [];
        this.active_opportunity = [];
        this.disabled_indus = false;
        this.active = false;
        this.CompanyDuplicate = false;
        this.disabled_team = false;
        this.disabled_assigned = false;
        this.active_tags=[];
        this.descText="";
        this.CompanyText="";
        this.IpAddress="";
        this.Sources=[];
        this.active_desg=[];
        this.active_title=[];
        this.active_customer=[];
        this.fname=[];
        this.active_fname =[];
        this.active_department = [];
        this.active_team = [];
        this.active_leadCategory = [];
        this.active_Competitors = [];
        this.active_Coordinator = [];
        this.active_designer = [];
        this.designerr = false;
        this.assignedDiff = false;
        //this.modal.hide();
        this.router.navigate(["/app/main/sales-enquiry"]);  
    }
	
		/* Contact FUnction */
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
        
        console.log(this.address_remove_values.id);

        control.removeAt(i);
    }
    refreshIndus(value:any){
     this.company.industryId = value.id;
      this.newIndustry=null;
    }
    removedIndus(value:any){
      this.company.industryId =null;
      this.newIndustry=null;
    }
    /* typedIndus(data?:string){
      this.contact_edit.industryId =null;
      this.newIndustry = data;
      this.active_indus = [{id:0,text:this.newIndustry}]
    } */
    selectedStatus(data:any){
      this.inquiry.statusId = data.id;
    }
    removedStatus(data:any){
      this.inquiry.statusId = null;
    }
    /* typedStatus(data:any){
      this.inquiry.statusId = null;
    } */
    private selectAssigned(data):void{
      this.inquiry.assignedbyId = data.id;
      if(this.inquiry.assignedbyId != this.companyDetailsDto.salesManId && this.companyDetailsDto.salesManId > 0){
        this.message.confirm(
          this.l('If you Change the Salesperson It will affect All the Open Enquiry and Quotation related to this Company'),
            isConfirmed => {
              if (isConfirmed) {
                this.assignedDiff = true;
              }
              else{
                this.getCompanyDetails(this.inquiry.companyId,this.inquiry.companyName);
                this.assignedDiff = false;
              }
            });
      }
      else{
        this.assignedDiff = false;
      }
    }
    
    private selectDepartment(data):void{
      this.assigned_dis = false;
      this.inquiry.departmentId = data.id;
      console.log(this.inquiry.departmentId);
      this._select2Service.getSalesFromDepatment(data.id).subscribe(result=>{
            if(result!=null){
            this.AssignedBy_data = result.select2data;
            this.assignedBy = [];
            this.AssignedBy_data.forEach((assign:{id:number,name:string})=>{
              this.assignedBy.push({
                id:assign.id,
                text:assign.name
              });
              /*if(this.inquiry.assignedbyId==assign.id){
                this.active_assigned =[{id:assign.id,text:assign.name}];
              }*/
            });
          }
          });
    }
    selectedLeadCategory(data:any){
      this.inquiry.leadTypeId = data.id;
      this.active_leadCategory = [{id:data.id,text:data.text}];
    }
    removedLeadCategory(data:any){
      this.inquiry.leadTypeId = null;
      this.active_leadCategory = [];
    }
    typedLeadCategory(data:any){
      this.inquiry.leadTypeId = null;
      this.active_leadCategory = [{id:0,text:data.target.value}];
    }
    selectedCompetitor(data:any){
      this.inquiry.compatitorsId = data.id;
      this.active_Competitors = [{id:data.id,text:data.text}];
    }
    removedCompetitor(data:any){
      this.inquiry.compatitorsId = null;
      this.active_Competitors = [];
    }
    typedCompetitor(event:any){
      this.inquiry.compatitorsId = null;
      this.active_Competitors = [{id:0,text:event.target.value}];
    }
    selectedCoord(data:any){
      this.saveLeadDetailInput.coordinatorId = data.id;
      this.active_Coordinator = [{"id":data.id,"text":data.text}];
    }
    removedCoord(data:any){
      this.saveLeadDetailInput.coordinatorId = null;
      this.active_Coordinator = [];
    }
    typedCoord(data:any){
      this.saveLeadDetailInput.coordinatorId = null;
      this.active_Coordinator = [{"id":0,"text":data.target.value}];
    }
    selectedDesigner(data:any){
      this.saveLeadDetailInput.designerId = data.id;
      this.active_designer = [{"id":data.id,"text":data.text}];
    }
    removedDesigner(data:any){
      this.saveLeadDetailInput.designerId = null;
      this.active_designer = [];
    }
    typedDesigner(event:any){
      this.saveLeadDetailInput.designerId = null;
      this.active_designer = [{"id":0,"text":event.target.value}];
    }


}
