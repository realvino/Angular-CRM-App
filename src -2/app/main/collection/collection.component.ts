import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CollectionServiceProxy, CollectionListDto,FileDto } from 'shared/service-proxies/service-proxies';
import { CreateCollectionComponent } from './create-or-edit-collection.component';
import { FileDownloadService } from "shared/utils/file-download.service";

import * as _ from 'lodash';
import * as moment from "moment";
@Component({
    templateUrl: './collection.component.html',
    styleUrls: ['./collection.component.less'],
    animations: [appModuleAnimation()]
})

export class CollectionComponent extends AppComponentBase implements OnInit {

   @ViewChild('createCollectionModal') createCollectionModal: CreateCollectionComponent;
   filter = '';
   collections: CollectionListDto[] = [];
   filedownload:FileDto=new FileDto();

   constructor(
        injector: Injector,
        private _collectionService: CollectionServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
    }

  ngOnInit(): void {
        this.getCollection();
  }
  createCollection(): void {
        this.createCollectionModal.show(0);
  }

  editCollection(data): void {
        this.createCollectionModal.show(data.id);
  }


  getCollection(): void {
     this._collectionService.getCollection(this.filter).subscribe((result) => {
            this.collections = result.items;
        });
 }
  deleteCollection(collection: CollectionListDto): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Collection', collection.collectionCode),
        isConfirmed => {
            if (isConfirmed) {
              this._collectionService.getDeleteCollection(collection.id).subscribe(() => {
                    this.notify.success(this.l('Successfully Deleted'));
                    _.remove(this.collections, collection); 
                });
              
            }
        }
    );
  }
  exportExcel():void{
        this._collectionService.getCollectionToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }
}