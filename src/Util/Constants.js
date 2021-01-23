const { REACT_APP_BRANCH_ENV } = process.env;

console.log("REACT_APP_BRANCH_ENV : " + REACT_APP_BRANCH_ENV);

export const baseUrl = REACT_APP_BRANCH_ENV === "master" ? "http://graph.makealoop.io/api/2/" : "http://graph-dev.makealoop.io/api/2/";

// CHANDAN: What is this used for?
export const baseImgUrl = REACT_APP_BRANCH_ENV === "master" ? "http://graph.makealoop.io" : "http://graph-dev.makealoop.io";

// CHANDAN: What is this used for?
export const frontEndUrl = REACT_APP_BRANCH_ENV === "master" ? "http://ui.makealoop.io/" : "http://dev-react-2.makealoop.io/";

console.log("baseUrl : " + baseUrl);
console.log("baseImgUrl : " + baseImgUrl);


