import React, { useState } from "react";
import { baseUrl, createMarkup } from "../../Util/Constants";
import moment from "moment/moment";
import { Divider, ImageList, ImageListItem } from "@mui/material";
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import SubproductItem from "../Products/Item/SubproductItem";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import BlueBorderButton from "../FormsUI/Buttons/BlueBorderButton";
import GlobalDialog from "../RightBar/GlobalDialog";
import { connect } from "react-redux";
import axios from "axios/index";
import * as actionCreator from "../../store/actions/actions";
import {Description} from "@mui/icons-material";
import CustomPopover from "../FormsUI/CustomPopover";

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
        <div className="w-75 p-2 mb-2 chat-msg-box border-rounded text-blue gray-border messenger-message-bubble">
            <div className="row">
                <div className="col">
                    {m &&
                        m.orgs.map(
                            (o, index) =>
                                o.actor === "message_from" && (
                                    <div key={index} className="d-flex justify-content-between">
                                        <small
                                            className="text-mute"
                                            style={{
                                                color: `${
                                                    m.orgs
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
                    <div
                        dangerouslySetInnerHTML={createMarkup(m ? m.message.text : "")}
                        style={{ lineHeight: "0.8" }}
                    />
                </div>
            </div>

            {m.message.entity_as_json && m.message.entity_type === "Product" && (
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
                                <div>
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

            {m.artifacts.length > 0 && (
                <div className="row">
                    <div className="col">
                        <Stack direction="row" spacing={2}>
                            {m.artifacts.map((item) => (
                                <div
                                    key={`${item._ts_epoch_ms}_${item._key}`}
                                    style={{ cursor: "pointer" }}>
                                    <a href={item.blob_url} target="_blank" rel="noreferrer">
                                        {/*<Avatar*/}
                                        {/*    alt={item.name}*/}
                                        {/*    src={item.blob_url}*/}
                                        {/*    sx={{ width: 56, height: 56 }}*/}
                                        {/*    variant="square"*/}
                                        {/*/>*/}
<CustomPopover text={item.name}>
                                        <Description
                                            alt={item.name}
                                            style={{
                                                fontSize: 56,
                                                color: "#ccc",
                                                margin: "auto",
                                            }}
                                        />
</CustomPopover>
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
