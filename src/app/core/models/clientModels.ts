export interface ClientData {
    name: string;
    email: string;
    birthDay: string;
    addressList: any[];
}

export interface ClientUpdate {
    name: string;
    email: string;
    birthDay: string;
    addressList: any[];
    code: number;
}

export interface ClientReturns {
    status: string;
    data: any;
}
