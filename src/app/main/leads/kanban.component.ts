import { Component, Injector, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Http } from "@angular/http";
import { TokenAuthServiceProxy, InquiryServiceProxy, EnquiryUpdateInputDto,EnquiryUpdateServiceProxy,EnquiryContactServiceProxy,InquiryListDto,EnquiryJunkUpdateInputDto, QuotationStatusUpdateInput, EnquiryStatusUpdateInput, EnquiryContactInputDto, Select2ServiceProxy, QuotationServiceProxy, CreateQuotationInput, Select2InquiryDto, Userprofiledto, QuotationRevisionInput } from "shared/service-proxies/service-proxies";
import { ActivatedRoute } from "@angular/router";
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Router } from '@angular/router';
import { LeadsDepartmentSelectComponent, SelectOption } from "app/main/leads/departmentSelect.component";
import 'rxjs/add/operator/takeUntil';
import {Subject} from 'rxjs/Subject';
import { StageSelectComponent } from 'app/main/kanban/stage.component';
import { AppConsts } from '@shared/AppConsts';
import * as moment from "moment";

@Component({
templateUrl: './kanban.component.html',
styleUrls: ['./kanban.component.css'],
animations: [appModuleAnimation()]
})
export class LeadsKanbanComponent extends AppComponentBase implements AfterViewInit,OnDestroy {
	salesEnable: number;
	designerEnable: number;
	coordinatorEnable: number;

	@ViewChild('selectleadsDepartmentModal') selectleadsDepartmentModal :LeadsDepartmentSelectComponent;

	public groups: Array<any> = [];
	loading:boolean;
	updateInquiryIn: EnquiryUpdateInputDto = new EnquiryUpdateInputDto();
	enquiryData: InquiryListDto = new InquiryListDto();
	QStatusUpdateInput: QuotationStatusUpdateInput = new QuotationStatusUpdateInput();
	EStatusUpdateInput: EnquiryStatusUpdateInput = new EnquiryStatusUpdateInput();	
	filterText: string = '';
	isJunk:boolean=false;
	path : string = AppConsts.remoteServiceBaseUrl;
	private destroy$ = new Subject();	
	enquiryjunkinput:EnquiryJunkUpdateInputDto = new EnquiryJunkUpdateInputDto();
	isShow:boolean=false;
	enquiryContactInput:EnquiryContactInputDto = new EnquiryContactInputDto();
	linkedContacts:any = []; 
	@ViewChild('selectStageModal') selectStageModal :StageSelectComponent;
	StageName:string;
	UpdateStageName:string;
	quotation:CreateQuotationInput = new CreateQuotationInput();
	inquirydetailDto: Select2InquiryDto[];
	
	salesmanId:number=0;
	designerId:number=0;
	coordinatorId:number=0;

	active_salesman:SelectOption[];
	active_designer:SelectOption[];
	active_coordinator:SelectOption[];

	salesman:Array<any>;
	designer:Array<any>;
	coordinator:Array<any>;

	salesman_Arr:Userprofiledto[];
	designer_Arr:Userprofiledto[];
	coordinator_Arr:Userprofiledto[];

	theHtmlString:string = `<li style="background: white;border: 0px solid #fff;border-radius: 8px;box-shadow: inset 0px 0px 1px 1px rgba(82, 82, 82, 0.48);margin-left: 3px;" class="carded"><div class="row"><div class="col-sm-12"><div><i class="fa fa-circle-o" style="color:red;padding-left: 5px;" aria-hidden="true"></i> Q20180319006-R0<span></span></div></div></div></li>`;
	QRevisionInput: QuotationRevisionInput = new QuotationRevisionInput();
	constructor(
		injector: Injector,
        private _http: Http,
        private _tokenAuth: TokenAuthServiceProxy,
		private _activatedRoute: ActivatedRoute,
		private _select2Service: Select2ServiceProxy,
        private _inquiryProxyService: InquiryServiceProxy,
		private _enquiryUpdateServiceProxy: EnquiryUpdateServiceProxy,
		private salesdragulaService: DragulaService,
		private _quotationService: QuotationServiceProxy,
		private router: Router,
		private _enquiryContactServiceProxy: EnquiryContactServiceProxy,
	) { 
	   super(injector);
	   salesdragulaService.drag.subscribe((value) => {
		  //this.onDrag(value.slice(1));
		});
		salesdragulaService.setOptions('salesnested-bag', {
			revertOnSpill: true,		
			moves: function (el, container, handle) { 
				return (container.getAttribute("data-milestoneName") =='Closed' && (el.getAttribute('data-StageName') == 'Lost' || el.getAttribute('data-StageName') == 'OE Processing')) || container.getAttribute("data-milestoneId") =='junk' ? false : true;
			}
		});
		salesdragulaService.drop.asObservable().takeUntil(this.destroy$).subscribe((value) => {
			this.onDrop(value);
		});
		salesdragulaService.over.subscribe((value) => {
			this.isJunk = true;
			//this.onOver(value.slice(1));
		});
		salesdragulaService.out.subscribe((value) => {
		  //this.onOut(value.slice(1));
		});		
	}
	ngOnDestroy() {
		this.destroy$.next();		
		this.salesdragulaService.destroy('salesnested-bag');
		
	}

	private onDrop(DataTicket) {	
    let [ei, eli] = DataTicket.slice(1);
	let [eu, elu] = DataTicket.slice(2);
	let [ec, elc] = DataTicket.slice(3);
	this.StageName = ei.getAttribute("data-StageName");
    let CurMileIsQuotation = ec.getAttribute("data-isQuotation");
	let UpMileIsQuotation = eu.getAttribute("data-isQuotation");	
	let companyId = ei.getAttribute("data-companyId");
	let approved = ei.getAttribute("data-approved");
	let inquiryId = parseInt(ei.getAttribute("data-itemId"));
	let QuotationStatusId = parseInt(ei.getAttribute("data-qStatusId"));
	this.updateInquiryIn.id = parseInt(ei.getAttribute("data-itemId"));
	this.updateInquiryIn.updateStatusName  = eu.getAttribute("data-milestoneName");
	this.updateInquiryIn.currentStatusName = ec.getAttribute("data-milestoneName");

	if(CurMileIsQuotation == 'true' && UpMileIsQuotation == 'true')
	{
		if(QuotationStatusId == 3 && this.updateInquiryIn.updateStatusName == 'Closed')
		{
			this.notify.error("Please First Submit the Quotation"); 
			this.getTickets('');			
		} else {
		this._select2Service.getEnquiryStages(eu.getAttribute("data-StatusId")).subscribe((result)=>{
			if(result.select2data !=null){
			  if(result.select2data.length == 1)
			  {
					this.UpdateStageName = result.select2data[0].name;
				if(parseInt(ei.getAttribute("data-itemQuotationId")) >0)
				{
					  this.QStatusUpdateInput.quotationId = ei.getAttribute("data-itemQuotationId");
					  this.QStatusUpdateInput.statusId = eu.getAttribute("data-StatusId");
					//   this.QStatusUpdateInput.stageId = result.select2data[0].id;
					//   this._enquiryUpdateServiceProxy.quotationStatusUpdate(this.QStatusUpdateInput).subscribe(result => {
					//   this.notify.success("Quotation Updated Successfully");	
					//   this.getTickets('');			
					// });
					this.activityDefault();
					
					if(this.updateInquiryIn.updateStatusName = 'Revision')
					{
						this.QRevisionInput.id = this.QStatusUpdateInput.quotationId;
						this.QRevisionInput.typeId = 1;
						this.QRevisionInput.nextActivity = moment();
						this._quotationService.quotationRevision(this.QRevisionInput).subscribe(result=>{
							if(result){
								this.getTickets('');			
								this.notify.success("Quotation Revised successfully");
							}
						 });
					}
				}
				else{
				  this.notify.error("Invalid Update"); 
				  this.getTickets('');		
				}
				}
				
			  else{ 
				this.selectStageModal.show(ei.getAttribute("data-itemQuotationId"),this.updateInquiryIn.currentStatusName,this.updateInquiryIn.updateStatusName,eu.getAttribute("data-StatusId"),ei.getAttribute("data-itemQuotationId"),this.StageName);
			  }
			}
		});
	}
	}
    if(CurMileIsQuotation == 'false' && UpMileIsQuotation == 'false')
	{
		this._select2Service.getEnquiryStages(eu.getAttribute("data-StatusId")).subscribe((result)=>{
			if(result.select2data !=null){
			  if(result.select2data.length == 1)
			  {
				this.EStatusUpdateInput.stageId = result.select2data[0].id;
				this.UpdateStageName = result.select2data[0].name;
				if(parseInt(ei.getAttribute("data-itemId")) >0)
	              	{
			          this.EStatusUpdateInput.enquiryId = ei.getAttribute("data-itemId");
			          this.EStatusUpdateInput.statusId = eu.getAttribute("data-StatusId")
		              this._enquiryUpdateServiceProxy.enquiryStatusUpdate(this.EStatusUpdateInput).subscribe(result => {
										this.activityDefault();
			          this.notify.success("Enquiry Updated Successfully");	
				      this.getTickets('');				
		     	});
              } 
				 }
		else{
					this.selectStageModal.show(this.updateInquiryIn.id,this.updateInquiryIn.currentStatusName,this.updateInquiryIn.updateStatusName,eu.getAttribute("data-StatusId"),-2,this.StageName);
			}
			}
			else{
				this.getTickets('');
				this.notify.error(this.l('No Stage in Milestone status'));
			}
			});

		
	}
	if(CurMileIsQuotation == 'false' && UpMileIsQuotation == 'true')
	{
		if(ei.getAttribute("data-count") > 0)
		{
			this.notify.warn("This Enquiry can not move to Quotation Section");
		    this.getTickets('');	
		} else {

		this.quotation.newCompanyId = ei.getAttribute("data-companyId");
		this.quotation.attentionContactId = ei.getAttribute("data-contactId");
		this.quotation.salesPersonId = ei.getAttribute("data-salesId");
		this.quotation.inquiryId = ei.getAttribute("data-itemId");
		this.quotation.total = ei.getAttribute("data-total");

		this.quotation.quotationStatusId = 2;
		this.quotation.submitted = true;
		this.quotation.stageId = 5;
		this.quotation.termsandCondition = "null";
		this.quotation.customerId = "null";
		this.quotation.refNo = "null";
		this.quotation.mileStoneId = 6;           
		this.quotation.optional = true;

		this._quotationService.createOrUpdateQuotation(this.quotation)
					 .subscribe((result) => {
						 if(result){
							this.notify.success("Auto Generated Quotation is Created Successfully");
							this.UpdateStageName = "Quote 1 of 3";
                            this.activityDefault();
							this.getTickets('');
						 }
					 });      
		}   
		
	}
    if(CurMileIsQuotation == 'true' && UpMileIsQuotation == 'false')
	{
		this.getTickets('');					
		this.notify.warn("Quotation Can not move to Enquiry");		
	}
		
  }
	
  kanbanActivate(event:any){
	this.getTickets('');
}

selectSalesman(data:any){
	this.salesmanId = data.id;
	this.getTickets('');
}
removeSalesman(data:any){
	this.salesmanId = 0;
	this.getTickets('');
}
selectDesigner(data:any){
	this.designerId = data.id;
	this.getTickets('');
}
removeDesigner(data:any){
	this.designerId = 0;
	this.getTickets('');
}
selectCoordinator(data:any){
	this.coordinatorId = data.id;
	this.getTickets('');
}
removeCoordinator(data:any){
	this.coordinatorId = 0;
	this.getTickets('');
}
  ngAfterViewInit(): void { 
	this._select2Service.getUserProfile().subscribe(result=>{			
		if(result.select3data!=null){
			this.salesman_Arr = result.select3data;
			  this.salesman = [];
				this.salesman_Arr.forEach((sales:{id: number,name: string,profilePictureId: string})=>{
					this.salesman.push({
						id:sales.id,
						text:`<img class="img-circle" height="25" id="SalesmanProfilePicture" width="25" src="${this.path+sales.profilePictureId}">&nbsp;&nbsp;${sales.name}`
					});
				});
				this.salesEnable = this.salesman_Arr.length;
				// if(this.salesman_Arr.length == 1 ){
				//   this.active_salesman = [{id:this.salesman_Arr[0].id,text:`<img class="img-circle" height="25" id="SalesmanProfilePicture" width="25" src="${this.path+this.salesman_Arr[0].profilePictureId}">&nbsp;&nbsp;${this.salesman_Arr[0].name}`}];
				//   this.salesmanId = this.salesman_Arr[0].id;
				//   this.getTickets('');
				// }
		}
	});
	this._select2Service.getDesignerProfile().subscribe(result=>{			
		if(result.select3data!=null){
			this.designer_Arr = result.select3data;
			  this.designer = [];
				this.designer_Arr.forEach((sales:{id: number,name: string,profilePictureId: string})=>{
					this.designer.push({
						id:sales.id,
						text:`<img class="img-circle" height="25" id="SalesmanProfilePicture" width="25" src="${this.path+sales.profilePictureId}">&nbsp;&nbsp;${sales.name}`
					});
				});
				this.designerEnable = this.designer_Arr.length;
		}
	});
	this._select2Service.getCoordinatrProfile().subscribe(result=>{			
		if(result.select3data!=null){
			this.coordinator_Arr = result.select3data;
			  this.coordinator = [];
				this.coordinator_Arr.forEach((sales:{id: number,name: string,profilePictureId: string})=>{
					this.coordinator.push({
						id:sales.id,
						text:`<img class="img-circle" height="25" id="SalesmanProfilePicture" width="25" src="${this.path+sales.profilePictureId}">&nbsp;&nbsp;${sales.name}`
					});
				});
				this.coordinatorEnable = this.coordinator_Arr.length;
		}
	});

    this.getTickets('');
	}
	
	editSalesEnquiry(isquotation,enq_id,quotation_id){
		if(!isquotation){
		 this.router.navigate(["/app/main/sales-enquiry",enq_id]);
		}else{
		// this.editEnqQuotationModal.show(quotation_id,enq_id);
		this.router.navigate(["/app/main/sales-enquiry",quotation_id,enq_id]);

	 }
	}
	
	createInquiry(): void {
		this.router.navigate(["app/main/salesLead"]);
    }
	editInquiry(id): void {
	}
	
	changeStage(isQuotation,id,quotationId,statusId,name,StageName):void{
		if(StageName != 'OE Processing' && StageName != 'Lost')
		{
			if(isQuotation == true)
		  {
			    this.selectStageModal.show(quotationId,name,name,statusId,-3,StageName);
		  }
      else{
			    this.selectStageModal.show(id,name,name,statusId,-4,StageName);
		  }
		}
	}



	getTickets(filter:string): void {
		
		setTimeout(() => {
		    this.loading=true;
        });
            this._inquiryProxyService.getSalesInquiryTickets(filter,this.salesmanId,this.designerId, this.coordinatorId).subscribe(inquiries => {
			this.groups = inquiries;
		    this.loading=false;
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
	updateInquiry(): void {
        this._enquiryUpdateServiceProxy.createORupdateInquiry(this.updateInquiryIn).subscribe(result => {
        this.activityDefault();
		});
		}

	activityDefault(): void {
          this.updateInquiryIn.currentStatusName = this.updateInquiryIn.currentStatusName+"("+this.StageName+")";
          this.updateInquiryIn.updateStatusName = this.updateInquiryIn.updateStatusName+"("+this.UpdateStageName+")";
          this._enquiryUpdateServiceProxy.createActivityDefault(this.updateInquiryIn).subscribe(result => {});
	 }

getTime(data){
	var re = /a /gi; 
    var str = data.toUpperCase();
	str = str.replace(re, "1 ");
	

		var t=str.split(" ");
		var get=t[0]+" "+t[1].charAt(0);
	    return get;
	  }
	 
}