import DOMPurify from "dompurify";
import { useEffect, useRef } from "react";
// import {uuid}  from  'uuidv4';
import { v4 as uuid } from "uuid";

export const { REACT_APP_BRANCH_ENV } = process.env;

export const dashboardUrl =
    REACT_APP_BRANCH_ENV === "master"
        ? "https://dash.makealoop.io/"
        : REACT_APP_BRANCH_ENV === "stage"
        ? "https://dash-stage.makealoop.io/"
        : REACT_APP_BRANCH_ENV === "local"
        ? "https://dash-dev.makealoop.io/"
        : "https://dash-dev.makealoop.io/";

export const baseUrl =
    REACT_APP_BRANCH_ENV === "master"
        ? "https://graph.makealoop.io/api/2/"
        : REACT_APP_BRANCH_ENV === "stage"
        ? "https://graph-stage.makealoop.io/api/2/"
        : REACT_APP_BRANCH_ENV === "local"
        ? "http://127.0.0.1/api/2/"
        : "https://graph-dev.makealoop.io/api/2/";

export const baseImgUrl =
    REACT_APP_BRANCH_ENV === "master"
        ? "https://graph.makealoop.io"
        : REACT_APP_BRANCH_ENV === "stage"
        ? "https://graph-stage.makealoop.io"
        : REACT_APP_BRANCH_ENV === "local"
        ? "http://127.0.0.1"
        : "https://graph-dev.makealoop.io";

export const frontEndUrl =
    REACT_APP_BRANCH_ENV === "master"
        ? "http://u.lpcy.uk/"
        : REACT_APP_BRANCH_ENV === "stage"
        ? "http://s.lpcy.uk/"
        : REACT_APP_BRANCH_ENV === "local"
        ? "http://127.0.0.1/"
        : "http://d.lpcy.uk/";

export const gaTID =
    REACT_APP_BRANCH_ENV === "master"
        ? "UA-216464174-1"
        : REACT_APP_BRANCH_ENV === "stage"
        ? "UA-216464174-2"
        : REACT_APP_BRANCH_ENV === "local"
        ? "UA-216464174-3"
        : "UA-216464174-3";

console.log(`REACT_APP_BRANCH_ENV ${REACT_APP_BRANCH_ENV}`);
console.log(`baseUrl ${baseUrl}, dashboardUrl ${dashboardUrl}`);
console.log(`baseImgUrl ${baseImgUrl}`);
console.log(`frontEndUrl ${frontEndUrl}`);

export const googleApisBaseURL = "https://maps.googleapis.com/maps/api/";

export const checkImage = (url) => {
    return /(jpg|jpeg|png|webp|avif|gif|svg)/.test(url);
};



export const MIME_TYPES = {
    JPEG: "image/jpeg",
    JPG: "image/jpg",
    PNG: "image/png",
    MP4: "video/mp4",
    MOV: "video/quicktime",
    DOC: "application/msword",
    PDF: "application/pdf",
    APP_RTF: "application/rtf",
    DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    TEXT_RTF: "text/rtf",
    XLS: "application/vnd.ms-excel",
    XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

export const MIME_TYPES_ARRAY = Object.keys(MIME_TYPES).map((key)=>MIME_TYPES[key])

export const MIME_TYPES_ACCEPT =
    "image/jpeg,image/jpg,image/png,video/mp4," +
    "video/quicktime,application/msword,application/pdf," +
    "application/rtf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/rtf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
export const CAMPAIGN_FILTER_VALUES = ["name", "description"];

export const ENTITY_TYPES = {
    Product: "product",
    Site: "site",
    Event: "event"
}

export const RECUR_UNITS = [
    { key: "DAY", value: "Day" },
    { key: "WEEK", value: "Week" },
    { key: "MONTH", value: "Month" },
    { key: "YEAR", value: "Year" },
];

export const BYTES_TO_SIZE = (bytes) => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "n/a";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    if (i === 0) return `${bytes} ${sizes[i]})`;
    return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
};

export const TRANSPORT_MODES = [
    "CUSTOM",
    "ROAD",
    "RAIL",
    "AIR",
    "SEA",
    "ROAD_SEA_28",
    "ROAD_RAIL_28",
    "ROAD_AIR_28",
];

export const PRODUCTS_FILTER_VALUES = [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "condition", label: "Condition" },
    { key: "sku.brand", label: "Brand" },
    { key: "category", label: "Category" },
    { key: "type", label: "Type" },
    { key: "state", label: "State" },
    { key: "year_of_making", label: "Year Of Manufacture" },
    { key: "model", label: "Model" },
    { key: "serial", label: "Serial No." },
];
export const PRODUCTS_FILTER_VALUES_KEY = [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "condition", label: "Condition" },
    { key: "sku.brand", label: "Brand" },
    { key: "category", label: "Category" },
    { key: "type", label: "Type" },
    { key: "state", label: "State" },
    { key: "year_of_making", label: "Year Of Manufacture" },
    { key: "sku.model", label: "Model" },
    { key: "sku.serial", label: "Serial No." },
];

export const PRODUCTS_FIELD_SELECTION = [
    { key: "name", value: "Name", checked: true },
    { key: "description", value: "Description", checked: true },
    { key: "category", value: "Category", checked: true },
    { key: "type", value: "Type", checked: true },
    { key: "state", value: "State", checked: true },
    { key: "condition", value: "Condition" },
    { key: "sku.brand", value: "Brand" },
    { key: "sku.power_supply", value: "Power Supply" },
    { key: "volume", value: "Volume" },
    { key: "units", value: "Units" },
    { key: "year_of_making", value: "Year Of Manufacture" },
    { key: "sku.model", value: "Model", checked: true },
    { key: "sku.serial", value: "Serial No.", checked: true },
    { key: "sku.upc", value: "UPC" },
    { key: "sku.sku", value: "SKU" },
    { key: "external_reference", value: "External Reference" },
    { key: "sku.part_no", value: "Part No" },
    { key: "sku.gross_weight_kgs", value: "Gross Weight Kgs", checked: true },
    { key: "sku.embodied_carbon_kgs", value: "Embodied Carbon Kgs", checked: true },
    { key: "site", value: "Site", checked: true },
];

export const SITES_FILTER_VALUES = [
    { key: "name", label: "Name" },
    { key: "site id", label: "Site ID" },
    { key: "address", label: "Address" },
];

export const LINK_EXISTING_FIELDS = [
    { key: "name", label: "Name", type: "text" },
    {
        key: "products",
        label: "Products",
        type: "multiple",
        fields: [
            {
                index: uuid(),
                key: "product",
                type: "dynamicselect",
                label: "Select Product",
            },
        ],
    },
];
export const LISTING_FILTER_VALUES = [
    { key: "name", label: "Name" },
    { key: "product_name", label: "Product Name" },
];
export const CYCLE_FILTER_VALUES = [
    { key: "search_name", label: "Search Name" },
    { key: "listing_name", label: "Listing Name" },
    { key: "product_name", label: "Product Name" },
];

export const MATCH_STRATEGY_OPTIONS = ["exact_match", "partial_p90", "partial_p80", "partial_p75"];
export const MERGE_STRATEGY_OPTIONS = ["always_new", "pick_first", "always_fail", "pick_any"];
export const ISSUES_PRIORITY = ["low", "medium", "high"];

export const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

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
};

export const createMarkup = (html) => {
    return {
        __html: DOMPurify.sanitize(html),
    };
};

/*
    Polling timer for hooks
    Usage in component

    useInterval(() => {
        // put your interval code here.
    }, 1000 * 10);
 */
export const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};

export const randomColorGen = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor}`;
};

export const randomRGBAGen = () => {
    let o = Math.round,
        r = Math.random,
        s = 255;
    return "rgba(" + o(r() * s) + "," + o(r() * s) + "," + o(r() * s) + "," + r().toFixed(1) + ")";
};
