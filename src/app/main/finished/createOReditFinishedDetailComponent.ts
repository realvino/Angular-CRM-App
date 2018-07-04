import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FinishedServiceProxy, FinishedDetailList, FinishedDetailInput, Select2ServiceProxy, Datadto } from "shared/service-proxies/service-proxies";

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

    constructor(
        injector: Injector,
        private _finishedService: FinishedServiceProxy,
        private _select2Service: Select2ServiceProxy
    ) {
        super(injector);
    }

   show(finishedDetailId?: number,productId?: number): void {
       this.finishDetailInput = new FinishedDetailInput();
        this.finishDetailInput.productId = productId;
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
        
        
        this.active = true;
        this.modal.show();
    }
    
    save(): void {
        this.saving = true;
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

    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }

    close(): void {
        this.activeProductId = null;
        this.active_finish = [];
        this.active = false;
        this.modal.hide();
    }

    selectedFinish(data:any){
        this.finishDetailInput.finishedId = data.id;
    }
    removedFinish(data:any){
        this.finishDetailInput.finishedId =null;
    }

}
