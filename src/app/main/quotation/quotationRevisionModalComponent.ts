import { Component, ViewChild, Injector, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import {  QuotationServiceProxy, QuotationRevaluationInput} from 'shared/service-proxies/service-proxies';
import * as moment from "moment";
import { Router } from '@angular/router';

@Component({
    selector: 'QuotationRevisionModal',
    templateUrl: './quotationRevisionModalComponent.html'

})
export class QuotationRevisionModalComponent extends AppComponentBase implements AfterViewInit {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    QuotationId: number;
    InquiryId: number;
    active = false;
    saving = false;
    arr:Array<any>;
    type : string;
    selectedTypeId: number;
    nextActivity:string;
    QRevaluationInput: QuotationRevaluationInput = new QuotationRevaluationInput();
    
    constructor(
        injector: Injector,
        private _quoatationService: QuotationServiceProxy,
        private router: Router
    ){
        super(injector);
    }
    ngAfterViewInit(): void {

    }
    
    show(QuotationId?:number){ 
        console.log(QuotationId); 
        this.QuotationId = QuotationId;   
        this.arr = [{ 'id' : '1','name' : 'Revaluation 1' }, 
                    { 'id' : '2','name' : 'Revaluation 2' },
                    { 'id' : '3','name' : 'Revaluation 3' }
                   ];

        this.modal.show();
        this.active = true;
    }

    changeRevalution(typeId):void{
        console.log(typeId);
        this.selectedTypeId = typeId;
    }
    /* isValidSave(){
        if(!this.selectedTypeId){
            return false;
        }
        else{
            return true;
        }
    } */

    save() {
       this.saving = true;
       this.QRevaluationInput.id = this.QuotationId;
       this.QRevaluationInput.type = this.selectedTypeId;
       console.log(this.QRevaluationInput);
       this._quoatationService.quotationRevaluation(this.QRevaluationInput)
       .finally(() => this.saving = false)
       .subscribe(()=>{
          this.notify.success("Quotation Revaluated successfully");
          this.close();
       });
     }


	close(): void {
        this.type = '';
        this.selectedTypeId = null;
		this.modalSave.emit();
		this.modal.hide();
        this.active = false;
    }
}