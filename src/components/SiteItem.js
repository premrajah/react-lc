import React from 'react'
import {Business, Delete, Edit, Info, MailOutline, Person, Phone} from '@material-ui/icons'

const SiteItem = ({name, address, email, contact, phone, others, itemKey}) => {
    return (
        <div className="list-group-item mb-2">
            <p className="blue-text text-bold">{name}</p>
            <div>
                <Person /><span className="pl-1 mr-2">{contact}</span>
                <Business /> <span className="pl-1 mr-2">{address}</span>
                <MailOutline /><span className="pl-1 mr-2">{email}</span>
                <Phone /><span className="pl-1 mr-2">{phone}</span>
                {others ? <span><Info /><span className="pl-1">{others}</span></span> : ''}
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <span><Edit /></span>
                <span className="ml-3"><Delete /></span>
            </div>
        </div>
    )
}

export default SiteItem