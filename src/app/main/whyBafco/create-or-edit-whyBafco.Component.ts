import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { YbafcoList,YbafcoServiceProxy  } from "shared/service-proxies/service-proxies";

@Component({
    selector: 'createWhyBafcoModal',
    templateUrl: './create-or-edit-whyBafco.Component.html'
})
export class CreateWhyBafcoModalComponent extends AppComponentBase {
   
      @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
       @ViewChild('modal') modal: ModalDirective;
       @ViewChild('nameInput') nameInput: ElementRef;
  list: YbafcoList = new  YbafcoList();
     eventOriginal = this.list;
   
      active = false;
       saving = false;
  
       constructor(
          injector: Injector,
          private _ybafcoService: YbafcoServiceProxy
       ) {
          super(injector);
       }
       show(bafcoId?: number): void {
       this.list = new YbafcoList();
               this._ybafcoService.getYbafcoForEdit(bafcoId).subscribe((result) => {
           if (result.ybafcoList!= null) {
           this.list = result.ybafcoList;
           }
             this.active = true;
            this.modal.show();
      });
   }

  
 save(): void {
        this.saving = true;
            if (this.list.id == null) {
               this.list.id = 0;
           }
            this._ybafcoService.createOrUpdateYbafco(this.list)
           .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
               this.list = this.eventOriginal;
               this.close();
               this.modalSave.emit(this.list);
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