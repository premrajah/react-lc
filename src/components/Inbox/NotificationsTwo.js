import { useEffect, useState } from "react";
import axios from "axios/index";
import { baseUrl } from "../../Util/Constants";
import NotificationTwoItemGroup from "./NotificationTwoItemGroup";
import PaginationLayout from "../../components/IntersectionOserver/PaginationLayout";
import * as _ from 'lodash'

const NotificationsTwo = () => {
    const [allNotifications, setAllNotifications] = useState([]);
    const [allNotificationsCount, setAllNotificationsCount] = useState(0);
    const [lastPageReached, setLastPageReached] = useState(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);


    const getNotifications = () => {
        setLoading(true);

        if (page === 0) {
            getNotificationsCount();
        }

        axios
            .get(
                `${baseUrl}seek?name=Message&relation=message_to&count=false&offset=${page}&size=${pageSize}&filters=type:notification&include-to=Org:any&include-to=Message:any`
            )
            .then((res) => {
                const data = res.data.data;

                if (data.length === 0) {
                    setLastPageReached(true);
                } else {
                    setLastPageReached(false);
                    setPage(page + pageSize);
                }

                const groupedByEntityType = _.groupBy(data, "Message.entity_as_json._key");
                const toArray = _.values(groupedByEntityType);
                setLoading(false);
                setAllNotifications(prevState => prevState.concat(toArray));

            })
            .catch((error) => {
                console.log(`notification error ${error.message}`);
                setLoading(false)
            });
    };

    const getNotificationsCount = () => {
        axios
            .get(
                `${baseUrl}seek?name=Message&relation=message_to&count=true&offset=0&size=100&filters=type:notification&include-to=Org:any&include-to=Message:any`
            )
            .then((res) => {
                const data = res.data.data;
                setAllNotificationsCount(data);
            })
            .catch((error) => {
                console.log(`notification count error ${error.message}`);
            });
    }


    return (
        <>
            <PaginationLayout
                hideSearch
                count={allNotificationsCount}
                visibleCount={allNotifications.length}
                loadingResults={loading}
                lastPageReached={lastPageReached}
                loadMore={() => getNotifications()}
            >
                <NotificationTwoItemGroup items={allNotifications} />
            </PaginationLayout>

        </>
    );
};

export default NotificationsTwo;
