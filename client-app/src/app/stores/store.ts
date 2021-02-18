import { configure } from "mobx";
import { createContext, useContext } from "react";
import TicketStore from "./ticketStore";
import CommonStore from "./commonStore";
import UserStore from "./userStore";
import ProfileStore from "./profileStore";
import GroupStore from "./groupStore";

configure({enforceActions: 'always'});

interface Store {
    ticketStore: TicketStore;
    commonStore: CommonStore;
    userStore: UserStore;
    profileStore: ProfileStore;
    groupStore: GroupStore;
}

export const store: Store = {
    ticketStore: new TicketStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    profileStore: new ProfileStore(),
    groupStore: new GroupStore()
}

export const StoreContext = createContext(store);

export function useStore(){
    return useContext(StoreContext);
}