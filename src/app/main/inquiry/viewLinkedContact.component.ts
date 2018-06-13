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
    selector: 'viewLinkedModal',
    templateUrl: './viewLinkedContact.component.html'

})
export class ViewLinkedContactComponent extends AppComponentBase implements AfterViewInit {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    
    @Output() updateCompany = new EventEmitter<any>();
    i: number = 0;
    active = false;
    saving = false;
	contacts = [];
	items    = [];
	linkedContacts:any = [];
	companycontact = [];
	contactInput:EnquiryContactInputDto = new EnquiryContactInputDto();
	cotactId = false;
	companyId = false;
    constructor(
        injector: Injector,
        private _enquiryContactService: EnquiryContactServiceProxy,
        private _select2Service: Select2ServiceProxy,
        private renderer: Renderer,
        private _jsonp: Jsonp,
		
    ){
        super(injector);
        // console.log(this.companys);
    }
    ngAfterViewInit(): void {
    }
  
   show(inquiryId?:number): void {
		this.active = true;
		this.modal.show();
		this._enquiryContactService.getEnquiryWiseEnquiryContact(inquiryId).subscribe(contacts => {
		   this.linkedContacts = contacts.items;
		   console.log(contacts,'saju---',inquiryId);
		});
   }
    
	close(): void {
		this.modal.hide();
		this.active = false;
	}
}