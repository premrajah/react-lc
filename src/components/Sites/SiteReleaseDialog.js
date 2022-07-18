import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import encodeUrl from "encodeurl";
import {Alert, Modal, ModalBody} from "react-bootstrap";
import {withStyles} from "@mui/styles/index";
import TextField from "@mui/material/TextField";
import MoreMenu from "../MoreMenu";
import AutocompleteCustom from "../AutocompleteCustom";
import Close from "@mui/icons-material/Close";
import QrCode from "./QrCode";
import InfoTabContent from "./InfoTabContent";
import {GoogleMap} from "../Map/MapsContainer";
import SubSitesTab from "./SubSitesTab";
import SubProductsTab from "./SubProductsTab";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import Box from '@mui/material/Box';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import GlobalDialog from "../RightBar/GlobalDialog";
import BlueButton from "../FormsUI/Buttons/BlueButton";
import BlueBorderButton from "../FormsUI/Buttons/BlueBorderButton";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import BlueBorderLink from "../FormsUI/Buttons/BlueBorderLink";
import {getTimeFormat} from "../../Util/GlobalFunctions";
import CloseButtonPopUp from "../FormsUI/Buttons/CloseButtonPopUp";


class SiteReleaseDialog extends Component {
    slug;
    search;

    constructor(props) {
        super(props);

        this.state = {

            showSubmitSite: false,
            errorRegister: false,
            errorRelease: false,
            siteSelected: null,
            showProductEdit: false,
            productDuplicate: false,
            showReleaseProduct: false,
            showServiceAgent: false,
            showReleaseSuccess: false,
            releases:[]


        };



    }





    submitReleaseProduct = (event) => {

        this.setState({
            errorRegister: null,
        });

        event.preventDefault();

        const form = event.currentTarget;

        this.setState({
            btnLoading: true,
        });

        const data = new FormData(event.target);

        const site = data.get("org");

        axios.post(
                baseUrl + "site-release",
                {
                    org_id: site,
                    site_id: this.props.item.site._key,
                }
            )
            .then((res) => {
                this.setState({
                    currentReleaseId: res.data.data._key,
                    showReleaseSuccess: true,
                })

                this.fetchReleases()
            })
            .catch((error) => {
                this.setState({
                    errorRelease: error.response.data.errors[0].message,
                });
            });
    };

    fetchReleases=()=> {
        axios
            .get(baseUrl + "site-release/site/"+this.props.item.site._key)
            .then(
                (response) => {

                    this.setState({
                        releases: response.data.data,

                    });
                },
                (error) => {
                    // var status = error.response.status
                }
            );
    }

    componentDidMount() {
this.fetchReleases()

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        //
        // if (prevProps!==this.props) {
        //     this.setActiveKey("1")
        // }
    }
    companyDetails = (detail) => {
        if (detail.org) {
            this.setState({
                org_id: detail.org,
            });
        } else {
            axios.get(baseUrl + "org/company/" + detail.company).then(
                (response) => {
                    var responseAll = response.data.data;

                    this.setState({
                        org_id: responseAll._key,
                    });
                }
            ).catch(error => {});
        }
    };


    actionSubmit = () => {

        if (this.state.releases&&this.state.releases.length>0) {
            var data = {
                id: this.state.releases[0].Release._key,
                new_stage: "cancelled",
                // "site_id": this.state.site
            };

            axios
                .post(baseUrl + "site-release/stage", data)
                .then((res) => {


                    this.fetchReleases()

                    this.props.showSnackbar({show:true,severity:"success",message:"Release request cancelled successfully. Thanks"})


                })
                .catch((error) => {
                    // this.setState({
                    //
                    //     showPopUp: true,
                    //     loopError: error.response.data.content.message
                    // })
                });

        }
    };


    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (

                    <>

                        <GlobalDialog
                            allowOverflow
                            heading={"Release Site: "+ this.props.item.site.name}
                            show={this.props.showReleaseProduct}
                            hide={this.props.hide}
                        >
                            <>
                                <div className={"col-12 "}>


                                    {this.state.releases&&this.state.releases.length>0
                                    && this.state.releases.filter(item=>item.Release.stage!=="cancelled").map((release)=>

                                        <div className={"col-12 mt-3 "}>

                                            <div className="row mt-2 mb-4 no-gutters bg-light border-box rad-8 align-items-center">
                                                <div className={"col-11 text-blue "}>
                                                    Site Release request to  <b>{release.responder.name}</b> <br/>
                                                    Status: <span className="text-pink text-capitlize">{release.Release.stage}</span>
                                                    <br/><small className="text-gray-light mr-2">{getTimeFormat(release.Release._ts_epoch_ms)}</small>
                                                </div>

                                                <div className={"col-1 text-right "}>
                                                    <CloseButtonPopUp
                                                        // onClick={()=>this.removeCompany(2,item._key)}

                                                        onClick={this.actionSubmit}
                                                    />
                                                </div>
                                            </div>



                                        </div>
                                    )}

                                    {!(this.state.releases&&
                                        this.state.releases.length&&
                                        this.state.releases.filter(item=>item.Release.stage!=="cancelled").length>0)&&     <>


                                                    <> <div className={"row "}>
                                                        <div className={"col-12 "}>

                                                            <div style={{position:"relative"}} className="text_fild ">
                                                                <div
                                                                    className="custom-label text-bold ellipsis-end text-blue mb-0">Search release company
                                                                </div>
                                                                <AutocompleteCustom
                                                                    orgs={true}
                                                                    companies={true}
                                                                    suggestions={this.state.orgNames}
                                                                    selectedCompany={(action) =>
                                                                        this.companyDetails(action)
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className={"col-12 "}>
                                                            <form onSubmit={this.submitReleaseProduct}>
                                                                <div className={"row justify-content-center "}>
                                                                    <div className={"col-12 text-center mt-2"}>
                                                                        <div className={"row no-gutters justify-content-center"}>
                                                                            <div className={"col-12 text-center "}>
                                                                                <input
                                                                                    className={"d-none"}
                                                                                    value={this.state.org_id}
                                                                                    name={"org"}
                                                                                />

                                                                                <p className="d-none">
                                                                                    If the company you are looking for
                                                                                    doesn't exist?
                                                                                    <span
                                                                                        className={"green-link-url "}
                                                                                        onClick={this.showOrgForm}>
                                                                            {this.state.showOrgForm
                                                                                ? "Hide "
                                                                                : "Add Company"}
                                                                        </span>
                                                                                </p>
                                                                            </div>

                                                                            {this.state.errorRelease && (
                                                                                <div
                                                                                    className={
                                                                                        "row justify-content-center"
                                                                                    }>
                                                                                    <div
                                                                                        className={"col-12 mt-3"}
                                                                                        style={{ textAlign: "center" }}>
                                                                                        <Alert
                                                                                            key={"alert"}
                                                                                            variant={"danger"}>
                                                                                            {this.state.errorRelease}
                                                                                        </Alert>
                                                                                    </div>
                                                                                </div>
                                                                            )}

                                                                            {!this.state.showOrgForm && (
                                                                                <div
                                                                                    className={
                                                                                        "col-12 justify-content-center mt-3 "
                                                                                    }>
                                                                                    <div
                                                                                        className={
                                                                                            "row justify-content-center"
                                                                                        }>
                                                                                        <div
                                                                                            className={"col-6"}
                                                                                            style={{
                                                                                                textAlign: "center",
                                                                                            }}>
                                                                                            <BlueButton
                                                                                                fullWidth
                                                                                                title={"Submit"}
                                                                                                type={"submit"}>

                                                                                            </BlueButton>
                                                                                        </div>
                                                                                        <div
                                                                                            className={"col-6 d-none"}
                                                                                            style={{
                                                                                                textAlign: "center",
                                                                                            }}>
                                                                                            <BlueBorderButton
                                                                                                type="button"
                                                                                                fullWidth
                                                                                                title={"Cancel"}
                                                                                                onClick={
                                                                                                    this.
                                                                                                        props.hide
                                                                                                }
                                                                                            >

                                                                                            </BlueBorderButton>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div>


                                                        {this.state.showOrgForm && (
                                                            <>
                                                                <div className={"col-12 "}>
                                                                    <div className={"row m-2 container-gray"}>
                                                                        <div className={"col-12 text-left mt-2 "}>
                                                                            <p className={"text-bold text-blue"}>
                                                                                Add Company's Email
                                                                            </p>
                                                                        </div>
                                                                        <div className={"col-12 text-center "}>
                                                                            <>
                                                                                <div
                                                                                    className={
                                                                                        "row justify-content-center"
                                                                                    }>
                                                                                    <div
                                                                                        className={
                                                                                            "col-12 text-center mb-2"
                                                                                        }>
                                                                                        <TextField
                                                                                            id="outlined-basic"
                                                                                            onChange={this.handleChangeEmail.bind(
                                                                                                this,
                                                                                                "email"
                                                                                            )}
                                                                                            variant="outlined"
                                                                                            fullWidth={true}
                                                                                            name={"email"}
                                                                                            type={"email"}
                                                                                            value={this.state.email}
                                                                                        />
                                                                                    </div>

                                                                                    {this.state.emailError && (
                                                                                        <Alert
                                                                                            key={"alert"}
                                                                                            variant={"danger"}>
                                                                                            Invalid Email Address!
                                                                                        </Alert>
                                                                                    )}

                                                                                    <div
                                                                                        className={
                                                                                            "col-12 text-center mb-2"
                                                                                        }>
                                                                                        <button
                                                                                            onClick={
                                                                                                this.handleSubmitOrg
                                                                                            }
                                                                                            className={
                                                                                                "shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"
                                                                                            }>
                                                                                            Submit
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                    </>


</>}

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
        setProduct: (data) => dispatch(actionCreator.setProduct(data)),
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
        setSiteForm: (data) => dispatch(actionCreator.setSiteForm(data)),
        loadProductsWithoutParent: (data) =>
            dispatch(actionCreator.loadProductsWithoutParent(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(SiteReleaseDialog);