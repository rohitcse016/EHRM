import { fetchMenuData } from "@/services/apiRequest/api";
import { getPackageId, getUserInLocalStorage, setMenu } from "./common";



const getModulePath = (name: string) => {
    const { verifiedUser, selectedPackageId }: any = getUserInLocalStorage();

    switch (name) {

        case "User Management":
            return "/user-management/list";

        case "Change Password":
            return "/UserManagement/change-password";

        case "Role Form Permission":
            return "/userrole";



        case "Search Employee":
            return "/employee/list";

        case "Employee Registration":
            return "/employee/registration";

        case "Caste":
            return "/master/caste";

        case "Emp Raw Data Correction":
            return "/attendance/DataCorrection";

        case "SubCaste":
            return "/master/SubCaste";

        case "Department":
            return "/master/department";

        case "Designation":
            return "/master/designation";

        case "State":
            return "/master/state";

        case "District":
            return "/master/district";


        default:
            if (verifiedUser.userTypeID === "11") {
                return "/candidate-dashboard";
            } else {
                return "/";
            }

    }
}

export const createMenu = async () => {

    const { verifiedUser, selectedPackageId }: any = getUserInLocalStorage();

    const param: any = {
        userID: verifiedUser?.userID,
        orgID: verifiedUser?.orgID,
        roleID: -1,
        packageID: getPackageId(),
        userTypeID: verifiedUser?.userTypeID,
        portalTypeID: -1,
        ipAddres: "",
        type: 1
    }
    const menuData = await fetchMenuData(param);
    const { moduleRight, formRight } = menuData.data;
    const menu: any = [];


    for (let i = 0; i < moduleRight.length; i++) {

        menu.push({
            name: moduleRight[i]['mModuleName'],
            routes: [],
            path: getModulePath(moduleRight[i]['mModuleName']),
        })

        for (let j = 0; j < formRight.length; j++) {

            if (formRight[j]?.mModuleID === moduleRight[i]?.moduleID) {

                menu[i]['routes'].push({
                    name: formRight[j]['displayName'],
                    path: getModulePath(formRight[j]['displayName']),
                });
            }
        }
    }

    setMenu(menu)
    return menu;
}