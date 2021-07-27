import { getKey, saveKey, saveUserData, saveUserToken } from "../../LocalStorage/user";
import axios from "axios/index";
import encodeUrl from "encodeurl";

import { baseUrl } from "../../Util/Constants";
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
    SITE_POPUP,
    STOP_LOADING,
    USER_DETAIL,
    GET_MESSAGES,
    GET_NOTIFICATIONS,
    MESSAGE_ALERT,
    NOTIFICATION_ALERT,
    UNREAD_MESSAGES,
    UNREAD_NOTIFICATIONS, LOCAL_STORAGE_MESSAGE_TIMESTAMP, LOCAL_STORAGE_NOTIFICATION_TIMESTAMP,
    PRODUCT_REGISTER,PRODUCT_RELEASE,SERVICE_AGENT_REQUEST,SHOW_SNACKBAR,CURRENT_PRODUCT,
    GET_LISTINGS,
} from "../types";
import {load} from "dotenv";



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

export const loadSites = (data) => {
    return (dispatch) => {
        dispatch(loading());
        dispatch(loadSitesSync(data));

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


export const loadCurrentProduct = (data) => {
    return (dispatch) => {
        dispatch(loading());
        dispatch(loadCurrentProductSync(data));
    };
};

export const loadCurrentProductSync = (data) => (dispatch) => {

    axios
        .get(baseUrl + "product/" + encodeUrl(data) + "/expand"
        )
        .then(
            (response) => {
                var responseAll = response.data;

                dispatch({ type: CURRENT_PRODUCT, value: responseAll.data });


            },
            (error) => {
                // this.setState({
                //     notFound: true,
                // });
            }
        );

};



export const loadProductsSync = (data) => (dispatch) => {



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

    // dispatch({ type: "PRODUCT_LIST", value: [] })
};

export const loadProductsWithoutParentSync = (data) => (dispatch) => {



    axios
        .get(`${baseUrl}product/no-parent/expand`)
        // .get(`${baseUrl}product/no-parent/expand?offset=${data.offset}&size=${data.size}`)
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
            // saveUserToken(res.data.data);
            // dispatch(getUserDetail(data));

            document.body.classList.add("search-body");

            if (res.status === 200) {
                saveUserToken(res.data.data);

                saveKey("user", res.data.data);
                dispatch({ type: LOGIN, value: res.data.data });
                getMessages();
                getNotifications();
            } else {
                //
                // dispatch({ type: "LOGIN_ERROR", value: res.errors[0].message })
            }
        })
        .catch((error) => {
            dispatch({ type: LOGIN_ERROR, value: error.response.data.errors ? error.response.data.errors[0].message : '' });
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
            // ,{
            //     headers:
            //
            //         { 'Content-Type': 'multipart/form-data' }
            //
            //
            // }
            //
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
            // dispatch(stopLoading())

            dispatch(signUpFailed(error.response.data.errors[0].message));

            // dispatch({ type: AUTH_FAILED });
            // dispatch({ type: ERROR, payload: error.data.error.message });
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

    //
    //
    return { type: LOAD_USER_DETAIL, value: userDetials };
};

export const getListings = (data) => {
    return (dispatch) => {
        dispatch(loading());
        dispatch(getListingsSync(data));
    }
}

export const getListingsSync = (data) => (dispatch) => {
    axios.get(`${baseUrl}listing`)
        .then(res => {
            dispatch({type: GET_LISTINGS, value: res.data.data})
            dispatch(loading(false));
        })
        .catch(error => {
            console.log('listing error ', error.message);
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


