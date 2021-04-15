import React, { Component } from "react";
import { connect } from "react-redux";
import SendIcon from "../../img/send-icon.png";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import InputLabel from "@material-ui/core/InputLabel";
import Close from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import PaperImg from "../../img/paper-big.png";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import TextField from "@material-ui/core/TextField";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import clsx from "clsx";
import InputAdornment from "@material-ui/core/InputAdornment";
import { withStyles } from "@material-ui/core/styles/index";
import CalGrey from "../../img/icons/calender-dgray.png";
import MarkerGrey from "../../img/icons/marker-dgray.png";
import LinkGray from "../../img/icons/link-icon.png";
import MarkerIcon from "../../img/icons/marker.png";
import CalenderIcon from "../../img/icons/calender.png";
import ListIcon from "../../img/icons/list.png";
import AmountIcon from "../../img/icons/amount.png";
import StateIcon from "../../img/icons/state.png";
import CameraGray from "../../img/icons/camera-gray.png";
import PlusGray from "../../img/icons/plus-icon.png";
import NavigateBefore from "@material-ui/icons/NavigateBefore";

const useStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            margin: theme.spacing(1),
            width: "25ch",
        },
    },
}));

const useStylesTabs = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

class ListingForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            active: 0,

            free: false,
        };
        this.selectCreateSearch = this.selectCreateSearch.bind(this);
        this.selectCategory = this.selectCategory.bind(this);
        this.selectType = this.selectType.bind(this);
        this.selectState = this.selectState.bind(this);
        this.addDetails = this.addDetails.bind(this);
        this.nextClick = this.nextClick.bind(this);
        this.linkProduct = this.linkProduct.bind(this);
        this.searchLocation = this.searchLocation.bind(this);
        this.previewSearch = this.previewSearch.bind(this);
        this.toggleFree = this.toggleFree.bind(this);
        this.toggleSale = this.toggleSale.bind(this);

        // this.resetPasswordSuccessLogin=this.resetPasswordSuccessLogin.bind(this)
    }

    selectCreateSearch() {
        this.setState({
            active: 0,
        });
    }

    selectCategory() {
        this.setState({
            active: 1,
        });
    }

    selectType() {
        this.setState({
            active: 2,
        });
    }

    selectState() {
        this.setState({
            active: 3,
        });
    }

    addDetails() {
        this.setState({
            active: 4,
        });
    }

    toggleSale() {
        this.setState({
            free: false,
        });
    }

    toggleFree() {
        this.setState({
            free: true,
        });
    }

    nextClick() {
        if (this.state.active < 4) {
            this.setState({
                active: 4,
            });
        } else if (this.state.active === 4) {
            this.setState({
                active: 5,
            });
        } else if (this.state.active === 5) {
            this.setState({
                active: 7,
            });
        } else if (this.state.active === 7) {
            this.setState({
                active: 8,
            });
        }
    }

    linkProduct() {
        this.setState({
            active: 5,
        });
    }

    searchLocation() {
        this.setState({
            active: 6,
        });
    }

    previewSearch() {
        this.setState({
            active: 7,
        });
    }

    handleSongLoading() {}

    handleSongFinishedPlaying() {}

    handleSongPlaying() {}

    interval;



    goToSignIn() {
        this.setState({
            active: 0,
        });
    }

    goToSignUp() {
        this.setState({
            active: 1,
        });
    }

    classes = useStylesSelect;

    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <>
                <div className={this.state.active === 7 ? "container " : "container  p-2"}></div>

                {this.state.active === 0 && (
                    <>
                        <div className="container  pt-2 pb-3">
                            <div className="row no-gutters">
                                <div className="col-10">
                                    <h6>Create a Listing </h6>
                                </div>

                                <div className="col-auto">
                                    <Link to={"/"}>
                                        <Close className="blue-text" style={{ fontSize: 32 }} />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="container   pb-5 pt-5">
                            <div className="row no-gutters">
                                <div className="col-auto">
                                    <h3 className={"blue-text text-heading"}>The Basics</h3>
                                </div>
                            </div>
                            <div className="row no-gutters justify-content-center mt-5">
                                <div className="col-12">
                                    <TextField
                                        id="outlined-basic"
                                        label="Listing Title"
                                        variant="outlined"
                                        fullWidth={true}
                                    />
                                </div>

                                <div className="col-12 mt-4">
                                    <TextField
                                        id="outlined-basic"
                                        label="Description"
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        fullWidth={true}
                                    />
                                </div>
                                <div className="col-12 mt-4" onClick={this.selectCategory}>
                                    <div
                                        onClick={this.selectCategory}
                                        className={"dummy-text-field"}>
                                        Resource Category
                                    </div>
                                </div>
                            </div>
                            <div className="row no-gutters justify-content-center mt-4">
                                <div className="col-6 pr-2">
                                    {/*<TextField id="outlined-basic" label="Units" variant="outlined" fullWidth={true} />*/}
                                    <UnitSelect />
                                </div>
                                <div className="col-6 pl-2">
                                    <TextField
                                        id="outlined-basic"
                                        label="Volume"
                                        variant="outlined"
                                        fullWidth={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {this.state.active === 1 && (
                    <>
                        <div className="container  pt-2 pb-3">
                            <div className="row no-gutters">
                                <div className="col-10">
                                    <h6>Select a category </h6>
                                </div>

                                <div className="col-auto">
                                    <Close
                                        onClick={this.selectCreateSearch}
                                        className="blue-text"
                                        style={{ fontSize: 32 }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="container   pb-3 pt-3">
                            <div
                                className="row mr-2 ml-2 selection-row selected-row p-3 mb-3  "
                                onClick={this.selectType}>
                                <div className="col-2">
                                    <img className={"icon-left-select"} src={SendIcon} alt="" />
                                </div>
                                <div className="col-8">
                                    <p className={"blue-text "} style={{ fontSize: "16px" }}>
                                        Paper and Card
                                    </p>
                                    <p className={"text-mute small"} style={{ fontSize: "16px" }}>
                                        4 Types
                                    </p>
                                </div>
                                <div className="col-2">
                                    <NavigateNextIcon />
                                </div>
                            </div>

                            <div
                                className="row mr-2 ml-2 selection-row unselected-row p-3  mb-3 "
                                onClick={this.selectType}>
                                <div className="col-2">
                                    <img className={"icon-left-select"} src={SendIcon} alt="" />
                                </div>
                                <div className="col-8">
                                    <p className={"blue-text "} style={{ fontSize: "16px" }}>
                                        Paper and Card
                                    </p>
                                    <p className={"text-mute small"} style={{ fontSize: "16px" }}>
                                        4 Types
                                    </p>
                                </div>
                                <div className="col-2">
                                    <NavigateNextIcon />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {this.state.active === 2 && (
                    <>
                        <div className="container  pt-2 pb-3">
                            <div className="row no-gutters">
                                <div className="col-10">
                                    <h6>Select a type </h6>
                                </div>

                                <div className="col-auto">
                                    <Close
                                        onClick={this.selectCreateSearch}
                                        className="blue-text"
                                        style={{ fontSize: 32 }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="container   pb-3 pt-3">
                            <div
                                className="row mr-2 ml-2 selection-row selected-row p-3 mb-3  "
                                onClick={this.selectCreateSearch}>
                                <div className="col-10">
                                    <p className={" "} style={{ fontSize: "16px" }}>
                                        Disposable Food Boxes
                                    </p>
                                </div>
                                <div className="col-2">
                                    <NavigateNextIcon />
                                </div>
                            </div>

                            <div
                                className="row mr-2 ml-2 selection-row unselected-row p-3 mb-3  "
                                onClick={this.selectCreateSearch}>
                                <div className="col-10">
                                    <p className={" "} style={{ fontSize: "16px" }}>
                                        Disposable Food Boxes
                                    </p>
                                </div>
                                <div className="col-2">
                                    <NavigateNextIcon />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {this.state.active === 3 && (
                    <>
                        <div className="container  pt-2 pb-3">
                            <div className="row no-gutters">
                                <div className="col-10">
                                    <h6>Select a State </h6>
                                </div>

                                <div className="col-auto">
                                    <Close
                                        onClick={this.selectCreateSearch}
                                        className="blue-text"
                                        style={{ fontSize: 32 }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="container   pb-3 pt-3">
                            <div
                                className="row mr-2 ml-2 selection-row unselected-row p-3 mb-3  "
                                onClick={this.selectState}>
                                <div className="col-10">
                                    <p className={" "} style={{ fontSize: "16px" }}>
                                        Bailed
                                    </p>
                                </div>
                                <div className="col-2">
                                    <NavigateNextIcon />
                                </div>
                            </div>

                            <div
                                className="row mr-2 ml-2 selection-row selected-row p-3 mb-3  "
                                onClick={this.selectState}>
                                <div className="col-10">
                                    <p className={" "} style={{ fontSize: "16px" }}>
                                        Disposable Food Boxes
                                    </p>
                                </div>
                                <div className="col-2">
                                    <NavigateNextIcon />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {this.state.active === 4 && (
                    <>
                        <div className="container  pt-2 pb-3">
                            <div className="row no-gutters">
                                <div className="col-10">
                                    <h6>Add photos </h6>
                                </div>

                                <div className="col-auto">
                                    <Close className="blue-text" style={{ fontSize: 32 }} />
                                </div>
                            </div>
                        </div>

                        <div className="container  search-container pt-5">
                            <div className="row no-gutters">
                                <div className="col-auto">
                                    <h3 className={"blue-text text-heading "}>Add photos</h3>
                                </div>
                            </div>
                        </div>

                        <div className="container  pb-3 ">
                            <div className="row container-gray border-rounded  no-gutters justify-content-center ml-2 mr-2 mt-5">
                                <div className="col-12 text-center">
                                    <img src={CameraGray} className={"camera-icon"} alt="" />
                                </div>

                                <div className="col-12 text-center">
                                    <button
                                        type="button"
                                        className="shadow-sm mr-2 btn btn-link gray-btn-border m-2 ">
                                        Take Photo
                                    </button>
                                </div>

                                <div className="col-12 text-center  mb-5">
                                    <button
                                        type="button"
                                        className="shadow-sm mr-2 btn btn-link gray-btn-border m-2 ">
                                        Browse Files
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="container  pb-5 ">
                            <div className="row camera-grids   no-gutters justify-content-center  ">
                                <div className="col-4 p-1 text-center ">
                                    <div className="card shadow border-0 mb-3 container-gray border-rounded">
                                        <div className={"card-body"}>
                                            <img
                                                src={CameraGray}
                                                className={"camera-icon-preview"}
                                                alt=""
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-4 p-1 text-center ">
                                    <div className="card shadow border-0 mb-3 container-gray border-rounded">
                                        <div className={"card-body"}>
                                            <img
                                                src={CameraGray}
                                                className={"camera-icon-preview"}
                                                alt=""
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-4  p-1 text-center ">
                                    <div className="card shadow border-0 mb-3 container-gray border-rounded ">
                                        <div className={"card-body"}>
                                            <img
                                                style={{ padding: "10px" }}
                                                src={PlusGray}
                                                className={"camera-icon-preview"}
                                                alt=""
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {this.state.active === 5 && (
                    <>
                        <div className="container  pt-2 pb-3">
                            <div className="row no-gutters">
                                <div className="col-10">
                                    <h6>Add Details </h6>
                                </div>

                                <div className="col-auto">
                                    <Close className="blue-text" style={{ fontSize: 32 }} />
                                </div>
                            </div>
                        </div>

                        <div className="container  search-container pb-5 pt-5 mb-5">
                            <div className="row no-gutters">
                                <div className="col-auto">
                                    <h3 className={"blue-text text-heading"}>The Basics</h3>
                                </div>
                            </div>
                            <div className="row no-gutters justify-content-center mt-5">
                                <div className="col-12 mb-3">
                                    <div onClick={this.linkProduct} className={"dummy-text-field"}>
                                        Link new a product
                                        <img
                                            className={"input-field-icon"}
                                            src={LinkGray}
                                            style={{ fontSize: 24, color: "#B2B2B2" }}
                                            alt=""
                                        />
                                    </div>
                                </div>
                                <div className="col-12 mb-3">
                                    <TextField
                                        label={"Deliver to "}
                                        variant="outlined"
                                        className={
                                            clsx(classes.margin, classes.textField) +
                                            " full-width-field"
                                        }
                                        id="input-with-icon-textfield"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <img
                                                        className={"input-field-icon"}
                                                        src={MarkerGrey}
                                                        style={{ fontSize: 24, color: "#B2B2B2" }}
                                                        alt=""
                                                    />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </div>
                                <div className="col-12 mb-3">
                                    <TextField
                                        id="input-with-icon-textfield"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        label="Start Date"
                                        type={"date"}
                                        variant="outlined"
                                        className={
                                            clsx(classes.margin, classes.textField) +
                                            " full-width-field"
                                        }
                                        id="input-with-icon-textfield"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <img
                                                        className={"input-field-icon"}
                                                        src={CalGrey}
                                                        style={{ fontSize: 24, color: "#B2B2B2" }}
                                                        alt=""
                                                    />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </div>
                                <div className="col-12 mb-3">
                                    <TextField
                                        id="input-with-icon-textfield"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        label="End Date"
                                        type={"date"}
                                        variant="outlined"
                                        className={
                                            clsx(classes.margin, classes.textField) +
                                            " full-width-field"
                                        }
                                        id="input-with-icon-textfield"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <img
                                                        className={"input-field-icon"}
                                                        src={CalGrey}
                                                        style={{ fontSize: 24, color: "#B2B2B2" }}
                                                        alt=""
                                                    />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </div>

                                <div className="col-12 mb-3">
                                    <p>Price</p>

                                    <div
                                        onClick={this.toggleSale}
                                        className={
                                            !this.state.free
                                                ? "btn-select-free green-bg"
                                                : "btn-select-free"
                                        }>
                                        For Sale
                                    </div>

                                    <div
                                        onClick={this.toggleFree}
                                        className={
                                            this.state.free
                                                ? "btn-select-free green-bg"
                                                : "btn-select-free"
                                        }>
                                        Free
                                    </div>
                                </div>

                                {!this.state.free && (
                                    <div className="col-12 mb-5">
                                        <TextField
                                            id="input-with-icon-textfield"
                                            label="Enter Value"
                                            variant="outlined"
                                            className={
                                                clsx(classes.margin, classes.textField) +
                                                " full-width-field"
                                            }
                                            id="input-with-icon-textfield"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {this.state.active === 6 && (
                    <>
                        <div className="container  pt-2 pb-3">
                            <div className="row no-gutters">
                                <div className="col-10">
                                    <h6>Link a Product </h6>
                                </div>

                                <div className="col-auto">
                                    <Close
                                        onClick={this.selectCreateSearch}
                                        className="blue-text"
                                        style={{ fontSize: 32 }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="container   pb-3 pt-3">
                            <div
                                className="row mr-2 ml-2 selection-row selected-row p-3 mb-3  "
                                onClick={this.selectType}>
                                <div className="col-2">
                                    <img className={"icon-left-select"} src={SendIcon} alt="" />
                                </div>
                                <div className="col-8">
                                    <p className={"blue-text "} style={{ fontSize: "16px" }}>
                                        Aggregate 02
                                    </p>
                                    <p className={"text-mute small"} style={{ fontSize: "16px" }}>
                                        2 Searches
                                    </p>
                                </div>
                                <div className="col-2">
                                    <NavigateNextIcon />
                                </div>
                            </div>

                            <div
                                className="row mr-2 ml-2 selection-row unselected-row p-3  mb-3 "
                                onClick={this.selectType}>
                                <div className="col-2">
                                    <img className={"icon-left-select"} src={SendIcon} alt="" />
                                </div>
                                <div className="col-8">
                                    <p className={"blue-text "} style={{ fontSize: "16px" }}>
                                        Prototype 01
                                    </p>
                                    <p className={"text-mute small"} style={{ fontSize: "16px" }}>
                                        5 Searches
                                    </p>
                                </div>
                                <div className="col-2">
                                    <NavigateNextIcon />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {this.state.active === 7 && (
                    <>
                        <div className="container-fluid " style={{ padding: "0" }}>
                            <div className="row no-gutters  justify-content-center">
                                <div className="floating-back-icon" style={{ margin: "auto" }}>
                                    <NavigateBefore style={{ fontSize: 32, color: "white" }} />
                                </div>

                                <div className="col-auto ">
                                    <img className={"img-fluid"} src={PaperImg} alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="container ">
                            <div className="row justify-content-start pb-3 pt-4 listing-row-border">
                                <div className="col-12">
                                    <p className={"green-text text-heading"}>@Tesco</p>
                                </div>
                                <div className="col-12 mt-2">
                                    <h5 className={"blue-text text-heading"}>Food boxes needed</h5>
                                </div>
                            </div>

                            <div className="row justify-content-start pb-3 pt-3 listing-row-border">
                                <div className="col-auto">
                                    <p style={{ fontSize: "16px" }} className={"text-gray-light "}>
                                        Looking for disposable food boxes. Any sizes are suitable.
                                        Please message me if you have any available.
                                    </p>
                                </div>
                            </div>

                            <div className="row justify-content-start pb-4 pt-3 ">
                                <div className="col-auto">
                                    <h6 className={""}>Item Details</h6>
                                </div>
                            </div>
                        </div>
                        <div className={"container"}>
                            <div className="row  justify-content-start search-container  pb-4">
                                <div className={"col-1"}>
                                    <img className={"icon-about"} src={ListIcon} alt="" />
                                </div>
                                <div className={"col-auto"}>
                                    <p
                                        style={{ fontSize: "18px" }}
                                        className="text-mute text-gray-light mb-1">
                                        Surrey, UK
                                    </p>
                                    <p style={{ fontSize: "18px" }} className="  mb-1">
                                        Paper and Card >
                                    </p>
                                    <p style={{ fontSize: "18px" }} className="  mb-1">
                                        Disposable Food Boxes
                                    </p>
                                </div>
                            </div>
                            <div className="row  justify-content-start search-container  pb-4">
                                <div className={"col-1"}>
                                    <img className={"icon-about"} src={AmountIcon} alt="" />
                                </div>
                                <div className={"col-auto"}>
                                    <p
                                        style={{ fontSize: "18px" }}
                                        className="text-mute text-gray-light mb-1">
                                        Amount
                                    </p>
                                    <p style={{ fontSize: "18px" }} className="  mb-1">
                                        10 Kgs
                                    </p>
                                </div>
                            </div>

                            <div className="row  justify-content-start search-container  pb-4">
                                <div className={"col-1"}>
                                    <img className={"icon-about"} src={StateIcon} alt="" />
                                </div>
                                <div className={"col-auto"}>
                                    <p
                                        style={{ fontSize: "18px" }}
                                        className="text-mute text-gray-light mb-1">
                                        State
                                    </p>
                                    <p style={{ fontSize: "18px" }} className="  mb-1">
                                        Bailed
                                    </p>
                                </div>
                            </div>

                            <div className="row  justify-content-start search-container  pb-4">
                                <div className={"col-1"}>
                                    <img className={"icon-about"} src={CalenderIcon} alt="" />
                                </div>
                                <div className={"col-auto"}>
                                    <p
                                        style={{ fontSize: "18px" }}
                                        className="text-mute text-gray-light mb-1">
                                        Required by{" "}
                                    </p>
                                    <p style={{ fontSize: "18px" }} className="  mb-1">
                                        June 1, 2020{" "}
                                    </p>
                                </div>
                            </div>
                            <div className="row  justify-content-start search-container  pb-4">
                                <div className={"col-1"}>
                                    <img className={"icon-about"} src={MarkerIcon} alt="" />
                                </div>
                                <div className={"col-auto"}>
                                    <p
                                        style={{ fontSize: "18px" }}
                                        className="text-mute text-gray-light mb-1">
                                        Location{" "}
                                    </p>
                                    <p style={{ fontSize: "18px" }} className="  mb-1">
                                        Mapledown, Which Hill Lane,
                                    </p>
                                    <p style={{ fontSize: "18px" }} className="  mb-1">
                                        Woking, Surrey, GU22 0AH
                                    </p>
                                </div>
                            </div>

                            <BottomAppBar />
                        </div>
                    </>
                )}

                {this.state.active === 8 && (
                    <>
                        <div className="container  listing-row-border">
                            <div className="row no-gutters">
                                <div className="col-auto" style={{ margin: "auto" }}>
                                    <NavigateBefore style={{ fontSize: 32 }} />
                                </div>

                                <div className="col text-left blue-text" style={{ margin: "auto" }}>
                                    <p>Preview Search </p>
                                </div>

                                <div className="col-auto">
                                    <button className="btn   btn-link text-dark menu-btn">
                                        <Close
                                            onClick={this.selectCreateSearch}
                                            className=""
                                            style={{ fontSize: 32 }}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="container   pb-4 ">
                            <div className="row no-gutters justify-content-center mt-4 mb-4 listing-row-border pb-4">
                                <div className={"col-4"}>
                                    <img className={"img-fluid"} src={PaperImg} alt="" />
                                </div>
                                <div className={"col-6 pl-3 content-box-listing"}>
                                    <p style={{ fontSize: "18px" }} className=" mb-1">
                                        Metal
                                    </p>
                                    <p style={{ fontSize: "16px" }} className="text-mute mb-1">
                                        Loose / 14 kg
                                    </p>
                                    <p style={{ fontSize: "16px" }} className="text-mute mb-1">
                                        @Tescos
                                    </p>
                                </div>
                                <div style={{ textAlign: "right" }} className={"col-2"}>
                                    <p className={"orange-text small"}>Matched</p>
                                </div>
                            </div>

                            <div className="row justify-content-center pb-2 pt-5 mt-5 ">
                                <div className="col-auto">
                                    <h3 className={"blue-text text-heading"}>Almost there?</h3>
                                </div>
                            </div>

                            <div className="row justify-content-center pb-4 pt-2 pd-5 ">
                                <div className="col-auto">
                                    <p className={"text-gray-light small text-center"}>
                                        Please log in or sign up to complete your search.
                                    </p>
                                </div>
                            </div>

                            <div
                                className="row  justify-content-center search-container "
                                style={{ margin: "auto" }}>
                                <div className="col-auto">
                                    <button
                                        type="button"
                                        className="shadow-sm mr-2 btn btn-link blue-btn mt-5 mb-2 btn-blue">
                                        Create a Search
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <React.Fragment>
                    <CssBaseline />

                    <AppBar
                        position="fixed"
                        color="#ffffff"
                        className={classesBottom.appBar + "  custom-bottom-appbar"}>
                        <Toolbar>
                            {this.state.active < 8 ? (
                                <div
                                    className="row  justify-content-center search-container "
                                    style={{ margin: "auto" }}>
                                    <div className="col-auto">
                                        <button
                                            type="button"
                                            className="shadow-sm mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                            Back
                                        </button>
                                    </div>
                                    <div className="col-auto" style={{ margin: "auto" }}>
                                        <p className={"blue-text"}> Page 2/3</p>
                                    </div>
                                    <div className="col-auto">
                                        <button
                                            onClick={this.nextClick}
                                            type="button"
                                            className="shadow-sm mr-2 btn btn-link blue-btn mt-2 mb-2 btn-blue">
                                            {this.state.active !== 7 ? "Next" : "Post Search"}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="row  justify-content-center search-container "
                                    style={{ margin: "auto" }}>
                                    <div className="col-auto">
                                        <button
                                            type="button"
                                            className="shadow-sm mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                            Log in
                                        </button>
                                    </div>

                                    <div className="col-auto">
                                        <button
                                            onClick={this.nextClick}
                                            type="button"
                                            className="shadow-sm mr-2 btn btn-link blue-btn mt-2 mb-2 btn-blue">
                                            Sign Up
                                        </button>
                                    </div>
                                </div>
                            )}
                        </Toolbar>
                    </AppBar>
                </React.Fragment>
            </>
        );
    }
}

const useStylesBottomBar = makeStyles((theme) => ({
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

function BottomAppBar() {
    const classes = useStylesBottomBar();

    return (
        <React.Fragment>
            <CssBaseline />

            <AppBar position="fixed" color="#ffffff" className={classes.appBar}>
                <Toolbar>
                    <div
                        className="row  justify-content-center search-container "
                        style={{ margin: "auto" }}>
                        <div className="col-auto">
                            <button
                                type="button"
                                className="shadow-sm mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                Back
                            </button>
                        </div>
                        <div className="col-auto" style={{ margin: "auto" }}>
                            <p className={"blue-text"}> Page 2/3</p>
                        </div>
                        <div className="col-auto">
                            <button
                                type="button"
                                className="shadow-sm mr-2 btn btn-link blue-btn mt-2 mb-2 btn-blue">
                                Next
                            </button>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}

function UnitSelect() {
    const classes = useStylesSelect();
    const [state, setState] = React.useState({
        unit: "",
        name: "hai",
    });

    const handleChange = (event) => {
        const name = event.target.name;
        setState({
            ...state,
            [name]: event.target.value,
        });
    };

    return (
        <div>
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel htmlFor="outlined-age-native-simple">Unit</InputLabel>
                <Select
                    native
                    value={state.age}
                    onChange={handleChange}
                    label="Age"
                    inputProps={{
                        name: "unit",
                        id: "outlined-age-native-simple",
                    }}>
                    <option aria-label="None" value="" />
                    <option value={10}>Ten</option>
                    <option value={20}>Twenty</option>
                    <option value={30}>Thirty</option>
                </Select>
            </FormControl>
        </div>
    );
}

const useStylesSelect = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(0),
        width: "100%",
        // minWidth: auto,
    },
    selectEmpty: {
        marginTop: theme.spacing(0),
    },
}));

const mapStateToProps = (state) => {
    return {
        // age: state.age,
        // cartItems: state.cartItems,
        // loading: state.loading,
        // isLoggedIn: state.isLoggedIn,
        // loginFailed: state.loginFailed,
        // showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        // userDetail: state.userDetail,
        // abondonCartItem : state.abondonCartItem,
        // showNewsletter: state.showNewsletter
    };
};

const mapDispachToProps = (dispatch) => {
    return {};
};
export default connect(mapStateToProps, mapDispachToProps)(ListingForm);
