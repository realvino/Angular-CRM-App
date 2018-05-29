import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Select2ServiceProxy, Datadto, Proddto, Productdto,QuotationServiceProxy } from "shared/service-proxies/service-proxies";


export interface SelectOption{
   id?: number;
   text?: string;
}

@Component({
    selector: 'productChangeModal',
    templateUrl: './unlock-product.component.html'
})
export class ProductChangeModalComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    qproduct_id : number;

    specifications:Array<any>;
    active_specification:SelectOption[];
    productSpec:Proddto[];
    product_specId:number;

    active_product:SelectOption[];
    products:Array<any>;
    product:Productdto[];
    
    product_id:number;

    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _quotationService:QuotationServiceProxy,
        private _selectProxyService:Select2ServiceProxy
    ) {
        super(injector);
    }
   show(QproductId?: number): void {
    this.qproduct_id = QproductId;
    this._selectProxyService.getProduct().subscribe(result=>{
        if(result.select2data!=null){
            this.product = result.select2data;
            this.products = [];
            this.product.forEach((pro:{id:number,name:string})=>{
                this.products.push({
                    id:pro.id,
                    text:pro.name
                });
            });
        }
    });
   
    this.active = true;
    this.modal.show();

    }
    onShown(): void {
        
    }
    save(){
        // this._quotationService.getQuotationProductUnlock(this.product_id,this.qproduct_id).subscribe(result=>{
        //     console.log(this.qproduct_id, this.product_id);
        //     this.modalSave.emit(this.qproduct_id);
        //     this.close();
        //     this.notify.success("Saved successfully");
        // });
    }
    close(): void {
        this.modal.hide();
        this.active = false;
    }
    selectedProduct(data:any){
        this.product_id = data.id;
    }
    removeProduct(data:any){
        this.product_id =null;
    }
    selectedSpecification(data:any){
        this.product_specId = data.id;
        this.getSpecProduct();
    }
    removeSpecification(data:any){
        this.active_product = [];
        this.product_specId = null;
        this.product_id =null;
        this.getSpecProduct();
    }
    getSpecProduct(){
        if(this.product_specId){
            this._selectProxyService.getSpecProduct(this.product_specId).subscribe(result=>{
                if(result.select2data!=null){
                    this.product = result.select2data;
                    this.products = [];
                    this.product.forEach((pro:{id:number,name:string})=>{
                        this.products.push({
                            id:pro.id,
                            text:pro.name
                        });
                    });
                }
            });
        }else{
            this.products = [];
            this.product = [];
        }
    }
}
