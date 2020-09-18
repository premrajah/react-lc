import axios from "axios/index";
import {saveGuestData, saveUserData, saveUserToken,saveKey,getKey} from '../../LocalStorage/user'
import  {initialState} from "../reducers/reducer"

import {baseUrl,baseImgUrl} from  '../../Util/Constants'





export const enableCartLoading = () => {

    return {
        type: "IS_CART_LOADING"
    };

}


export const loadingSpinner = () => {
    return {
        type: "LOADING_SPINNER"
    };
};

export const loading = () => {
    return {
        type: "LOADING"
    };
};


export const loginFailed = (val) => {
    return {
          type: "LOGIN_FAILED", value: val
    };
};


export const stopLoading = () => {
    return {
        type: "STOP-LOADING"
    };
};

export const ageUpAsnc = val => {

    return { type: "AGE_UP", value: val };


};


export const reviewSuccess = val => {

    return { type: "REVIEW_SUCCESS", value: val };


};





export const slidesLoad = val => {

    return { type: "SLIDES_LOAD", value: val };


};


export const trendingLoad = val => {

    return { type: "TRENDING_LOAD", value: val };

};


export const setBookingResponse = val => {

    return { type: "BOOKING_RESPONSE", value: val };


};



export const setCategories = val => {

    return { type: "SET_CATEGORIES", value: val };


};


export const setLocation = val => {

    return { type: "SET_LOCATION", value: val };


};



export const setReviewBoxOpen = val => {

    console.log("edit cart action")
    console.log("login "+val)
    return { type: "REVIEW_BOX_OPEN", value: val };


};

export const setEditCartPopUp = val => {

    console.log("edit cart action")
    console.log("login "+val)
    return { type: "SET_EDIT_CART_POPUP", value: val };


};

export const editCartPopUp = val => {

    console.log("edit cart action")
    console.log("login "+val)
    return { type: "EDIT_CART_POPUP", value: val };


};

export const addBundleCartItem = val => {

    console.log("edit cart action")
    console.log("login "+val)


    return { type: "ADD_BUNDLE_CART_ITEM", value: val };


};



export const setEditBundleCartPopUp = val => {



    return { type: "SET_EDIT_BUNDLE_CART_POPUP", value: val };


};


export const editBundleCartPopUp = val => {

    console.log("edit cart action")
    console.log("login "+val)
    return { type: "EDIT_BUNDLE_CART_POPUP", value: val };


};



export const showNewsletter = val => {

    return { type: "NEWSLETTER_POP_UP", value: val };


};

export const loginPopUp = val => {

    console.log("action")
    console.log("login "+val)
    return { type: "LOGIN_POPUP", value: val };


};


export const stayAtHomeAddress = val => {

    console.log("action")
    console.log("login "+val)
    return { type: "STAY_AT_HOME_ADDRESS", value: val };


};

export const addressExist = val => {

    console.log("action")
    console.log("login "+val)
    return { type: "ADDRESS_EXIST", value: val };


};




export const socialLoginPopUp = val => {

    console.log("social login action pop up")
    console.log("login "+val)
    return { type: "SOCIAL_LOGIN_POPUP", value: val };


};


export const setSocialUserInfo = val => {

    console.log("action")
    console.log("login "+val)
    return { type: "SOCIAL_USER_INFO", value: val };


};

export const loginCheckoutPopUp = val => {

    console.log("action")

    console.log("login "+val)


    return { type: "LOGIN_CHECKOUT_POPUP", value: val };


};


export const setCity = val => {

    return { type: "SET_CITY", value: val };


};

export const ageUp = val => {

    return dispatch => {
        dispatch(loading());
        setTimeout(() => {
            dispatch(ageUpAsnc(val));
        }, 5000);
    };

};


export const logIn = (data) => {
    return dispatch  =>  {

        dispatch(loading());
        dispatch(logInSync(data));

    };
};


export const loadFavorites = (data) => {
    return dispatch  =>  {

        dispatch(loadFavoriteSync(data));

    };
};


export const loadSalesQuote = (data) => {
    return dispatch  =>  {
        dispatch(loading());

        dispatch(loadSalesQuoteSync(data));


    };
};



export const loadSalesQuoteSync = (data) => dispatch => {

    console.log("load sales quotes")

    axios.get(baseUrl+"customers/"+data.id+"?groups[]=sales-quotes")
        .then(res => {


            console.log(res.data)
            dispatch({type: "LOAD_CART_ITEMS", value : res.data})


        }).catch(error => {

        console.log("cart Items error found "+error)
        console.log(error)


    });

};



export const loadFavoriteSync = (data) => dispatch => {

    axios.get(baseUrl+"customers/"+data.id+"?groups[]=favorites")
        .then(res => {


            // console.log(res.data)
            dispatch({type: "FAVORITES", value : res.data})


        }).catch(error => {

        console.log("favorites error found "+error)
        console.log("favorites error found "+error)

        // dispatch({type: "LOGIN_FAILED", value : error})
        // dispatch(stopLoading())


        dispatch(loginFailed(error))

        console.log(error)


    });

};


export const logInSync = (data) => dispatch => {

    axios.post(baseUrl+"user/login",
        {"email": data.email, "password": data.password})
        .then(res => {

            console.log(res.data)

            saveUserToken(res.data);
            // dispatch(getUserDetail(data));

            document.body.classList.add('search-body');

            
            if (res.data.status.code==200){
                console.log("login success found")
                saveKey("user",res.data['content'])
                dispatch({type: "LOGIN", value : res.data})


            } else {
                console.log("login failed "+res.data.content.message)

                dispatch({type: "LOGIN_ERROR", value : res.data.content.message})
            }


        }).catch(error => {

        console.log("login error found ")
        console.log(error.response.data)

        // dispatch({type: "LOGIN_FAILED", value : error})
        // dispatch(stopLoading())


        dispatch(loginFailed(error.response.data.content.message))
        // dispatch({type: "LOGIN_ERROR", value : res.data.content.message})

        // console.log(error)

    });

};






export const signUpWithCartItem = (data) => {
    return dispatch  =>  {


        // alert("sign up")
        dispatch(loading());
        dispatch(signUpWithCartItemSync(data));


    };
};


export const signUpWithCartItemSync = (data) => dispatch => {


    console.log("sign pop up called")
    console.log(data)


    var  user = data.user

    axios.post(baseUrl+"customers.json",
        user)
        .then(res => {

            console.log("sign up successfull")


            if (res.data.isGuest){

                setGuest()

            }




            // dispatch(getUserDetail({username : res.data.email}));
            saveUserData(res.data)


            // dispatch({type: "USER_DETAIL", value : res.data[0]})



            if (data.abondonCartItem) {


                dispatch(addCartItemSync({

                    "user": res.data,
                    "cartItem": data.abondonCartItem

                }))

                dispatch({type: "SIGN_UP", value: res.data})

            }else {

                dispatch({type: "SIGN_UP", value: res.data})
            }


        }).catch(error => {

        // dispatch(stopLoading())

        dispatch(loginFailed())

        console.log(error)
        // dispatch({ type: AUTH_FAILED });
        // dispatch({ type: ERROR, payload: error.data.error.message });


    });


};




export const reviewSubmit = (data) => {
    return dispatch  =>  {

        dispatch(loadingSpinner());
        dispatch(reviewSubmitSync(data));


    };
};


export const reviewSubmitSync = (data) => dispatch => {


    console.log("review submit  called")

    axios.post(baseUrl+"activity_reviews.json?groups[]=reviews",
        data)
        .then(res => {

            console.log(" review submit successfull")
            console.log(res.data)



            dispatch({type: "REVIEW_SUBMIT", value : res.data})


        }).catch(error => {



        console.log(error)
        // dispatch(stopLoading());




    });


};

export const signUp = (data) => {
    return dispatch  =>  {


        // alert("sign up")
        dispatch(loading());
        dispatch(signUpSync(data));


    };
};


export const signUpHost = (data) => {
    return dispatch  =>  {


        // alert("sign up")
        dispatch(loading());
        dispatch(signUpHostSync(data));


    };
};




export const signUpHostSync = (data) => dispatch => {


    console.log("host sign up called")
    console.log(data)

    axios.post(baseUrl+"hosts.json",
        data
        // ,{
        //     headers:
        //
        //         { 'Content-Type': 'multipart/form-data' }
        //
        //
        // }
        //
    )
        .then(res => {

            console.log("host sign up successfull")



            dispatch(getUserDetail({username : res.data.email}));
            dispatch({type: "SIGN_UP", value : res.data})



        }).catch(error => {

        console.log("host sign up error")


        // dispatch(stopLoading())

        dispatch(loginFailed())

        console.log(error)
        // dispatch({ type: AUTH_FAILED });
        // dispatch({ type: ERROR, payload: error.data.error.message });


    });


};



export const signUpSync = (data) => dispatch => {


    console.log("sign up called")

    axios.post(baseUrl+"customers.json",
        data)
        .then(res => {

            console.log("sign up successfull")

            if (res.data.isGuest){

                setGuest()
                console.log("guest sign up")

            }


            console.log("inistial state")
            console.log(initialState)



            dispatch(getUserDetail({username : res.data.email}));
            dispatch({type: "SIGN_UP", value : res.data})



        }).catch(error => {

        // dispatch(stopLoading())

        dispatch(loginFailed())

        console.log(error)
        // dispatch({ type: AUTH_FAILED });
        // dispatch({ type: ERROR, payload: error.data.error.message });


    });


};





export const setRememberUserDetail = (data) => {
    return dispatch  =>  {

        dispatch({type: "USER_DETAIL", value : data})


    };
};





export const checkGuestCartItems = (data) => {
    return dispatch  =>  {


        dispatch(loading());
        dispatch(getUserDetailSync(data));


    };
};


export const checkGuestCartItemsSync = (data) => dispatch => {



    var    url = baseUrl+"customers.json?groups[]=customer&email="+data.username;

    console.log(url)


    axios.get(url)
        .then(res => {




            if (data.cartItems.length>0) {

                console.log("cart  abondoned item exits")


                dispatch(addCartItem({ "user": res.data.user, "cartItem" : data.cartItems[0]  }))
                dispatch(loadSalesQuote(data.user))


            }




        }).catch(error => {

        // dispatch(stopLoading())

        dispatch(loginFailed())

        console.log(error)
        // dispatch({ type: AUTH_FAILED });
        // dispatch({ type: ERROR, payload: error.data.error.message });


    });


};



export const setUserDetail = (data) => {


    return { type: "SET_USER_DETAIL", value: data };

};

export const loadUserDetail = (data) => {


    return { type: "LOAD_USER_DETAIL", value: getKey("user") };


};


export const getUserDetail = (data) => {
    return dispatch  =>  {

        dispatch(loading());
        dispatch(getUserDetailSync(data));


    };
};





export const getUserDetailSync = (data) => dispatch => {



    var    url = baseUrl+"customers.json?groups[]=customer&email="+data.username;

    console.log(url)


    axios.get(url)
        .then(res => {


            console.log("user data exits")

            console.log(res.data)

            dispatch({type: "USER_DETAIL", value : res.data[0]})
            saveUserData(res.data[0])



            dispatch(loadSalesQuote(res.data[0]))




        }).catch(error => {

        // dispatch(stopLoading())

        dispatch(loginFailed())

        console.log(error)
        // dispatch({ type: AUTH_FAILED });
        // dispatch({ type: ERROR, payload: error.data.error.message });


    });


};



export const logOut = val => {
    return dispatch => {


        dispatch(loading());

        setTimeout(() => {

            dispatch(logOutSync(val));


        }, 2000);


    };
};


export const logOutSync = val => {


    document.body.classList.remove('search-body');


    return { type: "LOGOUT", value: val };

};









export const removeCartItem = val => {
    return dispatch => {

        dispatch(loading());

        dispatch(removeCartItemSync(val));

    };
};


export const removeCartItemSync = (val) => {

    return function(dispatch) {

        var url = baseUrl + "customer_carts";

        console.log(url)

        var data;

        // if (val.itemType==0) {

        data = {

            activity: parseInt(val.activity),
            addToCart: false,
            removeFromCart: true,
            customer: (val.user),
            itemType: 0


        }
        // }

        // else if (val.itemType==1) {
        //
        //
        //     data = {
        //
        //         bundle: parseInt(val.bundle),
        //         addToCart: false,
        //         removeFromCart: true,
        //         customer: (val.user),
        //         itemType: 1
        //
        //     }
        // }

        console.log(data)
        axios.post(url, data)
            .then(res => {

                console.log(res.data)

                // return { type: "REMOVE_CART_ITEM", value: val };


                dispatch(loadSalesQuote({id: val.user}));


            }).catch(error => {


            return {type: "REMOVE_CART_ITEM", value: val};



        });


        return {type: "REMOVE_CART_ITEM", value: val};

    }


};







export const addCartItem = (val) => {

    if(val.user) {
        return dispatch => {


            dispatch(loading());

            dispatch(enableCartLoading())

            dispatch(addCartItemSync(val));

        };

    }else {


        console.log("add cart item guest called")

        return {type: "ADD_CART_ITEM_GUEST", value: val};


    }

};






export const removeCoupon = (val) => {


    return dispatch => {

        dispatch(loading());

        dispatch(removeCouponSync(val));
        // dispatch(loadSalesQuoteSync({"id":val.customer}));


    };


};

export const addCoupon = (val) => {


    return dispatch => {

        dispatch(loading());

        dispatch(addCouponSync(val));
        // dispatch(loadSalesQuoteSync({"id":val.customer}));


    };


};


export const setGuest = () => {


    return {type: "IS_GUEST"};



};

export const loadingCoupon = () => {


    return {type: "LOADING_COUPON"};



};



export const disableCouponLoading = () => {


    return {type: "DISABLE_COUPON"};



};


export const removeCouponSync = (val) => {

    return function(dispatch) {

        var url = baseUrl + "customer_discount_codes";

        var postData = {

            customer: val.customer,
            code: val.code,
            addCoupon: val.addCoupon

        }


        axios.post(url, postData)
            .then(res => {

                console.log(res.data)

                dispatch(disableCouponLoading())
                dispatch(loadSalesQuote({id:val.customer}));


            }).catch(error => {

            console.log(error)
            return {type: "ERROR_REQUEST", value: error};


        });


    }

};


export const addCouponSync = (val) => {

    return function(dispatch) {

        var url = baseUrl + "customer_discount_codes";

        var postData = {

            customer: val.customer,
            code: val.code,
            addCoupon: val.addCoupon

        }


        axios.post(url, postData)
            .then(res => {

                console.log(res.data)

                dispatch(loadingCoupon())
                dispatch(loadSalesQuote({id:val.customer}));


            }).catch(error => {

            console.log(error)
            return {type: "ERROR_REQUEST", value: error};


        });


    }

};








export const addFavoriteItem = val => {




    return { type: "ADD_FAVORITE_ITEM", value: val };

};



export const removeFavoriteItem = val => {

    return { type: "REMOVE_FAVORITE_ITEM", value: val };

};


export const addCartItemSync = (val) => {


    return function(dispatch) {



        var url = baseUrl + "customer_carts";

        console.log(url)


        var options = [];

        for (var j = 0; j < val.cartItem.cartPriceOptions.length; j++) {

            options.push(
                {
                    priceOptionId: (val.cartItem.cartPriceOptions[j].id),
                    quantity: (val.cartItem.cartPriceOptions[j].quantity)
                })

        }



        var data;



        if (val.cartItem.itemType==0){

            data = {

                activity: parseInt(val.cartItem.activity.id),
                cartPriceOptions: options,
                addToCart: true,
                removeFromCart: false,
                customer: (val.user.id),
                itemType : 0

            }


        }else if (val.cartItem.itemType==1){

            data = {

                bundle: parseInt(val.cartItem.bundle.id),
                cartPriceOptions: options,
                addToCart: true,
                removeFromCart: false,
                customer: (val.user.id),
                itemType : 1

            }


        }


        console.log("cart synch data")

        console.log(data)


        axios.post(url, data)
            .then(res => {

                console.log(res.data)

                dispatch(loadSalesQuote({id: val.user.id}));


            }).catch(error => {

            console.log("Add Cart Error")

            console.log(error)

            return {type: "ERROR_REQUEST", value: error};


        });


    }

};








export const ageDown = val => {
    return { type: "AGE_DOWN", value: val };
};