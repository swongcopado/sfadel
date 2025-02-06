import BasePrechat from 'lightningsnapin/basePrechat';
import { api, track } from 'lwc';
import Id from '@salesforce/user/Id';

/**
 * Custom Prechat form runs in the community logged in user context.
 * We can use this to read the user Id and pass this to the bot
 */

export default class CustomPrechat extends BasePrechat {
    /**
     * preChatFields is an array with the following attributes
     *
     * Eg:
     *   [{
     *       "type":"inputEmail",
     *       "name":"Email",
     *       "label":"Email",
     *       "required":true,
     *       "readOnly":false,
     *       "className":"Email slds-style-inputtext",
     *       "maxLength":80,
     *       "value": ""
     *   }]
     */
    @api prechatFields;
    @track fields;
    userId = Id;
    startChatLabel = 'Start Chat';

    connectedCallback() {
        this.fields = this.prechatFields.map((field) => {
            const { label, name, value, required, maxLength } = field;

            return { label, value, name, required, maxLength };
        });
    }

    /**
     * On render, hit the start chat button.
     *
     * @returns {void}
     */
    renderedCallback() {
        // Execute this at the end of the task queue,
        // by wrapping this in a promise to avoid aura errors
        Promise.resolve().then(() => {
            this.handleStartChat();
        });
    }

    /**
     * On clicking the 'Start Chatting' button, send a chat request.
     *
     * @returns {void}
     */
    handleStartChat = () => {
        const input = this.template.querySelector('lightning-input');

        // (1. First Name, 2. Last Name, 3. Email)
        // Assign the user id to the third Email field
        this.fields[2].value = input.value;

        const validation = this.validateFields(this.fields);
        if (validation.valid) {
            this.startChat(this.fields);
        } else {
            // Error handling if fields do not pass validation.
            console.warn('Pre chat fields did not pass the validation', validation);
        }
    };
}