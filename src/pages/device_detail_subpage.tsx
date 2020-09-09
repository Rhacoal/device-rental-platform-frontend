import React from "react";
import {IDevice} from "../wrapper/types";
import MomentUtils from "@date-io/moment";
import {Button, ButtonGroup, Card, Collapse, createStyles, TextField, Typography, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {applyBorrowDevice, applyBorrowDeviceAPIs, deviceDetail} from "../wrapper/requests";
import {useSelector} from "react-redux";
import clsx from "clsx";
import {DateTimePicker, KeyboardDateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';

const useStyles = makeStyles(theme => createStyles({
    margin1: {
        margin: theme.spacing(1)
    },
    root: {
        margin: theme.spacing(1, 1, 2),
    },
    title: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    darkPanel: {
        boxShadow: "inset 0 0 5px rgb(0, 0, 0, 0.7)",
        borderRadius: "5px",
        padding: theme.spacing(2),
        margin: theme.spacing(1),
        display: "flex",
        flexDirection: "column",
        "& .MuiTabs-root": {
            marginLeft: 0,
        }
    },
    success: {
        color: theme.palette.getContrastText(theme.palette.success.dark),
        backgroundColor: theme.palette.success.dark,
        "&:hover": {
            backgroundColor: theme.palette.success.main,
        }
    },
    marginRight1: {
        marginRight: theme.spacing(1),
    },
    marginTop1: {
        marginTop: theme.spacing(1),
    }
}))

export function DeviceDetailSubPage(props: {
    deviceDetail: IDevice,
    showBorrowButton: boolean,

}) {
    const classes = useStyles(useTheme());
    const [open, setOpen] = React.useState(false);
    const [reason, setReason] = React.useState("");
    const [submitting, setSubmitting] = React.useState(false);
    const [succeeded, setSucceeded] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [date, setDate] = React.useState(new Date() as Date | null);

    const handleSubmit = () => {
        if (submitting || succeeded || date === null) {
            return;
        }
        setSubmitting(true);
        applyBorrowDevice(props.deviceDetail.device_id, reason, Math.round(date.getTime() / 1000)).then((result) => {
            if (result.success) {
                setSucceeded(true);
                setSubmitting(false);
            } else {
                setSucceeded(false);
                setSubmitting(false);
                setErrorMessage("result.message");
            }
        }, reason1 => {
            setSubmitting(false);
            setErrorMessage(reason1.toString());
        });
    }

    React.useEffect(() => {
        if (succeeded) {
            const timer = setTimeout(() => {
                setSucceeded(false);
            }, 3000);
            return () => {
                clearTimeout(timer);
            }
        }
    }, [succeeded]);

    return <div className={classes.root}>
        <Typography variant="h6" component="h1" className={classes.title}>
            <span>
                {props.deviceDetail.name}<Typography color="textSecondary"
                                                     component="span">(ID:{' '}{props.deviceDetail.device_id})</Typography>
            </span>
            {props.showBorrowButton ? <Button variant={"outlined"}
                                              color="primary"
                                              className={classes.margin1}
                                              disabled={props.deviceDetail.borrower !== null}
                                              onClick={() => setOpen(!open)}>
                申请借用
            </Button> : null}
        </Typography>
        {props.showBorrowButton ? <Collapse in={open}>
            <div className={classes.darkPanel}>
                <TextField label="申请理由"
                           fullWidth
                           multiline
                           variant="outlined"
                           rows={5}
                           value={reason}
                           onChange={(event) => {
                               setReason(event.target.value)
                           }}
                />
                <div className={clsx(classes.marginTop1, classes.marginRight1)}
                     style={{display: "flex", alignItems: "center"}}>
                    <Typography className={classes.marginRight1} component="span">归还时间: </Typography>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker value={date} minDate={new Date()}
                                                onChange={date => {
                                                    if (date !== null) setDate(date as unknown as Date)
                                                }}
                                                ampm={false} format={"yyyy/MM/dd HH:mm"}/>
                    </MuiPickersUtilsProvider>
                </div>
                <Button color={submitting ? "default" : "primary"} variant="contained"
                        style={{alignSelf: "flex-end"}}
                        className={clsx(succeeded && classes.success, classes.marginTop1)}
                        onClick={handleSubmit}>
                    {succeeded ? "已提交" : "提交申请"}
                </Button>
            </div>
        </Collapse> : null}
        <Typography variant="body2" color="textSecondary">
            由 {props.deviceDetail.owner.name} 提供
        </Typography>
        <Typography variant="body1">
            {props.deviceDetail.description}
        </Typography>
    </div>
}

