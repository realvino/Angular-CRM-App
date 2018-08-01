import { Component, ViewChild, Injector, Renderer, ElementRef, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Select2ServiceProxy,InquiryServiceProxy, InquiryListDto, InquiryInputDto,Sourcelist,EnquiryUpdateInputDto,EnquiryUpdateServiceProxy, Select2TeamDto, Datadto, EnquiryStatusUpdateInput, QuotationStatusUpdateInput, UpdateQuotationInput, QuotationServiceProxy, Stagedto, EnquiryJunkUpdateInputDto} from 'shared/service-proxies/service-proxies';
import {Jsonp} from '@angular/http';
import * as _ from "lodash";
import * as moment from "moment";
import { Router } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
export interface SelectOption{
   id?: number;
   text?: string;
}
@Component({
    selector: 'selectStageModal',
    templateUrl: './stage.component.html'

})
export class StageSelectComponent extends AppComponentBase implements AfterViewInit {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    enquiryjunkinput:EnquiryJunkUpdateInputDto = new EnquiryJunkUpdateInputDto();
    active = false;
    saving = false;
    QuotEnquiryId : number;
    location: string;
    CurrentStageName:string;
    Name:string;
	  stage = [];
    from:number;
    quot:number;
    won:number;
    lost:number;
    lastActivity:string;
  stage_list: Stagedto[];
  stages:Array<any>;
  inquiry:InquiryListDto = new InquiryListDto();
  update_details:InquiryInputDto = new InquiryInputDto();
  updateInquiryIn: EnquiryUpdateInputDto = new EnquiryUpdateInputDto();
  EStatusUpdateInput: EnquiryStatusUpdateInput = new EnquiryStatusUpdateInput();
  QStatusUpdateInput: QuotationStatusUpdateInput = new QuotationStatusUpdateInput();
  QuotationInput:UpdateQuotationInput = new UpdateQuotationInput();
  competitor_data:Datadto[];
  competators:Array<any>;
  active_competators:SelectOption[]=[];
  reason_data:Datadto[];
  reasons:Array<any>;
  active_reason:SelectOption[]=[];
  Sources :Sourcelist[];
  mileStoneId :number;
    constructor(
        injector: Injector,
        private _inquiryServiceProxy: InquiryServiceProxy,
        private _select2Service: Select2ServiceProxy,
        private _quoatationService: QuotationServiceProxy,
        private renderer: Renderer,
        private _jsonp: Jsonp,
        private _enquiryUpdateServiceProxy: EnquiryUpdateServiceProxy,
        private router: Router
    ){
        super(injector);
    }
    ngAfterViewInit(): void {

    }
    
show(inquiryId?:number,currentStatus?:string,updateStatus?:string,mileStoneId?:number,from?:number,stageName?:string){  
  
  var the_arr = this.router.url.split('/');
  this.location = the_arr[3];

  if(from == -1 ||from == -2 ||from == -4)
  {
    this._inquiryServiceProxy.getInquiryForEdit(inquiryId).subscribe((result) => {
      if(result.inquirys != null)
      {
        console.log(result.inquirys);
        this.Name = result.inquirys.name;
      }
    });
  }
  else{
    this._quoatationService.getQuotationForEdit(inquiryId).subscribe(result=>{
      this.QuotEnquiryId = result.quotation.inquiryId;
      if(result.quotation!=null){
        this.Name = result.quotation.refNo;
      }
      });
  }
    this.stages = [];
    this.modal.show();
    this.CurrentStageName = stageName;
    this.inquiry= new InquiryListDto(); 
   	   this.active = true;
       this.updateInquiryIn.id = inquiryId;
       this.QuotationInput.id = inquiryId;
       this.updateInquiryIn.currentStatusName = currentStatus;
       this.updateInquiryIn.updateStatusName = updateStatus;
       this.mileStoneId = mileStoneId;
       this.from = from;
       this._inquiryServiceProxy.getInquiryForEdit(inquiryId).subscribe((result) => {
           this.Sources = result.selectedSource;
           if (result.inquirys != null) {
            this.inquiry = result.inquirys;            
           }
        });

        this._select2Service.getEnquiryStages(mileStoneId).subscribe(result=>{

            if (result.select2data != null) {
                this.stage_list = result.select2data;
                this.stages = [];
               this.stage_list.forEach((stage: {id: number, name: string}) => {
                 this.stages.push({
                   id: stage.id,
                   text: stage.name,
                 });
               });
            }
        });

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
    
       this._select2Service.getLeadReason().subscribe((result)=>{
        this.reasons = [];
        if(result.select2data!=null){
          this.reason_data = result.select2data;
          this.reason_data.forEach((compte:{id:number,name:string})=>{
            this.reasons.push({
              id:compte.id,
              text: compte.name
            })
          });
        }
    });				  
   }

 
selectedCompetitor(data:any){
    this.QuotationInput.compatitorId = data.id;
    this.active_competators = [{id:data.id,text:data.text}];
  }
removedCompetitor(data:any){
    this.QuotationInput.compatitorId = null;
    this.active_competators = [];
  }

selectedReason(data:any){
    this.QuotationInput.reasonId = data.id;
    this.active_reason = [{id:data.id,text:data.text}];
  }
removedReason(data:any){
    this.QuotationInput.reasonId = null;
    this.active_reason = [];
  }
  save(stagedata,name) {
    
    console.log(this.stage_list);
    var indexidus = this.stage_list.findIndex(x=> x.name==name);
    var status = this.stage_list[indexidus].status;

     this.updateInquiryIn.stageId = stagedata;
     this.QuotationInput.stageId = stagedata;
     this.QuotationInput.mileStoneId = this.mileStoneId;

     if(status == 'Junk'){

      this.enquiryjunkinput.id = this.inquiry.id;;
      this.enquiryjunkinput.junk = true;
  
      this._enquiryUpdateServiceProxy.createORupdateInquiryJunk(this.enquiryjunkinput).subscribe(result=>{
        this.enquiryStatusUpdate();
        this.close();
        this.modalSave.emit(this.inquiry);
      });
    }
    else if(status == 'Won')
       {
          this.won = 1;
          this.lost = 0;
          this.QuotationInput.won = true;
          this.QuotationInput.lost = false;
       }else if(status == "Lost")
       {
        this.lost = 2;
        this.won = 0;
        this.QuotationInput.lost = true;
        this.QuotationInput.won = false;
       }
  else {
      if(this.from == -1)
      {
       this.saving = true;
       this.update_details.id = this.inquiry.id;
       this.update_details.name = this.inquiry.name;
       this.update_details.email = this.inquiry.email;
       this.update_details.mbNo = this.inquiry.mbNo;
       this.update_details.landlineNumber = this.inquiry.landlineNumber;
       this.update_details.remarks = this.inquiry.remarks;
       this.update_details.ipAddress = this.inquiry.ipAddress;
       this.update_details.subMmissionId = this.inquiry.subMmissionId;
       this.update_details.browcerinfo = this.inquiry.browcerinfo;
       this.update_details.webSite = this.inquiry.webSite;
       this.update_details.address = this.inquiry.address;
       this.update_details.mileStoneId = this.mileStoneId;
       this.update_details.designationId = this.inquiry.designationId?this.inquiry.designationId:null;
       this.update_details.designationName =  this.inquiry.designationName;
       this.update_details.companyName = this.inquiry.companyName;
       this.update_details.companyId = this.inquiry.companyId?this.inquiry.companyId:null;
       this.update_details.contactId = this.inquiry.contactId?this.inquiry.contactId:null;
       this.update_details.statusId = stagedata;
       this.update_details.leadTypeId = this.inquiry.leadTypeId?this.inquiry.leadTypeId:null;
       this.update_details.size = this.inquiry.size;
       this.update_details.estimationValue = this.inquiry.estimationValue;
       this.update_details.summary = this.inquiry.summary;

       this.update_details.sourceId =  _.map(_.filter(this.Sources, { isAssigned: true }), Source => Source.sourceId );

       if(this.inquiry.departmentId==0 || this.inquiry.departmentId==null){
           this.update_details.departmentId = null;
         }else{
           this.update_details.departmentId = this.inquiry.departmentId;
         }

       if(this.inquiry.compatitorsId){
          this.update_details.compatitorsId = this.inquiry.compatitorsId;
       }else{
          this.update_details.compatitorsId =null;
       }

       if(this.inquiry.teamId){
        this.update_details.teamId = this.inquiry.teamId;
    }else{
        this.update_details.teamId = null;
     }
      if(this.lastActivity){
         let lst= moment(moment(this.lastActivity).toDate().toString());
         this.update_details.lastActivity = moment(lst).add(6,'hours');
      }
        this._inquiryServiceProxy.createOrUpdateInquiry(this.update_details)
        .finally(() => this.saving = false)
        .subscribe(() => {
           this.notify.success("Enquiry Updated Successfully");	
           this.enquiryStatusUpdate();
            this.close();
            this.modalSave.emit(this.inquiry);
        });
      }
      else if (this.from == -2)
      {
       this.EStatusUpdateInput.enquiryId = this.updateInquiryIn.id;
       this.EStatusUpdateInput.statusId = this.mileStoneId;
       this.EStatusUpdateInput.stageId = stagedata;
       if(this.lastActivity){
          let lst= moment(moment(this.lastActivity).toDate().toString());
          this.EStatusUpdateInput.lastActivity = moment(lst).add(6,'hours');
       }
       console.log(this.EStatusUpdateInput);
       this._enquiryUpdateServiceProxy.enquiryStatusUpdate(this.EStatusUpdateInput).subscribe(result => {
       this.activityDefault();
       this.notify.success("Enquiry Updated Successfully");	
       this.close();
       this.modalSave.emit(this.inquiry);
        });
      }
      else if(this.from == -3)
      {
       this.QStatusUpdateInput.quotationId = this.updateInquiryIn.id;
       this.QStatusUpdateInput.statusId = this.mileStoneId;
       this.QStatusUpdateInput.stageId = stagedata;
       if(this.lastActivity){
         let lst= moment(moment(this.lastActivity).toDate().toString());
         this.QStatusUpdateInput.lastActivity = moment(lst).add(6,'hours');
       }
       this._enquiryUpdateServiceProxy.quotationStatusUpdate(this.QStatusUpdateInput).subscribe(result => {
       this.updateInquiryIn.id = this.QuotEnquiryId;
       this.activityDefault();
       this.notify.success("Quotation Updated Successfully");	
       this.close();
       this.modalSave.emit(this.inquiry);
      });
      }
      else if(this.from == -4)
      {
       this.EStatusUpdateInput.enquiryId = this.updateInquiryIn.id;
       this.EStatusUpdateInput.statusId = this.mileStoneId;
       this.EStatusUpdateInput.stageId = stagedata;
       if(this.lastActivity){
        let lst= moment(moment(this.lastActivity).toDate().toString());
        this.EStatusUpdateInput.lastActivity = moment(lst).add(6,'hours');;
       }
       console.log(this.EStatusUpdateInput);
       this._enquiryUpdateServiceProxy.enquiryStatusUpdate(this.EStatusUpdateInput).subscribe(result => {
       this.activityDefault();
       this.notify.success("Enquiry Updated Successfully");	
       this.close();
       this.modalSave.emit(this.inquiry);
        });
      }
      else{
       this.QStatusUpdateInput.quotationId = this.from;
       this.QStatusUpdateInput.statusId = this.mileStoneId;
       this.QStatusUpdateInput.stageId = stagedata;
       if(this.lastActivity){
        let lst= moment(moment(this.lastActivity).toDate().toString());
        //this.QStatusUpdateInput.lastActivity = moment(lst).add(6,'hours');;
       }
       console.log(this.QStatusUpdateInput);
       this._enquiryUpdateServiceProxy.quotationStatusUpdate(this.QStatusUpdateInput).subscribe(result => {
       this.updateInquiryIn.id = this.QuotEnquiryId;
       this.activityDefault();
       this.notify.success("Quotation Updated Successfully");	
       this.close();
       this.modalSave.emit(this.inquiry);
      });
      }
     }

}

    enquiryStatusUpdate(){
      this._enquiryUpdateServiceProxy.createORupdateInquiry(this.updateInquiryIn).subscribe(result => { 
        this.activityDefault();     
      });     
    }

    activityDefault(): void {
      this.updateInquiryIn.currentStatusName = this.updateInquiryIn.currentStatusName+"("+this.CurrentStageName+")";
      if(this.updateInquiryIn.stageId >0)
      {
          var index = this.stages.findIndex(x=> x.id==this.updateInquiryIn.stageId);
          this.updateInquiryIn.updateStatusName = this.updateInquiryIn.updateStatusName+"("+this.stages[index].text+")";
      }
      this._enquiryUpdateServiceProxy.createActivityDefault(this.updateInquiryIn).subscribe(result => {});
   }
   

     saveQuotation():void{
        this._quoatationService.updateQuotationWonorLost(this.QuotationInput).subscribe(result => {  
                 this.notify.success("Quotation Updated Successfully");	
                 if(this.QuotationInput.lost == true)
            {
              let download_url = AppConsts.remoteServiceBaseUrl +'Email/SendLostMail?QuotationId='+this.QuotationInput.id;
               var xmlhttp = new XMLHttpRequest();
               xmlhttp.open("GET", download_url, true);
               xmlhttp.send();

               xmlhttp.onreadystatechange = function() {
                 if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
                    
                 }
             };
            }
            if(this.QuotationInput.won == true)
            {
              let download_url = AppConsts.remoteServiceBaseUrl +'Email/SendWonMail?QuotationId='+this.QuotationInput.id;
               var xmlhttp = new XMLHttpRequest();
               xmlhttp.open("GET", download_url, true);
               xmlhttp.send();

               xmlhttp.onreadystatechange = function() {
                 if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
                    
                 }
             };
            }
                 this.close();


                 this.modalSave.emit(this.inquiry);    
        });
     }

     IsValidClick(data){
      if(this.location == 'sales-enquiry' || this.location == 'sales-grid')
      {
         if(data == "Junk"){
            return false;
         }
         else if(data == "Idea"){
            return false;
         }
         else if(data == "Lost"){
            return false;
         }
         else if(data == "OE Processing"){
            return false;
         } 
         else{
            if(this.lastActivity){
               return false;
            }
            else{
               return true;
            }
         }
     }
     else{
       return false;
     }
   }
     IsValid(data){
      if(this.lost){
          if(!data.form.valid || !this.QuotationInput.reasonId || !this.QuotationInput.compatitorId || !this.QuotationInput.reasonRemark)
          {
             return true;
          }
          else{
            return false;
          }
      }
      else{
        if(!data.form.valid)
        {
          return true;
        }
        else{
          return false;
        }
      } 
  }

	close(): void {
    this.won = 0;
    this.lost = 0;
		this.modalSave.emit();
		this.modal.hide();
    this.active = false;
    this.active_competators = [];
        this.active_reason = [];
        this.QuotationInput.poNumber = "";
        this.QuotationInput.reasonRemark = "";
        this.lastActivity = "";
    }
    cancel(): void {
        this.won = 0;
        this.lost = 0;
        this.active_competators = [];
        this.active_reason = [];
        this.QuotationInput.poNumber = "";
        this.QuotationInput.reasonRemark = "";
	}
}