import { Component, ViewChild, Injector, Renderer, ElementRef, Input, Output, EventEmitter, OnInit, OnDestroy,AfterViewInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Select2ServiceProxy, Datadto, InquiryServiceProxy, Sourcelist, InquiryListDto, CreateCompanyInput, CompanyServiceProxy, CompanyCreateInput, DesignationInputDto, LocationInputDto,NewCompanyContactServiceProxy,CreateAddressInfo,CreateContactInfo,CreateCompanyOrContact,NewContactListDto,Contactdto,IndustryServiceProxy,IndustryInputDto, CheckInquiryInput, EnquiryContactInput, NullableIdDto, Select2CompanyDto } from 'shared/service-proxies/service-proxies';
import {Jsonp} from '@angular/http';
import * as _ from "lodash";
import { ChatSignalrService } from 'app/shared/layout/chat/chat-signalr.service';
import { SignalRHelper } from 'shared/helpers/SignalRHelper';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

export interface SelectOption{
   id?: number;
   text?: string;
}
@Component({
    selector: 'createInquiryModal',
    templateUrl: './createORedit.component.html'

})
export class CreateInquiryModalComponent extends AppComponentBase implements OnInit,AfterViewInit {
  
    location: any[];
    assignedDiff: boolean = false;
    inquiryDuplicate: boolean = false;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    companyDetailsDto:Select2CompanyDto = new Select2CompanyDto();
    private value: any = {};
    CompanyText: string = null;
    quoat_view:boolean = false;
    private value1: any = {};
    private items: Array<any> = [];
    private companies: Array<any> = [];
    private designation: Array<any> = [];
    private assignedapp: Array<any> = [];
    company: CompanyCreateInput = new CompanyCreateInput();
    active_tags: SelectOption[];
    active_desg: SelectOption[];
    IpAddress: string;
    inquiry: InquiryListDto = new InquiryListDto();
    desid: DesignationInputDto = new DesignationInputDto();
    checkInquiry: CheckInquiryInput = new CheckInquiryInput();
    searchContact: EnquiryContactInput = new EnquiryContactInput();
    designations: Datadto[] = [];
    companys: Datadto[] = [];
    Sources: Sourcelist[];
    descText: string = null;
    clientip: any;
    @Output() updateCompany = new EventEmitter<any>();
    i: number = 0;
    active = false;
    saving = false;
    private subscription: Subscription;
    pageTitle: string = "";
	public myForm: FormGroup;
	dataCon: any=[];
   contact_remove_values:any=[];
   address_remove_values:any=[];
   types:Datadto[];
   removed_address_arr:any=[];
  remove_contact_arr:any=[];
  formdata:any=[];
  private id: number;
  pageTag: string = "";
  private companytypes:Array<any> = [];
  companyType:Datadto[]=[];
  contact_edit: CreateCompanyOrContact = new CreateCompanyOrContact();
  private title:Array<any> = [];
  address:CreateAddressInfo =new CreateAddressInfo();
  contact:CreateContactInfo = new CreateContactInfo();
  active_fname: SelectOption[];
  private fname:Array<any> = [];
  contactlist:NewContactListDto[];
  cusTypeId:number=0;
   cmpname:string='';
   lname:string='';
   active_customer:SelectOption[];
   new_company_id:number=0;
   new_title_id:number=0;
   active_title:SelectOption[];
   newContactlist:Contactdto[];
   private indus:Array<any>=[];
   allIndustry:Datadto[];
   active_indus:SelectOption[];
   con_name:any=[];
   newIndustry:string='';
   industryInput:IndustryInputDto = new IndustryInputDto(); 
   statuses:Array<any> = [];
   private locations: Array<any> = [];
   active_location:SelectOption[];
   allStatus:Datadto[];
   active_whybafco:SelectOption[];
   whybafco:Array<any>;
   whybafcodto:Datadto[];
   active_opportunity:SelectOption[];
   opportunity_source:Array<any>;
   opportunitysourcedto:Datadto[];
   inquiryContact:NullableIdDto = new NullableIdDto;
   active_status:SelectOption[];

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
        private router: Router

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
    }
    ngAfterViewInit(): void {
      this.show(0);
    }

   show(inquiryId?: number): void {
    this.getContactdetails(0);
    this.contact_edit = new CreateCompanyOrContact();
    this.inquiry= new InquiryListDto();
       //this.pageTitle =  '';
    //this.pageTag   =  '';
    
    
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
         this._select2Service.getEnquiryStages(1).subscribe((result)=>{
            if(result.select2data !=null){
              this.allStatus = result.select2data;
              this.statuses = [];
              this.allStatus.forEach((stat:{id:number,name:string})=>{
                this.statuses.push({
                  id:stat.id,
                  text:stat.name
                });
              });
              if(this.statuses.length > 0)
              {
                this.active_status = [{id: this.statuses[0].id, text: this.statuses[0].text}];
                this.inquiry.statusId = this.statuses[0].id; 
              }
            }
         });
       this._inquiryServiceProxy.getInquiryForEdit(inquiryId).subscribe((result) => {
           this.Sources = result.selectedSource;
            console.log(result);
           if (result.inquirys != null) {
              console.log(result);
            this.inquiry = result.inquirys;
           }

        this.active = true;
        });
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
           this.CompanyText = null;
    console.log('Selected value is: ', value);
    this.inquiry.companyId = value.id;
    this.inquiry.companyName = value.text;
    this._select2Service.getCompanyDetails(value.id,value.text).subscribe((result) => {
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
      }
    }); 
    this.getContacts(value.id);
  }

  public removedCompany(value: any): void {
    console.log('Removed value is: ', value);
    this.active_tags = [];
      this.inquiry.companyId = null;
      this.company.companyName = null;
      this.inquiry.cEmail = null;
      this.inquiry.cLandlineNumber = null;
      this.inquiry.cMbNo = null;
      this.getContactdetails(0);
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

  public typedCompany(event): void {
      this.CompanyText = event.target.value;
      this.active_tags = [{id: 0, text: event.target.value}];
      this.inquiry.companyName = event.target.value;
      this.inquiry.companyId = null;
      this.fname=[];
      this.inquiry.cEmail = null;
      this.inquiry.cLandlineNumber = null;
      this.inquiry.cMbNo = null;
      this.getCompany(event.target.value);
      this.getContactdetails(0);
  }

getCompany(data):void{
  this._select2Service.getAllCompany(data).subscribe((result) => {
    if (result.select2data != null) {
        this.companys = result.select2data;
         this.companies = [];
         this.companys.forEach((company: {id: number, name: string}) => {
                     this.companies.push({
                           id: company.id,
                           text: company.name
                           });
                        });
                    }
              });
}

  refreshCompanyValue(value: any): void {
    this.value = this.companies;
        console.log('refresh company input: ', this.companies);
  }
  public refreshFname(value:any,data:any):void{
    console.log('refresh is working here');
    var index = this.con_name.findIndex(x => x.id==value.id);
    this.contact_edit.name = this.con_name[index].name;
    this.active_fname =[{id:value.id,text:this.con_name[index].name}];
    this.getContactdetails(value.id);
  }
  public removedFname(value:any):void{
    this.contact_edit.name = null;
    console.log(value);
    this.getContactdetails(0);
  }
  public typedFname(event):void{
    this.active_fname = [{id: 0, text: event.target.value}];
    this.contact_edit.name = event.target.value;
    //this.getContactdetails(0);
    console.log(this.contact_edit.name);
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
    
    this.getContactdetails(0);
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
      console.log(result,"SearchContId");
      this.getContactdetails(result);
    }); */
  }


  getContactdetails(contact_id){
      this.dataCon=[];
        this.formdata=[];
        //this.cdr.detectChanges();
        if(contact_id){
          this.contact_edit.id =contact_id;
        this._newCompanyContactServiceProxy.getNewContactForEdit(contact_id).subscribe((result)=>{
            console.log(result[0]);
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
              // this.contact_edit.industryId = result[0].industryId;
              // var index = this.indus.findIndex(x => x.id==this.contact_edit.industryId);
              
              this.contact_edit.designationId = result[0].designationId;
              var index = this.designation.findIndex(x => x.id==this.contact_edit.designationId);
            if(index!=-1){
                this.active_desg = [{id:this.contact_edit.designationId,text:this.designation[index].text}];
            }else{
              this.active_desg =[];
              this.contact_edit.designationId = null;
            } 


              if(result[0].companyId > 0)
              {
                this.inquiry.companyId = result[0].companyId;
                this.inquiry.companyName = result[0].companyName;
                this.active_tags = [{id: 0, text: result[0].companyName}];
              }           
              this.active_fname = [{id: 0, text: this.cmpname}];
 
            //   if(index!=-1){
            //     this.active_indus = [{id:this.contact_edit.industryId,text:this.indus[index].text}];
            // }else{
            //   this.active_indus =[];
            // } 
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
        contacts: this._cfb.array([]),
        // empaddress:this._fb.array([])
        });
}
public selecteddesc(value: any): void {
  this.descText = null;
 this.inquiry.designationId = value.id;
 this.contact_edit.designationId=value.id;
 console.log('Selected value is: ', value);
}

public removeddesc(value: any): void {
  this.inquiry.designationId = null;
 this.contact_edit.designationId=null;
 this.descText = null;
 console.log('Removed value is: ', value);
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

  /* saveDesignation(): void {
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
    } */

    public refreshTitle(value:any,model):void{
    this.contact_edit.titleId=value.id;
    console.log(value);
    
  }
  public removedTitle(value,model):void{
    console.log(value);
    this.contact_edit.titleId=0;
  }
  selectedWhyBafco(data:any){
    this.inquiry.whyBafcoId = data.id;
    this.active_whybafco = [{"id":data.id,"text":data.text}];
  }
  removedWhyBafco(data:any){
    this.inquiry.whyBafcoId = null;
    this.active_whybafco = [];
  }

  CheckInquiryDuplicate(data){
    this.checkInquiry.inquiryName = data;
    this._inquiryServiceProxy.checkInquiryDuplicate(this.checkInquiry).subscribe((result) =>{
        this.inquiryDuplicate = result;

    });

  }
   save(model): void {
     /* if(this.inquiry.designationId == null && this.descText != null){
      this.desid.designationCode = 'AUTO'
      console.log(this.desid,"Design Create");
      this._inquiryServiceProxy.newDesignationCreate(this.desid).subscribe((result) => {
        if(result)
        {
          console.log(result);
          this.inquiry.designationId = result;
          this.contact_edit.designationId = result;
          this.descText = null;
        }
      });
    }  */
    /*if(this.company.companyName!=null){
      this._inquiryServiceProxy.newCompanyCreate(this.company)
            .subscribe((result) => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.inquiry.companyId = result;
                this.CompanyText = null;
            });
          }*/

               this.saving = true;
       this.inquiry.sourceId =  _.map(
                _.filter(this.Sources, { isAssigned: true }), Source => Source.sourceId
            );
       var date = new Date();
        this.inquiry.browcerinfo = navigator.userAgent;
           if (this.inquiry.id == null) {
               this.inquiry.id = 0;
               this.inquiry.mileStoneId = 1;
           }
           //this.contact_edit.newCustomerTypeId= model.value.typeid;
          //this.contact_edit.id = 0;
          //this.contact_edit.name = model._value.companyName;
          this.contact_edit.lastName = model._value.lastName;
          this.contact_edit.newCustomerTypeId = 4;
          this.inquiry.compatitorsId =0;
          this.inquiry.leadTypeId = 0;
          this.inquiry.size = null;
          this.inquiry.estimationValue =0;
          this.contact_edit.newCompanyId = this.inquiry.companyId;
        console.log(this.contact_edit);
        
        if(this.contact_edit.id){
          this.inquiry.contactId = this.contact_edit.id;
          if(this.inquiry.designationId == null && this.descText != null){
            this.desid.designationCode = 'AUTO'
            this._inquiryServiceProxy.newDesignationCreate(this.desid).subscribe((designationId) => {
              if(designationId)
              {
                 this.inquiry.designationId = designationId;
                 this.contact_edit.designationId = designationId;
                 this.descText = null;
                 this.updateContacts(model);
              }
            });
          }
          else{
            this.updateContacts(model);
          }
          
      }        
        else{
          if(!this.contact_edit.industryId && this.newIndustry){
            this.industryInput.id = 0;
            this.industryInput.industryCode = 'AUTO_'+Date.now();
            this.industryInput.industryName = this.newIndustry;

            this._industryServiceProxy.createNewIndustry(this.industryInput).subscribe(result=>{
              if(result){
               this.contact_edit.industryId = result;
               console.log(result); 
              this.contact_edit.id = 0;
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
              
       /* this._newCompanyContactServiceProxy.createContact(this.contact_edit).subscribe((result) => {
                if(result){
                  this.inquiry.contactId = result;
                for(var i=0;i<model.value.addresses.length;i++){
            if(model.value.addresses[i].id==0 || model.value.addresses[i].street!='' || model.value.addresses[i].postcode!='' || 
              model.value.addresses[i].cityid!=null || model.value.addresses[i].typeid!=null){
              //this.values_arr.push(model.value.addresses[i]);
              this.address.id = model.value.addresses[i].id;
              this.address.newContacId = result;
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
              //this.contact_arr.push(model.value.contacts[i]);
              this.contact.id =model.value.contacts[i].id;
              this.contact.newContacId = result;
              this.contact.newInfoTypeId = model.value.contacts[i].infoid;
              this.contact.infoData = model.value.contacts[i].contactinfo;
              this._newCompanyContactServiceProxy.createOrUpdateContactInfo(this.contact).subscribe((result)=>{
                  
              });
            }
        }
            this._inquiryServiceProxy.createOrUpdateInquiry(this.inquiry)
            .finally(() => this.saving = false)
            .subscribe((result) => {
              if(result){
                this.createInquiryContactInfo(result);
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(this.inquiry);
              }
              
            });
          }

      }); */
            }
            });
            
          }else{
       this.contact_edit.id = 0;
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
       
       /* this._newCompanyContactServiceProxy.createContact(this.contact_edit).subscribe((result) => {
                if(result){
                  this.inquiry.contactId = result;
                for(var i=0;i<model.value.addresses.length;i++){
            if(model.value.addresses[i].id==0 || model.value.addresses[i].street!='' || model.value.addresses[i].postcode!='' || 
              model.value.addresses[i].cityid!=null || model.value.addresses[i].typeid!=null){
              //this.values_arr.push(model.value.addresses[i]);
              this.address.id = model.value.addresses[i].id;
              this.address.newContacId = result;
              this.address.newInfoTypeId = model.value.addresses[i].typeid;
              this.address.address1 = model.value.addresses[i].street;
              this.address.address2 = model.value.addresses[i].postcode;
              this.address.cityId = model.value.addresses[i].cityid;
              this._newCompanyContactServiceProxy.createOrUpdateAddressInfo(this.address).subscribe((result)=>{
              this.ngOnInit();

              });
            }
            
        }
        for(var i=0;i<model.value.contacts.length;i++){
            if(model.value.contacts[i].id==0 || model.value.contacts[i].contactinfo!='' || model.value.contacts[i].infoid!=null ){
              //this.contact_arr.push(model.value.contacts[i]);
              this.contact.id =model.value.contacts[i].id;
              this.contact.newContacId = result;
              this.contact.newInfoTypeId = model.value.contacts[i].infoid;
              this.contact.infoData = model.value.contacts[i].contactinfo;
              this._newCompanyContactServiceProxy.createOrUpdateContactInfo(this.contact).subscribe((result)=>{
                  console.log(result);
                  this.ngOnInit();
              });
            }
        }
                
                console.log(this.inquiry);
                this._inquiryServiceProxy.createOrUpdateInquiry(this.inquiry)
            .finally(() => this.saving = false)
            .subscribe((result) => {
              if(result){
                this.createInquiryContactInfo(result);
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(this.inquiry);
              }
            });
          }
       }); */
             
      }
    }
    console.log(this.contact_edit);
    }
    createContacts(model,contactedit)
    {
      console.log(this.contact_edit);
      this._newCompanyContactServiceProxy.createContact(this.contact_edit).subscribe((result) => {
        if(result){
          this.inquiry.contactId = result;
        for(var i=0;i<model.value.addresses.length;i++){
    if(model.value.addresses[i].id==0 || model.value.addresses[i].street!='' || model.value.addresses[i].postcode!='' || 
      model.value.addresses[i].cityid!=null || model.value.addresses[i].typeid!=null){
      //this.values_arr.push(model.value.addresses[i]);
      this.address.id = model.value.addresses[i].id;
      this.address.newContacId = result;
      this.address.newInfoTypeId = model.value.addresses[i].typeid;
      this.address.address1 = model.value.addresses[i].street;
      this.address.address2 = model.value.addresses[i].postcode;
      this.address.cityId = model.value.addresses[i].cityid;
      this._newCompanyContactServiceProxy.createOrUpdateAddressInfo(this.address).subscribe((result)=>{

      });
    }
    
}
for(var i=0;i<model.value.contacts.length;i++){
    if(model.value.contacts[i].id==0 || model.value.contacts[i].contactinfo!='' || model.value.contacts[i].infoid > 0 ){
      //this.contact_arr.push(model.value.contacts[i]);
      this.contact.id =model.value.contacts[i].id;
      this.contact.newContacId = result;
      this.contact.newInfoTypeId = model.value.contacts[i].infoid;
      this.contact.infoData = model.value.contacts[i].contactinfo;
      this._newCompanyContactServiceProxy.createOrUpdateContactInfo(this.contact).subscribe((result)=>{
          
      });
    }
}
    this._inquiryServiceProxy.createOrUpdateInquiry(this.inquiry)
    .finally(() => this.saving = false)
    .subscribe((result) => {
      if(result){
        this.createInquiryContactInfo(result);
        if(this.inquiry.companyId)
        {
         this.createInquiryCompanyInfo(result);
        }
        this.notify.info(this.l('SavedSuccessfully'));
        this.close();
        this.modalSave.emit(this.inquiry);
      }
      
    });
  }

});
    }
    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }
    createInquiryContactInfo(InqId){
      if(InqId){
        this.inquiryContact.id = InqId;
        this._inquiryServiceProxy.createInquiryContactInfo(this.inquiryContact).subscribe(result=>{
            this.notify.info(this.l('Contact Saved Successfully'));
        });
      }
    }
    createInquiryCompanyInfo(InqId){
      if(InqId){
        this.inquiryContact.id = InqId;
        this._inquiryServiceProxy.createInquiryCompanyInfo(this.inquiryContact).subscribe(result=>{
            this.notify.info(this.l('Contact Saved Successfully'));
        });
      }
    }
close(): void {
        this.router.navigate(["/app/main/kanban"]);
        this.inquiryDuplicate = false;
        this.active = false;
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
        this.active_whybafco = [];
        this.active_status = [];
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
      this.contact_edit.industryId = value.id;
      this.newIndustry=null;
    }
    removedIndus(value:any){
      this.contact_edit.industryId =null;
      this.newIndustry=null;
    }
    typedIndus(data?:string){
      this.contact_edit.industryId =null;
      this.newIndustry = data;
      this.active_indus = [{id:0,text:this.newIndustry}]
    }
    selectedStatus(data:any){
      this.inquiry.statusId = data.id;
    }
    removedStatus(data:any){
      this.inquiry.statusId = null;
    }
    typedStatus(data:any){
      this.inquiry.statusId = null;
    }
    updateContacts(model){
      if(!this.contact_edit.industryId && this.newIndustry){
        this.industryInput.id = 0;
        this.industryInput.industryCode = 'AUTO_'+Date.now();
        this.industryInput.industryName = this.newIndustry;
        this._industryServiceProxy.createNewIndustry(this.industryInput).subscribe(result=>{
          if(result){
            console.log(result);
            this.contact_edit.industryId = result;
            this._newCompanyContactServiceProxy.createOrUpdateCompanyOrContact(this.contact_edit).subscribe((result) => {
            });
          }
        });
      }else{
        this._newCompanyContactServiceProxy.createOrUpdateCompanyOrContact(this.contact_edit).subscribe((result) => {
        });
      }
      for(var i=0;i<model.value.addresses.length;i++){
        if(model.value.addresses[i].id==0 || model.value.addresses[i].street!='' || model.value.addresses[i].postcode!='' || 
          model.value.addresses[i].cityid!=null || model.value.addresses[i].typeid!=null){
          this.address.id = model.value.addresses[i].id;
          this.address.newContacId = this.contact_edit.id;
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
        if(model.value.contacts[i].id==0 || model.value.contacts[i].contactinfo!='' || model.value.contacts[i].infoid > 0 ){
          this.contact.id =model.value.contacts[i].id;
          this.contact.newContacId = this.contact_edit.id;
          this.contact.newInfoTypeId = model.value.contacts[i].infoid;
          this.contact.infoData = model.value.contacts[i].contactinfo;
          this._newCompanyContactServiceProxy.createOrUpdateContactInfo(this.contact).subscribe((result)=>{
          });
        }
      }
       console.log(this.inquiry);
        this._inquiryServiceProxy.createOrUpdateInquiry(this.inquiry)
        .finally(() => this.saving = false)
        .subscribe((result) => {
          if(result){
           this.createInquiryContactInfo(result);
           this.notify.info(this.l('SavedSuccessfully'));
           this.close();
           this.modalSave.emit(this.inquiry);
          }
        });
    }
}
