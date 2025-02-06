import BaseChatMessage from 'lightningsnapin/baseChatMessage';
import messageFormatter from './messageFormatter';

export const MESSAGE_PREFIX = {
    text: 'TEXT',
    ticket: 'TICKET',
    article: 'ARTICLE',
    newTicket: 'NEW_TICKET',
    ticketList: 'TICKET_LIST',
};

export default class MessageRenderer extends BaseChatMessage {
    messageType = MESSAGE_PREFIX.text;
    content = '';

    connectedCallback() {
        if (!this.isAgent) {
            // Do not format Chasitor's messages
            this.content = this.messageContent.value;

            return;
        }

        // Apply custom formatting only to Agent's messages
        const { content, type } = messageFormatter(this.messageContent.value);

        this.content = content;
        this.messageType = type;
    }

    get isAgent() {
        return this.userType === 'agent';
    }

    get isText() {
        return this.messageType === MESSAGE_PREFIX.text;
    }

    get isTicket() {
        return this.messageType === MESSAGE_PREFIX.ticket;
    }

    get isArticle() {
        return this.messageType === MESSAGE_PREFIX.article;
    }

    get isNewTicket() {
        return this.messageType === MESSAGE_PREFIX.newTicket;
    }

    get isTicketList() {
        return this.messageType === MESSAGE_PREFIX.ticketList;
    }
}