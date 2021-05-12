import React from "react";

const SiteItem = ({ name, address, email, contact, phone, others, itemKey }) => {
    return (
        <>
            <div className="list-group-item mb-2 mt-2 ">
                <p>
                    <span className="blue-text text-bold">{name}</span>
                    <br />
                    {contact ? contact : ""}
                    {address ? `, ${address}` : ""}
                    <br />
                    {email ? email : ""}
                    {phone ? `, ${phone}` : ""}
                    {others ? `, ${others}` : ""}
                </p>
            </div>
        </>
    );
};

export default SiteItem;
