import React, { Component } from "react";
import * as actionCreator from "../store/actions/actions";
import { connect } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import { Link } from "react-router-dom";
import PlaceholderImg from "../img/place-holder-lc.png";
import { makeStyles } from "@material-ui/core/styles";
import { baseUrl, frontEndUrl } from "../Util/Constants";
import axios from "axios/index";
import moment from "moment";
import ImagesSlider from "./ImagesSlider";
import encodeUrl from "encodeurl";
import { Alert, Modal, ModalBody, Tab, Tabs } from "react-bootstrap";
import { withStyles } from "@material-ui/core/styles/index";
import ProductItemNew from "./ProductItemNew";
import jspdf from "jspdf";
import QrCodeBg from "../img/qr-code-bg.png";
import SearchItem from "../views/loop-cycle/search-item";
import ResourceItem from "../views/create-search/ResourceItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Org from "./Org/Org";
import LoopcycleLogo from "../img/logo-text.png";
import MoreMenu from "./MoreMenu";
import IssueSubmitForm from "./IssueSubmitForm";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import AutocompleteCustom from "./AutocompleteCustom";
import OrgTrailsTimeline from "./OrgTrailsTimeline";
import SiteTrailsTimeline from "./SiteTrailsTimeline";
import { FormControlLabel, Radio, RadioGroup } from "@material-ui/core";

class ProductDetailCycle extends Component {
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
                    product_id: this.props.item.product._key,
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
            .get(baseUrl + "release/no-auth?p=" + this.props.item.product._key + "&o=" + orgId)
            .then((res) => {
                var response = res.data.data;

                for (var i = 0; i < response.length; i++) {
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
                var responseAll = response.data.data;

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
        this.setState({
            productQrCode:
                baseUrl +
                "product/" +
                this.props.item.product._key +
                "/code?u=" +
                frontEndUrl +
                "p",
        });
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

    componentWillMount() {
        if (this.props.item.sub_products && this.props.item.sub_products.length > 0)
            this.getSubProducts();
    }

    componentDidMount() {
        this.getQrCode();

        if (this.props.showRegister && this.props.isLoggedIn && this.props.userDetail) {
            this.getSites();
        }

        this.getProductTrails(this.props.item.product._key);
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

    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <>
                <div className="row no-gutters  justify-content-center">
                    <div className="col-md-4 col-sm-12 col-xs-12 ">
                        <div className="row stick-left-box  ">
                            <div className="col-12 text-center ">
                                {this.props.item.artifacts &&
                                this.props.item.artifacts.length > 0 ? (
                                    <ImagesSlider images={this.props.item.artifacts} />
                                ) : (
                                    <img className={"img-fluid"} src={PlaceholderImg} alt="" />
                                )}
                            </div>

                            {this.props.isLoggedIn &&
                                !this.props.hideRegister &&
                                this.props.userDetail.orgId !== this.props.item.org._id && (
                                    <>
                                        <div className={"col-12 pb-5 mb-5 d-none"}>
                                            <div className="row justify-content-start pb-3 pt-3 ">
                                                <div className="col-12 ">
                                                    <button
                                                        onClick={this.showRegister}
                                                        className={
                                                            "shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2"
                                                        }>
                                                        Register this product
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                            <div className={"col-12 pb-5 mb-5"}>
                                <div className="row justify-content-start pb-3 pt-3 ">
                                    <div className="col-12 ">
                                        <h5 className={"text-bold blue-text"}>Cycle Code</h5>
                                    </div>

                                    <div className="col-12">
                                        <p
                                            style={{ fontSize: "16px" }}
                                            className={"text-gray-light "}>
                                            Scan the QR code below to view this product
                                        </p>
                                    </div>
                                </div>

                                <div className="row justify-content-center ">
                                    <div className="col-12 border-box">
                                        <div className="d-flex flex-column justify-content-center align-items-center">
                                            <img
                                                className=""
                                                src={this.state.productQrCode}
                                                alt={this.props.item.product.name}
                                                title={this.props.item.product.name}
                                                style={{ width: "90%" }}
                                            />

                                            <div className="d-flex justify-content-center w-100">
                                                {this.props.hideRegister && (
                                                    <p className={"green-text"}>
                                                        <Link
                                                            className={"mr-3"}
                                                            to={
                                                                "/p/" + this.props.item.product._key
                                                            }>
                                                            [Product Provenance]
                                                        </Link>
                                                        <Link
                                                            onClick={() =>
                                                                this.handlePrintPdf(
                                                                    this.props.item.product,
                                                                    this.state.productQrCode,
                                                                    QrCodeBg,
                                                                    LoopcycleLogo
                                                                )
                                                            }>
                                                            [Print PDF]
                                                        </Link>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={"col-md-8 col-sm-12 col-xs-12 pl-5"}>
                        <div className="row justify-content-start pb-3  ">
                            <div className="col-12 mt-2">
                                <div className="row">
                                    <div className="col-8">
                                        <h4 className={"blue-text text-heading"}>
                                            {this.props.item.product.name}
                                        </h4>
                                    </div>

                                    <div className="col-4 text-right">
                                        {this.props.isLoggedIn && (
                                            <MoreMenu
                                                triggerCallback={(action) =>
                                                    this.callBackResult(action)
                                                }
                                                report={
                                                    this.props.userDetail.orgId ===
                                                    this.props.item.org._id
                                                        ? true
                                                        : false
                                                }
                                                register={
                                                    this.props.userDetail.orgId !==
                                                    this.props.item.org._id
                                                }
                                            />
                                        )}

                                        {!this.props.isLoggedIn && !this.state.orgIdAuth && (
                                            <MoreMenu
                                                triggerCallback={(action) =>
                                                    this.callBackResult(action)
                                                }
                                                selectCompany={true}
                                            />
                                        )}

                                        {this.state.showApproveRelease && (
                                            <MoreMenu
                                                triggerCallback={(action) =>
                                                    this.callBackResult(action)
                                                }
                                                approveRelease={true}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="row">
                                    <div className="col-7">
                                        <p>
                                            <Org orgId={this.props.item.org._id} />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={"listing-row-border "}></div>

                        <div className="row justify-content-start pb-3 pt-3 ">
                            <div className="col-auto">
                                <p style={{ fontSize: "16px" }} className={"text-gray-light  "}>
                                    {this.props.item.product.description}
                                </p>
                            </div>
                        </div>
                        <div className={"listing-row-border "}></div>

                        <div className="row justify-content-start pb-3 pt-3 ">
                            <div className="col-12 mt-2">
                                <Tabs defaultActiveKey="productinfo" id="uncontrolled-tab-example">
                                    <Tab eventKey="productinfo" title="Product Info">
                                        <div className="row  justify-content-start search-container  pb-2">
                                            <div className={"col-auto"}>
                                                <p
                                                    style={{ fontSize: "18px" }}
                                                    className="text-mute text-bold text-blue mb-1">
                                                    Category
                                                </p>
                                                <p style={{ fontSize: "18px" }} className="  mb-1">
                                                    {this.props.item.product.category},
                                                    {this.props.item.product.type},
                                                    {this.props.item.product.state}
                                                    {this.props.item.product.volume}
                                                    {this.props.item.product.units}
                                                </p>
                                            </div>
                                        </div>

                                        {/*<div className="row  justify-content-start search-container  pb-2">*/}

                                        {/*<div className={"col-auto"}>*/}

                                        {/*<p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Manufacturer</p>*/}
                                        {/*<p style={{ fontSize: "18px" }} className="text-caps  mb-1">{this.props.item.org.name} </p>*/}
                                        {/*</div>*/}
                                        {/*</div>*/}

                                        {this.props.item && this.props.item.product.year_of_making && (
                                            <div className="row  justify-content-start search-container  pb-2">
                                                <div className={"col-auto"}>
                                                    <p
                                                        style={{ fontSize: "18px" }}
                                                        className="text-mute text-bold text-blue mb-1">
                                                        Year Of Manufacturer
                                                    </p>
                                                    <p
                                                        style={{ fontSize: "18px" }}
                                                        className="  mb-1">
                                                        {this.props.item.product.year_of_making}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {this.props.item && this.props.item.product.sku.model && (
                                            <div className="row  justify-content-start search-container  pb-2">
                                                <div className={"col-auto"}>
                                                    <p
                                                        style={{ fontSize: "18px" }}
                                                        className="text-mute text-bold text-blue mb-1">
                                                        Model Number
                                                    </p>
                                                    <p
                                                        style={{ fontSize: "18px" }}
                                                        className="  mb-1">
                                                        {this.props.item &&
                                                            this.props.item.product.sku.model}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {this.props.item && this.props.item.product.sku.serial && (
                                            <div className="row  justify-content-start search-container  pb-2">
                                                <div className={"col-auto"}>
                                                    <p
                                                        style={{ fontSize: "18px" }}
                                                        className="text-mute text-bold text-blue mb-1">
                                                        Serial Number
                                                    </p>
                                                    <p
                                                        style={{ fontSize: "18px" }}
                                                        className="  mb-1">
                                                        {this.props.item &&
                                                            this.props.item.product.sku.serial}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {this.props.item && this.props.item.product.sku.brand && (
                                            <div className="row  justify-content-start search-container  pb-2 ">
                                                <div className={"col-auto"}>
                                                    <p
                                                        style={{ fontSize: "18px" }}
                                                        className="text-mute text-bold text-blue mb-1">
                                                        Brand
                                                    </p>
                                                    <p
                                                        style={{ fontSize: "18px" }}
                                                        className="  mb-1">
                                                        {this.props.item &&
                                                            this.props.item.product.sku.brand}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="row  justify-content-start search-container  pb-2 ">
                                            <div className={"col-auto"}>
                                                <p
                                                    style={{ fontSize: "18px" }}
                                                    className="text-mute text-bold text-blue mb-1">
                                                    State
                                                </p>
                                                <p style={{ fontSize: "18px" }} className="  mb-1">
                                                    {this.props.item.product.state}
                                                </p>
                                            </div>
                                        </div>

                                        {this.props.item.site && (
                                            <div className="row justify-content-start search-container pb-2">
                                                <div className={"col-auto"}>
                                                    <p
                                                        style={{ fontSize: "18px" }}
                                                        className="text-mute text-bold text-blue mb-1">
                                                        Located At
                                                    </p>
                                                    <p
                                                        style={{ fontSize: "18px" }}
                                                        className="  mb-1">
                                                        {this.props.item.site.name},
                                                        {this.props.item.site.address}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="row  justify-content-start search-container  pb-2 ">
                                            <div className={"col-auto"}>
                                                <p
                                                    style={{ fontSize: "18px" }}
                                                    className="text-mute text-bold text-blue mb-1">
                                                    Service Agent
                                                </p>
                                                <p style={{ fontSize: "18px" }} className="  mb-1">
                                                    <Org
                                                        orgId={this.props.item.service_agent._id}
                                                    />
                                                </p>
                                            </div>
                                        </div>
                                    </Tab>

                                    {this.state.subProducts.length > 0 && (
                                        <Tab eventKey="subproducts" title="Sub Products">
                                            {this.state.subProducts.map((item) => (
                                                <ProductItemNew
                                                    hideMore={true}
                                                    key={Math.random() * 100}
                                                    item={item}
                                                />
                                            ))}
                                        </Tab>
                                    )}

                                    {this.state.searches.length > 0 && (
                                        <Tab eventKey="search" title="Searches">
                                            {this.state.searches.map((item) => (
                                                <SearchItem key={Math.random() * 100} item={item} />
                                            ))}
                                        </Tab>
                                    )}

                                    {this.state.listingLinked && (
                                        <Tab eventKey="listing" title="Listing">
                                            {this.state.listingLinked && (
                                                <ResourceItem item={this.state.listingLinked} />
                                            )}
                                        </Tab>
                                    )}
                                </Tabs>
                            </div>
                        </div>

                        <div className="row justify-content-start pb-3 pt-3 ">
                            <div className="col-12">
                                <h5 className={"text-bold blue-text"}>Product Provenance </h5>
                            </div>

                            <div className="col-12">
                                <p style={{ fontSize: "16px" }} className={"text-gray-light "}>
                                    See where this product has travelled since the day it was
                                    created.
                                </p>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <FormControl component="fieldset">
                                    <RadioGroup
                                        row
                                        name="timeline-options"
                                        value={this.state.timelineDisplay}
                                        onChange={(e) => this.handleTimelineOptions(e)}>
                                        <FormControlLabel
                                            control={<Radio />}
                                            label="Organisations"
                                            value="org"
                                        />
                                        <FormControlLabel
                                            control={<Radio />}
                                            label="Locations"
                                            value="site"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </div>

                        {this.state.timelineDisplay === "org" ? (
                            <div className="row">
                                <div className="col">
                                    {this.state.orgTrails && (
                                        <OrgTrailsTimeline orgTrails={this.state.orgTrails} />
                                    )}
                                </div>
                            </div>
                        ) : null}

                        {this.state.timelineDisplay === "site" ? (
                            <div className="row">
                                <div className="col">
                                    {this.state.siteTrails && (
                                        <SiteTrailsTimeline siteTrails={this.state.siteTrails} />
                                    )}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>

                <Modal
                    id="reportModal"
                    show={this.state.isVisibleReportModal}
                    onHide={this.hideReportModal}
                    animation={false}>
                    <Modal.Title>
                        <div className="row">
                            <div className="col">
                                <button
                                    className="btn float-right mr-3 mt-2 mb-2"
                                    onClick={this.hideReportModal}>
                                    X
                                </button>
                                <div className="text-center mt-2 mb-2">Report Issue</div>
                            </div>
                        </div>
                    </Modal.Title>
                    <Modal.Body>
                        {this.props.item.product._key && (
                            <div>
                                <div className="mt-2 mb-2">
                                    Product:
                                    <span>
                                        <b>{this.props.item.product.name}</b>
                                    </span>
                                </div>
                                <IssueSubmitForm productId={this.props.item.product._key} />
                            </div>
                        )}
                    </Modal.Body>
                </Modal>

                <Modal
                    className={"loop-popup"}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.state.showRegister}
                    onHide={this.showRegister}
                    animation={false}>
                    <ModalBody>
                        <div className={"row justify-content-center"}>
                            <div className={"col-10 text-center"}>
                                <p
                                    style={{ textTransform: "Capitalize" }}
                                    className={"text-bold text-blue"}>
                                    Register Product: {this.props.item.product.name}
                                </p>
                            </div>
                        </div>

                        {!this.state.showRegisterSuccess ? (
                            <form onSubmit={this.submitRegisterProduct}>
                                <div className={"row justify-content-center p-2"}>
                                    <div className={"col-12 text-center mt-2"}>
                                        <div className={"row justify-content-center"}>
                                            <div className="col-md-12 col-sm-12 col-xs-12 ">
                                                <div
                                                    className={
                                                        "custom-label text-bold  mb-1 text-left"
                                                    }>
                                                    Select Site To Register Product
                                                </div>

                                                <FormControl
                                                    variant="outlined"
                                                    className={classes.formControl}>
                                                    <Select
                                                        name={"deliver"}
                                                        native
                                                        // onChange={this.handleChangeProduct.bind(this, "deliver")}
                                                        inputProps={{
                                                            name: "site",
                                                            id: "outlined-age-native-simple",
                                                        }}>
                                                        <option value={null}>Select</option>

                                                        {this.state.sites.map((item) => (
                                                            <option
                                                                key={Math.random() * 100}
                                                                value={item._key}>
                                                                {item.name +
                                                                    "(" +
                                                                    item.address +
                                                                    ")"}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </FormControl>

                                                <p
                                                    className={"text-left"}
                                                    style={{ margin: "10px 0" }}>
                                                    Don’t see it on here?
                                                    <span
                                                        onClick={this.showSubmitSite}
                                                        className={
                                                            "green-text forgot-password-link text-mute small"
                                                        }>
                                                        Add a site
                                                    </span>
                                                </p>
                                            </div>

                                            {this.state.errorRegister && (
                                                <div className={"row justify-content-center"}>
                                                    <div
                                                        className={"col-12"}
                                                        style={{ textAlign: "center" }}>
                                                        <Alert key={"alert"} variant={"danger"}>
                                                            {this.state.errorRegister}
                                                        </Alert>
                                                    </div>
                                                </div>
                                            )}

                                            {!this.state.showSubmitSite && (
                                                <div className={"col-12 justify-content-center "}>
                                                    <div className={"row justify-content-center"}>
                                                        <div
                                                            className={"col-6"}
                                                            style={{ textAlign: "center" }}>
                                                            <button
                                                                style={{ minWidth: "120px" }}
                                                                className={
                                                                    "shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"
                                                                }
                                                                type={"submit"}>
                                                                Yes
                                                            </button>
                                                        </div>
                                                        <div
                                                            className={"col-6"}
                                                            style={{ textAlign: "center" }}>
                                                            <p
                                                                onClick={this.showRegister}
                                                                className={
                                                                    "shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue"
                                                                }>
                                                                Cancel
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className={"row justify-content-center"}>
                                <div className={"col-10 text-center"}>
                                    <Alert key={"alert"} variant={"success"}>
                                        Your register request has been submitted successfully.
                                        Thanks
                                    </Alert>
                                </div>
                            </div>
                        )}

                        {this.state.showSubmitSite && (
                            <div className={"row justify-content-center p-2"}>
                                <div className="col-md-12 col-sm-12 col-xs-12 ">
                                    <div className={"custom-label text-bold text-blue mb-1"}>
                                        Add New Site
                                    </div>
                                </div>
                                <div className="col-md-12 col-sm-12 col-xs-12 ">
                                    <div className={"row"}>
                                        <div className={"col-12"}>
                                            <form onSubmit={this.handleSubmitSite}>
                                                <div className="row no-gutters justify-content-center ">
                                                    <div className="col-12 mt-4">
                                                        <TextField
                                                            id="outlined-basic"
                                                            label=" Name"
                                                            variant="outlined"
                                                            fullWidth={true}
                                                            name={"name"}
                                                            onChange={this.handleChangeSite.bind(
                                                                this,
                                                                "name"
                                                            )}
                                                        />

                                                        {this.state.errorsSite["name"] && (
                                                            <span className={"text-mute small"}>
                                                                <span style={{ color: "red" }}>
                                                                    *
                                                                </span>
                                                                {this.state.errorsSite["name"]}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="col-12 mt-4">
                                                        <TextField
                                                            id="outlined-basic"
                                                            label="Contact"
                                                            variant="outlined"
                                                            fullWidth={true}
                                                            name={"contact"}
                                                            onChange={this.handleChangeSite.bind(
                                                                this,
                                                                "contact"
                                                            )}
                                                        />

                                                        {this.state.errorsSite["contact"] && (
                                                            <span className={"text-mute small"}>
                                                                <span style={{ color: "red" }}>
                                                                    *
                                                                </span>
                                                                {this.state.errorsSite["contact"]}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="col-12 mt-4">
                                                        <TextField
                                                            id="outlined-basic"
                                                            label="Address"
                                                            variant="outlined"
                                                            fullWidth={true}
                                                            name={"address"}
                                                            type={"text"}
                                                            onChange={this.handleChangeSite.bind(
                                                                this,
                                                                "address"
                                                            )}
                                                        />

                                                        {this.state.errorsSite["address"] && (
                                                            <span className={"text-mute small"}>
                                                                <span style={{ color: "red" }}>
                                                                    *
                                                                </span>
                                                                {this.state.errorsSite["address"]}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="col-12 mt-4">
                                                        <TextField
                                                            id="outlined-basic"
                                                            type={"number"}
                                                            name={"phone"}
                                                            onChange={this.handleChangeSite.bind(
                                                                this,
                                                                "phone"
                                                            )}
                                                            label="Phone"
                                                            variant="outlined"
                                                            fullWidth={true}
                                                        />

                                                        {this.state.errorsSite["phone"] && (
                                                            <span className={"text-mute small"}>
                                                                <span style={{ color: "red" }}>
                                                                    *
                                                                </span>
                                                                {this.state.errorsSite["phone"]}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="col-12 mt-4">
                                                        <TextField
                                                            id="outlined-basic"
                                                            label="Email"
                                                            variant="outlined"
                                                            fullWidth={true}
                                                            name={"email"}
                                                            type={"email"}
                                                            onChange={this.handleChangeSite.bind(
                                                                this,
                                                                "email"
                                                            )}
                                                        />

                                                        {this.state.errorsSite["email"] && (
                                                            <span className={"text-mute small"}>
                                                                <span style={{ color: "red" }}>
                                                                    *
                                                                </span>
                                                                {this.state.errorsSite["email"]}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="col-12 mt-4">
                                                        <TextField
                                                            onChange={this.handleChangeSite.bind(
                                                                this,
                                                                "others"
                                                            )}
                                                            name={"others"}
                                                            id="outlined-basic"
                                                            label="Others"
                                                            variant="outlined"
                                                            fullWidth={true}
                                                            type={"others"}
                                                        />

                                                        {/*{this.state.errorsSite["others"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errorsSite["others"]}</span>}*/}
                                                    </div>

                                                    <div className="col-12 mt-4">
                                                        <button
                                                            type={"submit"}
                                                            className={
                                                                "btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"
                                                            }>
                                                            Add Site
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </ModalBody>
                </Modal>

                <Modal
                    className={"loop-popup"}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.state.showDeletePopUp}
                    onHide={this.showDeletePopUp}
                    animation={false}>
                    <ModalBody>
                        <div className={"row justify-content-center"}>
                            <div className={"col-10 text-center"}>
                                <p className={"text-bold"}>Delete Product</p>
                                <p>Are you sure you want to delete ?</p>
                            </div>
                        </div>

                        <div className={"row justify-content-center"}>
                            <div className={"col-12 text-center mt-2"}>
                                <div className={"row justify-content-center"}>
                                    <div className={"col-6"} style={{ textAlign: "center" }}>
                                        <button
                                            onClick={this.deleteItem}
                                            className={
                                                "shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"
                                            }
                                            type={"submit"}>
                                            Submit
                                        </button>
                                    </div>
                                    <div className={"col-6"} style={{ textAlign: "center" }}>
                                        <p
                                            onClick={this.showDeletePopUp}
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

                <Modal
                    className={"loop-popup"}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.state.showOrgInput}
                    onHide={this.showOrgInput}
                    animation={false}>
                    <ModalBody>
                        <div className={"row justify-content-center"}>
                            <div className={"col-10 text-center"}>
                                <p
                                    style={{ textTransform: "Capitalize" }}
                                    className={"text-bold text-blue"}>
                                    Choose Your Organisation
                                </p>
                            </div>
                        </div>

                        {!this.state.showRegisterSuccess ? (
                            <>
                                <AutocompleteCustom
                                    orgs={true}
                                    suggestions={this.state.orgNames}
                                    selectedCompany={(action) => this.companyDetails(action)}
                                />

                                <form onSubmit={this.submitOrgId}>
                                    <div className={"row justify-content-center p-2"}>
                                        <div className={"col-12 text-center mt-2"}>
                                            <div className={"row justify-content-center"}>
                                                <div className="col-md-12 col-sm-12 col-xs-12 d-none">
                                                    <div
                                                        className={
                                                            "custom-label text-bold  mb-1 text-left"
                                                        }>
                                                        Organisation Id
                                                    </div>

                                                    <TextField
                                                        required={true}
                                                        value={this.state.orgIdAuth}
                                                        name={"orgId"}
                                                        placeholder={"xxxxx"}
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        fullWidth={true}
                                                    />
                                                </div>

                                                {this.state.errorRelease && (
                                                    <div
                                                        className={
                                                            "col-12 mt-3 justify-content-center"
                                                        }
                                                        style={{ textAlign: "center" }}>
                                                        <Alert key={"alert"} variant={"danger"}>
                                                            {this.state.errorRelease}
                                                        </Alert>
                                                    </div>
                                                )}

                                                {!this.state.showSubmitSite && (
                                                    <div
                                                        className={
                                                            "col-12 justify-content-center "
                                                        }>
                                                        <div
                                                            className={
                                                                "row justify-content-center"
                                                            }>
                                                            <div
                                                                className={"col-6"}
                                                                style={{ textAlign: "center" }}>
                                                                <button
                                                                    style={{ minWidth: "120px" }}
                                                                    className={
                                                                        "shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"
                                                                    }
                                                                    type={"submit"}>
                                                                    Yes
                                                                </button>
                                                            </div>
                                                            <div
                                                                className={"col-6"}
                                                                style={{ textAlign: "center" }}>
                                                                <p
                                                                    onClick={this.showOrgInput}
                                                                    className={
                                                                        "shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue"
                                                                    }>
                                                                    Cancel
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className={"row justify-content-center"}>
                                <div className={"col-10 text-center"}>
                                    <Alert key={"alert"} variant={"success"}>
                                        Your register request has been submitted successfully.
                                        Thanks
                                    </Alert>
                                </div>
                            </div>
                        )}
                    </ModalBody>
                </Modal>

                <Modal
                    className={"loop-popup"}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.state.showApproveReleasePopUp}
                    onHide={this.showApproveReleasePopUp}
                    animation={false}>
                    <ModalBody>
                        {!this.state.approveReleasePopUpSuccess ? (
                            <>
                                <div className={"row justify-content-center"}>
                                    <div className={"col-10 text-center"}>
                                        <p className={"text-bold"}>Approve Release Request</p>
                                        <p>Are you sure you want to approve release request ?</p>
                                    </div>
                                </div>

                                <div className={"row justify-content-center"}>
                                    <div className={"col-12 text-center mt-2"}>
                                        <div className={"row justify-content-center"}>
                                            <div
                                                className={"col-6"}
                                                style={{ textAlign: "center" }}>
                                                <button
                                                    onClick={this.submitApproveRelease}
                                                    className={
                                                        "shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"
                                                    }
                                                    type={"submit"}>
                                                    Yes
                                                </button>
                                            </div>
                                            <div
                                                className={"col-6"}
                                                style={{ textAlign: "center" }}>
                                                <p
                                                    onClick={this.showApproveReleasePopUp}
                                                    className={
                                                        "shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue"
                                                    }>
                                                    No
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={"row justify-content-center"}>
                                    <div className={"col-10 text-center"}>
                                        <Alert key={"alert"} variant={"success"}>
                                            Your product release request has been completed
                                            successfully. Thanks
                                        </Alert>
                                    </div>
                                </div>
                            </>
                        )}
                    </ModalBody>
                </Modal>
            </>
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

function BottomAppBar(props) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <CssBaseline />

            <AppBar position="fixed" color="#ffffff" className={classes.appBar}>
                <Toolbar>
                    <div
                        className="row  justify-content-center search-container "
                        style={{ margin: "auto" }}>
                        <div className="col-auto">
                            <Link
                                to={"/message-seller/" + props.slug}
                                type="button"
                                className=" mr-2 btn btn-link green-border-btn mt-2 mb-2 btn-blue">
                                Message Seller
                            </Link>
                        </div>
                        <div className="col-auto">
                            <Link
                                to={"/make-offer/" + props.slug}
                                type="button"
                                className="shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue">
                                Make Offer
                            </Link>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
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
export default connect(mapStateToProps, mapDispachToProps)(ProductDetailCycle);
