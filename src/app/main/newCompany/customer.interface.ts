export interface Customer {
    companyName: string;
    //typeid: int;
    addresses: Address[];
    contacts: Contact[];
}

export interface Address {
    street: string;
    postcode: string;
    //cityid: int;
    //typeid: int;
}
export interface Contact {
    //infoid: int;
    contactinfo: string;
}