import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { capitalize } from "../../Util/GlobalFunctions";
import { baseUrl } from "../../Util/Constants";
import VisibilityIcon from "@mui/icons-material/Visibility";
import moment from "moment/moment";
import GlobalDialog from "../../components/RightBar/GlobalDialog";
import axios from "axios/index";
import placeholderImg from "../../img/place-holder-lc.png";
import ProductItem from "../../components/Products/Item/ProductItem";

const ProductsCondensedView = ({ product, index, site }) => {
    const [globalDialogView, setGlobalDialogView] = useState(false);
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
                <div className="ms-2 text-truncate">{product.name}</div>
            </div>

            <div className="col-md-5 d-flex justify-content-start align-items-center">
                <div>
                    <span className="text-capitlize">
                        <small>{capitalize(product.category)}</small>
                    </span>
                    <span className={"m-1 arrow-cat"}>&#10095;</span>
                    <span className=" text-capitlize">
                        <small>{capitalize(product.type)}</small>
                    </span>
                    <span className={"m-1 arrow-cat"}>&#10095;</span>
                    <span className="  text-capitlize">
                        <small className="text-truncate">{capitalize(product.state)}</small>
                    </span>
                </div>
            </div>

            <div className="col-md-2 d-flex justify-content-end align-items-center">
                <VisibilityIcon fontSize="small" onClick={() => setGlobalDialogView(true)} />
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
                hide={() => handleToggleGlobalDialogView()}
                show={globalDialogView}
                heading={product.name}>
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
        </div>
    );
};

export default ProductsCondensedView;
