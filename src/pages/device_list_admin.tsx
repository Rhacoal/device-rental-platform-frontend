import {RouteComponentProps} from "react-router-dom";
import {DeviceListPage} from "./device_list";
import React from "react";

export function DeviceListAdminPage(props: RouteComponentProps) {
    return <DeviceListPage admin={true} title={"所有设备管理 (管理员)"}/>
}
