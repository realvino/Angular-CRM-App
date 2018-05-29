import { Component, Injector, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Http } from "@angular/http";
import { TokenAuthServiceProxy, NewCompanyContactServiceProxy, NewCompanyListDto } from "shared/service-proxies/service-proxies";
import { ActivatedRoute,Router } from "@angular/router";
import { CreateOrEditNewCompanyModalComponent } from "app/main/newCompany/create-or-edit-new-company.component";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';

@Component({
    templateUrl: './company.component.html',
    animations: [appModuleAnimation()]
})

export class CompanyComponentModel extends AppComponentBase implements AfterViewInit {

    @ViewChild('createNewCompanyModal') createNewCompanyModal: CreateOrEditNewCompanyModalComponent;
    //@ViewChild('createContactModal') createContactModal: CreateOrEditContactModalComponent;

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
        private route:Router,
        private _companyServiceProxy: NewCompanyContactServiceProxy
    )
    {
        super(injector);
    }

        ngAfterViewInit(): void {

        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';

            this.getCompany();
        
    }
 
    getCompany(event?: LazyLoadEvent): void {
        let data;
        
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }
        this.primengDatatableHelper.showLoadingIndicator();

        this._companyServiceProxy.getCompanys(
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
    createCompany(): void {
        this.createNewCompanyModal.show(0);
    }

    editCompany(data): void {
        this.route.navigate(['app/main/company/'+data.id,0]);
    }
 
    deleteCompany(company: NewCompanyListDto): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Company', company.companyName),
        isConfirmed => {
            if (isConfirmed) {
              this._companyServiceProxy.getDeleteCompany(company.id).subscribe(() => {
                    this.getCompany();
                    this.notify.success(this.l('Successfully Deleted'));
                });
            }
        }
    );
}
}