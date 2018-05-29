import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ActivityListDto, ActivityServiceProxy } from "shared/service-proxies/service-proxies";

@Component({
    selector: 'createActivityModal',
    templateUrl: './create-or-edit-activity.component.html'
})
export class CreateActivityModalComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    activity: ActivityListDto = new ActivityListDto();
    eventOriginal = this.activity;

    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _activityService: ActivityServiceProxy
    ) {
        super(injector);
    }
 
    show(activityId?: number): void {
        this.activity = new ActivityListDto();
        this._activityService.getActivityForEdit(activityId).subscribe((result) => {
           if (result.activity != null) {
            this.activity = result.activity; 
            console.log(this.activity);
           }
             this.active = true;
             this.modal.show();
        });
    }


    save(): void {
        this.saving = true;
           if (this.activity.id == null) {
               this.activity.id = 0;
           }
             this._activityService.createOrUpdateActivity(this.activity)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.activity = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.activity);
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
