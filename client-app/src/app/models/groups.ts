import { IPhoto } from "./profile";

export interface IGroup {
    id: string;
    description: string;
    closed?: number;
    open?: number;
    verify?: number;
    isPublic: boolean;
    createdAt?: string;
    groupName: string;
    members?: IMember[];
    comments?: IComment[];
    photos?: IPhoto[];
    announcements?: IAnnouncement[];
}

export interface IComment {
    id: string;
    createdAt: Date;
    body: string;
    username: string;
    displayName: string;
    image: string;
}

export interface IAnnouncement {
    id: string;
    createdAt: Date;
    body: string;
    username: string;
    displayName: string;
    image?: string;
}

export interface IMember {
    username: string;
    displayName: string;
    image: string;
    isHost: boolean;
    isAdmin: boolean;
}