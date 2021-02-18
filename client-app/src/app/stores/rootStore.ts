/*
import { configure } from "mobx";
import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import GroupStore from "./groupStore";
import ProfileStore from "./profileStore";
import TicketStore from "./ticketStore";
import UserStore from "./userStore";

configure({enforceActions: 'always'});

export class RootStore {
    groupStore: GroupStore;
    userStore: UserStore;
    ticketStore: TicketStore;
    commonStore: CommonStore;
    profileStore: ProfileStore;

    constructor() {
        this.groupStore = new GroupStore();
        this.userStore = new UserStore();
        this.ticketStore = new TicketStore();
        this.commonStore = new CommonStore();
        this.profileStore = new ProfileStore();
    }
}

export const RootStoreContext = createContext(new RootStore());

export function useStore(){
    return useContext(RootStoreContext);
}
*/
export {};