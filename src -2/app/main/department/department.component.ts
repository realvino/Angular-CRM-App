import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DepartmentServiceProxy, DepartmentListDto } from 'shared/service-proxies/service-proxies';
import { CreateDepartmentModalComponent } from './create-or-edit-department.component';
import { FileDownloadService } from "shared/utils/file-download.service";
import * as _ from 'lodash';
import * as moment from "moment";
@Component({
    templateUrl: './department.component.html',
    styleUrls: ['./department.component.less'],
    animations: [appModuleAnimation()]
})

export class DepartmentComponent extends AppComponentBase implements OnInit {

   @ViewChild('createDepartmentModal') createDepartmentModal: CreateDepartmentModalComponent;
   filter = '';
   departments: DepartmentListDto[] = [];

   constructor(
        injector: Injector,
        private _departmentService: DepartmentServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
    }

  ngOnInit(): void {
        this.getDepartment();
    }
  createDepartment(): void {
        this.createDepartmentModal.show(0);
    }

  editDepartment(data): void {
        this.createDepartmentModal.show(data.id);
    }


  getDepartment(): void {
     this._departmentService.getDepartment(this.filter).subscribe((result) => {
            this.departments = result.items;
        });
 }
 deleteDepartment(department: DepartmentListDto): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Department', department.depatmentName),
        isConfirmed => {
            if (isConfirmed) {
                this._departmentService.getDeleteDepartment(department.id).subscribe(() => {
                    this.notify.info(this.l('SuccessfullyDeleted'));
                    _.remove(this.departments, department); 
                });
            }
        }
    );
}

    exportExcel():void{
        this._departmentService.getDepartmentToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }


    /*deleteDepartment(department: DepartmentListDto): void {
        this.message.confirm(
            this.l('Are you sure to Delete the Department', department.depatmentName),
            isConfirmed => {
                if (isConfirmed) {
                  this._departmentService.getMappedDepartment(department.id).subscribe(result=>{
                     if(result)
                      {
                        this.notify.error(this.l('This department has used, So could not delete'));
                      }else{
                        this.departmentDelete(department);
                      }
                  });
                }
            }
        );
    }
      departmentDelete(department_data?:any):void{
        this._departmentService.getDeleteDepartment(department_data.id).subscribe(() => {
                        this.notify.success(this.l('Successfully Deleted'));
                        _.remove(this.departments, department_data);
                    });
      }*/

}