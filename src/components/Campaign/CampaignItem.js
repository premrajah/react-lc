import React, {Component} from "react";
import PlaceholderImg from "../../img/place-holder-lc.png";
import MoreMenu from "../MoreMenu";

import axios from "axios/index";
import {baseUrl, checkImage} from "../../Util/Constants";
import {connect} from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import {Modal, ModalBody} from "react-bootstrap";
import moment from "moment/moment";
import {Link} from "react-router-dom";
import ImageOnlyThumbnail from "../ImageOnlyThumbnail";
import Attachment from "@mui/icons-material/Attachment";
import DescriptionIcon from "@mui/icons-material/Description";
import ErrorBoundary from "../ErrorBoundary";

class CampaignItem extends Component {
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


        if (item.CampaignToMessage && item.CampaignToMessage[0] && item.CampaignToMessage[0].entries
            && item.CampaignToMessage[0].entries[0] && item.CampaignToMessage[0].entries[0].Message) {

            let message=item.CampaignToMessage[0].entries[0].Message

            item.Campaign.message_template=message

            axios
                .get(baseUrl + "message/" + message._key + "/artifact")
                .then(
                    (response) => {
                        var res = response.data.data;

                        item.artifacts=res

                    },
                    (error) => {
                        // var status = error.response.status;
                    }
                );
        }




        this.setState({
            item: this.props.item
        })

    }




    render() {

        const {index} = this.props

        return (
            <ErrorBoundary key={`${index}-error-b`} skip>
                {this.state.item &&
                <tr className="" key={`${index}-row-b`}  role="alert">

                    <td>{index + 1}</td>

                    <td className="d-flex align-items-center">

                        <div className="pl-3 email">
                            <span
                                className={"title-bold text-blue text-capitlize"}>{this.state.item.Campaign.name}</span>
                            <span
                                className={"text-gray-light"}>{moment(this.state.item.Campaign._ts_epoch_ms).format("DD MMM YYYY")}</span>
                        </div>
                    </td>
                    <td className={"text-gray-light"}>{moment(this.state.item.Campaign.start_ts).format("DD MMM YYYY")} - {moment(this.state.item.Campaign.end_ts).format("DD MMM YYYY")}</td>
                    <td className="status text-capitlize"><span
                        className={this.state.item.Campaign.stage === "active" ? "active" : "waiting"}>{this.state.item.Campaign.stage}</span>
                    </td>

                    <td className={""}>
                        <ul className="persons  align-items-start d-flex">

                            {this.state.item.artifacts && this.state.item.artifacts.map((artifact, i) =>
                                <li key={`${index}-${artifact._key}`}>
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

                                  this.props.toggleRightBar({campaign: this.state.item.Campaign})

                              }}> View Details</span>
                    </td>

                </tr>}
            </ErrorBoundary>
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
export default connect(mapStateToProps, mapDispatchToProps)(CampaignItem);
