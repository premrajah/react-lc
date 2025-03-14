import { Accordion, AccordionSummary } from "@mui/material";
import moment from "moment/moment";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NotificationTwoTextDisplay from "./NotificationTwoTextDisplay";
import NotificationsTwoReadAndTracking from "./NotificationsTwoReadAndTracking";
import ReactStringReplaceWithRegex from "../Messages/ReactStringReplaceWithRegex";

const NotificationTwoItemGroup = ({ items }) => {
    const [accordionExpand, setAccordionExpand] = useState(false);

    const handleChange = (panel) => (e, isExpanded) => {
        setAccordionExpand(isExpanded ? panel : false);
    };

    return (
        <div className="bg-white">
            {items.length > 0 &&
                items.map((itemGroup, index) => {
                    return (
                        <div
                            className="row g-1"
                            key={itemGroup[0].Message._key}
                            id={itemGroup[0].Message._key}>
                            <div className="col-9">
                                <Accordion
                                    className="mb-1"
                                    expanded={accordionExpand === itemGroup[0].Message?._key}
                                    onChange={
                                        itemGroup.length > 1
                                            ? handleChange(itemGroup[0].Message?._key)
                                            : undefined
                                    }
                                    // disabled={itemGroup.length === 1}
                                >
                                    <AccordionSummary
                                        expandIcon={itemGroup.length > 1 && <ExpandMoreIcon />}>
                                        <ReactStringReplaceWithRegex
                                            text={itemGroup[0].Message?.text}
                                            entityKey={itemGroup[0].Message?.entity_key}
                                            messageKey={itemGroup[0].Message?._key}
                                        />
                                    </AccordionSummary>
                                    {itemGroup.length > 1 &&
                                        itemGroup.map((ig, i) => {
                                            return (
                                                <NotificationTwoTextDisplay
                                                    key={ig.Message._key}
                                                    text={ig.Message.text}
                                                    entityKey={itemGroup[i].Message?.entity_key}
                                                    messageKey={itemGroup[i].Message?._key}
                                                />
                                            );
                                        })}
                                </Accordion>
                            </div>
                            <div className="col-3">
                                <div className="d-flex justify-content-end align-items-center h-100 pe-3">
                                    <div className="me-2">
                                        <small className="text-gray-light">
                                            {moment(itemGroup[0].Message._ts_epoch_ms).fromNow()}
                                        </small>
                                    </div>
                                    <NotificationsTwoReadAndTracking item={itemGroup[0]} />
                                </div>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};

export default NotificationTwoItemGroup;
