import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent, {timelineOppositeContentClasses} from "@mui/lab/TimelineOppositeContent";
import Typography from "@mui/material/Typography";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import moment from "moment";
import React from "react";
import { makeStyles } from "@mui/styles";
import OrgComponent from "./Org/OrgComponent";
import {ArrowCircleUp} from "@mui/icons-material";

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
            <Timeline
                sx={{
                    [`& .${timelineOppositeContentClasses.root}`]: {
                        flex: 1,
                    },
                }}
            >
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
                                        className={"mt-2 me-2"}
                                    >
                                        <OrgComponent
                                            org={item.org}
                                        />

                                        {/*<span className="">*/}
                                        {/*    <span className={"text-caps sub-title-text-pink"}>  {item.org.name}</span>*/}
                                        {/*    <br/>*/}
                                        {/*    <span className={" text-capitlize text-gray-light"}>{item.org.description}</span>*/}
                                        {/*</span>*/}
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

                                {props.orgTrails.filter((item) => item._relation === "past_owner")
                                    .length > 0 && (
                                    <TimelineConnector
                                        style={{ backgroundColor: "#05AD88", height: "100px" }}
                                    />
                                )}
                            </TimelineSeparator>

                            <TimelineContent>
                                <Typography
                                    className={"mt-1 me-2"}
                                >
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
                        <TimelineItem key={index}>
                            <TimelineOppositeContent>
                                {/*<Paper elevation={0} className={classes.paper}>*/}
                                    <Typography
                                        variant="p"
                                        component="p"
                                        className={"mt-0 me-2"}
                                    >
                                        <OrgComponent colorClass="text-blue"
                                            org={item.org}
                                        />
                                        {/*<span className={"text-caps "}>*/}
                                        {/*    {item.org.name}*/}
                                        {/*    {item.org.description && ", " + item.org.description}*/}
                                        {/*</span>*/}
                                    </Typography>
                                {/*</Paper>*/}
                            </TimelineOppositeContent>

                            <TimelineSeparator>
                                <ArrowCircleUp
                                    style={{
                                        color: "#05AD88",
                                        width: "25px",
                                        height: "25px",
                                    }}
                                />
                                {/*<TimelineDot*/}
                                {/*    style={{*/}
                                {/*        backgroundColor: "#05AD88",*/}
                                {/*        width: "25px",*/}
                                {/*        height: "25px",*/}
                                {/*    }}>*/}
                                {/*    <ArrowCircleUp style={{alignSelf: "center", align: "center"}}/>*/}
                                {/*    /!*<BusinessIcon />*!/*/}
                                {/*</TimelineDot>*/}

                                {props.orgTrails.filter((item) => item._relation === "past_owner")
                                    .length >
                                    index + 1 && (
                                    <TimelineConnector
                                        style={{ backgroundColor: "#05AD88", height: "100px" }}
                                    />
                                )}
                            </TimelineSeparator>
                            <TimelineContent sx={{mt: -0.5}}>
                                <Typography
                                    className={"mt-0 me-2"}
                                >
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
