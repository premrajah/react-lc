import { getKey, saveKey, saveUserData, saveUserToken } from "../../LocalStorage/user";
import axios from "axios/index";
import encodeUrl from "encodeurl";

import {

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
    SET_CITY,
    SET_ORG_IMG,
    SET_USER_DETAIL,
    SHOW_LOADING,
    SIGN_UP,
    SIGN_UP_FAILED,
    SITE_LIST,
    SITE_PARENT_LIST,
    SITE_POPUP,
    STOP_LOADING,
    USER_DETAIL,
    GET_MESSAGES,
    GET_NOTIFICATIONS,
    MESSAGE_ALERT,
    NOTIFICATION_ALERT,
    UNREAD_MESSAGES,
    UNREAD_NOTIFICATIONS,
    LOCAL_STORAGE_MESSAGE_TIMESTAMP,
    LOCAL_STORAGE_NOTIFICATION_TIMESTAMP,
    PRODUCT_REGISTER,
    PRODUCT_RELEASE,
    SERVICE_AGENT_REQUEST,
    SHOW_SNACKBAR,
    CURRENT_PRODUCT,
    GET_LISTINGS,
    PRODUCT_NPARENT_LIST_PAGE,
    CURRENT_SITE,
    PRODUCT_NPARENT_NO_LIST,
    SHOW_MULTIPLE_POP_UP,
    SITE_FORM_SHOW,
    PRODUCT_PAGE_RESET,
    PRODUCT_NOT_FOUND,
    TOGGLE_RIGHTBAR,
    TOGGLE_GLOBAL_DIALOG,
    USER_CONTEXT,
    ORG_CACHE
} from "../types";
import {load} from "dotenv";

// Added by Chandan For Google Analytics
// Refer: https://github.com/react-ga/react-ga for usage details
// --- START
import ReactGA from "react-ga";
import {baseUrl, gaTID, REACT_APP_BRANCH_ENV} from "../../Util/Constants";
// -- END

export const loadingSpinner = () => {
    return {
        type: LOADING_SPINNER,
    };
};

export const loading = () => {
    return {
        type: LOADING,
    };
};

export const toggleRightBar = () => {
    return {
        type: TOGGLE_RIGHTBAR,
    };
};

export const toggleGlobalDialog = () => {
    return {
        type: TOGGLE_GLOBAL_DIALOG,
    };
};

export const setMultiplePopUp = (data) => {

    return {
        type: SHOW_MULTIPLE_POP_UP,
        value: data,
    };
};

export const setSiteForm = (data) => {
    return {
        type: SITE_FORM_SHOW,
        value: data,
    };
};

export const showSiteModal = (data) => {
    return {
        type: SITE_POPUP,
        value: data,
    };
};

export const setOrgImage = (val) => {
    return {
        type: SET_ORG_IMG,
        value: val,
    };
};

export const showSnackbar = (val) => {
    return {
        type: SHOW_SNACKBAR,
        value: val,
    };
};

export const showLoading = (val) => {
    return {
        type: SHOW_LOADING,
        value: val,
    };
};

export const loginFailed = (val) => {
    return {
        type: LOGIN_FAILED,
        value: val,
    };
};

export const signUpFailed = (val) => {
    return {
        type: SIGN_UP_FAILED,
        value: val,
    };
};

export const stopLoading = () => {
    return {
        type: STOP_LOADING,
    };
};

export const setCategories = (val) => {
    return { type: SET_CATEGORIES, value: val };
};

export const loginPopUp = (val) => {
    return { type: LOGIN_POPUP, value: val };
};

export const setProduct = (val) => {
    return { type: PRODUCT_ID, value: val };
};

export const setParentProduct = (val) => {
    return { type: PARENT_PRODUCT_ID, value: val };
};

export const showProductPopUp = (val) => {
    return { type: PRODUCT_POPUP, value: val };
};

export const showLoginPopUp = (val) => {
    return { type: LOGIN_POPUP, value: val };
};

export const setLoginPopUpStatus = (val) => {
    return { type: LOGIN_POPUP_STATUS, value: val };
};

export const setCity = (val) => {
    return { type: SET_CITY, value: val };
};

export const loadProducts = (data) => {
    return (dispatch) => {
        dispatch(loading());
        dispatch(loadProductsSync(data));

        // return  { type: "PRODUCT_LIST", value: [] }
    };
};

export const loadProductsWithoutParent = (data) => {
    return (dispatch) => {
        dispatch(loading());
        dispatch(loadProductsWithoutParentSync(data));

        // return  { type: "PRODUCT_LIST", value: [] }
    };
};
export const loadProductsWithoutParentNoListing = (data) => {
    return (dispatch) => {
        dispatch(loading());
        dispatch(loadProductsWithoutParentNoListingSync(data));

        // return  { type: "PRODUCT_LIST", value: [] }
    };
};

export const loadProductsWithoutParentPagination = (data) => {
    return (dispatch) => {
        dispatch(loading());
        dispatch(loadProductsWithoutParentPaginationSync(data));

        // return  { type: "PRODUCT_LIST", value: [] }
    };
};
export const loadSites = (data) => {
    return (dispatch) => {
        dispatch(loading());
        dispatch(loadSitesSync(data));

        // return  { type: "PRODUCT_LIST", value: [] }
    };
};
export const loadParentSites = (data) => {
    return (dispatch) => {
        dispatch(loading());
        dispatch(loadParentSitesSync(data));

        // return  { type: "PRODUCT_LIST", value: [] }
    };
};

export const loadSitesSync = (data) => (dispatch) => {
    axios.get(baseUrl + "site").then(
        (response) => {
            let responseAll = response.data.data;

            dispatch({ type: SITE_LIST, value: responseAll });

            // dispatch()
        },
        (error) => {
            // let status = error.response.status
            // dispatch({ type: "PRODUCT_LIST", value: [] })
        }
    )
        .catch(error => {});

    // dispatch({ type: "PRODUCT_LIST", value: [] })
};

export const loadParentSitesSync = (data) => (dispatch) => {
    axios.get(baseUrl + "site/no-parent").then(
        (response) => {
            let responseAll = response.data.data;

            dispatch({ type: SITE_PARENT_LIST, value: responseAll });

            // dispatch()
        },
        (error) => {
            // let status = error.response.status
            // dispatch({ type: "PRODUCT_LIST", value: [] })
        }
    )
        .catch(error => {});

    // dispatch({ type: "PRODUCT_LIST", value: [] })
};

export const loadCurrentProduct = (data) => {
    return (dispatch) => {
        dispatch(loading());
        dispatch(loadCurrentProductSync(data));
    };
};

export const loadCurrentProductSync = (data) => (dispatch) => {

    try{
        axios
            .get(baseUrl + "product/" + encodeUrl(data) + "/expand?agg"
            )
            .then(
                (response) => {
                    let responseAll = response.data;

                    dispatch({ type: CURRENT_PRODUCT, value: responseAll.data });


                },
                (error) => {
                    // this.setState({
                    //     notFound: true,
                    // });

                    dispatch({ type: PRODUCT_NOT_FOUND , value:true});

                }
            );

    } catch(e) {
        console.log(e)


    }
};

export const resetProductPageOffset = () => {

    return { type: PRODUCT_PAGE_RESET };
};

export const loadCurrentSite = (data) => {
    return (dispatch) => {
        dispatch(loading());
        dispatch(loadCurrentSiteSync(data));
    };
};

export const loadCurrentSiteSync = (data) => (dispatch) => {

    axios
        .get(baseUrl + "site/code/" + encodeUrl(data) + "/expand")
        // .get(baseUrl + "site/code/" + encodeUrl(data))
        .then(
            (response) => {
                var responseAll = response.data;

                dispatch({ type: CURRENT_SITE, value: responseAll.data });


            },
            (error) => {
                // this.setState({
                //     notFound: true,
                // });
            }
        );

};

export const loadProductsSync = (data) => (dispatch) => {


    try {
        axios
            .get(baseUrl + "product/no-links?agg", {
                headers: {
                    Authorization: "Bearer " + data,
                },
            })
            .then(
                (response) => {
                    let responseAll = response.data.data;

                    dispatch({type: PRODUCT_LIST, value: responseAll});
                    // dispatch()
                },
                (error) => {
                    // let status = error.response.status

                    dispatch({type: PRODUCT_LIST, value: []});
                }
            )
            .catch(error => {
            });

    } catch(e) {
        console.log(e)


    }

    // dispatch({ type: "PRODUCT_LIST", value: [] })
};

export const loadProductsWithoutParentPaginationSync = (data) => (dispatch) => {


    axios
        // .get(`${baseUrl}product/no-parent/no-links`)
        .get(`${baseUrl}product/no-parent/no-links?offset=${data.offset}&size=${data.size}`)
        .then(
            (response) => {
                if(response.status === 200) {
                    dispatch(loading(false));
                }

                dispatch({ type: PRODUCT_NPARENT_LIST_PAGE, value: {val:response.data.data,offset:data.offset, size:data.size, refresh:data.refresh}});
            },
            (error) => {
                dispatch({ type: PRODUCT_NPARENT_LIST_PAGE, value: [] });
            }
        )
        .catch(error => {});

};

export const loadProductsWithoutParentNoListingSync = (data) => (dispatch) => {


    axios
        .get(`${baseUrl}product/no-listing/no-links`)
        // .get(`${baseUrl}product/no-parent/no-links?offset=${data.offset}&size=${data.size}`)
        .then(
            (response) => {
                if(response.status === 200) {
                    dispatch(loading(false));
                }
                dispatch({ type: PRODUCT_NPARENT_NO_LIST, value: {val:response.data.data}});
            },
            (error) => {
                dispatch({ type: PRODUCT_NPARENT_NO_LIST, value: [] });
            }
        )
        .catch(error => {});

};

export const loadProductsWithoutParentSync = (data) => (dispatch) => {


    axios
        .get(`${baseUrl}product/no-parent/no-links`)
        // .get(`${baseUrl}product/no-parent/no-links?offset=${data.offset}&size=${data.size}`)
        .then(
            (response) => {
                if(response.status === 200) {
                    dispatch(loading(false));
                }
                dispatch({ type: PRODUCT_NPARENT_LIST, value: {val:response.data.data,offset:data.offset, size:data.size}});
            },
            (error) => {
                dispatch({ type: PRODUCT_NPARENT_LIST, value: [] });
            }
        )
        .catch(error => {});

};

// export const loadProductsSync2 = (data) => dispatch => {

export function loadProductsSync2(data) {
    return (dispatch) => {
        dispatch({ type: PRODUCT_LIST, value: [] });

        axios
            .get(baseUrl + "product", {
                headers: {
                    Authorization: "Bearer " + data,
                },
            })
            .then(
                (response) => {
                    let responseAll = response.data.data;

                    dispatch({ type: PRODUCT_LIST, value: responseAll });
                    // dispatch()
                },
                (error) => {
                    // let status = error.response.status

                    dispatch({ type: PRODUCT_LIST, value: [] });
                }
            )
            .catch(error => {});

        dispatch({ type: PRODUCT_LIST, value: [] });
    };
}

export const logIn = (data) => {
    return (dispatch) => {
        dispatch(loading());
        dispatch(logInSync(data));
    };
};

export const logInSync = (data) => (dispatch) => {
    axios
        .post(baseUrl + "user/login", { email: data.email, password: data.password })
        .then((res) => {

            document.body.classList.add("search-body");

            if (res.status === 200) {
                saveUserToken(res.data.data.token);

                saveKey("user", res.data.data);



                dispatch({ type: LOGIN, value: res.data.data });

                ReactGA.initialize(gaTID, {
                    gaOptions: {
                        userId: res.data.data.id + "|" + res.data.data.orgId
                    }
                });
                ReactGA.ga('set', 'appName', "loop-react-ui-" + REACT_APP_BRANCH_ENV);
                dispatch(orgCache())
                dispatch(userContext())

                getMessages();
                getNotifications();


            } else {
                //
                // dispatch({ type: "LOGIN_ERROR", value: res.errors[0].message })
            }
        })
        .catch((error) => {

            if (error.response)
                dispatch((
                    { type: LOGIN_ERROR, value: error.response&&error.response.data?error.response.data.errors[0].message:error.response.status+": "+error.response.statusText}
                ));
        });
};



export const userContext = (data) => {
    return (dispatch) => {

        dispatch(userContextSync(data));
    };
};

export const userContextSync = (data) => (dispatch) => {
    axios
        .get(baseUrl + "user/context")
        .then((res) => {


            if (res.status === 200) {

                dispatch({ type: USER_CONTEXT, value: res.data.data });



            } else {
                //
                // dispatch({ type: "LOGIN_ERROR", value: res.errors[0].message })
            }
        })
        .catch((error) => {

        });
};

export const orgCache = (data) => {

    return (dispatch) => {

        dispatch(orgCacheSync(data));
    };
};

export const orgCacheSync = (data) => (dispatch) => {

    axios
        .get(baseUrl + "org/cache")
        .then((res) => {


            if (res.status === 200) {

                dispatch({ type: ORG_CACHE, value: res.data.data });

            } else {
                //
                // dispatch({ type: "LOGIN_ERROR", value: res.errors[0].message })
            }
        })
        .catch((error) => {


        });
};

export const signUp = (data) => {
    return (dispatch) => {
        dispatch(loading());
        dispatch(signUpSync(data));
    };
};

export const signUpHost = (data) => {
    return (dispatch) => {
        dispatch(loading());
        dispatch(signUpHostSync(data));
    };
};

export const signUpHostSync = (data) => (dispatch) => {
    axios
        .post(
            baseUrl + "hosts.json",
            data

        )
        .then((res) => {
            dispatch(getUserDetail({ username: res.data.email }));
            dispatch({ type: SIGN_UP, value: res.data });
        })
        .catch((error) => {
            // dispatch(stopLoading())

            dispatch(loginFailed());

            // dispatch({ type: AUTH_FAILED });
            // dispatch({ type: ERROR, payload: error.data.error.message });
        });
};

export const signUpSync = (data) => (dispatch) => {

    let type=null
    if (data.type){
        type=data.type
        delete data.type


    }


    axios
        .post(
            baseUrl + "user/signup",
            // axios.post(baseUrl+"customers.json",
            data
        )
        .then((res) => {
            dispatch({ type: SIGN_UP, value: res.data });
        })
        .catch((error) => {

            if (error.response) {

                dispatch(signUpFailed(error.response && error.response.data ? error.response.data.errors[0].message : error.response.status + ": " + error.response.statusText));
            }

        });
};

export const setRememberUserDetail = (data) => {
    return (dispatch) => {
        dispatch({ type: USER_DETAIL, value: data });
    };
};

export const setUserDetail = (data) => {
    return { type: SET_USER_DETAIL, value: data };
};

export const loadUserDetail = (data) => {
    let userDetials = getKey("user");

    return { type: LOAD_USER_DETAIL, value: userDetials };
};





export const getListings = (data) => {
    return (dispatch) => {
        dispatch(loading());
        dispatch(getListingsSync(data));
    }
}

export const getListingsSync = (data) => (dispatch) => {
    axios.get(`${baseUrl}listing?m=a`)
        .then(res => {
            dispatch({type: GET_LISTINGS, value: res.data.data})
            dispatch(loading(false));
        })
        .catch(error => {
            // console.log('listing error ', error.message);
        })
}

export const getUserDetail = (data) => {
    return (dispatch) => {
        dispatch(loading());
        dispatch(getUserDetailSync(data));
    };
};

export const getUserDetailSync = (data) => (dispatch) => {
    let url = baseUrl + "customers.json?groups[]=customer&email=" + data.username;

    axios
        .get(url)
        .then((res) => {
            dispatch({ type: USER_DETAIL, value: res.data[0] });
            saveUserData(res.data[0]);
        })
        .catch((error) => {
            // dispatch(stopLoading())

            dispatch(loginFailed());

            // dispatch({ type: AUTH_FAILED });
            // dispatch({ type: ERROR, payload: error.data.error.message });
        });
};

export const logOut = (val) => {
    return (dispatch) => {
        dispatch(loading());

        setTimeout(() => {
            dispatch(logOutSync(val));
            sessionStorage.clear();
            localStorage.clear();
        }, 2000);
    };
};

export const logOutSync = (val) => {
    document.body.classList.remove("search-body");

    return { type: LOGOUT, value: val };
};


export const getMessages = data => {
    return dispatch => {
        dispatch(getMessagesSync(data))
    }
}

export const getMessagesSync = (data) => dispatch => {
    axios.get(`${baseUrl}message`)
        .then(response => {
            let data = response.data.data;

            if(data.length > 0) {
                let timeFromLocalStorage = sessionStorage.getItem(LOCAL_STORAGE_MESSAGE_TIMESTAMP);

                if(timeFromLocalStorage !== null) {

                    if(data[0].message._ts_epoch_ms > timeFromLocalStorage) {
                        dispatch(unreadMessages(true));
                        dispatch(messageAlert(true));
                        dispatch(getMessages());
                        sessionStorage.setItem(LOCAL_STORAGE_MESSAGE_TIMESTAMP, data[0].message._ts_epoch_ms);
                    } else {
                        sessionStorage.setItem(LOCAL_STORAGE_MESSAGE_TIMESTAMP, data[0].message._ts_epoch_ms);
                    }

                } else {
                    sessionStorage.setItem(LOCAL_STORAGE_MESSAGE_TIMESTAMP, data[0].message._ts_epoch_ms);
                }

                dispatch({type: GET_MESSAGES, value: response.data.data})

            }

        }, error => {

        })
        .catch(error => {

        })
}

export const getNotifications = data => {
    return dispatch => {
        dispatch(getNotificationsSync(data))
    }
}

export const getNotificationsSync = data => dispatch => {
    axios.get(`${baseUrl}message/notif`)
        .then(response => {

            let data = response.data.data;

            if(data.length > 0) {
                let timeFromLocalStorage = sessionStorage.getItem(LOCAL_STORAGE_NOTIFICATION_TIMESTAMP);

                if(timeFromLocalStorage !== null) {

                    if(data[0].message._ts_epoch_ms > timeFromLocalStorage) {
                        dispatch(unreadNotifications(true));
                        dispatch(notificationAlert(true));
                        dispatch(getNotifications())
                        sessionStorage.setItem(LOCAL_STORAGE_NOTIFICATION_TIMESTAMP, data[0].message._ts_epoch_ms);
                    } else {
                        sessionStorage.setItem(LOCAL_STORAGE_NOTIFICATION_TIMESTAMP, data[0].message._ts_epoch_ms);
                    }

                } else {
                    sessionStorage.setItem(LOCAL_STORAGE_NOTIFICATION_TIMESTAMP, data[0].message._ts_epoch_ms);
                }

                dispatch({type: GET_NOTIFICATIONS, value: response.data.data})

            }

        })
        .catch(error => {

        })
}

export const messageAlert = val =>  {
    return {type: MESSAGE_ALERT, value: val}
}

export const notificationAlert = val => {
    return {type: NOTIFICATION_ALERT, value: val}
}

export const unreadMessages = val => {
    return {type: UNREAD_MESSAGES, value: val}
}

export const unreadNotifications = val => {
    return { type: UNREAD_NOTIFICATIONS, value: val}
}

export const fetchReleaseRequest = () => {
    return (dispatch) => {
        dispatch(loading());
        dispatch(fetchReleaseRequestSync());

    };
};

export const fetchReleaseRequestSync = () => (dispatch) => {
    axios.get(baseUrl + "release").then(
        (response) => {

            let responseAll = response.data.data;

            dispatch({ type: PRODUCT_RELEASE, value: responseAll });

        },
        (error) => {
            // let status = error.response.status
            // dispatch({ type: "PRODUCT_LIST", value: [] })
        }
    )
        .catch(error => {});

    // dispatch({ type: "PRODUCT_LIST", value: [] })
};

export const fetchServiceAgentRequest = () => {
    return (dispatch) => {
        dispatch(loading());
        dispatch(fetchServiceAgentRequestSync());

        // return  { type: "PRODUCT_LIST", value: [] }
    };
};

export const fetchServiceAgentRequestSync = () => (dispatch) => {
    axios.get(baseUrl + "service-agent").then(
        (response) => {
            let responseAll = response.data.data;

            dispatch({ type: SERVICE_AGENT_REQUEST, value: responseAll });

            // dispatch()
        },
        (error) => {
            // let status = error.response.status
            // dispatch({ type: "PRODUCT_LIST", value: [] })
        }
    )
        .catch(error => {});

    // dispatch({ type: "PRODUCT_LIST", value: [] })
};

export const fetchRegisterRequest = () => {

    return (dispatch) => {

        dispatch(loading());
        dispatch(fetchRegisterRequestSync());

        // return  { type: "PRODUCT_LIST", value: [] }
    };
};

export const fetchRegisterRequestSync = () => (dispatch) => {
    axios.get(baseUrl + "register").then(
        (response) => {

            let responseAll = response.data.data;

            dispatch({ type: PRODUCT_REGISTER , value: responseAll });

            // dispatch()
        },
        (error) => {
            // let status = error.response.status
            // dispatch({ type: "PRODUCT_LIST", value: [] })
        }
    )
        .catch(error => {});

    // dispatch({ type: "PRODUCT_LIST", value: [] })
};




