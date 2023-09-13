import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
    AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArtifactIconDisplayBasedOnMimeType from "../UploadImages/ArtifactIconDisplayBasedOnMimeType";
import moment from "moment/moment";
import MoreMenu from "../MoreMenu";
import CloseIcon from "@mui/icons-material/Close";
import {formatDate} from "@fullcalendar/react";
import {getTimeFormat} from "../../Util/GlobalFunctions";
import {AttachFile, FileCopy} from "@mui/icons-material";

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));


const handleDocActions = (action, key, blob_url) => {


    if (action === "download")
        window.location.href = blob_url;

};
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function DocumentAccordians({uploadedGroup}) {
    const [expanded, setExpanded] = React.useState('panel1');

    const handleChange =
        (panel) => (event, newExpanded) => {
            setExpanded(newExpanded ? panel : false);
        };

    return (
        <div>

            <>

<>
                    <Accordion expanded={expanded === uploadedGroup.composition_carbon._key} onChange={handleChange(uploadedGroup.composition_carbon._key)}>
                        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                            <Typography component={"div"} className="text-capitlize w-100 d-flex justify-content-between"><div>{uploadedGroup.composition_carbon.name} (Version: {uploadedGroup.composition_carbon.version}, {uploadedGroup.composition_carbon.source}, {uploadedGroup.artifacts.length}<AttachFile className="text-blue"/>)</div> <div> <small className="text-right">{getTimeFormat(uploadedGroup.composition_carbon._ts_epoch_ms)}</small></div></Typography>
                        </AccordionSummary>
                        <AccordionDetails>

                            {uploadedGroup.artifacts.map((artifact, index) =>
                            <Typography>
                                <React.Fragment key={artifact._key}>
                                    <div key={index}
                                         className="mt-1 mb-1 text-left pt-1 pb-1  row">
                                        <div className="col-8 ellipsis-end">
                                            <ArtifactIconDisplayBasedOnMimeType
                                                artifact={artifact}
                                            />
                                            <a href={artifact.blob_url} target="_blank"
                                               rel="noopener noreferrer">
                                                                        <span
                                                                            className="ms-4  text-blue text-bold"
                                                                            rel="noopener noreferrer">
                                                                            {artifact.name}
                                                                        </span>
                                            </a>
                                        </div>

                                        <div className="col-2 d-flex align-items-center justify-content-end">
                                            <small className='text-gray-light'>{moment(artifact._ts_epoch_ms).format("DD MMM YYYY")}</small>
                                        </div>

                                        <div className="col-2 d-flex justify-content-end">

                                                <MoreMenu
                                                    triggerCallback={(action) => {
                                                        handleDocActions(action,
                                                            artifact._key,
                                                            artifact.blob_url);
                                                    }}
                                                    download={true}
                                                    // delete={props.isLoggedIn && !props.isArchiver}
                                                />

                                        </div>

                                    </div>

                                </React.Fragment>
                            </Typography>
                            )}
                        </AccordionDetails>
                    </Accordion>


</>

            </>

        </div>
    );
}
