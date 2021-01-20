export const baseUrl = process.env.BRANCH_ENV === "master" ? "http://graph.makealoop.io/api/2/" : "http://graph-dev.makealoop.io/api/2/";

// CHANDAN: WHat is this used for?
//Sometimes img url is different from base url
export const baseImgUrl = process.env.BRANCH_ENV === "master" ? "http://graph.makealoop.io" : "http://graph.makealoop.io";

// CHANDAN: What is this used for?
//Arun: to redirect user to qr code, earlier it was different
export const frontEndUrl = process.env.BRANCH_ENV === "master" ? "http://dev-react-2.makealoop.io/" : "http://dev-react-2.makealoop.io/";



