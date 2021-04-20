
export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface UserData {
    name: string;
    email: string;
    uid: string;
    timeStamp: number;
    type: string;
}