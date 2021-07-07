export const { REACT_APP_BRANCH_ENV } = process.env;

export const baseUrl =
    REACT_APP_BRANCH_ENV === "master"
        ? "http://graph.makealoop.io/api/2/"
        : REACT_APP_BRANCH_ENV === "stage"
        ? "http://graph-stage.makealoop.io/api/2/"
        : REACT_APP_BRANCH_ENV === "local"
        ? "http://127.0.0.1/api/2/"
        : "http://graph-dev.makealoop.io/api/2/";

export const baseImgUrl =
    REACT_APP_BRANCH_ENV === "master"
        ? "http://graph.makealoop.io"
        : REACT_APP_BRANCH_ENV === "stage"
        ? "http://graph-stage.makealoop.io"
        : REACT_APP_BRANCH_ENV === "local"
        ? "http://127.0.0.1"
        : "http://graph-dev.makealoop.io";

export const frontEndUrl =
    REACT_APP_BRANCH_ENV === "master"
        ? "http://u.lpcy.uk/"
        : REACT_APP_BRANCH_ENV === "stage"
        ? "http://s.lpcy.uk/"
        : REACT_APP_BRANCH_ENV === "local"
        ? "http://127.0.0.1/"
        : "http://d.lpcy.uk/";

console.log("REACT_APP_BRANCH_ENV" + REACT_APP_BRANCH_ENV);
console.log("baseUrl" + baseUrl);
console.log("baseImgUrl" + baseImgUrl);
console.log("frontEndUrl" + frontEndUrl);

export const MIME_TYPES_ACCEPT =
    "image/jpeg,image/jpg,image/png,application/msword,application/pdf,application/rtf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/rtf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export const PRODUCTS_FILTER_VALUES = ["name", "description", "purpose", "category"];

export const MATCH_STRATEGY_OPTIONS = ["exact_match", "partial_p90", "partial_p80", "partial_p75"];
export const MERGE_STRATEGY_OPTIONS = ["always_new", "always_fail", "pick_first", "pick_any"];

export const capitalizeFirstLetter = (string) => (
    string.charAt(0).toUpperCase() + string.slice(1)
)

export const getImageAsBytes = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = () => {
            let arrayBuffer = reader.result;
            let bytes = new Uint8Array(arrayBuffer);
            resolve(bytes);
        };
        reader.onerror = (error) => reject(error);
    });
}

