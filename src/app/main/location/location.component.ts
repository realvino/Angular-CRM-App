import { Component, Injector, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { TokenAuthServiceProxy, LocationServiceProxy, LocationListDto } from "shared/service-proxies/service-proxies";
import { CreateOrEditLocationModalComponent } from './create-or-edit-location.component';
import * as _ from 'lodash';
import * as moment from "moment";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
@Component({
    templateUrl: './location.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]})

export class LocationComponent extends AppComponentBase implements AfterViewInit {

   @ViewChild('createLocationModal') createLocationModal: CreateOrEditLocationModalComponent;

    advancedFiltersAreShown: boolean = false;
    filterText: string = '';
    selectedPermission: string = '';
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;

   constructor(
        injector: Injector,
        private _http: Http,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _locationProxyService: LocationServiceProxy,

    ) 
    {
        super(injector);
    }

    
        ngAfterViewInit(): void {

        this.getLocation();
    }
 
    getLocation(event?: LazyLoadEvent): void {
       let data;
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }
        this.primengDatatableHelper.showLoadingIndicator();

        this._locationProxyService.getLocation(
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
 
    createLocation(): void {
        this.createLocationModal.show();
    }

    editLocation(data): void {
     this.createLocationModal.show(data.id); 
    }
 
    deleteLocation(location: LocationListDto): void {
        this.message.confirm(
            this.l('Are you sure to Delete the Location', location.locationName),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._locationProxyService.getDeleteLocation(location.id)
                        .subscribe(() => {
                            this.getLocation();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }
} 