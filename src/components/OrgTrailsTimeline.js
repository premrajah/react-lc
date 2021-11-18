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
import { makeStyles } from "@material-ui/core/styles";

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

function OrgTrailsTimeline(props) {
    const classes = useStyles();

    return (
        <>
            <Timeline>
                {props.orgTrails
                    .filter((item) => item._relation === "belongs_to")
                    .map((item, index) => (
                        <TimelineItem key={index}>
                            <TimelineOppositeContent>
                                {/*<Paper elevation={0} className={classes.paper}>*/}
                                    <Typography
                                        variant="p"
                                        component="p"
                                        // style={{ color: "#05AD88" }}
                                    >
                                        <span className={" "}>
                                            <span className={"text-caps sub-title-text-pink"}>  {item.org.name}</span>
                                            <br/>
                                            <span className={" text-capitlize text-gray-light"}>{item.org.description}</span>
                                        </span>
                                    </Typography>
                                {/*</Paper>*/}
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

                                {props.orgTrails.filter((item) => item._relation === "belongs_to")
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
                            </TimelineContent>
                        </TimelineItem>
                    ))}

                {props.orgTrails
                    .filter((item) => item._relation === "past_owner")
                    .map((item, index) => (
                        <TimelineItem>
                            <TimelineOppositeContent>
                                {/*<Paper elevation={0} className={classes.paper}>*/}
                                    <Typography
                                        variant="p"
                                        component="p"
                                       >
                                        <span className={"text-caps "}>
                                            {item.org.name}
                                            {item.org.description && ", " + item.org.description}
                                        </span>
                                    </Typography>
                                {/*</Paper>*/}
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

                                {props.orgTrails.filter((item) => item._relation === "past_owner")
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
                                        {moment(item._ts_epoch_ms).format("DD MMM YYYY")}
                                    </p>
                                </Typography>
                            </TimelineContent>
                        </TimelineItem>
                    ))}
            </Timeline>
        </>
    );
}

export default OrgTrailsTimeline;
