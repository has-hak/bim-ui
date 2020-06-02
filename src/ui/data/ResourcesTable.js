import * as React from "react";
import {Fragment} from "react";
import {BACKEND_URL} from "../../Static";
import HttpClient from "../../infrastructure/HttpClient";
import {getMessages} from "../../infrastructure/LanguagesSystem";
import MaterialTable from "material-table";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";
import Drawer from "@material-ui/core/Drawer";
import ResourceForm from "../data-forms/ResourceForm";
import UserContext from "../../infrastructure/UserContext";
import NotificationContent from "../common/NotificationContent";
import {buildErrorMessage} from "../../infrastructure/util/Util";

export default class ResourcesTable extends React.Component {

    state = {
        drawerMetadata: {
            isOpen: false,
            editType: null,
            data: {}
        },
        resources: [],
        availableMeasures: [],
        messages: {},
        tableConfig: {
            actions: [],
            editable: {}
        }
    }

    componentDidMount() {
        this.fetchAll().then((response) => {
            const data = response.data;
            const measures = new Set();
            data.resources.forEach(resource => Array.from(Object.keys(resource.measures)).forEach(measure => measures.add(measure)))

            const measureUnits = data.standards.measureUnits;

            this.setState({
                resources: data.resources,
                availableMeasures: Array.from(measures.values()).map(value => {
                    return {
                        type: value,
                        unit: measureUnits[value]
                    }
                })
            })
        })

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
                                const data = [...prevState.resources];
                                data.splice(data.indexOf(oldData), 1);
                                return {...prevState, resources: data};
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
        ];

        this.state.availableMeasures.forEach(measure => {
            columns.push({
                title: `${this.state.messages[`measure-types.${measure.type}`]} (${this.state.messages[`measure-units.${measure.unit}`]})`,
                render: (resource) => resource.measures[measure.type] ? `${resource.measures[measure.type].startValue}-${resource.measures[measure.type].endValue}` : this.state.messages['N/A']
            })
        })

        return (
            <Fragment>
                <MaterialTable
                    title=" "
                    columns={columns}
                    data={this.state.resources}
                    options={{
                        actionsColumnIndex: -1
                    }}
                    actions={this.state.tableConfig.actions}
                    editable={this.state.tableConfig.editable}
                />
                <Drawer anchor={'right'} open={this.state.drawerMetadata.isOpen}
                        onClose={() => this.setState({drawerMetadata: {isOpen: false}, errorMessage: null})}>
                    <ResourceForm inputFormData={this.state.drawerMetadata.data} onSubmit={(formData) => {
                        let promise;
                        if (this.state.drawerMetadata.editType === 'add') {
                            promise = this.save(formData)
                                .then((savedResource) => {
                                    this.setState((prevState) => {
                                        const data = [...prevState.resources];
                                        data.push(savedResource);
                                        return {...prevState, resources: data};
                                    })
                                })
                        } else {
                            promise = this.update(formData).then(() => {
                                this.setState((prevState) => {
                                    const data = [...prevState.resources];
                                    data[data.indexOf(this.state.drawerMetadata.data)] = formData;
                                    return {...prevState, resources: data};
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
            return axios.get(`${BACKEND_URL}/api/resources`)
        })
    }

    save(resource) {
        return HttpClient.doRequest(axios => {
            return axios.post(`${BACKEND_URL}/api/resources`, resource, {})
        }).then((response => {
            return {...resource, id: response.data}
        }))
    }

    update(resource) {
        return HttpClient.doRequest(axios => {
            return axios.put(`${BACKEND_URL}/api/resources/${resource.id}`, resource)
        })
    }

    delete(resourceId) {
        return HttpClient.doRequest(axios => {
            return axios.delete(`${BACKEND_URL}/api/resources/${resourceId}`)
        })
    }
}
