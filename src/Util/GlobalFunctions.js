import axios from "axios";
import {baseUrl, MIME_TYPES, MIME_TYPES_ARRAY} from "./Constants";
import React from "react";
import moment from "moment/moment";



export const capitalize = (sentence) => {
    if (!sentence) return "";
    return sentence
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

const addAndFilters = (filters) => {
    let url = "";

    filters.forEach((row, index) => {
        url = url + "";

        row.filters &&
            row.filters.forEach((item, index) => {
                if (index > 0) {
                    url = url + row.operator;
                }
                url = url + item.key + item.operator + item.value;
            });

        // url = url + ")"
    });

    return url;
};

export const fetchErrorMessage = (e) => {
    let errorString = "";

    try {
        if (e.response.data.errors && e.response.data.errors.length > 0) {
            e.response.data.errors.forEach((item) => {
                errorString = errorString + " " + item.message;
            });
        } else {
            errorString = e.response.status + " error received from server";
        }
    } catch (e) {
        errorString = "Unknown error occurred.";
    }

    return errorString;
};

export const arrangeAlphabatically = (items) => {
    return items.sort(function (a, b) {
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }
        return 0;
    });
};

export const arrangeObjectKeysAlphabatically = (obj) => {
    return Object.keys(obj).sort(function (a, b) {
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }

        return 0;
    });
};

export const sortArraysByKey = (array, key) => {
    return array.sort(function (a, b) {
        if (a[key] < b[key]) {
            return -1;
        }
        if (a[key] > b[key]) {
            return 1;
        }
        return 0;
    });
};

export const createSeekURL = (
    entity,
    no_parent,
    count,
    offset,
    pageSize,
    filters,
    filterType,
    extra
) => {
    let url = `${baseUrl}seek?name=${entity}${extra ? "&" + extra : ""}`;

    url = url + `&count=${count}`;

    if (offset === 0 || offset > 0) {
        url = url + `&offset=${offset}&size=${pageSize}`;
    }
    if (no_parent) {
        url = url + "&no_parent=" + no_parent;
    }

    if (filters && filters.length > 0 && filterType === "AND") {
        url = url + "&or=" + addAndFilters(filters);
    }

    return url;
};

export const ifOwner = (userDetail, orgId) => {
    return userDetail.orgId === orgId;
};

export const ownerCheck = (userDetail, orgId) => {
    return userDetail.orgId === orgId;
};

export const seekAxiosGet = (url, doNotEncode, controller) => {
    let urlEncode = url;

    if (!doNotEncode) {
        urlEncode = encodeURI(urlEncode);
    }

    return axios
        .get(urlEncode, {
            signal: controller ? controller.signal : null,
        })
        .catch((error) => {
            console.error(error);
            return "Unknown error occurred.";
        });
};

export const getTimeFormat = (time) => {
    return moment(time).format("DD MMM YYYY");
};

export const isEmptyHtml = (el) => {
    // return trim(el.html())
};

export const getActionName = (actionName) => {
    if (actionName === "withdrawn") {
        return "Withdraw";
    } else if (actionName === "cancelled") {
        return "Cancel";
    } else if (actionName === "rejected") {
        return "Rejected";
    } else if (actionName === "accepted") {
        return "Accept";
    } else if (actionName === "declined") {
        return "Decline";
    } else if (actionName === "counter") {
        return "Counter Offer";
    } else if (actionName === "confirmed") {
        return "Confirm";
    } else if (actionName === "completed") {
        return "complete";
    } else if (actionName === "progress") {
        return "Progress";
    } else {
        return actionName;
    }
};

export const LoaderAnimated = () => {
    return (
        <div className="wrapper-loader justify-content-center text-center">
            <svg
                className="hourglass"
                xmlns="http://www.w3.org/2000/svg mr-4"
                viewBox="0 0 120 206"
                preserveAspectRatio="none">
                <path
                    className="middle"
                    d="M120 0H0v206h120V0zM77.1 133.2C87.5 140.9 92 145 92 152.6V178H28v-25.4c0-7.6 4.5-11.7 14.9-19.4 6-4.5 13-9.6 17.1-17 4.1 7.4 11.1 12.6 17.1 17zM60 89.7c-4.1-7.3-11.1-12.5-17.1-17C32.5 65.1 28 61 28 53.4V28h64v25.4c0 7.6-4.5 11.7-14.9 19.4-6 4.4-13 9.6-17.1 16.9z"
                />
                <path
                    className="outer"
                    d="M93.7 95.3c10.5-7.7 26.3-19.4 26.3-41.9V0H0v53.4c0 22.5 15.8 34.2 26.3 41.9 3 2.2 7.9 5.8 9 7.7-1.1 1.9-6 5.5-9 7.7C15.8 118.4 0 130.1 0 152.6V206h120v-53.4c0-22.5-15.8-34.2-26.3-41.9-3-2.2-7.9-5.8-9-7.7 1.1-2 6-5.5 9-7.7zM70.6 103c0 18 35.4 21.8 35.4 49.6V192H14v-39.4c0-27.9 35.4-31.6 35.4-49.6S14 81.2 14 53.4V14h92v39.4C106 81.2 70.6 85 70.6 103z"
                />
            </svg>

            <span className={"m-4"}>Loading ...</span>
        </div>
    );
};

export const removeTimeToStart = (date = new Date()) => {
    let timestampConvertedDate = new Date(date);
    let dateConverted = new Date(
        timestampConvertedDate.getFullYear(),
        timestampConvertedDate.getMonth(),
        timestampConvertedDate.getDate()
    );

    return dateConverted;
};

export const removeTime = (date = new Date()) => {
    let timestampConvertedDate = new Date(date);

    let dateString =
        timestampConvertedDate.getFullYear() +
        "-" +
        ("0" + (timestampConvertedDate.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + timestampConvertedDate.getDate()).slice(-2);

    return dateString;
};

export const getInitials = (name = "") =>
    name
        .replace(/\s+/, " ")
        .split(" ")
        .slice(0, 2)
        .map((v) => v && v[0].toUpperCase())
        .join("");

export const hasNumber = (myString) => {
    return /\d/.test(myString);
};

export const hasUpperCase = (myString) => {
    return /[A-Z]/.test(myString);
};

export const hasLowerCase = (myString) => {
    return /[a-z]/.test(myString);
};
export const hasSplChar = (myString) => {
    return /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(myString);
};

export const checkIfMimeTypeAllowed = (file) => {
    let flagFound=false
    const mimeTypesArray =  MIME_TYPES_ARRAY;

        mimeTypesArray.map((typeAllowed)=>{
        if (typeAllowed.toLowerCase()===file.type.toLowerCase()){
            flagFound=true
        }
    })
    return flagFound
};
export const checkIfDocumentFromType = (mime_type) => {
    if (
        mime_type === "application/pdf" ||
        mime_type === "application/rtf" ||
        mime_type === "application/msword" ||
        mime_type === "text/rtf" ||
        mime_type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        mime_type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        mime_type === "application/vnd.ms-excel"
    ) {
        return true;
    } else return false;
};

export const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const addDays = (date, days) => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

export const exportToCSV = (csvData) => {
    let data = "";
    const tableData = [];

    const rows = csvData;
    rows.unshift([
        "Title",
        "Stage",
        "Process",
        "Resolution Date",
        "Recur (MS)",
        "Recur Value",
        "Recur Unit",
        "Description",
        "Product",
    ]);

    for (const row of rows) {
        const rowData = [];
        for (const column of row) {
            rowData.push(column);
        }
        tableData.push(rowData.join(","));
    }

    data += tableData.join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([data], { type: "text/csv" }));
    a.setAttribute("download", `event_list_${new Date().getDate()}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    this.setState({
        loadingEventsDownload: false,
    });
};
export const DETECT_URL_REGEX = /^http:\/\/([^\/]*)\/(.*)$/;
const DETECT_URL_REGEX_NEW = /(https?:\/\/[^\s]+)/g;

// export const DETECT_URL_REGEX="//g";

export const linkifyText = (text) => {
    let originalText = text;

    let newText = text;
    let matches = DETECT_URL_REGEX_NEW.exec(originalText);

    if (matches) {
        for (let i = 0; i < matches.length; i++) {
            newText = text.replace(
                matches[i],
                `<a target="_blank" rel="noopener noreferrer" href=${matches[i]}>${matches[i]} </a>`
            );
        }
    }

    return newText;
};

export const urlify = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text
        .toString()
        .split(urlRegex)
        .map((part) => {
            if (part.match(urlRegex)) {
                return <a href={part}>{part}</a>;
            }
            return part;
        });
};

export const getNumberFromString = (txt) => {
    var numb = txt.match(/\d/g);
    if (numb) numb = numb.join("");

    return numb;
};

export const cleanFilename = (string) => {
    if (!string) return;
    let fileExtension = string.substring(string.lastIndexOf(".") + 1, string.length) || string;
    let filenameWithOutExtension = string.replace(/\.[^/.]+$/, "");
    let cleanedFileName = filenameWithOutExtension.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    return `${cleanedFileName}.${fileExtension}`;
};

export const getSite = (site) => {
    let ProductToSite = site.ProductToSite;

    if (ProductToSite && ProductToSite.length > 0 && ProductToSite[0].entries.length > 0) {
        return ProductToSite[0].entries[0].Site;
    } else return null;
};

export const PreProcessCSVData = (text) => {
    try {
        if (text)
            text = text
                .toString()
                .replace("ı", "i")
                .replace("ç", "c")
                .replace("ö", "o")
                .replace("ş", "s")
                .replace("ü", "u")
                .replace("ğ", "g")
                .replace("İ", "I")
                .replace("Ç", "C")
                .replace("Ö", "O")
                .replace("Ş", "S")
                .replace("Ü", "U")
                .replace("Ğ", "G")
                .replace('"', '""')
                .trim();

        if (text && text.includes(",")) {
            text = '"' + text + '"';
        }
        return text;
    } catch (e) {
        console.log(e)
        return text;
    }
};


export const removeKeyFromObj = (obj, keys) => {
    for (let i = 0; i < keys.length; i++) {
        delete obj[keys[i]];
    }
    return obj;
};


