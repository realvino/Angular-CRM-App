import { Component, Injector, AfterViewInit, ViewChild,OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Http } from "@angular/http";
import { TokenAuthServiceProxy,InquiryServiceProxy,ProfileServiceProxy, EnquiryUpdateInputDto,EnquiryContactInputDto,EnquiryUpdateServiceProxy,InquiryInputDto,CompanyCreateInput, EnquiryContactServiceProxy,InquiryListDto,EnquiryJunkUpdateInputDto,ContactUpdateInputDto,DesignationInputDto, Select2ServiceProxy, NullableIdDto,ClosureUpdateDateInput } from "shared/service-proxies/service-proxies";
import { ActivatedRoute } from "@angular/router";
import { CreateInquiryModalComponent } from "app/main/inquiry/createORedit.component";
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Router } from '@angular/router';
import { DepartmentSelectComponent } from "app/main/kanban/departmentSelect.component";
import * as moment from "moment";
import 'rxjs/add/operator/takeUntil';
import {Subject} from 'rxjs/Subject';
import { StageSelectComponent } from 'app/main/kanban/stage.component';
import {MonthPicker} from 'app/main/monthPicker/month';

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
	constructor(
		injector: Injector,
		private _inquiryProxyService: InquiryServiceProxy,
		private _enquiryUpdateServiceProxy: EnquiryUpdateServiceProxy,
		private dragulaService: DragulaService,
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
				console.log(eu.getAttribute("data-type"));
				
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
	    console.log(eu.getAttribute("data-updateDate"));
	    this.closureUpdateDateInput.inquiryId = parseInt(ei.getAttribute("data-itemId"));
	    this.closureUpdateDateInput.updateDate = moment(eu.getAttribute("data-updateDate")).format('MM/DD/YYYY');
	
       this._enquiryUpdateServiceProxy.updateEnquiryClosureDate(this.closureUpdateDateInput).subscribe(result =>{
		  console.log(result);
		  this.getTickets('');
	   }); 
	
    }
	
    onDateChange(value): void{
	    this.closureDate = moment(value).format('MMM-YYYY');
        this.getTickets('');
	} 
	
    ngAfterViewInit(): void {
		setTimeout(() => {
			this.closureDate = moment().format('MMM-YYYY');
        });

        this.getTickets('');
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
		this._inquiryProxyService.getClosureDateInquiryTickets(filter,this.closureDate).subscribe(result =>{
			this.groups = result;
			
			this.loading = false;
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
    
}