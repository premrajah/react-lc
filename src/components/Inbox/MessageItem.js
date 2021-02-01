import React from 'react'
import {Alert} from "react-bootstrap";

const MessageItem = ({item}) => {

    const handleCloseMessage = () => {
        console.log('Message closed')
    }

    return (
        <div>
            <Alert variant="secondary" dismissible onClose={() => handleCloseMessage()}>
                <Alert.Heading>Message title</Alert.Heading>
                <div>
                    Message (sample)
                </div>
            </Alert>
        </div>
    )
}

export default MessageItem