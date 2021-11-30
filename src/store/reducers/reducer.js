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
    PRODUCT_NPARENT_LIST_PAGE,
    PRODUCT_NPARENT_NO_LIST,
    PRODUCT_POPUP,
    REVIEW_BOX_OPEN,
    REVIEW_SUBMIT,
    REVIEW_SUCCESS,
    SET_CATEGORIES,
    SET_LOCATION,
    SET_ORG_IMG,
    SET_USER_DETAIL,
    SHOW_LOADING,
    SIGN_UP,
    SIGN_UP_FAILED,
    SITE_LIST,
    SITE_PARENT_LIST,
    SITE_POPUP,
    SLIDES_LOAD,
    SOCIAL_LOGIN_POPUP,
    SOCIAL_USER_INFO,
    STOP_LOADING,
    TRENDING_LOAD,
    USER_DETAIL,
    GET_MESSAGES,
    GET_NOTIFICATIONS,
    MESSAGE_ALERT,
    NOTIFICATION_ALERT,
    UNREAD_MESSAGES,
    UNREAD_NOTIFICATIONS,
    PRODUCT_REGISTER,
    PRODUCT_RELEASE,
    SERVICE_AGENT_REQUEST,
    SHOW_SNACKBAR,
    CURRENT_PRODUCT,
    CURRENT_SITE,
    GET_LISTINGS,
    SITE_FORM_SHOW,
    SHOW_MULTIPLE_POP_UP,
    PRODUCT_PAGE_RESET,
    PRODUCT_NOT_FOUND, TOGGLE_RIGHTBAR,TOGGLE_GLOBAL_DIALOG
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
    showSiteProductView:false,
    product: null,
    parentProduct: null,
    productList: [],
    productWithoutParentList: [],
    productWithoutParentNoList: [],
    productWithoutParentListPage: [],
    siteList: [],
    siteParentList: [],
    allListings: [],
    showSitePopUp: false,
    orgImage: null,
    messages: [],
    notifications: [],
    messageAlert: false,
    notificationAlert: false,
    unreadMessages: false,
    unreadNotifications: false,
    productPageOffset:0,
    productPageSize:400,
    lastPageReached:false,
    serviceAgentRequests: [],
    productReleaseRequests: [],
    productReleaseRequested: [],
    productRegisterRequests: [],
    snackbarMessage: { show: false, message: "", severity: "" },
    currentProduct: null,
    currentProductLoading: false,
    currentSite: null,
    currentSiteLoading: false,
    signUpPageSubmitted:false,
    showMultiplePopUp: {show:false,type:null},
    createProductId:null,
    productNotFound:false,
    showRightBar:false,
    showGlobalDiaglog:false,
    showSiteForm:{
        show:false,
        item:null
    }


};

const reducer = (state = initialState, action) => {
    const newState = { ...state };

    switch (action.type) {
        case SET_USER_DETAIL:
            newState.userDetail = action.value;
            break;


        case TOGGLE_RIGHTBAR:
            newState.showRightBar = !state.showRightBar;
            break;
        case TOGGLE_GLOBAL_DIALOG:
            newState.showGlobalDiaglog = !state.showGlobalDiaglog;
            break;
        case SET_ORG_IMG:
            newState.orgImage = action.value;
            break;

        case SHOW_MULTIPLE_POP_UP:
            console.log("shpw mulitp;l")
            newState.showMultiplePopUp = action.value;
            break;
        case LOADING_SPINNER:
            newState.reviewLoading = true;
            break;

        case SITE_POPUP:
            newState.showSitePopUp = action.value;

            break;

        case CURRENT_PRODUCT:
            newState.productNotFound = false;

            newState.currentProduct = action.value;

            break;
        case PRODUCT_NOT_FOUND:
            newState.productNotFound = action.value;
            break;
        case SITE_FORM_SHOW:
            newState.showSiteForm = action.value;
            break;

        case PRODUCT_RELEASE:
            newState.productReleaseRequests = action.value;
            newState.productReleaseRequested = [];
            newState.productReleaseRequested = action.value.filter(
                (item) => item.Release.stage === "requested"
            );
            break;

        case PRODUCT_REGISTER:
            newState.productRegisterRequests = action.value;
            break;

        case SERVICE_AGENT_REQUEST:
            newState.serviceAgentRequests = action.value;
            break;

        case REVIEW_BOX_OPEN:
            newState.reviewBoxOpen = action.value;
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
            newState.notifications = [];
            newState.messages = [];
            newState.token = action.value.token;
            newState.showLoginPopUp = false;
            newState.userDetail = getKey("user");
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
            newState.orgImage = null;
            newState.loginFailed = false;
            newState.couponError = false;
            newState.addressInput = false;
            newState.productWithoutParentList = [];
            newState.productList = [];
            newState.siteList = [];
            newState.showLoginPopUp = false;
            newState.userDetail = null;
            newState.token = {};
            newState.loading = false;
            newState.notifications = [];
            newState.messages = [];
            newState.serviceAgentRequests = [];
            newState.productReleaseRequests = [];
            newState.productReleaseRequested = [];
            newState.productRegisterRequests = [];
            saveKey("user", null);
            saveKey("token", null);
            break;

        case SHOW_SNACKBAR:
            newState.snackbarMessage = action.value;

            break;


        case CURRENT_SITE:
            newState.currentSite = action.value;

            break;
        case PRODUCT_LIST:
            newState.productList = action.value;
            newState.loading = false;
            break;

        case PRODUCT_PAGE_RESET:

            newState.productPageSize=20
            newState.productPageOffset = 0
            newState.productWithoutParentListPage= [];

            break;

        case PRODUCT_NPARENT_LIST_PAGE:

            newState.lastPageReached=false

            let initialLength=state.productWithoutParentListPage.length

            if (action.value.size) {
                newState.productPageOffset = action.value.offset + action.value.size
            }
            else{
                newState.productPageSize = state.productPageSize
                newState.productPageOffset = state.productPageOffset+state.productPageSize
            }

            let prevListPage = []
            if (!action.value.refresh) {
                prevListPage = state.productWithoutParentListPage
            }else{
                newState.productPageSize=20
                newState.productPageOffset = 20+ 20
            }

            let concatList=(action.value.val)

            prevListPage=prevListPage.concat(concatList)
            prevListPage=prevListPage.filter( (ele, ind) => ind === prevListPage.findIndex( elem => elem._key === ele._key ))


            newState.productWithoutParentListPage= prevListPage;


            let newLength=prevListPage.length

            if (newLength===initialLength){

                newState.lastPageReached=true
                console.log("last page reached")
            }else{
                newState.lastPageReached=false
            }

            console.log(action.value.val)

            // newState.productWithoutParentList= (action.value.val);

            newState.loading = false;



            break;
        case PRODUCT_NPARENT_LIST:

            // if (action.value.val.length<state.productPageSize){
            //     newState.lastPageReached=true
            //
            //     console.log("lst page reached "+action.value.offest+"   "+action.value.val.length)
            //
            //
            //
            // }else{
            //
            //     newState.lastPageReached=false
            // }
            // newState.lastPageReached=false
            //
            // let prevList= state.productWithoutParentList
            // // newState.productWithoutParentList= prevList.concat(action.value.val);


            newState.productWithoutParentList= (action.value.val);

            newState.loading = false;

            newState.productPageOffset=action.value.offset
            newState.productPageSize=action.value.size

            break;

        case PRODUCT_NPARENT_NO_LIST:


            newState.productWithoutParentNoList= (action.value.val);

            newState.loading = false;


            break;



        case SITE_LIST:
            newState.siteList = action.value;
            newState.loading = false;
            break;

        case SITE_PARENT_LIST:
            newState.siteParentList = action.value;
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
            newState.showSiteProductView = false;
            newState.showCreateProduct = false;
            newState.showCreateSubProduct = false;
            newState.showProductView = false;
            newState.showProductPopUp = action.value.show;

            let type = action.value.type;

            if (type === "create_product") {

                if ( action.value.id)
                newState.createProductId = action.value.id;

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
            }
            else if (type === "sub_product_view") {
                newState.showSubProductView = true;
            }

            else if (type === "site_product_view") {
                newState.showSiteProductView = true;
            }


            break;

        case LOGIN_POPUP:
            newState.loginFailed = false;
            newState.showLoginPopUp = action.value;
            break;

        case LOGIN_POPUP_STATUS:
            newState.loginPopUpStatus = action.value;
            break;

        case SOCIAL_LOGIN_POPUP:
            // newState.loginFailed= false
            newState.showSocialLoginPopUp = action.value;
            newState.showLoginPopUp = action.value;
            //
            break;

        case SOCIAL_USER_INFO:
            // newState.loginFailed= false
            newState.socialUserInfo = action.value;
            //

            break;

        case SHOW_LOADING:
            newState.loading = action.value;

            break;

        case LOADING:
            newState.loading = true;
            break;



        case SLIDES_LOAD:
            newState.slides = action.value;
            break;

        case TRENDING_LOAD:
            newState.trendingItems = action.value;
            break;

        case REVIEW_SUCCESS:
            newState.reviewSuccessMessage = false;
            break;

        case REVIEW_SUBMIT:
            newState.loading = false;
            newState.reviewLoading = false;
            newState.reviewBoxOpen = false;
            newState.reviewSuccessMessage = true;
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
            newState.isLoggedIn = true;

            newState.userDetail = action.value;
            newState.loading = false;

            break;

        case SIGN_UP:
            newState.loginPopUpStatus = 5;
            newState.loading = false;
            newState.signUpPageSubmitted=true
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
        case GET_LISTINGS:
            newState.allListings = action.value;
            break;
    }

    return newState;
};

export default reducer;
