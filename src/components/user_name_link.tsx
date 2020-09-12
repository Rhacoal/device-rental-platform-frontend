import React from "react";
import {IUserInfo} from "../wrapper/types";
import MuiLink from "@material-ui/core/Link";
import {Link} from "react-router-dom";
import {LocalUrls} from "../constants/local_urls";

export function UserNameLink(props: {userInfo: IUserInfo}) {
    return <MuiLink component={Link} to={{
        pathname: LocalUrls.pm,
        state: {
            userInfo: props.userInfo,
        }
    }}>{props.userInfo.name}</MuiLink>
}