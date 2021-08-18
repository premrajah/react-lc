import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineDot from "@material-ui/lab/TimelineDot";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import moment from "moment";
import React, {useEffect, useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import MapIcon from '@material-ui/icons/Place';
import {showSiteModal} from "../store/actions/actions";
import Close from "@material-ui/icons/Close";
import {MapContainer} from "./Map/MapContainer";
import {GoogleMap} from "./Map/MapsContainer";
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
        // console.log(sites)

        for (let i=0;i<sites.length;i++){

            let site = sites[i].site.site
            // locationsList.push(site)
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

        console.log(locationsList)

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
                                        <span className={"text-caps"}>
                                            {item.site.org.name}
                                            {item.site.org.description &&
                                                ", " + item.site.org.description}
                                        </span>
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
                                            {item.site.org.name}
                                            {item.site.org.description &&
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

            {(showMap &&locations.length>0)&& (
                <>
                    <div className={"body-overlay"}>
                        <div className={"modal-popup site-popup"}>
                            <div className=" text-right ">
                                <Close
                                    onClick={() => handleMapModal()}
                                    className="blue-text click-item"
                                    style={{ fontSize: 32 }}
                                />
                            </div>

                            <div className={"row"}>
                                <div className={"col-12"}>
                                    <GoogleMap width={"100%"}
                                                          height={"300px"}

                                                          locations={locations}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}


        </div>
    );
}

export default SiteTrailsTimeline;
