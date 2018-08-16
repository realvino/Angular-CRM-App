import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FinishedServiceProxy, FinishedDetailList, FinishedDetailInput, Select2ServiceProxy, Datadto, TemporaryFinishedDetailList, TemporaryFinishedDetailInput } from "shared/service-proxies/service-proxies";

export interface SelectOption{
    id?: number;
    text?: string;
 }

@Component({
    selector: 'createEditFinishedDetailModal',
    templateUrl: './createOReditFinishedDetailComponent.html',
})

export class CreateEditFinishedDetailComponent extends AppComponentBase  {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;

    finishedDetail: FinishedDetailList = new FinishedDetailList();
    finishDetailInput: FinishedDetailInput = new FinishedDetailInput();
    eventOriginal = this.finishedDetail;
    active = false;
    saving = false;
    finishDto : Datadto[];
    active_finish:SelectOption[];
    finishes:Array<any>;
    activeProductId:number;

    saveFinishedDetail:boolean= false;

    tempfinishedDetail: TemporaryFinishedDetailList = new TemporaryFinishedDetailList();
    tempfinishDetailInput: TemporaryFinishedDetailInput = new TemporaryFinishedDetailInput();
    eventOriginalTemp = this.tempfinishedDetail;

    constructor(
        injector: Injector,
        private _finishedService: FinishedServiceProxy,
        private _select2Service: Select2ServiceProxy
    ) {
        super(injector);
    }

   show(finishedDetailId?: number,productId?: number, tempoararyProductId?: number): void {
        this._select2Service.getFinishes().subscribe((result) =>{
            if(result.select2data != null){
                this.finishDto = result.select2data;
                this.finishes = [];
                this.finishDto.forEach((finish:{id:number,name:string}) =>{
                    this.finishes.push({
                        id: finish.id,
                        text: finish.name
                    });
                 });
            }
       });

       if(productId > 0){
           this.saveFinishedDetail = true;
           this.finishDetailInput = new FinishedDetailInput();
           this.finishDetailInput.productId = productId;
            if(finishedDetailId > 0)
            {
             this._finishedService.getFinishedDetailForEdit(finishedDetailId).subscribe((result) => {
                 if (result != null) {
                  this.finishedDetail = result;
                  this.finishDetailInput.id = this.finishedDetail.id;
                  this.finishDetailInput.gpCode = this.finishedDetail.gpCode;
                  this.finishDetailInput.price = this.finishedDetail.price;
                  this.finishDetailInput.finishedId = this.finishedDetail.finishedId;
                  this.finishDetailInput.productId = this.finishedDetail.productId;
                  this.activeProductId = this.finishedDetail.productId;
                  this.active_finish= [{id:this.finishedDetail.finishedId,text: this.finishedDetail.finishedName }];
                 }
              });
            }
       }

       if(tempoararyProductId > 0){
           this.saveFinishedDetail = false;
            this.tempfinishDetailInput = new TemporaryFinishedDetailInput();
            this.tempfinishDetailInput.temporaryProductId= tempoararyProductId;
            if(finishedDetailId > 0)
            {
                this._finishedService.getTemporaryFinishedDetailForEdit(finishedDetailId).subscribe((result) => {
                if (result != null) {
                    this.tempfinishedDetail = result;
                    this.tempfinishDetailInput.id = this.tempfinishedDetail.id;
                    this.tempfinishDetailInput.gpCode = this.tempfinishedDetail.gpCode;
                    this.tempfinishDetailInput.price = this.tempfinishedDetail.price;
                    this.tempfinishDetailInput.finishedId = this.tempfinishedDetail.finishedId;
                    this.tempfinishDetailInput.temporaryProductId = this.tempfinishedDetail.temporaryProductId;
                    this.activeProductId = this.tempfinishedDetail.temporaryProductId;
                    this.active_finish= [{id:this.tempfinishedDetail.finishedId,text: this.tempfinishedDetail.finishedName }];
                 }
              });
         }
       }
        this.active = true;
        this.modal.show();
    }

    checkMinus(event: KeyboardEvent) {
        if (event.keyCode == 189 || event.keyCode == 109) {
          event.preventDefault();
        }
      }

    save(): void {
        this.saving = true;
        if(this.saveFinishedDetail){
            if (this.finishDetailInput.id == null) {
                this.finishDetailInput.id = 0;
            }
            this._finishedService.createOrUpdateFinishedDetail(this.finishDetailInput)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.modalSave.emit(this.activeProductId);
                this.finishDetailInput = this.eventOriginal;
                this.close();
            });
        }
        else{
            if (this.tempfinishDetailInput.id == null) {
                this.tempfinishDetailInput.id = 0;
            }
            this._finishedService.createOrUpdateTemporaryFinishedDetail(this.tempfinishDetailInput)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.modalSave.emit(this.activeProductId);
                this.tempfinishDetailInput = this.eventOriginalTemp;
                this.close();
            });
        }
            
    }

    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }

    close(): void {
        this.activeProductId = null;
        this.active_finish = [];
        this.active = false;
        this.saveFinishedDetail= false;
        this.modal.hide();
    }

    selectedFinish(data:any){
        if(this.saveFinishedDetail){
            this.finishDetailInput.finishedId = data.id;
        }
        else{
            this.tempfinishDetailInput.finishedId = data.id;
        }
        
    }
    removedFinish(data:any){
        this.tempfinishDetailInput.finishedId = null;
        this.finishDetailInput.finishedId =null;
    }
    check(event: KeyboardEvent) {
        if (event.keyCode == 189 || event.keyCode == 109) {
          event.preventDefault();
        }
    }

}
