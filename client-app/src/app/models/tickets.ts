import { IComment } from "./groups";

export interface ITicket {
    id: string;
    title: string;
    description: string;
    device: string;
    date: string;
    bugType: string;
    status: string;
    priority: string;
    version: string;
    groupId?: string;
    photos?: ITicketPhoto[];
    comments?: IComment[];
    creator: string;
    texts?: ITicketText[];
}

export class TicketFormValues implements ITicket {
    id: string = ''
    title: string = '';
    description: string = '';
    device: string = '';
    date: string = '';
    bugType: string = '';
    status: string = '';
    priority: string = '';
    version: string = '';
    groupId?: string = '';
    photos?: ITicketPhoto[];
    comments?: IComment[];
    creator: string = "";
    texts?: ITicketText[];
    
    constructor(init?: TicketFormValues) {
        Object.assign(this, init);
    }
}

export interface ITicketPhoto {
    id: string;
    url: string;
    preview?: string;
    name: string;
}

export interface ITicketText {
    id: string;
    url: string;
    name: string;
    preview?: string;
}