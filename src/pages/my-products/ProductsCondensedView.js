import React from 'react';
import {Card, Paper} from "@mui/material";

const ProductsCondensedView = ({product, index}) => {
    console.log(">>>", product);
    return <row>
        <div className="col">
            <div className="mb-1">
                {product.name && <div className="bg-white rad-4 p-1" elevation={1}>{product.name}</div>}
            </div>
        </div>
    </row>
}

export default ProductsCondensedView;