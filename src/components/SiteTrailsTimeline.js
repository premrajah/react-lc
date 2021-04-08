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
import React from "react";
import {makeStyles} from "@material-ui/core/styles";

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
                                        {item.site.org.description && ", " + item.site.org.description}
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
                                        {moment(item.site.org._ts_epoch_ms).format("DD MMM YYYY")}
                                    </p>
                                </Typography>
                                <Typography variant="caption" component="div">Currently is located at</Typography>
                                <Typography className="blue-text" variant="subtitle1" component="div">{item.site.site.address}</Typography>
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
                                        {item.site.org.description && ", " + item.site.org.description}
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

                                {props.siteTrails.filter((item) => item._relation === "was_located_at")
                                    .length >
                                index + 1 && (
                                    <TimelineConnector
                                        style={{ backgroundColor: "#05AD88", height: "100px" }}
                                    />
                                )}
                            </TimelineSeparator>
                            <TimelineContent>
                                <Typography>
                                    <p className={"text-blue"}>
                                        {moment(item.site.org._ts_epoch_ms).format("DD MMM YYYY")}
                                    </p>
                                </Typography>
                                <Typography variant="caption" component="div">Previously was located at</Typography>
                                <Typography className="blue-text" variant="subtitle1" component="div">{item.site.site.address}</Typography>
                            </TimelineContent>
                        </TimelineItem>
                    ))}


            </Timeline>
        </div>
    );
}

export default SiteTrailsTimeline;