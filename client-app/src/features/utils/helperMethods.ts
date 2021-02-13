import { IMember } from "../../app/models/groups";
import { IUser } from "../../app/models/user";

export function arrayContains(a: any[], obj: string) {
    var i = a.length;
    while (i--) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

export const createMember = (user: IUser):  IMember => {
    return {
        displayName: user.displayName,
        isHost: false,
        username: user.username,
        image: user.image!,
        isAdmin: false
    }
}

export const returnBlobFromFile = async (files: any[]) => {

    let fileToBlob = async (file: any) => 
        new Blob([new Uint8Array(await file.arrayBuffer())], {
        type: file.type,
        })

    if (files[0].type === "text/plain") {
        const formData = files[0];
        return formData;
    } else {
        const blub = await fileToBlob(files[0]);       
        return {blob: blub, name: files[0].name};
    }
}