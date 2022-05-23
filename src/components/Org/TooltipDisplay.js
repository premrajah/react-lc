import React from "react";
import { Tooltip, tooltipClasses } from "@mui/material";
import styled from "@emotion/styled";

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#f5f5f9",
        color: "rgba(0, 0, 0, 0.87)",
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: "1px solid var(--lc-purple)",
    },
}));

const TooltipDisplay = ({ children, org }) => {
    return (
        <>
            <HtmlTooltip
                title={
                    <React.Fragment>
                        {org.name && (
                            <div>
                                <span className="mr-1">Name</span>
                                <span className="text-pink">{org.name}</span>
                            </div>
                        )}
                        {org.email && (
                            <div>
                                <span className="mr-1">Email</span>
                                <span className="text-pink">{org.email}</span>
                            </div>
                        )}
                        {org.description && (
                            <div>
                                <span className="mr-1">Description</span>
                                <span className="blue-text">{org.description}</span>
                            </div>
                        )}
                    </React.Fragment>
                }>
                {children}
            </HtmlTooltip>
        </>
    );
};

export default TooltipDisplay;
