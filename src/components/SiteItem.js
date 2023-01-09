import React, {useState} from "react";
import EditIcon from '@mui/icons-material/Edit';
import Close from "@mui/icons-material/Close";
import EditSite from "./Sites/EditSite";
import MapIcon from '@mui/icons-material/Place';
import {GoogleMap} from "./Map/MapsContainer";
import axios from "axios";
import {baseUrl} from "../Util/Constants";
import {Spinner} from "react-bootstrap";

const SiteItem = ({site}) => {
    const { key, name, address, email, contact, phone, others, itemKey, is_head_office } = site;
    const [showModal, setShowModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showMap, setShowMap] = useState(false);
    const [loading, setLoading] = useState(false);
    const [productCount, setProductCount] = useState(0);
    const handleOpenModal = () => {
        setErrorMsg('')
        setShowModal(true);
    }



    const handleMapModal = () => {
        setLoading(true)

        getProductsCount()

    }
    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleSubmitCallback = (errorMessage) => {
        setErrorMsg(errorMessage);
        handleCloseModal();
    }


    const getProductsCount=()=>{

        axios.get(`${baseUrl}site/${key}/product/no-parent`).then(
            (response) => {
                let responseAll = response.data.data;

           setProductCount(responseAll.length)


                setLoading(false);
            },
            (error) => {
                // this.setState({
                //     notFound: true,
                // });
                setLoading(false);
                setShowMap(!showMap);
            }
        );
    }


    // GET
    // https://graph-dev.makealoop.io/api/2/site/Qpbs7Rd1F1/product/no-parent

    return (
        <>
            <div className="list-group-item mb-2 mt-2 ">
                <div>
                    <div className="d-flex">
                        <div className="blue-text text-bold flex-grow-1">{name} {is_head_office && <span className="mr-2"><small>(Head Office)</small></span>}</div>

                        <div className={"click-item"}>
                            {!loading? <MapIcon className={"mr-2"} fontSize="small" onClick={() => handleMapModal()} />:
                                <Spinner
                                    className="me-2"
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />}
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
                                               locations={[{name:`${name} (${productCount} Products)`,location:site.geo_codes[0].address_info.geometry.location,isCenter:true}]} />
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
