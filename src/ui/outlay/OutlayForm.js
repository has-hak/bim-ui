import * as React from "react";
import {Fragment} from "react";
import Button from "@material-ui/core/Button";
import {BACKEND_URL} from "../../Static";
import PublishIcon from '@material-ui/icons/Publish';
import OutlayTable from "./OutlayTable";
import Divider from "@material-ui/core/Divider";
import HttpClient from "../../infrastructure/HttpClient";
import {getMessages} from "../../infrastructure/LanguagesSystem";
import {IconButton} from '@material-ui/core';
import Icon from "@material-ui/core/Icon";
import NotificationContent from "../common/NotificationContent";

const FileDownload = require('js-file-download');

export default class OutlayForm extends React.Component {

    state = {
        selectedFile: null,
        outlayData: null,
        messages: {}
    }

    componentDidMount() {
        this.messagesSubscription = getMessages().subscribe(messages => {
            this.setState({messages: messages})
        });
    }

    componentWillUnmount() {
        this.messagesSubscription.unsubscribe();
    }

    onFileSelect(event) {
        const fileInput = event.nativeEvent.target
        if (fileInput.files.length === 0) {
            this.setState({selectedFile: null})
        } else {
            const file = fileInput.files[0]
            this.setState({selectedFile: file})
        }
    }

    render() {
        return (
            <Fragment>
                <input
                    color="primary"
                    accept=".xlsx, .xls"
                    type="file"
                    onChange={this.onFileSelect.bind(this)}
                    id="icon-button-file"
                    style={{display: 'none',}}
                />
                <label htmlFor="icon-button-file">
                    {this.state.messages['ui.main.outlay-calculation.select-document']}
                    {'        '}
                    <Button
                        variant="contained"
                        component="span"
                        size="small"
                        color="primary"
                    >
                        {this.state.messages['ui.main.outlay-calculation.select-file']}
                    </Button>
                    {'       '}
                    {this.state.selectedFile ? this.state.selectedFile.name : this.state.messages['ui.main.outlay-calculation.not-selected']}
                </label>
                {'      '}
                <Button variant="contained" color="primary" onClick={this.getOutlayData.bind(this)}>
                    <PublishIcon/>
                </Button>
                <Divider></Divider>
                <br/>
                <OutlayTable data={this.state.outlayData}/>
                {this.state.showExcel && <IconButton size={'small'} disableFocusRipple={true} color={'primary'} outlined onClick={this.downloadOutlayExcel.bind(this)}>
                    <Icon fontSize={'large'}>
                        <img src={"/excel-icon.png"} height={40} width={40}/>
                    </Icon>
                    {'  '}
                    {this.state.messages['ui.main.outlay-calculation.download-excel-version']}
                </IconButton>}
                {this.state.errorMessage && <NotificationContent type={'error'} value={this.state.errorMessage}/>}
            </Fragment>
        );
    }

    getOutlayData() {
        const selectedFile = this.state.selectedFile;
        if (selectedFile) {
            const data = new FormData();
            data.append('file', selectedFile)

            HttpClient.doRequest(axios => {
                return axios.post(`${BACKEND_URL}/api/outlay/process-budget-document`, data, {})
                    .then(res => { // then print response status
                        this.setState({outlayData: res.data, showExcel: true, errorMessage: null})
                    }).catch(error => {
                        if (error.response && error.response.data) {
                            this.setState({errorMessage: error.response.data})
                        }
                    })
            })
        }
    }

    downloadOutlayExcel() {
        const selectedFile = this.state.selectedFile;
        if (selectedFile) {
            const data = new FormData();
            data.append('file', selectedFile)

            HttpClient.doRequest(axios => {
                return axios.post(`${BACKEND_URL}/api/outlay/calculate-from-budget-document`, data, {
                    responseType: 'arraybuffer',
                })
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'նախահաշիվ.xlsx');
                document.body.appendChild(link);
                link.click();
            });
        }
    }
}
