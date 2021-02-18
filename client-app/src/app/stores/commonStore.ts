import { makeAutoObservable, reaction, runInAction } from "mobx";
import { ServerError } from "../models/serverError";



export default class CommonStore {
    error: ServerError | null = null;
    token: string | null = window.localStorage.getItem("jwt");
    appLoaded = false;
    
    constructor() {
     
        makeAutoObservable(this);

        reaction(
            () => this.token,
            token => {
                if (token) {
                    window.localStorage.setItem("jwt", token);
                } else {
                    window.localStorage.removeItem("jwt");
                }
            }
        ) 
    }


    setToken = (token: string | null) => {
        this.token = token;
    }

    setAppLoaded = () => {
        runInAction(() => {
            this.appLoaded = true;
        });
    }

    setServerError = (error: ServerError) => {
        this.error = error;
    }
}