import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Select2ServiceProxy, Datadto, ProductSubGroupListDto, ProductSubGroupServiceProxy } from "shared/service-proxies/service-proxies";

export interface SelectOption{
   id?: number;
   text?: string;
}
@Component({
    selector: 'createProductSubGroupModal',
    templateUrl: './create-or-edit-productsubgroup.component.html'
})
export class CreateproductsubgroupModalComponent extends AppComponentBase  {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    @ViewChild('subGroupCombobox') subGroupCombobox: ElementRef;

    subGroup: ProductSubGroupListDto = new ProductSubGroupListDto();
    SelectedGroupNo:number = 0; 
    SelectedGroupName:string = ""; 
    groups: Datadto[] = [];
    eventOriginal = this.subGroup;
    private product_group:Array<any> = [];
    active_product:SelectOption[]=[];
     active = false;
    saving = false;

    constructor(
        injector: Injector,
        private _productSubGroupProxyService: ProductSubGroupServiceProxy,
        private _select2Service: Select2ServiceProxy
    ) {
        super(injector);
    }

   show(subGroupId?: number): void {
        this.subGroup = new ProductSubGroupListDto();
        this.SelectedGroupNo = 0;
        this.SelectedGroupName = "";
        this._select2Service.getProductGroup().subscribe((result) => {
           if (result.select2data != null) {
            this.groups = result.select2data;
            console.log(result.select2data);
            this.groups.forEach((pro_group:{id:number,name:string})=>{
                this.product_group.push({
                    id:pro_group.id,
                    text:pro_group.name
                });
            });

           } });

        this._productSubGroupProxyService.getProductSubGroupForEdit(subGroupId).subscribe((result) => {
           if (result.productSubGroup != null) {
            this.subGroup = result.productSubGroup;
            this.SelectedGroupNo = result.productSubGroup.groupId;
            this.SelectedGroupName = result.productSubGroup.productGroupName;
            this.active_product = [{id:result.productSubGroup.groupId,text:result.productSubGroup.productGroupName}];
           }
             this.active = true;
             this.modal.show();
        });
    }
    doSomething(data?:any): void {
        console.log(data.id);
     this.subGroup.groupId = data.id;
    }
    removeProduct(data?:any){
        this.subGroup.groupId =null;
    }
   save(): void {
        this.saving = true;
           if (this.subGroup.id == null) {
               this.subGroup.id = 0;
           }
           console.log(this.subGroup);
             this._productSubGroupProxyService.createOrUpdateProductSubGroup(this.subGroup)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.subGroup = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.subGroup);
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
