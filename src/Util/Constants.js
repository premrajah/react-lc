const { REACT_APP_BRANCH_ENV } = process.env;



export const baseUrl = REACT_APP_BRANCH_ENV === "master" ?
    "http://graph.makealoop.io/api/2/" : "local" ?
        "http://graph-dev.makealoop.io/api/2/" : "http://graph-dev.makealoop.io/api/2/";

export const baseImgUrl = REACT_APP_BRANCH_ENV === "master" ?
    "http://graph.makealoop.io" : "local" ?
        "http://graph-dev.makealoop.io" : "http://graph-dev.makealoop.io";

export const frontEndUrl = REACT_APP_BRANCH_ENV === "master" ?
    "http://u.lpcy.uk/" : "local" ?
        "http://d.lpcy.uk/" : "http://d.lpcy.uk/";





