import { LightningElement, api, track } from 'lwc';
import ticketNumber from '@salesforce/label/c.Ticket_Number';
import seeAllTickets from '@salesforce/label/c.See_All_Tickets';
import privateTicketMessage from '@salesforce/label/c.Private_Ticket_Message';
import NoTickets from '@salesforce/label/c.No_Tickets';

const COMMAND_OPEN_CASES = 'open-cases';
const EVENT_NAMESPACE = 'workdotcom';

export default class TicketMenuList extends LightningElement {
    label = {
        ticketNumber,
        seeAllTickets,
        privateTicketMessage,
        NoTickets,
    };

    /**
     * tickets = [{id, caseNumber, status, subject, description, private, type}]
     */
    @api tickets = [];
    @track page = [];
    showAllTickets = false;
    noTickets;

    connectedCallback() {
        this.page = this.tickets;
        this.noTickets = this.page.length <= 0;

        try {
            if (this.tickets.length > 3) {
                this.page = this.tickets.slice(0, 3);
                this.showAllTickets = true;
            }
        } catch (err) {
            console.error(err);
        }
    }

    openAllTickets = (event) => {
        event.preventDefault();

        const targetOrigin = window.location.origin;

        window.postMessage(
            {
                namespace: EVENT_NAMESPACE,
                command: COMMAND_OPEN_CASES,
            },
            targetOrigin
        );
    };
}