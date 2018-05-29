export class SideBarMenuItem {
    name: string = '';
    permissionName: string = '';
    icon: string = '';
    route: string = '';
    items: SideBarMenuItem[];
    cls:string = 'none';
    constructor(name: string,cls:string, permissionName: string, icon: string, route: string, items?: SideBarMenuItem[]) {
        this.name = name;
        this.permissionName = permissionName;
        this.icon = icon;
        this.cls = cls;
        this.route = route;

        if (items === undefined) {
            this.items = [];    
        } else {
            this.items = items;
        }        
    }
}