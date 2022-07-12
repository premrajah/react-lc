import React, {Component} from "react";

import axios from "axios/index";
import {baseUrl, checkImage} from "../../Util/Constants";
import {connect} from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import moment from "moment/moment";
import DescriptionIcon from "@mui/icons-material/Description";
import CustomPopover from "../FormsUI/CustomPopover";
import ActionIconBtn from "../FormsUI/Buttons/ActionIconBtn";
import {Close} from "@mui/icons-material";

class CampaignDraftItem extends Component {
    constructor(props) {
        super(props);

        this.state = {

            artifacts: [],
            item: null,
            message_tempalte: null

        };


    }

    componentDidMount() {

    let item=this.props.item

        // console.log( item.CampaignToMessage[0].entries[0].Message)
        //
        // if (item.CampaignToMessage && item.CampaignToMessage[0] && item.CampaignToMessage[0].entries
        //     && item.CampaignToMessage[0].entries[0] && item.CampaignToMessage[0].entries[0].Message) {
        //
        //     let message=item.CampaignToMessage[0].entries[0].Message
        //
        //     item.Campaign.message_template=message
        //     console.log(item)
        //
        //
        //     axios
        //         .get(baseUrl + "message/" + message._key + "/artifact")
        //         .then(
        //             (response) => {
        //                 var res = response.data.data;
        //
        //
        //                 item.artifacts=res
        //
        //                 console.log(item)
        //
        //
        //             },
        //             (error) => {
        //                 // var status = error.response.status;
        //             }
        //         );
        // }




        this.setState({
            item: this.props.item
        })

    }



    deleteDraftItem=(item)=>{

            axios
                .delete(
                    baseUrl + "org/cache/"+item.key

                )
                .then((res) => {

                    this.props.refresh()
                    this.props.showSnackbar({
                        show: true,
                        severity: "success",
                        message: `Draft deleted successfully. Thanks`
                    })


                })
                .catch((error) => {
                    this.setState({isSubmitButtonPressed: false})
                });



        };





    render() {

        const {index} = this.props

        return (
            <>
                {this.state.item &&
                <tr className="" role="alert" id={`draft-c-${this.state.item.key}`}  key={`draft-c-${this.state.item.key}`}>

                    <td>{index + 1}</td>

                    <td className="d-flex align-items-center">

                        <div className="pl-3 email">
                            <span
                                className={"title-bold text-blue text-capitlize"}>{this.state.item.value.campaign.name}</span>
                            {/*<span*/}
                            {/*    className={"text-gray-light"}>{moment(this.state.item.value.campaign._ts_epoch_ms).format("DD MMM YYYY")}</span>*/}
                        </div>
                    </td>
                    <td className={"text-gray-light"}>{moment(this.state.item.value.campaign.start_ts).format("DD MMM YYYY")} - {moment(this.state.item.value.campaign.end_ts).format("DD MMM YYYY")}</td>
                    <td className="text-gray-light">

                        {moment(this.state.item.value.campaign.createdAt).format("DD MMM YYYY")}
                    </td>

                    <td className={""}>
                        <ul className="persons  align-items-start d-flex">

                            {this.state.item.value.artifacts && this.state.item.value.artifacts.map((artifact, i) =>
                                <li key={i}>
                                    <>
                                    <div className="d-flex justify-content-center "
                                         style={{width: "40px", height: "40px"}}>
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
                    </td>
                    <td>
                        {/*<EditIcon onClick={()=>this.toggleRightBar(item)}  />*/}

                        <span className={"text-bold"} style={{cursor: "pointer"}}
                              onClick={() => {

                                  this.props.toggleRightBar({campaign: this.state.item})

                              }}> View Details</span>
                    </td>
                   <td>
                       <CustomPopover text={"Delete"}>
                           <ActionIconBtn className={"mb-2"}
                                          onClick={()=>this.deleteDraftItem(this.state.item)}
                                          type={"button"}

                           >
                               <Close/>
                           </ActionIconBtn>
                       </CustomPopover>
                   </td>
                </tr>}
            </>
        );


    }
}
const mapStateToProps = (state) => {
    return {
        loginError: state.loginError,
        // cartthis.props.items: state.cartthis.props.items,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
        // abondonCartthis.props.item : state.abondonCartthis.props.item,
        // showNewsletter: state.showNewsletter
        loginPopUpStatus: state.loginPopUpStatus,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        loadProductsWithoutParent: (data) =>
            dispatch(actionCreator.loadProductsWithoutParent(data)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(CampaignDraftItem);
