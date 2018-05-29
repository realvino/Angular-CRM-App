import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { NewInfoTypeListDto, NewInfoTypeServiceProxy} from "shared/service-proxies/service-proxies";

@Component({
    selector: 'createNewInfoTypeModal',
    templateUrl: './createEditNewInfoType.component.html'
})
export class CreateOrEditNewInfoTypeComponent extends AppComponentBase  {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;

    infotype: NewInfoTypeListDto = new NewInfoTypeListDto();
    eventOriginal = this.infotype;
      
    custype = ["AddressInfo", "ContactInfo"];
    custselect = "";

    active = false;
    saving = false;

    constructor(
        injector: Injector,
        private _infoTypeService: NewInfoTypeServiceProxy,

    ) {
        super(injector);
    }

   show(infotypeId?: number): void {
       
       this.infotype = new NewInfoTypeListDto();
       this.custselect = this.custype[0];
	 
        this._infoTypeService.getNewInfoTypeForEdit(infotypeId).subscribe((result) => {
           if (result.newInfoTypes != null) {
            this.infotype = result.newInfoTypes;
            if(this.infotype.info == false)
            {
                    this.custselect = this.custype[0];
            }
            else{
                    this.custselect = this.custype[1];
            }
           }
             this.active = true;
             this.modal.show();
        });
    }

    

   save(): void {
        this.saving = true;
		    if (this.infotype.id == null) {
               this.infotype.id = 0;
            }
            if(this.custselect == this.custype[0])
            {
                this.infotype.info = false;
            }
			else{
                this.infotype.info = true;
            }
			
            this._infoTypeService.createOrUpdateNewInfoType(this.infotype)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.infotype = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.infotype); 
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
