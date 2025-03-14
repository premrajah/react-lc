import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import PaperImg from "../../img/place-holder-lc.png";
import PlaceholderImg from "../../img/place-holder-lc.png";
import Sidebar from "../menu/Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { withStyles } from "@material-ui/core/styles/index";
import CircleProgress from "../../components/Circle";

class CycleDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            percentage: null,
        };
    }

    UNSAFE_componentWillMount() {
        if (this.props.loop.cycle.stage === "progress") {
            this.setState({
                percentage: 20,
            });
        }

        if (this.props.loop.cycle.stage === "delivered") {
            this.setState({
                percentage: 40,
            });
        }

        if (this.props.loop.cycle.stage === "received") {
            this.setState({
                percentage: 60,
            });
        }

        if (this.props.loop.cycle.stage === "confirmed") {
            this.setState({
                percentage: 80,
            });
        }

        if (this.props.loop.cycle.stage === "closed") {
            this.setState({
                percentage: 100,
            });
        }
    }

    componentDidMount() {}

    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <div>
                <Sidebar />

                <div className="row text-center">
                    <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                        {this.state.percentage && (
                            <CircleProgress
                                percentage={this.state.percentage}
                                stage={this.props.loop.cycle.stage}
                            />
                        )}
                    </div>
                </div>

                <div className="row  pt-3 pb-3">
                    <LoopAccordion loop={this.props.loop} />
                </div>
            </div>
        );
    }
}

const useStylesAccordian = makeStyles((theme) => ({
    root: {
        width: "100%",
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

function LoopAccordion(props) {
    const classes = useStylesAccordian();

    return (
        <div className={classes.root}>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3a-content"
                    id="panel3a-header">
                    <Typography className={classes.heading}>
                        <p className={"heading-accordian text-blue text-bold"}>Order</p>

                        <div className="row no-gutters justify-content-center ">
                            <div className={"col-auto"}>
                                <img
                                    style={{ height: "70px", width: "100px" }}
                                    className={"img-fluid"}
                                    src={PlaceholderImg}
                                    alt=""
                                />
                            </div>
                            <div className={"col-auto ps-3 content-box-listing"}>
                                <p style={{ fontSize: "18px" }} className=" mb-1">
                                    {props.loop.listing.name}
                                </p>
                                <p style={{ fontSize: "16px" }} className=" mb-1">
                                    Product Linked: {props.loop.product.name}
                                </p>

                                <p style={{ fontSize: "16px" }} className="text-mute mb-1">
                                    GBP {props.loop.offer.amount.value}
                                </p>
                                <p style={{ fontSize: "16px" }} className="text-mute mb-1">

                                    {props.loop.product.volume} {props.loop.product.units}
                                </p>
                            </div>
                        </div>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>{/*<ViaContent loop={props.loop} />*/}</Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header">
                    <Typography className={classes.heading}>
                        <p className={"heading-accordian text-blue text-bold"}>Seller</p>
                        <div className="row no-gutters justify-content-center ">
                            <div className={"col-auto"}>
                                <figure className="avatar avatar-60 border-0">
                                    <span className={"word-user  word-user-cycle"}>
                                        {props.loop.sender.name.substr(0, 2)}
                                    </span>
                                </figure>
                            </div>
                            <div className={"col-auto ps-3 content-box-listing"}>
                                <p style={{ fontSize: "18px" }} className=" mb-1">
                                    {props.loop.sender.name}
                                </p>
                                {/*<p style={{ fontSize: "16px" }} className="text-mute mb-1">{props.loop.sender.email}</p>*/}
                            </div>
                        </div>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <FromContent loop={props.loop} />
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header">
                    <Typography className={classes.heading}>
                        <p className={"heading-accordian text-blue text-bold"}>Buyer</p>

                        <div className="row no-gutters justify-content-center ">
                            <div className={"col-auto"}>
                                <figure className="avatar avatar-60 border-0">
                                    <span className={"word-user  word-user-cycle"}>
                                        {props.loop.receiver.name.substr(0, 2)}
                                    </span>
                                </figure>
                            </div>
                            <div className={"col-auto ps-3 content-box-listing"}>
                                <p style={{ fontSize: "18px" }} className=" mb-1">
                                    {props.loop.receiver.name}
                                </p>
                                {/*<p style={{ fontSize: "16px" }} className="text-mute mb-1">@{props.loop.receiver.email}</p>*/}
                                {/*<p style={{fontSize:"16px"}} className="text-mute mb-1">@{props.loop.consumer.email}</p>*/}
                            </div>
                        </div>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <ToContent loop={props.loop} />
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

function FromContent(props) {
    return (
        <>
            <div className="row no-gutters  justify-content-center">
                <div className="col-md-3 col-sm-6 col-xs-6 pe-4 ">
                    <img className={"img-fluid"} src={PaperImg} alt="" />
                </div>

                <div className="col-md-9 col-sm-6 col-xs-6 ps-4">
                    <p className={"green-text text-heading"}>{props.loop.sender._id}</p>
                    <div className="col-12 mt-2">
                        <h5 className={"blue-text text-heading"}>{props.loop.sender.name}</h5>
                    </div>
                </div>
            </div>

            <div className="row justify-content-start pb-3 pt-3 listing-row-border">
                <div className="col-auto">
                    <p style={{ fontSize: "16px" }} className={"text-gray-light "}>
                        {props.loop.listing.name}
                    </p>
                </div>
            </div>

            <div className="row justify-content-start pb-4 pt-3 ">
                <div className="col-auto">
                    <p>
                        Category: {props.loop.listing.category} > {props.loop.listing.type} >
                        {props.loop.listing.state}
                    </p>
                </div>
            </div>

            <div className="row justify-content-start pb-4 pt-3 ">
                <div className="col-auto">
                    <p>
                        Amount: {props.loop.listing.volume} {props.loop.listing.units}
                    </p>
                </div>
            </div>

            <div className="row justify-content-start pb-4 pt-3 ">
                <div className="col-auto">
                    <p>
                        Delivery From: {props.loop.from_site.name}, {props.loop.from_site.contact},
                        {props.loop.from_site.address}, {props.loop.from_site.email},
                        {props.loop.from_site.phone}
                    </p>
                </div>
            </div>
        </>
    );
}

function ToContent(props) {
    return (
        <>
            <div className="row no-gutters  justify-content-center">
                <div className="col-md-3 col-sm-6 col-xs-6 pe-4 ">
                    <img className={"img-fluid"} src={PaperImg} alt="" />
                </div>

                <div className="col-md-9 col-sm-6 col-xs-6 ps-4">
                    <p className={"green-text text-heading"}>{props.loop.receiver._id}</p>
                    <div className="col-12 mt-2">
                        <h5 className={"blue-text text-heading"}>{props.loop.receiver.name}</h5>
                    </div>
                </div>
            </div>

            <div className="row justify-content-start pb-3 pt-3 listing-row-border">
                <div className="col-auto">
                    <p style={{ fontSize: "16px" }} className={"text-gray-light "}>
                        {props.loop.sender.name}
                    </p>
                </div>
            </div>

            <div className="row justify-content-start pb-4 pt-3 ">
                <div className="col-auto">
                    <p>
                        Category: {props.loop.search.category} > {props.loop.search.type} >
                        {props.loop.search.state}
                    </p>
                </div>
            </div>

            <div className="row justify-content-start pb-4 pt-3 ">
                <div className="col-auto">
                    <p>
                        Amount: {props.loop.search.volume} {props.loop.search.units}
                    </p>
                </div>
            </div>

            <div className="row justify-content-start pb-4 pt-3 ">
                <div className="col-auto">
                    <p>
                        Delivery To: {props.loop.to_site.name}, {props.loop.to_site.contact},
                        {props.loop.to_site.address}, {props.loop.to_site.email},
                        {props.loop.to_site.phone}
                    </p>
                </div>
            </div>
        </>
    );
}

function ViaContent(props) {
    return (
        <>
            <div className="row justify-content-start pb-3 pt-4 listing-row-border">
                {/*<div className="col-12">*/}
                {/*<p className={"green-text text-heading"}>@Tesco*/}
                {/*</p>*/}

                {/*</div>*/}
                <div className="col-12 mt-2">
                    <h5 className={"blue-text text-heading"}>Contact Deails</h5>
                </div>
            </div>

            <div className="row justify-content-start pb-3 pt-3 listing-row-border">
                <div className="col-auto">
                    <p style={{ fontSize: "16px" }} className={"text-gray-light "}>
                        Email : {props.loop.logistics.email}
                    </p>
                </div>
            </div>

            <div className="row justify-content-start pb-4 pt-3 ">
                <div className="col-auto">
                    <h6 className={""}>Tracking Details</h6>

                    <p>Tracking Number: {props.loop.tracking}</p>
                </div>
            </div>
        </>
    );
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

export default CycleDetail;
