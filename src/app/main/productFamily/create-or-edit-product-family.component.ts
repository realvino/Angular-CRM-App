import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProductFamilyServiceProxy,CreateProductFamilyInput,Select2ServiceProxy, Datadto } from 'shared/service-proxies/service-proxies';

export interface SelectOption{
    id?:number,
    text?:string
}
@Component({
    selector: 'createProductFamilyModal',
    templateUrl: './create-or-edit-product-family.component.html'
})
export class CreateProductFamilyComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    productFamily: CreateProductFamilyInput = new CreateProductFamilyInput();
    eventOriginal = this.productFamily;

    active_collection: SelectOption[];
    collections:Array<any>;
    collects_Dto:Datadto[];

    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _productFamilyService: ProductFamilyServiceProxy,
        private _Select2Service: Select2ServiceProxy
    ) {
        super(injector);
    }


   show(productFamilyId?: number): void {
        this.productFamily = new CreateProductFamilyInput();
        this._Select2Service.getCollection().subscribe(result=>{
            if(result.select2data!=null){
                this.collects_Dto = result.select2data;
                this.collections = [];
                this.collects_Dto.forEach((coll:{id:number,name:string})=>{
                    this.collections.push({
                        id:coll.id,
                        text:coll.name
                    });
                });
            }
        });
        this._productFamilyService.getProductFamilyForEdit(productFamilyId).subscribe((result) => {
           if (result.productFamily != null) {
            this.productFamily = result.productFamily;
           }
           if(result.collectiondatas!=null){
                this.productFamily.collectionId = result.collectiondatas.id;
                this.active_collection = [{id:result.collectiondatas.id,text:result.collectiondatas.name}];
           }
             this.active = true;
             this.modal.show();
        });
    }

 save(): void {
        this.saving = true;
           if (this.productFamily.id == null) {
               this.productFamily.id = 0;
           }
           console.log(this.productFamily);
             this._productFamilyService.createOrUpdateProductFamily(this.productFamily)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.productFamily = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.productFamily);
            });
    }

    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.active_collection =[];
        this.modal.hide();
        this.active = false;
    }
    selectedCollection(data:any){
        this.productFamily.collectionId = data.id;
    }
    removeCollection(data:any){
        this.productFamily.collectionId = null;
    }

}
