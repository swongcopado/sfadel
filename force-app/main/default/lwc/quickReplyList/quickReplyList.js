import { LightningElement, api } from 'lwc';

export default class QuickReplyList extends LightningElement {
    /**
     * quickReplies = [{ id, label, onClick }]
     */
    @api quickReplies = [];
}