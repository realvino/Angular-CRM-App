import { Component, Injector, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Http } from "@angular/http";
import { EnquiryStatusServiceProxy,EnquiryUpdateServiceProxy,EnquiryStatusUpdateInput,EnquiryStatusListDto,EnquiryJunkUpdateInputDto } from "shared/service-proxies/service-proxies";
import { ActivatedRoute } from "@angular/router";
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Router } from '@angular/router';

@Component({
selector:"leadStatus",	
template: `<li [dragula]='"nested-bag"' *ngFor="let type of many2" [attr.data-milestoneId]='type.id' data-type='status' [ngStyle]="{'background':type.enqStatusColor}" style="float:left; position:relative;width:24%;margin-right:1%;border-radius:45px;height: 50px;list-style:none;color:white;" [dragulaModel]='junk'>
<div class="col-md-4" style="right:21px;"><i class="fa fa-3x {{type.icon?type.icon:''}}" style="margin-top:28px;"></i></div><div class="col-md-4" style="top:18px;right:21px;"><span class="fa fa-1x">{{type.enqStatusName.toUpperCase()}}</span></div>
<div class="col-md-4">&nbsp;&nbsp;</div></li>`,
animations: [appModuleAnimation()]
})
export class KanbanStatusComponent extends AppComponentBase implements OnInit {
	@Output() statusSave: EventEmitter<any> = new EventEmitter<any>();
	public many2: Array<any> = [];
	filter:string='';
	enqStatusList:EnquiryStatusListDto[];
	enqStatusUpdateInput:EnquiryStatusUpdateInput =new EnquiryStatusUpdateInput();
	constructor(
		injector: Injector,
        private _http: Http,
		private dragulaServicestatus: DragulaService,
		private _enquiryUpdateServiceProxy: EnquiryUpdateServiceProxy,
		private _enquiryStatusServiceProxy:EnquiryStatusServiceProxy,
		private router: Router
	) {
	   super(injector);
		dragulaServicestatus.drag.subscribe((value) => {
		  //this.onDrag(value.slice(1));
		});
				
		dragulaServicestatus.drop.subscribe((value) => {
			//this.isJunk = false;
			let [eu, elu] = value.slice(2);
			console.log(eu.getAttribute("data-type"));
			if(eu.getAttribute("data-type")=='status'){
				this.onDropStatus(value.slice(1),value.slice(2),value.slice(3));
			}
			
			//console.log(value,value.slice(1),'drop');
		});
		
		 dragulaServicestatus.over.subscribe((value) => {
	
		});
		
		dragulaServicestatus.out.subscribe((value) => {
	
		});
		
		
	}
	ngOnInit(){
		this._enquiryStatusServiceProxy.getEnquiryStatus(this.filter).subscribe((result)=>{
			if(result.items!=null){
				this.enqStatusList = result.items;
				this.many2=this.enqStatusList;
				//console.log(this.enqStatusList,this.many2);
			}
		});

	}
	private onToggleJunk( isJunk ) {
		
	}
	private onOut( updatedArg, currentArg ) {
		
	}
	private onDropStatus( itemArg, updatedArg, currentArg ) {
		let [ei, eli] = itemArg;
		let [eu, elu] = updatedArg;
		let [ec, elc] = currentArg;
		

		this.enqStatusUpdateInput.enquiryId = ei.getAttribute("data-itemId");
		this.enqStatusUpdateInput.statusId = eu.getAttribute("data-milestoneId");

		this._enquiryUpdateServiceProxy.enquiryStatusUpdate(this.enqStatusUpdateInput).subscribe(result=>{
			this.statusSave.emit(1);
		});
		//this.isJunk = false;
		this.dragulaServicestatus.find('nested-bag').drake.cancel(true);
		this.notify.success(this.l('SavedSuccessfully'));
	}
}