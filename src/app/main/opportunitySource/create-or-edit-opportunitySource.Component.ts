import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { OpportunitySourceList, OpportunitySourceServiceProxy  } from "shared/service-proxies/service-proxies";

@Component({
    selector: 'createOpportunitySourceModal',
    templateUrl: './create-or-edit-opportunitySource.Component.html'
})
export class CreateOpportunitySourceModalComponent extends AppComponentBase {
    
       @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
       @ViewChild('modal') modal: ModalDirective;
       @ViewChild('nameInput') nameInput: ElementRef;
       source: OpportunitySourceList = new OpportunitySourceList();
       eventOriginal = this.source;
    
       active = false;
       saving = false;
   
       constructor(
           injector: Injector,
           private _opportunitySourceService: OpportunitySourceServiceProxy,  
       ) {
           super(injector);
       }
   
    show(opportunityId?: number): void {
           this.source = new OpportunitySourceList();
                  this._opportunitySourceService.getOpportunitySourceForEdit(opportunityId).subscribe((result) => {
               if (result.sources != null) {
               this.source = result.sources;
              }
                this.active = true;
                this.modal.show();
           });
       }
   
      
    save(): void {
           this.saving = true;
              if (this.source.id == null) {
                  this.source.id = 0;
              }
                this._opportunitySourceService.createOrUpdateOpportunitySource(this.source)
               .finally(() => this.saving = false)
               .subscribe(() => {
                   this.notify.info(this.l('SavedSuccessfully'));
                   this.source = this.eventOriginal;
                   this.close();
                   this.modalSave.emit(this.source);
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
   