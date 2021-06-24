import { getKey, saveKey } from "../../LocalStorage/user";
import {
    ERROR_REQUEST,
    LOAD_USER_DETAIL,
    LOADING,
    LOADING_SPINNER,
    LOGIN,
    LOGIN_ERROR,
    LOGIN_FAILED,
    LOGIN_POPUP,
    LOGIN_POPUP_STATUS,
    LOGOUT,
    PARENT_PRODUCT_ID,
    PRODUCT_ID,
    PRODUCT_LIST,
    PRODUCT_NPARENT_LIST,
    PRODUCT_POPUP,
    SET_CATEGORIES,
    SET_LOCATION,
    SET_ORG_IMG,
    SET_USER_DETAIL,
    SHOW_LOADING,
    SIGN_UP,
    SIGN_UP_FAILED,
    SITE_LIST,
    SITE_POPUP,
    STOP_LOADING,
    USER_DETAIL,
    GET_MESSAGES,
    GET_NOTIFICATIONS,
    MESSAGE_ALERT,
    NOTIFICATION_ALERT,
    UNREAD_MESSAGES,
    UNREAD_NOTIFICATIONS,
} from "../types";

export const initialState = {
    loginPopUpStatus: 0,
    loading: false,
    isLoggedIn: false,
    rememberMe: false,
    loginFailed: false,
    loginError: "",
    signUpError: "",
    signUpFailed: false,
    isCustomer: false,
    token: {},
    userDetail: null,
    showProductPopUp: false,
    showCreateProduct: false,
    showCreateSubProduct: false,
    showProductView: false,
    showSubProductView: false,
    product: null,
    parentProduct: null,
    productList: [],
    productWithoutParentList: [],
    siteList: [],
    showSitePopUp: false,
    orgImage: null,
    messages: [],
    notifications: [],
    messageAlert: false,
    notificationAlert: false,
    unreadMessages: false,
    unreadNotifications: false,
};

const reducer = (state = initialState, action) => {
    const newState = { ...state };

    switch (action.type) {
        case SET_USER_DETAIL:
            newState.userDetail = action.value;
            break;

        case SET_ORG_IMG:
            newState.orgImage = action.value;
            break;

        case LOADING_SPINNER:
            newState.reviewLoading = true;
            break;

        case SITE_POPUP:
            newState.showSitePopUp = action.value;
            break;

    

        case LOAD_USER_DETAIL:
            if (action.value) {
                newState.loginFailed = false;
                newState.isLoggedIn = true;
                newState.loading = false;
                newState.token = action.value.token;
                newState.userDetail = action.value;

                //
            } else {
                newState.isLoggedIn = false;
                newState.loading = false;
            }

            break;

        case LOGIN:
            newState.loginFailed = false;
            newState.isLoggedIn = true;
            newState.loading = false;
            newState.token = action.value.token;
            newState.showLoginPopUp = false;
            newState.userDetail = getKey("user");
            //
            //

            break;

        case LOGIN_ERROR:
            newState.loginError = action.value;
            newState.isLoggedIn = false;
            newState.loading = false;
            newState.loginFailed = true;

            break;

        case LOGOUT:
            newState.isLoggedIn = false;
            newState.loading = false;
            newState.loginFailed = false;
            newState.showLoginPopUp = false;
            newState.userDetail = null;
            newState.loading = false;
            saveKey("user", null);
            saveKey("token", null);

            // window.location.href=("/")

            break;

        case PRODUCT_LIST:
            newState.productList = action.value;
            newState.loading = false;
            break;

        case PRODUCT_NPARENT_LIST:
            newState.productWithoutParentList = action.value;
            newState.loading = false;
            break;

        case SITE_LIST:
            newState.siteList = action.value;
            newState.loading = false;
            break;

        case PARENT_PRODUCT_ID:
            newState.parentProduct = action.value;
            break;

        case PRODUCT_ID:
            newState.product = action.value;
            break;

        case PRODUCT_POPUP:
            newState.loginFailed = false;
            newState.showSubProductView = false;
            newState.showCreateProduct = false;
            newState.showCreateSubProduct = false;
            newState.showProductView = false;
            newState.showProductPopUp = action.value.show;

            let type = action.value.type;

            if (type === "create_product") {
                newState.showCreateProduct = true;
                newState.showCreateSubProduct = false;

                newState.parentProduct = null;
                // newState.parentProduct = "product-1612062286992-ad2bHnLWqF"
            } else if (type === "create_sub_product") {
                newState.showCreateProduct = false;

                newState.showCreateSubProduct = true;
                newState.parentProduct = action.value.parentId;
                // newState.parentProduct = "product-1612062286992-ad2bHnLWqF"
            } else if (type === "product_view") {
                newState.showProductView = true;
            } else if (type === "sub_product_view") {
                newState.showSubProductView = true;
            }

            break;

        case LOGIN_POPUP:
            newState.loginFailed = false;
            newState.showLoginPopUp = action.value;
            break;

        case LOGIN_POPUP_STATUS:
            newState.loginPopUpStatus = action.value;
            break;

        case SHOW_LOADING:
            newState.loading = action.value;

            break;

        case LOADING:
            newState.loading = true;
            break;


        case ERROR_REQUEST:
            newState.loading = false;
            break;

        case SET_CATEGORIES:
            newState.categories = action.value;

            break;

        case SET_LOCATION:
            newState.location = action.value;
            break;

        case LOGIN_FAILED:
            newState.loginFailed = true;
            newState.loginError = action.value;
            newState.isLoggedIn = false;
            newState.loading = false;
            break;
        case SIGN_UP_FAILED:
            newState.signUpFailed = true;
            newState.signUpError = action.value;
            newState.isLoggedIn = false;
            newState.loading = false;
            break;

        case STOP_LOADING:
            newState.loading = false;
            break;

        case USER_DETAIL:
            if (action.value.isGuest) {
                newState.isGuest = true;
                newState.isLoggedIn = false;
            } else {
                newState.isLoggedIn = true;
                newState.isGuest = false;
            }

            newState.userDetail = action.value;
            newState.loading = false;

            break;

        case SIGN_UP:


            newState.loginPopUpStatus = 5;
            newState.loading = false;
            break;

        case GET_MESSAGES:
            newState.messages = action.value;
            break;

        case GET_NOTIFICATIONS:
            newState.notifications = action.value;
            break;

        case MESSAGE_ALERT:
            newState.messageAlert = action.value;
            break;

        case NOTIFICATION_ALERT:
            newState.notificationAlert = action.value;
            break;
        case UNREAD_MESSAGES:
            newState.unreadMessages = action.value;
            break;
        case UNREAD_NOTIFICATIONS:
            newState.unreadNotifications = action.value;
            break;
    }

    return newState;
};

export default reducer;
