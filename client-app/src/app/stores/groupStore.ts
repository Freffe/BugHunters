import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, observable, runInAction  } from "mobx";
import { createMember } from "../../features/utils/helperMethods";
import agent from "../api/agent";
import { IAnnouncement, IGroup, IMember } from "../models/groups";
import { IPhoto } from "../models/profile";

import { store } from "./store";

export default class GroupStore {
  
    constructor() {
     
        makeAutoObservable(this);
    }

    groupRegistry = new Map();
    loadingGroups = false;
    submittingAnnouncement = false;
    submittingGroup = false;
    selectedGroupId = "";
    loadingGroupPhoto = false;
    deletingGroupPhoto = false;
    isPromotingMember = false;
    isUploadingGroupEdit = false;

    // Option to not use decorators for setting a ref?
    @observable.ref hubConnection: HubConnection | null = null;

    get isHostOfGroup() {
        // If user is host return true:
        return this.selectedGroup.members.filter((member: IMember) => 
           //* member.isHost && member.username === this.rootStore.userStore.user?.username
            member.isHost && member.username === store.userStore.user?.username
        ).length > 0;
    }

    
    get isHostOrAdminOfGroup() {
        // If user is host return true:
        return this.selectedGroup?.members.filter((member: IMember) => 
            //*(member.isHost || member.isAdmin) && member.username === this.rootStore.userStore.user?.username
            (member.isHost || member.isAdmin) && member.username === store.userStore.user?.username
        ).length > 0;
    }

    get getGroups() {
        return Array.from(this.groupRegistry.values())
    }
    //@computed
    get groupsByDate() {
        return Array.from(this.groupRegistry.values()).slice().sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
    }
    //@computed
    // This is for Group page Dropdown selection of group names.
    get groupTitles() {
        return Array.from(this.groupRegistry.values())
            .slice()
            .sort((a, b) => a.groupName?.charAt(0).localeCompare(b.groupName.charAt(0)))
            .map((group: IGroup) => ({"key": group.id, "value":  group.id, "text": group.groupName } ) )
    }
    get groupTitleForUserOptions() {
        return Array.from(this.groupRegistry.values())
        .slice()
        .sort((a, b) => a.groupName?.charAt(0).localeCompare(b.groupName.charAt(0)))
        .filter((group: IGroup) => group.members?.filter((member: IMember) => 
           //*(member.username === this.rootStore.userStore.user?.username)).length
           (member.username === store.userStore.user?.username)).length
        ).map((group: IGroup) => 
            ({"key": group.id, "value":  group.id, "text": group.groupName })
        );
    }
    get selectedGroup() {
        return Array.from(this.groupRegistry.values()).find((grp: IGroup) => grp.id === this.selectedGroupId);
    }

    get groupTitleForUser() {
        return Array.from(this.groupRegistry.values())
        .slice()
        .sort((a, b) => a.groupName?.charAt(0).localeCompare(b.groupName.charAt(0)))
        .filter((group: IGroup) => group.members?.filter((member: IMember) => 
           //*(member.username === this.rootStore.userStore.user?.username)).length
           (member.username === store.userStore.user?.username)).length
        ).map((group: IGroup) => 
            ({"key": group.id, "value":  group.id, "text": group.groupName,  "photo": group.photos?.slice(0,1)[0] })
        );
    }

    createHubConnection = (groupId: string) => {
        // process.env.REACT_APP_API_CHAT_URL!
        // Prevent this from opening two connections with the same token.
        try {
            if (this.selectedGroupId) {

                this.hubConnection = new HubConnectionBuilder()
                    .withUrl(process.env.REACT_APP_API_CHAT_URL + '?groupId=' + groupId, {
                    //*accessTokenFactory: () => this.rootStore.commonStore.token!
                    accessTokenFactory: () => store.commonStore.token!
                })
                .configureLogging(LogLevel.Information).build();
                //console.log("Starting hub connection: ", this.selectedGroupId!);
                this.hubConnection
                    .start()
                    .then(() => console.log(this.hubConnection!.state))
                    .then(() => {
                        if(this.hubConnection!.state === "Connected") {
                        this.hubConnection!.invoke("AddToGroup", groupId)
                        }
                    })
                .catch(error => console.log("Error establishing connection: ", error));
                // This is being called twice when coming from profile/profileGroups link
    
                    this.hubConnection?.on("ReceiveComment", comment => {
                        runInAction(() => {
                            this.selectedGroup!.comments.push(comment);
                        });
                    })
            }
        } catch(error) {
            console.log(error);
        }
    }  

    stopHubConnection = async () => {
        try {
            if (this.hubConnection) {
                //console.log("inside ", this.selectedGroupId, " Connection.state = ", this.hubConnection!.state);

                if(this.hubConnection!.state === ("Connected" || "Connecting")) {
                    await this.hubConnection.invoke("RemoveFromGroup", this.selectedGroupId!).then(() => {
                        //console.log("Stopping hub connection: ", this.selectedGroupId!);
                      this.hubConnection!.stop();
                    }).then(() => console.log("Connection stopped")).catch(err => console.log(err))
                }
            } 

        } catch (error) {
            runInAction(() => console.log(error));
        }
    }
  
    addComment = async (values: any) =>  {
        values.groupId = this.selectedGroupId!;
        try {
          await this.hubConnection!.invoke("SendComment", values);
        } catch(error) {
          console.log(error);
        }
    }

    addAnnouncement = async (groupId: string, body: IAnnouncement) =>  {
        this.submittingAnnouncement = true;
        try {
          await agent.Groups.addAnnouncement(groupId, body);
          runInAction(() => {
              // Add announcement to the groups announcement array
              this.groupRegistry.get(groupId).announcements.push(body);
              // flip flag
              this.submittingAnnouncement = false;
          })
        } catch(error) {
            runInAction(() => {
                this.submittingAnnouncement = false;
                console.log(error);
            })
        }
    }   

    deleteAnnouncement = async (groupId: string, announcementId: string) => {
        this.submittingAnnouncement = true;
        try {
            await agent.Groups.delAnnouncement(groupId, announcementId);
            runInAction(() => {
                this.groupRegistry.get(groupId).announcements = this.groupRegistry.get(groupId).announcements.filter((announcement: IAnnouncement) => announcement.id !== announcementId)
                this.submittingAnnouncement = false;
            })
        } catch (error) {
            runInAction(() => {
                this.submittingAnnouncement = false;
                console.log(error);
            })
        }
    }


    uploadPhoto = async (groupId: string, file: Blob) => {
        this.loadingGroupPhoto = true;
        try {
            const photo = await agent.Groups.uploadPhoto(groupId, file);
            runInAction(() => {
                this.groupRegistry.get(groupId).photos.push(photo);
                this.loadingGroupPhoto = false;
            });
        } catch(error) {
            console.log(error);
            runInAction(() => {
                this.loadingGroupPhoto = false;
            })
        }
    }

    deletePhoto = async (groupId: string, photo: IPhoto) => {
        this.deletingGroupPhoto = true;
        try {
            await agent.Groups.deletePhoto(groupId, photo.id);
            runInAction(() => {
                this.groupRegistry!.get(groupId).photos = [];
                this.deletingGroupPhoto = false;
            })
        } catch(error) {
            console.log(error);
            runInAction(() => {
                this.deletingGroupPhoto = false;
            })
        }
    }
  
    addAdminComment = async (values: any) => {
        let sendValues = {groupId: "", username: "", body: ""};
        sendValues.groupId = this.selectedGroupId!;
        sendValues.username = values.username;
        sendValues.body = `User ${values.username} has ${values.status} the group!`;
        //console.log("SendAdminComment called now with: ", sendValues);
        try {
          await this.hubConnection!.invoke("SendAdminComment", sendValues);
        } catch(error) {
          console.log(error);
        }
    }

    addAdmin = async (groupId: string, username: string) => {
        this.isPromotingMember = true;
        try {
            let userName = {username: username};
            await agent.Groups.editMember(groupId, userName);
            runInAction(() => {
                this.selectedGroup?.members.forEach((member: IMember) => {
                    if (member.username === username)
                        member.isAdmin = true;
                });
                console.log("Is he admin? ", this.selectedGroup);
                this.isPromotingMember = false;
            })
        } catch (error) {
            runInAction(() => {
                console.log(error);
                this.isPromotingMember = false;
            })
        }
    }

    loadGroups = async () => {
        this.loadingGroups = true;
        try {
            const groups = await agent.Groups.list();
            runInAction(() => {
                groups.forEach((group) => {
                    group.createdAt = group.createdAt!.split('.')[0]
                    this.groupRegistry.set(group.id, group)
                })
                this.loadingGroups = false;
            })
        } catch (error) {
            runInAction(() => {
                this.loadingGroups = false;
                console.log("Error loading group: ", error)
            })
        }
    }

    createGroup = async (group: IGroup) => {
        this.submittingGroup = true;
        try {
            await agent.Groups.create(group);
            let members = [];
            //*const member = createMember(this.rootStore.userStore.user!);
            const member = createMember(store.userStore.user!);
            member.isHost = true;
            members.push(member);
            group.members = members;
            group.comments = [];
            group.announcements = [];
            group.photos = [];
            runInAction(() => {
                this.groupRegistry.set(group.id, group);
                this.submittingGroup = false;
                this.setSelectedGroup(group.id);
            })
        } catch (error) {
            runInAction(() => {
                this.submittingGroup = false;
                console.log("Error in createGroup: ", error);
            })
        }
    }

    editGroupDescription = async (group: IGroup) => {
        this.isUploadingGroupEdit = true;
        try {
            console.log("Sending up: ", group);
            await agent.Groups.update(group);
            runInAction(() => {
                // update groupregistry grp
                this.groupRegistry.set(group.id, group);
                this.isUploadingGroupEdit = false;
            })
        } catch (error) {
            runInAction(() => {
                console.log(error);
                this.isUploadingGroupEdit = false;
            })
        }
    }

    setSelectedGroup = (groupId: string) => {
        try {
            this.selectedGroupId = groupId;
        } catch (error) {
            console.log("Error setting selected group: ", error);
        }
    }

    setSelectedGroupEmpty = () => {
        try {
            this.selectedGroupId = "";
        } catch (error) {
            console.log("Error setting selected group Empty : ", error);
        }
    } 

    joinGroup = async (groupId: string) => {
        this.submittingGroup = true;
        try {
            await agent.Groups.join(groupId);
            runInAction(() => {
                // Add user to memberlist for grp
                //*this.selectedGroup.members.push(this.rootStore.userStore.user);
                this.selectedGroup.members.push(store.userStore.user);
                this.submittingGroup = false;
            })
        } catch(err) {
            runInAction(() => {
                this.submittingGroup = false;
                console.log("Error in joinGroup: ", err);
            })
        }
    }

    leaveGroup = async (groupId: string) => {
        this.submittingGroup = true;
        try {
            await agent.Groups.leave(groupId);
            runInAction(() => {

                this.selectedGroup.members  = this.selectedGroup.members.filter((member: IMember) => 
                    //*member.username !== this.rootStore.userStore.user?.username
                    member.username !== store.userStore.user?.username
                );
                this.selectedGroupId = "";
                this.submittingGroup = false;
            })
        } catch(err) {
            runInAction(() => {
                this.selectedGroupId = "";
                this.submittingGroup = false;
                console.log("Error in leaveGroup: ", err);
            })
        }
    }
}