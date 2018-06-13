import { Component, Injector, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Http } from "@angular/http";
import { TokenAuthServiceProxy, CityServiceProxy, CityList,FileDto } from "shared/service-proxies/service-proxies";
import { ActivatedRoute } from "@angular/router";
import { CreateOrEditCityModalComponent } from './create-or-edit-city.component';
import { FileDownloadService } from "shared/utils/file-download.service";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';

@Component({
    templateUrl: './city.component.html',
    animations: [appModuleAnimation()]
})

export class CityBookComponent extends AppComponentBase implements AfterViewInit {

   @ViewChild('createCityModal') createCityModal: CreateOrEditCityModalComponent;

    advancedFiltersAreShown: boolean = false;
    filterText: string = '';
    selectedPermission: string = '';
    private _$cityTable: JQuery; 
	filedownload:FileDto=new FileDto();
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;
   
   constructor(
        injector: Injector,
        private _http: Http,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _cityProxyService: CityServiceProxy,
        private _fileDownloadService: FileDownloadService

    )
    {
        super(injector);
    }

        ngAfterViewInit(): void {

        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';

            this.getCity();
        
    }
 
    getCity(event?: LazyLoadEvent): void {
        let data;
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }
        this.primengDatatableHelper.showLoadingIndicator();

        this._cityProxyService.getCity(
            this.filterText,
            this.primengDatatableHelper.getSorting(this.dataTable),
            data,
            this.primengDatatableHelper.getSkipCount(this.paginator, event)
        ).subscribe(result => {
            this.primengDatatableHelper.totalRecordsCount = result.totalCount;
            this.primengDatatableHelper.records = result.items;
            this.primengDatatableHelper.hideLoadingIndicator();
        });
    }
    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage(),null);
    }
    createCity(): void {
        this.createCityModal.show();
    }

    editCity(data): void {
     this.createCityModal.show(data.id);
    }
 
    deleteCity(city: CityList): void {
        this.message.confirm(
           this.l('Are you sure to Delete the City', city.cityName),
            (isConfirmed) => {
                if (isConfirmed) {
                this._cityProxyService.getDeleteCity(city.id).subscribe(() => {
                            this.getCity();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                });
                }
            }
        );
    }

      exportToExcel(): void {
        this._cityProxyService.getCityToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }
    /*cityDelete(city?:any):void{
        
    } */
	
} 