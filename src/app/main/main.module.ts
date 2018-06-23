import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/Core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ModalModule, TabsModule, TooltipModule, PopoverModule } from 'ngx-bootstrap';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { MainRoutingModule } from './main-routing.module';
import { CountoModule } from '@node_modules/angular2-counto';
import { SelectModule } from 'ng2-select';
import { EasyPieChartModule } from 'ng2modules-easypiechart';
import { CityBookComponent } from "app/main/city/city.component";
import { CountryComponent } from "app/main/country/country.component";
import { CreateCountryModalComponent } from "app/main/country/create-or-edit-country.component";
import { CreateOrEditLocationModalComponent } from "app/main/location/create-or-edit-location.component";
import { LocationComponent } from "app/main/location/location.component";
import { CreateOrEditCityModalComponent } from "app/main/city/create-or-edit-city.component";
import { ProductGroupComponent } from "app/main/productGroup/productGroup.component";
import { ProductSubGroupComponent } from "app/main/productSubGroup/productsubgroup.component";
import { CreateProductGroupModalComponent } from "app/main/productGroup/create-or-edit-productgroup.component";
import { CreateproductsubgroupModalComponent } from "app/main/productSubGroup/create-or-edit-productsubgroup.component";
import { RegionComponent } from "app/main/region/region.component"; 
import { CreateRegionModalComponent } from "app/main/region/createoreditregion.component";
import { CreateOrEditMileStoneModalComponent } from "app/main/mileStone/create-edit-mileStone.component";
import { ActivityComponent } from "app/main/activity/activity.component";
import { MileStoneComponent } from "app/main/mileStone/mileStone.component";
import { SourceComponent } from "app/main/source/source.component";
import { CreateSourceModalComponent } from "app/main/source/create-or-edit-source.component";
import { CreateActivityModalComponent } from "app/main/activity/create-or-edit-activity.component";
import { LeadTypeComponent } from "app/main/leadType/leadType.component";
import { LeadReasonComponent } from "app/main/leadReason/leadReason.component";
import { CreateLeadTypeModalComponent } from "app/main/leadType/create-edit.leadType.component";
import { CreateLeadReasonModalComponent } from "app/main/leadReason/create-edit.leadReason.component";
import { InquiryComponent } from "app/main/inquiry/inquiry.component";
import { AddressComponent } from "app/main/newCompany/address.component";
import { CreateInquiryComponent } from "app/main/inquiry/createOReditModal.component";
import { CreateDepartmentModalComponent } from "app/main/department/create-or-edit-department.component";
import { DepartmentComponent } from "app/main/department/department.component";
import { CreateInquiryModalComponent } from "app/main/inquiry/createORedit.component";
import { KanbanComponent } from "app/main/kanban/kanban.component";
import { CreateActivityEnqComponent } from "app/main/activity_enq/activity-enq.component";
import { newCompanyComponent } from "app/main/newCompany/newCompany.component";
import { ContactNewModelComponent } from "app/main/newContact/contact-model.component";
import { LinkedContactComponent } from "app/main/inquiry/linkedContact.component";
import { CreateOrEditNewInfoTypeComponent } from "app/main/newInfoType/createEditNewInfoType.component";
import { NewInfoTypeComponent } from "app/main/newInfoType/newInfoType.component";
import { CreateOrEditNewCompanyModalComponent } from "app/main/newCompany/create-or-edit-new-company.component";
import { CompanyComponentModel } from "app/main/newCompany/company.component";
import { newContactComponent } from "app/main/newContact/newContact.component";
import { NewCustomerTypeComponent } from "app/main/newCustomerType/newCustomerType.component";
import { CreateOrEditNewCustomerTypeComponent } from "app/main/newCustomerType/createEditNewCustomerType.component";
import { ViewLinkedContactComponent } from "app/main/inquiry/viewLinkedContact.component";
import { CreateOrEditContactNewModalComponent } from "app/main/newContact/create-edit-contact.component";
import { ContactAddressNewComponent } from "app/main/newContact/address.component";
import { ContactConComponent } from "app/main/newContact/contact.component";
import { CreateIncActivityModalComponent } from "app/main/inquiry/createActivityModelComponent";
import { KanbanStatusComponent } from "app/main/kanban/kanban.status.component";
import { JunkInquiryComponent } from "app/main/junk_inquiry/junk-inquiry.component";
import { LeadStatusComponent } from "app/main/leadStatus/LeadStatus.Component";
import { createLeadStatusModalComponent } from "app/main/leadStatus/create-or-edit-leadStatus.component";
import { IndustryComponent } from "app/main/industry/industry.component";
import { LeadInquiryComponent } from "app/main/inquiry/lead-inquiry.component";
import { CreateEnqNewCompanyModalComponent } from "app/main/inquiry/create-or-edit-new-company.component";
import { createCommentActivityModalComponent } from "app/main/activity_enq/createCommentActivityComponent";
import { LeadsDepartmentSelectComponent } from "app/main/leads/departmentSelect.component";
import { LeadsKanbanComponent } from "app/main/leads/kanban.component";
import { DepartmentSelectComponent } from "app/main/kanban/departmentSelect.component";
import { SalesInquiryComponent } from "app/main/inquiry/sales-inquiry.component";
import { CreateIndustryModalComponent } from "app/main/industry/create-or-edit-industry.component";
import { ProductComponent } from "app/main/product/product.component";
import { CreateEditProductComponent } from "app/main/product/create-or-edit-product.component";

import { DataTableModule, SharedModule, MultiSelectModule, OverlayPanelModule, ListboxModule } from 'primeng/primeng';
import { PaginatorModule } from 'primeng/primeng';
import { EditorModule } from 'primeng/primeng';
import { SlimScrollModule } from 'ng2-slimscroll';
import { MomentModule } from 'angular2-moment';
import { DragulaModule } from 'ng2-dragula';
import { FileUploadModule } from "ng2-file-upload";
import { CreateColorCodeComponent } from "app/main/colorCode/create-or-edit-color-code.component";
import { ColorCodeComponent } from "app/main/colorCode/color-code.component";
import { CreateDimensionComponent } from "app/main/dimension/create-or-edit-dimension.component";
import { DimensionComponent } from "app/main/dimension/dimension.component";
import { ProductTypeComponent } from "app/main/productType/product-type.component";
import { CreateProductTypeComponent } from "app/main/productType/create-or-edit-product-type.component";
/*import { CreateOrientationComponent } from "app/main/orientation/create-or-edit-orientation.component";
import { OrientationComponent } from "app/main/orientation/orientation.component";*/
import { CreatePriceLevelComponent } from "app/main/priceLevel/create-or-edit-price-level.component";
import { PriceLevelComponent } from "app/main/priceLevel/price-level.component";
import { EditPriceModalComponent } from "app/main/product/create-or-edit-price.component";

/*Product Attribute Component Start*/
import { ProductAttributeComponent } from "app/main/productAttribute/product-attribute.component";
import { CreateProductAttributeComponent } from 'app/main/productAttribute/create-or-edit-product-attribute.component';
/*Product Attribute Component End*/

/*Product Family Component Start*/
import { ProductFamilyComponent } from "app/main/productFamily/product-family.component";
import { CreateProductFamilyComponent } from "app/main/productFamily/create-or-edit-product-family.component";
/*Product Family Component End*/

/*Attribute Group Component Start*/
import { AttributeGroupComponent } from "app/main/attributeGroup/attributeGroup.component";
import { CreateAttributeGroupComponent } from "app/main/attributeGroup/create-or-edit-attributeGroup.component";
/*Attribute Group Component End*/

/*Product Specification Component Start*/
import { ProductSpecificationComponent } from "app/main/productSpecification/product-specification.component";
import { CreateProductSpecificationComponent } from "app/main/productSpecification/create-or-edit-product-specification.component";
/*Product Specification Component End*/

/*Collection Component Start*/
import { CreateCollectionComponent } from "app/main/collection/create-or-edit-collection.component";
import { CollectionComponent } from "app/main/collection/collection.component";
/*Collection Component End*/

/*Quatation Status Component Start*/
import { QuatationStatusComponent } from "app/main/quatationStatus/quatation-status.component";
import { CreateQuatationStatusComponent } from "app/main/quatationStatus/create-or-edit-quatation-status.component";
/*Quatation Status Component End*/

/*Quotation Component Start*/
import { CreateOrEditNewQuotationModalComponent } from "app/main/quotation/create-or-edit-new-quotation.component";
import { QuotationComponent } from "app/main/quotation/quotation.component";

// Quotation Edit Component
import { QuotationEditComponent } from "app/main/quotation/quotation_edit.component";

// Quotation Section Component
import { CreateQuotationSectionModalComponent } from "app/main/quotation/create-or-edit-quotation-section.component";

// Quotation Product Component
import { CreateQuotationProductModalComponent } from "app/main/quotation/create-or-edit-quotation-product.component";

// Product Import Component
import { ProductImportModalComponent } from "app/main/quotation/product-import-modal.component";

// Quotation Preview Component
import { QuotationPreviewModalComponent } from "app/main/quotation/quotation-preview.component";

// Unlock Product Change Component
import { ProductChangeModalComponent } from "app/main/quotation/unlock-product.component";
/*Quotation Component End*/

import { CreateOrEditNewEnQuotationModalComponent } from "app/main/quotation/create-or-edit-new-enquiry-quotation.component";
import { EnquiryQuotationsComponent } from 'app/main/inquiry/editQuotedModal.component';
import { TeamComponent } from 'app/main/team/team.component';
import { CreateEditTeamComponent } from 'app/main/team/create-edit-team.component';
import { CreateOrEditTempProductModalComponent } from 'app/main/temporaryProducts/create-or-edit-tempProducts.component';
import { ProductCategoryComponent } from 'app/main/productCategory/productCategory.Component';
import { CreateProductCategoryModalComponent } from 'app/main/productCategory/create-or-edit-productCategory.Component';
import { StageSelectComponent } from 'app/main/kanban/stage.component';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { OpportunitySourceComponent } from 'app/main/opportunitySource/opportunitySource.Component';
import { CreateOpportunitySourceModalComponent } from 'app/main/opportunitySource/create-or-edit-opportunitySource.Component';
import { WhyBafcoComponent } from 'app/main/whyBafco/whyBafco.Component';
import { CreateWhyBafcoModalComponent } from 'app/main/whyBafco/create-or-edit-whyBafco.Component';
import { EmailDomainComponent } from 'app/main/emailDomain/emailDomain.Component';
import { CreateEmailDomainModalComponent } from 'app/main/emailDomain/create-or-edit-emailDomain.Component';
import { ForecastComponent } from 'app/main/forecast/forecast.component';
import { MonthPicker } from 'app/main/monthPicker/month';
import { CreateJobActivityModalComponent } from 'app/main/inquiry/create-or-edit-jobActivity.Component';
import { JobActivityComponent } from 'app/main/activity_enq/jobActivityComponent';
import { RevisedQuotationComponent } from 'app/main/quotation/revisedQuotationComponent';
import { EnquiryStatusComponent } from '@app/main/enquiryStatus/EnquiryStatus.Component';
import { createEnquiryStatusModalComponent } from '@app/main/enquiryStatus/create-or-edit-enquiryStatus.component';
import { DiscountModalComponent } from '@app/main/quotation/discount.component';
import { ContactDesignationComponent } from '@app/main/contactDesignation/contactDesignation.component';
import { CreateEditContactDesignationComponent } from '@app/main/contactDesignation/create-or-edit-contactDesignation.component';
import { ViewComponent } from '@app/main/view/view.component';
import { CreateViewComponent } from '@app/main/view/create-or-edit-view.component';
import { Ng2MultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ViewReportComponent } from '@app/main/view/viewReport.component';
import { ForecastReportComponent } from "app/main/view/forecastReport.component";
import { CreationDateFilterComponent } from '@app/main/reportFilters/creationDateFilterModal.component';
import { StageFilterComponent } from '@app/main/reportFilters/stageFilterModal.component';
import { PercentageFilterComponent } from '@app/main/reportFilters/percentageFilterModal.component';
import { ActionDateFilterComponent } from '@app/main/reportFilters/actionDateFilterModal.component';
import { CoordinatorFilterComponent } from '@app/main/reportFilters/coordinatorFilterModal.component';
import { DeptFilterComponent } from '@app/main/reportFilters/deptFilterModal.component';
import { DesignerFilterComponent } from '@app/main/reportFilters/designerFilterModal.component';
import { SalesFilterComponent } from '@app/main/reportFilters/salesFilterModal.component';
import { StoneFilterComponent } from '@app/main/reportFilters/stoneFilterModal.component';
import { StatusFilterComponent } from '@app/main/reportFilters/statusFilterModal.component';
import { TeamFilterComponent } from '@app/main/reportFilters/teamFilterModal.component';
import { whybafcoFilterComponent } from '@app/main/reportFilters/whybafcoFilterModal.component';
import { CatagiriesFilterComponent } from '@app/main/reportFilters/catagiriesFilterModal.component';
import { ViewCreateComponent } from '@app/main/view/createview.component';
// import { CKEditorModule } from 'ng2-ckeditor';
import { Ng2Carousel3dModule }  from 'ng2-carousel-3d';
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { EditInquiryComponent } from '@app/main/inquiry/editInquiry.component';
import { CreateSalesInquiryComponent } from '@app/main/inquiry/createSalesInquiry.component';
import { ArchivedInquiryComponent } from '@app/main/inquiry/archivedInquiry.component';
import { CreateLineItemModalComponent } from '@app/main/lineItem/createORedit_lineItem.component';
import { LineItemComponent } from '@app/main/lineItem/lineItem.component';
import { ContactCompComponent } from '@app/main/newCompany/contact.component';
import { MdashboardComponent } from '@app/main/dashboard/mdashboard.component';

export function highchartsFactory() {
    const hc = require('highcharts');
    const dd = require('highcharts/modules/drilldown');
    const fu = require('highcharts/modules/funnel');
    dd(hc);
    fu(hc);
    return hc;
}
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        PopoverModule.forRoot(),
        AppCommonModule,
        UtilsModule,
        MainRoutingModule,
        CountoModule,
        EasyPieChartModule,
        SelectModule,
		DataTableModule,
        PaginatorModule,
		EditorModule,
		MomentModule,
		DragulaModule,
		ReactiveFormsModule,
        SlimScrollModule,
        FileUploadModule,
        CalendarModule,
        Ng2MultiSelectDropDownModule.forRoot(),
        SharedModule,
        MultiSelectModule,
        OverlayPanelModule,
        ListboxModule,
        Ng2Carousel3dModule,
        ChartModule
    ],
    declarations: [
        DashboardComponent,
        CityBookComponent,
        CountryComponent,
        CreateCountryModalComponent,
        LocationComponent,
        CreateOrEditLocationModalComponent,
        CreateOrEditCityModalComponent,
        ProductGroupComponent,
        CreateProductGroupModalComponent,
        ProductSubGroupComponent,
        CreateproductsubgroupModalComponent,
        RegionComponent,
        CreateRegionModalComponent,
        SourceComponent,
        CreateSourceModalComponent,
        MileStoneComponent,
        CreateOrEditMileStoneModalComponent,
        ActivityComponent,
        CreateActivityModalComponent,
        LeadTypeComponent,
        CreateLeadTypeModalComponent,
        LeadReasonComponent,
        CreateLeadReasonModalComponent,
        KanbanComponent,
		InquiryComponent,
		CreateInquiryModalComponent,
		CreateInquiryComponent,
		DepartmentComponent, 
        CreateDepartmentModalComponent,
        CreateActivityEnqComponent, 
        AddressComponent,
        newCompanyComponent,
        newContactComponent,      
        CompanyComponentModel,
        CreateOrEditNewCompanyModalComponent,
        NewCustomerTypeComponent,
        NewInfoTypeComponent,
        CreateOrEditNewCustomerTypeComponent,
        CreateOrEditNewInfoTypeComponent,
		LinkedContactComponent,
		ViewLinkedContactComponent,
		ContactNewModelComponent,
        CreateOrEditContactNewModalComponent,
        ContactConComponent,
        ContactCompComponent,
        ContactAddressNewComponent,
		CreateIncActivityModalComponent,
        CreateEnqNewCompanyModalComponent,
		createCommentActivityModalComponent,
        DepartmentSelectComponent,
		LeadsKanbanComponent,
		LeadsDepartmentSelectComponent,
		SalesInquiryComponent,
		LeadInquiryComponent,
        JunkInquiryComponent,
        LeadStatusComponent,
        createLeadStatusModalComponent,
        IndustryComponent, 
        CreateIndustryModalComponent,
        KanbanStatusComponent,
		ProductComponent,
        CreateEditProductComponent,
        PriceLevelComponent,
        CreatePriceLevelComponent,
        ProductTypeComponent,
        CreateProductTypeComponent,
        DimensionComponent,
        CreateDimensionComponent,
        ColorCodeComponent,
        CreateColorCodeComponent,
        EditPriceModalComponent,
        ProductAttributeComponent,
        CreateProductAttributeComponent, 
        ProductFamilyComponent,
        CreateProductFamilyComponent,
        AttributeGroupComponent,
        CreateAttributeGroupComponent,
        ProductSpecificationComponent,
        CreateProductSpecificationComponent,
        CollectionComponent,
        CreateCollectionComponent,
        QuatationStatusComponent,
        CreateQuatationStatusComponent,
        QuotationComponent,
        CreateOrEditNewQuotationModalComponent,
        QuotationEditComponent,
        CreateQuotationSectionModalComponent,
        CreateQuotationProductModalComponent,
        ProductImportModalComponent,
        QuotationPreviewModalComponent,
        ProductChangeModalComponent,
        CreateOrEditTempProductModalComponent,
        CreateOrEditNewEnQuotationModalComponent,
        EnquiryQuotationsComponent,
        TeamComponent,
        CreateEditTeamComponent,
        ProductCategoryComponent,
        CreateProductCategoryModalComponent,
        StageSelectComponent,
        OpportunitySourceComponent,
        CreateOpportunitySourceModalComponent,
        WhyBafcoComponent,
        CreateWhyBafcoModalComponent,
        EmailDomainComponent,
        CreateEmailDomainModalComponent,
        ForecastComponent,
        MonthPicker,
        CreateJobActivityModalComponent,
        JobActivityComponent,
        RevisedQuotationComponent,
        EnquiryStatusComponent,
        createEnquiryStatusModalComponent,
        DiscountModalComponent,
        ContactDesignationComponent,
        CreateEditContactDesignationComponent,
        CreateViewComponent,
        ViewComponent,
        ViewReportComponent,
        ForecastReportComponent,
        CreationDateFilterComponent,
        StageFilterComponent,
        PercentageFilterComponent,
        ActionDateFilterComponent,
        CatagiriesFilterComponent,
        CoordinatorFilterComponent,
        DeptFilterComponent,
        DesignerFilterComponent,
        PercentageFilterComponent,
        SalesFilterComponent,
        StatusFilterComponent,
        StoneFilterComponent,
        TeamFilterComponent,
        whybafcoFilterComponent,
        ViewCreateComponent,
        EditInquiryComponent,      
        CreateSalesInquiryComponent,
        ArchivedInquiryComponent,
        CreateLineItemModalComponent,
        LineItemComponent,
        MdashboardComponent

    ],
    providers: [{
        provide: HighchartsStatic,
        useFactory: highchartsFactory
      }]
})
export class MainModule { }