import React, {useState} from "react";
import {baseUrl} from "../../Util/Constants";
import moment from "moment/moment";
import {Link} from "react-router-dom";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import SubproductItem from "../Products/Item/SubproductItem";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import BlueBorderButton from "../FormsUI/Buttons/BlueBorderButton";
import GlobalDialog from "../RightBar/GlobalDialog";
import {connect} from "react-redux";
import axios from "axios/index";
import * as actionCreator from "../../store/actions/actions";
import {Description} from "@mui/icons-material";
import CustomPopover from "../FormsUI/CustomPopover";
import {checkIfDocumentFromType, linkifyText} from "../../Util/GlobalFunctions";
import Done from '@mui/icons-material/Done';
import DoneAll from '@mui/icons-material/DoneAll';

const LC_PURPLE = "#27245C";
const LC_PINK = "#D31169";

const MessengerChatBox = ({ m, userDetail, showSnackbar }) => {
    const [showEntity, setShowEntity] = useState(false);
    const [entityObj, setEntityObj] = useState({});
    const [matchData, setMatchData] = useState(null);

    const toggleEntity = async (entity, entityType) => {
        setShowEntity(!showEntity);
        setEntityObj({ entity: entity, type: entityType });
    };

    const handleWhoseMessage = (o, index) => {
        if (o.actor === "message_to") {
            if (o.org.org._id.toLowerCase() === userDetail.orgId.toLowerCase()) {
                return LC_PINK;
            }
        }

        return LC_PURPLE;
    };

    const handleMatchClicked = (message) => {
        getMatch(message.entity_as_json._key);
    };

    const getMatch = (key) => {
        if (!key) return;
        setMatchData(null);
        axios
            .get(`${baseUrl}match/${key}`)
            .then((res) => {
                const data = res.data.data;
                setMatchData(data);
            })
            .catch((error) => {
                showSnackbar({ show: true, severity: "warning", message: `${error.message}` });
            });
    };

    return (
        <div className="w-75 p-2 mb-2 position-relative chat-msg-box border-rounded text-blue gray-border messenger-message-bubble">

            {(m&&m.orgs&&m.orgs.filter(orgItem=> orgItem.actor=="message_from"&&orgItem.org.org._id===userDetail.orgId).length>0)&&<span className="float-bottom-right-seen">
            <SeenData orgs={m&&m.orgs?m.orgs:[]}

            />
            </span>}

            <div className="row">
                <div className="col">
                    {m &&
                    m.orgs&&m.orgs.map(
                            (o, index) =>
                                o.actor === "message_from" && (
                                    <div key={index} className="d-flex justify-content-between">
                                        <small
                                            className="text-mute"
                                            style={{
                                                color: `${
                                                    m.orgs&&m.orgs
                                                        .map((o, i) => handleWhoseMessage(o, i))
                                                        .filter((s) => s === LC_PINK).length > 0
                                                        ? LC_PINK
                                                        : LC_PURPLE
                                                }`,
                                            }}>
                                            {o.org.org.name}
                                        </small>
                                        <small className="text-mute">
                                            {moment(m.message._ts_epoch_ms).fromNow()}
                                        </small>
                                    </div>
                                )
                        )}
                </div>
            </div>

            <div className="row mt-2 mb-2">
                <div className="col">
                    <div>

                        {m.message &&   <div
                            // dangerouslySetInnerHTML={(createMarkup(m ? linkifyText(m.message.text) : ""))}
                            dangerouslySetInnerHTML={{
                                __html: linkifyText(m.message.text) .replace(/href/g, "target='_blank' href")
                            }}
                            style={{ lineHeight: "0.8" }}
                        />}


                    </div>

                </div>
            </div>

            {m.message&&m.message.entity_as_json && m.message.entity_type === "Product" && (
                <div className="row mt-3 mb-2">
                    <div className="col">
                        <div style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }} />
                    </div>
                </div>
            )}

            <div className="row">
                <div className="col">
                    {m.message && (
                        <div className="d-flex">
                            {m.message.entity_type === "Product" && (
                                <div>
                                    <div className="d-flex">
                                        <div className="me-2 text-mute">
                                            {m.message.entity_type}
                                        </div>
                                        <div className="text-pink" style={{ cursor: "pointer" }}>
                                            <div
                                                onClick={() =>
                                                    toggleEntity(
                                                        m.message.entity_as_json,
                                                        m.message.entity_type
                                                    )
                                                }>
                                                {m.message.entity_as_json.name}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {m.message.entity_type === "Match" && (
                                <div className="w-100">
                                    <div className="d-flex">
                                        <div className="me-2 text-mute">
                                            {m.message.entity_type}
                                        </div>
                                        <div
                                            className="text-pink"
                                            onClick={() => handleMatchClicked(m.message)}
                                            style={{ cursor: "pointer" }}>
                                            click to get match details
                                        </div>
                                    </div>
                                    {matchData && <div className="mb-3">
                                        {(matchData.listing && matchData.search) && matchData.listing.org._id.toLowerCase() ===
                                        userDetail.orgId.toLowerCase() ?
                                            matchData && <Link to={`/${matchData.listing.listing._key}`}>
                                                Go to Listing
                                            </Link>
                                            :
                                            matchData &&
                                            <Link to={`/search/${matchData && matchData.search.search._key}`}>
                                                Go to Search
                                            </Link>
                                        }

                                        {matchData && matchData.listing && <SubproductItem hideMoreMenu smallImage noLinking item={matchData.listing.product} />}

                                    </div>}
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </div>

            {m.artifacts&&m.artifacts.length > 0 && (
                <div className="row">
                    <div className="col">
                        <Stack direction="row" spacing={2}>
                            {m.artifacts.map((item) => (
                                <div
                                    key={`${item._ts_epoch_ms}_${item._key}`}
                                    style={{ cursor: "pointer" }}>
                                    <a href={item.blob_url} target="_blank" rel="noreferrer">

                                        {checkIfDocumentFromType(item.mime_type)?<CustomPopover text={item.name}>
                                            <Description
                                            alt={item.name}
                                            style={{
                                                fontSize: 56,
                                                color: "#ccc",
                                                margin: "auto",
                                            }}
                                        />
                                        </CustomPopover>:
                                            <CustomPopover text={item.name}>
                                                <Avatar
                                            alt={item.name}
                                            src={item.blob_url}
                                            sx={{ width: 56, height: 56 }}
                                            variant="square"
                                        />
                                            </CustomPopover>
                                        }



                                    </a>
                                </div>
                            ))}
                        </Stack>
                    </div>
                </div>
            )}

            <GlobalDialog
                size="sm"
                hide={() => toggleEntity(null, null)}
                show={showEntity}
                heading={entityObj ? entityObj.type : ""}>
                <>
                    {/*  for Product */}
                    {entityObj && entityObj.type === "Product" && (
                        <div className="col-12 ">
                            <SubproductItem
                                hideMoreMenu
                                smallImage={true}
                                item={entityObj.entity}
                            />
                        </div>
                    )}

                    {/* for match  */}
                    {entityObj && entityObj.type === "Match" && (
                        <div>
                            {matchData.length > 0 && (
                                <div className="row">
                                    <div className="col">
                                        {JSON.stringify(matchData)}
                                        <SubproductItem
                                            hideMoreMenu
                                            smallImage
                                            item={matchData.listing.product}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="col-12 d-none ">
                        <div className="row mt-4 no-gutters">
                            <div
                                className={"col-6 pe-1"}
                                style={{
                                    textAlign: "center",
                                }}>
                                <GreenButton title="View Details" type="submit" />
                            </div>
                            <div
                                className={"col-6 ps-1"}
                                style={{
                                    textAlign: "center",
                                }}>
                                <BlueBorderButton
                                    type="button"
                                    title={"Close"}
                                    onClick={() => toggleEntity(null, null)}
                                />
                            </div>
                        </div>
                    </div>
                </>
            </GlobalDialog>
        </div>
    );
};



const SeenData=(props)=>{

                let totalOrgs=props.orgs.filter(orgItem=> orgItem.actor==="message_to")
                let orgsSeen=props.orgs.filter(orgItem=> orgItem.actor==="message_to"&&orgItem.read_flag)
    let seenStatus=0  // 0- no seen,1 atleast one seen, 2 - all seen


    if (totalOrgs.length>orgsSeen.length){
        if (orgsSeen.length===0){
            seenStatus=0
        }else{
            seenStatus=1
        }
    }else{
        seenStatus=2
    }


    let seenText=""

        orgsSeen.map((org,index)=> {

        seenText=`${seenText}${index>0?", ":""}${org.org.org.name}`
        })

    return (
        <>
        {totalOrgs.length>0
            ?<>

          <CustomPopover text={seenText}>  <>
            {seenStatus===2&&<DoneAll fontSize={"small"}  style={{color:"var(--lc-green)"}}/>}
            {seenStatus===1&&<DoneAll fontSize={"small"} style={{color:"var(--lc-light-gray)"}}/>}
          </>
          </CustomPopover>

            {seenStatus===0&&<Done fontSize={"small"} style={{color:"var(--lc-light-gray)"}}/>}
            </>:""}
</>
    )

                }


const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        userDetail: state.userDetail,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MessengerChatBox);
