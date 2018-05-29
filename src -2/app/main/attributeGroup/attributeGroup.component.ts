import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AttributeGroupServiceProxy, AttributeGroupListDto,FileDto } from 'shared/service-proxies/service-proxies';
import { CreateAttributeGroupComponent } from './create-or-edit-attributeGroup.component';
import { FileDownloadService } from "shared/utils/file-download.service";

import * as _ from 'lodash';
import * as moment from "moment";
@Component({
    templateUrl: './attributeGroup.component.html',
    styleUrls: ['./attributeGroup.component.less'],
    animations: [appModuleAnimation()]
})

export class AttributeGroupComponent extends AppComponentBase implements OnInit {

   @ViewChild('createAttributeGroupModal') createAttributeGroupModal: CreateAttributeGroupComponent;
   filter = '';
   attributeGroups: AttributeGroupListDto[] = [];
   filedownload:FileDto=new FileDto();

   constructor(
        injector: Injector,
        private _attributeGroupService: AttributeGroupServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
    }

  ngOnInit(): void {
        this.getAttributeGroup();
  }
  createAttributeGroup(): void {
        this.createAttributeGroupModal.show(0);
  }

  editAttributeGroup(data): void {
        this.createAttributeGroupModal.show(data.id);
  }

  getAttributeGroup(): void {
     this._attributeGroupService.getAttributeGroup(this.filter).subscribe((result) => {
            this.attributeGroups = result.items;
        });
 }
 deleteAttributeGroup(attribute_group: AttributeGroupListDto): void {
    this.message.confirm(
        this.l('Are you sure to Delete the AttributeGroup', attribute_group.attributeGroupName),
        isConfirmed => {
            if (isConfirmed) {
              this._attributeGroupService.getDeleteAttributeGroup(attribute_group.id).subscribe(() => {
                    this.notify.success(this.l('Successfully Deleted'));
                    _.remove(this.attributeGroups, attribute_group); 
                });
            }
        }
    );
 }
 exportExcel():void{
        this._attributeGroupService.getAttributeGroupToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }
}