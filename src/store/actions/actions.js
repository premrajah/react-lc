import { getKey, saveKey, saveUserData, saveUserToken } from "../../LocalStorage/user";
import axios from "axios/index";

import { baseUrl } from "../../Util/Constants";

export const enableCartLoading = () => {
    return {
        type: "IS_CART_LOADING",
    };
};

export const loadingSpinner = () => {
    return {
        type: "LOADING_SPINNER",
    };
};

export const loading = () => {
    return {
        type: "LOADING",
    };
};

export const showSiteModal = (data) => {
    return {
        type: "SITE_POPUP",
        value: data,
    };
};

export const setOrgImage = (val) => {
    return {
        type: "SET_ORG_IMG",
        value: val,
    };
};

export const showLoading = (val) => {
    return {
        type: "SHOW_LOADING",
        value: val,
    };
};

export const loginFailed = (val) => {
    return {
        type: "LOGIN_FAILED",
        value: val,
    };
};

export const signUpFailed = (val) => {
    return {
        type: "SIGN_UP_FAILED",
        value: val,
    };
};

export const stopLoading = () => {
    return {
        type: "STOP-LOADING",
    };
};

export const setCategories = (val) => {
    return { type: "SET_CATEGORIES", value: val };
};

export const loginPopUp = (val) => {
    return { type: "LOGIN_POPUP", value: val };
};

export const setProduct = (val) => {
    return { type: "PRODUCT_ID", value: val };
};

export const setParentProduct = (val) => {
    return { type: "PARENT_PRODUCT_ID", value: val };
};

export const showProductPopUp = (val) => {
    return { type: "PRODUCT_POPUP", value: val };
};

export const showLoginPopUp = (val) => {
    return { type: "LOGIN_POPUP", value: val };
};

export const setLoginPopUpStatus = (val) => {
    return { type: "LOGIN_POPUP_STATUS", value: val };
};

export const setCity = (val) => {
    return { type: "SET_CITY", value: val };
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
            var responseAll = response.data.data;

            dispatch({ type: "SITE_LIST", value: responseAll });

            // dispatch()
        },
        (error) => {
            // var status = error.response.status
            // dispatch({ type: "PRODUCT_LIST", value: [] })
        }
    );

    // dispatch({ type: "PRODUCT_LIST", value: [] })
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
                var responseAll = response.data.data;

                dispatch({ type: "PRODUCT_LIST", value: responseAll });
                // dispatch()
            },
            (error) => {
                // var status = error.response.status

                dispatch({ type: "PRODUCT_LIST", value: [] });
            }
        );

    // dispatch({ type: "PRODUCT_LIST", value: [] })
};

export const loadProductsWithoutParentSync = (data) => (dispatch) => {
    axios
        .get(baseUrl + "product/no-parent", {
            headers: {
                Authorization: "Bearer " + data,
            },
        })
        .then(
            (response) => {
                var responseAll = response.data.data;

                dispatch({ type: "PRODUCT_NPARENT_LIST", value: responseAll });
                // dispatch()
            },
            (error) => {
                // var status = error.response.status

                dispatch({ type: "PRODUCT_NPARENT_LIST", value: [] });
            }
        );

    // dispatch({ type: "PRODUCT_LIST", value: [] })
};

// export const loadProductsSync2 = (data) => dispatch => {

export function loadProductsSync2(data) {
    return (dispatch) => {
        dispatch({ type: "Product_List", value: [] });

        axios
            .get(baseUrl + "product", {
                headers: {
                    Authorization: "Bearer " + data,
                },
            })
            .then(
                (response) => {
                    var responseAll = response.data.data;

                    dispatch({ type: "Product_List", value: responseAll });
                    // dispatch()
                },
                (error) => {
                    // var status = error.response.status

                    dispatch({ type: "Product_List", value: [] });
                }
            );

        dispatch({ type: "Product_List", value: [] });
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
                dispatch({ type: "LOGIN", value: res.data.data });
            } else {
                //
                // dispatch({ type: "LOGIN_ERROR", value: res.errors[0].message })
            }
        })
        .catch((error) => {
            dispatch({ type: "LOGIN_ERROR", value: error.response.data.errors[0].message });
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
            dispatch({ type: "SIGN_UP", value: res.data });
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
            dispatch({ type: "SIGN_UP", value: res.data });
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
        dispatch({ type: "USER_DETAIL", value: data });
    };
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
    return (dispatch) => {
        dispatch(loading());
        dispatch(getUserDetailSync(data));
    };
};

export const getUserDetailSync = (data) => (dispatch) => {
    var url = baseUrl + "customers.json?groups[]=customer&email=" + data.username;

    axios
        .get(url)
        .then((res) => {
            dispatch({ type: "USER_DETAIL", value: res.data[0] });
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
        }, 2000);
    };
};

export const logOutSync = (val) => {
    document.body.classList.remove("search-body");

    return { type: "LOGOUT", value: val };
};
