import React from 'react'
import {Alert} from "react-bootstrap";

const MessageItem = ({item, onDelete}) => {

    const handleCloseMessage = () => {

        onDelete('//TODO key')
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