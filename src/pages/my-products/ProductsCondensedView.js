import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { baseUrl } from "../../Util/Constants";
import VisibilityIcon from "@mui/icons-material/Visibility";
import moment from "moment/moment";
import GlobalDialog from "../../components/RightBar/GlobalDialog";
import axios from "axios/index";
import placeholderImg from "../../img/place-holder-lc.png";
import ProductItem from "../../components/Products/Item/ProductItem";
import MapIcon from "@mui/icons-material/Place";
import {GoogleMap} from "../../components/Map/MapsContainer";
import {Link} from "react-router-dom";

const ProductsCondensedView = ({ product, index, site }) => {
    const [globalDialogView, setGlobalDialogView] = useState(false);
    const [globalDialogLocationView, setGlobalDialogLocationView] = useState(false);
    const [artifacts, setArtifacts] = useState(null);

    useEffect(() => {
        getArtifacts(product._key);
    }, []);

    const getArtifacts = (productId) => {
        axios
            .get(`${baseUrl}product/${productId}/artifact`)
            .then((res) => {
                const data = res.data.data;
                if (data.length > 0) {
                    setArtifacts(data);
                }
            })
            .catch((error) => {
                console.debug("get artifact error ", error);
            });
    };

    const handleToggleGlobalDialogView = () => {
        setGlobalDialogView(!globalDialogView);
    };

    const handleToggleGlobalDialogLocationView = () => {
        setGlobalDialogLocationView(!globalDialogLocationView);
    }

    return (
        <div className="row bg-white rad-4 p-1 mb-1">
            <div className="col-md-4 d-flex justify-content-start align-items-center">
                {artifacts && artifacts.length > 0 ? (
                    <div>
                        <Avatar
                            variant="rounded"
                            sx={{ height: 30, width: 30 }}
                            src={artifacts[0].blob_url}
                        />
                    </div>
                ) : (
                    <div>
                        <Avatar
                            variant="rounded"
                            sx={{ height: 30, width: 30 }}
                            src={placeholderImg}
                        />
                    </div>
                )}
                <div className="ms-2 text-truncate"><Link to={`/product/${product._key}`}>{product.name}</Link></div>
            </div>

            <div className="col-md-3 d-flex justify-content-start align-items-center">
                {site &&site.geo_codes&&site.geo_codes.length>0 && <div className="click-item me-1"><MapIcon  fontSize="small" onClick={() => setGlobalDialogLocationView(true)} /></div>}
                <div className="text-truncate">{site.name}</div>
            </div>


            <div className="col-md-2 d-flex justify-content-center align-items-center text-truncate">
                <div>{product.sku.serial}</div>
            </div>


            <div className="col-md-2 d-flex justify-content-end align-items-center">
                <div className="click-item"><VisibilityIcon fontSize="small" onClick={() => setGlobalDialogView(true)} /></div>
            </div>

            <div className="col-md-1 d-flex justify-content-end align-items-center">
                <div>
                    <small>
                        <small className="text-gray-light">
                            {moment(product._ts_epoch_ms).format("DD MMM YYYY")}
                        </small>
                    </small>
                </div>
            </div>

            <GlobalDialog
                size="md"
                hideHeader
                hideClose
                hide={() => handleToggleGlobalDialogView()}
                show={globalDialogView}
                removePadding
                heading={product && product.name}>
                <div className="col-12">
                    <ProductItem
                        item={product}
                        index={index}
                        site={site}
                        hideMore
                        goToLink
                        delete={false}
                        edit={false}
                        remove={false}
                        duplicate={false}
                    />
                </div>
            </GlobalDialog>

            <GlobalDialog
                size="md"
                hide={() => handleToggleGlobalDialogLocationView()}
                show={globalDialogLocationView}
                heading={site && site.name}
            >
                <div className="col-12">
                    {site &&site.geo_codes&&site.geo_codes.length>0&&
                        <GoogleMap searchLocation siteId={site._key} width={"100%"} height={"300px"}
                                location={{
                                    name: `${site.name}`,
                                    location: site.geo_codes[0].address_info.geometry.location,
                                    isCenter: true
                                }}/>}
                </div>
            </GlobalDialog>
        </div>
    );
};

export default ProductsCondensedView;
