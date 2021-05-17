import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import reducer from "./store/reducers/reducer";
import { Router } from "react-router-dom";
import {createStore, applyMiddleware, compose} from "redux";
import thunk from "redux-thunk";
import history from "./History/history";
import axios from "axios";
import { REACT_APP_BRANCH_ENV } from "./Util/Constants";

const StackdriverErrorReporter = require('stackdriver-errors-js/dist/stackdriver-errors-concat.min.js');

export const errorHandler = new StackdriverErrorReporter();
errorHandler.start({
    key: "lcp-dev-01",
    projectId: "AIzaSyA1cl1-HcYggd-xkPA5ZKXm6UqodYu48WE",
    // Other optional arguments can be supplied, see above.
    service: "loop-react-ui-" + REACT_APP_BRANCH_ENV,
});

// errorHandler.report("Error Handler Started");

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        trace: true,
        traceLimit: 25
    }) || compose;
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

const UNAUTHORIZED = 406;

axios.interceptors.request.use((request) => {
    if (store.getState().isLoggedIn) {
        request.headers = { Authorization: "Bearer " + store.getState().userDetail.token };
    }
    return request;
});

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        const { status } = error.response ? error.response : '';
        if (status === UNAUTHORIZED) {
            store.dispatch({ type: "LOGOUT", value: null });

            store.dispatch({ type: "LOGIN_POPUP", value: true });
        }
        return Promise.reject(error);
    }
);

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <App />
        </Router>
    </Provider>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
