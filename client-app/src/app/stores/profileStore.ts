import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { IPhoto, IProfile, IProfileEdits } from "../models/profile";

import { store } from "./store";

export default class ProfileStore {
    
    constructor() {
        makeAutoObservable(this);
    }

    profile: IProfile | null = null;
    loadingProfile = true;
    uploadingPhoto = false;
    loadingMainPhotoSet = false;
    loadingProfileUpdate = false;

    get isCurrentUser() {
        /* *if (this.rootStore.userStore.user && this.profile) {
            return this.rootStore.userStore.user.username === this.profile.username;
        } */
        if (store.userStore.user && this.profile) {
            return store.userStore.user.username === this.profile.username;
        }
        return false;
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            
            const currentProfile = await agent.Profiles.get(username);

            runInAction(() => {
                this.profile = currentProfile;
                this.loadingProfile = false;
            })
        } catch (error) {
            runInAction(() => {
                this.loadingProfile = false;
                console.log(error);
            })
        }
    }

    editProfile = async (profile: IProfileEdits) => {
        this.loadingProfileUpdate = true;
        try {
            await agent.Profiles.editProfile(profile);
            runInAction(() => {
                this.profile!.displayName = profile.displayName;
                this.profile!.bio = profile.bio!;
                // *this.rootStore.userStore.user!.displayName = profile.displayName; 
                store.userStore.user!.displayName = profile.displayName; 
                this.loadingProfileUpdate = false;
            })
        } catch(error) {
            console.log(error);
            runInAction(() => {
                this.loadingProfileUpdate = false;
            })
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.uploadingPhoto = true;
        try {
            console.log("The img looks like this: ", file);
            const photo = await agent.Profiles.uploadPhoto(file);
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos.push(photo);
                    /* *if (photo.isMain && this.rootStore.userStore.user) {
                        this.rootStore.userStore.user.image = photo.url;
                        this.profile.image = photo.url
                    } */
                    if (photo.isMain && store.userStore.user) {
                        store.userStore.user.image = photo.url;
                        this.profile.image = photo.url
                    }
                }
                this.uploadingPhoto = false;
            })
        } catch(error) 
        {
            console.log(error);
            runInAction(() => {
                this.uploadingPhoto = false;
            })
        }
    }

    setMainPhoto = async (photo: IPhoto) => {
        this.loadingMainPhotoSet = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            runInAction(() => {
                // *this.rootStore.userStore.user!.image = photo.url;
                store.userStore.user!.image = photo.url;
                this.profile!.photos.find(p => p.isMain)!.isMain = false;
                this.profile!.photos.find(p => p.id === photo.id)!.isMain = true;
                this.profile!.image = photo.url;
                this.loadingMainPhotoSet = false;
            })
        } catch(error) {
            console.log(error);
            runInAction(() => {
                this.loadingMainPhotoSet = false;
            })
        }
    }

    deletePhoto = async (photo: IPhoto) => {
        this.loadingMainPhotoSet = true;
        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(() => {
                this.profile!.photos = this.profile!.photos.filter(a => a.id !== photo.id);
                this.loadingMainPhotoSet = false;
            })
        } catch(error) {
            console.log(error);
            runInAction(() => {
                this.loadingMainPhotoSet = false;
            })
        }
    }
}