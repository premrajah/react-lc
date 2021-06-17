import React, {useState} from 'react'
import Notifications from "./Notifications";
import Sidebar from "../../views/menu/Sidebar";
import HeaderDark from "../../views/header/HeaderDark";
import PageHeader from "../PageHeader";

function NotificationPage () {

    const [trackingStatus, setTrackingStatus] = useState('');

    const handleTrackCallback = (status) => {
        if(status === 'success') {
            setTrackingStatus(<span className="text-success">Tracked successfully</span>)
        } else if (status === 'fail') {
            setTrackingStatus(<span className="text-warning">unable to track at this time</span>)
        } else {
            setTrackingStatus('')
        }
    }

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
                            {trackingStatus}
                            <Notifications trackingCallback={(status) => handleTrackCallback(status)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default  NotificationPage;
