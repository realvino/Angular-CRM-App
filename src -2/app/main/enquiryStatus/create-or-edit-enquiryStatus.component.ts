import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { EnquiryStatusListDto, EnquiryStatusServiceProxy, Datadto, Select2ServiceProxy, EnquiryStatusInputDto } from "shared/service-proxies/service-proxies";
import { selectOption } from 'app/main/productGroup/create-or-edit-productgroup.component';

export interface selectOption {
    id?:number,
    text?:string
}

@Component({
    selector: 'createEnquiryStatusModal',
    templateUrl: './create-or-edit-enquiryStatus.component.html'
})

export class createEnquiryStatusModalComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    enquiryStatus: EnquiryStatusListDto = new EnquiryStatusListDto();
    eventOriginal = this.enquiryStatus;

    enqstage:EnquiryStatusInputDto =new EnquiryStatusInputDto();
    active_state:selectOption[];
    stageStateDto:Datadto[];
    stageState:Array<any>;
    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _EnquiryStatusService: EnquiryStatusServiceProxy,
        private _select2Service: Select2ServiceProxy
    ) {
        super(injector);
    }
 
    show(enquiryStatusId?: number): void {
        this.enquiryStatus = new EnquiryStatusListDto();
        this._EnquiryStatusService.getEnquiryStatusForEdit(enquiryStatusId).subscribe((result) => {
           if (result.enquiryStatus != null) {
            this.enquiryStatus = result.enquiryStatus; 
            console.log(this.enquiryStatus);
            if(result.enquiryStatus.stagestateId!=null)
           {
            this.active_state=[{id:result.enquiryStatus.stagestateId,text:result.enquiryStatus.stagestateName}];
            }
           }
             this.active = true;
             this.modal.show();
        });
        this._select2Service.getStagestate().subscribe(result=>{
            console.log(0,result);
            if(result.select2data){
                this.stageStateDto = result.select2data;
                this.stageState= [];
                 this.stageStateDto.forEach((sp_group:{id:number,name:string})=>{
                    this.stageState.push({
                        id:sp_group.id,
                        text:sp_group.name
                    });
                });
            }
        });

    }
    selectedState(data:any){
        this.enqstage.stagestateId= data.id;
       
    }
    removeState(data:any){
        this.enqstage.stagestateId = null;
        this.active_state=[{id:0,text:""}];
    }

    save(): void {
        this.saving = true;
           if (this.enquiryStatus.id == null) {
               this.enquiryStatus.id = 0;
           }
           this.enqstage.enqStatusCode = this.enquiryStatus.enqStatusCode;
           this.enqstage.enqStatusColor = this.enquiryStatus.enqStatusColor;
           this.enqstage.enqStatusName = this.enquiryStatus.enqStatusName;
           this.enqstage.percentage = this.enquiryStatus.percentage;
           this.enqstage.id = this.enquiryStatus.id;
            console.log(this.enqstage);
             this._EnquiryStatusService.createOrUpdateEnquiryStatus(this.enqstage)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.enquiryStatus = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.enquiryStatus);
            });
    }

    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.modal.hide();
        this.active = false;
    }
}
