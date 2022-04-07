import React from "react";
import Layout from "../../components/Layout/Layout";
import PageHeader from "../../components/PageHeader";
import MessengerMessages from "../../components/Messages/MessengerMessages";
import MessengerMessagesTwo from "../../components/Messages/MessengerMessagesTwo";

function MessagePage() {
    return (
        <Layout>
            <div className="container   pb-4 pt-4">

                        <PageHeader pageTitle="Messages" subTitle="Send or receive messages here" />
                        {/*<MessengerMessages />*/}
                        <MessengerMessagesTwo />
            </div>
        </Layout>
    );
}

export default MessagePage;
