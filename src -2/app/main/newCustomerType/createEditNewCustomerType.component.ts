import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { NewCustomerTypeListDto, NewCustomerTypeServiceProxy} from "shared/service-proxies/service-proxies";

@Component({
    selector: 'createNewCustomerTypeModal',
    templateUrl: './createEditNewCustomerType.component.html'
})
export class CreateOrEditNewCustomerTypeComponent extends AppComponentBase  {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;

    customertype: NewCustomerTypeListDto = new NewCustomerTypeListDto();
    eventOriginal = this.customertype;
    //custype:string;
  
    custype = ["Company", "Contact"];
    custselect = "Company";

    active = false;
    saving = false;

    constructor(
        injector: Injector,
        private _customerTypeService: NewCustomerTypeServiceProxy,

    ) {
        super(injector);
    }

   show(customertypeId?: number): void {
       //this.customertype();
       this.customertype = new NewCustomerTypeListDto();
       this.custselect = "Company";
        //this.customertype = this.eventOriginal;
        this._customerTypeService.getNewCustomerTypeForEdit(customertypeId).subscribe((result) => {
           if (result.newCustomerTypes != null) {
            this.customertype = result.newCustomerTypes;
            if(this.customertype.company == true)
            {
                    this.custselect ="Company";
            }
            else{
                    this.custselect ="Contact";
            }
           }
             this.active = true;
             this.modal.show();
        });
    }

    

   save(): void {
        this.saving = true;
           if (this.customertype.id == null) {
               this.customertype.id = 0;
           }
            if(this.custselect == "Company")
            {
                this.customertype.company = true;
            }
            else{
                this.customertype.company = false;
            }
           //console.log(this.custselect);
           //this.customertype.company = true;
             this._customerTypeService.createOrUpdateNewCustomerType(this.customertype)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.customertype = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.customertype); 
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
