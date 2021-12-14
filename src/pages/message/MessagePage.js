import React from 'react'
import Layout from "../../components/Layout/Layout";
import PageHeader from "../../components/PageHeader";
import MessengerMessages from "../../components/Messages/MessengerMessages";

function MessagePage () {
    return (
        <Layout>

                <div className="container   pb-4 pt-4">
                    <div className="row">
                        <div className="col">
                            <PageHeader pageTitle="Messages" subTitle="Send or receive messages here" />
                        </div>
                    </div>

                    <div>
                        <MessengerMessages />
                    </div>

        </div>
        </Layout>
    )
}

export default  MessagePage;

