import React from "react";
import { Info } from "@mui/icons-material";
import { connect } from "react-redux";
import { OverlayTrigger, Popover } from "react-bootstrap";

const OrgComponent = (props) => {

    const orgPopover = (
        <Popover id="org-popover">
            <div className={"p-3"}>

                <span className={"title-bold"} style={{ textTransform: "capitalize" }}>{props.org.name}</span>
<br/>
            {props.org.description && (
               <>
                <span className={"text-gray-light  "}>

                                {props.org.description}
                       </span>
                   <br/>
                    <span className={"text-gray-light  "}>Email: <span className={"text-pink"}>{props.org.email }</span></span>
               </>
            )}
            </div>
        </Popover>
    );

    if (!props.org) {
        return "";
    }

    return (
        <>
            <div style={{ display: "inline-flex", justifyContent: "center", alignItems: "center" }}>
                <div
                    className="mr-1 text-gray-light "
                    style={{
                        textTransform: "capitalize",
                        fontWeight: "700",
                        // color : "#444",
                    }}><span className={"sub-title-text-pink"}> {props.org.name}</span>
                </div>
                <OverlayTrigger
                    trigger={ ["hover", "focus"]}
                    placement={"bottom"}
                    overlay={orgPopover}
                >
                    <Info
                        style={{ cursor: "pointer", color: "#d7d7d7" }}
                        fontSize={"small"}
                    />
                </OverlayTrigger>
            </div>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        userDetail: state.userDetail,
        isLoggedIn: state.isLoggedIn,
    };
};

const mapDispatchToProps = () => {
    return {};
};

export default connect(mapStateToProps)(OrgComponent);
