import React from "react";
import { Info } from "@material-ui/icons";
import { connect } from "react-redux";
import { OverlayTrigger, Popover}  from "react-bootstrap";

const Org = ({ orgId, orgDescription, orgFirstName, orgLastName, orgEmail, placement, trigger, textColor, infoColor }) => {

    const orgNameSub = orgId ? orgId.substr(4) : '';

    const orgPopover = (
        <Popover id="org-popover">
            <Popover.Title as="h3"><span style={{textTransform: 'capitalize'}}>{orgId ? orgNameSub : ''}</span></Popover.Title>
            <Popover.Content>
                {orgFirstName && orgLastName ? <p><span>`${orgFirstName} ${orgLastName}`</span></p> : ''}
                {orgDescription ? <p>{orgDescription}</p>: ''}
                <p>{orgEmail ? `Email: ${orgEmail}` : ''}</p>
            </Popover.Content>
        </Popover>
    )

    if(!orgId) { return ''}

    return (
        <div style={{ display: "inline-flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ textTransform: "capitalize", fontWeight: '700', color: textColor ? textColor : '#07AD88' }}>{orgNameSub}</div>
            <OverlayTrigger trigger={trigger ? trigger : 'click'} placement={placement ? placement : 'right'} overlay={orgPopover}>
                <Info style={{cursor: 'pointer', color: infoColor ? infoColor : '#27245C'}}></Info>
            </OverlayTrigger>
        </div>
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
