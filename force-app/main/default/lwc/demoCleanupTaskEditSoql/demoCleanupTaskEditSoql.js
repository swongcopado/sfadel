//  Javascript controller for the edit SOQL Cleanup Task modal for the Demo Cleanup Lightning component.
//
//  Copyright (c) 2021-2023, salesforce.com, inc.
//  All rights reserved.
//  SPDX-License-Identifier: BSD-3-Clause
//  For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
//
//  Contact: john.meyer@salesforce.com

import { LightningElement, api, wire } from 'lwc';
import getOrgObjectList from '@salesforce/apex/DemoCleanup.getOrgObjectList';
import validateSoql from '@salesforce/apex/DemoCleanup.validateSoql';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getFieldValue, getRecord, updateRecord } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import DEMO_CLEANUP_TASK from '@salesforce/schema/Demo_Cleanup_Task__c';
import ID_FIELD from '@salesforce/schema/Demo_Cleanup_Task__c.Id';
import DESCRIPTION_FIELD from '@salesforce/schema/Demo_Cleanup_Task__c.Description__c';
import WHERE_CLAUSE_FIELD from '@salesforce/schema/Demo_Cleanup_Task__c.SOQL_WHERE_Clause__c';
import OBJECT_NAME_FIELD from '@salesforce/schema/Demo_Cleanup_Task__c.Object_API_Name__c';
import PERMANENTLY_DELETE_FIELD from '@salesforce/schema/Demo_Cleanup_Task__c.Permanently_Delete__c';
import ACTIVE_FIELD from '@salesforce/schema/Demo_Cleanup_Task__c.Active__c';

const PERMANENTLY_DELETE_VALUE = 'permanent';
const RECYCLE_BIN_VALUE = 'recycle';

export default class DemoCleanupTaskEditSoql extends NavigationMixin(LightningElement) {
	@api recordId;

	isOpen = true;
	updateDisabled = true;
	objectValid = true;
	descriptionValid = true;

	get validateDisabled() {
		return !this.objectValid || !this.descriptionValid;
	}

	maxDescriptionChars;
	descriptionChars = 0;
	get descriptionCharsRemaining() {
		return this.maxDescriptionChars - this.descriptionChars;
	}

	maxWhereClauseChars;
	whereClauseChars = 0;
	get whereClauseCharsRemaining() {
		return this.maxWhereClauseChars - this.whereClauseChars;
	}

	objectOptions;
	deleteOptions = [
		{ label: 'Permanently delete', value: PERMANENTLY_DELETE_VALUE },
		{ label: 'Send to Recycle Bin', value: RECYCLE_BIN_VALUE }
	];

	whereClause;
	description;
	objectName;
	permanentlyDelete = RECYCLE_BIN_VALUE;
	active = true;

	get objectApiDisplayName() {
		return this.objectName ? `Object API Name: ${this.objectName}` : null;
	}

	@wire(getObjectInfo, { objectApiName: DEMO_CLEANUP_TASK })
	wired_getObjectInfo({ data, error }) {
		if (data) {
			this.maxDescriptionChars = data.fields.Description__c.length;
			this.maxWhereClauseChars = data.fields.SOQL_WHERE_Clause__c.length;
		} else if (error)
			this.dispatchEvent(
				new ShowToastEvent({
					title: 'Could not retrieve object information.',
					message: this.errorMessage(error),
					variant: 'error',
					mode: 'sticky'
				})
			);
	}

	@wire(getOrgObjectList)
	wired_getOrgObjectList({ data, error }) {
		if (data) {
			this.objectOptions = [];
			data.forEach((object) => this.objectOptions.push(object));
			this.objectOptions.sort((a, b) => a.label.localeCompare(b.label));
		} else if (error)
			this.dispatchEvent(
				new ShowToastEvent({
					title: 'Could not retrieve org object list',
					message: this.errorMessage(error),
					variant: 'error',
					mode: 'sticky'
				})
			);
	}

	@wire(getRecord, {
		recordId: '$recordId',
		fields: [DESCRIPTION_FIELD, OBJECT_NAME_FIELD, WHERE_CLAUSE_FIELD, PERMANENTLY_DELETE_FIELD, ACTIVE_FIELD]
	})
	wired_getRecord({ data, error }) {
		if (data) {
			this.description = getFieldValue(data, DESCRIPTION_FIELD);
			this.descriptionChars = this.description.length;
			this.objectName = getFieldValue(data, OBJECT_NAME_FIELD);
			this.whereClause = getFieldValue(data, WHERE_CLAUSE_FIELD);
			this.whereClauseChars = this.whereClause.length;
			this.permanentlyDelete = getFieldValue(data, PERMANENTLY_DELETE_FIELD) ? PERMANENTLY_DELETE_VALUE : RECYCLE_BIN_VALUE;
			this.active = getFieldValue(data, ACTIVE_FIELD);
		} else if (error) {
			this.isOpen = false;
			this.dispatchEvent(
				new ShowToastEvent({
					title: 'Could not retrieve the record',
					message: this.errorMessage(error),
					variant: 'error',
					mode: 'sticky'
				})
			);
			this[NavigationMixin.Navigate]({
				type: 'standard__recordPage',
				attributes: {
					recordId: this.recordId,
					actionName: 'view'
				}
			});
		}
	}

	handleUpdateButton(event) {
		let fieldsToSave = {};
		fieldsToSave[DESCRIPTION_FIELD.fieldApiName] = this.description;
		fieldsToSave[OBJECT_NAME_FIELD.fieldApiName] = this.objectName;
		fieldsToSave[WHERE_CLAUSE_FIELD.fieldApiName] = this.whereClause;
		fieldsToSave[PERMANENTLY_DELETE_FIELD.fieldApiName] = this.permanentlyDelete === PERMANENTLY_DELETE_VALUE;
		fieldsToSave[ACTIVE_FIELD.fieldApiName] = this.active;
		fieldsToSave[ID_FIELD.fieldApiName] = this.recordId;
		updateRecord({ fields: fieldsToSave })
			.then((record) => {
				this.isOpen = false;
				this.recordId = record.id;
				this.dispatchEvent(
					new ShowToastEvent({
						message: `'${this.description}' was successfully updated`,
						variant: 'success'
					})
				);
				this[NavigationMixin.Navigate]({
					type: 'standard__recordPage',
					attributes: {
						recordId: this.recordId,
						actionName: 'view'
					}
				});
			})
			.catch((error) => {
				this.dispatchEvent(
					new ShowToastEvent({
						title: `Could not update '${this.description}'`,
						message: this.errorMessage(error),
						variant: 'error',
						mode: 'sticky'
					})
				);
			});
	}

	handleCloseButton(event) {
		this.isOpen = false;
		this[NavigationMixin.Navigate]({
			type: 'standard__recordPage',
			attributes: {
				recordId: this.recordId,
				actionName: 'view'
			}
		});
	}

	handleValidateButton(event) {
		validateSoql({
			allowReusedObjects: true, // Only check on create
			objectApiName: this.objectName,
			whereClause: this.whereClause
		})
			.then((result) => {
				if (!result) {
					this.updateDisabled = false;
					this.dispatchEvent(
						new ShowToastEvent({
							title: 'Everything checked out',
							message: 'All the validation tests passed and you can now save your SOQL cleanup task.',
							variant: 'success'
						})
					);
				} else {
					this.updateDisabled = true;
					this.dispatchEvent(
						new ShowToastEvent({
							title: 'Your SOQL cleanup task did not pass validation',
							message: result,
							variant: 'error',
							mode: 'sticky'
						})
					);
				}
			})
			.catch((error) => {
				this.dispatchEvent(
					new ShowToastEvent({
						title: 'Could not validate your SOQL cleanup task',
						message: this.errorMessage(error),
						variant: 'error',
						mode: 'sticky'
					})
				);
			});
	}

	handleDescription(event) {
		this.description = event.detail.value;
		this.descriptionChars = event.detail.value.length;
	}
	validateDescription(event) {
		this.descriptionValid = event.target.checkValidity();
	}

	handleWhereClause(event) {
		this.updateDisabled = true;
		this.whereClause = event.detail.value;
		this.whereClauseChars = event.detail.value.length;
	}

	handleObjectSelection(event) {
		this.updateDisabled = true;
		this.objectName = event.detail.value;
	}
	validateObjectSelection(event) {
		this.objectValid = event.target.checkValidity();
	}

	handlePermanentlyDelete(event) {
		this.permanentlyDelete = event.detail.value;
	}

	handleActive(event) {
		this.active = event.detail.checked;
	}

	handleAllowReusedObjects(event) {
		this.allowReusedObjects = event.detail.checked;
	}

	errorMessage(error) {
		let message;
		if (Array.isArray(error.body)) message = error.body.map((err) => err.message).join(', ');
		else if (typeof error.body.message === 'string') message = error.body.message;
		else message = JSON.stringify(error);
		return message;
	}
}