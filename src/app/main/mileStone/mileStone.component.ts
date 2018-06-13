import { Component, Injector, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Http } from "@angular/http";
import { TokenAuthServiceProxy, MileStoneServiceProxy, MileStoneList } from "shared/service-proxies/service-proxies";
import { ActivatedRoute } from "@angular/router";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { CreateOrEditMileStoneModalComponent } from "app/main/mileStone/create-edit-mileStone.component";
import { FileDownloadService } from "shared/utils/file-download.service";


@Component({
    templateUrl: './mileStone.component.html',
    animations: [appModuleAnimation()]
})

export class MileStoneComponent extends AppComponentBase implements AfterViewInit {

   @ViewChild('createMileStoneModal') createMileStoneModal: CreateOrEditMileStoneModalComponent;
   @ViewChild('dataTable') dataTable: DataTable;
   @ViewChild('paginator') paginator: Paginator;

    advancedFiltersAreShown: boolean = false;
    filterText: string = '';
    selectedPermission: string = '';

   constructor(
        injector: Injector,
        private _http: Http,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _mileStoneProxyService: MileStoneServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
    }

        ngAfterViewInit(): void {

        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
		}
 
    getMileStone(): void {
        //this._$mileStoneTable.jtable('load');
    }
	reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage(),null);
    }
	 getData(event?: LazyLoadEvent): void {
        let data;
        this.primengDatatableHelper.showLoadingIndicator();
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }

        this._mileStoneProxyService.getMileStone(this.filterText,
            this.primengDatatableHelper.getSorting(this.dataTable),data,
            this.primengDatatableHelper.getSkipCount(this.paginator, event))
            .subscribe((result) => {
                this.primengDatatableHelper.totalRecordsCount = result.totalCount;
                this.primengDatatableHelper.records = result.items;
                this.primengDatatableHelper.hideLoadingIndicator();
            });

    }
    createMileStone(): void {
        this.createMileStoneModal.show();
    }

    editMileStone(data): void {
        this.createMileStoneModal.show(data.id);
    }
 
    deleteMileStone(MileStone: MileStoneList): void {
        this.message.confirm(
            this.l('Are you sure to Delete the MileStone', MileStone.mileStoneName),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._mileStoneProxyService.getDeleteMileStone(MileStone.id)
                        .subscribe(() => {
                            this.getMileStone();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }
    exportExcel():void{
        this._mileStoneProxyService.getMileStoneToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }
/*deleteMileStone(mileStone: MileStoneList): void {
    this.message.confirm(
        this.l('Are you sure to Delete the MileStone', mileStone.mileStoneName),
        isConfirmed => {
            if (isConfirmed) {
              this._mileStoneProxyService.getMappedMileStone(mileStone.id).subscribe(result=>{
                 if(result)
                  {
                    this.notify.error(this.l('This mileStone has used, So could not delete'));
                  }else{
                    this.mileStoneDelete(mileStone);
                  }
              });
            }
        }
    );
}
  mileStoneDelete(mileStone_data?:any):void{
    this._mileStoneProxyService.getDeleteMileStone(mileStone_data.id).subscribe(() => {
                    this.notify.success(this.l('Successfully Deleted'));
                   // _.remove(this.countrys, country_data); 
                });
  }*/

} 