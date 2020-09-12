import React from "react";
import {Typography} from "@material-ui/core";
import {IDevice, IMetaHeaders} from "../wrapper/types";
import {KeyValueView} from "../pages/user_list";
import {MetaKeyDescription} from "../constants/meta_header_keys";


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

export function DeviceDetailRenderer(props: {
    description: string,
    meta: IMetaHeaders,
    // editMode: boolean,
    // onChange: (name: string, description: string, meta: IMetaHeaders) => unknown,
}) {
    // const {address, description} = DeviceDescriptionSplitter(props.value);
    const { description, meta } = props;
    const address = meta.address || "";
    return (<React.Fragment>
        {address ? <KeyValueView keyString={MetaKeyDescription.address} value={address}/> : null}
        <Typography>{description}</Typography>
    </React.Fragment>);
}