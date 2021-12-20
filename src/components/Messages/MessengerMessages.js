import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { baseUrl, createMarkup } from "../../Util/Constants";
import { connect } from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import { Button, List, ListItemButton, TextField, Tooltip } from "@mui/material";
import { Autocomplete } from "@mui/lab";
import { Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/AddCircle";
import ExplicitIcon from "@mui/icons-material/Explicit";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import SendIcon from "@mui/icons-material/Send";
import FilterListIcon from "@mui/icons-material/Search";
import moment from "moment/moment";
import { makeStyles } from "@mui/styles";
import WysiwygEditor from "./WysiwygEditor";
import MessageEntityDialog from "./MessageEntityDialog";
import MessageGroupSingleArtifactDialog from "./MessageGroupSingleArtifactDialog";
import AsyncSelect from "react-select/async";
import CustomizedSelect from "../FormsUI/ProductForm/CustomizedSelect";
import CustomizedInput from "../FormsUI/ProductForm/CustomizedInput";

const msgWindowHeight = "520px";
const useStyles = makeStyles({
    root: {
        "&$selected": {
            backgroundColor: "var(--lc-purple)",
            color: "#ffffff",
            "&:hover": {
                backgroundColor: "var(--lc-pink)",
                color: "#ffffff",
            },
        },
    },
    selected: {},
});

const MessengerMessages = ({ userDetail, messages, getMessages }) => {
    const classes = useStyles();
    const reactSelectRef = useRef([]);
    const resetDraftRef = useRef();
    const messagesEndRef = useRef(null);
    const [open, setOpen] = React.useState(false);
    const [selectOrgs, setSelectOrgs] = useState([]);
    const [selectedOrgs, setSelectedOrgs] = useState([]);
    const [newMsgOrgs, setNewMsgOrgs] = useState([]);

    const loading = open && selectOrgs.length === 0;


    const [allOrgs, setAllOrgs] = useState([]);

    const [allMessageGroups, setAllMessageGroups] = useState([]);
    const [filteredMessageGroups, setFilteredMessageGroups] = useState([]);

    const [autoCompleteOrg, setAutoCompleteOrg] = useState("");
    const [userOrg, setUserOrg] = useState("");
    const [selectedMsgGroup, setSelectedMsgGroup] = useState([]);
    const [selectedItem, setSelectedItem] = useState(0);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [selectedGroupKey, setSelectedGroupKey] = useState(null);

    const [reactSelectAsyncValues, setReactSelectAsyncValues] = useState([]);
    const [reactSelectedAsyncValues, setReactSelectedAsyncValues] = useState([]);

    const [messageText, setMessageText] = useState("");
    const [showHideGroupFilter, setShowHideGroupFilter] = useState(false);
    const [showHideOrgSearch, setShowHideOrgSearch] = useState(false);

    const [openEntityDialog, setOpenEntityDialog] = useState(false);
    const [openSingleArtifactDialog, setOpenSingleArtifactDialog] = useState(false);

    let trackedList = [];


    useEffect(() => {
        // getAllOrgs();
        getAllMessageGroups();
    }, []);

    useEffect(() => {
        setUserOrg(userDetail.orgId);
    }, []);



    // useInterval(() => {
    //     getAllOrgs();
    //     getAllMessageGroups();
    // }, 1000 * 10);

    const ListGroupDisplay = (group, i) => {
        trackedList.push({ groupId: group._id, groupKey: group._key, name: group.name, index: i });

        return (
            <div
                key={i}
                className={ selectedItem === i?`click-item p-2 message-group-item selected`:`click-item p-2 message-group-item`}
                selected={selectedItem === i}
                onClick={() => handleGroupClick(group, i)}
                autoFocus

                // style={
                //     selectedItem === i
                //         ? { backgroundColor: "var(--lc-pink)", color: "#fff" }
                //         : { backgroundColor: "#fff" }
                // }

            >
                {group.name.replaceAll(",", ", ").replaceAll("+", ", ").replaceAll("-", "")}
            </div>
        );
    };

    const getAllOrgs = () => {
        axios
            .get(`${baseUrl}org/all`)
            .then((response) => {
                const res = response.data.data;
                setAllOrgs(res);

            })
            .catch((error) => {
                console.log("all orgs errors ", error.message);
            });
    };

    const getAllMessageGroups = () => {
        axios
            .get(`${baseUrl}message-group`)
            .then((response) => {
                const data = response.data.data;
                setAllMessageGroups(data);
                setFilteredMessageGroups(data)

                    // handleGroupClick(data[0], 0);

            })
            .catch((error) => {
                console.log("message-group-error ", error.message);
            });
    };

    const getGroupMessageWithId = (id) => {
        if (!id) return;

        // alert("load "+ id)

        axios
            // .get(`${baseUrl}message-group/${id}/message?offset=5&include-notifs=true`)
            .get(`${baseUrl}message-group/${id}/message`)

            .then((response) => {
                setSelectedMsgGroup(response.data.data);
            })
            .catch((error) => {
                console.log("group message error ", error.message);
            });
    };

    const handleEntityDialogOpen = () => {
        setOpenEntityDialog(true);
    };

    const handleEntityDialogClose = (value) => {
        setOpenEntityDialog(false);
    };

    const handleSingleArtifactDialogOpen = () => {
        setOpenSingleArtifactDialog(true);
    };
    const handleSingleArtifactDialogClose = () => {
        setOpenSingleArtifactDialog(false);
    };

    const handleNewMessageSelectAsync = async (inputValue) => {

        try {
                const result = await axios.get(`${baseUrl}org/search?o=0&s=20&q=${inputValue}`);
                const data = result.data.data;
                const tempArray = [];

                // data.orgs.forEach((item, i) => {
                //     tempArray.push({ label: item.email, value: item._id });
                // });

                setSelectOrgs(data.orgs)

                // callback(tempArray);
            } catch (error) {
                console.log("org search error ", error.message);
            }

    };



    const filterGroups = (e) => {

        const {value} = e.target;

        console.log()

        if (value) {
            setFilteredMessageGroups(
                allMessageGroups.filter((val) => {
                    if (val.name) {
                        if (val.name.toLowerCase().includes(value.toLowerCase())) {
                            return val;
                        }
                    }
                })
            )

        }else{
            setFilteredMessageGroups(allMessageGroups)
        }

    }
    const handleReactAsyncOnChange = (e) => {

        const {value,options} = e.target;



        if (value) {
            // setReactSelectAsyncValues(value);
            // const temp = [];
            // value.forEach((item) => {
            //     temp.push(item.value);
            // });
            // setReactSelectedAsyncValues(temp);

            handleNewMessageSelectAsync(value)
        }
    };

    const handleFilterGroups = (e, value) => {
        setAutoCompleteOrg(value);
    };

    const handleGroupClick = (group, selectedIndex,orgs) => {

        // console.log("handle group click")
        // console.log(group, selectedIndex,orgs)

        updateSelected(selectedIndex);
        setSelectedGroupId(group._id);
        setSelectedGroupKey(group._key);



        setShowHideOrgSearch(false);
        setShowHideGroupFilter(false);
        getGroupMessageWithId(group._key);
        setSelectedMsgGroup([]);

        setSelectedOrgs(orgs)
    };

    const handleRichTextCallback = (value) => {
        setMessageText(value);
    };

    const handleOrgSearchButton = () => {
        // showHideOrgSearch ? allMessageGroups.pop() : allMessageGroups.unshift({id: "0", name: "New Chat"});
        if (showHideOrgSearch) {
            if (allMessageGroups[0].id === "0") {
                allMessageGroups.splice(0, 1); // remove new message
                handleGroupClick(allMessageGroups[0], 0);
            }
        } else {
            allMessageGroups.unshift({ id: "0", name: "New Message" });
            handleGroupClick(allMessageGroups[0], 0);
        }
        setShowHideOrgSearch(!showHideOrgSearch);
    };

    const updateSelected = (selectedIndex) => {
        setSelectedItem(selectedIndex);
    };



    const checkWhoseMessage = (orgs) => {
        if (orgs.length > 0) {
            if (orgs[0].actor === "message_to") {
                if (
                    (orgs[0].org.org._id && orgs[0].org.org._id.toLowerCase()) ===
                    userDetail.orgId.toLowerCase()
                ) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    };

    const handleFilterGroupsButton = () => {
        setAutoCompleteOrg("");
        setShowHideGroupFilter(!showHideGroupFilter);
    };

    const sendMessage = (text, toOrgIds, messageGroupId, linkedMessageId, messageType) => {
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

        postMessage(payload, messageType);
    };

    const postMessage = (payload, messageType) => {
        axios
            .post(`${baseUrl}message/chat`, payload)
            .then((response) => {
                if (response.status === 200) {
                    const data = response.data.data;

                    // setMessageText("");


                    if (messageType==="new_message")
                    getAllMessageGroups()

                    else{

                        handleGroupClick(data.message_group, selectedItem);
                    }

                    // if (payload.message_group_id) {
                    //     handleGroupClick(data.message_group, selectedItem);
                    // } else {
                    //
                    //     if (trackedList.length > 0) {
                    //         const msgGroupIdCheck = trackedList.filter(
                    //             (g) => g.groupId === data.message_group._id
                    //         );
                    //
                    //         if (msgGroupIdCheck) {
                    //             const _id = msgGroupIdCheck[0].groupId;
                    //             const _key = msgGroupIdCheck[0].groupKey;
                    //             const name = msgGroupIdCheck[0].name;
                    //             const index = msgGroupIdCheck[0].index - 1;
                    //             handleGroupClick({ _id, _key, name }, index);
                    //         }
                    //     }
                    // }

                    resetDraftRef.current.resetDraft(); // clear draftjs text field
                }
            })
            .catch((error) => {
                console.log("postMessage error ", error.message);
            });
    };

    const handleSendMessage = () => {
        if (messageText && newMsgOrgs.length > 0) {
            sendMessage(messageText, newMsgOrgs, "", "", "new_message");
        } else if (messageText && selectedMsgGroup.length > 0) {
            if (selectedGroupId) {
                sendMessage(messageText, [], selectedGroupId, "", "group_message");
            }
        }
    };

    const handleChange = (event,values) => {

        console.log("autocomplete")
        console.log(values)


        let orgs=[]
           values.forEach((item)=>{

    orgs.push(item._key)
})

        setNewMsgOrgs(orgs)

        // setValue(event.target.value);
        // if (onChange)
        //     onChange(event.target.value)
    };

    return (
        <>
            <div className="row bg-white rad-8 gray-border  message-row no-gutters mb-5">
                <div className="col-md-4 message-column"
                     style={{

                         borderRight: "1px solid var(--lc-bg-gray)",
                         borderBottom: "1px solid var(--lc-bg-gray)",
                     }}
                >
                    <div
                        style={{
                            borderBottom: "1px solid var(--lc-bg-gray)",
                            alignItems:"center"
                        }}
                        className="row d-flex no-gutters" >
                        <div className="col-md-10">

                            <input placeholder={"Filter conversations"} onChange={filterGroups} className={"search-input full-width-field m-3"}   />
                                {/*{!showHideGroupFilter && (*/}
                                {/*    <div className="d-flex justify-content-start align-items-center h-100">*/}
                                {/*        Groups*/}
                                {/*    </div>*/}
                                {/*)}*/}
                            {/*{showHideGroupFilter && (*/}
                            {/*    <Autocomplete*/}
                            {/*        variant={"standard"}*/}
                            {/*        disablePortal*/}
                            {/*        id="groups-filter"*/}
                            {/*        fullWidth*/}
                            {/*        onChange={(e, value) => handleFilterGroups(e, value)}*/}
                            {/*        options={*/}
                            {/*            allMessageGroups.length > 0*/}
                            {/*                ? allMessageGroups.map((option) =>*/}
                            {/*                      option.name ? option.name : ""*/}
                            {/*                  )*/}
                            {/*                : []*/}
                            {/*        }*/}
                            {/*        // sx={{ width: 300 }}*/}
                            {/*        renderInput={(params) => (*/}
                            {/*            <TextField {...params} label="Search for Groups" />*/}
                            {/*        )}*/}
                            {/*    />*/}
                            {/*)}*/}
                        </div>

                        {/*<div className="col-md-2  justify-content-center align-items-center d-none">*/}
                        {/*    <Tooltip title="Filter groups">*/}
                        {/*        <Button onClick={() => handleFilterGroupsButton()}>*/}
                        {/*            <FilterListIcon*/}
                        {/*                className={"text-blue"}*/}
                        {/*                style={{ fontSize: "24px" }}*/}
                        {/*            />*/}
                        {/*        </Button>*/}
                        {/*    </Tooltip>*/}
                        {/*</div>*/}

                        <div className="col-md-2 text-center  justify-content-center align-items-center">
                            <Tooltip title="New Message">

                                    <AddIcon onClick={() => handleOrgSearchButton()} className={"text-blue  click-item"} style={{ fontSize: "24px" }} />

                            </Tooltip>
                        </div>
                    </div>

                    {allMessageGroups.length === 0 && <div className={"text-center"}>No chats active. </div>}
                    <div
                        className="message-groups  text-capitalize"


                        style={{

                            // overflow: "auto",
                        }}>

                        {autoCompleteOrg && <div className="mb-2">
                            <div className="green-link-url" onClick={() => setAutoCompleteOrg("")}>clear filtered results</div>
                        </div>}

                        {filteredMessageGroups.length > 0 ? (
                            <div className={"message-item-c"}>
                                {filteredMessageGroups
                                    // .filter((val) => {
                                    //     if (val.name) {
                                    //         if (
                                    //             autoCompleteOrg === "" ||
                                    //             autoCompleteOrg === "null"
                                    //         ) {
                                    //             return val;
                                    //         } else if (
                                    //             val.name
                                    //                 .toLowerCase()
                                    //                 .includes(
                                    //                     autoCompleteOrg
                                    //                         ? autoCompleteOrg.toLowerCase()
                                    //                         : setAutoCompleteOrg("")
                                    //                 )
                                    //         ) {
                                    //             return val;
                                    //         }
                                    //     }
                                    // })
                                    .map((group, i) =>

                                        // ListGroupDisplay(group, i)

                                        <MessageGroupItem selectedItem={selectedItem} index={i} handleGroupClick={(group,i,orgs)=>handleGroupClick(group,i,orgs)} item={group} />

                                    )

                                }
                            </div>
                        ) : (
                            <div className={"text-center p-3"}>Loading...</div>
                        )}
                    </div>
                </div>

                <div className="col-md-8 message-column">
                    {showHideOrgSearch && (
                        <div className="row no-gutters"
                             style={{

                                 borderBottom: "1px solid var(--lc-bg-gray)",
                             }}
                        >
                            <div className="col-12">

                               <Autocomplete
                                    className={"m-3"}
                                    multiple
                                    onOpen={() => {
                                        setOpen(true);
                                    }}
                                    open={open}
                                    onClose={() => {
                                        setOpen(false);
                                    }}
                                    // value={newMsgOrgs}
                                    isOptionEqualToValue={(option, value) => option.name === value.name}
                                    // renderOption={(props, option) => [props, option]}
                                    loading={loading}
                                    id="tags-standard"

                                    onChange={handleChange}
                                    options={selectOrgs.length > 0?selectOrgs:[]}
                                    variant={"standard"}
                                    getOptionLabel={(option) => option.name}
                                    // defaultValue={topFilms[13]}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            style={{minHeight:"45px"}}
                                            variant="standard"
                                            // label="Multiple values"
                                            placeholder="Search companies"
                                            onChange={(e) => handleReactAsyncOnChange(e)}
                                        />
                                    )}
                                />

                            </div>
                        </div>
                    )}


                    {selectedOrgs&&selectedOrgs.length > 0 &&
                    <div className="row no-gutters"
                         style={{

                             borderBottom: "1px solid var(--lc-bg-gray)",
                         }}
                    >
                        <div className="col-12">
                            <div className={`click-item p-3 message-group-item `}>
                           <span className={"thumbnail-box"}>{selectedOrgs.map((item, index) =>
             <>
                 <span
                     className={`text-caps company-thumbnails ${index > 0 && " thumbnail-margin-left"} `}>{item.name.substr(0, 2)}</span>


             </>
         )}
         </span>
                                <span className={"ml-2 group-names text-capitlize "}>
                {/*{props.item.name.replaceAll(",", ", ").replaceAll("+", ", ").replaceAll("-", "")}*/}
                                    {selectedOrgs.map((item, index) =>
                                        <>
                                            {index > 0 && ","}{item.name}
                                        </>
                                    )}
            </span>
                                {/*<span className={"group-members date-bottom text-gray-light"}>*/}
                                {/*    ({selectedOrgs.length} Participants)*/}
                                {/*</span>*/}
                            </div>

                        </div>
                    </div>
                    }


                    <div
                        className="row no-gutters"
                        style={{
                            // height: msgWindowHeight,
                            // maxHeight: msgWindowHeight,
                            overflow: "auto",
                            borderRight: "1px solid var(--lc-bg-gray)",
                        }}>
                        <div className="col">
                            {selectedMsgGroup.length <= 0 &&
                            allMessageGroups.length > 0 &&
                            allMessageGroups[0].id !== "0" ? (
                               <div className={"text-center p-3"}>Loading conversation...</div>
                            ) : (
                                <div></div>
                            )}
                            {selectedMsgGroup.length > 0 ? (
                                <div
                                    className="message-window p-3 "
                                    // style={{ height: msgWindowHeight }}
                                >
                                    {selectedMsgGroup
                                        .map((m, i) => (
                                            <div
                                                key={i}
                                                className={`d-flex ${
                                                    checkWhoseMessage(m.orgs)
                                                        ? "justify-content-start msg-light"
                                                        : "justify-content-end msg-dark"
                                                }`}>
                                                <div
                                                    className="w-75 p-2 mb-3 chat-msg-box border-rounded text-blue gray-border"
                                                    style={{
                                                        background: checkWhoseMessage(m.orgs)
                                                            ? "#ffffff"
                                                            : "#ffffff",
                                                    }}>
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <small>
                                                                <small
                                                                    className="mr-1"
                                                                    style={{ opacity: "0.8" }}>
                                                                    {checkWhoseMessage(m.orgs)
                                                                        ? m.orgs[0].org.org.name
                                                                        : ""}
                                                                </small>
                                                                <small
                                                                    className={"text-gray-light"}
                                                                    style={{ opacity: "0.5" }}>
                                                                    {moment(
                                                                        m.message._ts_epoch_ms
                                                                    ).fromNow()}
                                                                </small>
                                                            </small>
                                                        </div>
                                                        <div>
                                                            {m.message.entity_as_json && (
                                                                <small
                                                                    className="mr-2"
                                                                    style={{ cursor: "pointer" }}>
                                                                    <ExplicitIcon
                                                                        fontSize="small"
                                                                        onClick={
                                                                            handleEntityDialogOpen
                                                                        }
                                                                    />
                                                                    <MessageEntityDialog
                                                                        entity={
                                                                            m.message.entity_as_json
                                                                        }
                                                                        open={openEntityDialog}
                                                                        onClose={
                                                                            handleEntityDialogClose
                                                                        }
                                                                    />
                                                                </small>
                                                            )}
                                                            {m.artifacts.length > 0 && (
                                                                <small
                                                                    style={{ cursor: "pointer" }}>
                                                                    <PhotoLibraryIcon
                                                                        fontSize="small"
                                                                        onClick={
                                                                            handleSingleArtifactDialogOpen
                                                                        }
                                                                    />
                                                                    <MessageGroupSingleArtifactDialog
                                                                        artifacts={m.artifacts}
                                                                        open={
                                                                            openSingleArtifactDialog
                                                                        }
                                                                        onClose={
                                                                            handleSingleArtifactDialogClose
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
                                        ))
                                        }
                                    <div className="dummy" ref={messagesEndRef} />
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>

                    <div
                        className="editor-bottom-container col-12  ">
                        <div className="wysiwyg-editor-container">
                            {
                                <div className="row">
                                    <div className="col">
                                        {reactSelectedAsyncValues.length > 0 && (
                                            <Alert
                                                severity="info"
                                                className="mr-2">{`Send message to selected orgs`}</Alert>
                                        )}
                                        {/*{reactSelectedAsyncValues.length > 0 ||*/}
                                        {/*(selectedMsgGroup.length > 0 && (*/}
                                        {/*    <Alert severity="info">{`Reply to the selected group`}</Alert>*/}
                                        {/*))}*/}
                                    </div>
                                </div>
                            }

                            <div className="row no-gutters" >
                                <div className="col-12"
                                     // style={{ border: "1px solid var(--lc-pale-purple)" }}
                                >
                                    <WysiwygEditor
                                        // wrapperClassName="wysiwyg-wrapper-class"
                                        // editorClassName="wysiwyg-editor-class"
                                        allOrgs={allOrgs}
                                        ref={resetDraftRef}
                                        richTextHandleCallback={(value) => handleRichTextCallback(value)}
                                    />
                                </div>
                                <div className="send-button-left">
                                    <Button
                                        type="button"
                                        disabled={messageText ? false : true}
                                        fullWidth
                                        onClick={() => handleSendMessage()}>
                                        <SendIcon
                                            fontSize="large"
                                            style={{
                                                color: messageText ? "var(--lc-pink)" : "var(--lc-bg-gray)",
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
};



const MessageGroupItem=(props)=>{


    const [allOrgs, setAllOrgs] = useState([]);


    useEffect(() => {
        // Update the document title using the browser API
        axios
            .get(`${baseUrl}message-group/${props.item._key}/org`)
            .then((response) => {

                const data = response.data.data;
                setAllOrgs(data)

                if (props.index===0){
                    props.handleGroupClick(props.item,props.index,data)
                }

            })
            .catch((error) => {
                console.log("message-group-error ", error.message);
            });



    },[]);


     const handleClick=()=>{

        props.handleGroupClick(props.item,props.index,allOrgs)
    }
    return(
        <div
            key={props.item._key}
            id={props.item._key}
            className={ props.selectedItem === props.index?`click-item p-3 message-group-item selected`:`click-item p-3 message-group-item`}

            onClick={handleClick}
        >
         <span className={"thumbnail-box"}>{allOrgs.map((item,index)=>
             <>
             {index<3 && <span className={`text-caps company-thumbnails ${index>0&&" thumbnail-margin-left"} `}>{item.name.substr(0,2)}</span>}

              {index==3 &&(allOrgs.length-3!==0)&&<span className={"more-items-thumbnail "}>+{allOrgs.length-3}</span>}

             </>
         )}</span>
            <span className={"ml-2 group-names text-capitlize "}>
                {/*{props.item.name.replaceAll(",", ", ").replaceAll("+", ", ").replaceAll("-", "")}*/}
                {allOrgs.map((item,index)=>
                <>
                    {index>0&&","} {item.name}
                </>
                )}
            </span>
            {/*<span className={"group-members date-bottom text-gray-light"}>*/}
            {/*    ({allOrgs.length} Participants)*/}
            {/*</span>*/}
        </div>
    )
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MessengerMessages);
