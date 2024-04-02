import user from "mock/user";


export const getUserInLocalStorage = () => {
    return JSON.parse(localStorage.getItem("user") as string);
}

export const setPackageId = (value: string) => {
    return localStorage.setItem("selectedPackageId", value);
}

export const getPackageId = () => {
    return JSON.parse(localStorage.getItem("selectedPackageId") as string);
}

export const getUserType = () => {
    const user = JSON.parse(localStorage.getItem("user") as string);
    if (user.verifiedUser.userTypeID == '1')
        return 'Admin'
    else
        if (user.verifiedUser.userTypeID == '11')
            return 'Candidate'
        else
            if (user.verifiedUser.userTypeID == '21')
                return 'InstituteUser'
}

export const setMenu = (value: string) => {
    return localStorage.setItem("menu", JSON.stringify(value));
}

export const getMenu = () => {
    return JSON.parse(localStorage.getItem("menu") as string);
}

export const setAvailableRoomDate = (value: string) => {
    return localStorage.setItem("availableRoomDate", JSON.stringify(value));
}

export const getAvailableRoomDate = () => {
    return JSON.parse(localStorage.getItem("availableRoomDate") as string);
}