export const baseUrl = process.env.BRANCH_ENV === "master" ? "http://graph.makealoop.io/api/2/" : "http://graph-dev.makealoop.io/api/2/";

// CHANDAN: WHat is this used for?
export const baseImgUrl = process.env.BRANCH_ENV === "master" ? "http://graph.makealoop.io" : "http://graph.makealoop.io";

// CHANDAN: What is this used for?
export const frontEndUrl = process.env.BRANCH_ENV === "master" ? "http://dev-react-2.makealoop.io/" : "http://dev-react-2.makealoop.io/";



