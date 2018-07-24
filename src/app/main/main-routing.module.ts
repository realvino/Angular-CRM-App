import { NgModule } from '@angular/core';
import { RouterModule,Router } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CityBookComponent } from "app/main/city/city.component";
import { CountryComponent } from "app/main/country/country.component";
import { LocationComponent } from "app/main/location/location.component";
import { ProductGroupComponent } from "app/main/productGroup/productGroup.component";
import { ProductSubGroupComponent } from "app/main/productSubGroup/productsubgroup.component";
import { RegionComponent } from "app/main/region/region.component";
//import { CompanyComponent } from "app/main/company/company.component";
import { SourceComponent } from "app/main/source/source.component";
import { MileStoneComponent } from "app/main/mileStone/mileStone.component";
import { IndustryComponent } from "app/main/industry/industry.component";
import { ActivityComponent } from "app/main/activity/activity.component";
import { LeadTypeComponent } from "app/main/leadType/leadType.component";
import { LeadStatusComponent } from "app/main/leadStatus/LeadStatus.Component";
import { KanbanComponent } from "app/main/kanban/kanban.component";
import { CreateInquiryComponent } from "app/main/inquiry/createOReditModal.component";
import { LeadReasonComponent } from "app/main/leadReason/leadReason.component";
import { InquiryComponent } from "app/main/inquiry/inquiry.component";
import { DepartmentComponent } from "app/main/department/department.component";
import { CreateActivityEnqComponent } from "app/main/activity_enq/activity-enq.component";
import { NewCustomerTypeComponent } from "app/main/newCustomerType/newCustomerType.component";
import { NewInfoTypeComponent } from "app/main/newInfoType/newInfoType.component";
import { newCompanyComponent } from "app/main/newCompany/newCompany.component";
import { CompanyComponentModel } from "app/main/newCompany/company.component";
import { ContactNewModelComponent } from "app/main/newContact/contact-model.component";
import { newContactComponent } from "app/main/newContact/newContact.component";
import { JunkInquiryComponent } from "app/main/junk_inquiry/junk-inquiry.component";
import { LeadsKanbanComponent } from "app/main/leads/kanban.component";
import { LeadInquiryComponent } from "app/main/inquiry/lead-inquiry.component"; 
import { SalesInquiryComponent } from "app/main/inquiry/sales-inquiry.component";
import { ProductComponent } from "app/main/product/product.component";
import { CreateEditProductComponent } from "app/main/product/create-or-edit-product.component";
import { PriceLevelComponent } from "app/main/priceLevel/price-level.component";
// import { OrientationComponent } from "app/main/orientation/orientation.component";
import { ProductTypeComponent } from "app/main/productType/product-type.component";
import { DimensionComponent } from "app/main/dimension/dimension.component";
import { ColorCodeComponent } from "app/main/colorCode/color-code.component";

import { ProductAttributeComponent } from "app/main/productAttribute/product-attribute.component";

import { ProductFamilyComponent } from "app/main/productFamily/product-family.component";

import { AttributeGroupComponent } from "app/main/attributeGroup/attributeGroup.component";

import { ProductSpecificationComponent } from "app/main/productSpecification/product-specification.component";

import { CollectionComponent } from "app/main/collection/collection.component";

import { QuatationStatusComponent } from "app/main/quatationStatus/quatation-status.component";

import { QuotationComponent } from "app/main/quotation/quotation.component";

import { QuotationEditComponent } from "app/main/quotation/quotation_edit.component";
import { EnquiryQuotationsComponent } from 'app/main/inquiry/editQuotedModal.component';
import { TeamComponent } from 'app/main/team/team.component';
import { ProductCategoryComponent } from 'app/main/productCategory/productCategory.Component';
import { OpportunitySourceComponent } from 'app/main/opportunitySource/opportunitySource.Component';
import { WhyBafcoComponent } from 'app/main/whyBafco/whyBafco.Component';
import { EmailDomainComponent } from 'app/main/emailDomain/emailDomain.Component';
import { ForecastComponent } from 'app/main/forecast/forecast.component';
import { JobActivityComponent } from 'app/main/activity_enq/jobActivityComponent';
import { RevisedQuotationComponent } from 'app/main/quotation/revisedQuotationComponent';
import { EnquiryStatusComponent } from '@app/main/enquiryStatus/EnquiryStatus.Component';
import { ContactDesignationComponent } from '@app/main/contactDesignation/contactDesignation.component';
import { ViewComponent } from '@app/main/view/view.component';
import { ViewReportComponent } from '@app/main/view/viewReport.component';
import { ForecastReportComponent } from "app/main/view/forecastReport.component";
import { EditInquiryComponent } from '@app/main/inquiry/editInquiry.component';
import { CreateSalesInquiryComponent } from '@app/main/inquiry/createSalesInquiry.component';
import { ArchivedInquiryComponent } from '@app/main/inquiry/archivedInquiry.component';
import { CreateInquiryModalComponent } from '@app/main/inquiry/createORedit.component';
import { MdashboardComponent } from '@app/main/dashboard/mdashboard.component';
import { FinishedComponent } from '@app/main/finished/finishedComponent';
import { DefaultDashboardComponent } from '@app/main/dashboard/defaultdashboard.component';
import { DesignerDashboardComponent } from '@app/main/dashboard/designerdashboard.component';
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
               children: [
                    { path: 'salesdashboard', component: DashboardComponent, data: { permission: 'Pages.Tenant.Dashboard.Sales'}},
                    { path: 'designerdashboard', component: DesignerDashboardComponent, data: { permission: 'Pages.Tenant.Dashboard.Designer'}},
                    { path: 'dashboard', component: DefaultDashboardComponent, data: { permission: 'Pages.Tenant.Dashboard'}},
                    { path: 'marketingdashboard', component: MdashboardComponent, data: { permission: 'Pages.Tenant.Dashboard.Marketing'}},
                    { path: 'city', component: CityBookComponent,data: { permission: 'Pages.Tenant.Geography.City' }},
                    { path: 'country', component: CountryComponent, data: { permission: 'Pages.Tenant.Geography.Country' }},
                    { path: 'location', component: LocationComponent, data: { permission: 'Pages.Tenant.Geography.Location' }},
                    { path: 'product', component: ProductComponent, data: { permission: "Pages.Tenant.ProductFamily.Products" }},
                    { path: 'productGroup', component: ProductGroupComponent},
                    { path: 'finish', component: FinishedComponent},
                    // { path: 'productSubGroup', component: ProductSubGroupComponent, data: { permission: 'Pages.Tenant.ProductFamily.ProductSubGroup' }},
                     { path: 'region', component: RegionComponent, data: { permission: 'Pages.Tenant.Geography.Region' }},
                   // { path: 'newcompany', component: CompanyComponent, data: { permission: 'Pages.Tenant.AddressBook.Company' }},
                     { path: 'source', component: SourceComponent, data: { permission: 'Pages.Tenant.AddressBook.Contact' }},
                     { path: 'kanbanMileStone', component: MileStoneComponent },
					 { path: 'industry', component: IndustryComponent },
                     { path: 'activity', component: ActivityComponent },
                     { path: 'leadCategory', component: LeadTypeComponent },
                     { path : 'openEnquiry_quotation/:id/:enq_id', component : EnquiryQuotationsComponent },
                    //  { path: 'kanban', component: KanbanComponent,
					// children: [
					//   { path: ':id', component: CreateInquiryComponent }
					// ]},
                    { path: 'lostReason', component: LeadReasonComponent },
					// { path: 'enquiry', component: InquiryComponent,
                    // children: [
                    //   { path: ':id', component: CreateInquiryComponent }
                    // ] },
                     { path: 'division', component: DepartmentComponent},
					 { path: 'activity-enq', component: CreateActivityEnqComponent },
                    { path: 'newCustomerType', component: NewCustomerTypeComponent},
                    { path: 'newInfoType', component: NewInfoTypeComponent},
                    { path: 'company/:id/:enId',component:newCompanyComponent},
                    { path: 'company', component: CompanyComponentModel, data: { permission: 'Pages.Tenant.AddressBook.Company' }},
                    { path: 'contact', component: ContactNewModelComponent, data: { permission: 'Pages.Tenant.AddressBook.Contact' }},
                    { path: 'contact/:id/:enqId', component:newContactComponent },
                    { path: 'company/contact/:id/:enqId', component:newContactComponent },
					// { path: 'junk-enquiry', component: JunkInquiryComponent,children: [{ path: ':id', component: CreateInquiryComponent }]}, 
                    // { path: 'sales-enquiry', component: LeadsKanbanComponent,
                    // children: [
                    //     { path: ':id', component: CreateInquiryComponent },
                    //     { path: ':id/:enq_id', component: EnquiryQuotationsComponent }
                    //   ]},
                    // { path: 'sales-enquiry', component: LeadsKanbanComponent,children: [{ path: ':id/:enq_id', component: EnquiryQuotationsComponent }]},
                    // { path: 'leads', component: LeadInquiryComponent,children: [{ path: ':id', component: CreateInquiryComponent }]},
                    // { path: 'sales-grid', component: SalesInquiryComponent,children: [{ path: ':id', component: CreateInquiryComponent }]},
                    { path: 'pricelist', component: PriceLevelComponent},
                    { path: 'kanbanStage', component: EnquiryStatusComponent },
                    { path: 'leadStatus', component: LeadStatusComponent },
                    /*{ path: 'orientation', component : OrientationComponent},
                    { path: 'product-type', component: ProductTypeComponent},
                    { path: 'diemension', component: DimensionComponent},
                    { path: 'color-code', component: ColorCodeComponent}*/   
                    { path : 'product-attribute' , component: ProductAttributeComponent},
                    { path: 'product-family', component: ProductFamilyComponent},
                    { path: 'attribute-group', component: AttributeGroupComponent},
                    { path: 'product-specification', component : ProductSpecificationComponent},
                    { path: 'collection', component : CollectionComponent},
                    { path : 'quotation-status', component : QuatationStatusComponent },
                    { path : 'quotation', component : QuotationComponent },
                    { path : 'quotation/:id', component : QuotationEditComponent },
                    { path : 'enquiry_quotation/:id/:enq_id', component : EnquiryQuotationsComponent },
                    { path: 'team', component: TeamComponent },
                    { path: 'productCategory', component: ProductCategoryComponent },
                    { path: 'opportunitySource', component: OpportunitySourceComponent },
                    { path: 'whyBafco', component: WhyBafcoComponent },
                    { path: 'emailDomain', component: EmailDomainComponent },
                    // { path : 'openquotation/:id', component : QuotationEditComponent },
                    // { path : 'sales-enquiry/:id/:enq_id', component : EnquiryQuotationsComponent },
                    { path: 'jobActivity', component: JobActivityComponent},
                    { path: 'contactDesignation', component: ContactDesignationComponent },
                    { path: 'view', component: ViewComponent },
                    { path: 'viewReport', component: ViewReportComponent},
                    { path: 'forecastReport', component: ForecastReportComponent},
                    // { path: 'forecast', component: ForecastComponent, children: [{ path: ':id', component: CreateInquiryComponent }]},
                    { path: 'kanban', component: KanbanComponent },
                    { path: 'kanban/:id', component: EditInquiryComponent },
                    { path: 'enquiry', component: InquiryComponent }, 
                    { path: 'enquiry/:id', component: EditInquiryComponent },
                    { path: 'junk-enquiry', component: JunkInquiryComponent}, 
                    { path: 'junk-enquiry/:id', component: EditInquiryComponent }, 
                    { path: 'sales-enquiry', component: LeadsKanbanComponent}, 
                    { path: 'sales-enquiry/:id', component: EditInquiryComponent}, 
                    { path: 'sales-enquiry/:id/:enq_id', component: QuotationEditComponent},
                    { path: 'leads', component: LeadInquiryComponent}, 
                    { path: 'leads/:id', component: EditInquiryComponent },
                    { path: 'sales-grid', component: SalesInquiryComponent}, 
                    { path: 'sales-grid/:id', component: EditInquiryComponent },
                    { path : 'quotation/:id/:enq_id', component : QuotationEditComponent },
                    { path : 'openquotation/:id/:enq_id', component : QuotationEditComponent },
                    { path: 'forecast', component: ForecastComponent }, 
                    { path: 'salesLead', component: CreateSalesInquiryComponent},
                    { path: 'enquiry-create', component: CreateInquiryModalComponent},
                    { path: 'archivedEnquiry/:id', component: ArchivedInquiryComponent},
                    { path: 'forecast/:id', component: EditInquiryComponent }]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MainRoutingModule {}