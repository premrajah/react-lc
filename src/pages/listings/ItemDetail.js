import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import {withStyles} from "@mui/styles/index";
import Layout from "../../components/Layout/Layout";
import ListingDetail from "../../components/Listings/ListingDetail";

class ItemDetail extends Component {
    slug;
    search;
    marketplace
    constructor(props) {
        super(props);

        this.state = {

        };
        this.slug = props.match.params.slug;
        this.marketplace=props.match.path.includes("marketplace")?"marketplace":"my-listings"
        this.search = props.match.params.search;
    }

    componentDidMount() {

        window.scrollTo(0, 0);

    }



    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <Layout>

                        <>
                          <ListingDetail
                              type={"detail"}
                              hideMatchesTab={this.marketplace==="marketplace"}
                                         marketplace={this.marketplace}
                                         search={this.search}
                                         listingId={this.slug}  />
                        </>


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
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(ItemDetail);
