import axios, { AxiosResponse } from 'axios';
import { history } from '../..';
import { IAnnouncement, IComment, IGroup } from '../models/groups';
import { IPhoto, IProfile, IProfileEdits } from '../models/profile';
import { ITicket, ITicketPhoto, ITicketText } from '../models/tickets';
import { IUser, IUserFormValues } from '../models/user';

axios.defaults.baseURL = "http://localhost:5000/api";


axios.interceptors.request.use((config: any) => {
    const token = window.localStorage.getItem("jwt");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

axios.interceptors.response.use(undefined, error => {
    const {status, data, config, headers} = error.response;

    if (error.Message === 'Network Error' && !error.response) {
        history.push('/NoNet');
    }
    if (status === 404) {
        history.push('/notfound');
    }
    if (status === 401 && headers['www-authenticate'].includes('The token expired'))
    {
        window.localStorage.removeItem("jwt");
        history.push("/");
        console.log("Your session has expired, please login again");
        console.log(error.response);
    }
    if (status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id')) {
        history.push('/notfound');
    }

    //if (status === 400 && config.method === 'post') {
    //    history.push('/notfound');
    //}

    if (status === 500) {
        history.push('/NoServer')
    }
    throw error.response;
})

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => (response: AxiosResponse) => 
    new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms))

const requests = {
    get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(sleep(1000)).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(sleep(1000)).then(responseBody),
    del: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody),
    postForm: async (url: string, file: any) => {
        const formData = new FormData();
        //const blob = await fetch(file).then((res) => res.blob());
        // Note: Keyword_must_be "File" 
        formData.append("File", file.blob, file.name);
        //formData.append("FileName", file)
        return axios.post(url, formData, {
            headers: {'Content-Type': "multipart/form-data"}
        }).then(responseBody)
    },
    postTicketForm: async (url: string, ticket: any, file: any) => {
        const formData = new FormData();
        //const blob = await fetch(file).then((res) => res.blob());
        // Note: Keyword_must_be "File" 
        for (var key in ticket) {
            formData.append(key, ticket[key]);
        }
        formData.append("File", file.blob, file.name);
        return axios.post(url, formData, {
            headers: {'Content-Type': "multipart/form-data"}
        }).then(responseBody)
    },
    postTicketForms: async (url: string, ticket: any, data: Array<{blob: Blob, name: string}>) => {
        const formData = new FormData();
        //const blob = await fetch(file).then((res) => res.blob());
        // Note: Keyword_must_be "File" 
        for (var key in ticket) {
            formData.append(key, ticket[key]);
        }
        
        let blobData: Blob[] = [];
        let nameData: string[]= []
        console.log("ITEM: OUTSIDE ", data[0]);
        for (var i = 0; i < data.length; i++) {
            blobData.push(data[i].blob);
            nameData.push(data[i].name);
            console.log("ITEM: ", data[i]);
            formData.append("File", data[i].blob, data[i].name);
        }
        console.log("FORMDATA: ", formData);
        return axios.post(url, formData, {
            headers: {'Content-Type': "multipart/form-data"}
        }).then(responseBody)
    },
    postTextForm: async (url: string, file: Blob) => {
        const formData = new FormData();
        //const blob = await fetch(file).then((res) => res.blob());
        // Note: Keyword_must_be "File" 
        formData.append("File", file);
        //formData.append("FileName", file)
        return axios.post(url, formData, {
            headers: {'Content-Type': 'text/plain; charset="utf-8"'}
        }).then(responseBody)
    },
}

const Tickets = {
    list: (): Promise<ITicket[]> => requests.get("/tickets"),
    details: (id: string) => requests.get(`/tickets/${id}`),
    create: (ticket: ITicket) => requests.post(`/tickets`, ticket),
    createWithPhoto: (ticket: ITicket, photo: Blob) => requests.postTicketForm(`/tickets/withPhoto`, ticket, photo),
    createTicketMultiple: (ticket: ITicket, data: Array<{blob: Blob, name: string}>) => requests.postTicketForms(`/tickets/withPhoto`, ticket, data),
    update: (ticket: ITicket) => requests.put(`/tickets/${ticket.id}`, ticket),
    delete: (id: string) => requests.del(`/tickets/${id}`),
    addComment: (ticketId: string, comment: IComment) => requests.post(`/tickets/comment/${ticketId}`, comment),
    delComment: (ticketId: string, commentId: string) => requests.del(`/tickets/comment/${ticketId}/${commentId}`),
    editComment: (ticketId: string, commentId: string, body: any) => requests.put(`/tickets/comment/${ticketId}/${commentId}`, body),
    addPhoto: (ticketId: string, photo: Blob): Promise<ITicketPhoto> => requests.postForm(`/photos/tickets/${ticketId}`, photo),
    delPhoto: (ticketId: string, photoId: string) => requests.del(`/photos/tickets/${ticketId}/${photoId}`),
    addTextFile: (ticketId: string, text: Blob): Promise<ITicketText> => requests.postTextForm(`/texts/tickets/${ticketId}`, text),
    delTextFile: (ticketId: string, textId: string) => requests.del(`/texts/tickets/${ticketId}/${textId}`)

}

const Groups = {
    list: (): Promise<IGroup[]> => requests.get("/groups"),
    details: (id: string) => requests.get(`/groups/${id}`),
    create: (group: IGroup) => requests.post(`/groups`, group),
    update: (group: IGroup) => requests.put(`/groups/${group.id}`, group),
    delete: (id: string) => requests.del(`/groups/${id}`),
    join: (id: string) => requests.post(`/groups/${id}/join`, {}),
    leave: (id: string) => requests.del(`/groups/${id}/join`),
    editMember: (groupId: string, username: {username: string}) => requests.put(`/groups/${groupId}/member`, username),
    addAnnouncement: (id: string, body: IAnnouncement) => requests.post(`/groups/announcement/${id}`, body),
    delAnnouncement: (groupId: string, announcementId: string) => requests.del(`/groups/announcement/${groupId}/${announcementId}`),
    uploadPhoto: (id: string, photo: Blob): Promise<IPhoto> => requests.postForm(`/photos/groups/${id}`, photo),
    deletePhoto: (groupId: string, photoId: string) => requests.del(`/photos/groups/${groupId}/${photoId}`)
}

const User = {
    current: (): Promise<IUser> => requests.get('/user'),
    login: (user: IUserFormValues): Promise<IUser> => requests.post(`/user/login`, user),
    delete: (user: string) => requests.del(`/user/delete/${user}`),
    register: (user: IUserFormValues): Promise<IUser> => requests.post(`/user/register`, user),
    refreshToken: (): Promise<IUser> => requests.post(`/user/refreshToken`, {}),    
}

const Profiles = {
    get: (username: string): Promise<IProfile> => requests.get(`profiles/${username}`),
    uploadPhoto: (photo: Blob): Promise<IPhoto> => requests.postForm(`/photos`, photo),
    setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
    deletePhoto: (id: string) => requests.del(`/photos/${id}`),
    editProfile: (profile: IProfileEdits) => requests.put(`/profiles`, profile)
}

export default { Tickets, Groups, User, Profiles };
