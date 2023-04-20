import { useEffect, useState } from "react";
import axios from "axios/index";
import { baseUrl } from "../../Util/Constants";
import NotificationTwoItemGroup from "./NotificationTwoItemGroup";
import * as _ from 'lodash'

const NotificationsTwo = () => {
    const [allNotifications, setAllNotifications] = useState([]);

    useEffect(() => {
        getNotifications();
    }, []);

    const getNotifications = () => {
        axios
            .get(
                `${baseUrl}seek?name=Message&relation=message_to&count=false&offset=0&size=100&filters=type:notification&include-to=Org:any&include-to=Message:any`
            )
            .then((res) => {
                const data = res.data.data;
                const groupedByEntityType = _.groupBy(data, "Message.entity_as_json._key");
                const toArray = _.values(groupedByEntityType);
                setAllNotifications(toArray);
            })
            .catch((error) => {
                console.log(`notif error ${error.message}`);
            });
    };


    return (
        <div>
            {allNotifications.length > 0 && <NotificationTwoItemGroup items={allNotifications} />}
        </div>
    );
};

export default NotificationsTwo;
