import {AccordionDetails} from "@mui/material";

const NotificationTwoTextDisplay = ({text}) => {
    return <AccordionDetails sx={{borderLeft: "2px solid var(--lc-purple)", borderRight: "2px solid var(--lc-purple)"}}>{text}</AccordionDetails>
}

export default NotificationTwoTextDisplay;