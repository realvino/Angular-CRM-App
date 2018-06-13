import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ViewServiceProxy, ViewInput, Datadto, Select2ServiceProxy, ColumnDto, ViewListDto } from 'shared/service-proxies/service-proxies';
export interface SelectOption{
    id?: number;
    text?: string;
 }

@Component({
    selector: 'ViewcreateModal',
    templateUrl: './createview.component.html'
})
export class ViewCreateComponent extends AppComponentBase {
 
    query: string;
    cities: { id: number; text: string; }[];
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    viewsInput: ViewInput = new ViewInput();
    views: ViewListDto = new ViewListDto();
    eventOriginal = this.views;
    dropdownList = [];
    selectedItems = [];
    dropdownSettings = {};
    active = false;
    saving = false;
    personDto: Datadto[];
    statusDto: Datadto[];
    dfilterDto: Datadto[];
    columnDto: ColumnDto[];
    person:Array<any>;
    status:Array<any>;
    dfilter:Array<any>;
  
    IsEquiry:boolean = true;
    enqStatus: { id: number; text: string; }[] = [
            { id: 1, text: 'Open' },
            { id: 2, text: 'Closed' },
            { id: 3, text: 'Won' },
            { id: 4, text: 'Lost' }
        ];
    constructor(
        injector: Injector,
        private _viewService: ViewServiceProxy,
        private _select2Service: Select2ServiceProxy

    ) {
        super(injector);
    }


show(views?: any): void {  
                 this.views = views; 
                 this.active = true;
                 this.modal.show();
    }

 save(): void {
             this.saving = true;
             this.views.isEditable = true;
             console.log(this.views);
             this._viewService.createView(this.views)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.views = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.views);
            });
    }
  
    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }

    close(): void {
        this.views = new ViewListDto();
        this.IsEquiry = true;
        this.modal.hide();
        this.active = false;
    }
}
