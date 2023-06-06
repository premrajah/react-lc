import * as React from 'react';
import {Component} from 'react';
import List from '@mui/material/List';
import {fetchErrorMessage, getTimeFormat} from "../../Util/GlobalFunctions";
import GlobalDialog from "../RightBar/GlobalDialog";
import {baseUrl, checkImage, RECUR_UNITS} from "../../Util/Constants";
import DescriptionIcon from "@mui/icons-material/Description";
import EventForm from "./EventForm";
import axios from "axios";
import EventStatus from "./EventStatus";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import BlueBorderButton from "../FormsUI/Buttons/BlueBorderButton";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import SubproductItem from "../Products/Item/SubproductItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DownloadIcon from "@mui/icons-material/GetApp";

import BlueSmallBtn from "../FormsUI/Buttons/BlueSmallBtn";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import CustomizedInput from "../FormsUI/ProductForm/CustomizedInput";
import moment from "moment";
import {createEvents} from "ics";
import EventReleaseDialog from "./EventReleaseDialog";
import {DesktopDatePicker} from "@mui/x-date-pickers";
import EventItem from "./EventItem";
import ErrorBoundary from "../ErrorBoundary";

class EventList extends Component {
        constructor(props) {
            super(props);

            this.state = {
                date:null,
                fields:{},
                loadingEventsDownload:false,
                minEndDate:null,
                maxEndDate:null,
                maxStartDate:null,
                minStartDate:null,
                highlightedDays:[1,2,15],
                events:[],
                endDate:null,
                startDate:null,
                calendarEvents:[],
                showEvent:false,
                showEditEvent:false,
                selectedEvent:null,
                editEvent:null,
                stageEventId:null,
                showStagePopup:false,
                deleteEvent:false,
                csvData:[],
                downloadType:null,
                showDownload:false,
                showReleaseDialog:false,
                releaseEvent:null,
                allowDateChange:false,
                intervals:[
                    {key:86400000 ,value:"Every Day"},
                    {key:604800000 ,value:"Every Week"},
                    {key:864000000,value:"Every 10 Days"},
                    {key:2629743000 ,value:"Every Month"},
                    {key:31556926000 ,value:"Every Year"},
                ],
            }
        }



    toggleReleaseDialog=()=>{

        this.setState({

            showReleaseDialog:!this.state.showReleaseDialog
        })
    }
    toggleDelete=(eventId)=>{

        if (eventId)
            this.getEvent(eventId,"delete")

        else{
            this.setState({
                    selectedEvent:null
                })
            }


        this.setState({
            // selectedEvent:item,
            deleteEvent:!this.state.deleteEvent
        })
    }

    showDownloadPopup=(item)=>{
        this.setState({
            // selectedEvent:item,
            showDownload:!this.state.showDownload
        })

    }

    showEventPopup=(item)=>{
            this.setState({
                // selectedEvent:item,
                showEvent:!this.state.showEvent
            })

        if (item)
            this.getEvent(item.event._key,"show")
        else{
            this.setState({
                selectedEvent:null
            })
        }
    }
    showEditEventPopup=(item, dateChange)=>{


        this.setState({
            allowDateChange:dateChange,
            showEditEvent:!this.state.showEditEvent
        })


        if (item)
        this.getEvent(item.event._key,"edit")
        else{
            this.setState({
                editEvent:null
            })
        }
    }


    showStageEventPopup=(stageEventId)=>{
        this.setState({
            stageEventId:stageEventId,
            showStagePopup:!this.state.showStagePopup
        })

        if (stageEventId)
        {

        }
        else{
            this.setState({
                stageEventId:null
            })
        }
    }



    handleChangeDate(value,field ) {


        if (field==="startDate"){
            this.setState({
                startDate:value,
                minEndDate: moment(value).add(1, "day").toDate()
            })


        }
        if (field==="endDate"){
            this.setState({
                endDate:value,
                maxStartDate: moment(value).add(-1, "day").toDate()
            })
        }



        // let fields = this.state.fields;
        // fields[field] = value;
        // this.setState({ fields });




    }


    getEvent=(eventId,type)=>{


        let url=`${baseUrl}event/${eventId}`
        axios
            // .get(baseUrl + "site/" + encodeUrl(data) + "/expand"
            .get(url)
            .then(
                (response) => {

                    var responseAll = response.data.data;


                    if (type==="edit")
                    this.setState({
                        editEvent:responseAll,
                    })

                    else{
                        this.setState({
                            selectedEvent:responseAll,
                        })

                    }

                },
                (error) => {
                    // this.setState({
                    //     notFound: true,
                    // });
                }
            );



    }

    handleSaveCSV = () => {


        const csvData = [];
        this.props.events.forEach(item => {
            const {product, event, service_agent} = item;



             csvData.push([
                event.title,
                 product.product.name,
                event.stage,
                event.process,
                getTimeFormat(event.resolution_epoch_ms),
                event.recur_in_epoch_ms?this.state.intervals.find((item)=> item.key=== event.recur_in_epoch_ms).value:"",
                 event.recur?event.recur.value:"",
                 event.recur?event.recur.unit:"",
                event.description,

            ])
        })

        this.setState({
            csvData
        })
    }


     fetchEventsPageWise =  ( url, offset,size,type) => {
        axios
            .get(url)
            .then(
                (response) => {


                    this.setState({
                        events:this.state.events.concat(response.data.data)
                    })

                    if (response.data.data.length === size) {
                        this.getEvents( offset + size,type);
                    }else{


                         this.downloadCustomEvent(type,this.state.events)

                    }
                },
                (error) => {

                }
            );
    };



     getEvents = async ( offset,type) => {

         this.setState({
             downloadType:type
         })
         this.setState({
             loadingEventsDownload:true,

         })

        let url = `${baseUrl}event/expand?`
         let size=10


        if (this.state.startDate) {
            url = `${url}resolv_start=${(moment(this.state.startDate).startOf("day").format("x") - 10)}`;
        }
        if (this.state.endDate) {
            url = `${url}&resolv_end=${(moment(this.state.endDate).endOf("day").format("x"))}`;
        }

        url = `${url}&offset=${offset}&size=${size}`;

          this.fetchEventsPageWise(url, offset,size,type);

    };



      getRule=(event)=>{


          if (event.recur&&event.recur.value&&event.recur.unit){


              let unit=event.recur.unit==="DAY"?"DAILY":event.recur.unit==="WEEK"?"WEEKLY":event.recur.unit==="MONTH"?"MONTHLY": event.recur.unit==="YEAR"?"YEARLY":""


              return `FREQ=${unit};INTERVAL=${event.recur.value};UNTIL=${moment(event.recur_until_epoch_ms).format("YYYYMMDD")}`

          }else{
              return ""
          }

    }

    downloadCustomEvent= async (type,events) => {



        if (type==="csv"){
            let csvDataNew = [];
            events.forEach(item => {
                const {product, event, service_agent} = item;

                csvDataNew.push([
                    event.title,
                    event.stage,
                    event.process,
                    getTimeFormat(event.resolution_epoch_ms),
                    event.recur_in_epoch_ms?this.state.intervals.find((item)=> item.key=== event.recur_in_epoch_ms).value:"",
                    event.recur?event.recur.value:"",
                    event.recur?event.recur.unit:"",
                    event.description,
                    product.product?product.product.name:"",
                ])
            })
            this.exportToCSV(csvDataNew)
        }else if (type="ics"){

            let icsDataNew = [];
            this.state.events.forEach(item => {
                const {product, event, service_agent} = item;
                icsDataNew.push({
                    // start: [
                    //     getTimeFormat(event.resolution_epoch_ms)] ,
                    start:[moment(event.resolution_epoch_ms).toDate().getFullYear(), moment(event.resolution_epoch_ms).toDate().getMonth()+1, moment(event.resolution_epoch_ms).toDate().getDate(), 9, 0],
                    title:  event.title,
                    description:  event.description,
                    categories:[event.process],
                    recurrenceRule:this.getRule(event),
                    // end:[moment(event.recur_until_epoch_ms).toDate().getFullYear(), moment(event.recur_until_epoch_ms).toDate().getMonth()+1, moment(event.recur_until_epoch_ms).toDate().getDate(), 9, 0],

                    // url: i.url
                })
            })


            createEvents(icsDataNew, (err, value) => {
                if (err) {
                    console.log(err);
                    return;
                }

                // window.open("data:text/calendar;charset=utf8," + escape(value));

                const a = document.createElement("a");
                a.href = URL.createObjectURL(new Blob([value], { type: "data:text/calendar;charset=utf8" }));
                a.setAttribute("download", `event_list_${new Date().getDate()}.ics`);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);


            });

            this.setState({
                loadingEventsDownload:false
            })

        }

    }


    exportToCSV=(csvData) =>{

        let data = "";
        let tableDataNew = [];


        const rows=csvData
         rows.unshift(["Title","Stage","Process","Resolution Date","Recur (MS)","Recur Value","Recur Unit", "Description", "Product"])

        for (const row of rows) {
            const rowData = [];
            for (const column of row) {
                rowData.push(column);
            }
            tableDataNew.push(rowData.join(","));
        }

        data += tableDataNew.join("\n");
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([data], { type: "text/csv" }));
        a.setAttribute("download", `event_list_${new Date().getDate()}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        this.setState({
            loadingEventsDownload:false
        })
    }


     menuAction = (action,dateChange) => {

        if(action.value === 'delete') {
           // this.deleteEvents()
            this.toggleDelete(action.data)
        }
        else if(action.value === 'edit') {

            this.showEditEventPopup(action.data,dateChange)
        }
        else if(action.value === 'update') {
            this.showStageEventPopup(action.data)
        }
        else if(action.value === 'release') {

            this.setState({
                releaseEvent:action.data
            })
            this.toggleReleaseDialog()
        }
    }

    deleteEvents=(eventId,type)=>{



        let url=`${baseUrl}event/${eventId}`
        axios
            .delete(url)
            .then(
                (response) => {

                    this.props.refresh()

                    this.props.showSnackbar({
                        show: true,
                        severity: "success",
                        message:   "Event deleted successfully. Thanks"
                    })

                    this.toggleDelete()

                },
                (error) => {

                    this.props.showSnackbar({show: true, severity: "error", message: fetchErrorMessage(error)})

                }
            );



    }

    downloadDoc=(blob_url) =>{
        window.location.href = blob_url
    }


    componentDidMount() {

    }


    render() {

        const headers = ["Title","Stage","Process","Resolution Date","Recur (MS)","Recur Value","Recur Unit", "Description", "Product"];

            return (

                <>


                    <div className="d-flex mt-4 justify-content-between">
                        {this.props.events.length > 0 ?
                            <>
                            <span className="">
                                    {this.props.events.length} {this.props.events.length > 1 ? "Events" : "Event"}
                                </span>



                            </>
                            :
                            <>{!this.props.loading && <div className={``}>No Events exist</div>}</>
                        }



                        <span  className={`${this.props.events.length===0?"d-none":""}`}>
                            {this.props.smallView &&
                                <>
                                    <DownloadIcon

                                                onClick={()=>{
                                                    this.downloadCustomEvent("csv",this.props.events)
                                                }}
                                                className="click-item"

                                                style={{fontSize:"20px"}} />
                                            Download</>}

                                         <FormControlLabel
                                             value="all"
                                             onChange={this.props.handleChangeSwitch}

                                             control={<Switch
                                                 color="primary"   />}
                                             label="Show All"
                                             labelPlacement="start"
                                         />
                                    </span>
                    </div>
        <List sx={{ width: '100%' }}>


            {this.props.events.filter(item=> item.event.stage!=="resolved").map(item=>

                <>
                    <ErrorBoundary skip >
                    <EventItem
                        item={item}
                        smallView={this.props.smallView}
                        showEventPopup={()=>this.showEventPopup(item)}
                        triggerCallback={(action,dateChange) => this.menuAction(action,dateChange)}
                    />
                    </ErrorBoundary>

                </>
            )}
            {this.props.events.filter(item=> item.event.stage==="resolved").map(item=>

                <ErrorBoundary skip>
<EventItem
    item={item}
    smallView={this.props.smallView}
    showEventPopup={()=>this.showEventPopup(item)}


    showEditEventPopup={(dateChange)=>
    {

        this.showEditEventPopup(item,dateChange)
    }}

    showStageEventPopup={(e)=>{
        e.stopPropagation()
        e.preventDefault()
        this.showStageEventPopup(item.event._key)
    }}

    toggleDelete={(e)=>{
        e.stopPropagation()
        e.preventDefault()
        this.toggleDelete(item.event._key)
    }}
/>
                    {/*<ListItem className={`mb-2 bg-white*/}
                    {/* ${item.event.stage !=="resolved"?"new-event":"past-event"}`}*/}
                    {/*          onClick={()=>this.showEventPopup(item)} alignItems="flex-start">*/}
                    {/*    {!this.props.smallView &&*/}
                    {/*    <ListItemAvatar>*/}
                    {/*        <Avatar className={`${item.event.stage==='resolved'?"fc-event-disabled":"fc-event-" + item.event.process}`} alt={getInitials(item.event.title)} src="/static/images/avatar/1.jpg" />*/}
                    {/*    </ListItemAvatar>}*/}
                    {/*    <ListItemText*/}
                    {/*        className="title-bold"*/}
                    {/*        primary={*/}
                    {/*            item.event.stage==="resolved"?<del>{item.event.title}</del>:*/}
                    {/*                item.event.title*/}
                    {/*        }*/}

                    {/*        secondary={*/}
                    {/*            <React.Fragment>*/}
                    {/*                <Typography*/}
                    {/*                    sx={{ display: 'inline' }}*/}
                    {/*                    component="span"*/}
                    {/*                    variant="body2"*/}
                    {/*                    color="text.primary"*/}
                    {/*                >*/}
                    {/*                    <span className="text-capitalize"> {item.event.process}, {item.event.stage}</span>*/}
                    {/*                </Typography>*/}
                    {/*                <div className="mb-0">*/}
                    {/*                    {item.event.description}*/}

                    {/*                </div>*/}
                    {/*                <div className="text-gray-light text-12 ">{getTimeFormat(item.event.resolution_epoch_ms)}</div>*/}

                    {/*                {item.event.stage!=='resolved'   &&*/}
                    {/*                <div className="d-flex flex-column  right-btn-auto">*/}


                    {/*                    /!*{item.event.resolution_epoch_ms > Date.now() &&*!/*/}
                    {/*                    <CustomPopover text={"Edit"}>*/}
                    {/*                        <ActionIconBtn*/}
                    {/*                            size="small"*/}

                    {/*                            onClick={(e)=>{*/}
                    {/*                                e.stopPropagation()*/}
                    {/*                                e.preventDefault()*/}
                    {/*                                this.showEditEventPopup(item)*/}
                    {/*                            }}><Edit /></ActionIconBtn>*/}
                    {/*                    </CustomPopover>*/}
                    {/*                    /!*}*!/*/}
                    {/*                    <CustomPopover text={"Update Stage"}>*/}
                    {/*                        <ActionIconBtn*/}
                    {/*                            size="small"*/}

                    {/*                            onClick={(e)=>{*/}
                    {/*                                e.stopPropagation()*/}
                    {/*                                e.preventDefault()*/}
                    {/*                                this.showStageEventPopup(item.event._key)*/}
                    {/*                            }}*/}
                    {/*                        ><FactCheck/>*/}
                    {/*                        </ActionIconBtn>*/}
                    {/*                    </CustomPopover>*/}
                    {/*                    <CustomPopover text={"Delete"}>*/}
                    {/*                        <ActionIconBtn*/}
                    {/*                            size="small"*/}
                    {/*                            onClick={(e)=>{*/}
                    {/*                                e.stopPropagation()*/}
                    {/*                                e.preventDefault()*/}
                    {/*                                this.toggleDelete(item.event._key)*/}
                    {/*                            }}><Close/>*/}
                    {/*                        </ActionIconBtn>*/}
                    {/*                    </CustomPopover>*/}
                    {/*                </div>}*/}

                    {/*            </React.Fragment>*/}
                    {/*        }*/}
                    {/*    />*/}
                    {/*</ListItem>*/}

                </ErrorBoundary>
            )}

        </List>

                    {this.state.showReleaseDialog &&
                    <EventReleaseDialog hide={this.toggleReleaseDialog} item={this.state.releaseEvent}
                                        showReleaseProduct={this.state.showReleaseDialog} />
                    }

                    <GlobalDialog

                        heading={this.state.selectedEvent&&this.state.selectedEvent.event?this.state.selectedEvent.event.title:null}
                        show={this.state.showEvent}
                        hide={this.showEventPopup}
                        size={"md"}
                    >
                        <div className={"col-12"}>
                            <div className={"bg-white  rad-8  "}>

                                {this.state.selectedEvent &&
                                <>
                                    <div className="row  justify-content-start search-container  pb-2">
                                        <div className={"col-12"}>
                                            <p
                                                style={{ fontSize: "18px" }}
                                                className=" text-bold text-blue mb-1">
                                                Description
                                            </p>
                                            <p
                                                style={{ fontSize: "18px" }}
                                                className="text-gray-light  mb-1">
                                                {
                                                    this.state.selectedEvent.event.description
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row  justify-content-start search-container  pb-2">
                                        <div className={"col-6"}>
                                            <p
                                                style={{ fontSize: "18px" }}
                                                className=" text-bold text-blue mb-1">
                                                Process
                                            </p>
                                            <p
                                                style={{ fontSize: "18px" }}
                                                className="text-gray-light text-capitalize  mb-1">
                                                {
                                                    this.state.selectedEvent.event.process
                                                }
                                            </p>
                                        </div>
                                        <div className={"col-6"}>
                                            <p
                                                style={{ fontSize: "18px" }}
                                                className=" text-bold text-blue mb-1">
                                                Stage
                                            </p>
                                            <p
                                                style={{ fontSize: "18px" }}
                                                className="text-gray-light text-capitalize mb-1">
                                                {
                                                    this.state.selectedEvent.event.stage
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row  justify-content-start search-container  pb-2">
                                        <div className={"col-6"}>
                                            <p
                                                style={{ fontSize: "18px" }}
                                                className=" text-bold text-blue mb-1">
                                                Date of resolution
                                            </p>
                                            <p
                                                style={{ fontSize: "18px" }}
                                                className="text-gray-light  mb-1">
                                                {
                                                    getTimeFormat(this.state.selectedEvent.event.resolution_epoch_ms)
                                                }
                                            </p>
                                        </div>
                                        {this.state.selectedEvent.event.recur &&this.state.selectedEvent.event.recur.value&&this.state.selectedEvent.event.recur.unit &&
                                        <div className={"col-6"}>
                                            <p
                                                style={{ fontSize: "18px" }}
                                                className=" text-bold text-blue mb-1">
                                                Recurring Interval
                                            </p>
                                            <p
                                                style={{ fontSize: "18px" }}
                                                className="text-gray-light  mb-1">

                                                {this.state.selectedEvent.event.recur.value} {RECUR_UNITS.find(item=> item.key===this.state.selectedEvent.event.recur.unit).value}
                                            </p>
                                        </div>}

                                    </div>
                                    <div className="row  justify-content-start search-container  pb-2">

                                            <p
                                                style={{ fontSize: "18px" }}
                                                className=" text-bold text-blue mb-1">
                                                Product
                                            </p>
                                        <SubproductItem hideMoreMenu
                                                        hideDate
                                                        smallImage={true}
                                                               productId={this.state.selectedEvent.product.product._key} />


                                        {/*</div>*/}
                                        <div className={"col-6"}>
                                            {this.state.selectedEvent.artifacts.length>0&&     <p
                                                style={{ fontSize: "18px" }}
                                                className=" text-bold text-blue mb-1">
                                                Attachments
                                            </p>}
                                            <div
                                                style={{ fontSize: "18px" }}
                                                className="text-gray-light  mb-1">
                                                <ul style={{listStyle:"none"}} className="persons p-0 m-0 align-items-start d-flex">

                                                    {this.state.selectedEvent.artifacts && this.state.selectedEvent.artifacts.map((artifact, i) =>
                                                        <li key={i}>
                                                            <>
                                                                <div className="d-flex justify-content-center "
                                                                     style={{width: "32px", height: "32px"}}>
                                                                    <div className="d-flex justify-content-center ">


                                                                        {checkImage(artifact.blob_url)? <img
                                                                                src={artifact ? artifact.blob_url : ""}
                                                                                onClick={()=>this.downloadDoc(artifact.blob_url)}
                                                                                className="img-fluid click-item"
                                                                                alt={artifact.name}
                                                                                style={{ objectFit: "contain",width: "32px", height: "32px",background:"#EAEAEF",padding:"2px"}}
                                                                            />:
                                                                            <>
                                                                                <DescriptionIcon
                                                                                    onClick={()=>this.downloadDoc(artifact.blob_url)}
                                                                                    style={{ opacity:"0.5", fontSize:" 2.2rem"}} className={" p-1 rad-4"} />

                                                                            </>
                                                                        }

                                                                    </div>
                                                                </div>

                                                            </>
                                                        </li>
                                                    )}

                                                </ul>
                                            </div>
                                        </div>

                                    </div>
                                    </>
                                    }



                            </div>
                        </div>

                    </GlobalDialog>


                    <GlobalDialog

                        heading={this.state.selectedEvent&&this.state.selectedEvent.event?"Delete "+this.state.selectedEvent.event.title:null}
                        show={this.state.deleteEvent}
                        hide={this.toggleDelete}
                    >
                        <div className={"col-12"}>
                            <div className={"bg-white  rad-8  "}>

                                {this.state.selectedEvent &&
                                <>

                                    <div className="col-12 ">
                                        <div className="row mt-4 no-gutters">
                                            <div
                                                className={"col-6 pe-1"}
                                                style={{
                                                    textAlign: "center",
                                                }}>
                                                <GreenButton
                                                    onClick={() => this.deleteEvents(this.state.selectedEvent.event._key)}
                                                    title={"Delete"}
                                                    type={"submit"}></GreenButton>
                                            </div>
                                            <div
                                                className={"col-6 ps-1"}
                                                style={{
                                                    textAlign: "center",
                                                }}>
                                                <BlueBorderButton
                                                    type="button"
                                                    title={"Cancel"}
                                                    onClick={() => this.toggleDelete()}></BlueBorderButton>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                }



                            </div>
                        </div>

                    </GlobalDialog>

                    <GlobalDialog
                        heading={this.state.editEvent?this.state.editEvent.event.title:null}
                        show={this.state.showEditEvent}
                        hide={this.showEditEventPopup}
                    ><div className={"col-12"}>
                        {this.state.editEvent && <EventForm edit
                                                            allowDateChange={this.state.allowDateChange}
                                                            hide={()=>{

                            this.props.refresh(this.state.editEvent.event.resolution_epoch_ms)
                            this.showEditEventPopup();


                        }} event={this.state.editEvent} />}
                        </div>
                    </GlobalDialog>


                    <GlobalDialog
                        size={"md"}
                        heading={"Update Stage"}
                        show={this.state.showStagePopup}
                        hide={this.showStageEventPopup}
                    >
                        <div className={"col-12"}>
                            {this.state.showStagePopup&&
                            <EventStatus hide={this.showStageEventPopup} eventId={this.state.stageEventId}/>
                            }

                    </div>
                    </GlobalDialog>




                    <GlobalDialog

                        heading={"Download"}
                        show={this.props.showDownload}
                        hide={this.props.hide}
                        size={"sm"}
                    >
                        <div className={"col-12 "}>

                            <div className="row  mt-2">
                                <div className="col-6 ">
                                    <div
                                        className={
                                            "custom-label text-bold text-blue "
                                        }>
                                         From
                                    </div>

                                    <LocalizationProvider dateAdapter={AdapterDateFns}>

                                        <DesktopDatePicker

                                            className={"full-width-field"}
                                            disableHighlightToday={true}
                                            maxDate={this.state.maxStartDate}
                                            // label="Required By"
                                            inputVariant="outlined"
                                            variant={"outlined"}
                                            margin="normal"
                                            id="date-picker-dialog-1"
                                            inputFormat="dd/MM/yyyy"
                                            value={this.state.startDate}
                                            renderInput=   {({ inputRef, inputProps, InputProps }) => (
                                                <div className="custom-calander-container">
                                                    <CustomizedInput ref={inputRef} {...inputProps} />
                                                    <span className="custom-calander-icon">{InputProps?.endAdornment}</span>
                                                </div>
                                            )}
                                            // renderInput={(params) => <CustomizedInput {...params} />}
                                            onChange={(value)=>this.handleChangeDate(value,"startDate")}

                                        />
                                    </LocalizationProvider>

                                    {this.state.showFieldErrors&&this.state.startDateError && <span style={{color:"#f44336",fontSize:"0.75rem!important"}} className='text-danger'>{"Required"}</span>}

                                </div>

                                <div className="col-6  ">

                                    <div
                                        className={
                                            "custom-label text-bold text-blue "
                                        }>
                                       To
                                    </div>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>

                                        <DesktopDatePicker
                                            disableHighlightToday={true}
                                            minDate={this.state.minEndDate}
                                            inputVariant="outlined"
                                            variant={"outlined"}
                                            margin="normal"
                                            id="date-picker-dialog"
                                            inputFormat="dd/MM/yyyy"
                                            value={this.state.endDate}
                                            renderInput=   {({ inputRef, inputProps, InputProps }) => (
                                                <div className="custom-calander-container">
                                                    <CustomizedInput ref={inputRef} {...inputProps} />
                                                    <span className="custom-calander-icon">{InputProps?.endAdornment}</span>
                                                </div>
                                            )}
                                            // renderInput={(params) => <CustomizedInput {...params} />}
                                            onChange={(value)=>this.handleChangeDate(value,"endDate")}
                                        />
                                    </LocalizationProvider>
                                    {this.state.showFieldErrors&&this.state.endDateError && <span style={{color:"#f44336",fontSize:"0.75rem!important"}} className='text-danger'>{"Required"}</span>}

                                </div>
                            </div>
                            <div className="row justify-content-center mt-4">
                                <div className="d-flex justify-content-center col-6">


                                    <BlueSmallBtn loading={this.state.loadingEventsDownload&&(this.state.downloadType==="csv")}
                                                  disabled={this.state.loadingEventsDownload&&(this.state.downloadType==="csv")} title={"Download CSV"}

                                                  onClick={()=>{

                                        this.setState({
                                            events:[]
                                        })
                                        if (this.state.startDate&&this.state.endDate){
                                            this.getEvents(0,"csv");
                                        }else{
                                        }}

                                    } >
                                        <DownloadIcon  style={{fontSize:"20px"}} /></BlueSmallBtn>

                                </div>
                                <div className="d-flex justify-content-center col-6">


                                    <BlueSmallBtn
                                        loading={this.state.loadingEventsDownload&&(this.state.downloadType==="ics")}
                                        disabled={this.state.loadingEventsDownload&&(this.state.downloadType==="ics")} title={"Download Calendar"}
                                        onClick={()=>{
                                        this.setState({
                                            events:[]
                                        })
                                        if (this.state.startDate&&this.state.endDate){
                                            this.getEvents(0,"ics");
                                        }else{
                                        }

                                    }

                                    } >
                                        <DownloadIcon  style={{fontSize:"20px"}} /></BlueSmallBtn>

                                </div>
                            </div>

                        </div>
                    </GlobalDialog>

                    </>
            );
        }
    }



const mapStateToProps = (state) => {
    return {

    };
};

const mapDispachToProps = (dispatch) => {
    return {

        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),


    };
};

export default  connect(mapStateToProps, mapDispachToProps)(EventList);
