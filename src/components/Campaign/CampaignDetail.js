import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import PlaceholderImg from "../../img/place-holder-lc.png";
import {baseUrl, frontEndUrl} from "../../Util/Constants";
import axios from "axios/index";
import ImagesSlider from "./../ImagesSlider/ImagesSlider";
import encodeUrl from "encodeurl";
import {withStyles} from "@mui/styles/index";
import jspdf from "jspdf";
import QrCodeBg from "../../img/qr-code-bg.png";
import LoopcycleLogo from "../../img/logo-text.png";
import MoreMenu from "./../MoreMenu";
import LinkIcon from '@mui/icons-material/Link';
import PageHeader from "./../PageHeader";
import CubeBlue from "../../img/icons/product-icon-big.png";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import Box from '@mui/material/Box';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import InfoTabContent from "./InfoTabContent";
import moment from "moment/moment";

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
            showOrgInput: false,
            showOrgInputSuccess: false,
            showApproveRelease: false,
            showApproveReleasePopUp: false,
            approveReleasePopUpSuccess: false,
            errorRelease: false,
            orgIdAuth: null,
            approveReleaseId: null,
            orgTrails: null,
            siteTrails: null,
            timelineDisplay: "org",
            zoomQrCode:false

        };

        this.getSubProducts = this.getSubProducts.bind(this);
        this.getMatches = this.getMatches.bind(this);
        this.getSearches = this.getSearches.bind(this);
        this.getListing = this.getListing.bind(this);
        this.getQrCode = this.getQrCode.bind(this);
        this.showRegister = this.showRegister.bind(this);
        this.getSites = this.getSites.bind(this);
        this.showSubmitSite = this.showSubmitSite.bind(this);
        this.callBackResult = this.callBackResult.bind(this);
        this.phonenumber = this.phonenumber.bind(this);
    }


    setActiveKey=(event,key)=>{


        this.setState({
            activeKey:key
        })


    }

    phonenumber(inputtxt) {
        var phoneNoWithCode = /^[+#*\\(\\)\\[\\]]*([0-9][ ext+-pw#*\\(\\)\\[\\]]*){6,45}$/;

        var phoneWithZero = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;

        if (inputtxt.match(phoneNoWithCode)) {
            return true;
        } else if (inputtxt.match(phoneWithZero)) {
            return true;
        } else {
            return false;
        }
    }

    showReportModal = () => this.setState({ isVisibleReportModal: true });
    hideReportModal = () => this.setState({ isVisibleReportModal: false });

    callBackResult(action) {
        if (action === "report") {
            this.showReportModal();
        } else if (action === "register") {
            this.showRegister();
        } else if (action === "selectCompany") {
            this.showOrgInput();
        } else if (action === "approveRelease") {
            this.showApproveReleasePopUp();
        }
    }


    showSubmitSite() {
        this.setState({
            errorRegister: null,
        });

        this.setState({
            showSubmitSite: !this.state.showSubmitSite,
        });
    }

    showApproveReleasePopUp = () => {
        this.setState({
            showApproveReleasePopUp: !this.state.showApproveReleasePopUp,
        });
    };

    handleValidationSite() {
        let fields = this.state.fieldsSite;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!fields["name"]) {
            formIsValid = false;
            errors["name"] = "Required";
        }

        // if (!fields["others"]) {
        //     formIsValid = false;
        //     errors["others"] = "Required";
        // }

        if (!fields["address"]) {
            formIsValid = false;
            errors["address"] = "Required";
        }

        if (!fields["contact"]) {
            formIsValid = false;
            errors["contact"] = "Required";
        }

        if (!fields["phone"]) {
            formIsValid = false;
            errors["phone"] = "Required";
        }
        if (fields["phone"] && !this.phonenumber(fields["phone"])) {
            formIsValid = false;
            errors["phone"] = "Invalid Phone Number!";
        }

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

        this.setState({ errorsSite: errors });
        return formIsValid;
    }

    handleChangeSite(field, e) {
        let fields = this.state.fieldsSite;
        fields[field] = e.target.value;
        this.setState({ fields: fields });
    }

    handleSubmitSite = (event) => {
        this.setState({
            errorRegister: null,
        });

        event.preventDefault();

        if (this.handleValidationSite()) {
            const form = event.currentTarget;

            this.setState({
                btnLoading: true,
            });

            const data = new FormData(event.target);

            const email = data.get("email");
            const others = data.get("others");
            const name = data.get("name");
            const contact = data.get("contact");
            const address = data.get("address");
            const phone = data.get("phone");

            axios
                .put(
                    baseUrl + "site",

                    {
                        site: {
                            name: name,
                            email: email,
                            contact: contact,
                            address: address,
                            phone: phone,
                            others: others,
                        },
                    }
                )
                .then((res) => {
                    // this.toggleSite()
                    this.getSites();

                    this.showSubmitSite();

                    this.setState({
                        siteSelected: res.data.data,
                    });
                })
                .catch((error) => {});
        }
    };

    submitRegisterProduct = (event) => {
        this.setState({
            errorRegister: null,
        });

        event.preventDefault();

        const form = event.currentTarget;

        this.setState({
            btnLoading: true,
        });

        const data = new FormData(event.target);

        const site = data.get("site");

        axios
            .post(
                baseUrl + "register",

                {
                    site_id: site,
                    product_id: this.props.item.campaign._key,
                }
            )
            .then((res) => {
                // this.toggleSite()
                // this.showRegister()

                this.setState({
                    showRegisterSuccess: true,
                });
            })
            .catch((error) => {
                this.setState({
                    errorRegister: error.response.data.errors[0].message,
                });
            });
    };
    companyDetails = (detail) => {
        if (detail.org) {
            this.setState({
                orgIdAuth: detail.org,
            });
        }
    };

    submitOrgId = (event) => {
        event.preventDefault();

        const form = event.currentTarget;

        const data = new FormData(event.target);

        const orgId = data.get("orgId");

        this.setState({
            orgIdAuth: orgId,
        });

        this.showOrgInput();

        axios
            .get(baseUrl + "release/no-auth?p=" + this.props.item.campaign._key + "&o=" + orgId)
            .then((res) => {
                let response = res.data.data;

                for (let i = 0; i < response.length; i++) {
                    if (response[i].stage === "requested") {
                        this.setState({
                            showApproveRelease: true,
                            approveReleaseId: response[i]._key,
                        });
                    }
                }
            })
            .catch((error) => {
                this.setState({
                    errorRelease: "Oops! Organisation ID entered is incorrect. Thanks",
                });
            });
    };
    submitApproveRelease = (event) => {
        axios
            .post(
                baseUrl + "release/complete",

                {
                    id: this.state.approveReleaseId,
                    org_id: this.state.orgIdAuth,
                }
            )
            .then((res) => {
                // this.toggleSite()
                // this.showRegister()

                // this.setState({
                //
                //     showRegisterSuccess:true
                // })

                this.setState({
                    approveReleasePopUpSuccess: true,
                });
            })
            .catch((error) => {
                this.setState({
                    errorRegister: error.response.data.errors[0].message,
                });
            });
    };

    getSites() {
        axios.get(baseUrl + "site").then(
            (response) => {
                let responseAll = response.data.data;

                this.setState({
                    sites: responseAll,
                });
            },
            (error) => {}
        );
    }

    handlePrintPdf = (productItem, productQRCode) => {
        const { _key, name } = productItem;
        if (!_key || !productQRCode) {
            return;
        }

        const pdf = new jspdf();
        pdf.setTextColor(39, 36, 92);
        pdf.text(name, 10, 30);

        pdf.setDrawColor(7, 173, 136);
        pdf.line(0, 40, 1000, 40);

        pdf.addImage(productQRCode, "PNG", 20, 40, 80, 80);
        pdf.addImage(productQRCode, "PNG", 100, 60, 40, 40);
        pdf.addImage(productQRCode, "PNG", 150, 70, 20, 20);

        pdf.setDrawColor(7, 173, 136);
        pdf.line(0, 120, 1000, 120);

        pdf.setTextColor(39, 36, 92);
        pdf.textWithLink("Loopcycle.io", 10, 160, { url: "https://loopcycle.io/" });

        pdf.save(`Loopcycle_QRCode_${name}_${_key}.pdf`);
    };

    showOrgInput = () => {
        this.setState({
            showOrgInput: !this.state.showOrgInput,
        });
    };

    showRegister() {
        this.getSites();
        this.setState({
            showRegister: !this.state.showRegister,
        });
    }

    getQrCode() {
        if(!this.props.item.campaign._key) return;

        axios.get(`${baseUrl}product/${this.props.item.campaign._key}/code-artifact?u=${frontEndUrl}p`)
            .then(response => {
                this.setState({productQrCode: response.data.data})
            })
            .catch(error => {

            })
    }

    getListing() {
        axios.get(baseUrl + "listing/" + this.props.item.listing.replace("Listing/", "")).then(
            (response) => {
                var responseData = response.data.data;

                this.setState({
                    listingLinked: responseData,
                });
            },
            (error) => {
                // var status = error.response.status
            }
        );
    }

    getSearches() {
        var searches = this.props.item.searches;

        for (var i = 0; i < searches.length; i++) {
            axios.get(baseUrl + "search/" + searches[i].replace("Search/", "")).then(
                (response) => {
                    var responseData = response.data.data;

                    var searches = this.state.searches;

                    searches.push(responseData);

                    this.setState({
                        searches: searches,
                    });
                },
                (error) => {
                    // var status = error.response.status
                }
            );
        }
    }

    getSubProducts() {
        var subProductIds = this.props.item.sub_products;

        for (var i = 0; i < subProductIds.length; i++) {
            var url = baseUrl + "code/" + subProductIds[i]._key + "/expand";

            axios.get(url).then(
                (response) => {
                    var responseAll = response.data;

                    var subProducts = this.state.subProducts;

                    subProducts.push(responseAll.data);

                    this.setState({
                        subProducts: subProducts,
                    });
                },
                (error) => {}
            );
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
        this.getQrCode();

        if (this.props.showRegister && this.props.isLoggedIn && this.props.userDetail) {
            this.getSites();
        }

        this.getProductTrails(this.props.item.campaign._key);

                this.setActiveKey(null,"1")

    }

    getProductTrails(productKey) {
        axios
            .get(`${baseUrl}code/${productKey}/trail`)
            .then((response) => {
                const data = response.data.data;
                this.setState({ orgTrails: data.org_trails, siteTrails: data.site_trails });
            })
            .catch((error) => {
                console.log("trail error ", error);
            });
    }

    handleTimelineOptions = (event) => {
        this.setState({ timelineDisplay: event.target.value });
    };


    callZoom=()=>{


        this.setState({
            zoomQrCode:!this.state.zoomQrCode


        })
    }

    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <>
                <div className="wrapper">

                    {this.state.zoomQrCode&&  <div onClick={this.callZoom} className="qr-code-zoom row zoom-out-cursor">
                        {this.props.item&&this.props.item.qr_artifact && (
                            <img
                                className="img-fluid qr-code-zoom"
                                src={this.props.item.qr_artifact.blob_url}

                            />
                        )}
                    </div>}

                    <div className="container  mb-150  pb-5 pt-4">
                        <PageHeader
                            pageIcon={CubeBlue}
                            pageTitle="Product Details(Provenance)"
                            subTitle="See product details and provenance"
                        />
                        <div className="row no-gutters  justify-content-center">
                            <div className="col-md-4 col-sm-12 col-xs-12 ">
                                <div className="row stick-left-box  ">
                                    <div className="col-12  ">
                                        {this.props.item.artifacts &&
                                        this.props.item.artifacts.length > 0 ? (
                                            <ImagesSlider images={this.props.item.artifacts} />
                                        ) : (
                                            <img className={"img-fluid"} src={PlaceholderImg} alt="" />
                                        )}





                                    </div>

                                </div>
                            </div>

                            <div className={"col-md-8 col-sm-12 col-xs-12 desktop-padding-left"}>
                                <div className="row justify-content-start pb-3  ">
                                    <div className="col-12 mt-2">
                                        <div className="row">
                                            <div className="col-8">
                                                <h4 className={"blue-text text-heading"}>


                                                    <h4 className="text-capitalize product-title">
                                            {this.props.item.campaign.name}</h4>

                                                </h4>
                                            {/*<span className={"text-gray-light small"}>    {moment(this.props.item.campaign._ts_epoch_ms).format("DD MMM YYYY")}</span>*/}
                                            </div>

                                            <div className="col-4 text-right">
                                                {this.props.isLoggedIn && (
                                                    <MoreMenu
                                                        triggerCallback={(action) =>
                                                            this.callBackResult(action)
                                                        }
                                                        edit={
                                                           true
                                                        }

                                                    />
                                                )}


                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-7">
                                                <div>
                                                    {/*<OrgComponent org={this.props.item.org} />*/}
                                                </div>
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
                                                    <InfoTabContent  item={this.props.item} />
                                                </TabPanel>
                                                <TabPanel value="3">
                                                    <>

                                                        <InfoTabContent  item={this.props.item} />

                                                    </>

                                                </TabPanel>

                                                <TabPanel value="6">
                                                    {/*<ArtifactProductsTab  hideAdd={true} item={this.props.item}/>*/}
                                                </TabPanel>

                                            </TabContext>
                                        </Box>



                                    </div>
                                </div>



                            </div>
                        </div>

                    </div>
                </div>



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
