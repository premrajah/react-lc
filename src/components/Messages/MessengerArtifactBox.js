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
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {getTimeFormat} from "../../Util/GlobalFunctions";
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
            <>
                {/*<div className="row">*/}
                {/*    <div className="col-12">*/}

                {m.artifacts.length > 0 &&

                <TableContainer   sx={{ width: "100%" }} component={Paper}>
                    <Table sx={{ width: "100%" }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Type</StyledTableCell>
                                <StyledTableCell align="right">Name</StyledTableCell>
                                <StyledTableCell align="right">Shared On</StyledTableCell>
                                <StyledTableCell align="right">Sent By</StyledTableCell>
                                <StyledTableCell align="right"></StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
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
                        </TableBody>
                    </Table>
                </TableContainer>}

                {/*    </div>*/}
                {/*</div>*/}

            {m.artifacts.length > 0 && (

                    <div className="w-75 p-2 d-none mb-2 chat-msg-box border-rounded text-blue gray-border messenger-message-bubble">

                    <div className="row">
                    <div className="col">
                        <Stack direction="row" spacing={2}>
                            {m.artifacts.map((item) => (
                                <div
                                    key={`${item._ts_epoch_ms}_${item._key}`}
                                    style={{ cursor: "pointer" }}>
                                    <a href={item.blob_url} target="_blank" rel="noreferrer">
                                        <Avatar
                                            alt={item.name}
                                            src={item.blob_url}
                                            sx={{ width: 56, height: 56 }}
                                            variant="square"
                                        />
                                    </a>
                                </div>
                            ))}
                        </Stack>
                    </div>
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
        </>
    );
};


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
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

function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];



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
