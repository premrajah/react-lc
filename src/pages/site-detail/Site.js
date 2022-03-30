import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";

import encodeUrl from "encodeurl";
import { withStyles } from "@mui/styles/index";
import NotFound from "../../components/NotFound/index";
import Layout from "../../components/Layout/Layout";
import SiteDetailContent from "../../components/Sites/SiteDetailContent";

class Site extends Component {
    slug;
    search;

    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            item: null,
            showPopUp: false,
            subProducts: [],

            notFound: false,
        };

        this.slug = props.match.params.slug;
        this.search = props.match.params.search;

    }

    UNSAFE_componentWillMount() {
        window.scrollTo(0, 0);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.match.params.slug !== this.props.match.params.slug) {
            this.slug = newProps.match.params.slug;
            window.scrollTo(0, 0);
            this.props.loadCurrentSite(encodeUrl(this.slug));

        }
    }



    handleBack = () => {
        this.props.history.goBack();
    };

    handleForward = () => {
        this.props.history.go(+1);
    };



    componentDidMount() {
        this.props.loadCurrentSite(encodeUrl(this.slug));
    }

    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <Layout hideFooter={true}>

                    {!this.props.loading&&!this.props.currentSite ? (
                        <NotFound />
                    ) : (
                        <div className={"container pb-4 mb-4"}>
                            {this.props.currentSite && (
                                <>
                                 <SiteDetailContent
                                        history={this.props.history}
                                        hideRegister={true}
                                        item={this.props.currentSite}
                                    />
                                </>
                            )}
                        </div>
                    )}

            </Layout>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        loginError: state.loginError,
        // cartItems: state.cartItems,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
        // abondonCartItem : state.abondonCartItem,
        // showNewsletter: state.showNewsletter
        loginPopUpStatus: state.loginPopUpStatus,
        currentSite:state.currentSite
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        loadCurrentSite: (data) => dispatch(actionCreator.loadCurrentSite(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(Site);
