import { MESSAGE_PREFIX } from './messageRenderer';
import messageFormatterError from '@salesforce/label/c.Message_Formatter_Error';

export function htmlDecode(input) {
    const element = document.createElement('div');
    // eslint-disable-next-line @lwc/lwc/no-inner-html
    element.innerHTML = input;

    // prettier-ignore
    return element.childNodes.length === 0
        ? ''
        : element.childNodes[0].nodeValue;
}

export default function messageFormatter(message) {
    const formatted = {
        type: MESSAGE_PREFIX.text,
        content: message,
    };

    const [possibleMessageType] = message.split(':');
    const isValidMessageType = Object.values(MESSAGE_PREFIX).includes(
        possibleMessageType
    );

    if (isValidMessageType) {
        // Set the message type
        formatted.type = possibleMessageType;

        // Remove the prefix from the content "TEXT:a message" => "a message"
        formatted.content = message.substring(formatted.type.length + 1);

        switch (formatted.type) {
            case MESSAGE_PREFIX.text: {
                break;
            }

            default: {
                // Format all non-text message types as JSON
                try {
                    // The content will be encoded as HTML
                    const decoded = htmlDecode(formatted.content);
                    formatted.content = JSON.parse(decoded) || {};
                } catch (error) {
                    formatted.type = MESSAGE_PREFIX.text;
                    formatted.content = messageFormatterError;
                    console.error(error);
                }
            }
        }
    }

    return formatted;
}