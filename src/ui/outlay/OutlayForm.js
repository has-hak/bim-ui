import * as React from "react";
import {Fragment} from "react";
import Button from "@material-ui/core/Button";
import {BACKEND_URL} from "../../Static";
import PublishIcon from '@material-ui/icons/Publish';
import OutlayTable from "./OutlayTable";
import Divider from "@material-ui/core/Divider";
import HttpClient from "../../infrastructure/HttpClient";
import {Subject} from "rxjs";
import {getCurrentLanguage, getMessages} from "../../infrastructure/LanguagesSystem";
import {switchMap, takeUntil} from "rxjs/operators";

export default class OutlayForm extends React.Component {

    destroy = new Subject();

    state = {
        selectedFile: null,
        outlayData: null,
        messages: {}
    }


    componentDidMount() {
        getCurrentLanguage().pipe(switchMap(currentLanguage => {
            return getMessages(['ui.main.outlay-calculation.select-document', 'ui.main.outlay-calculation.select-file', 'ui.main.outlay-calculation.not-selected'], currentLanguage.id)
        })).pipe(takeUntil(this.destroy)).subscribe(messages => {
            this.setState({messages: messages})
        });
    }

    componentWillUnmount() {
        this.destroy.next();
        this.destroy.complete();
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
