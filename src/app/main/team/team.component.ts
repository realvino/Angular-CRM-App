import { Component, Injector, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ActivatedRoute,Router } from "@angular/router";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { TeamServiceProxy,TeamListDto } from "shared/service-proxies/service-proxies";
import { CreateEditTeamComponent } from "app/main/team/create-edit-team.component";

@Component({
    templateUrl: './team.component.html',
    animations: [appModuleAnimation()]
})

export class TeamComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('createTeamModal') createTeamModal: CreateEditTeamComponent;
	@ViewChild('dataTable') dataTable: DataTable;
	@ViewChild('paginator') paginator: Paginator; 
   
    filter: string = '';
    
	teams: TeamListDto [] = [];

   constructor(
        injector: Injector,
        
        private _activatedRoute: ActivatedRoute,
		private route:Router,
        private _teamProxyService: TeamServiceProxy
    )
    {
        super(injector);
		//let d = abp.multiTenancy.getTenantIdCookie();
		//console.log(d);
    }

        ngAfterViewInit(): void {

        this.filter = this._activatedRoute.snapshot.queryParams['filter'] || '';

		}
	
	 getTeam(event?: LazyLoadEvent): void {
        let data;
        this.primengDatatableHelper.showLoadingIndicator();
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }

        this._teamProxyService.getTeam(this.filter)
            .subscribe((result) => {
				this.primengDatatableHelper.totalRecordsCount = result.items.length;
                this.primengDatatableHelper.records = result.items;
                this.primengDatatableHelper.hideLoadingIndicator();
				
            });

    }
   
 
    createteam(): void {
        this.createTeamModal.show();
    }

    editTeam(record): void {
		console.log(75,record);
     this.createTeamModal.show(record.id);
    }
 
    
 	deleteTeam(teams:TeamListDto):void{
		//console.log(data);
		this.message.confirm(
		 this.l('Are you sure to Delete the Team', teams.name),
		 (isConfirmed) => {
			if (isConfirmed) {
				this._teamProxyService.deleteTeam(teams.id)
                        .subscribe(result => {
							if(result){
							this.notify.success(this.l("Deleted Successfully"));	
							}
							else{
								this.getTeam();
							}
						});
			} 
			 
		 }
		);
	} 
	
} 