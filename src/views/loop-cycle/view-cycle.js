import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import Toolbar from "@mui/material/Toolbar";
import {Modal, ModalBody} from "react-bootstrap";
import GrayLoop from "../../img/icons/gray-loop.png";
import {makeStyles} from "@mui/styles";
import TextField from "@mui/material/TextField";
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import {withStyles} from "@mui/styles/index";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import NotFound from "../NotFound/index";
import PlaceholderImg from "../../img/place-holder-lc.png";
import ProductExpandItem from "../../components/Products/ProductExpandItem";
import Layout from "../../components/Layout/Layout";
import {Link} from "react-router-dom";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import InfoTabContent from "../../components/Cycles/InfoTabContent";
import {GoogleMap} from "../../components/Map/MapsContainer";
import OrgComponent from "../../components/Org/OrgComponent";
import BlueBorderButton from "../../components/FormsUI/Buttons/BlueBorderButton";
import GlobalDialog from "../../components/RightBar/GlobalDialog";
import GreenButton from "../../components/FormsUI/Buttons/GreenButton";
import GreenBorderButton from "../../components/FormsUI/Buttons/GreenBorderButton";

class ViewCycle extends Component {
    slug;

    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            item: null,
            fields: {},
            errors: {},
            showPopUpLogistics: false,
            showPopUpTrackingNumber: false,
            showPrompt: false,
            logisticsError: false,
            logisticsErrorMsg: "",
            showPopUpStep: false,
            orgs: [],
            stepStages: ["created", "accepted", "progress", "completed", "confirmed"],
            steps: ["transport", "processing", "cleaning"],
            notFound: false,
            image: null,
            showPopUpAction: false,
            showPopUpStepAction: false,
            action: null,
            stepAction: null,
            showOrgForm: false,
            email: null,
            stepId: null,
        };

        this.slug = props.match.params.slug;

        this.getResources = this.getResources.bind(this);
        this.confirmOffer = this.confirmOffer.bind(this);
        this.consumerConfirmOffer = this.consumerConfirmOffer.bind(this);
        this.declineOffer = this.declineOffer.bind(this);
        this.orderDelivered = this.orderDelivered.bind(this);
        this.orderReceived = this.orderReceived.bind(this);
        this.orderClose = this.orderClose.bind(this);
        this.showPopUpLogistics = this.showPopUpLogistics.bind(this);
        this.showStep = this.showStep.bind(this);
        this.showPopUpTrackingNumber = this.showPopUpTrackingNumber.bind(this);
        this.proceedCancel = this.proceedCancel.bind(this);
        this.updateStep = this.updateStep.bind(this);
        this.deliverCycle = this.deliverCycle.bind(this);
        this.showPopUpAction = this.showPopUpAction.bind(this);
        this.showPopUpStepAction = this.showPopUpStepAction.bind(this);
        this.showOrgForm = this.showOrgForm.bind(this);
        this.handleSubmitOrg = this.handleSubmitOrg.bind(this);
    }

    showOrgForm() {
        this.setState({
            showOrgForm: !this.state.showOrgForm,
        });
    }

    showPopUpAction(event) {
        if (event) {
            var action = event.currentTarget.dataset.action;

            this.setState({
                action: action,
            });
        }

        this.setState({
            showPopUpAction: !this.state.showPopUpAction,
        });
    }

    showPopUpStepAction(event) {
        if (event) {
            var action = event.currentTarget.dataset.action;

            var stepId = event.currentTarget.dataset.id;

            this.setState({
                stepAction: action,
                stepId: stepId,
            });
        }

        this.setState({
            showPopUpStepAction: !this.state.showPopUpStepAction,
        });
    }

    showPopUpTrackingNumber() {
        this.setState({
            showPopUpTrackingNumber: !this.state.showPopUpTrackingNumber,
        });
    }

    showPopUpLogistics() {
        this.setState({
            showPopUpLogistics: !this.state.showPopUpLogistics,
        });
    }

    showStep() {
        this.setState({
            showPopUpStep: !this.state.showPopUpStep,
        });
    }

    handleValidation() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;


        if (!fields["email"]) {
            formIsValid = false;
            errors["email"] = "Required";
        }

        if (typeof fields["email"] !== "undefined") {
            let lastAtPos = fields["email"].lastIndexOf("@");
            let lastDotPos = fields["email"].lastIndexOf(".");

            if (
                !(
                    lastAtPos < lastDotPos &&
                    lastAtPos > 0 &&
                    fields["email"].indexOf("@@") === -1 &&
                    lastDotPos > 2 &&
                    fields["email"].length - lastDotPos > 2
                )
            ) {
                formIsValid = false;
                errors["email"] = "Invalid email address";
            }
        }

        this.setState({ errors: errors });
        return formIsValid;
    }

    handleChange(field, e) {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });

        // this.handleValidationSubmitGreen()
    }

    handleChangeEmail(field, e) {
        this.setState({ email: e.target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const form = event.currentTarget;

        if (this.handleValidation()) {
            this.setState({
                btnLoading: true,
            });

            const data = new FormData(event.target);

            const username = data.get("email");

            axios
                .post(
                    baseUrl + "loop/" + this.slug + "/assign_logistics/" + username,
                    {},
                    {
                        headers: {
                            Authorization: "Bearer " + this.props.userDetail.token,
                        },
                    }
                )
                .then((res) => {
                    this.setState({
                        showPopUpLogistics: !this.state.showPopUpLogistics,
                    });

                    this.getResources();
                })
                .catch((error) => {
                    this.setState({
                        logisticsError: true,
                        logisticsErrorMsg: error.response.data.content.message,
                    });
                });
        } else {
        }
    };

    handleSubmitTracking = (event) => {
        event.preventDefault();

        const form = event.currentTarget;

        const data = new FormData(event.target);

        const username = data.get("tracking");

        axios
            .post(
                baseUrl + "loop/" + this.slug + "/update_tracking/" + username,
                {},
                {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                }
            )
            .then((res) => {
                this.setState({
                    showPopUpTrackingNumber: !this.state.showPopUpTrackingNumber,
                });

                this.getResources();
            })
            .catch((error) => {
                this.setState({
                    showPopUpTrackingNumber: false,
                    loopError: error.response.data.content.message,
                });
            });
    };

    getOrgIdOfOtherCompany() {
        if (this.state.item.sender._id != this.props.userDetail.orgid) {
            return this.state.item.sender._id;
        } else {
            return this.state.item.receiver._id;
        }
    }

    handleSubmitStep = (event) => {
        event.preventDefault();

        const form = event.currentTarget;

        const data = new FormData(event.target);

        const name = data.get("name");
        const description = data.get("description");
        const type = data.get("type");
        const notes = [data.get("note")];

        var dataStep = {
            step: {
                name: name,
                description: description,
                type: type,
                // "predecessor": null,
                notes: notes,
            },
            cycle_id: this.slug,
            org_id: data.get("org"),
        };

        axios
            .put(
                baseUrl + "step",
                dataStep,

                {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                }
            )
            .then((res) => {
                this.setState({
                    showPopUpStep: !this.state.showPopUpStep,
                });

                this.getResources();
            })
            .catch((error) => {});
    };

    handleSubmitOrg() {
        const email = this.state.email;


        axios
            .post(
                baseUrl + "org/email",
                { email: email },
                {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                }
            )
            .then((res) => {
                this.showOrgForm();
                this.getOrgs();
            })
            .catch((error) => {});
    }

    updateStep() {
        var action = this.state.stepAction;
        var stepId = this.state.stepId;

        var data = {
            step_id: stepId,
            new_stage: action,
        };

        axios
            .post(baseUrl + "step/stage", data, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then((res) => {
                this.getResources();

                this.showPopUpStepAction();
            })
            .catch((error) => {
                //
                // this.setState({
                //
                //     showPopUp: true,
                //     loopError: error.response.data.content.message
                // })
            });
    }

    setActiveKey=(event,key)=>{


        this.setState({
            activeKey:key
        })


    }

    deliverCycle(event) {
        var action = this.state.action;

        var data = {
            cycle_id: this.slug,
            new_stage: action,
        };

        axios
            .post(baseUrl + "cycle/stage", data, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then((res) => {
                this.showPopUpAction();

                this.getResources();
            })
            .catch((error) => {
                //
                // this.setState({
                //
                //     showPopUp: true,
                //     loopError: error.response.data.content.message
                // })
            });
    }

    confirmOffer() {
        axios
            .post(
                baseUrl + "loop/" + this.slug + "/producer_accept",
                {},
                {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                }
            )
            .then((res) => {
                this.setState({
                    showPopUp: true,
                });

                this.getResources();
            })
            .catch((error) => {
                this.setState({
                    showPopUp: true,
                    loopError: error.response.data.content.message,
                });
            });
    }

    consumerConfirmOffer() {
        axios
            .post(
                baseUrl + "loop/" + this.state.item.id + "/consumer_accept",
                {},
                {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                }
            )
            .then((res) => {
                this.setState({
                    showPopUp: true,
                });

                this.getResources();
            })
            .catch((error) => {
                this.setState({
                    showPopUp: true,
                    loopError: error.response.data.content.message,
                });
            });
    }

    orderDelivered() {
        axios
            .post(
                baseUrl + "loop/" + this.state.item.id + "/delivered",
                {},
                {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                }
            )
            .then((res) => {
                this.setState({
                    showPopUp: true,
                });

                this.getResources();
            })
            .catch((error) => {
                this.setState({
                    showPopUp: true,
                    loopError: error.response.data.content.message,
                });
            });
    }

    orderReceived() {
        axios
            .post(
                baseUrl + "loop/" + this.state.item.id + "/received",
                {},
                {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                }
            )
            .then((res) => {
                this.setState({
                    showPopUp: true,
                });

                this.getResources();
            })
            .catch((error) => {
                this.setState({
                    showPopUp: true,
                    loopError: error.response.data.content.message,
                });
            });
    }

    orderClose() {
        axios
            .post(
                baseUrl + "loop/" + this.state.item.id + "/close",
                {},
                {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                }
            )
            .then((res) => {
                this.setState({
                    showPopUp: true,
                });

                this.getResources();
            })
            .catch((error) => {
                this.setState({
                    showPopUp: true,
                    loopError: error.response.data.content.message,
                });
            });
    }

    proceedCancel() {
        axios
            .post(
                baseUrl + "loop/" + this.slug + "/cancel",
                {},
                {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                }
            )
            .then((res) => {
                this.setState({
                    showPopUp: true,
                });

                this.getResources();
            })
            .catch((error) => {
                this.setState({
                    showPopUp: true,
                    loopError: error.response.data.content.message,
                });
            });
    }

    declineOffer() {
        this.setState({
            showPrompt: !this.state.showPrompt,
        });
    }

    handleBack = () => {
        this.props.history.goBack();
    };

    handleForward = () => {
        this.props.history.go(+1);
    };

    getResources() {
        axios
            .get(baseUrl + "cycle/" + this.slug + "/expand", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseData = response.data;

                    this.setState({
                        item: responseData.data,
                    });

                    if (responseData.data.product.artifacts.length > 0) {
                        this.setState({
                            image: responseData.data.product.artifacts[0].blob_url,
                        });
                    }
                },
                (error) => {
                    this.setState({
                        notFound: true,
                    });
                }
            );
    }

    getOrgs() {
        axios
            .get(baseUrl + "org/all", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var response = response.data;

                    this.setState({
                        orgs: response.data,
                    });
                },
                (error) => {}
            );
    }


    interval;

    componentDidMount() {
        this.setState({
            activeKey:"0"
        })

        this.getResources();
        this.getOrgs();
        this.interval = setInterval(() => {
            this.getResources();
        }, 10000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <Layout>


                {this.state.notFound ? (
                    <NotFound />
                ) : (
                    <>
                        {this.state.item && (
                            <>
                                <div className="container " style={{ padding: "0" }}>
                                    <div className="row  pt-4 pb-4  justify-content-start">
                                        <div className="text-left    col-sm-12 col-xs-12 breadcrumb-row">
                                            <Link to={"/my-cycles"}>My Cycles</Link><span className={"divider-breadcrumb ps-2 pe-2"}>&#10095;</span><span className={"text-capitalize text-breadcrumb-light"}> {this.state.item.listing.name}</span>
                                        </div>
                                    </div>
                                    <div className="row no-gutters  justify-content-center  mb-4 pb-4">
                                        <div className="col-md-4 col-sm-12 col-xs-12 ">
                                            <div className="row   stick-left-box ">
                                                <div className="col-12 ">
                                                    <img
                                                        className={"img-fluid  rad-8 bg-white p-2"}
                                                        src={
                                                            this.state.image
                                                                ? this.state.image
                                                                : PlaceholderImg
                                                        }
                                                        alt=""
                                                    />
                                                </div>

                                                <div className="col-12 mt-2">
                                                    <p>
                                                        <span>
                                                            Product:
                                                            {this.state.item.product.product.name}
                                                        </span>
                                                    </p>
                                                    <p className="text-caps">
                                                        Stage:
                                                        <span
                                                            className={
                                                                "green-text text-heading text-caps"
                                                            }> {this.state.item.cycle.stage}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={"col-md-8 col-sm-12 col-xs-12 ps-4"}>
                                            <div className="row justify-content-start ">
                                                <div className="col-12 ">
                                                    <h5 className={"text-capitalize product-title "}>
                                                        {this.state.item.listing.name}
                                                    </h5>
                                                </div>

                                                <div className="col-12 ">
                                                    <div className="row">
                                                        <div className="col-7">
                                                            {/*<p> <span className={"green-text"}>{this.state.item.sender.name}</span></p>*/}
                                                            <div>
                                                                <OrgComponent
                                                                    org={
                                                                        this.state.item.sender
                                                                    }
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-5 blue-text text-blue text-bold  text-right">
                                                            {this.state.item.listing.price ? (
                                                                <>
                                                                    GBP
                                                                    {
                                                                        this.state.item.listing
                                                                            .price.value
                                                                    }
                                                                </>
                                                            ) : (
                                                                "Free"
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={"col-12 pt-3"}>

                                                    <div className="row justify-content-start pb-3 pt-3 ">
                                                        <div className="col-auto">
                                                            <p
                                                                style={{ fontSize: "16px" }}
                                                                className={"text-gray-light  "}>
                                                                {
                                                                    this.state.item.listing
                                                                        .description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                            {this.state.item &&
                                            <div className="row justify-content-start pb-3  tabs-detail">
                                                <div className="col-12 ">
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


                                                                    <Tab label="Info" value="0"/>

                                                                    <Tab label="Product" value="1" />
                                                                    <Tab label="Listing" value="2" />
                                                                    <Tab label="Search" value="3" />
                                                                    <Tab label="Delivery From" value="4" />
                                                                    <Tab label="Delivery To" value="5" />
                                                                </TabList>
                                                            </Box>

                                                            <TabPanel value="0">

                                                                <InfoTabContent item={this.state.item.listing}/>
                                                            </TabPanel>

                                                            {this.state.item.product &&  <TabPanel value="1">

                                                                <>

                                                                    <div className={"mt-4"}></div>
                                                                    {this.state.item && (
                                                                        <ProductExpandItem
                                                                            hideMoreMenu={true}
                                                                            hideAddAll={true}
                                                                            productId={this.state.item.product.product._key}
                                                                        />
                                                                    )}
                                                                </>

                                                            </TabPanel>}

                                                            <TabPanel value="2">
                                                            </TabPanel>
                                                            <TabPanel value="3">
                                                            </TabPanel>

                                                            {this.state.item.from_site &&
                                                            <TabPanel value="4">
                                                                <>

                                                                    <p className={"mt-4 mb-4"}>Linked Site:<span className={"text-bold"}> <Link to={"/ps/"+this.state.item.from_site._key}>{this.state.item.from_site.name}</Link></span></p>
                                                                    {this.state.item.from_site.geo_codes && this.state.item.from_site.geo_codes[0] &&

                                                                    <div className={"bg-white rad-8 p-2"}>
                                                                        <GoogleMap siteId={this.state.item.from_site._key} width={"100%"}
                                                                                   height={"300px"} locations={[{
                                                                            name: this.state.item.from_site.name,
                                                                            location: this.state.item.from_site.geo_codes[0].address_info.geometry.location,
                                                                            isCenter: true
                                                                        }]}/>
                                                                    </div>

                                                                    }

                                                                </>

                                                            </TabPanel>}

                                                            {this.state.item.to_site &&
                                                            <TabPanel value="5">
                                                                <>

                                                                    <p className={"mt-4 mb-4"}>Linked Site:<span className={"text-bold"}> <Link to={"/ps/"+this.state.item.to_site._key}>{this.state.item.to_site.name}</Link></span></p>
                                                                    {this.state.item.to_site.geo_codes && this.state.item.to_site.geo_codes[0] &&

                                                                    <div className={"bg-white rad-8 p-2"}>
                                                                        <GoogleMap siteId={this.state.item.to_site._key} width={"100%"}
                                                                                   height={"300px"} locations={[{
                                                                            name: this.state.item.to_site.name,
                                                                            location: this.state.item.to_site.geo_codes[0].address_info.geometry.location,
                                                                            isCenter: true
                                                                        }]}/>
                                                                    </div>

                                                                    }

                                                                </>

                                                            </TabPanel>}

                                                        </TabContext>
                                                    </Box>

                                                </div>
                                            </div>}





                                                <>


                                                    <div className="row  mt-3  pb-4 mb-4">
                                                        <div className="col-6 ">
                                                            <h4
                                                                className={
                                                                    " text-bold text-label text-blue mb-1"
                                                                }>
                                                                Steps
                                                            </h4>
                                                        </div>

                                                        <div className="col-6 text-right">
                                                            {this.state.item.cycle.stage ===
                                                                "progress" &&
                                                                (this.state.item.receiver._id ===
                                                                    this.props.userDetail.orgId ||
                                                                    this.state.item.sender._id ===
                                                                        this.props.userDetail
                                                                            .orgId) && (
                                                                    <div className=" col-auto text-right">
                                                                        <BlueBorderButton
                                                                            title={this.state.item.receiver._id===this.props.userDetail.orgId?"Request a Step":"Add Step"}
                                                                            onClick={this.showStep}
                                                                            type="button"
                                                                           >
                                                                            <AddIcon/>


                                                                        </BlueBorderButton>
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </div>

                                                    {this.state.item.steps && (
                                                        <>
                                                            {this.state.item.steps.map(
                                                                (item, index) => (
                                                                    <div className="row rad-8 m-1 p-3 bg-white step-box pb-4 pb-4 mb-4">
                                                                        {/*<div className="col-1">*/}
                                                                        {/*<p className={"text-bold text-left text-blue"}>{index+1}.</p>*/}

                                                                        {/*</div>*/}
                                                                        <div className="col-6 pb-2 pt-2">
                                                                            <span
                                                                                className={
                                                                                    "text-mute text-left "
                                                                                }>
                                                                                {item.step.stage}
                                                                            </span>
                                                                            <br />
                                                                            <span
                                                                                style={{
                                                                                    fontSize:
                                                                                        "18px",
                                                                                }}
                                                                                className={
                                                                                    "text-bold text-left text-blue"
                                                                                }>
                                                                                {item.step.name},
                                                                                {
                                                                                    item.step
                                                                                        .description
                                                                                }
                                                                            </span>
                                                                            <br />
                                                                            <span
                                                                                className={
                                                                                    " text-left "
                                                                                }>
                                                                                Type:
                                                                                {item.step.type}
                                                                            </span>
                                                                            <br />
                                                                            <span
                                                                                className={
                                                                                    " text-left "
                                                                                }>
                                                                                Creator: <OrgComponent orgId={item.creator_org_id.replace("Org/","")}  />
                                                                            </span>
                                                                            <br />
                                                                            <span
                                                                                className={
                                                                                    " text-left "
                                                                                }>

                                                                                Owner: <OrgComponent orgId={item.owner_org_id.replace("Org/","")}  />
                                                                            </span>
                                                                        </div>

                                                                        <>
                                                                            {item.nextAction
                                                                                .is_mine &&
                                                                                item.nextAction
                                                                                    .possible_actions
                                                                                    .length > 0 && (
                                                                                    <div className="col-6 text-right pb-2 pt-2">
                                                                                        {item.nextAction.possible_actions.map(
                                                                                            (
                                                                                                actionName
                                                                                            ) => (
                                                                                                <>
                                                                                                    {((actionName ===
                                                                                                        "cancelled" &&
                                                                                                        item.creator_org_id ===
                                                                                                            this
                                                                                                                .props
                                                                                                                .userDetail
                                                                                                                .orgId) ||
                                                                                                        actionName !==
                                                                                                            "cancelled") && (
                                                                                                        <button
                                                                                                            data-id={
                                                                                                                item
                                                                                                                    .step
                                                                                                                    ._key
                                                                                                            }
                                                                                                            data-action={
                                                                                                                actionName
                                                                                                            }
                                                                                                            onClick={this.showPopUpStepAction.bind(
                                                                                                                this
                                                                                                            )}
                                                                                                            type="button"
                                                                                                            className={
                                                                                                                actionName ===
                                                                                                                "accepted"
                                                                                                                    ? "shadow-sm mr-2 btn btn-link  mt-2 mb-2 green-btn-border"
                                                                                                                    : actionName ===
                                                                                                                      "cancelled"
                                                                                                                    ? "shadow-sm mr-2 btn btn-link  mt-2 mb-2 orange-btn-border"
                                                                                                                    : actionName ===
                                                                                                                      "rejected"
                                                                                                                    ? "shadow-sm mr-2 btn btn-link  mt-2 mb-2 orange-btn-border"
                                                                                                                    : actionName ===
                                                                                                                      "declined"
                                                                                                                    ? "shadow-sm mr-2 btn btn-link  mt-2 mb-2 orange-btn-border"
                                                                                                                    : actionName ===
                                                                                                                      "progress"
                                                                                                                    ? "shadow-sm mr-2 btn btn-link  mt-2 mb-2 green-btn-border"
                                                                                                                    : actionName ===
                                                                                                                      "completed"
                                                                                                                    ? "shadow-sm mr-2 btn btn-link  mt-2 mb-2 green-btn-border"
                                                                                                                    : "shadow-sm mr-2 btn btn-link  mt-2 mb-2 green-btn-border"
                                                                                                            }>
                                                                                                            {actionName ===
                                                                                                                "accepted" &&
                                                                                                                "Accept"}
                                                                                                            {actionName ===
                                                                                                                "cancelled" &&
                                                                                                                "Cancel"}
                                                                                                            {actionName ===
                                                                                                                "rejected" &&
                                                                                                                "Reject"}
                                                                                                            {actionName ===
                                                                                                                "declined" &&
                                                                                                                "Decline"}
                                                                                                            {actionName ===
                                                                                                                "confirmed" &&
                                                                                                                "Confirm"}
                                                                                                            {actionName ===
                                                                                                                "progress" &&
                                                                                                                "Progress"}
                                                                                                            {actionName ===
                                                                                                                "completed" &&
                                                                                                                "Complete"}
                                                                                                        </button>
                                                                                                    )}
                                                                                                </>
                                                                                            )
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                        </>
                                                                    </div>
                                                                )
                                                            )}
                                                        </>
                                                    )}
                                                </>

                                        </div>
                                    </div>
                                </div>

                                {this.state.item &&
                                    this.state.item.cycle &&
                                    this.state.item.cycle.stage !== "closed" && (

                                            <div
                                                className={ "custom-bottom-fixed-appbar  custom-bottom-appbar"}>

                                                <Toolbar>
                                                    <div className="container ">
                                                        <div
                                                            className="row  justify-content-center search-container "
                                                            style={{ margin: "auto" }}>
                                                            {this.state.item.next_action
                                                                .is_mine && (
                                                                <div className="col-auto text-center">
                                                                    {this.state.item.next_action.possible_actions.map(
                                                                        (item) => (
                                                                            <>
                                                                                {!(
                                                                                    item ===
                                                                                        "progress" &&
                                                                                    this.state.item
                                                                                        .cycle
                                                                                        .stage ===
                                                                                        "progress"
                                                                                ) && (
                                                                                    <button
                                                                                        data-action={
                                                                                            item
                                                                                        }
                                                                                        onClick={this.showPopUpAction.bind(
                                                                                            this
                                                                                        )}
                                                                                        type="button"
                                                                                        className="shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-green text-caps">
                                                                                        {item}
                                                                                    </button>
                                                                                )}
                                                                            </>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Toolbar>
                                            </div>

                                    )}

                                <GlobalDialog
                                    className={"loop-popup"}
                                    aria-labelledby="contained-modal-title-vcenter"
                                    centered
                                    show={this.state.showPopUpLogistics}
                                    onHide={this.showPopUpLogistics}
                                    animation={false}>
                                    <ModalBody>
                                        <div className={"row justify-content-center"}>
                                            <div className={"col-4"}>
                                                <img
                                                    className={"ring-pop-pup"}
                                                    src={GrayLoop}
                                                    alt=""
                                                />
                                            </div>
                                        </div>

                                        <>
                                            <div className={"row"}>
                                                <div className={"col-12 text-center"}>
                                                    <h5 className={"text-bold text-center"}>
                                                        Please provide a email address of logistics
                                                        provider :
                                                    </h5>
                                                    {/*A cycle has been created. Send a message to the seller to arrange a delivery time.*/}
                                                </div>
                                            </div>
                                            <form onSubmit={this.handleSubmit}>
                                                <div className={"row justify-content-center"}>
                                                    <div className={"col-12"}>
                                                        <TextField
                                                            id="outlined-basic"
                                                            label="Email"
                                                            variant="outlined"
                                                            fullWidth={true}
                                                            name={"email"}
                                                            type={"email"}
                                                            onChange={this.handleChange.bind(
                                                                this,
                                                                "email"
                                                            )}
                                                        />
                                                        {this.state.logisticsError && (
                                                            <span className={"text-mute small"}>
                                                                <span style={{ color: "red" }}>
                                                                    *
                                                                </span>
                                                                {this.state.logisticsErrorMsg}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className={"col-12 mt-2"}>
                                                        <button
                                                            type={"submit"}
                                                            className={
                                                                "btn-green btn btn-default btn-lg btn-rounded shadow btn-block login-btn"
                                                            }>
                                                            Submit
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </>
                                    </ModalBody>
                                </GlobalDialog>

                                <Modal
                                    className={"loop-popup"}
                                    aria-labelledby="contained-modal-title-vcenter"
                                    centered
                                    show={this.state.showPopUpLogistics}
                                    onHide={this.showPopUpLogistics}
                                    animation={false}>
                                    <ModalBody>
                                        <div className={"row justify-content-center"}>
                                            <div className={"col-4"}>
                                                <img
                                                    className={"ring-pop-pup"}
                                                    src={GrayLoop}
                                                    alt=""
                                                />
                                            </div>
                                        </div>

                                        <>
                                            <div className={"row"}>
                                                <div className={"col-12 text-center"}>
                                                    <h5 className={"text-bold text-center"}>
                                                        Please provide a email address of logistics
                                                        provider :
                                                    </h5>
                                                    {/*A cycle has been created. Send a message to the seller to arrange a delivery time.*/}
                                                </div>
                                            </div>
                                            <form onSubmit={this.handleSubmit}>
                                                <div className={"row justify-content-center"}>
                                                    <div className={"col-12"}>
                                                        <TextField
                                                            id="outlined-basic"
                                                            label="Email"
                                                            variant="outlined"
                                                            fullWidth={true}
                                                            name={"email"}
                                                            type={"email"}
                                                            onChange={this.handleChange.bind(
                                                                this,
                                                                "email"
                                                            )}
                                                        />
                                                        {this.state.logisticsError && (
                                                            <span className={"text-mute small"}>
                                                                <span style={{ color: "red" }}>
                                                                    *
                                                                </span>
                                                                {this.state.logisticsErrorMsg}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className={"col-12 mt-2"}>
                                                        <button
                                                            type={"submit"}
                                                            className={
                                                                "btn-green btn btn-default btn-lg btn-rounded shadow btn-block login-btn"
                                                            }>
                                                            Submit
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </>
                                    </ModalBody>
                                </Modal>

                                <Modal
                                    className={"loop-popup"}
                                    aria-labelledby="contained-modal-title-vcenter"
                                    centered
                                    show={this.state.showPopUpTrackingNumber}
                                    onHide={this.showPopUpTrackingNumber}
                                    animation={false}>
                                    <ModalBody>
                                        <div className={"row justify-content-center"}>
                                            <div className={"col-4"}>
                                                <img className={"ring-pop-pup"} src={GrayLoop} alt="" />
                                            </div>
                                        </div>

                                        <>
                                            <div className={"row"}>
                                                <div className={"col-12"}>
                                                    <h5 className={"text-bold text-center"}>
                                                        Please provide a tracking number:
                                                    </h5>
                                                </div>
                                            </div>
                                            <form onSubmit={this.handleSubmitTracking}>
                                                <div className={"row justify-content-center"}>
                                                    <div className={"col-12 text-center"}>
                                                        <TextField
                                                            id="outlined-basic"
                                                            label="Tracking Number"
                                                            variant="outlined"
                                                            fullWidth={true}
                                                            name={"tracking"}
                                                            type={"tracking"}
                                                        />
                                                    </div>
                                                    <div className={"col-12 text-center mt-2"}>
                                                        <button
                                                            type={"submit"}
                                                            className={
                                                                "btn-green btn btn-default btn-lg btn-rounded shadow btn-block login-btn"
                                                            }>
                                                            Submit
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </>
                                    </ModalBody>
                                </Modal>

                                <Modal
                                    className={"loop-popup"}
                                    aria-labelledby="contained-modal-title-vcenter"
                                    centered
                                    show={this.state.showPrompt}
                                    onHide={this.declineOffer}
                                    animation={true}>
                                    <ModalBody>
                                        <>
                                            <div className={"row justify-content-center"}>
                                                <div
                                                    className={"col-12"}
                                                    style={{ textAlign: "center" }}>
                                                    <h5 className={"text-bold"}>
                                                        Are you sure you want to proceed?
                                                    </h5>
                                                    {/*A cycle has been created. Send a message to the seller to arrange a delivery time.*/}
                                                </div>
                                            </div>
                                            <form onSubmit={this.handleSubmit}>
                                                <div className={"row justify-content-center"}>
                                                    <div className={"row"}>
                                                        <div className={"col-6 mt-2"}>
                                                            <button
                                                                onClick={this.declineOffer}
                                                                type={"submit"}
                                                                className={
                                                                    "green-btn-border btn btn-default btn-lg btn-rounded shadow btn-block "
                                                                }>
                                                                Cancel
                                                            </button>
                                                        </div>
                                                        <div className={"col-6 mt-2"}>
                                                            <button
                                                                onClick={this.proceedCancel}
                                                                type={"submit"}
                                                                className={
                                                                    "btn-green btn btn-default btn-lg btn-rounded shadow btn-block "
                                                                }>
                                                                Yes
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </>
                                    </ModalBody>
                                </Modal>

                                {this.state.showPopUpStep && (
                                    <div className={"row"}>
                                        <div className="col-auto">
                                            <button
                                                onClick={this.showStep}
                                                type="button"
                                                className=" mr-2 btn btn-link green-border-btn mt-2 mb-2 btn-blue">
                                                Add Step
                                            </button>
                                        </div>
                                    </div>
                                )}


                                <GlobalDialog show={this.state.showPopUpStep}
                                    hide={this.showStep}
                                heading={"Create Step"}>
                                        <form onSubmit={this.handleSubmitStep}>
                                            <div className={"row justify-content-center"}>
                                                <div className={"col-12 text-center mb-4"}>
                                                    <TextField
                                                        id="outlined-basic"
                                                        label="Name"
                                                        variant="outlined"
                                                        fullWidth={true}
                                                        name={"name"}
                                                        type={"text"}
                                                    />
                                                </div>

                                                <div className={"col-12 text-center mb-4"}>
                                                    <TextField
                                                        id="outlined-basic"
                                                        label="Description"
                                                        variant="outlined"
                                                        fullWidth={true}
                                                        name={"description"}
                                                        type={"text"}
                                                    />
                                                </div>

                                                <div className={"col-12 text-center mb-4"}>
                                                    <TextField
                                                        id="outlined-basic"
                                                        label="Note"
                                                        variant="outlined"
                                                        fullWidth={true}
                                                        name={"note"}
                                                        type={"text"}
                                                    />
                                                </div>

                                                <div className={"col-12 text-center mb-4"}>
                                                    <FormControl
                                                        variant="outlined"
                                                        className={classes.formControl}>
                                                        <InputLabel htmlFor="outlined-age-native-simple">
                                                            Type
                                                        </InputLabel>
                                                        <Select
                                                            native
                                                            label={"Type"}
                                                            inputProps={{
                                                                name: "type",
                                                                id: "outlined-age-native-simple",
                                                            }}>
                                                            <option value={null}>Select</option>

                                                            {this.state.steps.map((item) => (
                                                                <option value={item}>{item}</option>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </div>

                                                <div className={"col-12 text-center mb-4"}>
                                                    <FormControl
                                                        variant="outlined"
                                                        className={classes.formControl}>
                                                        <InputLabel htmlFor="outlined-age-native-simple">
                                                            Select Organisation
                                                        </InputLabel>
                                                        <Select
                                                            native
                                                            label={"Select Organisation"}
                                                            inputProps={{
                                                                name: "org",
                                                                id: "outlined-age-native-simple",
                                                            }}>
                                                            <option value={null}>Select</option>

                                                            {this.state.orgs.map((item) => (
                                                                <option value={item._key}>
                                                                    {item.name}
                                                                </option>
                                                            ))}
                                                        </Select>
                                                    </FormControl>

                                                    <p>
                                                        If the company you are looking for doesn't
                                                        exist?
                                                        <span
                                                            className={"green-link-url "}
                                                            onClick={this.showOrgForm}>
                                                            Add Company
                                                        </span>
                                                    </p>

                                                    {this.state.showOrgForm && (
                                                        <>
                                                            <div
                                                                className={
                                                                    "row m-2 container-gray"
                                                                }>
                                                                <div
                                                                    className={
                                                                        "col-12 text-left mt-2 "
                                                                    }>
                                                                    <p
                                                                        className={
                                                                            "text-bold text-blue"
                                                                        }>
                                                                        Add Company's Email
                                                                    </p>
                                                                </div>
                                                                <div
                                                                    className={
                                                                        "col-12 text-center "
                                                                    }>
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
                                                                                    type={"text"}
                                                                                    value={
                                                                                        this.state
                                                                                            .email
                                                                                    }
                                                                                />
                                                                            </div>

                                                                            <div
                                                                                className={
                                                                                    "col-12 text-center mb-2"
                                                                                }>
                                                                                <button
                                                                                    onClick={
                                                                                        this
                                                                                            .handleSubmitOrg
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
                                                        </>
                                                    )}
                                                </div>

                                                <div className={"col-12 text-center mb-4"}>
                                                    <div className={"row justify-content-center"}>
                                                        <div
                                                            className={"col-6"}
                                                            style={{ textAlign: "center" }}>
                                                            <GreenButton
                                                               title={"Submit"}
                                                                type={"submit"}>
                                                                Submit
                                                            </GreenButton>
                                                        </div>
                                                        <div
                                                            className={"col-6"}
                                                            style={{ textAlign: "center" }}>
                                                            <GreenBorderButton
                                                                title={"Cancel"}
                                                                type={"button"}
                                                                onClick={this.showStep}
                                                               >
                                                                Cancel
                                                            </GreenBorderButton>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                </GlobalDialog>
                                {/*    </ModalBody>*/}
                                {/*</Modal>*/}
                            </>
                        )}
                    </>
                )}

                <Modal
                    className={"loop-popup"}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.state.showPopUpAction}
                    onHide={this.showPopUpAction}
                    animation={false}>
                    <ModalBody>
                        {/*<div className={"row justify-content-center"}>*/}
                        {/*<div className={"col-4 text-center"}>*/}
                        {/*<img className={"ring-pop-pup"} src={GrayLoop} alt=""/>*/}
                        {/*</div>*/}
                        {/*</div>*/}

                        <div className={"row justify-content-center"}>
                            <div className={"col-10 text-center"}>
                                <p className={"text-bold text-capitlize"}>
                                    {this.state.action === "delivered"
                                        ? "Deliver"
                                        : this.state.action === "received"
                                        ? "Receive"
                                        : this.state.action === "closed"
                                        ? "Close"
                                        : this.state.action === "counter"
                                        ? "Counter"
                                        : this.state.action === "withdraw"
                                        ? "Withdraw"
                                          : this.state.action === "settled"
                                                            ? "Settle"
                                        : this.state.action}

                                </p>
                                <p>Are you sure you want to proceed ?</p>
                            </div>
                        </div>

                        <div className={"row justify-content-center"}>
                            <div className={"col-12 text-center mt-2"}>
                                <div className={"row justify-content-center"}>
                                    <div className={"col-6"} style={{ textAlign: "center" }}>
                                        <GreenButton
                                            title={"Submit"}
                                            onClick={this.deliverCycle.bind(this)}

                                            type={"submit"}>
                                            Submit
                                        </GreenButton>
                                    </div>
                                    <div className={"col-6"} style={{ textAlign: "center" }}>
                                        <GreenBorderButton
                                            type={"button"}
                                            title={"Cancel"}
                                            onClick={this.showPopUpAction}

                                        >

                                        </GreenBorderButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>

                <Modal
                    className={"loop-popup"}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.state.showPopUpStepAction}
                    onHide={this.showPopUpStepAction}
                    animation={false}>
                    <ModalBody>
                        {/*<div className={"row justify-content-center"}>*/}
                        {/*<div className={"col-4 text-center"}>*/}
                        {/*<img className={"ring-pop-pup"} src={GrayLoop} alt=""/>*/}
                        {/*</div>*/}
                        {/*</div>*/}

                        <div className={"row justify-content-center"}>
                            <div className={"col-10 text-center"}>
                                <p className={"text-bold text-caps"}>
                                    {this.state.stepAction === "accepted" && "Accept "}
                                    {this.state.stepAction === "cancelled" && "Cancel "}
                                    {this.state.stepAction === "rejected" && "Reject "}
                                    {this.state.stepAction === "declined" && "Decline "}
                                    {this.state.stepAction === "confirmed" && "Confirm "}
                                    {this.state.stepAction === "progress" && "Progress "}
                                    {this.state.stepAction === "completed" && "Complete "}
                                    :Step Action
                                </p>
                                <p>Are you sure you want to proceed ?</p>
                            </div>
                        </div>

                        <div className={"row justify-content-center"}>
                            <div className={"col-12 text-center mt-2"}>
                                <div className={"row justify-content-center"}>
                                    <div className={"col-6"} style={{ textAlign: "center" }}>
                                        <button
                                            onClick={this.updateStep.bind(this)}
                                            className={
                                                "shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"
                                            }
                                            type={"submit"}>
                                            Submit
                                        </button>
                                    </div>
                                    <div className={"col-6"} style={{ textAlign: "center" }}>
                                        <p
                                            onClick={this.showPopUpStepAction}
                                            className={
                                                "shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue"
                                            }>
                                            Cancel
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </Layout>
        );
    }
}

const useStyles = makeStyles((theme) => ({
    text: {
        padding: theme.spacing(2, 2, 0),
    },
    paper: {
        paddingBottom: 50,
    },
    list: {
        marginBottom: theme.spacing(2),
    },
    subheader: {
        backgroundColor: theme.palette.background.paper,
    },
    appBar: {
        top: "auto",
        bottom: 0,
    },
    grow: {
        flexGrow: 1,
    },
    fabButton: {
        position: "absolute",
        zIndex: 1,
        top: -30,
        left: 0,
        right: 0,
        margin: "0 auto",
    },
}));

function StatusTimeline(props) {
    return (
        <>
            {props.cycle.steps && (
                <Timeline>
                    {props.cycle.steps.map((item, index) => (
                        <>
                            <TimelineItem>
                                <TimelineOppositeContent>
                                    <Typography variant="h6" component="h1">
                                        {item.step.type}
                                    </Typography>
                                    <Typography>{item.step.stage}</Typography>
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineDot style={{ backgroundColor: "#27245C" }}>
                                        <CheckIcon />
                                    </TimelineDot>
                                </TimelineSeparator>
                                <TimelineContent>
                                    <Typography variant="h6" component="h1">
                                        {item.step.name}
                                    </Typography>
                                    <Typography>{item.step.description}</Typography>
                                    <Typography>Creator: <OrgComponent orgId={item.creator_org_id.replace("Org/","")}  /></Typography>
                                    <Typography>Owner: <OrgComponent orgId={item.owner_org_id.replace("Org/","")}  /></Typography>
                                </TimelineContent>
                            </TimelineItem>

                            {index > 0 && <TimelineConnector />}
                        </>
                    ))}
                </Timeline>
            )}
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        loginError: state.loginError,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
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
export default connect(mapStateToProps, mapDispachToProps)(ViewCycle);
