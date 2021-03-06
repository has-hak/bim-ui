import React, {Fragment, PureComponent} from 'react';
/* COMPONENTS  ***************************** */
import PropTypes from 'prop-types';
import './notificationContent.css';

export default class NotificationContent extends PureComponent {

    render() {
        const {value, type} = this.props;

        let notificationWrapper,
            iconWrapper;

        switch (type) {
            case 'success':
                notificationWrapper = 'success-wrapper';
                iconWrapper = 'success-icon-wrapper';
                break;
            case 'info':
                notificationWrapper = 'info-wrapper';
                iconWrapper = 'info-icon-wrapper';
                break;
            case 'warning':
                notificationWrapper = 'warning-wrapper';
                iconWrapper = 'warning-icon-wrapper';
                break;
            case 'error':
                notificationWrapper = 'error-wrapper';
                iconWrapper = 'error-icon-wrapper';
                break;
            default:
                notificationWrapper = 'error-wrapper';
                iconWrapper = 'error-icon-wrapper';
        }

        return (
            <Fragment>
                { (typeof value === 'string') && value.split("\n").map(v => <Fragment>
                    <div className={notificationWrapper}>
                        <div className={iconWrapper}>
                        </div>
                        <p>{v}</p>
                    </div>
                </Fragment>)
                }
            </Fragment>

        )
    }
}

NotificationContent.propTypes = {
    type: PropTypes.string.isRequired,
};
