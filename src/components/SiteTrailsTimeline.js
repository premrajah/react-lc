import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import moment from "moment";
import React, {useEffect, useState} from "react";
import {makeStyles} from "@mui/styles";
import MapIcon from '@mui/icons-material/Place';
import Close from "@mui/icons-material/Close";
import {GoogleMap} from "./Map/MapsContainer";
import {Modal, ModalBody} from "react-bootstrap";

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

function SiteTrailsTimeline(props) {
    const classes = useStyles();
    const [showMap, setShowMap] = useState(false);
    const [locations, setLocations] = useState([]);

    const [site, setSite] = useState(null);
    const handleMapModal = (site) => {

        setShowMap(!showMap);
        setSite(site)
    }

    useEffect(()=>{

        let locationsList = []

        let sites =props.siteTrails

        for (let i=0;i<sites.length;i++){

            let site = sites[i].site.site

            try{
                if (site&&site.geo_codes&&site.geo_codes[0])
                    locationsList.push(
                        {isCenter:i==0?true:false,name:site.name,
                            location:site.geo_codes[0].address_info.geometry.location}
                    )
            }catch (error){

                console.log(error)
            }

        }


        setLocations(locationsList)

    },props.siteTrails)




    return (
        <div>
            <Timeline>
                {props.siteTrails
                    .filter((item) => item._relation === "located_at")
                    .map((item, index) => (
                        <TimelineItem key={index}>
                            <TimelineOppositeContent>
                                <Paper elevation={0} className={classes.paper}>
                                    <Typography
                                        variant="h6"
                                        component="h1"
                                        style={{ color: "#05AD88" }}>
                                        {item.site.org&&   <span className={"text-caps"}>
                                            {item.site.org.name}
                                            {item.site.org.description &&
                                                ", " + item.site.org.description}
                                        </span>}
                                    </Typography>
                                </Paper>
                            </TimelineOppositeContent>

                            <TimelineSeparator>
                                <TimelineDot
                                    style={{
                                        backgroundColor: "#27245C",
                                        width: "25px",
                                        height: "25px",
                                    }}>
                                    {/*<BusinessIcon />*/}
                                </TimelineDot>

                                {props.siteTrails.filter((item) => item._relation === "located_at")
                                    .length > 0 && (
                                    <TimelineConnector
                                        style={{ backgroundColor: "#05AD88", height: "100px" }}
                                    />
                                )}
                            </TimelineSeparator>

                            <TimelineContent>
                                <Typography>
                                    <p className={"text-blue"}>
                                        {moment(item._ts_epoch_ms).format("DD MMM YYYY")}
                                    </p>
                                </Typography>
                                <Typography variant="caption" component="div">
                                    Currently located at
                                </Typography>
                                <Typography
                                    className="blue-text"
                                    variant="subtitle1"
                                    component="div">
                                    {item.site.site.address}  <MapIcon onClick={() => handleMapModal(item.site.site)} />
                                </Typography>
                            </TimelineContent>
                        </TimelineItem>
                    ))}

                {props.siteTrails
                    .filter((item) => item._relation === "was_located_at")
                    .map((item, index) => (
                        <TimelineItem>
                            <TimelineOppositeContent>
                                <Paper elevation={0} className={classes.paper}>
                                    <Typography
                                        variant="h6"
                                        component="h1"
                                        style={{ color: "#05AD88" }}>
                                        <span className={"text-caps"}>
                                            {item.site.org&&item.site.org.name}
                                            {item.site.org&&item.site.org.description &&
                                                ", " + item.site.org.description}
                                        </span>


                                    </Typography>
                                </Paper>
                            </TimelineOppositeContent>

                            <TimelineSeparator>
                                <TimelineDot
                                    style={{
                                        backgroundColor: "#05AD88",
                                        width: "25px",
                                        height: "25px",
                                    }}>
                                    {/*<BusinessIcon />*/}
                                </TimelineDot>

                                {props.siteTrails.filter(
                                    (item) => item._relation === "was_located_at"
                                ).length >
                                    index + 1 && (
                                    <TimelineConnector
                                        style={{ backgroundColor: "#05AD88", height: "100px" }}
                                    />
                                )}
                            </TimelineSeparator>
                            <TimelineContent>
                                <Typography>
                                    <p className={"text-blue"}>
                                        {moment(item._ts_epoch_ms).format("DD MMM YYYY")}
                                    </p>
                                </Typography>
                                <Typography variant="caption" component="div">
                                    Previously was located at
                                </Typography>
                                <Typography
                                    className="blue-text"
                                    variant="subtitle1"
                                    component="div">
                                    {item.site.site.address}   <MapIcon  onClick={() => handleMapModal(item.site.site)} style={{color:"#05AD88"}}/>
                                </Typography>
                            </TimelineContent>
                        </TimelineItem>
                    ))}
            </Timeline>

                <>

                    <Modal
                        className={"loop-popup"}
                        aria-labelledby="contained-modal-title-vcenter"
                        show={showMap &&locations.length>0}
                        centered
                        onHide={handleMapModal}
                        animation={false}>
                        <ModalBody>
                            <div style={{position: "absolute",
                                right: "5px",top:"5px",zIndex:1}} className=" text-right web-only">
                                <Close
                                    onClick={()=>{handleMapModal()}}
                                    className="blue-text click-item"
                                    style={{ fontSize: 32 }}
                                />
                            </div>

                            {/*<div className={"row justify-content-center"}>*/}
                            {/*    <div className={"col-10 text-center"}>*/}
                            {/*        <p*/}
                            {/*            style={{ textTransform: "Capitalize" }}*/}
                            {/*            className={"text-bold text-blue"}>*/}
                            {/*            {this.state.type=="edit"?"Edit Transfer Scaling ":this.state.type=="add"?"Add Transfer Scaling":"Delete Transfer Scaling"}*/}
                            {/*        </p>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                    {/*<div className={"body-overlay"}>*/}
                    {/*    <div className={"modal-popup site-popup"}>*/}
                    {/*        <div className=" text-right ">*/}
                    {/*            <Close*/}
                    {/*                onClick={() => handleMapModal()}*/}
                    {/*                className="blue-text click-item"*/}
                    {/*                style={{ fontSize: 32 }}*/}
                    {/*            />*/}
                    {/*        </div>*/}

                            <div className={"row"}>
                                <div className={"col-12"}>
                                    <GoogleMap width={"100%"}
                                                          height={"300px"}

                                                          locations={locations}
                                    />
                                </div>
                            </div>
                        </ModalBody>
                    </Modal>
                        {/*</div>*/}
                    {/*</div>*/}
                </>



        </div>
    );
}

export default SiteTrailsTimeline;
