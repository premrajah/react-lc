import {getKey, saveKey} from "../../LocalStorage/user";

export const initialState = {
    age: 20,
    loginPopUpStatus:0,
    loading : false,
    isLoggedIn : false,
    rememberMe : false,
    loginFailed : false,
    loginError : "",
    signUpError : "",
    signUpFailed : false,
    isCustomer : false,
    token : {},
    userDetail : null,
    favorites : [],
    showProductPopUp:false,
    showCreateProduct:false,
    showCreateSubProduct:false,
    showProductView:false,
    showSubProductView:false,
    product:null,
    parentProduct:null,
    productList:[]



};

const reducer = (state = initialState, action) => {
    const newState = { ...state };

    switch (action.type) {



        case "SET_USER_DETAIL":


            newState.userDetail=( action.value);



            break;




        case "LOADING_SPINNER":

            newState.reviewLoading = true;

            break;
        case "REVIEW_BOX_OPEN":

            newState.reviewBoxOpen = action.value;

            break;

        case "LOAD_USER_DETAIL":

            if (action.value) {
                newState.loginFailed = false;
                newState.isLoggedIn = true;
                newState.loading = false;
                newState.token = action.value.token

                newState.userDetail = action.value

                console.log(newState.userDetail)


            }else {

                newState.isLoggedIn = false;
                newState.loading = false;
            }

            break;

        case "LOGIN":

            newState.loginFailed = false;
            newState.isLoggedIn = true;
            newState.loading = false;
            newState.token = action.value.token
            newState.showLoginPopUp = false;
            newState.userDetail= getKey("user")
            console.log("Session user")
            console.log(getKey("user"))

            break;

        case "LOGIN_ERROR":

            newState.loginError = action.value;
            newState.isLoggedIn = false;
            newState.loading = false;
            newState.loginFailed = true


            break;

        case "LOGOUT":


            newState.isLoggedIn = false;
            newState.loading = false;
            newState.loginFailed = false
            newState.couponError = false
            newState.addressInput = false
            newState.cartItems = []
            newState.isGuest = false
            newState.showLoginPopUp = false
            newState.guestCartItems = []
            newState.couponError = false
            newState.showLoginCheckoutPopUp = false
            newState.userDetail = null
            newState.loading = false
            newState.favorites = []
            saveKey("user",null)
            saveKey("token",null)

            // window.location.href=("/")

            break;



        case "PRODUCT_LIST":


            // alert("product loaded")

            newState.productList = action.value
            newState.loading = false;

            console.log("product list loaded ")

            console.log(action.value)




            break;


        case "PARENT_PRODUCT_ID":

            newState.parentProduct = action.value
            // alert("parent set "+action.value.product.name)


            break;


        case "PRODUCT_ID":

           newState.product = action.value

            break;



        case "PRODUCT_POPUP":

            console.log("reducer")

            newState.loginFailed= false
            newState.showSubProductView= false
            newState.showCreateProduct= false
            newState.showCreateSubProduct= false
            newState.showProductView = false
            newState.showProductPopUp= action.value.show

            var type = action.value.type;

            if (type==="create_product") {

                newState.showCreateProduct = true
            }

            else if (type==="create_sub_product") {

                newState.showCreateSubProduct= true
            }

            else  if (type==="product_view") {

                newState.showProductView= true
            }

            else  if (type==="sub_product_view") {

                newState.showSubProductView= true
            }

            console.log(action.value+" product show value reducer")

            break;

        case "LOGIN_POPUP":

            console.log("reducer")
            newState.loginFailed= false
            newState.showLoginPopUp = action.value;
            console.log(action.value+" "+newState.showLoginPopUp)

            break;

        case "LOGIN_POPUP_STATUS":

            console.log("reducer")
            newState.loginPopUpStatus = action.value;

            break;


        case "SOCIAL_LOGIN_POPUP":

            console.log("reducer")
            // newState.loginFailed= false
            newState.showSocialLoginPopUp = action.value;
            newState.showLoginPopUp = action.value;
            // console.log(action.value+" "+newState.showLoginPopUp)


            break;

        case "SOCIAL_USER_INFO":

            console.log("reducer")
            // newState.loginFailed= false
            newState.socialUserInfo = action.value;
            // console.log(action.value+" "+newState.showLoginPopUp)


            break;



        case "SHOW_LOADING":

            newState.loading = action.value;

            break;

        case "LOADING":
            newState.loading = true;
            break;

        case "IS_GUEST":
            newState.isGuest = true;

            break;

        case "LOADING_COUPON":

            newState.couponCheckloading = true;
            newState.couponError = false;

            break;


        case "SLIDES_LOAD":

            newState.slides = action.value;
            break;


        case "TRENDING_LOAD":

            newState.trendingItems = action.value;

            break;


        case "REVIEW_SUCCESS":


            newState.reviewSuccessMessage = false

            break;


        case "REVIEW_SUBMIT":

            newState.loading = false;
            newState.reviewLoading= false
            newState.reviewBoxOpen = false;
            newState.reviewSuccessMessage = true

            break;

        case "ERROR_REQUEST":
            newState.loading = false;
            console.log(action.value)
            break;



        case "SET_CATEGORIES":

            newState.categories = action.value;
            console.log("set categories props")
            console.log(action.value)
            break;

        case "SET_LOCATION":
            newState.location = action.value;
            break;


        case "LOGIN_FAILED":
            newState.loginFailed = true;
            newState.loginError= action.value
            newState.isLoggedIn = false;
            newState.loading = false;
            break;
        case "SIGN_UP_FAILED":
            newState.signUpFailed = true;
            newState.signUpError= action.value
            newState.isLoggedIn = false;
            newState.loading = false;
            break;

        case "STOP-LOADING":
            newState.loading = false;
            break;

        case "USER_DETAIL":

            if (action.value.isGuest){

                newState.isGuest = true;
                newState.isLoggedIn = false;


            } else {

                newState.isLoggedIn = true;
                newState.isGuest = false;

            }

            newState.userDetail = action.value;
            newState.loading = false;

            break;




        case "SIGN_UP":


            // newState.showSocialLoginPopUp = false
            //
            // if (action.value.isGuest) {
            //
            //     newState.isGuest = true;
            //     newState.isLoggedIn = false;
            //
            // }else {
            //
            //     newState.isLoggedIn = true;
            //     newState.isGuest = false;
            // }
            //
            // console.log(" user sign up ")
            // console.log(action.value)
            //
            // newState.showLoginPopUp = false
            // newState.showLoginCheckoutPopUp = false
            // newState.userDetail = action.value;

            newState.loginPopUpStatus=5
            newState.loading = false;

            break;



    }

    return newState;
};


export default reducer;