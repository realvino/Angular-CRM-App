import { Component, ViewChild, Injector, Renderer, ElementRef, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Select2ServiceProxy,InquiryServiceProxy, InquiryListDto, InquiryInputDto,Sourcelist} from 'shared/service-proxies/service-proxies';
import {Jsonp} from '@angular/http';
import * as _ from "lodash";

export interface SelectOption{
   id?: number;
   text?: string;
}
@Component({
    selector: 'selectleadsDepartmentModal',
    templateUrl: './departmentSelect.component.html'

})
export class LeadsDepartmentSelectComponent extends AppComponentBase implements AfterViewInit {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    
    @Output() updateCompany = new EventEmitter<any>();
    i: number = 0;
    active = false;
    saving = false;
	departments = [];
	items    = [];
  selected_val:boolean=false;
	department_list = [];
  already_add:any=[];
	cotactId = false;
	companyId = false;
  name:string="";
  exist_con:boolean=false;
  linkedContacts:any = [];
  inquiry:InquiryListDto = new InquiryListDto();
  update_details:InquiryInputDto = new InquiryInputDto();
  Sources :Sourcelist[];
  active_department:SelectOption[]=[];
    constructor(
        injector: Injector,
        private _inquiryServiceProxy: InquiryServiceProxy,
        private _select2Service: Select2ServiceProxy,
        private renderer: Renderer,
        private _jsonp: Jsonp
    ){
        super(injector);
        // console.log(this.companys);
    }
    ngAfterViewInit(): void {

    }
    
   show(inquiryId?:number){   
this.inquiry= new InquiryListDto();
   		 this.active = true;
       this.modal.show();
       this.items = [];
       this.departments = [];
         this._inquiryServiceProxy.getInquiryForEdit(inquiryId).subscribe((result) => {
           this.Sources = result.selectedSource;
           if (result.inquirys != null) {
            this.inquiry = result.inquirys;
            console.log(this.inquiry);
            
            //console.log(this.companies[index],'its ok for');                           
           }
        this.active = true;
        });
         this._select2Service.getDepartment().subscribe((result) => { 
            if (result.select2data != null) {
                this.department_list = result.select2data;
                 this.departments = [];
                                 
                 this.department_list.forEach((department: {id: number, name: string}) => {

                  this.departments.push({
                                   id: department.id,
                                   text: department.name
                                   });
                    if(department.id == this.inquiry.departmentId){
                      this.active_department = [{id:department.id,text:department.name}];
                      this.selected_val = true;
                    }
                 });
                
              }
          });
					  
   }
   public selectedDepartment(value:any):void {
    console.log('Selected value is: ', value);
    this.cotactId = value.id;
  this.inquiry.departmentId = value.id;
  this.name = value.text;
  this.selected_val = true;
  }

  public removedDepartment(value:any):void {
    console.log('Removed value is: ', value);
    this.inquiry.departmentId = null;
    this.selected_val = false;
  }
   save() {
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
           if( this.inquiry.departmentId==0 || this.inquiry.departmentId==null){
           this.update_details.departmentId = null;
         }else{
            this.update_details.departmentId = this.inquiry.departmentId;
         }
           this.update_details.webSite = this.inquiry.webSite;
           this.update_details.address = this.inquiry.address;
           this.update_details.mileStoneId = this.inquiry.mileStoneId;
           this.update_details.designationId = this.inquiry.designationId;
           this.update_details.designationName =  this.inquiry.designationName;
           this.update_details.companyName = this.inquiry.companyName;
           this.update_details.companyId = this.inquiry.companyId;
           this.update_details.sourceId =  _.map(
                _.filter(this.Sources, { isAssigned: true }), Source => Source.sourceId
            );

           console.log(this.update_details);
            this._inquiryServiceProxy.createOrUpdateInquiry(this.update_details)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
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
	close(): void {
    this.active_department=[];
    this.selected_val = false;
		this.modal.hide();
		this.active = false;
	}
}