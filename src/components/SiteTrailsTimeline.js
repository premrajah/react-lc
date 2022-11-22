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
import {ArrowCircleUp} from "@mui/icons-material";
import {getNumberFromString} from "../Util/GlobalFunctions";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import InfoIcon from "./FormsUI/ProductForm/InfoIcon";
import CustomPopover from "./FormsUI/CustomPopover";
import {TRANSPORT_MODES} from "../Util/Constants";


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
                        <>
                        <TimelineItem pos key={index}>
                            <TimelineOppositeContent style={{marginTop:"50px"}}>
                                {/*<Paper elevation={0} className={classes.paper}>*/}
                                {/*    <Typography*/}
                                {/*        variant="h6"*/}
                                {/*        component="h1"*/}
                                {/*        className={"mt-1 me-2"}*/}
                                {/*        style={{ color: "#05AD88" }}>*/}
                                {/*        {item.site.org&&   <span className={"text-caps"}>*/}
                                {/*            {item.site.org.name}*/}
                                {/*            {item.site.org.description &&*/}
                                {/*                ", " + item.site.org.description}*/}
                                {/*        </span>}*/}
                                {/*    </Typography>*/}
                                {/*</Paper>*/}
                                <DistanceTrailPopOver index={index}  item={item} distanceTrails={props.distanceTrails} />
                            </TimelineOppositeContent>

                            <TimelineSeparator>
                                <TimelineDot
                                    style={{
                                        backgroundColor: "#27245C",
                                        width: "25px",
                                        height: "25px",
                                    }}>

                                </TimelineDot>


                                {props.siteTrails.filter((item) => item._relation === "located_at")
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
                                <Typography variant="caption" component="div">
                                    Currently located at
                                </Typography>
                                <Typography

                                    className="blue-text mt-1"
                                    variant="subtitle1"
                                    component="div">
                                    {item.site.site.address}   {item.site.site.geo_codes&&item.site.site.geo_codes.length>0&&<MapIcon onClick={() =>
                                   handleMapModal(item.site.site)} />}
                                </Typography>
                            </TimelineContent>
                        </TimelineItem>





                        </>
                    ))}

                {props.siteTrails
                    .filter((item) => item._relation === "was_located_at")
                    .map((item, index) => <>
                        <TimelineItem >
                            <TimelineOppositeContent style={{marginTop:"50px"}}>
                                <DistanceTrailPopOver index={index}  item={item} distanceTrails={props.distanceTrails} />
                                {/*<Paper elevation={0} className={classes.paper}>*/}
                                {/*    <Typography*/}
                                {/*        variant="h6"*/}
                                {/*        component="h1"*/}

                                {/*        style={{ color: "#05AD88" }}>*/}
                                {/*        <span className={"text-caps"}>*/}
                                {/*            {item.site.org&&item.site.org.name}*/}
                                {/*            {item.site.org&&item.site.org.description &&*/}
                                {/*                ", " + item.site.org.description}*/}
                                {/*        </span>*/}


                                {/*    </Typography>*/}
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
                                {/*    /!*<BusinessIcon />*!/*/}
                                {/*</TimelineDot>*/}

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
                                <Typography
                                    className="mt-1 me-2"
                                >
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
                                    {item.site.site.address} {item.site.site.geo_codes&&item.site.site.geo_codes.length>0&&  <MapIcon  onClick={() => handleMapModal(item.site.site)} style={{color:"#05AD88"}}/>}
                                </Typography>
                            </TimelineContent>
                        </TimelineItem>


                    </>
                    )}
            </Timeline>

                <>

                    <Modal
                        className={"loop-popup"}
                        aria-labelledby="contained-modal-title-vcenter"
                        show={showMap}
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



                            {site &&
                            <div className={"row"}>
                                <div className={"col-12"}>
                                    <GoogleMap
                                        width={"100%"}
                                        height={"300px"}

                                        siteId={site._key}
                                         locations={[{
                                        name: site.name,
                                        location: site.geo_codes[0].address_info.geometry.location,
                                        isCenter: true
                                    }]}
                                    />
                                </div>
                            </div>}
                        </ModalBody>
                    </Modal>

                </>



        </div>
    );
}


const DistanceTrail=(props)=>{


    let item=props.item
    let index=props.index
    return(
        <>
        {(props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id)
            &&props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.carbon.carbon_tons>0)
        &&
            <>

                        <Paper elevation={0} >
                            <Typography

                                style={{ opacity: "0.8" }}>


                                <TableContainer component={Paper}>
                                <Table className="carbon-table" sx={{ minWidth: 150 }} aria-label="simple table">

                                <TableBody>
                                    {/*<TableRow>*/}
                                    {/*    <span className="w-100 ">{props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id)._id}</span>*/}
                                    {/*</TableRow>*/}
                               <TableRow>

                                        <TableCell component="td" scope="row">
                                            Carbon(Tons):
                                        </TableCell>
                                        <TableCell align="right">
                                            {props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.carbon.carbon_tons}
                                        </TableCell>

                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="td" scope="row">
                                            Gross Weight(Kgs):
                                        </TableCell>
                                        <TableCell align="right">
                                            {props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.gross_weight_kgs}
                                        </TableCell>

                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="td" scope="row">
                                            Transport Mode:
                                        </TableCell>
                                        <TableCell align="right">
                                            {getMode(props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.transport_mode,props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.carbon.carbon_kg_km)}
                                        </TableCell>

                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="td" scope="row">
                                            Distance (Km):
                                        </TableCell>
                                        <TableCell align="right">
                                            {(props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.distance.value/1000).toFixed(2)}
                                        </TableCell>


                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="td" scope="row">
                                            Duration(Hr):
                                        </TableCell>
                                        <TableCell align="right">
                                            {(props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.duration.value/3600).toFixed(1)}
                                        </TableCell>

                                    </TableRow>
                                </TableBody>
                                </Table>
                                </TableContainer>

                                {/*<span className="w-100 d-none">{props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id)._id}</span>*/}

                                 {/*<span className="w-100 text-14 d-block">Carbon(Tons): {props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.carbon.carbon_tons}</span>*/}
                               {/*<span className="w-100 d-block text-14">Gross Weight(Kgs): {props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.gross_weight_kgs}</span>*/}

                                {/*<span className="w-100 d-block text-14">Transport Mode: {getMode(props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.transport_mode,props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.carbon.carbon_kg_km)}</span>*/}
                                {/*<span className="w-100 d-block text-14">Distance: {props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.distance.value} {props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.distance.text}</span>*/}
                                {/*<span className="w-100 d-block text-14">Duration: {props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.duration.value} {props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.duration.text}</span>*/}

                            </Typography>
                        </Paper>


                </>}
   </>
    )
}


const DistanceTrailPopOver=(props)=>{


    let item=props.item
    let index=props.index
    return(
        <>
            {(props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id)
                &&props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.carbon.carbon_tons>0)
            &&
            <>

                <Paper elevation={0} >
                    <Typography

                        style={{ opacity: "1" }}>

                        <CustomPopover
                            heading={`Carbon Emissions ${props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.carbon.carbon_tons.toFixed(6)} tons`}

                            text={` 
                            Gross Weight (kgs):${props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.gross_weight_kgs} 
                            , Transport Mode:${getMode(props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.transport_mode,props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.carbon.carbon_kg_km)} 
                            , Distance (kms): ${(props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.distance.value/1000).toFixed(0)}
                            , Duration (hr):${(props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.duration.value/3600).toFixed(0)}
                            `}

                        > <span className="text-blue">Emissions : {props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.carbon.carbon_tons.toFixed(6)} tons CO<span className="">2</span></span>
                            <br></br>
                            <span className="text-12"> {(props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.distance.value/1000).toFixed(0)} kms in
                            {(props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.duration.value/3600).toFixed(0)} hrs via
                            {getMode(props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.transport_mode,props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.carbon.carbon_kg_km)}</span>

                        </CustomPopover>




                    </Typography>
                </Paper>


            </>}
        </>
    )
}

const getMode=(text, carbon)=>{

    console.log("mode",text)
    let result=""
    // let percentage=getNumberFromString(text)
    if (text.includes(TRANSPORT_MODES[0])){
        result=result+" Custom"
        result=` ${carbon}`
        // if (percentage){
        //     result=` ${carbon}`
        // }

    }

  else  if (text.includes(TRANSPORT_MODES[1])) {
        result=result+" Road"
    }

    else  if (text.includes(TRANSPORT_MODES[2])) {
        result=result+" Rail"
    }
    else  if (text.includes(TRANSPORT_MODES[3])) {
        result=result+" Air"
    }
    else  if (text.includes(TRANSPORT_MODES[4])) {
        result=result+" Sea"
    }
    else  if (text.includes(TRANSPORT_MODES[5])) {
        result=result+" Road & Sea"
    }
    else  if (text.includes(TRANSPORT_MODES[6])) {
        result=result+" Road & Rail"
    }
    else  if (text.includes(TRANSPORT_MODES[7])) {
        result=result+" Road & Air"
    }



    return  result
}

export default SiteTrailsTimeline;
