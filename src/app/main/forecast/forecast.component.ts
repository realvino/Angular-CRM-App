import { Component, Injector, AfterViewInit, ViewChild,OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Http } from "@angular/http";
import { TokenAuthServiceProxy,InquiryServiceProxy,ProfileServiceProxy, EnquiryUpdateInputDto,EnquiryContactInputDto,EnquiryUpdateServiceProxy,InquiryInputDto,CompanyCreateInput, EnquiryContactServiceProxy,InquiryListDto,EnquiryJunkUpdateInputDto,ContactUpdateInputDto,DesignationInputDto, Select2ServiceProxy, NullableIdDto,ClosureUpdateDateInput, Select2TeamDto, Datadto, Select2salesDto, Datadtos, Datadtoes } from "shared/service-proxies/service-proxies";
import { ActivatedRoute } from "@angular/router";
import { CreateInquiryModalComponent, SelectOption } from "app/main/inquiry/createORedit.component";
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Router } from '@angular/router';
import { DepartmentSelectComponent } from "app/main/kanban/departmentSelect.component";
import * as moment from "moment";
import 'rxjs/add/operator/takeUntil';
import {Subject} from 'rxjs/Subject';
import { StageSelectComponent } from 'app/main/kanban/stage.component';
import {MonthPicker} from 'app/main/monthPicker/month';
import { AppConsts } from '@shared/AppConsts';
import { months } from 'moment';
import { isNgTemplate } from '../../../../node_modules/@angular/compiler';

@Component({
templateUrl: './forecast.component.html',
styleUrls: ['./forecast.component.css'],
animations: [appModuleAnimation()]
})
export class ForecastComponent extends AppComponentBase implements AfterViewInit,OnDestroy {

	@ViewChild('createInquiryModal') createInquiryModal: CreateInquiryModalComponent;
	@ViewChild('selectDepartmentModal') selectDepartmentModal :DepartmentSelectComponent;
	@ViewChild('selectStageModal') selectStageModal :StageSelectComponent;

	public groups: Array<any> = [];
	isShow:boolean=false;
	private destroy$ = new Subject();	
	closureUpdateDateInput:ClosureUpdateDateInput = new ClosureUpdateDateInput();
	closureDate:string;
	loading:boolean;
	path : string = AppConsts.remoteServiceBaseUrl;
    userRole: string = "";
	showdata: boolean = true;
	AdvancedFilter: number = 1;

	active_view:SelectOption[];
    active_team:SelectOption[];
	viewId: number;
	from: number = 0;
	to: number = 0;
	teamId: number;
	typeId: number;
	counts: number = 1;

	teams:Array<any>;
	team_list: Datadtoes[];

	team_filter: Select2salesDto[];
	sales_Filter: Datadtos[];

	salesDto: Datadto[];
	sales:Array<any>;
	type:Array<any> = [{ 'id' : '1','text' : 'Greater than' }, 
	{ 'id' : '2','text' : 'Less than'},
	{ 'id' : '3','text' : 'Equal To'},
	{ 'id' : '4','text' : 'Range'}
];
 
	
	constructor(
		injector: Injector,
		private _inquiryProxyService: InquiryServiceProxy,
		private _enquiryUpdateServiceProxy: EnquiryUpdateServiceProxy,
		private dragulaService: DragulaService,
        private _select2Service: Select2ServiceProxy,
		private router: Router
	) { 
	   super(injector);
		dragulaService.drag.subscribe((value) => {
		  
		});
		
		dragulaService.setOptions('nested-bag', {
			revertOnSpill: true,		
			moves: function (el, container, handle) { 
				
				return container.getAttribute("data-milestoneName") =='Assigned' || container.getAttribute("data-type") =='status' || container.getAttribute("data-milestoneName") =='junk' ? false : true;
			}
		});
		
		dragulaService.drop.asObservable().takeUntil(this.destroy$).subscribe((value) => {
			
			let [eu, elu] = value.slice(2);
			
			if(eu.getAttribute("data-type")=='status'){
				
			}else{
				
				this.onDrop(value.slice(1),value.slice(2),value.slice(3));
			}
			
		});
		
		dragulaService.over.subscribe((value) => {
				
		});
		
		dragulaService.out.subscribe((value) => {
			
		});
		
		
	}
	kanbanActivate(event:any){
		this.getTickets('');
	}
	ngOnDestroy() {
		this.destroy$.next();		
  		this.dragulaService.destroy('nested-bag');
  	}
	
	private onOut( updatedArg, currentArg ) {
		let [eu, elu] = updatedArg;
		let [ec, elc] = currentArg;
		
		
	}

	private onDrop( itemArg, updatedArg, currentArg ) {
        let [ei, eli] = itemArg;
	    let [eu, elu] = updatedArg;
	    let [ec, elc] = currentArg;
	    this.closureUpdateDateInput.inquiryId = parseInt(ei.getAttribute("data-itemId"));
	    this.closureUpdateDateInput.updateDate = moment(eu.getAttribute("data-updateDate")).format('MM/DD/YYYY');
	
       this._enquiryUpdateServiceProxy.updateEnquiryClosureDate(this.closureUpdateDateInput).subscribe(result =>{
		  this.getTickets('');
	   }); 
	
    }
	
    onDateChange(value): void{
	    this.closureDate = moment(value).format('MMM-YYYY');
        //this.getTickets('');
	} 
	
    ngAfterViewInit(): void {
		setTimeout(() => {
			this.closureDate = moment().add(5,'months').format('MMM-YYYY');
        });
		this.userRole = this.appSession.getLoginRole();
		if(this.userRole == "Sales Coordinator" || this.userRole == "User" || this.userRole == "Designer")
		{
		   this.showdata = false;
		}
        else{
			this.getFilterData();
			this._select2Service.getDashboardTeam().subscribe((result) => { 
				if (result.selectDdata != null) {
					 this.teams = [];
					 this.team_list = result.selectDdata;
					 this.team_list.forEach((team: {userId: number, name: string}) => {
						 this.teams.push({
							id: team.userId,
							text: team.name,
						 });
					 });
				 }
			  });
		}
    }
	
	createInquiry(): void {
        this.createInquiryModal.show(0);
	}
	getTime(data){
		var re = /a /gi; 
		var str = data.toUpperCase();
		str = str.replace(re, "1 ");
		var t=str.split(" ");
		var get=t[0]+" "+t[1].charAt(0);
		return get;
		  }
	getTickets(filter:string): void {
        setTimeout(() => {
			this.loading = true;
		});

		if(!this.from){
			this.from = 0;
		}
		if(!this.to){
			this.to = 0;
		}

		this._inquiryProxyService.getClosureDateInquiryTickets(filter,this.closureDate,this.teamId,this.viewId,this.typeId,this.from,this.to).subscribe(result =>{
			this.groups = result;
			
			this.loading = false;
		});

	}
	Advanced(){
		if(this.counts % 2 == 0)
		this.AdvancedFilter = 1;
		else
		this.AdvancedFilter = 0;
		this.counts++;
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
	getSalesman(teamId){
		this._select2Service.getTeamUserProfile(teamId).subscribe(result=>{
			if(result != null){
			   this.sales = [];
			   this.salesDto = result.select3data;
				this.salesDto.forEach((view:{id:number,name:string})=>{
					this.sales.push({
					   id:view.id,
					   text:view.name
					});
				});
			}
		});
	}
	Refresh(){
		this.getTickets('');
	}
	getFilterData(){
		this.getSalesman(0);
		this._select2Service.getSalesPersonTeam().subscribe(result=>{
			if(result != null){
			  let team_filter = result.salesManagerTeam;
			  let sales_Filter = result.salesPerson;
			  if(team_filter != null)
			  {
				 alert("hi");
				this.active_team = [{id: team_filter.id, text: team_filter.name}];
				this.teamId = team_filter.salesManId;
				this.getSalesman(this.teamId);
			  }
			  if(sales_Filter != null)
			  {
				this.active_view = [{id:sales_Filter.id,text:sales_Filter.name}];
				this.viewId = sales_Filter.id;
			  }
			  this.getTickets('');
			}
		});
	}

	 selectedTeam(value:any):void {
		this.active_team = [{id: value.id, text: value.text}];
		this.teamId = value.id;
		this.active_view =[];
        this.viewId = 0;
		this.getSalesman(value.id);
		//this.getTickets('');
	  }
	  refreshTeam(value:any):void{

	  }
	  removedTeam(value:any):void {
		  this.teamId = 0;
		  this.active_team = [];
		  this.active_view =[];
		  this.viewId= 0;
		  this.active_view =[];
          this.viewId = 0;
		  this.getSalesman(0);
		  //this.getTickets('');
		}
	  selectSales(data:any){
        this.active_view = [{id:data.id,text:data.text}];
		this.viewId= data.id;
		//this.getTickets('');
    }
    removeSales(data:any){
        this.active_view =[];
		this.viewId = 0;
		//this.getTickets('');
	}
	selectType(data:any){
	   this.typeId = data.id;
	   this.from = 0;
	   this.to = 0;
	}
	removeType(data:any){
	   this.typeId = 0;
	   this.from = 0;
	   this.to = 0;
	}
	goToLead(value:any):void{       
	  let x = abp.session.userId;
		switch (x) {
			case value.coordinatorId:
			window.open('app/main/sales-enquiry/'+value.id, "_blank");
			break;
			case value.creatorUserId:
			window.open('app/main/sales-enquiry/'+value.id, "_blank");
			break;
			case value.designerId:
			window.open('app/main/sales-enquiry/'+value.id, "_blank");
			break;	
			case value.salesPersonId:
			window.open('app/main/sales-enquiry/'+value.id, "_blank");
			break;	
			case value.salesManagerId:
			window.open('app/main/sales-enquiry/'+value.id, "_blank");
			break;

			default:
			this.notify.warn(this.l('You are not authorized to access this lead'));

		}
	}
} 