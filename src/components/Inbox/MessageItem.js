import React from 'react'
import {Alert} from "react-bootstrap";

const MessageItem = ({item}) => {

    const handleCloseMessage = () => {
        console.log('Message closed')
    }

    return (
        <Alert variant="secondary" dismissible onClose={() => handleCloseMessage()}>
            <Alert.Heading>Message title</Alert.Heading>
            <p>
                Message (sample)
            </p>
        </Alert>
    )
}

export default MessageItem