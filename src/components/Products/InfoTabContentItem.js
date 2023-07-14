import { Info } from '@mui/icons-material'
import { capitalize } from '../../Util/GlobalFunctions'
import CustomPopover from '../FormsUI/CustomPopover'
import OrgComponent from '../Org/OrgComponent'

function InfoTabContentItem({ title, value, simple, simpleTitleClasses, simpleValueClass, unitVolume, category, categoryTitle, categoryType, categoryState, embodiedCarbon, popoverHeading, popoverText, address, addressName, addressValue, serviceAgent }) {
    return (
        <div className='row justify-content-start search-container no-gutters pb-2'>

            {simple && <div className="col-auto">
                <p className={`${simpleTitleClasses ?? "text-label text-label text-blue mb-1"}`}>{title ?? ""}</p>
                <p className={`${simpleValueClass ?? "text-gray-light"}`}>{unitVolume ?? ""} {value ?? ""}</p>
            </div>}

            {category && <div className={"col-12"}>
                <p
                    className=" text-label text-blue mb-1">
                    {title ?? ""}
                </p>
                <span
                    className="text-capitlize mb-1 cat-box text-left">
                    <span className="">
                        {categoryTitle ?? ""}
                    </span><span className="m-1 arrow-cat">&#10095;</span>
                    <span className="text-capitlize">
                        {capitalize(categoryType ?? "")}
                    </span><span className="m-1 arrow-cat">&#10095;</span>
                    <span className="text-capitlize">
                        {capitalize(categoryState ?? "")}
                    </span>
                </span>
            </div>}

            {embodiedCarbon && <div className="col-auto">
                <p className="text-label text-blue mb-1">
                    {title ?? ""}
                </p>
                <p className="text-gray-light mb-1 text-capitalize">
                    {value ?? ""}

                    <CustomPopover
                        heading={popoverHeading ?? ""}
                        text={popoverText ?? ""}
                    > <Info style={{ cursor: "pointer", color: "#d7d7d7" }} fontSize="small" />
                    </CustomPopover>
                </p>
            </div>}

            {address && <div className={"col-auto"}>
                <p className=" text-label text-blue mb-1">{title ?? ""}</p>
                <p
                    className=" text-gray-light mb-1">
                    <span className="me-1">
                        {addressName ?? ""},
                    </span>
                    <span>
                        {addressValue ?? ""}
                    </span>
                </p>
            </div>}

            {serviceAgent && <div className={"col-auto"}>
                <p className="text-label text-label text-blue mb-1">
                    {title ?? ""}
                </p>
                <div className="mb-1">
                    <OrgComponent org={value ?? ""} />
                </div>
            </div>}

        </div>
        // end
    )
}

export default InfoTabContentItem