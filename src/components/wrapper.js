import React from 'react';

export default function Wrapper({ parent, children }) {
    console.log(parent.type)
    //let Wrapper = React.isValidElement(parent) ? React.cloneElement(parent, null, children) : React.cloneElement(React.Fragment,null,children) //fallback in case you dont want to wrap your components
    let Wrapper = parent
    return (
        <Wrapper>
            {
                children
            }
        </Wrapper>
    )
}