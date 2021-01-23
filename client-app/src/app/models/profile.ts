import { ITicket } from "./tickets";

export interface IProfile {
    displayName: string;
    username: string;
    bio: string;
    image: string;
    photos: IPhoto[];
    tickets: ITicket[];
}
export interface IProfileEdits {
    displayName: string,
    bio?: string
}

export class ProfileFormValues implements IProfileEdits {
    displayName: string = "";
    bio?: string = "";
    constructor(init?: IProfile) {
        this.displayName = init?.displayName!;
        this.bio = init?.bio;
    }
}

export interface IPhoto {
    id: string;
    url: string;
    isMain: boolean;
}