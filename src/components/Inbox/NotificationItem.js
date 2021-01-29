import React from 'react'
import {Alert} from "react-bootstrap";
import moment from "moment/moment";


const NotificationItem = ({item}) => {

    const {_id, _key, _ts_epoch_ms, type, text} = item;

    const handleOnClose = (key) => {
        console.log('[NotifItem] ', key)
    }

    return(
        <Alert variant={type === 'notification' ? 'success' : 'primary'} onClose={() => handleOnClose(_key)} dismissible>
            {moment(_ts_epoch_ms).format('DD MMM YYYY')} : {text}
        </Alert>
    )
}

export default NotificationItem