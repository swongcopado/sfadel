import { api, LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getConfiguration from "@salesforce/apex/EGPT_SalesController.getConfiguration";

export default class Email extends LightningElement {

    @api text;
    loading = false;
		config = '';
    fromOptions = [{ label: 'Hector Ruiz <hector.ruiz@welo.com>', value: 1 }];
    fromValue = 1;

    toItems = [
        {
            type: 'avatar',
            href: 'https://www.salesforce.com',
            label: 'Mya Williams',
            fallbackIconName: 'standard:contact',
            alternativeText: 'User avatar',
            isLink: true,
        }];

    bccItems = [
        {
            label: 'michael.jones@nto.com'
        }];

    subjectValue = `Set VALUE in EGPT Config`;

    handleClick() {
        this.loading = true;
        const event = new ShowToastEvent({
            title: 'Success!',
            message: 'Email Sent Successfully',
            variant: 'success'
        });
        this.dispatchEvent(event);
        this.stopLoading(1000);

        let customEvent = new CustomEvent("egpt_messageaction", {
            detail: {
              value:{Name: 'Send Email'}
            },
            bubbles: true,
            composed: true
          });
          this.dispatchEvent(customEvent);
      

    }
		connectedCallback() {
        this.getConfig();
				//this.setFormValues();
    }
		setFormValues(){
				try{
						
//this.getConfig();
		console.log('Email Publisher Config value in setFromValues' + JSON.stringify(this.config));
						 this.subjectValue = this.config.emailSubject__c;
	console.log('Email Publisher Config value in Subject Value' + this.subjectValue);

    this.fromOptions = [{ label: this.config.emailFrom__c, value: 1 }];
    this.fromValue = 1;

    this.toItems = [
        {
            type: 'avatar',
            href: 'https://www.salesforce.com',
            label: this.config.emailTo__c,
            fallbackIconName: 'standard:contact',
            alternativeText: 'User avatar',
            isLink: true,
        }];

    this.bccItems = [
        {
            label: 'michael.jones@nto.com'
        }];

    this.subjectValue = this.config.emailSubject__c;
				console.log('EMail Publisher subject Value:'+subjectValue);}
				catch (error)
						{
								console.log('Email Publisher ERROR  in setFromValues, ERROR:' + JSON.stringify(error));
						}
		}
    getConfig() {
        getConfiguration()
            .then((result) => {
                this.config = result;
                console.log('Email Publisher-Config:' + JSON.stringify(this.config));
                this.handleConfig();
							  this.setFormValues();
            })
            .catch((error) => {
                console.log('Error: ', error);
            });
    }
		handleConfig() {
        try {

            console.log(' Email Publisher-Config-HandleConfig: ' + JSON.stringify(this.config));
//Add Config code here
    subjectValue = this.config.emailSubject__c;
            console.log('leftPanel-Postback: ' + config2.SalesFeaturedAccount__c);
            this.acct_id = config2.SalesFeaturedAccount__c;
        } catch (error) {
            console.log('left Error: ', error.toString());
        }
    }
    stopLoading(timeoutValue) {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
          this.loading = false;
        }, timeoutValue);
      }

}