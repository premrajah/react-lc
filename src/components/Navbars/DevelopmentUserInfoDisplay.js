import React from "react";

const DevelopmentUserInfoDisplay = ({userDetail}) => {
    return <div className="position-fixed p-1" style={{
        width: "260px",
        height: "140px",
        border: "1px solid rgba(0,0,0,0.5)",
        backgroundColor: "rgba(237, 237, 237, 0.8)",
        borderRadius: "4px",
        top: "65px",
        left: "0",
        color: "var(--lc-purple)",
        zIndex: "9999",
        overflow: "hidden"
    }}>
        <div>User: <b>{userDetail && userDetail.orgId}</b></div>
        <div>Email: <b>{userDetail && userDetail.email}</b></div>
        <div>IsOrgAdmin: {userDetail && userDetail.is_org_admin ? <b>Yes</b> : "No"}</div>
        <div>IsLoopcycleAdmin: {userDetail && userDetail.is_loopcycle_admin ? <b>Yes</b> : "No"} </div>

    </div>
}

export default DevelopmentUserInfoDisplay;