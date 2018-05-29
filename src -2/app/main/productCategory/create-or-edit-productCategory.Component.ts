import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProductCategoryList, ProductCategoryServiceProxy } from "shared/service-proxies/service-proxies";

@Component({
    selector: 'createProductCategoryModal',
    templateUrl: './create-or-edit-productCategory.Component.html'
})
export class CreateProductCategoryModalComponent extends AppComponentBase {
    
       @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
       @ViewChild('modal') modal: ModalDirective;
       @ViewChild('nameInput') nameInput: ElementRef;
       categories: ProductCategoryList = new ProductCategoryList();
       eventOriginal = this.categories;
    
       active = false;
       saving = false;
   
       constructor(
           injector: Injector,
           private _productCategoryService: ProductCategoryServiceProxy,  
       ) {
           super(injector);
       }
   
    show(categoryId?: number): void {
           this.categories = new ProductCategoryList();
                  this._productCategoryService.getProductCategoryForEdit(categoryId).subscribe((result) => {
               if (result.category != null) {
               this.categories = result.category;
              }
                this.active = true;
                this.modal.show();
           });
       }
   
      
    save(): void {
           this.saving = true;
              if (this.categories.id == null) {
                  this.categories.id = 0;
              }
                this._productCategoryService.createOrUpdateProductCategory(this.categories)
               .finally(() => this.saving = false)
               .subscribe(() => {
                   this.notify.info(this.l('SavedSuccessfully'));
                   this.categories = this.eventOriginal;
                   this.close();
                   this.modalSave.emit(this.categories);
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
   