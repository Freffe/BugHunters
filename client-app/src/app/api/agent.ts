import axios, { AxiosError, AxiosResponse } from 'axios';
import { history } from '../..';
import { IAnnouncement, IComment, IGroup } from '../models/groups';
import { IPhoto, IProfile, IProfileEdits } from '../models/profile';
import { ITicket, ITicketPhoto, ITicketText } from '../models/tickets';
import { IUser, IUserFormValues } from '../models/user';
import { store } from '../stores/store';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use((config: any) => {
    const token = window.localStorage.getItem("jwt");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

axios.interceptors.response.use(async response => {
    if (process.env.NODE_ENV === 'development') await sleep(1000);

    return response;
}, (error: AxiosError) => {
    console.log("error: ", error.response);
    
    const {status, data, config, headers} = error.response!;
    if (error.message === 'Network Error' && !error.response) {
        history.push('/NoNet');
    }

    if (status === 400) {
        if (typeof data === "string")
            return Promise.reject(error.response);
        if (config.method === 'get' && data.errors.hasOwnProperty('id'))
            history.push('/notfound');
        if (data.errors) {
            const flattenErrors = [];
            for (const key in data.errors) {
                if (data.errors[key]) {
                    flattenErrors.push(data.errors[key])
                }
            }
            throw flattenErrors.flat();
        }
    } 

    if (status === 401 && headers['www-authenticate']?.includes('The token expired'))
    {
        window.localStorage.removeItem("jwt");
        history.push("/");
        console.log("Your session has expired, please login again");
        //console.log(error.response);
    }
    if (status === 401)
    {
        history.push("/");
    }     
    if (status === 404 && config.url === "/user/login") {
        return Promise.reject(error.response);
    }
    if (status === 400 && config.url === "/user/login") {
        return Promise.reject(error.response);
    }
    if (status === 404) {
        history.push('/notfound');
    }

    if (status === 500) {
        store.commonStore.setServerError(data);
        history.push('/server-error')
    }
    //throw error.response;
    return Promise.reject(error.response);
})

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    del: (url: string) => axios.delete(url).then(responseBody),
    postForm: async (url: string, file: any) => {
        const formData = new FormData();
        // Note: Keyword_must_be "File" 
        if (file.blob) {
            formData.append("File", file.blob, file.name);
        } else {
            formData.append("File", file);
        }
        return axios.post(url, formData, {
            headers: {'Content-Type': "multipart/form-data"}
        }).then(responseBody)
    },
    postTicketForm: async (url: string, ticket: any, file: any) => {
        const formData = new FormData();
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
        for (var key in ticket) {
            formData.append(key, ticket[key]);
        }

        for (var i = 0; i < data.length; i++) {
            formData.append("File", data[i].blob, data[i].name);
        }

        return axios.post(url, formData, {
            headers: {'Content-Type': "multipart/form-data"}
        }).then(responseBody)
    },
    postTextForm: async (url: string, file: Blob) => {
        const formData = new FormData();
        formData.append("File", file);

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
const agent = { Tickets, Groups, User, Profiles };

export default agent;
