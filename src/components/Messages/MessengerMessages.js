import React, {Component} from "react";
import axios from "axios";
import {baseUrl, createMarkup} from "../../Util/Constants";
import {connect} from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import {Button, TextField, Tooltip} from "@mui/material";
import {Autocomplete} from "@mui/lab";
import AddIcon from "@mui/icons-material/AddCircle";
import ExplicitIcon from "@mui/icons-material/Explicit";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import SendIcon from "@mui/icons-material/Send";
import moment from "moment/moment";
import WysiwygEditor from "./WysiwygEditor";
import MessageEntityDialog from "./MessageEntityDialog";
import MessageGroupSingleArtifactDialog from "./MessageGroupSingleArtifactDialog";
import MessageGroupItem from "./MessageGroupItem";

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
        };
    }

    componentDidMount() {
        this.getAllMessageGroups();
    }

    getAllMessageGroups = () => {
        axios
            .get(`${baseUrl}message-group`)
            .then((response) => {
                const data = response.data.data;
                let returnedData = [];

                data.map((d) => {
                    axios
                        .get(
                            encodeURI(
                                `${baseUrl}seek/to?name=MessageGroup&id=${d._key}&to=Message&relation=&count=true&filters=type:message`
                            )
                        )
                        .then((res) => {
                            const rData = res.data.data;

                            if (rData > 0) {
                                returnedData.push(d);
                            }
                        })
                        .then(() => {
                            this.setState({
                                allMessageGroups: returnedData,
                                filteredMessageGroups: returnedData,
                            });
                        })
                        .catch((error) => {
                            this.props.showSnackbar({
                                show: true,
                                severity: "warning",
                                message: `Message data check error ${error.message}`,
                            });
                        });
                });
            })
            .catch((error) => {
                this.props.showSnackbar({
                    show: true,
                    severity: "warning",
                    message: `Message group error ${error.message}`,
                });
            });
    };

    getGroupMessageWithId = (id) => {
        if (!id) {
            this.setState({
                selectedMsgGroup: [],
            });
            return;
        }

        axios
            .get(`${baseUrl}message-group/${id}/message`)

            .then((response) => {
                this.setState({
                    selectedMsgGroup: response.data.data,
                });
            })
            .catch((error) => {
                this.props.showSnackbar({
                    show: true,
                    severity: "warning",
                    message: `Group message error ${error.message}`,
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
            this.props.showSnackbar({
                show: true,
                severity: "warning",
                message: `Org search error ${error.message}`,
            });
        }
    };

    filterGroups = (e) => {
        const { value } = e.target;

        if (value) {
            this.setState({
                filteredMessageGroups: this.state.allMessageGroups.filter((val) => {
                    if (val.name) {
                        if (val.name.toLowerCase().includes(value.toLowerCase())) {
                            return val;
                        }
                    }
                }),
            });
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

    handleGroupClick = (group, selectedIndex, orgs) => {
        this.updateSelected(selectedIndex);

        if (group) {
            this.setState({
                selectedGroupId: group._id,
                selectedGroupKey: group._key,
                showHideOrgSearch: false,
                showHideGroupFilter: false,
                selectedMsgGroup: [],
            });
            this.getGroupMessageWithId(group._key);
        } else {
            this.getGroupMessageWithId(null);
        }

        this.setState({
            selectedOrgs: orgs,
        });
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

        this.handleGroupClick(null, -1, []);
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

        this.postMessage(payload, messageType);
    };

    postMessage = (payload, messageType) => {
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
                        this.handleGroupClick(data.message_group, this.state.selectedItem);
                    }

                    this.resetDraftRef.current.resetDraft(); // clear draftjs text field
                }
            })
            .catch((error) => {
                this.props.showSnackbar({
                    show: true,
                    severity: "warning",
                    message: `Post message error ${error.message}`,
                });
            });
    };

    handleSendMessage = () => {
        if (this.state.messageText && this.state.newMsgOrgs.length > 0) {
            this.sendMessage(this.state.messageText, this.state.newMsgOrgs, "", "", "new_message");
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
                    <div className="row bg-white rad-8 gray-border  message-row no-gutters mb-5">
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
                                        placeholder={"Filter conversations"}
                                        onChange={this.filterGroups}
                                        className={"search-input full-width-field m-3"}
                                    />
                                </div>
                                <div className="col-md-2 text-center  justify-content-center align-items-center">
                                    <Tooltip title="New Message">
                                        <AddIcon
                                            onClick={() => this.handleOrgSearchButton()}
                                            className={"text-blue  click-item"}
                                            style={{ fontSize: "24px" }}
                                        />
                                    </Tooltip>
                                </div>
                            </div>

                            {this.state.allMessageGroups.length === 0 && (
                                <div className={"text-center"}>No chats active. </div>
                            )}
                            <div className="message-groups  text-capitalize" style={{}}>
                                {this.state.filteredMessageGroups.length > 0 ? (
                                    <div className={"message-item-c"}>
                                        {this.state.showHideOrgSearch && (
                                            <>
                                                <div
                                                    key="new-item-group"
                                                    id="new-item-group"
                                                    className={`click-item p-3 message-group-item selected`}>
                                                    <span
                                                        className={
                                                            "ml-2 group-names text-capitlize "
                                                        }>
                                                        New
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                        {this.state.filteredMessageGroups.map((group, i) => (
                                            <>
                                                <MessageGroupItem
                                                    key={group._key + "_item"}
                                                    selectedItem={this.state.selectedItem}
                                                    index={i}
                                                    handleGroupClick={(group, i, orgs) =>
                                                        this.handleGroupClick(group, i, orgs)
                                                    }
                                                    item={group}
                                                />
                                            </>
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
                                            variant={"standard"}
                                            getOptionLabel={(option) => option.name}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    style={{ minHeight: "45px" }}
                                                    variant="standard"
                                                    placeholder="Search companies"
                                                    onChange={(e) =>
                                                        this.handleReactAsyncOnChange(e)
                                                    }
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
                                        <div className={`click-item p-3 message-group-item `}>
                                            <span className={"thumbnail-box"}>
                                                {this.state.selectedOrgs.map((item, index) => (
                                                    <>
                                                        <span
                                                            className={`text-caps company-thumbnails ${
                                                                index > 0 &&
                                                                " thumbnail-margin-left"
                                                            } `}>
                                                            {item.name.substr(0, 2)}
                                                        </span>
                                                    </>
                                                ))}
                                            </span>
                                            <span className={"ml-2 group-names text-capitlize "}>
                                                {this.state.selectedOrgs.map((item, index) => (
                                                    <>
                                                        {index > 0 && ","}
                                                        {item.name}
                                                    </>
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
                                <div className="col">
                                    {this.state.selectedMsgGroup.length <= 0 &&
                                    this.state.allMessageGroups.length > 0 &&
                                    this.state.allMessageGroups[0].id !== "0" ? (
                                        <>
                                            {!this.state.showHideOrgSearch && (
                                                <div className={"text-center p-3"}>
                                                    Loading conversation...
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div></div>
                                    )}
                                    {this.state.selectedMsgGroup.length > 0 ? (
                                        <div className="message-window p-3 ">
                                            {this.state.selectedMsgGroup.map((m, i) => (
                                                <>
                                                    <div
                                                        key={i}
                                                        className={`d-flex ${
                                                            this.checkWhoseMessage(m.orgs)
                                                                ? "justify-content-start msg-light"
                                                                : "justify-content-end msg-dark"
                                                        }`}>
                                                        <div
                                                            className="w-75 p-2 mb-3 chat-msg-box border-rounded text-blue gray-border"
                                                            style={{
                                                                background: this.checkWhoseMessage(
                                                                    m.orgs
                                                                )
                                                                    ? "#ffffff"
                                                                    : "#ffffff",
                                                            }}>
                                                            <div className="d-flex justify-content-between">
                                                                <div>
                                                                    <small>
                                                                        <small
                                                                            className="mr-1"
                                                                            style={{
                                                                                opacity: "0.8",
                                                                            }}>
                                                                            {m.orgs[0].org.org.name}
                                                                            {this.checkWhoseMessage(
                                                                                m.orgs
                                                                            )
                                                                                ? m.orgs[0].org.org
                                                                                      .name
                                                                                : ""}
                                                                        </small>
                                                                        <small
                                                                            className={
                                                                                "text-gray-light"
                                                                            }
                                                                            style={{
                                                                                opacity: "0.5",
                                                                            }}>
                                                                            {moment(
                                                                                m.message
                                                                                    ._ts_epoch_ms
                                                                            ).fromNow()}
                                                                        </small>
                                                                    </small>
                                                                </div>
                                                                <div>
                                                                    {m.message.entity_as_json && (
                                                                        <small
                                                                            className="mr-2"
                                                                            style={{
                                                                                cursor: "pointer",
                                                                            }}>
                                                                            <ExplicitIcon
                                                                                fontSize="small"
                                                                                onClick={
                                                                                    this
                                                                                        .handleEntityDialogOpen
                                                                                }
                                                                            />
                                                                            <MessageEntityDialog
                                                                                entity={
                                                                                    m.message
                                                                                        .entity_as_json
                                                                                }
                                                                                open={
                                                                                    this.state
                                                                                        .openEntityDialog
                                                                                }
                                                                                onClose={
                                                                                    this
                                                                                        .handleEntityDialogClose
                                                                                }
                                                                            />
                                                                        </small>
                                                                    )}
                                                                    {m.artifacts.length > 0 && (
                                                                        <small
                                                                            style={{
                                                                                cursor: "pointer",
                                                                            }}>
                                                                            <PhotoLibraryIcon
                                                                                fontSize="small"
                                                                                onClick={
                                                                                    this
                                                                                        .handleSingleArtifactDialogOpen
                                                                                }
                                                                            />
                                                                            <MessageGroupSingleArtifactDialog
                                                                                artifacts={
                                                                                    m.artifacts
                                                                                }
                                                                                open={
                                                                                    this.state
                                                                                        .openSingleArtifactDialog
                                                                                }
                                                                                onClose={
                                                                                    this
                                                                                        .handleSingleArtifactDialogClose
                                                                                }
                                                                            />
                                                                        </small>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div
                                                                dangerouslySetInnerHTML={createMarkup(
                                                                    m.message.text
                                                                )}></div>
                                                        </div>
                                                    </div>
                                                </>
                                            ))}
                                            <div className="dummy" ref={this.messagesEndRef} />
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}
                                </div>
                            </div>

                            <div className="editor-bottom-container col-12  ">
                                <div className="wysiwyg-editor-container">
                                    <div className="row no-gutters">
                                        <div className="col-10">
                                            <WysiwygEditor
                                                allOrgs={this.state.allOrgs}
                                                ref={this.resetDraftRef}
                                                richTextHandleCallback={(value) =>
                                                    this.handleRichTextCallback(value)
                                                }
                                            />
                                        </div>
                                        <div className="col-2 d-flex justify-content-center align-content-center">
                                            <Button
                                                className="btn btn-block d-flex justify-content-center align-content-center"
                                                type="button"
                                                disabled={this.state.messageText ? false : true}
                                                fullWidth
                                                onClick={() => this.handleSendMessage()}>
                                                <SendIcon
                                                    sx={{fontSize: 48}}
                                                    style={{
                                                        color: this.state.messageText
                                                            ? "var(--lc-pink)"
                                                            : "var(--lc-bg-gray)",
                                                    }}
                                                />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
