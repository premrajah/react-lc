import React from 'react';


function DynamicElement({element,children, ...otherProps}) {

    const CustomTag = (element) ? element : 'div';



    return (
        <CustomTag {...otherProps}>
            {children}
        </CustomTag>
    );
}

export default (DynamicElement);
