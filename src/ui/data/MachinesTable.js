import * as React from "react";
import {Fragment} from "react";
import {BACKEND_URL} from "../../Static";
import HttpClient from "../../infrastructure/HttpClient";
import {getMessages} from "../../infrastructure/LanguagesSystem";
import MaterialTable from "material-table";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";
import Drawer from "@material-ui/core/Drawer";
import MachineForm from "../data-forms/MachineForm";

export default class MachinesTable extends React.Component {

    messagesSubscription;

    state = {
        drawerMetadata: {
            isOpen: false,
            editType: null,
            data: {}
        },
        machines: [],
        messages: {}
    }

    componentDidMount() {
        this.fetchAll().then((response) => {
            this.setState({machines: response.data})
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
            {title: this.state.messages['fields.code'], field: 'code', editable: false},
            {title: this.state.messages['fields.title'], field: 'title'},
            {title: this.state.messages['fields.unit'], field: 'unit'},
            {title: this.state.messages['fields.unit-cost'], field: 'unitCost'},
        ];

        return (
            <Fragment>
                <MaterialTable
                    title=" "
                    columns={columns}
                    data={this.state.machines}
                    options={{
                        actionsColumnIndex: -1
                    }}
                    actions={[
                        {
                            icon: () => <AddToPhotosIcon fontSize={'large'}/>,
                            onClick: () => {
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
                                    return {...prevState, machines: data};
                                })
                            }).catch(reason => console.log(reason))
                    }}
                />
                <Drawer anchor={'right'} open={this.state.drawerMetadata.isOpen}
                        onClose={() => this.setState({drawerMetadata: {isOpen: false}})}
                        onOpen={() => true}>
                    <MachineForm inputFormData={this.state.drawerMetadata.data} onSubmit={(formData) => {
                        let promise;
                        if (this.state.drawerMetadata.editType === 'add') {
                            promise = this.save(formData)
                                .then((savedCompilation) => {
                                    this.setState((prevState) => {
                                        const data = [...prevState.machines];
                                        data.push(savedCompilation);
                                        return {...prevState, machines: data};
                                    })
                                })
                        } else {
                            promise = this.update(formData).then(() => {
                                this.setState((prevState) => {
                                    const data = [...prevState.machines];
                                    data[data.indexOf(this.state.drawerMetadata.data)] = formData;
                                    return {...prevState, machines: data};
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
            return axios.get(`${BACKEND_URL}/api/machines`)
        })
    }

    save(machine) {
        return HttpClient.doRequest(axios => {
            return axios.post(`${BACKEND_URL}/api/machines`, machine, {})
        }).then((response => {
            return {...machine, id: response.data}
        }))
    }

    update(machine) {
        return HttpClient.doRequest(axios => {
            return axios.put(`${BACKEND_URL}/api/machines/${machine.id}`, machine)
        })
    }

    delete(machineId) {
        return HttpClient.doRequest(axios => {
            return axios.delete(`${BACKEND_URL}/api/machine/${machineId}`)
        })
    }
}
