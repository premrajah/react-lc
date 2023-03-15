import React, {useEffect, useState} from "react";
import { MIME_TYPES } from "../../Util/Constants";
import OndemandVideoIcon from "@mui/icons-material/YouTube";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionIcon from "@mui/icons-material/Description";
import BrowserNotSupportedIcon from '@mui/icons-material/BrowserNotSupported';
import GlobalDialog from "../RightBar/GlobalDialog";
import ReactPlayer from "react-player/lazy";
import {connect} from "react-redux";
import * as actionCreator from "../../store/actions/actions";

const FileIconStyle = {
    background: "#EAEAEF",
    opacity: "0.5",
    fontSize: " 2.5rem",
};

const ImageIconStyle = {
    height: '40px',
    maxHeight: '40px',
    width: '40px',
    maxWidth: '40px',
    objectFit: 'contain'
}

const FileTypeIconBasedOnMimeType = ({ mimeType, URL = "", showSnackbar }) => {

    const [currentBlobUrl, setCurrentBlobUrl] = useState(null);
    const [currentImageBlobUrl, setCurrentImageBlobUrl] = useState(null);
    const [artifactDialogDisplay, setArtifactDialogDisplay] = useState(false);
    const [artifactImageDialogDisplay, setArtifactImageDialogDisplay] = useState(false);
    const [isReactPlayerReady, setIsReactPlayerReady] = useState(true);

    useEffect(() => {
        setCurrentBlobUrl(null);
        setCurrentImageBlobUrl(null);
    }, [])

    const handleArtifactDialogDisplayOpen = (blobUrl) => {
        setArtifactDialogDisplay(true);
        setCurrentBlobUrl(blobUrl)
    }
    const handleArtifactDialogDisplayClose = () => {
        setArtifactDialogDisplay(false);
        setCurrentBlobUrl(null);
    }

    const handleArtifactImageDialogDisplayOpen = (blobUrl) => {
        setArtifactImageDialogDisplay(true);
        setCurrentImageBlobUrl(blobUrl)
    }

    const handleArtifactImageDialogDisplayClose = () => {
        setArtifactImageDialogDisplay(false);
        setCurrentImageBlobUrl(null);
    }

    const DisplayIcons = (mime) => {
        switch (mime) {
            // Images
            case MIME_TYPES.JPG:
            case MIME_TYPES.JPEG:
            case MIME_TYPES.PNG:
                return <>
                    {/*<ImageIcon*/}
                    {/*    style={FileIconStyle}*/}
                    {/*    className="rad-4 click-item"*/}
                    {/*    onClick={() => handleArtifactImageDialogDisplayOpen(URL)}*/}
                    {/*/>*/}
                    <span
                        className="rad-4 click-item"
                        onClick={() => handleArtifactImageDialogDisplayOpen(URL)}
                    >
                        <img src={URL} alt={URL} style={ImageIconStyle}/>
                    </span>
                </>
            // Videos
            case MIME_TYPES.MOV:
            case MIME_TYPES.MP4:
                return <OndemandVideoIcon
                    style={FileIconStyle}
                    className="rad-4 click-item"
                    onClick={() => handleArtifactDialogDisplayOpen(URL)}
                />;
            // Documents
            case MIME_TYPES.XLSX:
            case MIME_TYPES.XLS:
            case MIME_TYPES.TEXT_RTF:
            case MIME_TYPES.APP_RTF:
            case MIME_TYPES.DOCX:
            case MIME_TYPES.DOC:
            case MIME_TYPES.PDF:
                return (
                    <a href={URL} download>
                        <DescriptionIcon
                            style={FileIconStyle}
                            className="rad-4 click-item"
                        />
                    </a>
                );
            default:
                return <BrowserNotSupportedIcon style={FileIconStyle} />;
        }
    };

    return <>
        {DisplayIcons(mimeType)}

        <GlobalDialog size="md" show={artifactImageDialogDisplay} hide={() => handleArtifactImageDialogDisplayClose()}>
            {currentImageBlobUrl && <div className="d-flex justify-content-center align-items-center" >
                <img style={{width: "50%", maxWidth: '50%', height: "50%", maxHeight: '50%', objectFit: "contain"}} src={currentImageBlobUrl ? currentImageBlobUrl : ""} alt={currentImageBlobUrl} width="50%" height="50%"/>
            </div>}
        </GlobalDialog>

        <GlobalDialog size="md" show={artifactDialogDisplay} hide={() => handleArtifactDialogDisplayClose()}>
            {currentBlobUrl && <div className="react-player-container">
                {isReactPlayerReady && <div>Loading the video, please wait...</div>}
                <ReactPlayer
                    url={currentBlobUrl}
                    controls
                    playing={false}
                    width="100%"
                    onReady={() => setIsReactPlayerReady(false)}
                    onError={() => showSnackbar({ show: true, severity: "warning", message: `Unable to load video at this time` })}
                    onBuffer={() => setIsReactPlayerReady(true)}
                    onBufferEnd={() => setIsReactPlayerReady(false)}
                />
            </div>}
        </GlobalDialog>
    </>;
};

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FileTypeIconBasedOnMimeType);
