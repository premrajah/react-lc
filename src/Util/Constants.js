const { REACT_APP_BRANCH_ENV } = process.env;



export const baseUrl = REACT_APP_BRANCH_ENV === "master" ?
    "http://graph.makealoop.io/api/2/" : "stage" ?
        "http://graph-stage.makealoop.io/api/2/" : "local" ?
        "http://127.0.0.1/api/2/" : "http://graph-dev.makealoop.io/api/2/";

export const baseImgUrl = REACT_APP_BRANCH_ENV === "master" ?
    "http://graph.makealoop.io" : "stage" ?
        "http://graph-stage.makealoop.io" : "local" ?
        "http://127.0.0.1" : "http://graph-dev.makealoop.io";

export const frontEndUrl = REACT_APP_BRANCH_ENV === "master" ?
    "http://u.lpcy.uk/" : "stage" ?
        "http://s.lpcy.uk/" : "local" ?
        "http://127.0.0.1/" : "http://d.lpcy.uk/";





