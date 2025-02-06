import { LightningElement, track, api } from 'lwc';
import labelNewTicket from '@salesforce/label/c.New_Ticket';

const COMMAND_CREATE_CASE = 'create-case';
const EVENT_NAMESPACE = 'workdotcom';

export default class NewTicket extends LightningElement {
    // "IT" or "HR"
    @api ticketType;
    @track quickReplies = [
        {
            id: 'new-ticket',
            label: labelNewTicket,
            onClick: (event) => {
                this.openNewTicketModal(event);
            },
        },
    ];

    openNewTicketModal = (event) => {
        event.preventDefault();

        const targetOrigin = window.location.origin;

        const details = {};

        if (this.ticketType) {
            details.detail = {
                ticketCategoryName: this.ticketType,
            };
        }

        window.postMessage(
            {
                namespace: EVENT_NAMESPACE,
                command: COMMAND_CREATE_CASE,
                ...details,
            },
            targetOrigin
        );
    };
}