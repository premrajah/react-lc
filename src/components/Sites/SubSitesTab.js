import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import SitePageItem from "./SitePageItem";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import AddLinkIcon from "@mui/icons-material/AddLink";
import SiteFormNew from "./SiteFormNew";
import GlobalDialog from "../RightBar/GlobalDialog";

class SubSitesTab extends Component {
    slug;
    search;

    constructor(props) {
        super(props);

        this.state = {

            subSites:[],
            showSiteSelectPopUp:false
        }

    }

    showSiteSelection=(event)=> {

        // this.props.setSiteForm({show:true,
        //     item:null,type:"link",
        //     parent:this.props.item.site._key,
        //     heading:"Link Child Sites",
        //     subSites:this.state.subSites}
        //     );

        this.setState({
            showSiteSelectPopUp:!this.state.showSiteSelectPopUp
        })

    }


    componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps!=this.props) {
            this.getSubSites()
        }
    }

    getSubSites=()=>{

        axios
            .get(baseUrl + "site/" + this.props.item._key+"/child")
            .then(
                (response) => {

                    var responseAll = response.data.data;

                    this.setState({
                        subSites:responseAll
                    })

                },
                (error) => {
                    // this.setState({
                    //     notFound: true,
                    // });
                }
            );



    }

    componentDidMount() {


        // if (!this.props.item.children_sites)
        // this.getSubSites()
        //
        // else{
            this.setState({
                subSites:this.props.item.children_sites
            })
        // }


    }

    render() {


        return (
            <>

                {this.props.isLoggedIn&&

                <div  className={
                    " mt-4  text-right"}>
                    <button
                        data-parent={this.props.item.site._key}
                        onClick={this.showSiteSelection}
                        className={
                            "btn-gray-border "
                        }>
                        <AddLinkIcon />     <span>Link Subsites</span>

                    </button>
                </div> }


                <div className={"mt-4"}></div>

                        {this.props.item.children_sites.map(
                            (item, index) => (
                                <SitePageItem


                                    smallItem
                                   moreMenu
                                   showRemove
                                    key={index}
                                    item={item}
                                    parentId={this.props.item.site._key}

                                />
                            )
                        )}


                <GlobalDialog

                    heading={"Link Site"}
                    show={this.state.showSiteSelectPopUp}
                    hide={this.showSiteSelection}
                >
                    <>
                        <div className="col-12">

                <SiteFormNew   hide={this.showSiteSelection} item={this.props.item} link showHeader={false}  refresh={() => {}}   />

                        </div>
                </>
                </GlobalDialog>

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
