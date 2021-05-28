import React, {useEffect, useState} from 'react'
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import ImageOnlyThumbnail from "../ImageOnlyThumbnail";
import PlaceholderImg from "../../img/place-holder-lc.png";
import moment from "moment/moment";
import MoreMenu from "../MoreMenu";
import {Link} from "react-router-dom";

const SubproductItem = ({item, parentId, remove}) => {
    const [artifacts, setArtifacts] = useState([]);

    useEffect(() => {
        if(item) {
            getArtifactsForProduct(item._key)
        }
    }, [])

    const getArtifactsForProduct = (key) => {
        axios.get(`${baseUrl}product/${key}/artifact`)
            .then(res => {
                const data = res.data.data;
                setArtifacts(data);
            })
            .catch(error => {})
    }

    const removeSubproductFromList = () => {
        if(!parentId) return;

        const payload = {
            product_id: parentId,
            sub_products_ids: [
                item && item.product
                    ? item.product._key
                    : item._key,
            ]
        };

        axios
            .post(`${baseUrl}product/sub-product/remove`, payload)
            .then((res) => {
                if(res.status === 200) {
                    window.location.reload();
                }
            })
            .catch((error) => {});
    }


    const removeProduct = (action) => {
        if(action === 'remove') {
            removeSubproductFromList();
        }
    }


    return <>
        <div className="row no-gutters justify-content-center mt-4 mb-4  pb-4">
            <div className="col-sm-2">
                {
                    artifacts.length > 0
                    ? <ImageOnlyThumbnail images={artifacts} />
                    : <img className={"img-fluid"} src={PlaceholderImg} alt="" />
                }
            </div>

            <div className="col-sm-7 pl-2">
                <div>
                    <Link  to={`/product/${item._key}`}>
                        <h5>{item.name}</h5>
                    </Link>
                </div>
                <div className="text-muted">{item.purpose}</div>
                <div className="text-muted" style={{lineHeight: '22px'}}>
                    <span className="mr-1">{item.category},</span>
                    <span className="mr-1">{item.type},</span>
                    <span className="mr-1">{item.state},</span>
                    <span>{item.volume}</span>
                    <span>{item.units}</span>
                </div>
                {
                    item.search_ids && <div className="text-muted">
                        <span className="mr-1">{item.search_ids.length}</span>
                        <span>Searches</span>
                    </div>
                }
            </div>

            <div className="col-sm-3 d-flex justify-content-end">
                <div>
                    <div className={"text-gray-light small"}>
                        {moment(item._ts_epoch_ms).format("DD MMM YYYY")}
                    </div>
                    <MoreMenu remove={remove} triggerCallback={(action) => removeProduct(action)} />
                </div>
            </div>
        </div>
    </>
}

export default SubproductItem;