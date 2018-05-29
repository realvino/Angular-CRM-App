import 'jquery';
import 'bootstrap';
import { Component, ViewChild, Injector, Renderer,ElementRef,Input, Output, EventEmitter, OnInit, AfterViewInit ,OnDestroy} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import {Jsonp} from '@angular/http';
import { ActivatedRoute,Router } from '@angular/router';
import { InquiryServiceProxy,JobActivityList,CreateJobActivityInput,Select2ServiceProxy,InquiryListDto, Datadto } from "shared/service-proxies/service-proxies";
import * as moment from "moment";

export interface SelectOption{
    id?: number;
    text?: string;
 }
@Component({
    selector: 'createJobActivityModal',
    templateUrl: './create-or-edit-jobActivity.Component.html',
    //styleUrls: ['./create-or-edit-jobActivity.Component.less']

})
export class CreateJobActivityModalComponent extends AppComponentBase  {

	@Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
	@ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
	
    update_details:InquiryListDto = new InquiryListDto;
    designerId:number;
    inquiryId:number;
    jobcreate:CreateJobActivityInput=new CreateJobActivityInput();
    activities: JobActivityList = new JobActivityList();
    eventOriginal = this.activities;
	active = false;
	saving = false;
    allotedDate:string;
    endDate:string;
    statdate: string;
    actid:number;
    jobdetails:any;
    constructor(
        injector: Injector,
        private _inquiryServiceProxy: InquiryServiceProxy,  
        private _select2Service: Select2ServiceProxy,
    ) {
        super(injector);
    }

    show(activityId?: number,designerId?:number,inquiryId?:number): void {
            this.designerId=designerId;
            this.inquiryId=inquiryId;
            this.activities = new JobActivityList();
        this._inquiryServiceProxy.getJobActivityForEdit(activityId).subscribe((result) => {
            if (result.jobActivityList!= null) {
            this.activities = result.jobActivityList;
           
            if(this.activities.allottedDate){
                this.allotedDate = moment(this.activities.allottedDate).format('MM/DD/YYYY');
            }
            if(this.activities.endDate){
                this.endDate=moment(this.activities.endDate).format('MM/DD/YYYY');
            }
            if(this.activities.startDate){
                this.statdate=moment(this.activities.startDate).format("MM/DD/YYYY");      
            }     
            console.log(11, this.activities)
           
           }
             this.active = true;
             this.modal.show();
        });
    }

   
 save(): void {
        this.saving = true;
           if (this.activities.id == null) {
               this.activities.id = 0;
           }
          
   
        this.activities.designerId=this.designerId;
        this.activities.inquiryId=this.inquiryId;
        
        this.activities.designerId=this.designerId;
    
        if(this.allotedDate){
            let stdate= moment(moment(this.allotedDate).toDate().toString());
            this.activities.allottedDate = moment(stdate).add(6, 'hours');
        }
        if(this.endDate){
            let stdate1= moment(moment(this.endDate).toDate().toString());
            this.activities.endDate = moment(stdate1).add(6, 'hours');
        }
        if(this.statdate)
        {
            let stdate2= moment(moment(this.statdate).toDate().toString());
            this.activities.startDate=moment(stdate2).add(6, 'hours');
        }

        console.log(12,this.activities);
             this._inquiryServiceProxy.createOrUpdateJobActivity(this.activities)
            .finally(() => this.saving = false)
            .subscribe(() => {
               
                this.notify.info(this.l('SavedSuccessfully'));
                this.activities = this.eventOriginal;
                
                this.close();
                this.modalSave.emit(this.activities);
            });
    }
    

    onShown(): void {
        //$(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.modal.hide();
        this.active = false;
        this.allotedDate='';
        this.endDate='';
    }
}