import React, {useState} from "react";
import {createMarkup} from "../../Util/Constants";
import moment from "moment/moment";
import {Divider, ImageList, ImageListItem} from "@mui/material";
import {Link} from "react-router-dom";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import SubproductItem from "../Products/Item/SubproductItem";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import BlueBorderButton from "../FormsUI/Buttons/BlueBorderButton";
import GlobalDialog from "../RightBar/GlobalDialog";
import {connect} from "react-redux";

const LC_PURPLE = "#27245C";
const LC_PINK = "#D31169";

const MessengerMessageTwoMessageBubble = ({m, userDetail}) => {

    const [showEntity, setShowEntity] = useState(false);
    const [entityObj, setEntityObj] = useState({});

    const toggleEntity = async (entity, entityType) => {

        setShowEntity(!showEntity);
        setEntityObj({ entity: entity, type: entityType });
    };

    const handleWhoseMessage = (o, index) => {
        if(o.actor === "message_to") {
            if(o.org.org._id.toLowerCase() === userDetail.orgId.toLowerCase()) {
                return LC_PINK;
            }
        }

        return LC_PURPLE;
    }

    return <div className="w-75 p-2 mb-2 chat-msg-box border-rounded text-blue gray-border messenger-message-bubble">
        <div className="row">
            <div className="col">
                {m && m.orgs.map((o, index) => o.actor === "message_from" && <div key={index} className="d-flex justify-content-between">
                    <small className="text-mute" style={{"color": `${
                        (m.orgs.map((o, i) => handleWhoseMessage(o, i)).filter((s) => s === LC_PINK).length > 0) ? LC_PINK : LC_PURPLE
                    }`}}>{o.org.org.name}</small>
                    <small className="text-mute">{moment(m.message._ts_epoch_ms).fromNow()}</small>
                </div> )}
            </div>
        </div>

        <div className="row mt-2 mb-2">
            <div className="col">
                <div
                    dangerouslySetInnerHTML={createMarkup(
                        m ? m.message.text : ""
                    )} style={{lineHeight: '0.8'}} />
            </div>
        </div>

        {(m.message.entity_as_json && m.message.entity_type === "Product") && <div className="row mt-3 mb-2">
            <div className="col">
                <div style={{borderBottom: "1px solid rgba(0,0,0,0.1)" }} />
            </div>
        </div>}

        <div className="row">
            <div className="col">
                {m.message && <div className="d-flex">
                    {m.message.entity_type === "Product" && <div className="mr-2 text-mute">{m.message.entity_type}</div>}
                    {m.message.entity_as_json && <div className="text-pink">
                        <div onClick={() => toggleEntity(m.message.entity_as_json, m.message.entity_type)}>
                            {m.message.entity_as_json.name}
                        </div>
                    </div>}
                </div>}
            </div>
        </div>

        {m.artifacts.length > 0 && <div className="row">
            <div className="col">
                <Stack direction="row" spacing={2}>
                    {m.artifacts.map((item) => (<div key={`${item._ts_epoch_ms}_${item._key}`} style={{cursor: "pointer"}}>
                        <a href={item.blob_url} target="_blank" rel="noreferrer">
                            <Avatar
                            alt={item.name}
                            src={item.blob_url}
                            sx={{ width: 56, height: 56 }}
                            variant="square"
                            />
                        </a>
                    </div>))}
                </Stack>
            </div>
        </div>}

        <GlobalDialog
            size="sm"
            hide={() => toggleEntity(null, null)}
            show={showEntity}
            heading={entityObj ? entityObj.type : ""}>
            <>
                <div className="col-12 ">
                    {entityObj && entityObj.type === "Product" && (
                        <SubproductItem
                            hideMoreMenu
                            smallImage={true}
                            item={entityObj.entity}
                        />
                    )}
                </div>
                <div className="col-12 d-none ">
                    <div className="row mt-4 no-gutters">
                        <div
                            className={"col-6 pr-1"}
                            style={{
                                textAlign: "center",
                            }}>
                            <GreenButton
                                title="View Details"
                                type="submit" />
                        </div>
                        <div
                            className={"col-6 pl-1"}
                            style={{
                                textAlign: "center",
                            }}>
                            <BlueBorderButton
                                type="button"
                                title={"Close"}
                                onClick={() => toggleEntity(null, null)} />
                        </div>
                    </div>
                </div>
            </>
        </GlobalDialog>

    </div>
}

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        userDetail: state.userDetail,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};


export default connect(mapStateToProps, mapDispatchToProps)(MessengerMessageTwoMessageBubble);