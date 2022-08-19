import React, {useCallback} from "react";
import {Card, Image} from "react-bootstrap";
import PlaceholderImg from "../../img/place-holder-lc.png";
import PlaceHolderImage from "../../img/place-holder-lc.png";
import Org from "../Org/Org";
import moment from "moment/moment";
import {Link} from "@mui/material";
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import {Link as RouterLink} from 'react-router-dom'

const TrackedProductItem = ({item, handleStatus}) => {
    const { listing, product, site, org, artifacts } = item;

    const onError = (ev) => (
        ev.target.src = PlaceholderImg
    )


    const handleUnTrackStatus = useCallback((status) => {
        handleStatus(status);
    }, [])

    const handleUnTrackProduct = () => {
        handleUnTrackStatus('');
        axios.delete(`${baseUrl}product/track/${product._key}`)
            .then(res => {
                if(res.status === 200) {
                    handleUnTrackStatus(<span><span className="me-2">Product: <b>{product.name}</b> was</span><span className="text-success">Un-Tracked Successfully.</span></span>);
                }
            })
            .catch(error => {
                handleUnTrackStatus(<span className="text-warning">Unable to un-track at this time, please try again later.</span>);
            })
    }

   return (
       <div className="row mb-5 pb-2 border-bottom">
           <div className="col-sm-2">
               <Image
                   className="me-2"
                   // src={artifacts.length > 0 ? <ImageOnlyThumbnail images={artifacts} /> : PlaceHolderImage}
                   src={artifacts.length > 0 ? (artifacts.find((item) => (item.mime_type === "image/jpeg" || item.mime_type === "image/png") || {}).blob_url || PlaceholderImg) : PlaceHolderImage}
                   thumbnail
                   width={120}
                   height={60}
                   alt=""
                   onError={onError}
               />
           </div>
           <div className="col-sm-6">
               <Card>
                   {product.name ? <RouterLink to={`/p/${product._key}`}><Card.Title>{product.name}</Card.Title></RouterLink> : null}
                   {product.description ? (
                       <Card.Subtitle>{product.description}</Card.Subtitle>
                   ) : null}
                   {item.sub_products.length > 0 ? (
                       <span>Sub products: {item.sub_products.length}</span>
                   ) : (
                       <span>Sub products: none</span>
                   )}
                   {product ? (
                       <span>
                            {product.category}, {product.purpose}, {product.state}
                        </span>
                   ) : null}
                   {org ? (
                       <span>
                            <Org orgId={org._id} orgDescription={org.description} />
                        </span>
                   ) : null}
               </Card>
           </div>

           <div className="col-sm-4">
               <div className="row no-gutters">
                   <div className="col no-gutters d-flex justify-content-end">
                       <div className="d-flex flex-column align-items-end">
                           <div className="">
                               <Link style={{cursor: 'pointer'}} onClick={() => handleUnTrackProduct()}>Un-track</Link>
                           </div>
                           {product && <div className="text-gray-light small">{moment(product._ts_epoch_ms).format("DD/MM/YY")}</div>}
                       </div>
                   </div>
               </div>
           </div>
       </div>
   )
}

export default TrackedProductItem;
