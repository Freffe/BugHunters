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