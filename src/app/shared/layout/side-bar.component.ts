import { Component, Injector } from '@angular/core';
import { SideBarMenu } from './side-bar-menu';
import { SideBarMenuItem } from './side-bar-menu-item';

import { PermissionCheckerService } from '@abp/auth/permission-checker.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppSessionService } from '@shared/common/session/app-session.service';

@Component({
    templateUrl: './side-bar.component.html',
    selector: 'side-bar'
})
export class SideBarComponent extends AppComponentBase {
    data: string = '';
    constructor(
        injector: Injector,
        public permission: PermissionCheckerService,
        private _appSessionService: AppSessionService) {
        super(injector);
    }

    menu: SideBarMenu = new SideBarMenu("MainMenu", "MainMenu", [
        new SideBarMenuItem("Dashboard",'',"Pages.Administration.Host.Dashboard", "icon-home", "/app/admin/hostDashboard"),
        new SideBarMenuItem("Dashboard",'', "Pages.Tenant.Dashboard", "icon-home", "",[
            new SideBarMenuItem("Marketing Dashboard",'', "Pages.Tenant.Dashboard", "fa fa-dashboard", ""),
            new SideBarMenuItem("Sales Dashboard",'', "Pages.Tenant.Dashboard", "fa fa-shopping-cart", "/app/main/dashboard"),  
        ]),
        new SideBarMenuItem("Tenants",'', "Pages.Tenants", "icon-globe", "/app/admin/tenants"),
        new SideBarMenuItem("Editions",'',"Pages.Editions", "icon-grid", "/app/admin/editions"),
        new SideBarMenuItem("Geography",'',"Pages.Tenant.Geography", "fa fa-globe", "", [
            new SideBarMenuItem("Country",'', "Pages.Tenant.Geography.Country", "fa fa-flag-o", "/app/main/country"),
            new SideBarMenuItem("City",'', "Pages.Tenant.Geography.City", "fa fa-building", "/app/main/city"),
            new SideBarMenuItem("Location",'',"Pages.Tenant.Geography.Location", "fa fa-map-marker", "/app/main/location"),
            new SideBarMenuItem("Region",'', "Pages.Tenant.Geography.Region", "fa fa-map-o", "/app/main/region")
            ]), 
            new SideBarMenuItem("Master",'', "Pages.Tenant.Master", "fa fa-database", "", [
                new SideBarMenuItem("Source",'', "Pages.Tenant.Master.Source", "fa fa-cubes", "/app/main/source"),
                new SideBarMenuItem("kanban MileStone",'', "Pages.Tenant.Master.MileStone" , "fa fa-line-chart", "/app/main/kanbanMileStone"),
                new SideBarMenuItem("kanban Stage",'', "Pages.Tenant.Master.kanbanStage" , "fa fa-flask", "/app/main/kanbanStage"),
                new SideBarMenuItem("Lead Status",'', "Pages.Tenant.Master.LeadStatus" , "fa fa-sliders", "/app/main/leadStatus"),
                new SideBarMenuItem("Activity Type",'', "Pages.Tenant.Master.ActivityType" , "fa fa-pencil-square-o", "/app/main/activity"),
                new SideBarMenuItem("Lead Category",'', "Pages.Tenant.Master.LeadType" , "fa fa-level-up", "/app/main/leadCategory"),                
                new SideBarMenuItem("Lost Reason",'', "Pages.Tenant.Master.LeadReason" , "fa fa-question-circle", "/app/main/lostReason"),
                new SideBarMenuItem("Division",'', "Pages.Tenant.Master.Department" , "fa fa-bank", "/app/main/division"),
                new SideBarMenuItem("Industry",'', "Pages.Tenant.Master.Industry" , "fa fa-industry", "/app/main/industry"),
                new SideBarMenuItem("Team",'', "Pages.Tenant.Master.Team" , "fa fa-user", "/app/main/team"),
                new SideBarMenuItem("Opportunity Source",'', "Pages.Tenant.Master.OpportunitySource" , "fa fa-th-large", "/app/main/opportunitySource"),
                new SideBarMenuItem("Why Bafco", "Pages.Tenant.Master.Whybafco" ,'', "fa fa-google-wallet", "/app/main/whyBafco"),
                new SideBarMenuItem("Ignore Domain",'', "Pages.Tenant.Master.EmailDomain" , "fa fa-envelope", "/app/main/emailDomain")
                ]),
            new SideBarMenuItem("Product Family",'', "Pages.Tenant.ProductFamily", "fa fa-cubes", "", [               
                new SideBarMenuItem("Attribute",'', "Pages.Tenant.ProductFamily.ProductAttribute", "fa fa-crosshairs", "/app/main/product-attribute"),                               
                new SideBarMenuItem("Attribute Group",'', "Pages.Tenant.ProductFamily.ProductAttributeGroup", "fa fa-bitbucket-square", "/app/main/attribute-group"),
                new SideBarMenuItem("Collection",'',"Pages.Tenant.ProductFamily.Collection","fa fa-database", "/app/main/collection"),                             
                new SideBarMenuItem("Product Family",'', "Pages.Tenant.ProductFamily.ProductFamily", "fa fa-delicious", "/app/main/product-family"),             
                new SideBarMenuItem("Product Category",'', "Pages.Tenant.ProductFamily.ProductType" , "fa fa-th-list", "/app/main/productCategory"),
                new SideBarMenuItem("Product Group",'',"Pages.Tenant.ProductFamily.ProductGroup","fa fa-clone", "/app/main/productGroup"),
                new SideBarMenuItem("Product Specification",'', "Pages.Tenant.ProductFamily.ProductSpecification", "fa fa-users", "/app/main/product-specification"),
                new SideBarMenuItem("Product",'', "Pages.Tenant.ProductFamily.Products", "fa fa-cube", "/app/main/product"),
                ]),
        new SideBarMenuItem("AddressBook",'', "Pages.Tenant.AddressBook", "fa fa-address-book", "", [
            new SideBarMenuItem("Company",'', "Pages.Tenant.AddressBook.Company", "fa fa-university", "/app/main/company"),
            new SideBarMenuItem("Contact",'', "Pages.Tenant.AddressBook.Contact", "fa fa-phone", "/app/main/contact"),
            new SideBarMenuItem("CustomerType",'', "Pages.Tenant.AddressBook.CustomerType", "fa fa-user", "/app/main/newCustomerType"),
            new SideBarMenuItem("InfoType",'', "Pages.Tenant.AddressBook.InfoType", "fa fa-book", "/app/main/newInfoType"),
            new SideBarMenuItem("Contact Designation",'',"Pages.Tenant.AddressBook.Contact","fa fa-address-card","/app/main/contactDesignation"),
        ]),     
        new SideBarMenuItem("Activities",'', "Pages.Tenant.EnquiryActivity", "fa fa-low-vision", "",[
            new SideBarMenuItem("Enquiry Activity",'',"Pages.Tenant.EnquiryActivity","fa fa-balance-scale","/app/main/activity-enq"),  
            new SideBarMenuItem("Job Activity",'',"Pages.Tenant.JobActivity","fa fa-qrcode","/app/main/jobActivity")
        ]),
            new SideBarMenuItem("Enquiry",'', "Pages.Tenant.Enquiry", "fa fa-pencil-square", "/app/main/kanban", [
            new SideBarMenuItem("Marketing Kanban",'', "Pages.Tenant.Enquiry.Enquiry", "fa fa-pencil-square", "/app/main/kanban"),
            new SideBarMenuItem("Sales Kanban",'', "Pages.Tenant.Enquiry.SalesEnquiry", "fa fa-briefcase", "/app/main/sales-enquiry"),
            // new SideBarMenuItem("Forecast Kanban", "", "fa fa-bar-chart", "/app/main/forecast"),
            new SideBarMenuItem("Lead",'', "Pages.Tenant.Enquiry.Leads", "fa fa-line-chart", "/app/main/leads"),
            new SideBarMenuItem("Junk",'',"Pages.Tenant.Enquiry.Junk","fa fa-trash","/app/main/junk-enquiry")
        ]),
        new SideBarMenuItem("Quotation",'', "Pages.Tenant.Quotation", "fa fa-handshake-o", "",[
            new SideBarMenuItem("Quotation",'',"Pages.Tenant.Quotation.Quotation","fa fa-newspaper-o","/app/main/quotation"),
            new SideBarMenuItem("Quotation Status",'',"Pages.Tenant.Quotation.QuotationStatus","fa fa-line-chart", "/app/main/quotation-status")
        ]),
        new SideBarMenuItem("Report",'', "", "fa fa-cogs", "", [
            new SideBarMenuItem("View Editor",'', "", "fa fa-eye", "/app/main/view"),
            new SideBarMenuItem("Report Generator",'', "", "fa fa-list", "/app/main/viewReport"),
            new SideBarMenuItem("Forecast Report",'', "", "fa fa-list-alt", "/app/main/forecastReport")
        ]),
        new SideBarMenuItem("Administration",'', "", "icon-wrench", "", [
            new SideBarMenuItem("OrganizationUnits",'', "Pages.Administration.OrganizationUnits", "icon-layers", "/app/admin/organization-units"),
            new SideBarMenuItem("Roles",'', "Pages.Administration.Roles", "icon-briefcase", "/app/admin/roles"),
            new SideBarMenuItem("User Designation",'', "Pages.Administration.UserDesignation", "icon-user", "/app/admin/userDesignation"),
            new SideBarMenuItem("Users",'', "Pages.Administration.Users", "icon-people", "/app/admin/users"),
            new SideBarMenuItem("Languages",'', "Pages.Administration.Languages", "icon-flag", "/app/admin/languages"),
            new SideBarMenuItem("AuditLogs",'', "Pages.Administration.AuditLogs", "icon-lock", "/app/admin/auditLogs"),
            //new SideBarMenuItem("Maintenance", "Pages.Administration.Host.Maintenance", "icon-wrench", "/app/admin/maintenance"),
            //new SideBarMenuItem("Subscription", "Pages.Administration.Tenant.SubscriptionManagement", "icon-refresh", "/app/admin/subscription-management"),
            new SideBarMenuItem("Settings",'', "Pages.Administration.Host.Settings", "icon-settings", "/app/admin/hostSettings"),
            new SideBarMenuItem("Settings",'', "Pages.Administration.Tenant.Settings", "icon-settings", "/app/admin/tenantSettings")
        ])
    ]);

    checkChildMenuItemPermission(menuItem): boolean {

        for (var i = 0; i < menuItem.items.length; i++) {
            var subMenuItem = menuItem.items[i];

            if (subMenuItem.permissionName && this.permission.isGranted(subMenuItem.permissionName)) {
                return true;
            }

            if (subMenuItem.items && subMenuItem.items.length) {
                return this.checkChildMenuItemPermission(subMenuItem);
            } else if (!subMenuItem.permissionName) {
                return true;
            }
        }

        return false;
    }

    showMenuItem(menuItem): boolean {
        if (menuItem.permissionName === 'Pages.Administration.Tenant.SubscriptionManagement' && this._appSessionService.tenant && !this._appSessionService.tenant.edition) {
            return false;
        }

        if (menuItem.permissionName) {
            return this.permission.isGranted(menuItem.permissionName);
        }

        if (menuItem.items && menuItem.items.length) {
            return this.checkChildMenuItemPermission(menuItem);
        }
        
        return true;
    }

    count:number = 1;
    nm:string = '';
    mouseEnter(menuname):void{
        var index = this.menu.items.findIndex(x=> x.name==menuname);
    if(index >0)
    {
        this.menu.items[index].cls = 'block';
    }
    }
    mouseLeave(menname):void{
        var index = this.menu.items.findIndex(x=> x.name==menname);
        if(index >0)
        {
            this.menu.items[index].cls = '';
        }
    }
}