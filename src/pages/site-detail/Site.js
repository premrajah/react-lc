import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";

import encodeUrl from "encodeurl";
import { withStyles } from "@mui/styles/index";
import NotFound from "../../components/NotFound/index";
import Layout from "../../components/Layout/Layout";
import SiteDetailContent from "../../components/Sites/SiteDetailContent";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import {CURRENT_SITE} from "../../store/types";

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
           loading:false,
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

  loadCurrentSite = (data) => {

      this.props.loading(true)
      this.setState({
          loading:true
      })

        axios
            .get(baseUrl + "site/code/" + encodeUrl(data) + "/expand")
            .then(
                (response) => {

                    var responseAll = response.data;

                    this.props.setCurrentSite(responseAll.data);
                    this.props.loading(false)
                    this.setState({
                        loading:false
                    })

                },
                (error) => {
                    // this.setState({
                    //     notFound: true,
                    // });

                    this.props.loading(false)
                    this.setState({
                        loading:false
                    })

                }
            );

    };


    componentDidMount() {
        this.loadCurrentSite(encodeUrl(this.slug),true);
    }

    render() {


        return (
            <>

                    {!this.state.loading&&!this.props.currentSite ? (
                        <NotFound />
                    ) : (
                        <Layout hideFooter={true}>
                            <div className={"container pb-5 mb-5"}>
                            {!this.state.loading&&this.props.currentSite && (
                                <>
                                 <SiteDetailContent
                                        history={this.props.history}
                                        hideRegister={true}
                                        item={this.props.currentSite}
                                    />
                                </>
                            )}
                        </div>
                        </Layout>
                    )}
            </>
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
        setCurrentSite: (data) => dispatch(actionCreator.setCurrentSite(data)),

        loading: (data) => dispatch(actionCreator.loading(data)),

    };
};
export default connect(mapStateToProps, mapDispachToProps)(Site);
