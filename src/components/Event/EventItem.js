import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {getInitials, getTimeFormat} from "../../Util/GlobalFunctions";
import {Component} from "react";
import GlobalDialog from "../RightBar/GlobalDialog";
import moment from "moment/moment";
import {checkImage} from "../../Util/Constants";
import DescriptionIcon from "@mui/icons-material/Description";
import ActionIconBtn from "../FormsUI/Buttons/ActionIconBtn";
import {Edit} from "@mui/icons-material";
import EventForm from "./EventForm";

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
                editEvent:null
            }
        }


    showEventPopup=(item)=>{
            this.setState({
                selectedEvent:item,
                showEvent:!this.state.showEvent
            })
    }
    showEditEventPopup=(item)=>{
        this.setState({
            editEvent:item,
            showEditEvent:!this.state.showEditEvent
        })
    }

        render() {


            return (

                <>
        <List sx={{ width: '100%', maxWidth: 360 }}>


            {this.props.events.map(item=>

                <>
                    <ListItem className="mb-2 bg-white"  onClick={()=>this.showEventPopup(item)} alignItems="flex-start">
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

                                    <ActionIconBtn
                                        className="ml-4 right-btn"
                                        onClick={(e)=>{
                                            e.stopPropagation()
                                            e.preventDefault()
                                           this.showEditEventPopup(item)
                                        }}><Edit/></ActionIconBtn>
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                    {/*<Divider variant="inset" component="li" />*/}
                </>
            )}


        </List>


                    <GlobalDialog

                        heading={this.state.selectedEvent?this.state.selectedEvent.event.title:null}
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
                                        <div className={"col-6"}>
                                            <p
                                                style={{ fontSize: "18px" }}
                                                className=" text-bold text-blue mb-1">
                                                Recurring Interval
                                            </p>
                                            <p
                                                style={{ fontSize: "18px" }}
                                                className="text-gray-light  mb-1">
                                                {
                                                   getTimeFormat( this.state.selectedEvent.event.resolution_epoch_ms)
                                                }
                                            </p>
                                        </div>

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
                                                <ul style={{listStyle:"none"}} className="persons  align-items-start d-flex">

                                                    {this.state.selectedEvent.artifacts && this.state.selectedEvent.artifacts.map((artifact, i) =>
                                                        <li key={i}>
                                                            <>
                                                                <div className="d-flex justify-content-center "
                                                                     style={{width: "80px", height: "80px"}}>
                                                                    <div className="d-flex justify-content-center "
                                                                        // style={{width: "50%", height: "50%"}}
                                                                    >


                                                                        {checkImage(artifact.blob_url)? <img
                                                                                src={artifact ? artifact.blob_url : ""}
                                                                                className="img-fluid "
                                                                                alt={artifact.name}
                                                                                style={{ objectFit: "contain",width: "80px", height: "80px",background:"#EAEAEF",padding:"2px"}}
                                                                            />:
                                                                            <>
                                                                                <DescriptionIcon style={{background:"#EAEAEF", opacity:"0.5", fontSize:" 2.2rem"}} className={" p-1 rad-4"} />
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
                        heading={this.state.editEvent?this.state.editEvent.event.title:null}
                        show={this.state.showEditEvent}
                        hide={this.showEditEventPopup}
                    ><div className={"col-12"}>
                        {this.state.editEvent && <EventForm  hide={this.showEditEventPopup} event={this.state.editEvent} />}
                        </div>
                    </GlobalDialog>


                    </>
            );
        }
    }


    export default EventItem;
