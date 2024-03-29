export interface IUser {
    username: string;
    displayName: string;
    token: string;
    image?: string;
    dateJoined?: Date;
}

export interface IUserFormValues {
    email: string;
    password: string;
    displayName?: string;
    username?: string;
    dateJoined?: Date;
}