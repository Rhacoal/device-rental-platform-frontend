import React from "react";
import {IComment, IDevice} from "../wrapper/types";
import MomentUtils from "@date-io/moment";
import {
    Button,
    ButtonGroup,
    Card,
    Collapse,
    createStyles,
    List, ListItem, ListItemText,
    TextField,
    Typography,
    useTheme
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {
    applyBorrowDevice,
    applyBorrowDeviceAPIs,
    commentDelete,
    commentList, commentSend,
    deviceDetail,
    deviceEdit, returnDevice
} from "../wrapper/requests";
import {useSelector} from "react-redux";
import clsx from "clsx";
import {DateTimePicker, KeyboardDateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import {Alert, Pagination} from "@material-ui/lab";
import {formatTime} from "../utils/time_format";
import {MaxCommentsPerPage} from "../constants/constants";

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
        // boxShadow: "inset 0 0 5px rgb(0, 0, 0, 0.7)",
        borderColor: theme.palette.divider,
        border: "solid 1px",
        borderRadius: theme.spacing(1),
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
    },
    marginTopBottom1: {
        margin: theme.spacing(1, 0),
    },
    list: {
        border: "solid",
        borderWidth: "1px 0",
        // borderRadius: theme.spacing(1),
        borderColor: theme.palette.divider,
        margin: theme.spacing(1, 0),
    },
}))

export function DeviceCommentSubPage(props: {
    deviceId: number,
    open: boolean,
}) {
    const classes = useStyles(useTheme());
    const [thisCommentList, setCommentList] = React.useState([] as IComment[])
    const [refresh, setRefresh] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [newComment, setNewComment] = React.useState("");
    const [page, setPage] = React.useState(1);

    React.useEffect(() => {
        if (!props.open) return;
        setErrorMessage("");
        commentList(props.deviceId).then((result) => {
            if (result.success) {
                setCommentList(result.data.reverse());
            } else {
                setErrorMessage("评论加载失败: " + result.message);
            }
        }, reason => {
            setErrorMessage("评论加载失败: " + reason.toString());
        })
    }, [props.deviceId, refresh, props.open]);

    const handleSendComment = () => {
        setErrorMessage("");
        commentSend(props.deviceId, newComment).then((result) => {
            if (result.success) {
                setRefresh(!refresh);
            } else {
                setErrorMessage("发送失败: " + result.message);
            }
        }, reason => {
            setErrorMessage("发送失败: " + reason.toString());
        })
    };

    return <React.Fragment>
        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : <React.Fragment/>}
        <div style={{display: "flex", alignItems: "stretch"}} className={classes.marginTopBottom1}>
            <TextField fullWidth
                       variant="outlined"
                       placeholder="发表评论"
                       multiline
                       rows={3}
                       value={newComment}
                       className={classes.marginRight1}
                       onChange={(evt) => setNewComment(evt.target.value)}
            />
            <Button variant="outlined"
                    color="primary"
                    onClick={handleSendComment}>
                发布
            </Button>
        </div>
        <List className={classes.list}>
            {thisCommentList.length === 0 ?
                <ListItem style={{maxHeight: "50px", alignItems: "center", "justifyContent": "center"}}>
                    暂无评论
                </ListItem>
                : thisCommentList.slice((page - 1) * MaxCommentsPerPage, page * MaxCommentsPerPage).map((comment, index) =>
                    <ListItem key={index}>
                        <ListItemText primary={comment.content}
                                      secondary={`${comment.commenter.name} ${formatTime(comment.comment_time)}`}
                        />
                    </ListItem>)}
        </List>
        <div style={{display: "flex", justifyContent: "flex-end"}}>
            <Pagination page={page}
                        count={Math.max(1, Math.ceil(thisCommentList.length / MaxCommentsPerPage))}
                        onChange={(evt, page) => setPage(page)}
            />
        </div>
    </React.Fragment>
}

export function DeviceDetailSubPage(props: {
    deviceDetail: IDevice,
    showBorrowButton: boolean,
    showEditButton: boolean,
    showDeleteButton: boolean,
    showReturnButton: boolean,
    onEdit?: () => unknown,
}) {
    const classes = useStyles(useTheme());
    const [applyOpen, setApplyOpen] = React.useState(false);
    const [reason, setReason] = React.useState("");
    const [submitting, setSubmitting] = React.useState(false);
    const [succeeded, setSucceeded] = React.useState(false);
    const [commentOpen, setCommentOpen] = React.useState(false);

    const [submitting2, setSubmitting2] = React.useState(false);
    const [succeeded2, setSucceeded2] = React.useState(false);

    const [submitting3, setSubmitting3] = React.useState(false);
    const [succeeded3, setSucceeded3] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [date, setDate] = React.useState(new Date() as Date | null);
    const [editMode, setEditMode] = React.useState(false);
    const [newTitle, setNewTitle] = React.useState(props.deviceDetail.name);
    const [newContent, setNewContent] = React.useState(props.deviceDetail.description);

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
                setErrorMessage(result.message);
            }
        }, reason1 => {
            setSubmitting(false);
            setErrorMessage(reason1.toString());
        });
    }

    const enableEditMode = () => {
        if (!editMode) {
            setEditMode(true);
            setNewTitle(props.deviceDetail.name);
            setNewContent(props.deviceDetail.description);
        }
    }

    const cancelEditMode = () => {
        setEditMode(false);
    }

    const handleEdit = () => {
        if (submitting2 || succeeded2 || (!newTitle) || (!newContent)) {
            return;
        }
        setSubmitting2(true);
        deviceEdit(props.deviceDetail.device_id, newTitle, newContent).then((result) => {
            if (result.success) {
                setSucceeded2(true);
                setSubmitting2(false);
                props.deviceDetail.name = newTitle;
                props.deviceDetail.description = newContent;
                cancelEditMode();
            } else {
                setSucceeded2(false);
                setSubmitting2(false);
                setErrorMessage(result.message);
            }
        }, reason1 => {
            setSubmitting2(false);
            setErrorMessage(reason1.toString());
        });
    }

    const handleReturnDevice = () => {
        if (submitting3) return;
        setErrorMessage("");
        setSubmitting3(true);
        returnDevice(props.deviceDetail.device_id).then((result) => {
            setSubmitting3(false);
            if (result.success) {
                setSucceeded3(true);
            } else {
                setSucceeded3(false);
                setErrorMessage(result.message);
            }
        }, reason1 => {
            setSubmitting3(false);
            setSucceeded3(false);
            setErrorMessage(reason1.toString());
        })
    }

    React.useEffect(() => {
        if (succeeded) {
            const timer = setTimeout(() => {
                setApplyOpen(false);
                setSucceeded(false);
                if (props.onEdit) props.onEdit();
            }, 500);
            return () => {
                clearTimeout(timer);
            }
        }
    }, [succeeded]);

    React.useEffect(() => {
        if (succeeded2) {
            const timer = setTimeout(() => {
                setSucceeded2(false);
                if (props.onEdit) props.onEdit();
            }, 500);
            return () => {
                clearTimeout(timer);
            }
        }
    }, [succeeded2]);

    React.useEffect(() => {
        if (succeeded3) {
            const timer = setTimeout(() => {
                setSucceeded3(false);
                if (props.onEdit) props.onEdit();
            }, 500);
            return () => {
                clearTimeout(timer);
            }
        }
    }, [succeeded3]);

    return <div className={classes.root}>
        <Typography variant="h6" component="h1" className={classes.title}>
            {editMode ?
                <TextField fullWidth
                           label="设备名称"
                           value={newTitle}
                           onChange={(evt) => {
                               setNewTitle(evt.target.value);
                           }}
                />
                : <span>
                        <Typography component="span" variant="h6">{props.deviceDetail.name}</Typography>
                        <Typography color="textSecondary"
                                    component="span">(ID:{' '}{props.deviceDetail.device_id})</Typography>
                </span>
            }
            {props.showBorrowButton ? <Button variant={"outlined"}
                                              color="primary"
                                              className={classes.margin1}
                                              disabled={props.deviceDetail.borrower !== null}
                                              onClick={() => setApplyOpen(!applyOpen)}>
                申请借用
            </Button> : null}
            {props.showEditButton ? (
                editMode ?
                    <ButtonGroup style={{whiteSpace: "nowrap"}}>
                        <Button color={submitting2 ? "default" : "primary"} variant="outlined"
                                className={clsx(succeeded2 && classes.success)}
                                onClick={handleEdit}>
                            确定
                        </Button>
                        <Button variant={"outlined"}
                                color="secondary"
                                onClick={cancelEditMode}>
                            取消
                        </Button>
                    </ButtonGroup> :
                    <Button variant={"outlined"}
                            color="primary"
                            className={classes.margin1}
                            onClick={enableEditMode}>编辑</Button>
            ) : null}
            {props.showReturnButton ? (
                <Button variant={"outlined"}
                        color={submitting3 ? "default" : "primary"}
                        className={clsx(succeeded3 && classes.success, classes.margin1)}
                        onClick={handleReturnDevice}>确认归还</Button>
            ) : null}
        </Typography>
        {errorMessage ? <Alert severity="error" className={classes.marginTopBottom1}>{errorMessage}</Alert> : null}
        {props.showBorrowButton ? <Collapse in={applyOpen}>
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
        {editMode ?
            <TextField fullWidth
                       value={newContent}
                       multiline
                       variant="filled"
                       rows={10}
                       label="设备详情"
                       onChange={(evt) => {
                           setNewContent(evt.target.value);
                       }}
            />
            : <Typography variant="body1">
                {props.deviceDetail.description}
            </Typography>
        }
        <Button fullWidth
                variant="outlined"
                className={classes.marginTopBottom1}
                onClick={() => {
                    setCommentOpen(!commentOpen);
                }}>
            {commentOpen ? "收起评论" : "查看评论"}
        </Button>
        <Collapse in={commentOpen}>
            <DeviceCommentSubPage open={commentOpen} deviceId={props.deviceDetail.device_id}/>
        </Collapse>
    </div>
}

