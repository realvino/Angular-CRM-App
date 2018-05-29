import { Component, Injector, AfterViewInit, ViewChild,OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Http } from "@angular/http";
import { TokenAuthServiceProxy,InquiryServiceProxy,ProfileServiceProxy, EnquiryUpdateInputDto,EnquiryContactInputDto,EnquiryUpdateServiceProxy,InquiryInputDto,CompanyCreateInput, EnquiryContactServiceProxy,InquiryListDto,EnquiryJunkUpdateInputDto,ContactUpdateInputDto,DesignationInputDto, Select2ServiceProxy, NullableIdDto } from "shared/service-proxies/service-proxies";
import { ActivatedRoute } from "@angular/router";
import { CreateInquiryModalComponent } from "app/main/inquiry/createORedit.component";
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Router } from '@angular/router';
import { DepartmentSelectComponent } from "app/main/kanban/departmentSelect.component";
import * as moment from "moment";
import 'rxjs/add/operator/takeUntil';
import {Subject} from 'rxjs/Subject';
import { StageSelectComponent } from 'app/main/kanban/stage.component';

@Component({
templateUrl: './kanban.component.html',
styleUrls: ['./kanban.component.css'],
animations: [appModuleAnimation()]
})
export class KanbanComponent extends AppComponentBase implements AfterViewInit,OnDestroy {

	loading: boolean;
	@ViewChild('createInquiryModal') createInquiryModal: CreateInquiryModalComponent;
	@ViewChild('selectDepartmentModal') selectDepartmentModal :DepartmentSelectComponent;
	@ViewChild('selectStageModal') selectStageModal :StageSelectComponent;
	inquiryContact:NullableIdDto = new NullableIdDto;
	public groups: Array<any> = [];
	updateInquiryIn: EnquiryUpdateInputDto = new EnquiryUpdateInputDto();
	enquiryData:InquiryListDto = new InquiryListDto();
	company: CompanyCreateInput = new CompanyCreateInput();
	update_details:InquiryInputDto = new InquiryInputDto;
	updateCompanyCont = new ContactUpdateInputDto();
	filterText: string = '';
	isShow:boolean=false;
	linkedContacts:any = [];
	enquiryjunkinput:EnquiryJunkUpdateInputDto = new EnquiryJunkUpdateInputDto();
	isJunk:boolean=false;
	contactInput:EnquiryContactInputDto = new EnquiryContactInputDto();
	desigInput:DesignationInputDto = new DesignationInputDto();
	newCompanyId:number;
	newDesignationId:number;
	newEnqId:number;
	mileStoneid:number;
	isClose:boolean=false;
	stageCount:number;
	stageAvailable:boolean = false;
	private destroy$ = new Subject();	
	StageName:string;
	UpdateStageName:string;
	ContactInfoInput:NullableIdDto = new NullableIdDto();
	constructor(
		injector: Injector,
		private _enquiryContactServiceProxy: EnquiryContactServiceProxy,
        private _http: Http,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
		private profileServiceProxy: ProfileServiceProxy,
        private _inquiryProxyService: InquiryServiceProxy,
		private _enquiryUpdateServiceProxy: EnquiryUpdateServiceProxy,
		private _select2Service: Select2ServiceProxy,
		private dragulaService: DragulaService,
		private router: Router
	) { 
	   super(injector);
		dragulaService.drag.subscribe((value) => {
		  //this.onDrag(value.slice(1));
		});
		
		dragulaService.setOptions('nested-bag', {
			revertOnSpill: true,		
			moves: function (el, container, handle) { 
				return container.getAttribute("data-milestoneName") =='Assigned' || container.getAttribute("data-type") =='status' || container.getAttribute("data-milestoneName") =='junk' ? false : true;
			}
		});
		
		dragulaService.drop.asObservable().takeUntil(this.destroy$).subscribe((value) => {
			this.isJunk = false;
			let [eu, elu] = value.slice(2);
			
			if(eu.getAttribute("data-type")=='status'){
				console.log(eu.getAttribute("data-type"));
				
			}else{
				this.onDrop(value.slice(1),value.slice(2),value.slice(3));
			}
			
		});
		
		 dragulaService.over.subscribe((value) => {
			//console.log('over funct called');
			this.isClose = true;
			this.isJunk = true;
			//this.onOver(value.slice(1));
		});
		
		dragulaService.out.subscribe((value) => {
			//this.onOut(value.slice(2),value.slice(3));
			//this.isJunk = false;
			//console.log( value.slice(2),value.slice(3),'fffffff' );
		});
		
		// router.events.subscribe((val:any) => {
		// 	if(val.url=='/app/main/kanban'){
		// 		this.getTickets('');
		// 	}
		// });
	}
	kanbanActivate(event:any){
		this.getTickets('');
	}
	ngOnDestroy() {
		this.destroy$.next();		
  		this.dragulaService.destroy('nested-bag');
  	}
	private onToggleJunk( isJunk ) {
		this.isJunk = false;
	}
	private onOut( updatedArg, currentArg ) {
		let [eu, elu] = updatedArg;
		let [ec, elc] = currentArg;
		
		console.log(eu.getAttribute("data-milestoneName") , ec.getAttribute("data-milestoneName"));
		if(eu.getAttribute("data-milestoneName") == ec.getAttribute("data-milestoneName")){
			this.isJunk = false;
		}
	}
	private onDrop( itemArg, updatedArg, currentArg ) {
	
    let [ei, eli] = itemArg;
	let [eu, elu] = updatedArg;
	let [ec, elc] = currentArg;
	console.log(ei.getAttribute("data-itemId"),
	eu.getAttribute("data-milestoneName"),
	ec.getAttribute("data-milestoneName"));
	this.StageName = ei.getAttribute("data-StageName");
	let companyId = ei.getAttribute("data-companyId");
	let designationId = ei.getAttribute("data-designationId");
	let designationName = ei.getAttribute("data-designationName");
	this.updateInquiryIn.updateStatusName  = eu.getAttribute("data-milestoneName");
	this.updateInquiryIn.currentStatusName = ec.getAttribute("data-milestoneName");

	this.newEnqId = ei.getAttribute("data-itemId");
	
	this.updateInquiryIn.id = parseInt(ei.getAttribute("data-itemId"));
	this.mileStoneid = eu.getAttribute("data-milestoneId");

if(eu.getAttribute("data-milestoneName")=='junk'){

		this.enquiryjunkinput.id = ei.getAttribute("data-itemId");
		this.enquiryjunkinput.junk = true;

		this._enquiryUpdateServiceProxy.createORupdateInquiryJunk(this.enquiryjunkinput).subscribe(result=>{
			console.log(result);
			this.isJunk = true;
			this.getTickets('');
		});
		this.isJunk = false;
		this.dragulaService.find('nested-bag').drake.cancel(true);
		this.notify.success(this.l('SavedSuccessfully'));
	}
else 
    {
	this._select2Service.getEnquiryStages(this.mileStoneid).subscribe((result)=>{
	if(result.select2data !=null){
	  if(result.select2data.length == 1)
		  {
			this.updateInquiryIn.stageId = result.select2data[0].id;
			this.UpdateStageName =  result.select2data[0].name;
		  }

		  
	this.linkedContacts=[];

	this.updateInquiryIn.id = parseInt(ei.getAttribute("data-itemId"));
	this.updateInquiryIn.currentStatusName = ec.getAttribute("data-milestoneName");

	if(this.updateInquiryIn.updateStatusName!='junk'){

		if(this.updateInquiryIn.updateStatusName == 'Assigned'){
			this.getTickets('');
		}else 
		if(companyId){
			
	this.updateInquiry();			
	var inquiry_Id = ei.getAttribute("data-itemId");
	this._enquiryContactServiceProxy.getEnquiryWiseEnquiryContact(inquiry_Id).subscribe(contacts => {
		this.linkedContacts = contacts.items;
		this.contactInput.contactId = parseInt(ei.getAttribute("data-contactId"));
		this.contactInput.inquiryId = this.updateInquiryIn.id;
		console.log(this.contactInput);
		this.updateLinkedContact();
	});
			
				if(!designationId && designationName){
					this.desigInput.designationCode = "AUT";
					this.desigInput.desiginationName = designationName;
					this.newDesignationCreate();
					this.newCompanyId = companyId;
				}
		}
		else
		{
			var engId = parseInt(ei.getAttribute("data-itemId"));
			this._inquiryProxyService.getInquiryForEdit(engId).subscribe((result) => {
				if (result.inquirys != null && result.inquirys.companyName != null) {
					console.log(result.inquirys);
					this.contactInput.contactId = result.inquirys.contactId;
					this.contactInput.inquiryId = result.inquirys.id;
					this.updateCompanyCont.contactId = result.inquirys.contactId;
					this.enquiryData = result.inquirys;
					this.company.companyName = result.inquirys.companyName;
					this.newDesignationId = result.inquirys.designationId;
					this.desigInput.designationCode = "AUT";
					this.desigInput.desiginationName = result.inquirys.designationName;
					this.company.inSales = false;
					this.company.industryId = null;
					this._inquiryProxyService.newCompanyCreate(this.company)
					.subscribe((result) => {
						if(result){
						this.notify.info(this.l('New Company Created'));
						this.updateCompanyCont.companyId = result;
						this.updateCompanyContact();
						this.updateLinkedContact();
						this.newCompanyId = result;
						if(this.newDesignationId){
							this.newCompanyDesignationUpdate();
						}else if(!this.newDesignationId && this.desigInput.desiginationName){
							this.newDesignationCreate();
						}else{
							this.newCompanyDesignationUpdate();
						}
					  }	
					});
				}else{
					this.notify.info(this.l('Should update company before doing this action'));
					this.getTickets('');
				}
			});
			
		}
	}
	}
	else{
		this.getTickets('');
		this.notify.error(this.l('No Stage in Milestone status'));
	}
	});
	
 }
  }
	


  ngAfterViewInit(): void {
     this.getTickets('');
	}
	
	updateLinkedContact(){
		this.contactInput.id = 0;
		var index = this.linkedContacts.findIndex(x => x.contactId == this.contactInput.contactId );

               if(index!=-1){
					
               }else{
			this._enquiryContactServiceProxy.createOrUpdateEnquiryContact(this.contactInput)
			.subscribe(() => {
				this.notify.info(this.l('SavedSuccessfully'));
			});
		}
	}
	updateCompanyContact(){
		this._enquiryUpdateServiceProxy.contactUpdate(this.updateCompanyCont)
		.subscribe(() => {
			this.notify.info(this.l('Company Contact Updated'));
		});
	}
	createInquiry(): void {
        this.createInquiryModal.show(0);
    }
	editInquiry(id): void {
		this.createInquiryModal.show(id);
	}
	getTickets(filter:string): void {
		setTimeout(() => {
		    this.loading=true;
        });
            this._inquiryProxyService.getInquiryTickets(filter,0).subscribe(inquiries => {
			this.groups = inquiries;
			this.isJunk = false;
			setTimeout(() => {
				this.loading=false;
			});
	});

    }
	getSearch(event){
		if(event === 1){
			this.isShow = true;
		}
		else
		{
			this.isShow = false;
			this.getTickets('');
		}
	}

    getInquiryTicAll():void{
	    this.isShow = false;
	}

	newContactInfoCreate(){
		this.ContactInfoInput.id = this.newEnqId;
		this._inquiryProxyService.createInquiryContactInfo(this.ContactInfoInput).subscribe(()=>{
           
		});
	}

	updateInquiry(): void {
        this._enquiryUpdateServiceProxy.createORupdateInquiry(this.updateInquiryIn).subscribe(result => {
			console.log(result);
			if(result == 1 ){
				    this.selectDepartmentModal.show(this.updateInquiryIn.id,this.updateInquiryIn.currentStatusName,this.updateInquiryIn.updateStatusName,this.mileStoneid);
			}
			else if(result == 2)
			{
				    this.selectStageModal.show(this.updateInquiryIn.id,this.updateInquiryIn.currentStatusName,this.updateInquiryIn.updateStatusName,this.mileStoneid,-1,this.StageName);
			}
			else{
				this.activityDefault();
				this.getTickets('');
			}
		});
	}

	activityDefault(): void { 
		this.newContactInfoCreate();
		if(this.updateCompanyCont.companyId)
		{
		  this.createInquiryCompanyInfo();
		}
		this.updateInquiryIn.currentStatusName = this.updateInquiryIn.currentStatusName+"("+this.StageName+")";
		if(this.updateInquiryIn.stageId >0)
		{
			this.updateInquiryIn.updateStatusName = this.updateInquiryIn.updateStatusName+"("+this.UpdateStageName+")";
		}
		this._enquiryUpdateServiceProxy.createActivityDefault(this.updateInquiryIn).subscribe(result => {});
	 }

	 createInquiryCompanyInfo(){
		if(this.newEnqId){
		  this.inquiryContact.id = this.newEnqId;
		  this._inquiryProxyService.createInquiryCompanyInfo(this.inquiryContact).subscribe(result=>{
		  });
		}
	  }
	changeStage(id,statusId,name,stage):void{

			this.selectStageModal.show(id,name,name,statusId,-1,stage);
	}
	getColor(data){
		let RGBCode= data.startsWith("rgb");
		if(RGBCode){
			var parts = data.substring(data.indexOf("(")).split(","),
			r = parts[0].substring(1),
			g = parts[1],
			b = parts[2].substring(0, parts[2].length -1)
			if((r*0.299 + g*0.587 + b*0.114) > 186){
				return '#000000';
			}
			else
			{
				return '#ffffff';
			}
		}
		else{
			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(data),
		    r1 = parseInt(result[1], 16),
		    g1 = parseInt(result[2], 16),
		    b1 = parseInt(result[3], 16)
            if((r1*0.299 + g1*0.587 + b1*0.114) > 186){
			   return '#000000';
		    }
		    else
		    {
			   return '#ffffff';
		    }
        }
		
	}
    newDesignationCreate(){
    	this._inquiryProxyService.newDesignationCreate(this.desigInput).subscribe(result=>{
			if(result){
				this.newDesignationId = result;
				this.newCompanyDesignationUpdate();
			}
		});
    }
    newCompanyDesignationUpdate(){
    	this.newDesignationId = this.newDesignationId?this.newDesignationId:0;
    	console.log(this.newEnqId,this.newCompanyId,this.newDesignationId);
    	this._inquiryProxyService.getCompanyUpdate(this.newEnqId,this.newCompanyId,this.newDesignationId).subscribe(() => {
			this.updateInquiry();
		});
    }
    stausClose(closed){
    	this.isClose = false;
    }
}