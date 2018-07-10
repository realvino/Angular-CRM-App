import { Component, ViewChild, Injector, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import {  QuotationServiceProxy, QuotationRevisionInput} from 'shared/service-proxies/service-proxies';
import { Router } from '@angular/router';
import * as moment from "moment";

@Component({
    selector: 'QuotationRevisionModal',
    templateUrl: './quotationRevisionModalComponent.html'

})
export class QuotationRevisionModalComponent extends AppComponentBase implements AfterViewInit {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    QuotationId: number;
    active = false;
    saving = false;
    arr:Array<any>;
    type : string;
    selectedTypeId: number = 0;
    nextActivity:string;
    QRevisionInput: QuotationRevisionInput = new QuotationRevisionInput();
    
    constructor(
        injector: Injector,
        private _quoatationService: QuotationServiceProxy,
    ){
        super(injector);
    }
    ngAfterViewInit(): void {

    }
    
    show(QuotationId?:number){ 
        console.log(QuotationId); 
        this.QuotationId = QuotationId; 
        this.arr = [{ 'id' : '1','name' : 'Quotation Revision' }, 
                    { 'id' : '3','name' : 'Quotation with Designer Revision' }
                   ];

        this.modal.show();
        this.active = true;
    }

    changeRevision(typeId):void{
        this.selectedTypeId = typeId;
        this.QRevisionInput.typeId = typeId;
    }

    save() {
       this.saving = true;
       this.QRevisionInput.id = this.QuotationId;
       let lst= moment(moment(this.nextActivity).toDate().toString());
       this.QRevisionInput.nextActivity = moment(lst).add(6,'hours');
       console.log(this.QRevisionInput);
       this._quoatationService.quotationRevision(this.QRevisionInput)
       .finally(() => this.saving = false)
       .subscribe(result=>{
        if(result){
           console.log(result);
           this.QuotationId = result;
           this.notify.success("Quotation Revised Successfully");
           this.close();
         }
       });
    }


	close(): void {
        this.type = '';
        this.selectedTypeId = null;
        this.nextActivity = "";
		this.modalSave.emit(this.QuotationId);
		this.modal.hide();
        this.active = false;
    }
} 