import * as React from "react";
import {Fragment} from "react";
import Button from "@material-ui/core/Button";
import {BACKEND_URL} from "../Static";
import PublishIcon from '@material-ui/icons/Publish';
import OutlayTable from "./OutlayTable";
import Divider from "@material-ui/core/Divider";
import HttpClient from "./HttpClient";

export default class OutlayForm extends React.Component {

    state = {
        selectedFile: null,
        outlayData: null
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
                   Select document
                    {'        '}
                    <Button
                        variant="contained"
                        component="span"
                        size="small"
                        color="primary"
                    >
                        Select File
                    </Button>
                    {'       '}
                    {this.state.selectedFile ? this.state.selectedFile.name : "Not Selected"}
                </label>
                {'      '}
                <Button variant="contained" color="primary" onClick={this.upload.bind(this)}>
                    <PublishIcon/>
                </Button>
                <Divider></Divider>
                <br/>
                <OutlayTable data={this.state.outlayData}/>
            </Fragment>
        );
    }

    upload() {
        const selectedFile = this.state.selectedFile;
        if (selectedFile) {
            const data = new FormData();
            data.append('file', selectedFile)

            HttpClient.doRequest(axios => {
                return axios.post(`${BACKEND_URL}/api/outlay/process-budget-document`, data, {})
                    .then(res => { // then print response status
                        this.setState({outlayData: res.data})
                    })
            })
        }
    }
}
