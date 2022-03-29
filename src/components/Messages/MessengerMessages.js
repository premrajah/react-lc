import React, { Component } from "react";
import axios from "axios";
import { baseUrl, createMarkup } from "../../Util/Constants";
import { connect } from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import { TextField, Tooltip } from "@mui/material";
import { Autocomplete } from "@mui/material";
import AddIcon from "@mui/icons-material/AddCircle";
import ExplicitIcon from "@mui/icons-material/Explicit";
import SendIcon from "@mui/icons-material/Send";
import moment from "moment/moment";
import WysiwygEditor from "./WysiwygEditor";
import MessageGroupItem from "./MessageGroupItem";
import MessageNameThumbnail from "./MessageNameThumbnail";
import { sortArraysByKey } from "../../Util/GlobalFunctions";
import GlobalDialog from "../RightBar/GlobalDialog";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import BlueBorderButton from "../FormsUI/Buttons/BlueBorderButton";
import SubproductItem from "../Products/Item/SubproductItem";
import DescriptionIcon from "@mui/icons-material/Description";
import MoreMenu from "../MoreMenu";

class MessengerMessages extends Component {
    constructor(props) {
        super(props);
        this.messagesEndRef = React.createRef();
        this.resetDraftRef = React.createRef();

        this.state = {
            open: false,
            selectOrgs: [],
            selectedOrgs: [],
            newMsgOrgs: [],
            allOrgs: [],
            allMessageGroups: [],
            filteredMessageGroups: [],
            autoCompleteOrg: "",
            userOrg: "",
            selectedMsgGroup: [],
            selectedItem: -1,
            selectedGroupId: null,
            selectedGroupKey: null,
            messageText: ",",
            showHideGroupFilter: false,
            showHideOrgSearch: false,
            openEntityDialog: false,
            openSingleArtifactDialog: false,
            allGroupsDetails: [],
            msgLoading: false,
            entityObj: {},
            showEntity: false,
        };
    }

    componentDidMount() {
        this.getAllMessageGroups();
        this.updateSelected(0);
    }

    getAllMessageGroups = async () => {
        axios
            .get(`${baseUrl}message-group`)
            .then((response) => {
                const data = response.data.data;

                let returnedData = [];

                data.map((d, index) => {
                    axios
                        .get(`${baseUrl}seek/to?name=MessageGroup&id=${d._key}&to=Message&relation=&count=true&filters=type:message`)
                        .then((res) => {
                            const rData = res.data.data;

                            if (rData > 0) {
                                let group = d;

                                group.index = index;

                                returnedData.push(group);

                                let sortedData = sortArraysByKey(returnedData, "index");

                                this.setState({
                                    allMessageGroups: sortedData,
                                    filteredMessageGroups: sortedData,
                                });

                                this.getOrgsForGroup(d._key, index);
                            }
                        })
                        .catch((error) => {
                            // this.props.showSnackbar({
                            //     show: true,
                            //     severity: "warning",
                            //     message: `Message data check error ${error.message}`,
                            // });
                        });
                });
            })
            .catch((error) => {
                // this.props.showSnackbar({
                //     show: true,
                //     severity: "warning",
                //     message: `Message group error ${error.message}`,
                // });
            });
    };

    getOrgsForGroup = (id, index) => {
        axios
            .get(`${baseUrl}message-group/${id}/org`)
            .then((response) => {
                const data = response.data.data;

                let groupDetail = data;

                let allGroups = this.state.allMessageGroups;

                if (index == 0) {
                    this.handleGroupClick(this.state.allMessageGroups[0]._key, [], 0);
                    this.setState({
                        selectedOrgs: groupDetail,
                    });

                    this.getGroupMessageWithId(this.state.allMessageGroups[0]._key);
                }

                for (let i = 0; i < allGroups.length; i++) {
                    if (allGroups[i]._key == id) {
                        allGroups[i].group = groupDetail;

                        allGroups[i].search = " " + groupDetail.map((item) => item.name + " ");
                    }
                }

                this.setState({
                    allMessageGroups: allGroups,
                    filteredMessageGroups: allGroups,
                });
            })
            .catch((error) => {
                console.log("message-group-error ", error.message);
            });
    };

    toggleEntity = async (entity, entityType) => {
        this.setState({
            showEntity: !this.state.showEntity,
            entityObj: { entity: entity, type: entityType },
        });
    };

    processMessages = (messages) => {
        let processedMessages = [];

        for (let i = 0; i < messages.length; i++) {
            let completeMessage = messages[i];
            let messageObj = completeMessage.message;

            const text = messageObj.text;
            const time = messageObj._ts_epoch_ms;

            let orgFrom = completeMessage.orgs.find((item) => item.actor === "message_from");

            let orgName = orgFrom.org.org.name;

            let isOwner = orgFrom.org.org._id === this.props.userDetail.orgId ? true : false;

            processedMessages.push({
                text: text,
                time: time,
                orgName: orgName,
                isOwner: isOwner,
                artifacts: completeMessage.artifacts,
                entityType: messageObj.entity_type,
                entityAsJson: messageObj.entity_as_json ? messageObj.entity_as_json : null,
                entityKey: messageObj.entity_key,
            });
        }

        return processedMessages;
    };

    getGroupMessageWithId = (id) => {
        if (!id) {
            this.setState({
                selectedMsgGroup: [],
            });
            return;
        }

        this.setState({
            msgLoading: true,
        });
        axios
            .get(`${baseUrl}message-group/${id}/message`)

            .then((response) => {
                let processedMessages = this.processMessages(response.data.data);

                this.setState({
                    selectedMsgGroup: processedMessages,
                });
            })
            .catch((error) => {
                // this.props.showSnackbar({
                //     show: true,
                //     severity: "warning",
                //     message: `Group message error ${error.message}`,
                // });
            })
            .finally(() => {
                this.setState({
                    msgLoading: false,
                });
            });
    };

    handleEntityDialogOpen = () => {
        this.setState({
            openEntityDialog: true,
        });
    };

    handleEntityDialogClose = (value) => {
        this.setState({
            openEntityDialog: false,
        });
    };

    handleSingleArtifactDialogOpen = () => {
        this.setState({
            openSingleArtifactDialog: true,
        });
    };
    handleSingleArtifactDialogClose = () => {
        this.setState({
            openSingleArtifactDialog: false,
        });
    };

    handleNewMessageSelectAsync = async (inputValue) => {
        try {
            const result = await axios.get(`${baseUrl}org/search?o=0&s=20&q=${inputValue}`);
            const data = result.data.data;

            this.setState({
                selectOrgs: data.orgs,
            });
        } catch (error) {
            // this.props.showSnackbar({
            //     show: true,
            //     severity: "warning",
            //     message: `Org search error ${error.message}`,
            // });
        }
    };

    filterGroups = (e) => {
        const { value } = e.target;

        if (value) {
            this.updateSelected(-1);

            if (this.state.allGroupsDetails) {
                this.setState({
                    filteredMessageGroups: this.state.allMessageGroups.filter((group) =>
                        group.search.toLowerCase().includes(value.toLowerCase())
                    ),
                });
            }
        } else {
            this.setState({
                filteredMessageGroups: this.state.allMessageGroups,
            });
        }
    };
    handleReactAsyncOnChange = (e) => {
        const { value, options } = e.target;

        if (value) {
            this.handleNewMessageSelectAsync(value);

            this.setState({});
        }
    };

    handleFilterGroups = (e, value) => {
        this.setState({
            autoCompleteOrg: value,
        });
    };

    callBackResult = (action, key, blob_url) => {
        if (action === "edit") {
            this.props.toggleEditMode();
        }
    };

    handleGroupClick = (groupdId, orgs, selectedIndex, showLoading) => {
        this.updateSelected(selectedIndex);

        if (groupdId) {
            this.setState({
                selectedIndex: selectedIndex,
                selectedGroupId: groupdId,
                selectedGroupKey: groupdId,
                showHideOrgSearch: false,
                showHideGroupFilter: false,
            });

            if (showLoading)
                this.setState({
                    selectedMsgGroup: [],
                });

            this.getGroupMessageWithId(groupdId);

            this.setState({
                selectedOrgs: orgs,
            });
        } else {
            this.getGroupMessageWithId(null);
            this.setState({
                selectedOrgs: [],
            });
        }
    };

    handleRichTextCallback = (value) => {
        this.setState({
            messageText: value,
        });
    };

    handleOrgSearchButton = () => {
        this.setState({
            showHideOrgSearch: !this.state.showHideOrgSearch,
        });

        this.handleGroupClick(null, [], -1);
    };

    updateSelected = (selectedIndex) => {
        this.setState({
            selectedItem: selectedIndex,
        });
    };

    checkWhoseMessage = (orgs) => {
        if (orgs.length > 0) {
            orgs.forEach((item) => {});

            if (orgs[0].actor === "message_to") {
                if (
                    (orgs[0].org.org._id && orgs[0].org.org._id.toLowerCase()) ===
                    this.props.userDetail.orgId.toLowerCase()
                ) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    };

    sendMessage = (text, toOrgIds, messageGroupId, linkedMessageId, messageType) => {

        if (!text) return;

        let payload = {};

        switch (messageType) {
            case "new_message":
                payload = {
                    message: {
                        type: "message",
                        text: text,
                    },
                    to_org_ids: toOrgIds,
                };
                break;
            case "group_message":
                payload = {
                    message: {
                        type: "message",
                        text: text,
                    },
                    to_org_ids: [],
                    message_group_id: messageGroupId,
                };
                break;
            default:
                return;
        }

        this.postMessage(payload, messageType, messageGroupId);
    };

    postMessage = (payload, messageType, messageGroupId) => {
        axios
            .post(`${baseUrl}message/chat`, payload)
            .then((response) => {
                if (response.status === 200) {
                    const data = response.data.data;

                    if (messageType === "new_message") {
                        this.setState({
                            showHideOrgSearch: false,
                        });

                        this.getAllMessageGroups();
                    } else {
                        this.handleGroupClick(
                            messageGroupId,
                            this.state.selectedOrgs,
                            this.state.selectedIndex,
                            false
                        );
                    }

                    this.resetDraftRef.current.resetDraft(); // clear draftjs text field
                }
            })
            .catch((error) => {
                // this.props.showSnackbar({
                //     show: true,
                //     severity: "warning",
                //     message: `Post message error ${error.message}`,
                // });
            });
    };

    handleSendMessage = () => {

        if (this.state.messageText && this.state.newMsgOrgs.length > 0) {
            let newMsgOrgs = this.state.newMsgOrgs;
            this.setState({
                newMsgOrgs: [],
            });

            this.sendMessage(this.state.messageText, newMsgOrgs, "", "", "new_message");
        } else if (this.state.messageText && this.state.selectedMsgGroup.length > 0) {
            if (this.state.selectedGroupId) {
                this.sendMessage(
                    this.state.messageText,
                    [],
                    this.state.selectedGroupId,
                    "",
                    "group_message"
                );
            }
        }
    };

    handleChange = (event, values) => {
        let orgs = [];
        values.forEach((item) => {
            orgs.push(item._key);
        });

        this.setState({
            newMsgOrgs: orgs,
        });
    };

    render() {
        return (
            <>
                <div className="row bg-white rad-8 gray-border   message-row no-gutters mb-5">
                    <div
                        className="col-md-4 message-column"
                        style={{
                            borderRight: "1px solid var(--lc-bg-gray)",
                            borderBottom: "1px solid var(--lc-bg-gray)",
                        }}>
                        <div
                            style={{
                                borderBottom: "1px solid var(--lc-bg-gray)",
                                alignItems: "center",
                            }}
                            className="row d-flex no-gutters">
                            <div className="col-md-10">
                                <input
                                    placeholder="Filter conversations"
                                    onChange={this.filterGroups}
                                    className="search-input full-width-field m-3"
                                />
                            </div>
                            <div className="col-md-2 text-center">
                                <Tooltip title="New Message">
                                    <AddIcon
                                        onClick={() => this.handleOrgSearchButton()}
                                        className="text-blue  click-item"
                                        style={{ fontSize: "24px" }}
                                    />
                                </Tooltip>
                            </div>
                        </div>

                        {this.state.allMessageGroups.length === 0 && (
                            <div className={"text-center"}>No chats active. </div>
                        )}
                        <div className="message-groups  text-capitalize">
                            {this.state.filteredMessageGroups.length > 0 ? (
                                <div className={"message-item-c"}>
                                    {this.state.showHideOrgSearch && (
                                        <>
                                            <div
                                                key="new-item-group"
                                                id="new-item-group"
                                                className={`click-item p-3 message-group-item selected`}>
                                                <span
                                                    className={"ml-2 group-names text-capitlize "}>
                                                    New
                                                </span>
                                            </div>
                                        </>
                                    )}
                                    {this.state.filteredMessageGroups.map((group, i) => (
                                        <React.Fragment key={group._key + "_item"}>
                                            <>
                                                <MessageGroupItem
                                                    selectedItem={this.state.selectedItem}
                                                    index={i}
                                                    handleGroupClick={(group, orgs, i) =>
                                                        this.handleGroupClick(
                                                            group._key,
                                                            orgs,
                                                            i,
                                                            true
                                                        )
                                                    }
                                                    item={group}
                                                />
                                            </>
                                        </React.Fragment>
                                    ))}
                                </div>
                            ) : (
                                <div className={"text-center p-3"}>Loading...</div>
                            )}
                        </div>
                    </div>

                    <div className="col-md-8 message-column">
                        {this.state.showHideOrgSearch && (
                            <div
                                className="row no-gutters"
                                style={{
                                    borderBottom: "1px solid var(--lc-bg-gray)",
                                }}>
                                <div className="col-12">
                                    <Autocomplete
                                        className={"m-3"}
                                        multiple
                                        onOpen={() => {
                                            this.setState({
                                                open: true,
                                            });
                                        }}
                                        open={this.state.open}
                                        onClose={() => {
                                            this.setState({
                                                open: false,
                                            });
                                        }}
                                        isOptionEqualToValue={(option, value) =>
                                            option.name === value.name
                                        }
                                        loading={this.state.loading}
                                        id="tags-standard"
                                        onChange={this.handleChange}
                                        options={
                                            this.state.selectOrgs.length > 0
                                                ? this.state.selectOrgs
                                                : []
                                        }
                                        noOptionsText="Enter company name to search"
                                        variant={"standard"}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                style={{ minHeight: "45px" }}
                                                variant="standard"
                                                placeholder="Search companies"
                                                onChange={(e) => this.handleReactAsyncOnChange(e)}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                        {this.state.selectedOrgs && this.state.selectedOrgs.length > 0 && (
                            <div
                                className="row no-gutters"
                                style={{
                                    borderBottom: "1px solid var(--lc-bg-gray)",
                                }}>
                                <div className="col-12">
                                    <div
                                        className={`click-item p-3 message-group-item d-flex flex-column`}>
                                        <span className={"thumbnail-box"}>
                                            {this.state.selectedOrgs.map((item, index) => (
                                                <MessageNameThumbnail
                                                    showCount={20}
                                                    key={index}
                                                    index={index}
                                                    item={item}
                                                    allOrgs={this.state.selectedOrgs}
                                                />
                                            ))}
                                        </span>
                                        <span
                                            className={"ml-2 group-names text-capitlize"}
                                            // style={{ fontSize: "0.8em" }}
                                        >
                                            {this.state.selectedOrgs.map((item, index) => (
                                                <React.Fragment key={index}>
                                                    {index > 0 && ", "}
                                                    {item.name}
                                                </React.Fragment>
                                            ))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div
                            className="row no-gutters"
                            style={{
                                overflow: "auto",
                                borderRight: "1px solid var(--lc-bg-gray)",
                            }}>
                            <div className="col" style={{ minHeight: "400px" }}>
                                <>
                                    {!this.state.showHideOrgSearch && this.state.msgLoading && (
                                        <div className={"text-center p-3"}>
                                            Loading conversation...
                                        </div>
                                    )}
                                </>

                                <div className="message-window pr-3 pl-5 pt-5 mb-5 pb-20 ">
                                    {this.state.selectedMsgGroup.map((m, i) => (
                                        <React.Fragment key={i}>
                                            <div
                                                key={i}
                                                className={`d-flex  ${
                                                    m.isOwner
                                                        ? "justify-content-end "
                                                        : "justify-content-start msg-light"
                                                }`}>
                                                <div className="w-75 pr-2 pl-2 pb-2 mb-3 chat-msg-box border-rounded text-blue gray-border">
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <span>
                                                                <small className="mr-2">
                                                                    {m.orgName}
                                                                </small>
                                                                <small
                                                                    className={"text-gray-light"}>
                                                                    {moment(m.time).fromNow()}
                                                                </small>
                                                            </span>
                                                        </div>
                                                        <div>
                                                            {m.entityAsJson && (
                                                                <small
                                                                    className="mr-2 d-none"
                                                                    style={{
                                                                        cursor: "pointer",
                                                                    }}>
                                                                    <ExplicitIcon
                                                                        fontSize="small"
                                                                        onClick={() =>
                                                                            this.toggleEntity(
                                                                                m.entityAsJson,
                                                                                m.entityType
                                                                            )
                                                                        }
                                                                    />
                                                                </small>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {m.entityAsJson && (
                                                        <span
                                                            onClick={() =>
                                                                this.toggleEntity(
                                                                    m.entityAsJson,
                                                                    m.entityType
                                                                )
                                                            }>
                                                            {m.entityType}:
                                                            <span
                                                                className={"forgot-password-link"}>
                                                                {m.entityAsJson.name}
                                                            </span>
                                                        </span>
                                                    )}
                                                    <div
                                                        dangerouslySetInnerHTML={createMarkup(
                                                            m.text
                                                        )} style={{lineHeight: '0.8'}}></div>
                                                    {m.artifacts &&
                                                        m.artifacts.length > 0 &&
                                                        m.artifacts.map((artifact, index) => {
                                                            return (
                                                                <React.Fragment key={index}>
                                                                    <div
                                                                        className="mt-1 mb-1 text-left pt-3 pb-3  row">
                                                                        <div className={"col-10"}>
                                                                            <DescriptionIcon
                                                                                style={{
                                                                                    background:
                                                                                        "#EAEAEF",
                                                                                    opacity: "0.5",
                                                                                    fontSize:
                                                                                        " 2.5rem",
                                                                                }}
                                                                                className={
                                                                                    " p-1 rad-4"
                                                                                }
                                                                            />
                                                                            <span
                                                                                className="ml-4  text-blue text-bold"
                                                                                // href={artifact.blob_url}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer">
                                                                                {artifact.name}
                                                                            </span>
                                                                        </div>
                                                                        <div className={"col-2"}>
                                                                            <MoreMenu
                                                                                triggerCallback={(
                                                                                    action
                                                                                ) =>
                                                                                    this.callBackResult(
                                                                                        action,
                                                                                        artifact._key,
                                                                                        artifact.blob_url
                                                                                    )
                                                                                }
                                                                                download={true}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </React.Fragment>
                                                            );
                                                        })}
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    ))}
                                    <div className="dummy" ref={this.messagesEndRef} />
                                </div>
                            </div>
                        </div>
                        <div className="row no-gutters bottom-editor">
                            <div className="col-12 ">
                                <div className="wysiwyg-editor-container">
                                    <div className="row no-gutters">
                                        <div className="col-12">
                                            <WysiwygEditor
                                                allOrgs={this.state.allOrgs}
                                                ref={this.resetDraftRef}
                                                richTextHandleCallback={(value) =>
                                                    this.handleRichTextCallback(value)
                                                }
                                            />

                                            <button
                                                className=" send-bottom-button bg-transparent justify-content-center align-content-center"
                                                type="button"
                                                disabled={this.state.messageText ? false : true}
                                                onClick={() => this.handleSendMessage()}>
                                                <SendIcon
                                                    sx={{ fontSize: 48 }}
                                                    style={{
                                                        color: this.state.messageText
                                                            ? "var(--lc-purple)"
                                                            : "var(--lc-bg-gray)",
                                                    }}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <GlobalDialog
                    size={"xl"}
                    hide={() => this.toggleEntity(null, null)}
                    show={this.state.showEntity}
                    heading={this.state.entityObj ? this.state.entityObj.type : ""}>
                    <>
                        <div className="col-12 ">
                            {this.state.entityObj && this.state.entityObj.type === "Product" && (
                                <SubproductItem
                                    hideMoreMenu
                                    smallImage={true}
                                    item={this.state.entityObj.entity}
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
                                        title={"View Details"}
                                        type={"submit"}></GreenButton>
                                </div>
                                <div
                                    className={"col-6 pl-1"}
                                    style={{
                                        textAlign: "center",
                                    }}>
                                    <BlueBorderButton
                                        type="button"
                                        title={"Close"}
                                        onClick={() =>
                                            this.toggleEntity(null, null)
                                        }></BlueBorderButton>
                                </div>
                            </div>
                        </div>
                    </>
                </GlobalDialog>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
        messages: state.messages,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getMessages: (data) => dispatch(actionCreator.getMessages(data)),
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MessengerMessages);
