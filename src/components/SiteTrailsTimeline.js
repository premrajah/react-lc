import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
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
import CustomPopover from "./FormsUI/CustomPopover";
import {TRANSPORT_MODES} from "../Util/Constants";
import OrgComponent from "./Org/OrgComponent";
import TimelineOppositeContent, {timelineOppositeContentClasses,} from '@mui/lab/TimelineOppositeContent';
import GlobalDialog from "./RightBar/GlobalDialog";


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

          <div className="d-flex flex-column text-center justify-content-center mt-2">  {
                props.distanceTotals && props.distanceTotals.carbon.carbon_kgs > 0 && <>

                                <span className={" text-label text-blue mb-1 text-label"}>Transport Emissions : {props.distanceTotals.carbon.carbon_kgs.toLocaleString(undefined, {maximumFractionDigits:2})} kgCO<sub>2</sub>e</span>

                                <span className="text-14"> {(props.distanceTotals.distance.value/1000).toLocaleString(undefined, {maximumFractionDigits:2})} kms&nbsp;</span>

                </>
            }
          </div>
            <Timeline
            //     sx={{
            //     [`& .${timelineOppositeContentClasses.root}`]: {
            //         flex: 1,
            //     },
            // }}
            >
                {props.siteTrails
                    .filter((item) => item._relation === "located_at")
                    .map((item, index) => (

                        <TimelineItem  key={index}>
                            <TimelineOppositeContent
                                sx={{ mt: 7, mr: 2 }}
                            >

                                <DistanceTrailPopOver index={index}  item={item} distanceTrails={props.distanceTrails} symbol="+" />
                            </TimelineOppositeContent>

                            <TimelineSeparator>
                                <TimelineDot
                                    style={{
                                        backgroundColor: "#27245C",
                                        width: "25px",
                                        height: "25px",
                                    }}>

                                </TimelineDot>


                                {props.siteTrails.filter((item) => item._relation === "was_located_at")
                                    .length > 0 && (
                                    <TimelineConnector
                                        style={{ backgroundColor: "#05AD88", height: "100px" }}
                                    />
                                )}
                            </TimelineSeparator>

                            <TimelineContent

                            >
                                <Typography
                                    className={"mt-1 me-2"}
                                >
                                    <p className={"text-blue text-14"}>
                                        {item.site.site.name}, {item.site.site.address} {item.site.site.geo_codes&&item.site.site.geo_codes.length>0&&<MapIcon onClick={() =>
                                        handleMapModal(item.site.site)} />}

                                    </p>
                                </Typography>

                                <Typography

                                    className="blue-text mt-1"
                                    variant="subtitle1"
                                    component="div">
                                    <Typography variant="caption" component="div">
                                        {moment(item._ts_epoch_ms).format("DD MMM YYYY")}
                                    </Typography>
                                        <OrgComponent
                                        org={item.site.org}
                                    />
                                </Typography>
                            </TimelineContent>
                        </TimelineItem>

                    ))}

                {props.siteTrails
                    .filter((item) => item._relation === "was_located_at")
                    .map((item, index) => <>
                        <TimelineItem >
                            <TimelineOppositeContent sx={{ mt: 7, mr: 2 }}>
                                <DistanceTrailPopOver index={index}  item={item} distanceTrails={props.distanceTrails}  symbol="+"/>
                            </TimelineOppositeContent>

                            <TimelineSeparator>
                                <ArrowCircleUp
                                    style={{
                                        color: "#05AD88",
                                        width: "25px",
                                        height: "25px",
                                    }}
                                />
                                {props.siteTrails.filter(
                                    (item) => item._relation === "was_located_at"
                                ).length >
                                    index + 1 && (
                                    <TimelineConnector
                                        style={{ backgroundColor: "#05AD88", height: "100px" }}
                                    />
                                )}
                            </TimelineSeparator>
                            <TimelineContent  sx={{mt: -0.5}}>
                                <Typography
                                    className="mt-1 me-2"
                                >
                                    <p className={"text-blue text-14"}>
                                        {item.site.site.name}, {item.site.site.address} {item.site.site.geo_codes&&item.site.site.geo_codes.length>0&&  <MapIcon  onClick={() => handleMapModal(item.site.site)} style={{color:"#05AD88"}}/>}

                                    </p>
                                </Typography>

                                <Typography
                                    className="blue-text"
                                    variant="subtitle1"
                                    component="div">
                                    <Typography variant="caption" component="div">
                                        {moment(item._ts_epoch_ms).format("DD MMM YYYY")}
                                       </Typography>
                                        <OrgComponent colorClass="text-blue"
                                                      org={item.site.org}
                                        />

                                </Typography>
                            </TimelineContent>
                        </TimelineItem>

                    </>
                    )}
            </Timeline>

                <>
                    <GlobalDialog

                        size={"lg"}
                        hide={handleMapModal}
                        show={showMap}
                        // heading={"Add new site"}
                    >


                    {/*<Modal*/}
                    {/*    className={"loop-popup"}*/}
                    {/*    aria-labelledby="contained-modal-title-vcenter"*/}
                    {/*    show={showMap}*/}
                    {/*    centered*/}
                    {/*    onHide={handleMapModal}*/}
                    {/*    animation={false}>*/}
                    {/*    <ModalBody>*/}
                    {/*        <div style={{position: "absolute",*/}
                    {/*            right: "5px",top:"5px",zIndex:1}} className=" text-right web-only">*/}
                    {/*            <Close*/}
                    {/*                onClick={()=>{handleMapModal()}}*/}
                    {/*                className="blue-text click-item"*/}
                    {/*                style={{ fontSize: 32 }}*/}
                    {/*            />*/}
                    {/*        </div>*/}




                    {/*        <div className={"row"}>*/}
                        {site && <div className={"col-12"}>
                                    <GoogleMap
                                        width={"100%"}
                                        height={"460px"}
                                        siteId={site._key}
                                        locations={locations}
                                    />
                                </div>}
                    {/*        </div>}*/}
                    {/*    </ModalBody>*/}
                    {/*</Modal>*/}
                    </GlobalDialog>
                </>



        </div>
    );
}




const DistanceTrailPopOver=(props)=>{


    let item=props.item
    let index=props.index
    return(
        <>
            {(props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id)
                &&props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.carbon.carbon_kgs >= 0)
            &&
            <>


                    <Typography
                        // sx={{ mt: 7, me: 2 }}
                        // className={"mt-2 me-2"}
                        // className={"mt-1 me-2"}

                        style={{ opacity: "1" }}>

                        <CustomPopover
                            heading={`Transport Emissions: ${props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.carbon.carbon_kgs.toLocaleString(undefined, {maximumFractionDigits:2})} kgCO<sub>2</sub>e`}

                            text= {<>
                                <span>{`Gross Weight : ${props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.gross_weight_kgs.toLocaleString(undefined, {maximumFractionDigits:2})} kgs`}</span><br></br>
                                {props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.carbon.carbon_kgs > 0 && <>
                                <span>{`Distance : ${(props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.distance.value/1000).toLocaleString(undefined, {maximumFractionDigits:2})} kms`}</span><br></br>
                            <span>{`Transport Mode: ${getMode(props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.transport_mode,props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.carbon.carbon_tons_per_kg_km)}`}</span>
                            <span className="d-none">{`Emissions : ${(props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.carbon.carbon_tons).toLocaleString(undefined, {maximumFractionDigits:6})} tonCO`}<sub>2</sub>e</span><br></br>
                            <span >{`Multiplier : ${(props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.carbon.carbon_tons_per_kg_km).toExponential(4)} tons/kg/km`}</span><br></br>
                                    </>}
                            </>}

                        > <span className={"text-caps  sub-title-text-pink"}>{props.symbol}&nbsp;</span>
                            <span className="text-blue">
                            {props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.carbon.carbon_kgs.toLocaleString(undefined, {maximumFractionDigits:2})} kgCO<sub>2</sub>e</span>
                            <br></br>
                            <span className="text-12"> {(props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.distance.value/1000).toLocaleString(undefined, {maximumFractionDigits:2})} kms&nbsp;
                                {/*in {(props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.duration.value/3600).toLocaleString(undefined, {maximumFractionDigits:2})} hrs */}
                                {props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.carbon.carbon_kgs > 0 && <>via {getMode(props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.transport_mode,props.distanceTrails.find((itemD)=> itemD._to==item.site.site._id).trail.carbon.carbon_tons_per_kg_km)}</>}</span>

                        </CustomPopover>




                    </Typography>



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
    else  if (text.includes(TRANSPORT_MODES[5])) {
        result=result+" Road & Sea"
    }
    else  if (text.includes(TRANSPORT_MODES[6])) {
        result=result+" Road & Rail"
    }
    else  if (text.includes(TRANSPORT_MODES[7])) {
        result=result+" Road & Air"
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




    return  result
}

export default SiteTrailsTimeline;
