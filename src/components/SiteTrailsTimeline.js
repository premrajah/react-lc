import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import Typography from "@mui/material/Typography";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import moment from "moment";
import React, { useEffect, useState } from "react";
import MapIcon from '@mui/icons-material/Place';
import { GoogleMap } from "./Map/MapsContainer";
import { ArrowCircleUp, Circle } from "@mui/icons-material";
import CustomPopover from "./FormsUI/CustomPopover";
import { TRANSPORT_MODES } from "../Util/Constants";
import OrgComponent from "./Org/OrgComponent";
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import GlobalDialog from "./RightBar/GlobalDialog";
import BlueSmallBtn from "./FormsUI/Buttons/BlueSmallBtn";
import { getDateFormat, PreProcessCSVData } from "../Util/GlobalFunctions";



const SiteTrailsTimeline=(props)=> {

    const [showMap, setShowMap] = useState(false);
    const [locations, setLocations] = useState([]);
    const [reverseLocations, setReverseLocations] = useState([]);
    const [site, setSite] = useState(null);
    const [distLookup, setDistLookup] = useState(new Map());

    const handleMapModal = (site) => {
        setTimeout(() => {
            setSite(site);
            setShowMap(!showMap);
            // updateDistLookup();
        }, 500);
    }

    const updateDistLookup = () => {
        const local_dist_lookup = new Map();
        props.distanceTrails.length > 0 && props.distanceTrails.map((item, index) =>
            local_dist_lookup.set(`${item._from}|${item._to}`, item.trail));
        setDistLookup(local_dist_lookup);

    }

    useEffect(() => {
        updateDistLookup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {

        let locationsList = []

        let sites = props.siteTrails

        for (let i = 0; i < sites.length; i++) {

            let site = sites[i].site.site

            try {
                if (site && site.geo_codes && site.geo_codes[0])
                    locationsList.push(
                        {
                            isCenter: false,
                            id: site._key,
                            location: site.geo_codes[0].address_info.geometry.location,
                            name:site.name
                        }
                    )
            } catch (error) {

                console.log(error)
            }

        }


        setLocations(locationsList)

        let revLoc=locationsList.reverse()
        setReverseLocations(revLoc)

    }, [props.siteTrails])


    const genCSV = () => {

        let keys = [
            {key: "name", label: "Name"},
            {key: "address", label: "Address"},
            {key: "company", label: "Company"},
            {key: "distance", label: "Distance (Km)"},
            {key: "emission", label: "Transport Emission (KgC02e)"},
            {key: "date", label: "Date"},
        ]

        let siteTrailsReversed= props.siteTrails

        let csvDataNew = []
        try {
            let index = 0
            for (let  i=(siteTrailsReversed.length-1);i>=0;i-- ) {

                let itemSite=siteTrailsReversed[i]
                const {site, _ts_epoch_ms} = itemSite;
                let itemTmp = []
                itemTmp.push(site.site.name)
                itemTmp.push(site.site.address)
                itemTmp.push(site.org.name)
                if (index > 0) {
                    itemTmp.push(props.distanceTrails[index - 1].trail.distance.value / 1000)
                    itemTmp.push(props.distanceTrails[index - 1].trail.carbon.carbon_kgs)
                } else {
                    itemTmp.push("")
                    itemTmp.push("")
                }

                itemTmp.push(getDateFormat(_ts_epoch_ms))

                csvDataNew.push(itemTmp)
                index += 1
            }
        } catch (e) {
            console.log(e)
        }

        exportToCSV(csvDataNew, keys)

    }
    const exportToCSV = (csvDataTemp, selectedKeysTmp) => {


        try {
            let data = "";
            let tableDataNew = [];
            const rows = csvDataTemp
            let itemTmp = []


            selectedKeysTmp.forEach((item) => {
                itemTmp.push(item.label)
            })
            rows.unshift(itemTmp)

            for (const row of rows) {
                const rowData = [];
                for (const column of row) {
                    rowData.push(PreProcessCSVData(column));
                }
                tableDataNew.push(rowData.join(","));
            }

            data += tableDataNew.join("\n");
            const a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([data], {type: "text/csv"}));
            a.setAttribute("download", `${props.product.name}-${new Date().getDate()}.csv`);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <div className={"text-right"}>
                <BlueSmallBtn
                    title={"Download (CSV)"}
                    type={"submit"}
                    onClick={genCSV}

                />
            </div>

            <div className="d-flex flex-column text-center justify-content-center mt-2">  {
                props.distanceTotals && props.distanceTotals.carbon.carbon_kgs > 0 && <>

                    <span
                        className={" text-label text-blue mb-1 text-label"}>Transport Emissions : {props.distanceTotals.carbon.carbon_kgs.toLocaleString(undefined, {maximumFractionDigits: 2})} kgCO<sub>2</sub>e</span>

                    <span
                        className="text-14"> {(props.distanceTotals.distance.value / 1000).toLocaleString(undefined, {maximumFractionDigits: 2})} kms&nbsp;</span>

                </>
            }
            </div>
            <div>
                <Timeline>

                    {props.siteTrails
                        // .filter((item) => item._relation === "located_at")
                        .map((item, index) => {

                            let local_trail = (index < props.siteTrails.length - 1)
                                ? distLookup.get(`${props.siteTrails[index + 1].site.site._id}|${props.siteTrails[index].site.site._id}`)
                                : null
                            ;

                            return <TimelineItem key={index}>

                                {
                                    local_trail ? <TimelineOppositeContent
                                        sx={{mt: 0, mr: 1,ml:0,p:0}}
                                    >
                                        <DistanceTrailOnlyPopOver index={index} trail={local_trail} symbol="+"/>
                                    </TimelineOppositeContent> :
                                        <TimelineOppositeContent sx={{mt: 0, ml:0,mr: 1,p:0}}><span></span></TimelineOppositeContent>
                                }
                                <TimelineSeparator>
                                    {item._relation === "located_at" ?
                                        <Circle
                                            style={{
                                                color: `${item._relation === "located_at" ? "#27245C" : "#05AD88"}`,
                                                width: "25px",
                                                height: "25px",
                                            }}
                                        />
                                        :

                                        <ArrowCircleUp
                                            style={{
                                                color: "#05AD88",
                                                width: "25px",
                                                height: "25px",
                                            }}
                                        />}
                                    {
                                        local_trail && <TimelineConnector
                                            style={{backgroundColor: "#05AD88", height: "100px"}}
                                        />
                                    }
                                </TimelineSeparator>

                                <TimelineContent
                                    sx={{mt: 0, mr: 0,ml:1,p:0}}
                                >
                                    <Typography
                                        // className={"mt-1 me-2"}
                                    >
                                        <p className="text-blue text-14 text-capitalize">
                                            {item.site.site.name}, {item.site.site.address} {item.site.site.geo_codes && item.site.site.geo_codes.length > 0 &&
                                            <MapIcon
                                                style={{color:`${item._relation === "located_at" ? "#27245C" : "#05AD88"}`}}
                                                onClick={() =>
                                                handleMapModal(item.site.site)}/>}

                                        </p>
                                    </Typography>

                                    <Typography

                                        className="blue-text "
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
                            </TimelineItem>;

                        })}


                </Timeline>
            </div>
            <>
                <GlobalDialog
                    size={"lg"}
                    hide={handleMapModal}
                    show={showMap}
                    // heading={"Add new site"}
                >
                    {site && <div className={"col-12"}>
                        <GoogleMap
                            width={"100%"}
                            height={"460px"}
                            siteId={site._key}
                            locations={reverseLocations}
                        />
                    </div>}

                </GlobalDialog>
            </>


        </>
    );
}

const DistanceTrailOnlyPopOver = (props) => {
    const trail = props.trail;

    return (
        <Typography style={{opacity: "1"}}>

            <CustomPopover
                heading={`Transport Emissions: ${trail.carbon.carbon_kgs.toLocaleString(undefined, {maximumFractionDigits: 2})} kgCO<sub>2</sub>e`}

                text={<>
                    <span>{`Gross Weight : ${trail.gross_weight_kgs.toLocaleString(undefined, {maximumFractionDigits: 2})} kgs`}</span><br></br>
                    {trail.carbon&&trail.carbon.carbon_kgs > 0 && <>
                        <span>{`Distance : ${(trail.distance.value / 1000).toLocaleString(undefined, {maximumFractionDigits: 2})} kms`}</span><br></br>
                        <span>{`Transport Mode: ${getMode(trail.transport_mode, getCarbonE(trail.carbon))}`}</span>
                        <span
                            className="d-none">{`Emissions : ${(trail.carbon.carbon_tons).toLocaleString(undefined, {maximumFractionDigits: 6})} tonCO`}<sub>2</sub>e</span><br></br>
                        <span>{`Multiplier : ${(getCarbonE(trail.carbon)).toExponential(4)} tons/kg/km`}</span><br></br>
                    </>}
                </>}

            >
                {trail.carbon && <>
                      <span className={"text-caps  sub-title-text-pink"}>{props.symbol}&nbsp;</span>
                <span className="text-blue">
                    {trail.carbon.carbon_kgs.toLocaleString(undefined, {maximumFractionDigits: 2})} kgCO<sub>2</sub>e</span>
                <br></br>
                <span
                    className="text-12"> {(trail.distance.value / 1000).toLocaleString(undefined, {maximumFractionDigits: 2})} kms&nbsp;
                    {trail.carbon.carbon_kgs > 0 && <>via {getMode(trail.transport_mode, getCarbonE(trail.carbon))}</>}</span>
                </>}
            </CustomPopover>


        </Typography>
    )
}


const getCarbonE = ( carbonData) => {

    let value=0
    try {
        if (carbonData.carbon_kgs_per_kg_km&&carbonData.carbon_kgs_per_kg_km>0){

            value= carbonData.carbon_kgs_per_kg_km
        }else
            if (carbonData.carbon_tons_per_kg_km&&carbonData.carbon_tons_per_kg_km>0){


            value= Number(carbonData.carbon_tons_per_kg_km)*1000
        }else{
            value= 0
        }
    }catch (e){
        console.log(e)
        // value= 0
    }
return value
}


const getMode = (text, carbon) => {

    let result = ""
    if (text.includes(TRANSPORT_MODES[0])) {
        result = result + " Custom"
        result = ` ${carbon}`
        // if (percentage){
        //     result=` ${carbon}`
        // }

    } else if (text.includes(TRANSPORT_MODES[5])) {
        result = result + " Road & Sea"
    } else if (text.includes(TRANSPORT_MODES[6])) {
        result = result + " Road & Rail"
    } else if (text.includes(TRANSPORT_MODES[7])) {
        result = result + " Road & Air"
    } else if (text.includes(TRANSPORT_MODES[1])) {
        result = result + " Road"
    } else if (text.includes(TRANSPORT_MODES[2])) {
        result = result + " Rail"
    } else if (text.includes(TRANSPORT_MODES[3])) {
        result = result + " Air"
    } else if (text.includes(TRANSPORT_MODES[4])) {
        result = result + " Sea"
    }


    return result
}

export default SiteTrailsTimeline;
