import { configure } from "mobx";
import { createContext } from "react";
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
        this.groupStore = new GroupStore(this);
        this.userStore = new UserStore(this);
        this.ticketStore = new TicketStore(this);
        this.commonStore = new CommonStore(this);
        this.profileStore = new ProfileStore(this);
    }
}

export const RootStoreContext = createContext(new RootStore());