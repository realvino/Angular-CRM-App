import { Component, ViewChild, Injector, Renderer, ElementRef, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Select2ServiceProxy,InquiryServiceProxy,EnquiryContactInputDto, EnquiryContactServiceProxy} from 'shared/service-proxies/service-proxies';
import {Jsonp} from '@angular/http';
import * as _ from "lodash";

export interface SelectOption{
   id?: number;
   text?: string;
}
@Component({
    selector: 'createLinkedModal',
    templateUrl: './linkedContact.component.html'

})
export class LinkedContactComponent extends AppComponentBase implements AfterViewInit {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    
    @Output() updateCompany = new EventEmitter<any>();
    i: number = 0;
    active = false;
    saving = false;
	contacts = [];
	items    = [];
  selected_val:boolean=false;
	companycontact = [];
  already_add:any=[];
	contactInput:EnquiryContactInputDto = new EnquiryContactInputDto();
	cotactId = false;
	companyId = false;
  name:string="";
  exist_con:boolean=false;
  linkedContacts:any = [];
    constructor(
        injector: Injector,
        private _enquiryContactServiceProxy: EnquiryContactServiceProxy,
        private _select2Service: Select2ServiceProxy,
        private renderer: Renderer,
        private _jsonp: Jsonp
    ){
        super(injector);
        // console.log(this.companys);
    }
    ngAfterViewInit(): void {

    }
    
   show(companyId?: number,inquiryId?:number): void {   
   			 this.active = true;
             this.modal.show();
       this.i = 0;
	   this.contactInput.inquiryId = inquiryId;
       this.items = [];
       this.contacts = [];
       this._enquiryContactServiceProxy.getEnquiryWiseEnquiryContact(inquiryId).subscribe(contacts => {
                      this.linkedContacts = contacts.items;
                  });
         this._select2Service.getCompanyContacts(companyId).subscribe((result) => { 
            if (result.select2data != null) {
                this.companycontact = result.select2data;
                 this.contacts = [];
                                 
                 this.companycontact.forEach((company: {id: number, name: string}) => {

                  this.contacts.push({
                                   id: company.id,
                                   text: company.name
                                   });

                 });
								
              }
          });
					  
   }
   public selectedContact(value:any):void {
    console.log('Selected value is: ', value);
    this.cotactId = value.id;
  this.contactInput.contactId = value.id;
  this.name = value.text;
  this.selected_val = true;
  }

  public removedContact(value:any):void {
    console.log('Removed value is: ', value);
    this.selected_val = false;
  }
   save() {
		this.saving = true;
             var index = this.linkedContacts.findIndex(x => x.newContactName==this.name);

               if(index!=-1){
					this.notify.info(this.l('This Contact is Already Added'));
					this.saving = false;
               }else{
					this.contactInput.id=0;
					this._enquiryContactServiceProxy.createOrUpdateEnquiryContact(this.contactInput)
					.finally(() => this.saving = false)
					.subscribe(() => {
						this.notify.info(this.l('SavedSuccessfully'));
						this.close();
						this.modalSave.emit(this.contactInput);
					});
               } 
          
    }
    isFilled(data){
      if(data.form.valid && this.selected_val){
          return false;
      }else{
          return true;
      }
    }
	close(): void {
    this.selected_val = false;
		this.modal.hide();
		this.active = false;
	}
}