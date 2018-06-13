import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CountryServiceProxy, CountryListDto,FileDto } from 'shared/service-proxies/service-proxies';
import { CreateCountryModalComponent } from './create-or-edit-country.component';
import { FileDownloadService } from "shared/utils/file-download.service";

import * as _ from 'lodash';
import * as moment from "moment";
@Component({
    templateUrl: './country.component.html',
    styleUrls: ['./country.component.less'],
    animations: [appModuleAnimation()]
})

export class CountryComponent extends AppComponentBase implements OnInit {

   @ViewChild('createCountryModal') createCountryModal: CreateCountryModalComponent;
   filter = '';
   countrys: CountryListDto[] = [];
   filedownload:FileDto=new FileDto();

   constructor(
        injector: Injector,
        private _countryService: CountryServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
    }

  ngOnInit(): void {
        this.getCountry();
    }
  createCountry(): void {
        this.createCountryModal.show(0);
    }

  editCountry(data): void {
        this.createCountryModal.show(data.id);
    }


  getCountry(): void {
     this._countryService.getCountry(this.filter).subscribe((result) => {
            this.countrys = result.items;
        });
 }
 deleteCountry(country: CountryListDto): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Country', country.countryName),
        isConfirmed => {
            if (isConfirmed) {
              this._countryService.getDeleteCountry(country.id).subscribe(() => {
                    this.getCountry();
                    this.notify.success(this.l('Successfully Deleted'));
                    _.remove(this.countrys, country); 
                });
            }
        }
    );
}

  exportToExcel(): void {
        this._countryService.getCountryToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    } 
}