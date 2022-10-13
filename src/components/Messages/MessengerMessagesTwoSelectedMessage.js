import React, {useState} from "react";
import {Box} from "@mui/material";
import PropTypes from "prop-types";
import MessengerChatBox from "./MessengerChatBox";
import {connect} from "react-redux";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import {Spinner} from "react-bootstrap";
import Avatar from "@mui/material/Avatar";
import {getInitials, getTimeFormat} from "../../Util/GlobalFunctions";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import {styled} from "@mui/material/styles";
import TableCell, {tableCellClasses} from "@mui/material/TableCell";

const MessengerMessagesTwoSelectedMessage = ({ groupMessageKey,setActiveTab,activeTab,listInnerRefTable,selectedMessageGroupOrgs,chatEndReached,messages, userDetail,onDownScrollTable,onScroll,listInnerRef,scrollEnd,...otherprops }) => {
    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };

    const [value, setValue] = React.useState(0);
    const [groupMessageArtifacts, setGroupMessageArtifacts] = useState([]);


    const handleTabsChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleWhoseMessage = (o, index) => {
        if(o.actor === "message_from") {
            if(o.org.org._id.toLowerCase() === userDetail.orgId.toLowerCase()) {
                return "justify-content-end";
            }
        }

        return "justify-content-start";
    }


    const getArtifacts = () => {
        setGroupMessageArtifacts([]); // clear artifacts
        if(groupMessageKey) {
            axios
                .get(`${baseUrl}message-group/${groupMessageKey}/artifact`)
                .then((res) => {
                    let data = res.data.data;
                    setGroupMessageArtifacts(data);
                })
                .catch(error => {

                })
        }
    }

    const afterUploadedImagesCallback = () => {
        getArtifacts()
    }

    return (
        <>

<div style={{width:"100%"}}>

    <div className="row g-0">
        <div className="col-12 d-flex">
        <a href="javascript:void(0)" onClick={()=>setActiveTab(0)}>
            <div className={`w3-third tablink w3-bottombar w3-hover-light-grey w3-padding ${activeTab===0?"w3-border-red":""}`}>Chat</div>
        </a>
        <a href="javascript:void(0)" onClick={()=>setActiveTab(1)}>
            <div className={`w3-third tablink w3-bottombar w3-hover-light-grey w3-padding ${activeTab===1?"w3-border-red":""}`}>Files</div>
        </a>
        </div>
    </div>
    <div className={`row g-0`}>
        <div className="col-12 p-2">
                        {scrollEnd &&
                        <div className="spinner-chat"><Spinner
                            className="me-2"
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        /></div>}

                            <div
                                onScroll={onScroll}
                                ref={listInnerRef}
                                className="mb-5" style={{
                                flexFlow:`${activeTab===0?"column-reverse":""}`,
                                display: "flex",
                                height: "400px", minHeight: "400px",  maxHeight: "400px", overflow: "auto", overflowX: "hidden" }}>

                                <>
                                    {activeTab===0? messages.map((m, i) => (
                                    <React.Fragment key={i}>
                                        <div
                                            className={`d-flex ${
                                                (m.orgs.map((o, i) => handleWhoseMessage(o, i)).filter((s) => s === "justify-content-end").length > 0) ? "justify-content-end" : "justify-content-start"
                                            }`}>
                                            <MessengerChatBox m={m} />
                                        </div>
                                    </React.Fragment>
                                )):

<>

    <TableContainer
        onScroll={()=>{
            onDownScrollTable();
        }}
        ref={listInnerRefTable}
        sx={{ width: "100%", maxHeight:"300" }} component={Paper}>
        <Table
            stickyHeader
            sx={{ width: "100%" }}
            aria-label="customized table">
            <TableHead >
                <TableRow>
                    <StyledTableCell>Type</StyledTableCell>
                    <StyledTableCell align="right">Name</StyledTableCell>
                    <StyledTableCell align="right">Shared On</StyledTableCell>
                    <StyledTableCell align="right">Sent By</StyledTableCell>
                    <StyledTableCell align="right"></StyledTableCell>
                </TableRow>
            </TableHead>
            <TableBody>
         {messages.map((m, i) => (
        <React.Fragment key={i}>
            {m.artifacts.length > 0 &&
                <>
                        {m.artifacts.map((item) =>  (
                            <StyledTableRow key={item._key}>
                                <StyledTableCell component="th" scope="row">
                                    <a href={item.blob_url} target="_blank" rel="noreferrer">
                                        <Avatar
                                            alt={item.name}
                                            src={item.blob_url}
                                            sx={{ width: 56, height: 56 }}
                                            variant="square"
                                        />
                                    </a>
                                </StyledTableCell>
                                <StyledTableCell align="right">{item.name}</StyledTableCell>
                                <StyledTableCell align="right">{getTimeFormat(item._ts_epoch_ms)}</StyledTableCell>
                                <StyledTableCell align="right">{item.name}</StyledTableCell>
                                <StyledTableCell align="right">Download</StyledTableCell>
                            </StyledTableRow>
                        ))}
                        </>
                  }
        </React.Fragment>
              ))}
            </TableBody>
        </Table>
    </TableContainer>


</>}
                                    {chatEndReached &&(activeTab===0)&&
                                    <div className="justify-content-center  d-flex mt-5 mb-5">
                                        {selectedMessageGroupOrgs.map((orgItem,index)=>

                                            <div
                                                className="d-flex flex-row align-items-center"

                                                id={`${index}_${orgItem._ts_epoch_ms}-chip`}
                                                key={`${index}_${orgItem._ts_epoch_ms}-chip`}>

                                                <Avatar className="me-2"  aria-label="recipe">
                                                    {getInitials(orgItem.name)}
                                                </Avatar>

                                            </div>

                                        )}

                                    </div>}
                                </>

                            </div>
            {/*)}*/}
    </div>

        </div>

</div>

        </>
    );

    // --------- extra ---------- //

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}>
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <div>{children}</div>
                    </Box>
                )}
            </div>
        );
    }

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            "aria-controls": `simple-tabpanel-${index}`,
        };
    }
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.grey,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        userDetail: state.userDetail,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MessengerMessagesTwoSelectedMessage);
