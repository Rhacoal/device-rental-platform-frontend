import React from "react";
import {Typography} from "@material-ui/core";


export function DeviceDescriptionSplitter(value: string) : {
    address: string,
    description: string,
} {
    const addressMatch = value.match(/<address:(.*?)>/);
    let newContent = value;
    let address = ""
    if (addressMatch && addressMatch.length > 0) {
        address = addressMatch[0].substring(9, addressMatch[0].length - 1);
        newContent = newContent.replace(addressMatch[0], "");
    }
    return {
        address, description: newContent,
    }
}

export function DeviceDescription(props: {
    value: string,
}) {
    const {address, description} = DeviceDescriptionSplitter(props.value);
    return (<React.Fragment>
        {address ? <Typography>{`地址: ${address}`}</Typography> : null}
        <Typography>{description}</Typography>
    </React.Fragment>);
}