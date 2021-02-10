const { REACT_APP_BRANCH_ENV } = process.env;



export const baseUrl = REACT_APP_BRANCH_ENV === "master" ?
    "http://graph.makealoop.io/api/2/" : REACT_APP_BRANCH_ENV === "stage" ?
        "http://graph-stage.makealoop.io/api/2/" : REACT_APP_BRANCH_ENV === "local" ?
        "http://127.0.0.1/api/2/" : "http://graph-dev.makealoop.io/api/2/";

export const baseImgUrl = REACT_APP_BRANCH_ENV === "master" ?
    "http://graph.makealoop.io" : REACT_APP_BRANCH_ENV === "stage" ?
        "http://graph-stage.makealoop.io" : REACT_APP_BRANCH_ENV === "local" ?
        "http://127.0.0.1" : "http://graph-dev.makealoop.io";

export const frontEndUrl = REACT_APP_BRANCH_ENV === "master" ?
    "http://u.lpcy.uk/" : REACT_APP_BRANCH_ENV === "stage" ?
        "http://s.lpcy.uk/" : REACT_APP_BRANCH_ENV === "local" ?
        "http://127.0.0.1/" : "http://d.lpcy.uk/";





