import React from "react";
import { Info } from "@material-ui/icons";
import { connect } from "react-redux";
import { OverlayTrigger, Popover } from "react-bootstrap";

const Org = ({
    orgId,
    orgName,
    orgDescription,
    orgFirstName,
    orgLastName,
    orgEmail,
    placement,
    trigger,
    textColor,
    infoColor,
}) => {
    const orgNameSub = orgId ? orgId.substr(4) : "";

    const orgPopover = (
        <Popover id="org-popover">
            <Popover.Title as="h3">
                <span style={{ textTransform: "capitalize" }}>{orgId ? orgNameSub : ""}</span>
            </Popover.Title>
            <Popover.Content>
                {orgName ? <p>{orgName}</p> : ""}
                {orgFirstName && orgLastName ? (
                    <p>
                        <span>
                            `${orgFirstName} ${orgLastName}`
                        </span>
                    </p>
                ) : (
                    ""
                )}
                {orgDescription ? <p>{orgDescription}</p> : ""}
                {orgEmail ? <p>`Email: ${orgEmail}`</p> : ""}
            </Popover.Content>
        </Popover>
    );

    if (!orgId) {
        return "";
    }

    return (
        <>
            <div style={{ display: "inline-flex", justifyContent: "center", alignItems: "center" }}>
                <div
                    className="mr-1"
                    style={{
                        textTransform: "capitalize",
                        fontWeight: "700",
                        color: textColor ? textColor : "#07AD88",
                    }}>
                    {orgNameSub}
                </div>
                <OverlayTrigger
                    trigger={trigger ? trigger : ['hover', 'focus']}
                    placement={placement ? placement : "right"}
                    overlay={orgPopover}>
                    <Info style={{ cursor: "pointer", color: infoColor ? infoColor : "#27245C" }} />
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

export default connect(mapStateToProps)(Org);
