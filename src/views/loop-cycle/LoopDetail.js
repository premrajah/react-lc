import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import PaperImg from '../../img/paper-big.png';
import Sidebar from '../menu/Sidebar'
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import HeaderWhiteBack from '../header/HeaderWhiteBack'
import { withStyles } from "@material-ui/core/styles/index";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';

class LoopDetail extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false
        }

    }


    componentWillMount() {

    }
    componentDidMount() {

    }



    render() {

        const classes = withStyles();
        const classesBottom = withStyles();



        return (
            <div>

                <Sidebar />
                <div className="wrapper accountpage loop-cycle-page">

                    <HeaderWhiteBack history={this.props.history} heading={"View Cycle"} />


                    <div className="container  pt-3 pb-3">
                        <LoopAccordion loop={this.props.loop} />
                    </div>

                </div>



            </div>
        );
    }
}



const useStylesAccordian = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));



function LoopAccordion(props) {


    // alert(props.logistics.email)
    const classes = useStylesAccordian();

    return (
        <div className={classes.root}>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}>
                        <p className={"heading-accordian text-blue text-bold"}>Seller</p>
                        <div className="row no-gutters justify-content-center ">

                            <div className={"col-auto"}>

                                <figure className="avatar avatar-60 border-0">


                                    <span className={"word-user  word-user-cycle"}>
                                        { props.loop.producer.org.name.substr(0, 2)}

                                </span>

                                </figure>
                            </div>
                            <div className={"col-auto pl-3 content-box-listing"}>
                                <p style={{ fontSize: "18px" }} className=" mb-1">{props.loop.producer.org.name}</p>
                                <p style={{ fontSize: "16px" }} className="text-mute mb-1">{props.loop.producer.email}</p>

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
                    id="panel2a-header"
                >
                    <Typography className={classes.heading}>
                        <p className={"heading-accordian text-blue text-bold"}>Buyer</p>

                        <div className="row no-gutters justify-content-center ">

                            <div className={"col-auto"}>

                                <figure className="avatar avatar-60 border-0">
                                    <span className={"word-user  word-user-cycle"}>

                                        { props.loop.consumer.org.name.substr(0, 2)}

                                </span>
                                </figure>
                            </div>
                            <div className={"col-auto pl-3 content-box-listing"}>
                                <p style={{ fontSize: "18px" }} className=" mb-1">{props.loop.consumer.org.name}</p>
                                <p style={{ fontSize: "16px" }} className="text-mute mb-1">@{props.loop.consumer.email}</p>
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


            {props.loop.logistics &&
                <Accordion >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3a-content"
                        id="panel3a-header"
                    >
                        <Typography className={classes.heading}>
                            <p className={"heading-accordian text-blue text-bold"}>Logistics</p>

                            <div className="row no-gutters justify-content-center ">

                                <div className={"col-auto"}>

                                    <figure className="avatar avatar-60 border-0">

                                        <span className={"word-user  word-user-cycle"}>

                                            {props.loop.logistics.org.name.substr(0, 2)}

                                         </span>

                                    </figure>
                                </div>
                                <div className={"col-auto pl-3 content-box-listing"}>

                                    <p style={{ fontSize: "18px" }} className=" mb-1">{props.loop.logistics.org.name}</p>
                                    <p style={{ fontSize: "16px" }} className="text-mute mb-1">{props.loop.logistics.email}</p>

                                </div>

                            </div>
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            <ViaContent loop={props.loop} />
                        </Typography>
                    </AccordionDetails>
                </Accordion>}
        </div>
    );
}


function FromContent(props) {




    return (


        <>


            <div className="row no-gutters  justify-content-center">



                <div className="col-auto ">
                    <img className={"img-fluid"} src={PaperImg} alt="" />

                </div>
            </div>

            <div className="row justify-content-start pb-3 pt-4 listing-row-border">

                <div className="col-12">
                    <p className={"green-text text-heading"}>{props.loop.producer.org.id}
                    </p>

                </div>
                <div className="col-12 mt-2">
                    <h5 className={"blue-text text-heading"}>{props.loop.resource.name}
                    </h5>

                </div>
            </div>


            <div className="row justify-content-start pb-3 pt-3 listing-row-border">

                <div className="col-auto">
                    <p style={{ fontSize: "16px" }} className={"text-gray-light "}>
                        {props.loop.resource.description}
                    </p>

                </div>

            </div>

            <div className="row justify-content-start pb-4 pt-3 ">
                <div className="col-auto">
                    <h6 className={""}>Category
                     </h6>
                    <p>{props.loop.resource.category}</p>

                </div>
            </div>


            {/*<div className="row justify-content-start pb-4 pt-3 ">*/}
                {/*<div className="col-auto">*/}
                    {/*<h6 className={""}>Amount*/}
                     {/*</h6>*/}
                    {/*<p>{props.loop.resource.volume} {props.loop.resource.units}</p>*/}

                {/*</div>*/}
            {/*</div>*/}

            <div className="row justify-content-start pb-4 pt-3 ">
                <div className="col-auto">
                    <h6 className={""}>Delivery From
                     </h6>
                    <p>{props.loop.from.name}, {props.loop.from.address}</p>

                </div>
            </div>

        </>
    );
}
function ToContent(props) {




    return (


        <>


            {/*<div className="row no-gutters  justify-content-center">*/}



            {/*<div className="col-auto ">*/}
            {/*<img className={"img-fluid"}  src={PaperImg} />*/}

            {/*</div>*/}
            {/*</div>*/}

            <div className="row justify-content-start pb-3 pt-4 listing-row-border">

                <div className="col-12">
                    <p className={"green-text text-heading"}>{props.loop.consumer.org.id}
                    </p>

                </div>
                <div className="col-12 mt-2">
                    <h5 className={"blue-text text-heading"}>{props.loop.consumer.name}
                    </h5>

                </div>
            </div>


            <div className="row justify-content-start pb-3 pt-3 listing-row-border">

                <div className="col-auto">
                    <p style={{ fontSize: "16px" }} className={"text-gray-light "}>
                        {props.loop.resource.description}
                    </p>

                </div>

            </div>

            <div className="row justify-content-start pb-4 pt-3 ">
                <div className="col-auto">
                    <h6 className={""}>Category
                    </h6>
                    <p>{props.loop.resource.category}</p>

                </div>
            </div>


            <div className="row justify-content-start pb-4 pt-3 ">
                <div className="col-auto">
                    <h6 className={""}>Amount
                    </h6>
                    <p>{props.loop.search.volume} {props.loop.search.units}</p>

                </div>
            </div>

            <div className="row justify-content-start pb-4 pt-3 ">
                <div className="col-auto">
                    <h6 className={""}>Delivery To
                    </h6>
                    <p>{props.loop.from.name}, {props.loop.from.address}</p>

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
                    <h5 className={"blue-text text-heading"}>Contact Deails
                    </h5>

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
                    <h6 className={""}>Tracking Details
                    </h6>

                    <p>Tracking Number:  {props.loop.tracking}</p>

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
        top: 'auto',
        bottom: 0,
    },
    grow: {
        flexGrow: 1,
    },
    fabButton: {
        position: 'absolute',
        zIndex: 1,
        top: -30,
        left: 0,
        right: 0,
        margin: '0 auto',
    },
}));



function StatusTimeline() {
    return (
        <Timeline>
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>Eat</TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>Code</TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot />
                </TimelineSeparator>
                <TimelineContent>Sleep</TimelineContent>
            </TimelineItem>
        </Timeline>
    );
}

function BottomAppBar() {
    const classes = useStyles();

    return (
        <React.Fragment>
            <CssBaseline />

            <AppBar position="fixed" color="#ffffff" className={classes.appBar}>
                <Toolbar>
                    <div className="row  justify-content-center search-container " style={{ margin: "auto" }}>
                        <div className="col-auto">

                            <button type="button" className=" mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                Cancel Loop
                            </button>

                        </div>
                        <div className="col-auto">

                            <button type="button"
                                className="shadow-sm mr-2 btn btn-link blue-btn mt-2 mb-2 btn-blue">
                                Select Provider

                            </button>
                        </div>
                    </div>

                </Toolbar>
            </AppBar>
        </React.Fragment>
    );


}


export default LoopDetail;
