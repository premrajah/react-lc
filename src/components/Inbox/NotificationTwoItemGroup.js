import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent } from "@mui/material";
import NotIcon from "@mui/icons-material/HdrWeak";
import moment from "moment/moment";
import { CheckCircle } from "@mui/icons-material";
import ActionIconBtn from "../FormsUI/Buttons/ActionIconBtn";
import axios from "axios";
import { baseUrl } from "../../Util/Constants";
import { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


const NotificationTwoItemGroup = ({ items }) => {
    console.log(">>++ ", items);
    const [accordionExpand, setAccordionExpand] = useState(false);

    const [read, setRead] = useState(null);
    const [tracked, setTracked] = useState(null);
    const [owned, setOwned] = useState(null);

    // useEffect( async () => {
    //     try {
    //         const checkIfOwned = await isProductOwned(item.Message.entity_key);
    //         const checkTrackedStatus = await isProductTracked(item.Message.entity_key);
    //
    //     } catch (error) {
    //         console.log("notif error ", error)
    //     }
    // }, []);


    const handleChange = panel => (e,isExpanded) => {
        setAccordionExpand(isExpanded ? panel : false);
    }

    const messageRead = (key) => {
        if (!key) return;

        const payload = {
            msg_id: key,
        };

        axios
            .post(`${baseUrl}message/read`, payload)
            .then(
                (res) => {
                    if (res.status === 200) {
                        setRead(true);
                    }
                },
                (error) => {}
            )
            .catch((error) => {
                this.setState({ readNotificationAlert: false });
            });
    };

    const isProductTracked = (entityKey) => {
        if (!entityKey) return;
        axios
            .get(`${baseUrl}product/${entityKey}/tracked`)
            .then((res) => {
                setTracked(res.data.data);
            })
            .catch((error) => {
                console.log(`tracked error ${error.message}`);
            });
    };

    const trackProduct = (productEntityKey) => {
        if (!productEntityKey) return;
        const payload = {
            product_id: productEntityKey,
        };

        axios
            .post(`${baseUrl}product/track`, payload)
            .then((res) => {
                if (res.status === 200) {
                    // TODO display message that product is tracked
                }
            })
            .catch((error) => {
                console.log(`tracking failed ${error}`);
            });
    };

    const unTrackProduct = (productKey) => {
        if (!productKey) return;
        axios
            .delete(`${baseUrl}product/track/${productKey}`)
            .then((res) => {
                if (res.status === 200) {
                    // TODO display message that product is untracked
                }
            })
            .catch((error) => {
                console.log(`un-track failed ${error}`);
            });
    };

    const isProductOwned = (entityKey) => {
        if (!entityKey) return;
        axios
            .get(`${baseUrl}product/${entityKey}/owned`)
            .then((res) => {
                console.log("owned > ", res.data.data);
            })
            .catch((error) => {
                console.log(`owned error ${error.message}`);
            });
    };

    return (
        <div className="bg-white">
            {items.length > 0 &&
                items.map((itemGroup, index) => {
                    return (
                        <div className="row g-1">
                            <div className="col-10">
                                <Accordion
                                    className="mb-1"
                                    key={itemGroup[0].Message._key}
                                    id={itemGroup[0].Message._key} expanded={accordionExpand === itemGroup[0].Message._key}
                                    onChange={handleChange(itemGroup[0].Message._key)}
                                    disabled={itemGroup.length === 1}
                                >
                                    <AccordionSummary  expandIcon={itemGroup.length > 1 && <ExpandMoreIcon />}>
                                        <div className="">{itemGroup[0].Message.text}</div>
                                    </AccordionSummary>
                                    {itemGroup.length > 1 &&
                                        itemGroup.map((ig, i) => {
                                            // console.log("=> ", ig)
                                            return <div>
                                                <AccordionDetails>{ig.Message.text}</AccordionDetails>
                                            </div>;
                                        })}
                                </Accordion>
                            </div>
                            <div className="col-2">
                                <div className="">
                                    extra
                                </div>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};

export default NotificationTwoItemGroup;
