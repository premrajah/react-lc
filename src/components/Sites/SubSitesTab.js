import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import SitePageItem from "./SitePageItem";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import {CURRENT_SITE} from "../../store/types";

class SubSitesTab extends Component {
    slug;
    search;

    constructor(props) {
        super(props);

        this.state = {

            subSites:[]
        }

    }

    showSiteSelection=(event)=> {

        this.props.setSiteForm({show:true,
            item:this.props.item,type:"link", heading:"Link Child Sites",subSites:this.state.subSites});

    }


    componentDidUpdate(prevProps, prevState, snapshot) {

        console.log("udpate")
        if (prevProps!=this.props) {
            console.log("props changed")
            this.getSubSites()
        }
    }

    getSubSites=()=>{
        axios
            // .get(baseUrl + "site/" + encodeUrl(data) + "/expand"
            .get(baseUrl + "site/" + this.props.item._key+"/child")
            .then(
                (response) => {

                    var responseAll = response.data.data;

                    this.setState({
                        subSites:responseAll
                    })

                    console.log(responseAll)

                },
                (error) => {
                    // this.setState({
                    //     notFound: true,
                    // });
                }
            );



    }

    componentDidMount() {

    this.getSubSites()


    }

    render() {


        return (
            <>
                <p
                    style={{ margin: "10px 0px" }}
                    className={
                        "green-text forgot-password-link text-mute small"
                    }>
                    {this.props.isLoggedIn&& <span  data-parent={this.props.item._key}
                                                        onClick={this.showSiteSelection}
                                                    >
                                                        Link Sub Sites
                                                    </span>}
                </p>

                        {this.state.subSites.map(
                            (item, index) => (
                                <SitePageItem


                                    key={index}
                                    item={item}
                                    parentId={this.props.item._key}

                                />
                            )
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
        showSubProductView: state.showSubProductView,
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        loadProducts: (data) => dispatch(actionCreator.loadProducts(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),
        showSiteModal: (data) => dispatch(actionCreator.showSiteModal(data)),
        setSiteForm: (data) => dispatch(actionCreator.setSiteForm(data)),

        setProduct: (data) => dispatch(actionCreator.setProduct(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(SubSitesTab);
