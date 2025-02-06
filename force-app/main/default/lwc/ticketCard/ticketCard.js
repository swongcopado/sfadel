import { LightningElement, api } from 'lwc';

// Custom Labels
import ticketNumber from '@salesforce/label/c.Ticket_Number';
import viewDetails from '@salesforce/label/c.View_Details';
import privateTicketMessage from '@salesforce/label/c.Private_Ticket_Message';
import noTickets from '@salesforce/label/c.No_Tickets';
import dateCreated from '@salesforce/label/c.Date_Created';
import priority from '@salesforce/label/c.Priority';

const COMMAND_OPEN_CASE = 'open-case';
const EVENT_NAMESPACE = 'workdotcom';

export default class TicketCard extends LightningElement {
    label = {
        ticketNumber,
        viewDetails,
        privateTicketMessage,
        noTickets,
        dateCreated,
        priority,
    };

    @api recordId;
    @api caseNumber;
    @api subject;
    @api status;
    @api description;
    @api isPrivate;
    @api createdDate;
    @api priority;
    @api showFooter = false;
    msCreatedDate;

    connectedCallback() {
        try {
            // LWC component expects Date to be in UNIX Timestamp format
            this.msCreatedDate = new Date(this.createdDate).getTime();
        } catch (err) {
            console.error(
                `Failed to convert created date: ${this.createdDate} to milliseconds`
            );
        }
    }

    openTicketDetails = (event) => {
        event.preventDefault();

        const targetOrigin = window.location.origin;

        window.postMessage(
            {
                namespace: EVENT_NAMESPACE,
                command: COMMAND_OPEN_CASE,
                detail: {
                    recordId: this.recordId,
                },
            },
            targetOrigin
        );
    };
}