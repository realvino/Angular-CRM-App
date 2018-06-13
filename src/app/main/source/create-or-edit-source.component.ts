import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SourceListDto, SourceServiceProxy, Datadto, Select2ServiceProxy } from "shared/service-proxies/service-proxies";
export interface SelectOption{
   id?: number;
   text?: string;
}
@Component({
    selector: 'createSourceModal',
    templateUrl: './create-or-edit-source.component.html'
})
export class CreateSourceModalComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    source: SourceListDto = new SourceListDto();
    types: Datadto[] = [];

    eventOriginal = this.source;
    eventTypes = this.types;

    SelectedTypeId = 0;
    SelectedTypeName = '';
    private source_types:Array<any> = [];
    active_source:SelectOption[]=[];
    active = false;
    saving = false;

    constructor(
        injector: Injector,
        private _sourceService: SourceServiceProxy,
        private _select2Service: Select2ServiceProxy

    ) {
        super(injector);
    }

 show(sourceId?: number): void {
        this.source = new SourceListDto();
        this.SelectedTypeId = 0;
        this.SelectedTypeName = '';
         this._select2Service.getSourceType().subscribe((result) => {
           if (result.select2data != null) {
            
            this.types = result.select2data;
            this.source_types =[];
            this.types.forEach((sour_ce:{id:number,name:string})=>{
                this.source_types.push({
                    id:sour_ce.id,
                    text:sour_ce.name
                });
            });
           } });
        this._sourceService.getSourceForEdit(sourceId).subscribe((result) => {
            if (result.sources != null) {
            this.source = result.sources;
            this.SelectedTypeId = this.source.typeId;
            this.SelectedTypeName = this.source.typeName;
            this.active_source = [{id:this.source.typeId,text:this.source.typeName}];
           }
             this.active = true;
             this.modal.show();
        });
    }

    doSomething(data?:any): void {
    this.source.typeId = data.id;
    }
    removeSource(data?:any){
        this.source.typeId = null;
    }
 save(form): void {
        this.saving = true;
           if (this.source.id == null) {
               this.source.id = 0;
           }
             this._sourceService.createOrUpdateSource(this.source)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.source = this.eventOriginal;
                this.types = this.eventTypes;
                this.close(form);
                this.modalSave.emit(this.source);
            });
    }

    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }
    close(form): void {
        form.resetForm();
        this.active_source =[];
        this.SelectedTypeId = 0;
        this.SelectedTypeName = '';
        this.source = this.eventOriginal;
        this.types = this.eventTypes;
        this.modal.hide();
        this.active = false;
    }
}
