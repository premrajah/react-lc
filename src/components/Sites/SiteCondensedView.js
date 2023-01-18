import React, {useState} from "react";
import moment from "moment/moment";
import { GoogleMap } from "../Map/MapsContainer";
import GlobalDialog from "../RightBar/GlobalDialog";
import MapIcon from "@mui/icons-material/Place";

const SiteCondensedView = ({ site, index }) => {

    const [globalDialogLocationView, setGlobalDialogLocationView] = useState(false);

    const handleToggleGlobalDialogLocationView = () => {
        setGlobalDialogLocationView(!globalDialogLocationView);
    }
    console.log(">>> ", site);
    return (
        <div>
            <div className="row">
                <div className="col-md-3 text-truncate">{site.name}</div>
                <div className="col-md-4 text-truncate">{site.address}</div>
                <div className="col-md-2 text-truncate">{site.email}</div>
                <div className="col-md-1 d-flex justify-content-end">
                    <div className="click-item me-1"><MapIcon  fontSize="small" onClick={() => setGlobalDialogLocationView(true)} /></div>
                </div>
                <div className="col-md-2 d-flex justify-content-end">
                    {moment(site._ts_epoch_ms).format("DD MMM YYYY")}
                </div>
            </div>

            <GlobalDialog
                size="md"
                hide={() => handleToggleGlobalDialogLocationView()}
                show={globalDialogLocationView}
                heading={site && site.name}>
                <div className="col-12">
                    {site && (
                        <GoogleMap
                            searchLocation
                            siteId={site._key}
                            width={"100%"}
                            height={"300px"}
                            location={{
                                name: `${site.name}`,
                                location: site.geo_codes.length > 0 && site.geo_codes[0].address_info.geometry.location,
                                isCenter: true,
                            }}
                        />
                    )}
                </div>
            </GlobalDialog>
        </div>
    );
};

export default SiteCondensedView;
