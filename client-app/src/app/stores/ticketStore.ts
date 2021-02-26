import { makeAutoObservable, runInAction, toJS } from "mobx";
import { history } from "../..";
import agent from "../api/agent";
import { IComment, IMember } from "../models/groups";
import { ITicket, ITicketPhoto, ITicketText } from "../models/tickets";

import { store } from "./store";

export default class TicketStore {
 

    constructor() {
     
        makeAutoObservable(this);
    }

    // @observable
    tickets: ITicket[] = [];
    selectedTicket: ITicket | null = null;
    // Testing ticketFiles k.
    ticketFiles: any[] = [];
    ticketRegistry = new Map();
    loadingTickets = false;
    submittingTicket = false;
    isAddingComment = false;
    isEditingComment = false;
    isDeletingComment = false;
    isAddingPhoto = false;
    isDeletingPhoto = false;
    isAddingText = false;
    isDeletingText = false;



    ticketListStats: { [key: string]: number} = {"open": 0, "closed": 0, "verify": 0};

    //@computed
    get ticketsByDate() {
        return Array.from(this.ticketRegistry.values()).slice().sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    }

    get allTickets() {
        return Array.from(this.ticketRegistry.values());
    }

    isTicketCreatorOrAdmin =  () => {
        // Requires that selected ticket is in selectedGroup.
        runInAction(async () => {
          /* *  if (this.rootStore.groupStore.groupRegistry.size === 0) {
                await this.rootStore.groupStore.loadGroups();
            }
            */           
            if (store.groupStore.groupRegistry.size === 0) {
                await store.groupStore.loadGroups();
            }
            
            
        })
        /* *const isAdmin = this.rootStore.groupStore.isHostOrAdminOfGroup || 
            this.rootStore.groupStore.groupRegistry.get(this.selectedTicket?.groupId)?.members.filter((member: IMember) => 
                member.isHost && member.username === this.rootStore.userStore.user?.username
            ).length > 0; */
        const isAdmin = store.groupStore.isHostOrAdminOfGroup || 
            store.groupStore.groupRegistry.get(this.selectedTicket?.groupId)?.members.filter((member: IMember) => 
                member.isHost && member.username === store.userStore.user?.username
            ).length > 0;
        // Is there another way to get isAdmin without groupStore without calling db?

        // *const isCreator = this.selectedTicket?.creator === this.rootStore.userStore.user?.username;
        const isCreator = this.selectedTicket?.creator === store.userStore.user?.username;
        return isAdmin || isCreator;
    }

    setSelectedTicket = async (ticket: ITicket) => {
        try {
            runInAction(() => {
                if (ticket)
                    this.selectedTicket = ticket;
                
            })
        } catch (error) {
            console.log(error);
        }
    }

    setSelectedTicketFromId = async (ticketId: string) => {
        try {
            if (!this.ticketRegistry.get(ticketId))
                await this.loadTickets();
            let ticket = await this.ticketRegistry.get(ticketId);
            runInAction(() => {
                this.selectedTicket = ticket;
            })
        } catch (error) {
            console.log(error);
        }
    }


    // @action
    loadTickets = async () => {
        this.loadingTickets = true;
        try {
            const tickets = await agent.Tickets.list()

            runInAction(() => {
                // Reset ticketListStats to 0 before continuing to avoid duplication
                // This is a temp solution, neaty up later.
                this.ticketListStats.open = 0;
                this.ticketListStats.closed = 0;
                this.ticketListStats.verify = 0;
                // push ticket on to registry and update status value.
                tickets.forEach((ticket) => {
                    ticket.date = ticket.date.split('.')[0]
                    const key = ticket.status.toLowerCase();
                    const valúe = this.ticketListStats[key] += 1;
                    this.ticketListStats[key] = valúe;
                    this.ticketRegistry.set(ticket.id, ticket)
                });
                this.loadingTickets = false;
            })
        } catch (error) {
            runInAction(() => {
                console.log("Error loadTickets in MobX store ticketStore, ", error);
                this.loadingTickets = false;
            })
        }
    }

    createTicket = async (ticket: ITicket) => {
        this.submittingTicket = true;
        try {
            await agent.Tickets.create(ticket);
            runInAction(() => {
                // Maybe update stats list and force reload for ticketRegistry
                this.ticketRegistry.set(ticket.id, ticket);
                this.selectedTicket = ticket;
                this.submittingTicket = false;
            })
            history.push('/issues');
        } catch (error) {
            runInAction(() => {
                this.submittingTicket = false;
                console.log("Error createTicket, ", error);
            })
        }
    }
    fileToBlob = async (file: any) => {
        return new Blob([new Uint8Array(await file.arrayBuffer())], {
            type: file.type,
          });
    }
    setTicketFiles = async (photo: any) => {
        //this.ticketFiles = photo;

        if (photo.length > 0) {
            let images: Array<{ blob: Blob; name: any }> = [];
            for (var i = 0; i < photo.length; i++) {
                //console.log("photo[i].type === ", photo[i].type, " photo[i] = ", photo[i], ["image/png", "image/jpg", "image/jpeg"].includes(photo[i].type))          
                if (photo[i] && ["image/png", "image/jpg", "image/jpeg"].includes(photo[i].type)) {

                    let image = await this.fileToBlob(photo[i]);
                    let sendThis = { blob: image, name: photo[i].name };
                    images.push(sendThis);
                }

                if (photo[i] && photo[i].type === "text/plain") {
                    // Does it work with text files as blobs? lets see...
                    let image = await this.fileToBlob(photo[i]);
                    let sendThis = { blob: image, name: photo[i].name };
                    images.push(sendThis);
                }
            }
            runInAction(() => {

                if (this.ticketFiles.length > 0) {
                    images.forEach((image) => {
                        this.ticketFiles.push(image);
                    })
                } else {
                    this.ticketFiles = images;
                }
            })
        } else {
            runInAction(() => {
                this.ticketFiles = [];
            })
        }


    }

    createWithPhoto = async (ticket: ITicket) => {
        this.submittingTicket = true;
        try {
            //await agent.Tickets.createWithPhoto(ticket, photo);
            //console.log("Sending: ", photo);
            await agent.Tickets.createTicketMultiple(ticket, this.ticketFiles)
            runInAction(() => {
                // Maybe update stats list and force reload for ticketRegistry
                this.ticketRegistry.set(ticket.id, ticket);
                this.selectedTicket = ticket;
                this.submittingTicket = false;
            })
            history.push('/issues');
        } catch (error) {
            runInAction(() => {
                this.submittingTicket = false;
                this.setTicketFiles([]);
                console.log("Error createTicket, ", error);
            })
        }
    }
    editTicket = async (ticket: ITicket) => {
        this.submittingTicket = true;
        try {
            await agent.Tickets.update(ticket);
            runInAction(() => {
                const oldTicketStatus = this.ticketRegistry.get(ticket.id).status.toLowerCase();
                // Make sure to update ticketListStats if this field has been changed.
                 const newTicketStatus = ticket.status.toLowerCase();   
                if (newTicketStatus !== oldTicketStatus) {
                    this.ticketRegistry.set(ticket.id, ticket);
                    this.ticketListStats[newTicketStatus] += 1;
                    this.ticketListStats[oldTicketStatus] -= 1;
                } else {
                    this.ticketRegistry.set(ticket.id, ticket);
                }
                this.selectedTicket = ticket;
                this.submittingTicket = false;
            });
            //history.push('/issues');
        } catch (error) {
            runInAction(() => {
                this.submittingTicket = false;
                console.log("Error editTicket, ", error);
            })
        }
    }

    editTicketStatus = async (ticket: ITicket) => {
        this.submittingTicket = true;
        try {
            await agent.Tickets.update(ticket);
            runInAction(() => {
                const oldTicketStatus = this.selectedTicket!.status.toLowerCase();
                // Make sure to update ticketListStats if this field has been changed.
                 const newTicketStatus = ticket.status.toLowerCase();   
                if (newTicketStatus !== oldTicketStatus) {
                    this.ticketListStats[newTicketStatus] += 1;
                    this.ticketListStats[oldTicketStatus] -= 1;
                } 
                this.selectedTicket = ticket;
                this.submittingTicket = false;
            });
        } catch (error) {
            runInAction(() => {
                this.submittingTicket = false;
                console.log("Error editTicketStatus, ", error);
            })
        }
    }

    // {{url}}/api/tickets/comment/47deb399-2e0f-48cb-8892-849fe306e08
    addComment = async (ticket: ITicket, comment: IComment) => {
        this.isAddingComment = true;
        try {
            let com = await agent.Tickets.addComment(ticket.id, comment);      
            runInAction(() => {
                // Add comment to this tickets comment list.
                ticket.comments?.push(com);
                this.ticketRegistry.set(ticket.id, ticket);
                this.selectedTicket = ticket;
                this.isAddingComment = false;
            })
        } catch (error) {
            runInAction(() => {
                console.log(error)
                this.isAddingComment = false;
            })
        }
    }

    deleteComment = async (ticketId: string, commentId: string) => {
        this.isDeletingComment = true;
        try {
            await agent.Tickets.delComment(ticketId, commentId);
            runInAction(() => {
                let retu = this.selectedTicket?.comments?.filter((comment: IComment) => comment.id !== commentId )
                let ticket = this.selectedTicket;
                this.selectedTicket!.comments = retu;
                this.ticketRegistry.set(ticketId, ticket);
                this.isDeletingComment = false;

            })
        } catch (error) {
            runInAction(() => {
                console.log(error)
                this.isDeletingComment = false;

            })
        }
    }

    editComment = async (ticketId: string, commentId: string, body: any) => {
        this.isEditingComment = true;
        try {
            if (!this.ticketRegistry.has(ticketId)) 
                    await this.loadTickets();
            await agent.Tickets.editComment(ticketId, commentId, body);
            runInAction(() => {
                let tickets = this.ticketRegistry.get(ticketId);
                let ticket = toJS(tickets);
                // Update comment
                ticket.comments.forEach((comment: IComment) =>  { 
                    if(comment.id === commentId) { 
                        comment.body = body.body;
                    } 
                });
                this.ticketRegistry.set(ticket.id, ticket);
                //const ait = this.ticketRegistry.get(ticket.id);
                //console.log("ait ", ait.comments);
                this.selectedTicket = ticket;
                this.isEditingComment = false;
            })
        } catch (error) {
            runInAction(() => {
                console.log(error)
                this.isEditingComment = false;
            })
        }
    }

    addPhoto = async (ticketId: string, photo: Blob) => {
        this.isAddingPhoto = true;
        try {
            const returnedPhoto = await agent.Tickets.addPhoto(ticketId, photo);
            runInAction(() => {
                // TODO: Try not to touch ticketregistry for now.
                this.selectedTicket!.photos?.push(returnedPhoto);
                this.isAddingPhoto = false;
            })
            
        } catch (error) {
            runInAction(() => {
                console.log(error);
                this.isAddingPhoto = false;
            })

        }
    }
    deletePhoto = async (ticketId: string, photoId: string) => {
        this.isDeletingPhoto = true;
        try {
            await agent.Tickets.delPhoto(ticketId, photoId);
            runInAction(() => {
                let updatedPhotos = this.selectedTicket?.photos?.filter((photo: ITicketPhoto) => photo.id !== photoId)
                this.selectedTicket!.photos = updatedPhotos;
                this.isDeletingPhoto = false;
            })
            
        } catch (error) {
            runInAction(() => {
                console.log(error);
                this.isDeletingPhoto = false;
            })

        }
    }

    addTextFile = async (ticketId: string, text: Blob) => {
        this.isAddingText = true;
        try {
            
            const returnedTextFile = await agent.Tickets.addTextFile(ticketId, text);
            runInAction(() => {
                // TODO: Try not to touch ticketregistry for now.
                if (returnedTextFile)
                    this.selectedTicket!.texts?.push(returnedTextFile);
                this.isAddingText = false;
            })
            
        } catch (error) {
            runInAction(() => {
                console.log(error);
                this.isAddingText = false;
            })

        }
    }

    deleteTextFile = async (ticketId: string, textId: string) => {
        this.isDeletingText = true;
        try {
            await agent.Tickets.delTextFile(ticketId, textId);
            runInAction(() => {
                let updatedTexts = this.selectedTicket?.texts?.filter((text: ITicketText) => text.id !== textId)
                this.selectedTicket!.texts = updatedTexts;
                this.isDeletingText = false;
            })
            
        } catch (error) {
            runInAction(() => {
                console.log(error);
                this.isDeletingText = false;
            })

        }
    }
}