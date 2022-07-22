import * as React from 'react';
import {Component} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {fetchErrorMessage, getInitials, getTimeFormat} from "../../Util/GlobalFunctions";
import GlobalDialog from "../RightBar/GlobalDialog";
import {baseUrl, checkImage} from "../../Util/Constants";
import DescriptionIcon from "@mui/icons-material/Description";
import ActionIconBtn from "../FormsUI/Buttons/ActionIconBtn";
import {Delete, Done, Edit, FactCheck} from "@mui/icons-material";
import EventForm from "./EventForm";
import axios from "axios";
import EventStatus from "./EventStatus";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import BlueBorderButton from "../FormsUI/Buttons/BlueBorderButton";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";

class EventItem extends Component {
        constructor(props) {
            super(props);

            this.state = {
                date:null,
                highlightedDays:[1,2,15],
                events:[],
                calendarEvents:[],
                showEvent:false,
                showEditEvent:false,
                selectedEvent:null,
                editEvent:null,
                stageEventId:null,
                showStagePopup:false,
                deleteEvent:false,
                intervals:[
                    {key:86400 ,value:"Every Day"},
                    {key:604800 ,value:"Every Week"},
                    {key:864000,value:"Every 10 Days"},
                    {key:2629743 ,value:"Every Month"},
                    {key:31556926 ,value:"Every Year"},
                ],
            }
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
    showEditEventPopup=(item)=>{
        this.setState({

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


    getEvent=(eventId,type)=>{


        let url=`${baseUrl}event/${eventId}`
        axios
            // .get(baseUrl + "site/" + encodeUrl(data) + "/expand"
            .get(url)
            .then(
                (response) => {

                    var responseAll = response.data.data;


                    if (type=="edit")
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

    deleteEvent=(eventId,type)=>{



        let url=`${baseUrl}event/${eventId}`
        axios
            // .get(baseUrl + "site/" + encodeUrl(data) + "/expand"
            .delete(url)
            .then(
                (response) => {

                    this.props.refresh()

                    this.props.showSnackbar({
                        show: true,
                        severity: "success",
                        message:   "Event deleted successfully. Thanks"
                    })

                },
                (error) => {
                    // this.setState({
                    //     notFound: true,
                    // });

                    this.props.showSnackbar({show: true, severity: "error", message: fetchErrorMessage(error)})

                }
            );



    }


    componentDidMount() {
            if (this.props.statusChange){

            }
    }


    render() {


            return (

                <>
        <List sx={{ width: '100%', maxWidth: 360 }}>


            {this.props.events.map(item=>

                <>
                    <ListItem className={`mb-2 bg-white  ${item.event.resolution_epoch_ms > Date.now()?"new-event":"past-event"}`}  onClick={()=>this.showEventPopup(item)} alignItems="flex-start">
                        {!this.props.smallView &&
                        <ListItemAvatar>
                            <Avatar alt={getInitials(item.event.title)} src="/static/images/avatar/1.jpg" />
                        </ListItemAvatar>}
                        <ListItemText
                            className="title-bold"
                            primary={item.event.title}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                       <span className="text-capitalize"> {item.event.process}, {item.event.stage}</span>
                                    </Typography>
                                    <div className="mb-0">{item.event.description}</div>
                                    <div className="text-gray-light text-12 ">{getTimeFormat(item.event.resolution_epoch_ms)}</div>


                                        <div className="d-flex flex-column right-btn-auto">
                                            {item.event.resolution_epoch_ms > Date.now() &&
                                            <ActionIconBtn
                                        size="small"

                                        onClick={(e)=>{
                                            e.stopPropagation()
                                            e.preventDefault()
                                           this.showEditEventPopup(item)
                                        }}><Edit /></ActionIconBtn>}

                                    <ActionIconBtn
                                        size="small"

                                    onClick={(e)=>{
                                    e.stopPropagation()
                                    e.preventDefault()
                                    this.showStageEventPopup(item.event._key)
                                }}><FactCheck/>
                                </ActionIconBtn>

                                            <ActionIconBtn
                                                size="small"
                                                onClick={(e)=>{
                                                    e.stopPropagation()
                                                    e.preventDefault()
                                                    this.toggleDelete(item.event._key)
                                                }}><Delete/>
                                            </ActionIconBtn>
                                        </div>

                                </React.Fragment>
                            }
                        />
                    </ListItem>
                    {/*<Divider variant="inset" component="li" />*/}
                </>
            )}


        </List>


                    <GlobalDialog

                        heading={this.state.selectedEvent&&this.state.selectedEvent.event?this.state.selectedEvent.event.title:null}
                        show={this.state.showEvent}
                        hide={this.showEventPopup}
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
                                        {this.state.selectedEvent.event.recur_in_epoch_ms &&  <div className={"col-6"}>
                                            <p
                                                style={{ fontSize: "18px" }}
                                                className=" text-bold text-blue mb-1">
                                                Recurring Interval
                                            </p>
                                            <p
                                                style={{ fontSize: "18px" }}
                                                className="text-gray-light  mb-1">
                                                {/*{*/}
                                                {/*   getTimeFormat( this.state.selectedEvent.event.recur_in_epoch_ms)*/}
                                                {/*}*/}

                                                {this.state.intervals.find(item=> item.key==this.state.selectedEvent.event.recur_in_epoch_ms).value}
                                            </p>
                                        </div>}

                                    </div>
                                    <div className="row  justify-content-start search-container  pb-2">
                                        <div className={"col-12"}>
                                            <p
                                                style={{ fontSize: "18px" }}
                                                className=" text-bold text-blue mb-1">
                                                Product
                                            </p>
                                            <p
                                                style={{ fontSize: "18px" }}
                                                className="text-gray-light  mb-1">
                                                {
                                                    this.state.selectedEvent.product.product.name
                                                }
                                            </p>
                                        </div>
                                        <div className={"col-6"}>
                                            <p
                                                style={{ fontSize: "18px" }}
                                                className=" text-bold text-blue mb-1">
                                                Attachments
                                            </p>
                                            <div
                                                style={{ fontSize: "18px" }}
                                                className="text-gray-light  mb-1">
                                                <ul style={{listStyle:"none"}} className="persons p-0 m-0 align-items-start d-flex">

                                                    {this.state.selectedEvent.artifacts && this.state.selectedEvent.artifacts.map((artifact, i) =>
                                                        <li key={i}>
                                                            <>
                                                                <div className="d-flex justify-content-center "
                                                                     style={{width: "32px", height: "32px"}}>
                                                                    <div className="d-flex justify-content-center "
                                                                        // style={{width: "50%", height: "50%"}}
                                                                    >


                                                                        {checkImage(artifact.blob_url)? <img
                                                                                src={artifact ? artifact.blob_url : ""}
                                                                                className="img-fluid "
                                                                                alt={artifact.name}
                                                                                style={{ objectFit: "contain",width: "32px", height: "32px",background:"#EAEAEF",padding:"2px"}}
                                                                            />:
                                                                            <>
                                                                                <DescriptionIcon style={{ opacity:"0.5", fontSize:" 2.2rem"}} className={" p-1 rad-4"} />
                                                                                {/*<Attachment style={{color:"27245c", background:"#eee", borderRadius:"50%", padding:"2px"}}  />*/}
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
                                                className={"col-6 pr-1"}
                                                style={{
                                                    textAlign: "center",
                                                }}>
                                                <GreenButton
                                                    onClick={() => this.deleteEvent(this.state.selectedEvent.event._key)}
                                                    title={"Delete"}
                                                    type={"submit"}></GreenButton>
                                            </div>
                                            <div
                                                className={"col-6 pl-1"}
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
                        {this.state.editEvent && <EventForm  hide={this.showEditEventPopup} event={this.state.editEvent} />}
                        </div>
                    </GlobalDialog>


                    <GlobalDialog
                        heading={"Update Stage"}
                        show={this.state.showStagePopup}
                        hide={this.showStageEventPopup}
                    ><div className={"col-12"}>
                        <EventStatus hide={this.showStageEventPopup} eventId={this.state.stageEventId}/>

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

export default  connect(mapStateToProps, mapDispachToProps)(EventItem);
