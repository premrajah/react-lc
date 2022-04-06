import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import PlaceholderImg from "../../img/place-holder-lc.png";
import {baseUrl, frontEndUrl} from "../../Util/Constants";
import axios from "axios/index";
import ImagesSlider from "./../ImagesSlider/ImagesSlider";
import encodeUrl from "encodeurl";
import {withStyles} from "@mui/styles/index";
import jspdf from "jspdf";
import MoreMenu from "./../MoreMenu";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import Box from '@mui/material/Box';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import InfoTabContent from "./InfoTabContent";
import ConditionsContent from "./ConditionsContent";
import DescriptionIcon from "@mui/icons-material/Description";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";

class CampaignDetail extends Component {
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
            listingLinked: null,
            searches: [],
            productQrCode: null,
            showRegister: false,
            sites: [],
            siteSelected: null,
            fieldsSite: {},
            errorsSite: {},
            showSubmitSite: false,
            errorRegister: false,
            showDeletePopUp: false,
            isVisibleReportModal: false,
            showRegisterSuccess: false,

            errorRelease: false,
            orgIdAuth: null,
            approveReleaseId: null,
            orgTrails: null,
            siteTrails: null,
            timelineDisplay: "org",
            zoomQrCode:false

        };


    }


    setActiveKey=(event,key)=>{


        this.setState({
            activeKey:key
        })


    }



     callBackResult=(action,key,blob_url) =>{

        if (action === "download") {


            window.location.href = blob_url

        }

         if (action === "edit") {

             this.props.toggleEditMode()


         }
    }












    handleBack = () => {
        this.props.history.goBack();
    };

    handleForward = () => {
        this.props.history.go(+1);
    };

    getMatches() {
        axios.get(baseUrl + "match/listing/" + encodeUrl(this.slug)).then(
            (response) => {
                var response = response.data;

                this.setState({
                    matches: response.data,
                });
            },
            (error) => {}
        );
    }

    UNSAFE_componentWillMount() {
        if (this.props.item.sub_products && this.props.item.sub_products.length > 0)
            this.getSubProducts();
    }


    componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps!==this.props) {



                this.setActiveKey(null,"1")



        }
    }

    componentDidMount() {
        this.setActiveKey(null,"1")

    }




    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <>

                    {/*<div className="container p-2 mb-150  m-2">*/}
                        {/*<PageHeader*/}
                        {/*    pageIcon={CubeBlue}*/}
                        {/*    pageTitle="Cma Details(Provenance)"*/}
                        {/*    subTitle="See product details and provenance"*/}
                        {/*/>*/}
                        <div className="row  mt-2 ml-2 justify-content-center">
                            <div className="col-md-4 col-sm-12 col-xs-12 ">
                                <div className="row stick-left-box  ">
                                    <div className="col-12  ">
                                        {this.props.item.artifacts &&
                                        this.props.item.artifacts.length > 0 ? (
                                            <ImagesSlider images={this.props.item.artifacts} />
                                        ) : (
                                            <img className={"img-fluid  rad-8 bg-white p-2"} src={PlaceholderImg} alt="" />
                                        )}
                                    </div>

                                </div>
                            </div>

                            <div className={"col-md-8 col-sm-12 col-xs-12 "}>
                                <div className="row justify-content-start pb-3  ">
                                    <div className="col-12 ">
                                        <div className="row">
                                            <div className="col-8">

                                              <h4 className="text-capitalize product-title">
                                            {this.props.item.campaign.name}</h4>

                                            </div>

                                            <div className="col-4 text-right">

                                                    <MoreMenu
                                                        triggerCallback={(action) =>
                                                            this.callBackResult(action)
                                                        }
                                                        edit={
                                                           true
                                                        }

                                                    />



                                            </div>
                                        </div>
                                    </div>


                                </div>


                                <div className="row justify-content-start pb-3  ">
                                    <div className="col-auto">
                                        <p style={{ fontSize: "16px" }} className={"text-gray-light  "}>
                                            {this.props.item.campaign.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="listing-row-border "></div>
                                <div className="row justify-content-start   tabs-detail">
                                    <div className="col-12 mt-2">
                                        <Box sx={{ width: '100%', typography: 'body1' }}>
                                            <TabContext value={this.state.activeKey}>
                                                <Box sx={{ borderBottom: 2, borderColor: '#EAEAEF' }}>
                                                    <TabList
                                                        variant="scrollable"
                                                        scrollButtons="auto"
                                                        textColor={"#27245C"}
                                                        TabIndicatorProps={{
                                                            style: {
                                                                backgroundColor: "#27245C",
                                                                padding: '2px',
                                                            }
                                                        }}
                                                        onChange={this.setActiveKey}

                                                        aria-label="lab API tabs example">

                                                        <Tab label="Info" value="1" />

                                                        <Tab label="Conditions" value="2" />

                                                        <Tab label="Message Template" value="3" />

                                                    </TabList>
                                                </Box>


                                                <TabPanel value="1">
                                                    <InfoTabContent  item={this.props.item} />
                                                </TabPanel>

                                                <TabPanel value="2">
                                                    <ConditionsContent  item={this.props.item} />
                                                </TabPanel>

                                                <TabPanel value="3">
                                                    <>
                                                        <div className={"bg-white mt-4 rad-8 p-2 gray-border"}>
                                                        {this.props.item.message_template.text}
                                                        </div>


                                                        <div  className="mt-3 mb-3 text-left pt-3 pb-3 ">

                                                            <div className={"col-12"}>
                                                        {this.props.item.artifacts&&this.props.item.artifacts.length > 0  &&
                                                        <p className=" custom-label text-bold text-blue mt-4 mb-4">

                                                            Files Uploaded

                                                        </p>}

                                                            </div>

                                                            {this.props.item.artifacts&&this.props.item.artifacts.length > 0 ? (
                                                                this.props.item.artifacts.map((artifact, index) => {
                                                                    if (
                                                                        artifact.mime_type === "application/pdf" ||
                                                                        artifact.mime_type === "application/rtf" ||
                                                                        artifact.mime_type === "application/msword" ||
                                                                        artifact.mime_type === "text/rtf" ||
                                                                        artifact.mime_type ===
                                                                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                                                                        artifact.mime_type ===
                                                                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                                                                        artifact.mime_type === "application/vnd.ms-excel"
                                                                    ) {
                                                                        return (

                                                                            <>
                                                                                {index==0 &&  <p className=" custom-label text-bold text-blue mt-4 mb-4">

                                                                                    Files Uploaded

                                                                                </p>}
                                                                                <div key={index} className="mt-3 mb-3 text-left pt-3 pb-3 bg-white row">

                                                                                    <div className={"col-10"}>

                                                                                        <DescriptionIcon style={{background:"#EAEAEF", opacity:"0.5", fontSize:" 2.5rem"}} className={" p-1 rad-4"} />
                                                                                        <span

                                                                                            className="ml-4  text-blue text-bold"
                                                                                            // href={artifact.blob_url}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer">
                                            {artifact.name}
                                        </span>

                                                                                    </div>
                                                                                    <div className={"col-2"}>


                                                                                        <MoreMenu

                                                                                            triggerCallback={(action) =>
                                                                                                this.callBackResult(action,artifact._key,artifact.blob_url)
                                                                                            }

                                                                                            download={
                                                                                                true
                                                                                            }


                                                                                        />



                                                                                    </div>

                                                                                </div>

                                                                            </>
                                                                        );
                                                                    }
                                                                })
                                                            ) : (
                                                                <div>No documents added.</div>
                                                            )}
                                                        </div>



                                                    </>

                                                </TabPanel>


                                            </TabContext>
                                        </Box>



                                    </div>
                                </div>



                            </div>
                        </div>

                    {/*</div>*/}


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
export default connect(mapStateToProps, mapDispachToProps)(CampaignDetail);
