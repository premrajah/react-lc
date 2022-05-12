import React from "react";
import {createMarkup} from "../../Util/Constants";
import moment from "moment/moment";

const MessengerMessageTwoMessageBubble = ({m}) => {
    console.log("> ", m)
    return <div className="w-75 p-2 mb-2 chat-msg-box border-rounded text-blue gray-border">
        <div className="row">
            <div className="col">
                {m && m.orgs.map((o, index) => o.actor === "message_from" && <div className="d-flex justify-content-between">
                    <small className="text-mute">{o.org.org.name}</small>
                    <small className="text-mute">{moment(m.message._ts_epoch_ms).fromNow()}</small>
                </div> )}
            </div>
        </div>

        <div className="row mt-2">
            <div className="col">
                <div
                    dangerouslySetInnerHTML={createMarkup(
                        m ? m.message.text : ""
                    )} style={{lineHeight: '0.8'}} />
            </div>
        </div>

    </div>
}

export default MessengerMessageTwoMessageBubble;