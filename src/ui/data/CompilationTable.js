import * as React from "react";
import {Fragment} from "react";
import {getMessages} from "../../infrastructure/LanguagesSystem";
import MaterialTable from "material-table";
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import HttpClient from "../../infrastructure/HttpClient";
import {BACKEND_URL} from "../../Static";
import Drawer from "@material-ui/core/Drawer";
import CompilationForm from "../data-forms/CompilationForm";

export default class CompilationTable extends React.Component {

    state = {
        drawerMetadata: {
            isOpen: false,
            editType: null,
            data: {}
        },
        compilations: [],
        messages: {}
    }

    componentDidMount() {
        this.fetchAll().then((response) => {
            this.setState({compilations: response.data})
        });

        this.messagesSubscription = getMessages().subscribe(messages => {
            this.setState({messages: messages})
        });
    }

    componentWillUnmount() {
        this.messagesSubscription.unsubscribe();
    }

    render() {
        const columns = [
            {title: this.state.messages['fields.id'], field: 'id', editable: false},
            {title: this.state.messages['fields.title'], field: 'title'},
        ];

        return (
            <Fragment>
                <MaterialTable
                    title=" "
                    columns={columns}
                    data={this.state.compilations}
                    options={{
                        actionsColumnIndex: -1
                    }}
                    actions={[
                        {
                            icon: () => <AddToPhotosIcon fontSize={'large'}/>,
                            onClick: (event, rowData) => {
                                this.setState({drawerMetadata: {isOpen: true, editType: 'add'}});
                            },
                            isFreeAction: true,
                        },
                        {
                            icon: 'edit',
                            onClick: (event, rowData) => {
                                this.setState({drawerMetadata: {isOpen: true, editType: 'edit', data: rowData}});
                            },
                        },
                    ]}
                    editable={{
                        onRowDelete: (oldData) =>
                            this.delete(oldData.id).then(() => {
                                this.setState((prevState) => {
                                    const data = [...prevState.compilations];
                                    data.splice(data.indexOf(oldData), 1);
                                    return {...prevState, compilations: data};
                                })
                            }).catch(reason => console.log(reason))
                    }}
                />
                <Drawer anchor={'right'} open={this.state.drawerMetadata.isOpen}
                        onClose={() => this.setState({drawerMetadata: {isOpen: false}})}
                        onOpen={() => true}>
                    <CompilationForm inputFormData={this.state.drawerMetadata.data} onSubmit={(formData) => {
                        let promise;
                        if (this.state.drawerMetadata.editType === 'add') {
                            promise = this.save(formData)
                                .then((savedCompilation) => {
                                    this.setState((prevState) => {
                                        const data = [...prevState.compilations];
                                        data.push(savedCompilation);
                                        return {...prevState, compilations: data};
                                    })
                                })
                        } else {
                            promise = this.update(formData).then(() => {
                                this.setState((prevState) => {
                                    const data = [...prevState.compilations];
                                    data[data.indexOf(this.state.drawerMetadata.data)] = formData;
                                    return {...prevState, compilations: data};
                                });
                            })
                        }
                        promise.then(() => this.setState({drawerMetadata: {}}))
                    }
                    }/>
                </Drawer>
            </Fragment>
        );
    }

    fetchAll() {
        return HttpClient.doRequest(axios => {
            return axios.get(`${BACKEND_URL}/api/compilations`)
        })
    }

    save(compilation) {
        return HttpClient.doRequest(axios => {
            return axios.post(`${BACKEND_URL}/api/compilations`, compilation, {})
        }).then((response => {
            return {...compilation, id: response.data}
        }))
    }

    update(compilation) {
        return HttpClient.doRequest(axios => {
            return axios.put(`${BACKEND_URL}/api/compilations/${compilation.id}`, compilation)
        })
    }

    delete(compilationId) {
        return HttpClient.doRequest(axios => {
            return axios.delete(`${BACKEND_URL}/api/compilations/${compilationId}`)
        })
    }
}
