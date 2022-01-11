import {useEffect, useState} from "react";
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";


const NotificationsTwo = () => {

    const [allNotifications, setAllNotifications] = useState([])

    useEffect(() => {
        getNotifications();
    }, [])

    const getNotifications = () => {
        axios.get(`${baseUrl}message/notif`)
            .then(res =>  {
                setAllNotifications(res.data.data);
            })
            .catch(error => {
                console.log('notif error ', error.message);
            })
    }

    return <div>
        test
    </div>
}

export default NotificationsTwo;