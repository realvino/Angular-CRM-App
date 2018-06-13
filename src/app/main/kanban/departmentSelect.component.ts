import { Component, ViewChild, Injector, Renderer, ElementRef, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Select2ServiceProxy,InquiryServiceProxy, InquiryListDto, InquiryInputDto,Sourcelist,EnquiryUpdateInputDto,EnquiryUpdateServiceProxy, Select2TeamDto, Datadto} from 'shared/service-proxies/service-proxies';
import {Jsonp} from '@angular/http';
import * as _ from "lodash";

export interface SelectOption{
   id?: number;
   text?: string;
}
@Component({
    selector: 'selectDepartmentModal',
    templateUrl: './departmentSelect.component.html'

})
export class DepartmentSelectComponent extends AppComponentBase implements AfterViewInit {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    
    @Output() updateCompany = new EventEmitter<any>();
    i: number = 0;
    active = false;
    saving = false;
  departments = [];
  active_stage:SelectOption[]=[];
	items    = [];
  selected_val:boolean=false;
	department_list = [];
  already_add:any=[];
	cotactId = false;
	companyId = false;
  name:string="";
  exist_con:boolean=false;
  linkedContacts:any = [];
  team_list: Select2TeamDto[];
  teams:Array<any>;
  inquiry:InquiryListDto = new InquiryListDto();
  update_details:InquiryInputDto = new InquiryInputDto();
  updateInquiryIn: EnquiryUpdateInputDto = new EnquiryUpdateInputDto();
  Sources :Sourcelist[];
  active_department:SelectOption[]=[];
  active_team:SelectOption[] = [];
  stage_list: Datadto[];
  stages:Array<any>;
  mileStoneId:number;
  statusId:number = null;
  select2Status:number = null;
	StageName:string;
	UpdateStageName:string;
    constructor(
        injector: Injector,
        private _inquiryServiceProxy: InquiryServiceProxy,
        private _select2Service: Select2ServiceProxy,
        private renderer: Renderer,
        private _jsonp: Jsonp,
        private _enquiryUpdateServiceProxy: EnquiryUpdateServiceProxy
    ){
        super(injector);
        // console.log(this.companys);
    }
    ngAfterViewInit(): void {

    }
    
   show(inquiryId?:number,currentStatus?:string,updateStatus?:string,mileStoneId?:number,stageName?:string){  
       this.StageName = stageName;
       this.inquiry= new InquiryListDto(); 
   		 this.active = true;
       this.updateInquiryIn.id = inquiryId;
       this.updateInquiryIn.currentStatusName = currentStatus;
       this.updateInquiryIn.updateStatusName = updateStatus;
       this.mileStoneId = mileStoneId;
       this.modal.show();
       this.items = [];
       this.departments = [];
         this._inquiryServiceProxy.getInquiryForEdit(inquiryId).subscribe((result) => {
           this.Sources = result.selectedSource;
           if (result.inquirys != null) {
            this.inquiry = result.inquirys;
            console.log(this.inquiry);          
           }
        this.active = true;
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
           }
        });	  

        this._select2Service.getEnquiryStages(this.mileStoneId).subscribe(result=>{
          if (result.select2data != null) {
              this.stage_list = result.select2data;
              this.stages = [];
             this.stage_list.forEach((stage: {id: number, name: string}) => {
               this.stages.push({
                 id: stage.id,
                 text: stage.name,
               });
               if(this.stages.length > 0)
               {
                  this.active_stage = [{id: this.stages[0].id, text: this.stages[0].text}];
                  this.update_details.statusId = this.stages[0].id;
               }
             });
          }
      });
   }
   public selectedDepartment(value:any):void {
    this.cotactId = value.id;
    this.inquiry.departmentId = value.id;
    this.name = value.text;
    this.selected_val = true;
  }

  public removedDepartment(value:any):void {
    this.inquiry.departmentId = null;
    this.selected_val = false;
  }
  public selectedTeam(value:any):void {
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
    
    this.selected_val = true;
  }

  public removedTeam(value:any):void {
    this.inquiry.teamId = null;
    this.inquiry.departmentId = null;
    this.active_team = [];
    this.active_department = [];
    this.selected_val = false;
  }

  public selectedStage(value:any):void {
    this.update_details.statusId = value.id;
    this.UpdateStageName = value.text;
  }
  public removedStage(value:any):void {
  }


   save() {
		this.saving = true;
           this.update_details.teamId = this.inquiry.teamId;
           this.update_details.id = this.inquiry.id;
           this.update_details.name = this.inquiry.name;
           this.update_details.email = this.inquiry.email;
           this.update_details.mbNo = this.inquiry.mbNo;
           this.update_details.landlineNumber = this.inquiry.landlineNumber;
           this.update_details.remarks = this.inquiry.remarks;
           this.update_details.ipAddress = this.inquiry.ipAddress;
           this.update_details.subMmissionId = this.inquiry.subMmissionId;
           this.update_details.browcerinfo = this.inquiry.browcerinfo;
           if(this.inquiry.departmentId==0 || this.inquiry.departmentId==null){
           this.update_details.departmentId = null;
         }else{
            this.update_details.departmentId = this.inquiry.departmentId;
         }
           this.update_details.webSite = this.inquiry.webSite;
           this.update_details.address = this.inquiry.address;
           this.update_details.mileStoneId = this.mileStoneId;
           this.update_details.designationId = this.inquiry.designationId?this.inquiry.designationId:null;
           this.update_details.designationName =  this.inquiry.designationName;
           this.update_details.companyName = this.inquiry.companyName;
           this.update_details.companyId = this.inquiry.companyId?this.inquiry.companyId:null;
           this.update_details.contactId = this.inquiry.contactId?this.inquiry.contactId:null;
           this.update_details.sourceId =  _.map(
                _.filter(this.Sources, { isAssigned: true }), Source => Source.sourceId
            );
           if(this.inquiry.compatitorsId){
              this.update_details.compatitorsId = this.inquiry.compatitorsId;
           }else{
              this.update_details.compatitorsId =null;
           }
           this.update_details.leadTypeId = this.inquiry.leadTypeId?this.inquiry.leadTypeId:null;
           this.update_details.size = this.inquiry.size;
           this.update_details.estimationValue = this.inquiry.estimationValue;
           this.update_details.summary = this.inquiry.summary;
           console.log(this.update_details);
            this._inquiryServiceProxy.createOrUpdateInquiry(this.update_details)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.activityDefault();
                this.close();
                this.modalSave.emit(this.inquiry);
            });

    }
    isFilled(data){
      if(data.form.valid && this.selected_val){
          return false;
      }else{
          return true;
      }
    }
    enquiryStatusUpdate(){
      this._enquiryUpdateServiceProxy.createORupdateInquiry(this.updateInquiryIn).subscribe(result => {
        
        console.log(result);

    });
    }

    activityDefault(): void {

      this.updateInquiryIn.currentStatusName = this.updateInquiryIn.currentStatusName+"("+this.StageName+")";
      this.updateInquiryIn.updateStatusName = this.updateInquiryIn.updateStatusName+"("+this.UpdateStageName+")";
      this._enquiryUpdateServiceProxy.createActivityDefault(this.updateInquiryIn).subscribe(result => {});
      
}
	close(): void {
		this.modalSave.emit();
    	this.selected_val = false;
		this.modal.hide();
		this.active = false;
this.active_department = [];
	}
}