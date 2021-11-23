import React, {useState} from "react";
import EditIcon from '@mui/icons-material/Edit';
import Close from "@mui/icons-material/Close";
import EditSite from "./Sites/EditSite";
import MapIcon from '@mui/icons-material/Place';
import {GoogleMap} from "./Map/MapsContainer";

const SiteItem = ({site}) => {
    const { key, name, address, email, contact, phone, others, itemKey, is_head_office } = site;
    const [showModal, setShowModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showMap, setShowMap] = useState(false);
    const handleOpenModal = () => {
        setErrorMsg('')
        setShowModal(true);
    }



    const handleMapModal = () => {

        setShowMap(!showMap);
    }
    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleSubmitCallback = (errorMessage) => {
        setErrorMsg(errorMessage);
        handleCloseModal();
    }

    return (
        <>
            <div className="list-group-item mb-2 mt-2 ">
                <div>
                    <div className="d-flex">
                        <div className="blue-text text-bold flex-grow-1">{name} {is_head_office && <span className="mr-2"><small>(Head Office)</small></span>}</div>

                        <div className={"click-item"}>
                            <MapIcon className={"mr-2"} fontSize="small" onClick={() => handleMapModal()} />
                            <EditIcon fontSize="small" onClick={() => handleOpenModal()} />
                        </div>

                    </div>
                    <div>
                        <span>{contact ? contact : ""}</span>
                        <span>{address ? `, ${address}` : ""}</span>
                    </div>
                    <div>
                        <span>{email ? email : ""}</span>
                        <span>{phone ? `, ${phone}` : ""}</span>
                        <span>{others ? `, ${others}` : ""}</span>
                    </div>
                    <div>{errorMsg}</div>
                </div>
            </div>

            {showModal && (
                <>
                    <div className={"body-overlay"}>
                        <div className={"modal-popup site-popup"}>
                            <div className=" text-right ">
                                <Close
                                    onClick={() => handleCloseModal()}
                                    className="blue-text click-item"
                                    style={{ fontSize: 32 }}
                                />
                            </div>

                            <div className={"row"}>
                                <div className={"col-12"}>
                                    <EditSite editable site={site} submitCallback={(errMsg) => handleSubmitCallback(errMsg)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {showMap && (
                <>
                    <div className={"body-overlay"}>
                        <div className={"modal-popup site-popup"}>
                            <div className=" text-right ">
                                <Close
                                    onClick={() => handleMapModal()}
                                    className="blue-text click-item"
                                    style={{ fontSize: 32 }}
                                />
                            </div>

                            <div className={"row"}>
                                <div className={"col-12"}>
                                    {site.geo_codes&&site.geo_codes[0] &&
                                    <GoogleMap width={"100%"}  height={"300px"}
                                               locations={[{name:name,location:site.geo_codes[0].address_info.geometry.location,isCenter:true}]} />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default SiteItem;
