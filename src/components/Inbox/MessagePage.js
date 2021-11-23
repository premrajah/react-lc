import React from 'react'
import Sidebar from "../../views/menu/Sidebar";
import HeaderDark from "../../views/header/HeaderDark";
import PageHeader from "../PageHeader";
import MessengerMessages from "../Messages/MessengerMessages";

function MessagePage () {
    return (
        <div>
            <Sidebar />
            <div className="wrapper homepage">
                <HeaderDark />

                <div className="container   pb-5 pt-5">
                    <div className="row">
                        <div className="col">
                            <PageHeader pageTitle="Messages" subTitle="Send or receive messages here" />
                        </div>
                    </div>

                    <div>
                        <MessengerMessages />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default  MessagePage;

