import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { UserDesignationServiceProxy, UserDesignationListDto} from 'shared/service-proxies/service-proxies';

@Component({
    selector: 'createUserDesignationModal',
    templateUrl: './create-or-edit-userDesignation.component.html'
})
export class CreateUserDesignationComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    userdesignation: UserDesignationListDto = new UserDesignationListDto();
    eventOriginal = this.userdesignation;

    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _userDesignationService: UserDesignationServiceProxy,
        
    ) {
        super(injector);
    }


   show(userdesignaionId?: number): void {
        this.userdesignation = new UserDesignationListDto();
        this._userDesignationService.getUserDesignationForEdit(userdesignaionId).subscribe((result) => {
           if (result.users != null) {
            this.userdesignation = result.users;
           }
           console.log(1,this.userdesignation);
             this.active = true;
             this.modal.show();
        });
    }

 save(): void {
        this.saving = true;
           if (this.userdesignation.id == null) {
               this.userdesignation.id = 0;
           }
           
             this._userDesignationService.createOrUpdateUserDesignation(this.userdesignation)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.userdesignation = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.userdesignation);
            });
    }

    onShown(): void {
        //$(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.modal.hide();
        this.active = false;
    }
}
