import * as React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';


export default function SubproductItemSkeleton() {
    return (
        <Box sx={{ overflow: 'hidden' }}>
            <div className="row no-gutters  justify-content-center mb-2 white-bg p-2 rad-8">
                <div className="col-2">

                    <Skeleton variant="rectangular" width={110} height={110} />
                </div>

                <div className="col-10">
                    <Skeleton width="30%"/>
                    <Skeleton width="60%" />
                    <Skeleton width="10%" />
                </div>
            </div>

        </Box>
    );
}
