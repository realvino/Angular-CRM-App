import { Component, Injector, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Http } from "@angular/http";
import { InquiryServiceProxy, Select2ServiceProxy, Datadtos } from "shared/service-proxies/service-proxies";
import { ActivatedRoute,Router } from "@angular/router";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { CreateJobActivityModalComponent } from '@app/main/inquiry/create-or-edit-jobActivity.Component';

export interface SelectOption{
    id?: number;
    text?: string;
 }

@Component({
    templateUrl: './jobActivityComponent.html',
    //styleUrls :['./quotation.component.less'],
    animations: [appModuleAnimation()]
})

export class JobActivityComponent extends AppComponentBase implements AfterViewInit {
     
    filterText: string = '';
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;
    @ViewChild('createJobActivityModal') createJobActivityModal:CreateJobActivityModalComponent;

    active_designer:SelectOption[] = [];
    designerId: number;
    designer:Array<any>;
    designerList:Datadtos[];
    
   constructor(
        injector: Injector,
        private _http: Http,
        private _activatedRoute: ActivatedRoute,
        private router:Router,
        private _inquiryServiceProxy: InquiryServiceProxy,
        private _select2Service: Select2ServiceProxy
        
    )
    {
        super(injector);
    }

    ngAfterViewInit(): void {
        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
        this._select2Service.getDesigners().subscribe((result) =>{
            if(result.select3data != null){
               this.designerList = result.select3data;
               this.designer = [];
               this.designerList.forEach((item:{id:number, name:string})=>{
                    this.designer.push({
                        id: item.id,
                        text: item.name
                    });
               });
               if(this.designer.length == 1){
                   this.active_designer = [{ id: this.designer[0].id, text: this.designer[0].text}];
                   this.designerId = this.designer[0].id;
               }
            }
        });
        this.getJobActivity();
    }
    selectedDesigner(value:any):void {
        this.active_designer = [{id: value.id, text: value.text}];
        this.designerId = value.id;
        this.getJobActivity();
      }
      refreshDesigner(value:any):void{
      }
      removedDesigner(value:any):void {
          this.designerId = 0;
          this.active_designer = [];
          this.getJobActivity();
      }
    getJobActivity(event?: LazyLoadEvent): void {
        let data;
        
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }
        this.primengDatatableHelper.showLoadingIndicator();

        this._inquiryServiceProxy.getOverallJobActivity(
            this.filterText,this.designerId,
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
    openJobActivity(data): void {
        this.createJobActivityModal.show(data.id,data.designerId,data.inquiryId);
    }
    editJobActivity(data): void {
        console.log(data);
        if(data.inquiryId > 0)
        {
          this.router.navigate(["/app/main/sales-enquiry",data.inquiryId]);
        }
        else{
            this.notify.warn(this.l('Cannot Edit'));
        }
      
    }
    
}