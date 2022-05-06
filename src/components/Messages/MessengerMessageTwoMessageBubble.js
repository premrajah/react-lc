import React from "react";
import {createMarkup} from "../../Util/Constants";

const MessengerMessageTwoMessageBubble = ({m}) => {
    return <div className="w-75 p-2 mb-2 chat-msg-box border-rounded text-blue gray-border">
        <div className="row">
            <div className="col">
                org
            </div>
        </div>

        <div className="row">
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