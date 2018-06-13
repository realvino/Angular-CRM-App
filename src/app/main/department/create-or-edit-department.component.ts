import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DepartmentServiceProxy, DepartmentListDto } from 'shared/service-proxies/service-proxies';

@Component({
    selector: 'createDepartmentModal',
    templateUrl: './create-or-edit-department.component.html'
})
export class CreateDepartmentModalComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    department: DepartmentListDto = new DepartmentListDto();
    eventOriginal = this.department;

    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _departmentService: DepartmentServiceProxy
    ) {
        super(injector);
    }


   show(departmentId?: number): void {
        this.department = new DepartmentListDto();
        this._departmentService.getDepartmentForEdit(departmentId).subscribe((result) => {
           if (result.departments != null) {
            this.department = result.departments;
           }
             this.active = true;
             this.modal.show();
        });
    }

 save(): void {
        this.saving = true;
           if (this.department.id == null) {
               this.department.id = 0;
           }
             this._departmentService.createOrUpdateDepartment(this.department)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.department = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.department);
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
