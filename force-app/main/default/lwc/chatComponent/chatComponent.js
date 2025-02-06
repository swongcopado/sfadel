import BaseChatMessage from 'lightningsnapin/baseChatMessage';
import { track } from 'lwc';

const CHAT_CONTENT_CLASS = 'chat-content';
const AGENT_USER_TYPE = 'agent';
const CHASITOR_USER_TYPE = 'chasitor';
const SUPPORTED_USER_TYPES = [AGENT_USER_TYPE, CHASITOR_USER_TYPE];
/**
 * Displays a chat message using the inherited api messageContent and is styled based on the inherited api userType and messageContent api objects passed in from BaseChatMessage.
 */
export default class ChatMessageDefaultUI extends BaseChatMessage {
    @track messageStyle = '';
    @track hasMultiRecords=false;
    @track hasRecord=false;
    @track hasImage=false;
    @track hasFileUpload=false;
    @track hasIframe=false;
    @track hasCreateRecord=false;
    @track hasNoContent=false;
    @track hasFileUploaded=false;
    @track records=[];
    
    get acceptedFormats() {
        return ['.pdf', '.jpg','.mov','.mp4','.png','.jpeg','.pptx','.docx','.mp3','.wav','.gif'];
    }
    isSupportedUserType(userType) {
        return SUPPORTED_USER_TYPES.some((supportedUserType) => supportedUserType === userType);
    }
    handleUploadFinished() {
        console.log('handleUploadFinished...');
        this.hasFileUploaded=true;
        this.text="Successfully Uploaded The File";
    }
    connectedCallback() {
        console.log('connectedCallback...');
        if (this.isSupportedUserType(this.userType)) {
            this.messageStyle = `${CHAT_CONTENT_CLASS} ${this.userType}`;
            let element = document.createElement();
            element.innerText = this.messageContent.value;
            let values;
            if(element.innerText.startsWith("Records:"))
            {
                values=element.innerText.split("::");
                this.objectName=values[1];
                this.viewMode=values[2];
                this.records=values[3].split(",");
                this.hasMultiRecords=true;
            }
            else if(element.innerText.startsWith("Record:"))
            {
                values=element.innerText.split("::"); 
                this.objectName=values[1];
                this.viewMode=values[2];
                this.record=values[3];
                this.title=values[4];
                this.iconName=values[5];
                this.hasRecord=true; 
            }
            else if(element.innerText.startsWith("Image:"))
            {
                let urlStrings=[];
                values=element.innerText.split("::");  
                urlStrings=values[1].split(">");
                this.srcUrl=urlStrings[1].substring(0, urlStrings[1].length - 3);
                this.hasImage=true;
            }
            else if(element.innerText.startsWith("FileUpload:"))
            {
                values=element.innerText.split("::");  
                this.record=values[1];
                this.hasFileUpload=true;
            }
            else if(element.innerText.startsWith("Iframe:"))
            {
                let urlStrings=[];
                values=element.innerText.split("::");  
                urlStrings=values[1].split(">");
                this.srcUrl=urlStrings[1].substring(0, urlStrings[1].length - 3);
                this.hasIframe=true;
            }
            else if(element.innerText.startsWith("CreateRecord:"))
            {
                values=element.innerText.split("::");  
                this.objectName=values[1];
                this.title=values[2];
                this.iconName=values[3];
                this.fields=values[4].split(",");
                this.hasCreateRecord=true;
                
            }
            else
            {
                this.hasNoContent=true;
                this.text=this.messageContent.value;
            }
        } else {
            throw new Error(`Unsupported user type passed in: ${this.userType}`);
        }
    }
}