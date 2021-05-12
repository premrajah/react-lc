import React from 'react'
import Notifications from "./Notifications";
import Sidebar from "../../views/menu/Sidebar";
import HeaderDark from "../../views/header/HeaderDark";
import PageHeader from "../PageHeader";

function NotificationPage () {
    return (
        <div>
            <Sidebar />
            <div className="wrapper homepage">
                <HeaderDark />

                <div className="container   pb-5 pt-5">
                    <div className="row">
                        <div className="col">
                            <PageHeader pageTitle="Notifications" subTitle="All notifications can be found on this page" />
                        </div>
                    </div>
                    <div className="row no-gutters">
                        <div className="col">
                            <Notifications />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default  NotificationPage;
