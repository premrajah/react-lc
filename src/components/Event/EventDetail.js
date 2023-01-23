import * as React from 'react';
import {Component} from 'react';
import {fetchErrorMessage, getTimeFormat, LoaderAnimated} from "../../Util/GlobalFunctions";
import {baseUrl, checkImage, RECUR_UNITS} from "../../Util/Constants";
import DescriptionIcon from "@mui/icons-material/Description";
import axios from "axios";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import ProductExpandItemNew from "../Products/ProductExpandItemNew";
import SubproductItem from "../Products/Item/SubproductItem";
import TransitionTimeline from "./TransitionTimeline";

class EventDetail extends Component {
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
                event:null,
                intervals:[
                    {key:86400000 ,value:"Every Day"},
                    {key:604800000 ,value:"Every Week"},
                    {key:864000000,value:"Every 10 Days"},
                    {key:2629743000 ,value:"Every Month"},
                    {key:31556926000 ,value:"Every Year"},
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




    getEvent=(eventId)=>{


        let url=`${baseUrl}event/${eventId}`
        axios.get(url)
            .then(
                (response) => {

                    let responseAll = response.data.data;



                        this.setState({
                            event:responseAll,
                        })


                },
                (error) => {
                    // this.setState({
                    //     notFound: true,
                    // });
                }
            );



    }



    downloadDoc=(blob_url) =>{


        window.location.href = blob_url

    }


    componentDidUpdate(prevProps, prevState, snapshot) {

            if (this.props!=prevProps){
                this.getEvent(this.props.eventId)
            }
    }

    componentDidMount() {

            if (this.props.eventId){
                this.getEvent(this.props.eventId)
            }


    }


    render() {


            return (

                <>
                    {this.state.event ?
                    <div className={"col-12"}>
                            <div className={"bg-white  rad-8  "}>
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
                                                    this.state.event.event.description
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
                                                    this.state.event.event.process
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
                                                    this.state.event.event.stage
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
                                                    getTimeFormat(this.state.event.event.resolution_epoch_ms)
                                                }
                                            </p>
                                        </div>


                                        {this.state.event.event.recur &&this.state.event.event.recur.value&&this.state.event.event.recur.unit &&
                                        <div className={"col-6"}>
                                            <p
                                                style={{ fontSize: "18px" }}
                                                className=" text-bold text-blue mb-1">
                                                Recurring Interval
                                            </p>
                                            <p
                                                style={{ fontSize: "18px" }}
                                                className="text-gray-light  mb-1">

                                                {this.state.event.event.recur.value} {RECUR_UNITS.find(item=> item.key==this.state.event.event.recur.unit).value}
                                            </p>
                                        </div>}

                                    </div>
                                    <div className="row  justify-content-start search-container  pb-2">

                                        <p
                                            style={{ fontSize: "18px" }}
                                            className=" text-bold text-blue mb-1">
                                            Product
                                        </p>
                                        <SubproductItem hideMoreMenu hideDate smallImage={true} productId={this.state.event.product.product._key} />

                                        <div className={"col-6"}>
                                            {this.state.event.artifacts.length>0&&   <p
                                                style={{ fontSize: "18px" }}
                                                className=" text-bold text-blue mb-1">
                                                Attachments
                                            </p>}
                                            <div
                                                style={{ fontSize: "18px" }}
                                                className="text-gray-light  mb-1">
                                                <ul style={{listStyle:"none"}} className="persons p-0 m-0 align-items-start d-flex">

                                                    {this.state.event.artifacts && this.state.event.artifacts.map((artifact, i) =>
                                                        <li key={i}>
                                                            <>
                                                                <div className="d-flex justify-content-center "
                                                                     style={{width: "32px", height: "32px"}}>
                                                                    <div className="d-flex justify-content-center "
                                                                        // style={{width: "50%", height: "50%"}}
                                                                    >


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
                            </div>
                        </div>

                    :<LoaderAnimated/>
                    }

                        {/*<TransitionTimeline />*/}
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

export default  connect(mapStateToProps, mapDispachToProps)(EventDetail);
