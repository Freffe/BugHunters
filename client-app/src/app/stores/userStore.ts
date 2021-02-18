import { makeAutoObservable, runInAction } from "mobx";
import { history } from "../..";
import agent from "../api/agent";
import { IUser, IUserFormValues } from "../models/user";

import { store } from "./store";

export default class UserStore {
    refreshTokenTimeout: any;
 
    constructor() {
 
      makeAutoObservable(this);
    }
    user: IUser | null = null;
    isDeletingUser: boolean = false;
    get isLoggedIn() { return !!this.user}

    login = async (values: IUserFormValues) => {
        try {
            const user = await agent.User.login(values);
            runInAction(() => {
                this.user = user;
            });
            // *this.rootStore.commonStore.setToken(user.token);
            store.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
            //this.rootStore.modalStore.closeModal();
            history.push("/groups");
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    logout = () => {
        // *this.rootStore.commonStore.setToken(null);
        store.commonStore.setToken(null);
        this.user = null;
        history.push("/");
    }

    getUser = async () => {
        try {
            const user = await agent.User.current();
            runInAction(() => {
                this.user = user;
            });
            // *this.rootStore.commonStore.setToken(user.token);
            store.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
        } catch(error)
        {
            console.log(error);
        }
    }

    register = async (values: IUserFormValues) => {
        try {
            values.dateJoined = new Date();
            var user = await agent.User.register(values);
            runInAction(() => {
                this.user = user;
            });
            // *this.rootStore.commonStore.setToken(user.token);
            store.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
            //this.rootStore.modalStore.closeModal();
            //history.push(`/user/registerSuccess?email=${values.email}`);
        } catch(error) {
            throw error;
        }
    }

    deleteAccount = async (user: string) => {
        this.isDeletingUser = true;
        try {
            await agent.User.delete(user);
            runInAction(() => {
                this.user = null;
                this.isDeletingUser = false;
            })
            history.push("/");
        } catch (error) {
            runInAction(() => {
                console.log(error);
                this.isDeletingUser = false;
            })
        }
    }

    refreshToken = async () => {
        this.stopRefreshTokenTimer();
        try {
            const user = await agent.User.refreshToken();
            runInAction(() => {
                this.user = user;
            })
            // *this.rootStore.commonStore.setToken(user.token);
            store.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
        } catch( error ) {
            console.log(error);
        }
    }

    private startRefreshTokenTimer(user: IUser) {
        const jwtToken = JSON.parse(atob(user.token.split('.')[1]));
        // Gives our expiry as a jscript date object
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
}