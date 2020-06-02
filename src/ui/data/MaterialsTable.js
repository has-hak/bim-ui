import * as React from "react";
import {Fragment} from "react";
import {BACKEND_URL} from "../../Static";
import HttpClient from "../../infrastructure/HttpClient";
import {getMessages} from "../../infrastructure/LanguagesSystem";
import MaterialTable from "material-table";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";
import Drawer from "@material-ui/core/Drawer";
import MaterialForm from "../data-forms/MaterialForm";
import UserContext from "../../infrastructure/UserContext";
import NotificationContent from "../common/NotificationContent";
import {buildErrorMessage} from "../../infrastructure/util/Util";

export default class MaterialsTable extends React.Component {

    messagesSubscription;

    state = {
        drawerMetadata: {
            isOpen: false,
            editType: null,
            data: {}
        },
        materials: [],
        messages: {},
        tableConfig: {
            actions: [],
            editable: {}
        }
    }

    componentDidMount() {
        this.fetchAll().then((response) => {
            this.setState({materials: response.data})
        });

        this.messagesSubscription = getMessages().subscribe(messages => {
            this.setState({messages: messages})
        });

        this.userSubscription = UserContext.listenCurrentUser().subscribe(user => {
            if (user.hasRole(['ADMIN', 'MANAGER'])) {
                const actions = [
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
                ]

                const editable = {
                    onRowDelete: (oldData) =>
                        this.delete(oldData.id).then(() => {
                            this.setState((prevState) => {
                                const data = [...prevState.materials];
                                data.splice(data.indexOf(oldData), 1);
                                return {...prevState, materials: data};
                            })
                        }).catch(reason => console.log(reason))
                }

                this.setState({tableConfig: {actions: actions, editable: editable}});
            }
        });
    }

    componentWillUnmount() {
        this.messagesSubscription.unsubscribe();
        this.userSubscription.unsubscribe();
    }

    render() {
        const columns = [
            {title: this.state.messages['fields.id'], field: 'id'},
            {title: this.state.messages['fields.code'], field: 'code'},
            {title: this.state.messages['fields.title'], field: 'title'},
            {title: this.state.messages['fields.unit'], field: 'unit'},
            {title: this.state.messages['fields.unit-cost'], field: 'unitCost'},
            {
                title: this.state.messages['fields.measure-type'],
                field: 'measureType',
                render: material => this.state.messages[`measure-types.${material.measureType}`]
            },
        ];

        return (
            <Fragment>
                <MaterialTable
                    title=" "
                    columns={columns}
                    data={this.state.materials}
                    options={{
                        actionsColumnIndex: -1
                    }}
                    actions={this.state.tableConfig.actions}
                    editable={this.state.tableConfig.editable}
                />
                <Drawer anchor={'right'} open={this.state.drawerMetadata.isOpen}
                        onClose={() => this.setState({drawerMetadata: {isOpen: false}, errorMessage: null})}>
                    <MaterialForm inputFormData={this.state.drawerMetadata.data} onSubmit={(formData) => {
                        let promise;
                        if (this.state.drawerMetadata.editType === 'add') {
                            promise = this.save(formData)
                                .then((savedCompilation) => {
                                    this.setState((prevState) => {
                                        const data = [...prevState.materials];
                                        data.push(savedCompilation);
                                        return {...prevState, materials: data};
                                    })
                                })
                        } else {
                            promise = this.update(formData).then(() => {
                                this.setState((prevState) => {
                                    const data = [...prevState.materials];
                                    data[data.indexOf(this.state.drawerMetadata.data)] = formData;
                                    return {...prevState, materials: data};
                                });
                            })
                        }
                        promise.then(() => this.setState({drawerMetadata: {}}))
                            .catch(error => this.setState({errorMessage: buildErrorMessage(error.response.data, this.state.messages)}))
                    }
                    }/>
                    {this.state.errorMessage && <NotificationContent type={'error'} value={this.state.errorMessage}/>}
                </Drawer>
            </Fragment>
        );
    }

    fetchAll() {
        return HttpClient.doRequest(axios => {
            return axios.get(`${BACKEND_URL}/api/materials`)
        })
    }

    save(material) {
        return HttpClient.doRequest(axios => {
            return axios.post(`${BACKEND_URL}/api/materials`, material, {})
        }).then((response => {
            return {...material, id: response.data}
        }))
    }

    update(material) {
        return HttpClient.doRequest(axios => {
            return axios.put(`${BACKEND_URL}/api/materials/${material.id}`, material)
        })
    }

    delete(materialId) {
        return HttpClient.doRequest(axios => {
            return axios.delete(`${BACKEND_URL}/api/materials/${materialId}`)
        })
    }

    buildErrorMessage(errorData) {
        let message = ""
        Object.values(errorData).forEach((errorMessageKey) => {
            message += this.state.messages[errorMessageKey] + "\n"
        });
        return message;
    }
}
