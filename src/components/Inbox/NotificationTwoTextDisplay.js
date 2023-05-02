import { AccordionDetails } from "@mui/material";
import ReactStringReplaceWithRegex from "../Messages/ReactStringReplaceWithRegex";

const NotificationTwoTextDisplay = ({ text, entityKey, messageKey }) => {

    return (
        <>
            <AccordionDetails
                sx={{
                    borderLeft: "2px solid var(--lc-purple)",
                    borderRight: "2px solid var(--lc-purple)",
                }}>
                <ReactStringReplaceWithRegex text={text} entityKey={entityKey} messageKey={messageKey} />
            </AccordionDetails>
        </>
    );
};

export default NotificationTwoTextDisplay;
