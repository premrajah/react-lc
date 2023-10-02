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
import {getFileExtension, getDateFormat, getTimeFormat} from "../../Util/GlobalFunctions";
import {AttachFile, FileCopy} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import {useEffect} from "react";
import CustomMoreMenu from "../FormsUI/CustomMoreMenu";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";

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

// M9vIfzwKjP





const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

 function DocumentAccordians({uploadedGroup,editDocGroup,disableEdit,orgId,showSnackbar}) {
    const [expanded, setExpanded] = React.useState('panel1');
    const [downloads, setDownloads] = React.useState([]);
     const [activeArtifact, setActiveArtifact] = React.useState([]);
    const editItem=(item)=>{

        if (!disableEdit)
        editDocGroup(item)

    }

    useEffect(()=>{

        if (uploadedGroup)
        setDownloads(uploadedGroup.artifacts)
    },[])

    const calCarbon = async (artifactId) => {

        setActiveArtifact(artifactId)

        try {
            const uploadedFiles = await axios.post(
                `${baseUrl}carbon/compute`,
                {
                    artifact_id: artifactId,
                    composition_carbon_id: uploadedGroup.composition_carbon._key,
                    org_id:orgId
                }
            ).finally(() => {
                showSnackbar({
                    show: true,
                    severity: "success",
                    message: "Document created successfully. Thanks",
                });
            });

            if (uploadedFiles)
            setDownloads(uploadedFiles.data?.data?.artifacts)

        } catch (error) {
            console.log("handleUploadFileToProduct try/catch error ", error);
            // setIsLoading(false);
            showSnackbar({
                show: true,
                severity: "warning",
                message: "Unable to add artifact at this time.",
            });
        }
    };

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
                            <div component={"div"} className="text-capitlize w-100 d-flex justify-content-between"><div>{uploadedGroup.composition_carbon.name} - Ver.{uploadedGroup.composition_carbon.version}, {uploadedGroup.composition_carbon.source}, {uploadedGroup.artifacts.length}<AttachFile fontSize="small" className="text-blue"/> <p className="text-right text-12">{getDateFormat(uploadedGroup.composition_carbon._ts_epoch_ms)}</p></div> {!disableEdit&&<div onClick={(event)=>{event.stopPropagation();  editItem(uploadedGroup);}}><EditIcon fontSize="small" /> </div>}</div>
                        </AccordionSummary>
                        <AccordionDetails>
                            {downloads.map((artifact, index) =>
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
                                            <small className='text-gray-light'>{getTimeFormat(artifact._ts_epoch_ms)}</small>
                                        </div>
                                        {disableEdit &&
                                            <div className="col-2 d-flex align-items-center justify-content-end">

                                            {getFileExtension(artifact.blob_url).includes("csv?")?<CustomMoreMenu
                                                actions={[{label:"Calculate Carbon", value:"calculate"}]}
                                                triggerCallback={()=>calCarbon(artifact._key)}
                                            />:null}
                                        </div>}


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


const mapStateToProps = (state) => {
    return {
        userDetail: state.userDetail,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {

        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DocumentAccordians);