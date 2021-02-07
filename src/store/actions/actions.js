import { saveUserData, saveUserToken, saveKey, getKey } from '../../LocalStorage/user'
import axios from "axios/index";

import { baseUrl } from '../../Util/Constants'


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




export const setOrgImage = (val) => {
    return {
        type: "SET_ORG_IMG", value: val
    };
};


export const showLoading = (val) => {
    return {
        type: "SHOW_LOADING", value: val
    };
};


export const loginFailed = (val) => {
    return {
        type: "LOGIN_FAILED", value: val
    };
};

export const signUpFailed = (val) => {
    return {
        type: "SIGN_UP_FAILED", value: val
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



    return { type: "REVIEW_BOX_OPEN", value: val };


};

export const setEditCartPopUp = val => {



    return { type: "SET_EDIT_CART_POPUP", value: val };


};

export const editCartPopUp = val => {



    return { type: "EDIT_CART_POPUP", value: val };


};

export const addBundleCartItem = val => {





    return { type: "ADD_BUNDLE_CART_ITEM", value: val };


};



export const setEditBundleCartPopUp = val => {



    return { type: "SET_EDIT_BUNDLE_CART_POPUP", value: val };


};


export const editBundleCartPopUp = val => {



    return { type: "EDIT_BUNDLE_CART_POPUP", value: val };


};



export const showNewsletter = val => {

    return { type: "NEWSLETTER_POP_UP", value: val };


};

export const loginPopUp = val => {



    return { type: "LOGIN_POPUP", value: val };


};


export const stayAtHomeAddress = val => {



    return { type: "STAY_AT_HOME_ADDRESS", value: val };


};

export const addressExist = val => {



    return { type: "ADDRESS_EXIST", value: val };


};




export const socialLoginPopUp = val => {



    return { type: "SOCIAL_LOGIN_POPUP", value: val };


};


export const setSocialUserInfo = val => {



    return { type: "SOCIAL_USER_INFO", value: val };


};

export const loginCheckoutPopUp = val => {






    return { type: "LOGIN_CHECKOUT_POPUP", value: val };


};


export const setProduct = val => {



    return { type: "PRODUCT_ID", value: val };


};


export const setParentProduct = val => {



    return { type: "PARENT_PRODUCT_ID", value: val };


};


export const showProductPopUp = val => {



    return { type: "PRODUCT_POPUP", value: val };


};







export const showLoginPopUp = val => {

    return { type: "LOGIN_POPUP", value: val };


};


export const setLoginPopUpStatus = val => {

    return { type: "LOGIN_POPUP_STATUS", value: val };


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




// export const loadProducts = val => {
//
//
//
//     // return { type: "PRODUCT_ID", value: val };
//     return  { type: "PRODUCT_LIST", value: [] };
//
//
//
// };

export const loadProducts = (data) => {


    return dispatch  =>  {


        dispatch(loading());
        dispatch(loadProductsSync(data));

      // return  { type: "PRODUCT_LIST", value: [] }

    };


};


export const loadProductsWithoutParent = (data) => {


    return dispatch  =>  {


        dispatch(loading());
        dispatch(loadProductsWithoutParentSync(data));

        // return  { type: "PRODUCT_LIST", value: [] }

    };


};




export const loadSites = (data) => {


    return dispatch  =>  {


        dispatch(loading());
        dispatch(loadSitesSync(data));

        // return  { type: "PRODUCT_LIST", value: [] }

    };


};


export const loadSitesSync = (data) => dispatch => {




    axios.get(baseUrl + "site",
        {
            headers: {
                "Authorization": "Bearer " + data
            }
        }
    )
        .then((response) => {

                var responseAll = response.data.data;




                dispatch({ type: "SITE_LIST", value: responseAll })

                // dispatch()


            },
            (error) => {

                // var status = error.response.status



                // dispatch({ type: "PRODUCT_LIST", value: [] })


            }
        );

    // dispatch({ type: "PRODUCT_LIST", value: [] })


}



export const loadProductsSync = (data) => dispatch => {




    axios.get(baseUrl + "product",
        {
            headers: {
                "Authorization": "Bearer " + data
            }
        }
    )
     .then((response) => {

                var responseAll = response.data.data;




                dispatch({ type: "PRODUCT_LIST", value: responseAll })
               // dispatch()


            },
            (error) => {

                // var status = error.response.status



                dispatch({ type: "PRODUCT_LIST", value: [] })


            }
        );

    // dispatch({ type: "PRODUCT_LIST", value: [] })


}


export const loadProductsWithoutParentSync = (data) => dispatch => {




    axios.get(baseUrl + "product/no-parent",
        {
            headers: {
                "Authorization": "Bearer " + data
            }
        }
    )
        .then((response) => {

                var responseAll = response.data.data;




                dispatch({ type: "PRODUCT_NPARENT_LIST", value: responseAll })
                // dispatch()


            },
            (error) => {

                // var status = error.response.status



                dispatch({ type: "PRODUCT_NPARENT_LIST", value: [] })


            }
        );

    // dispatch({ type: "PRODUCT_LIST", value: [] })


}



// export const loadProductsSync2 = (data) => dispatch => {


export function loadProductsSync2(data){

        return (dispatch) => {



            dispatch ({ type: "Product_List", value: [] })


            axios.get(baseUrl + "product",
                {
                    headers: {
                        "Authorization": "Bearer " + data
                    }
                }
            )
                .then((response) => {

                        var responseAll = response.data.data;




                        dispatch ({ type: "Product_List", value: responseAll })
                        // dispatch()


                    },
                    (error) => {

                        // var status = error.response.status



                        dispatch({ type: "Product_List", value: [] })


                    }
                );

            dispatch({ type: "Product_List", value: [] })
        }

}


export const logIn = (data) => {
    return dispatch => {

        dispatch(loading());
        dispatch(logInSync(data));

    };
};


export const loadFavorites = (data) => {
    return dispatch => {

        dispatch(loadFavoriteSync(data));

    };
};


export const loadSalesQuote = (data) => {
    return dispatch => {
        dispatch(loading());

        dispatch(loadSalesQuoteSync(data));


    };
};



export const loadSalesQuoteSync = (data) => dispatch => {



    axios.get(baseUrl + "customers/" + data.id + "?groups[]=sales-quotes")
        .then(res => {



            dispatch({ type: "LOAD_CART_ITEMS", value: res.data })


        }).catch(error => {





        });

};



export const loadFavoriteSync = (data) => dispatch => {

    axios.get(baseUrl + "customers/" + data.id + "?groups[]=favorites")
        .then(res => {


            //
            dispatch({ type: "FAVORITES", value: res.data })


        }).catch(error => {




            // dispatch({type: "LOGIN_FAILED", value : error})
            // dispatch(stopLoading())


            dispatch(loginFailed(error))




        });

};


export const logInSync = (data) => dispatch => {

    axios.post(baseUrl + "user/login",
        { "email": data.email, "password": data.password })
        .then(res => {




            // saveUserToken(res.data.data);
            // dispatch(getUserDetail(data));

            document.body.classList.add('search-body');


            if (res.status === 200) {

                saveUserToken(res.data.data);


                saveKey("user", res.data.data)
                dispatch({ type: "LOGIN", value: res.data.data })


            } else {



                //

                // dispatch({ type: "LOGIN_ERROR", value: res.errors[0].message })
            }


        }).catch(error => {





            dispatch({ type: "LOGIN_ERROR", value: error.response.data.errors[0].message })


        });

};






export const signUpWithCartItem = (data) => {
    return dispatch => {



        dispatch(loading());
        dispatch(signUpWithCartItemSync(data));


    };
};


export const signUpWithCartItemSync = (data) => dispatch => {






    var user = data.user

    axios.post(baseUrl + "customers.json",
        user)
        .then(res => {




            if (res.data.isGuest) {

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

                dispatch({ type: "SIGN_UP", value: res.data })

            } else {

                dispatch({ type: "SIGN_UP", value: res.data })
            }


        }).catch(error => {

            // dispatch(stopLoading())

            dispatch(loginFailed())


            // dispatch({ type: AUTH_FAILED });
            // dispatch({ type: ERROR, payload: error.data.error.message });


        });


};




export const reviewSubmit = (data) => {
    return dispatch => {

        dispatch(loadingSpinner());
        dispatch(reviewSubmitSync(data));


    };
};


export const reviewSubmitSync = (data) => dispatch => {




    axios.post(baseUrl + "activity_reviews.json?groups[]=reviews",
        data)
        .then(res => {






            dispatch({ type: "REVIEW_SUBMIT", value: res.data })


        }).catch(error => {




            // dispatch(stopLoading());




        });


};

export const signUp = (data) => {
    return dispatch => {



        dispatch(loading());
        dispatch(signUpSync(data));


    };
};


export const signUpHost = (data) => {
    return dispatch => {



        dispatch(loading());
        dispatch(signUpHostSync(data));


    };
};




export const signUpHostSync = (data) => dispatch => {





    axios.post(baseUrl + "hosts.json",
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





            dispatch(getUserDetail({ username: res.data.email }));
            dispatch({ type: "SIGN_UP", value: res.data })



        }).catch(error => {




            // dispatch(stopLoading())

            dispatch(loginFailed())


            // dispatch({ type: AUTH_FAILED });
            // dispatch({ type: ERROR, payload: error.data.error.message });


        });


};



export const signUpSync = (data) => dispatch => {



    axios.post(baseUrl + "user/signup",
        // axios.post(baseUrl+"customers.json",
        data)
        .then(res => {



            dispatch({ type: "SIGN_UP", value: res.data })



        }).catch(error => {

            // dispatch(stopLoading())



        dispatch(signUpFailed(error.response.data.errors[0].message))


            // dispatch({ type: AUTH_FAILED });
            // dispatch({ type: ERROR, payload: error.data.error.message });


        });


};





export const setRememberUserDetail = (data) => {
    return dispatch => {

        dispatch({ type: "USER_DETAIL", value: data })


    };
};





export const checkGuestCartItems = (data) => {
    return dispatch => {


        dispatch(loading());
        dispatch(getUserDetailSync(data));


    };
};


export const checkGuestCartItemsSync = (data) => dispatch => {



    var url = baseUrl + "customers.json?groups[]=customer&email=" + data.username;




    axios.get(url)
        .then(res => {




            if (data.cartItems.length > 0) {




                dispatch(addCartItem({ "user": res.data.user, "cartItem": data.cartItems[0] }))
                dispatch(loadSalesQuote(data.user))


            }




        }).catch(error => {

            // dispatch(stopLoading())

            dispatch(loginFailed())


            // dispatch({ type: AUTH_FAILED });
            // dispatch({ type: ERROR, payload: error.data.error.message });


        });


};



export const setUserDetail = (data) => {


    return { type: "SET_USER_DETAIL", value: data };

};

export const loadUserDetail = (data) => {



    var userDetials = getKey("user");

    //
    //
    return { type: "LOAD_USER_DETAIL", value: userDetials };


};


export const getUserDetail = (data) => {
    return dispatch => {

        dispatch(loading());
        dispatch(getUserDetailSync(data));


    };
};





export const getUserDetailSync = (data) => dispatch => {



    var url = baseUrl + "customers.json?groups[]=customer&email=" + data.username;




    axios.get(url)
        .then(res => {






            dispatch({ type: "USER_DETAIL", value: res.data[0] })
            saveUserData(res.data[0])



            dispatch(loadSalesQuote(res.data[0]))




        }).catch(error => {

            // dispatch(stopLoading())

            dispatch(loginFailed())


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

    return function (dispatch) {

        var url = baseUrl + "customer_carts";



        var data;

        // if (val.itemType===0) {

        data = {

            activity: parseInt(val.activity),
            addToCart: false,
            removeFromCart: true,
            customer: (val.user),
            itemType: 0


        }
        // }

        // else if (val.itemType===1) {
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


        axios.post(url, data)
            .then(res => {



                // return { type: "REMOVE_CART_ITEM", value: val };


                dispatch(loadSalesQuote({ id: val.user }));


            }).catch(error => {


                return { type: "REMOVE_CART_ITEM", value: val };



            });


        return { type: "REMOVE_CART_ITEM", value: val };

    }


};







export const addCartItem = (val) => {

    if (val.user) {
        return dispatch => {


            dispatch(loading());

            dispatch(enableCartLoading())

            dispatch(addCartItemSync(val));

        };

    } else {




        return { type: "ADD_CART_ITEM_GUEST", value: val };


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


    return { type: "IS_GUEST" };



};

export const loadingCoupon = () => {


    return { type: "LOADING_COUPON" };



};



export const disableCouponLoading = () => {


    return { type: "DISABLE_COUPON" };



};


export const removeCouponSync = (val) => {

    return function (dispatch) {

        var url = baseUrl + "customer_discount_codes";

        var postData = {

            customer: val.customer,
            code: val.code,
            addCoupon: val.addCoupon

        }


        axios.post(url, postData)
            .then(res => {



                dispatch(disableCouponLoading())
                dispatch(loadSalesQuote({ id: val.customer }));


            }).catch(error => {


                return { type: "ERROR_REQUEST", value: error };


            });


    }

};


export const addCouponSync = (val) => {

    return function (dispatch) {

        var url = baseUrl + "customer_discount_codes";

        var postData = {

            customer: val.customer,
            code: val.code,
            addCoupon: val.addCoupon

        }


        axios.post(url, postData)
            .then(res => {



                dispatch(loadingCoupon())
                dispatch(loadSalesQuote({ id: val.customer }));


            }).catch(error => {


                return { type: "ERROR_REQUEST", value: error };


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


    return function (dispatch) {



        var url = baseUrl + "customer_carts";




        var options = [];

        for (var j = 0; j < val.cartItem.cartPriceOptions.length; j++) {

            options.push(
                {
                    priceOptionId: (val.cartItem.cartPriceOptions[j].id),
                    quantity: (val.cartItem.cartPriceOptions[j].quantity)
                })

        }



        var data;



        if (val.cartItem.itemType === 0) {

            data = {

                activity: parseInt(val.cartItem.activity.id),
                cartPriceOptions: options,
                addToCart: true,
                removeFromCart: false,
                customer: (val.user.id),
                itemType: 0

            }


        } else if (val.cartItem.itemType === 1) {

            data = {

                bundle: parseInt(val.cartItem.bundle.id),
                cartPriceOptions: options,
                addToCart: true,
                removeFromCart: false,
                customer: (val.user.id),
                itemType: 1

            }


        }







        axios.post(url, data)
            .then(res => {



                dispatch(loadSalesQuote({ id: val.user.id }));


            }).catch(error => {





                return { type: "ERROR_REQUEST", value: error };


            });


    }

};








export const ageDown = val => {
    return { type: "AGE_DOWN", value: val };
};