import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ContactDesignationServiceProxy, ContactDesignationInput,FileDto } from 'shared/service-proxies/service-proxies';
import { FileDownloadService } from "shared/utils/file-download.service";
import * as _ from 'lodash';
import * as moment from "moment";
import { CreateEditContactDesignationComponent } from '@app/main/contactDesignation/create-or-edit-contactDesignation.component';

@Component({
    templateUrl: './contactDesignation.component.html',
    styleUrls: ['./contactDesignation.component.less'],
    animations: [appModuleAnimation()]
})

export class ContactDesignationComponent extends AppComponentBase implements OnInit {

   @ViewChild('contactDesignationModal') contactDesignationModal: CreateEditContactDesignationComponent;
   filter = '';
   contactDesignations: ContactDesignationInput[] = [];
   filedownload:FileDto=new FileDto();

   constructor(
        injector: Injector,
        private _contactDesignationService: ContactDesignationServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
    }

  ngOnInit(): void {
        this.getContactDesignation();
  }
  createContactDesignation(): void {
        this.contactDesignationModal.show(0);
  }

  editContactDesignation(data): void {
        this.contactDesignationModal.show(data.id);
  }

  getContactDesignation(): void {
    this._contactDesignationService.getContactDesignation(this.filter).subscribe((result) => {
        this.contactDesignations = result.items;
    });
  }

  deleteContactDesignation(designation: ContactDesignationInput): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Contact Designation', designation.desiginationName),
        isConfirmed => {
            if (isConfirmed) {
              this._contactDesignationService.getDeleteContactDesignation(designation.id).subscribe(() => {
                    this.notify.success(this.l('Deleted Successfully'));
                    _.remove(this.contactDesignations, designation); 
                });
              
            }
        }
    );
  }
  exportExcel():void{
    this._contactDesignationService.getContactDesignationToExcel()
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
    });
  }

}