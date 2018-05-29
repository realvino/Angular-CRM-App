import { Component, ViewChild, Injector, Renderer,ElementRef,Input, Output, EventEmitter, OnInit, AfterViewInit ,OnDestroy} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
//import { Select2OptionData } from 'ng2-select2/ng2-select2';
import {Jsonp} from '@angular/http';
import { ActivatedRoute,Router } from '@angular/router';
import {EnqActCommentCreate, InquiryServiceProxy} from "shared/service-proxies/service-proxies";
export interface SelectOption{
   id?: number;
   text?: string;
}

@Component({
    selector: 'createCommentModal',
    templateUrl: './createCommentActivityComponent.html',
    //styleUrls: ['./createOReditModal.component.less']

})
export class createCommentActivityModalComponent extends AppComponentBase implements AfterViewInit,OnInit,OnDestroy {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
	
		
    EnqActCommentCreate: EnqActCommentCreate = new EnqActCommentCreate();
	
	comments:any=[];
	filter:string='';
	actId:number =0;
	active = false;
    saving = false;
	comment= "";
	activeId:number;
    constructor(
        injector: Injector,
		private _inquiryServiceProxy: InquiryServiceProxy,
		private renderer:Renderer,
        private _jsonp: Jsonp,
		private route: ActivatedRoute,
		private router: Router,
		
    ){
        super(injector);
       

	   
    }
	  show(activityId?: number): void {

		this.activeId = activityId;
		this.active = true;
		this._inquiryServiceProxy.getEnqActComment(this.filter,this.activeId).subscribe((response) => {
			if(response.items != null){
            this.comments = response.items;
			
        }
		
        });
			this.modal.show();
    }
    ngAfterViewInit(): void {

    }

	ngOnInit(): void {
		
  	}

	ngOnDestroy():void {
	
	}
	
 


   save(data): void {
	   
	   this.saving=true;
	   this.EnqActCommentCreate.id=0;
	   this.EnqActCommentCreate.activityTrackId=this.activeId;
	   this.EnqActCommentCreate.message=this.comment;
	  
	  this._inquiryServiceProxy.createOrUpdateEnquiryActivitysComment(this.EnqActCommentCreate)
            .finally(() => this.saving = false)
            .subscribe(() => {
            this._inquiryServiceProxy.getEnqActComment(this.filter,this.activeId).subscribe((response) => {
			if(response.items != null){
            	this.comments = response.items;
			
        	}
		
        });
        this.comment ='';
				//this.notify.info(this.l('Message Sent Successfully'));
				
				this.modalSave.emit(this.EnqActCommentCreate);
            });
   
   }
   
    
	close(): void {
		this.modal.hide();
		this.comment ='';
		 //this.active = false;
    }
	
	
	
}
