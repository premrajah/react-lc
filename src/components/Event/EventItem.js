import * as React from 'react';
import {Component} from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {getInitials, getTimeFormat} from "../../Util/GlobalFunctions";
import {baseUrl} from "../../Util/Constants";
import ActionIconBtn from "../FormsUI/Buttons/ActionIconBtn";
import {Close, Edit, FactCheck} from "@mui/icons-material";
import axios from "axios";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import CustomPopover from "../FormsUI/CustomPopover";
import CustomMoreMenu from "../FormsUI/CustomMoreMenu";
import ErrorBoundary from "../ErrorBoundary";

class EventItem extends Component {
        constructor(props) {
            super(props);

            this.state = {

                ocVC:null,
                allowStageChange:false,
                allowDateChange:false,
                allowEdit:false,
                actions:[],

            }
        }

    componentDidUpdate(prevProps, prevState, snapshot) {
          if (this.props!==prevProps){

          }
    }

    componentDidMount() {

          if (this.props.item)
            this.getEVENT_OCVC(this.props.item.event._key)
    }
    getEVENT_OCVC = (Id) => {

        axios
            .get(`${baseUrl}event/${Id}/oc-vc`)
            .then((res) => {
                const data = res.data.data;
                // setProductOCVC(data);
                this.setState({
                    ocVC:data
                })


                if (data){

                    let actions=[]
                    if (data.visibility_context) {

                        if (data.visibility_context["allow_event_general_edit"]) {


                            actions.push( {label:"Edit",value:"edit",data: this.props.item},)
                        }
                        if (data.visibility_context["allow_event_stage_change"]) {

                            actions.push( {label:"Update Stage",value:"update",data:this.props.item.event._key})
                        }
                        if (data.visibility_context["allow_event_date_change"]) {


                            this.setState({
                                allowDateChange:true
                            })

                        }

                    }

                    if (data.ownership_context) {

                        if (data.ownership_context["is_owner"]) {


                            actions.push({label:"Release",value:"release",data:this.props.item})
                            actions.push(  {label:"Delete",value:"delete",data:this.props.item.event._key})
                        }
                        if (data.ownership_context["is_event_for"]) {


                            actions.push({label:"Release",value:"release",data:this.props.item})
                        }
                        if (data.ownership_context["is_action_for"]) {


                            actions.push({label:"Release",value:"release",data:this.props.item})
                        }
                    }


                    this.setState({
                        actions:actions
                    })
                }
            })
            .catch((e) => {
                console.log("event oc-vc error ", e);
            });
    };


    render() {

          const {item}=this.props

            return <ErrorBoundary skip>
                    <ListItem className={`mb-2 bg-white ${item.event.stage !=="resolved"?"new-event":"past-event"}`}
                              onClick={this.props.showEventPopup} alignItems="flex-start">
                        {!this.props.smallView &&
                        <ListItemAvatar>
                            <Avatar className={`${item.event.stage==='resolved'?"fc-event-disabled":"fc-event-" + item.event.process}`} alt={getInitials(item.event.title)} src="/static/images/avatar/1.jpg" />
                        </ListItemAvatar>}
                        <ListItemText
                            className="title-bold"
                            primary={
                                item.event.stage==="resolved"?<del>{item.event.title}</del>:
                                        item.event.title
                                }

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
                                    <div className="mb-0">
                                        {item.event.description}

                                    </div>
                                    <div className="text-gray-light text-12 ">{getTimeFormat(item.event.resolution_epoch_ms)}</div>
                                    <div className="d-flex  flex-column right-btn-auto">
                                        {this.state.actions.length>0&&<CustomMoreMenu
                                        actions={this.state.actions}
                                        triggerCallback={(action)=>this.props.triggerCallback(action,this.state.allowDateChange)}
                                    />}
                                    </div>
                                    {item.event.stage!=='resolved'   &&
                                    <div className="d-flex d-none flex-column right-btn-auto">
                                            {/*{item.event.resolution_epoch_ms > Date.now() &&*/}
                                            <CustomPopover text={"Edit"}>
                                                <ActionIconBtn
                                        size="small"

                                        onClick={()=>{  this.props.showEditEventPopup(this.state.allowDateChange)}}><Edit /></ActionIconBtn>
                                            </CustomPopover>
                                                {/*}*/}
                                            <CustomPopover text={"Update Stage"}>
                                    <ActionIconBtn
                                        size="small"

                                    onClick={this.props.showStageEventPopup}><FactCheck/>
                                </ActionIconBtn>
                                            </CustomPopover>
                                            <CustomPopover text={"Delete"}>
                                            <ActionIconBtn
                                                size="small"
                                                onClick={
                                                    this.props.toggleDelete
                                                }><Close/>
                                            </ActionIconBtn>
                                            </CustomPopover>
                                        </div>}

                                </React.Fragment>
                            }
                        />
                    </ListItem>

                </ErrorBoundary>


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
