import { LightningElement,track,api,wire } from "lwc";
import getFisheryData from '@salesforce/apex/ProductionDataController.getFisheryData';
import getPastFisheryData from '@salesforce/apex/ProductionDataController.getPastFisheryData';

import insertUpdateNewProductionRecords from '@salesforce/apex/ProductionDataController.insertUpdateNewProductionRecords';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import removeFoodProductRecord from '@salesforce/apex/ProductionDataController.removeFoodProductRecord'; 
//import getAdapterConfig from '@salesforce/apex/NrocEducationAndEmploymentController.getAdapterConfig';
//import getCertificateList from '@salesforce/apex/NrocEducationAndEmploymentController.getCertificateList';
import {getObjectInfo, getPicklistValues} from 'lightning/uiObjectInfoApi';
import { deleteRecord } from 'lightning/uiRecordApi';


import { refreshApex } from '@salesforce/apex';
import { FlowNavigationNextEvent,FlowNavigationBackEvent } from 'lightning/flowSupport';

import FOODPRODUCTION_OBJECT from '@salesforce/schema/Food_Production__c';
import SPECIES_OF_FISH_FIELD from "@salesforce/schema/Food_Production__c.Species_of_Fish__c";
import NumberOfFailedLogins from "@salesforce/schema/User.NumberOfFailedLogins";


export default class FishFarmProductionInput extends LightningElement {
	@api
	recordId;
    @api farmId;
    @api selectedYear;
    @api selectedQuarter;
    @api foodProduceList
	@api
	objectApiName;

    isLoading = false; 
    hasError = false;
    @api errorMessage = '';

    
    validationMessage; 
    @track iterator = [];
    previousYearData = [];
    hasExistingData = false; 
    wiredData;
    fisheryData;
    count = 0;
    speciesOfFishSelection;
    percentThreshold = 0.2; 
    @api foodProductionSubmissionId = '';


    @wire(getPicklistValues, { recordTypeId: "012000000000000AAA", fieldApiName: SPECIES_OF_FISH_FIELD })
    picklistResults({ error, data }) {
        if (data) {
          this.speciesOfFishSelection = data.values;
          this.error = undefined;
        } else if (error) {
          this.error = error;
          this.speciesOfFishSelection = undefined;
        }
    }
    
    connectedCallback(){
        this.retrieveExistingData();
        
        
        
    }

    retrievePastData(){
        this.previousYearData = [];
        getPastFisheryData({farmId:this.farmId, year:this.selectedYear, period:this.selectedQuarter})
        .then(result => {
            if(result) {
                console.log('Past Data '+ JSON.stringify(result));
                this.previousYearData = result;
                if(this.hasExistingData == false){
                    for(let i=0; i<this.previousYearData.length; i++){
                        this.count++;
                        this.iterator.push({
                            //Id,Species_of_Fish__c,Fingerlings_Eggs_Species__c, Quantity__c,Transhipped__c,Unit_of_Measure__c,Average_Price__c,Food_Production_Submission__c
                            'autoNumber': this.count,
                            'Id':  "",
                            'Species_of_Fish__c': this.previousYearData[i].Species_of_Fish__c,
                            'Fingerlings_Eggs_Species__c': this.previousYearData[i].Fingerlings_Eggs_Species__c, 
                            'Quantity__c': this.previousYearData[i].Quantity__c,
                            'Transhipped__c': this.previousYearData[i].Transhipped__c,
                            'Unit_of_Measure__c': this.previousYearData[i].Unit_of_Measure__c ,
                            'Average_Price__c': this.previousYearData[i].Average_Price__c,
                            'Food_Production_Submission__c': this.foodProductionSubmissionId
                        });
                    }
                }
                this.validateThresholds(false);
                this.validateDuplicates(); 
                this.validateRequired();  
                
            }else {
                //this.accounts =undefined;
                console.error("error with getting existing data records", JSON.stringify(error));
                this.error = error;
            }
        }).catch(error => {
            console.log('getPastFisheryData-->',error.message);
        });
    }


    retrieveExistingData(){
        this.iterator = [];
        getFisheryData({farmId:this.farmId, year:this.selectedYear, period:this.selectedQuarter})
        .then(result => {
            if(result) {
                console.log('FisheryData '+ JSON.stringify(result));
                this.fisheryData = result;
                if(this.fisheryData.length>0){
                    //this.foodProductionSubmissionId = this.fisheryData[0].Food_Production_Submission__c;
                    this.hasExistingData = true; 
                }else{
                    this.hasExistingData = false; 
                }
                this.retrievePastData();

                for(let i=0; i<this.fisheryData.length; i++){
                    this.count++;
                    this.iterator.push({
                        //Id,Species_of_Fish__c,Fingerlings_Eggs_Species__c, Quantity__c,Transhipped__c,Unit_of_Measure__c,Average_Price__c,Food_Production_Submission__c
                        'autoNumber': this.count,
                        'Id':  this.fisheryData[i].Id,
                        'Species_of_Fish__c': this.fisheryData[i].Species_of_Fish__c,
                        'Fingerlings_Eggs_Species__c': this.fisheryData[i].Fingerlings_Eggs_Species__c, 
                        'Quantity__c': this.fisheryData[i].Quantity__c,
                        'Transhipped__c': this.fisheryData[i].Transhipped__c,
                        'Unit_of_Measure__c': this.fisheryData[i].Unit_of_Measure__c ,
                        'Average_Price__c': this.fisheryData[i].Average_Price__c,
                        'Food_Production_Submission__c': this.fisheryData[i].Food_Production_Submission__c
                    });
                }
                console.log("initialised the iterator", JSON.stringify(this.iterator));
            }else {
                //this.accounts =undefined;
                console.error("error with getting existing data records", JSON.stringify(error));
                this.error = error;
            }

        }).catch(error => {
            console.log('81-->',error.message);
        });
    } //end of retrieveExistingData function

    handleFieldChange(event){
        let dataType = event.target.type;
        let dataValue = event.target.value; 
        if(dataType == "checkbox"){
            dataValue = event.target.checked;
        }
        let fieldName = event.target.name;
        let autoNumber = event.target.dataset.autoNumber;
        let index = event.target.dataset.index;
        console.log("checkbox value is", event.target.checked);
        console.log('data value is', dataValue, "data type is ", dataType);
        console.log("fieldname is",fieldName, "auto number is", autoNumber, "index is", index);
        //event.target.setCustomValidity("Phone number is required");
        //event.target.reportValidity();
        this.iterator[index][fieldName]=dataValue;

        //duplicate species
        console.log("Duplicate check on species");

        if(fieldName == "Species_of_Fish__c"){
            this.validateDuplicates();
        }

        if(fieldName == "Quantity__c" || fieldName == "Average_Price__c" ){
            this.validateThresholds(false);
        }

        this.validateRequired();

        //thresholds 

        console.log("The iterator after updating", JSON.stringify(this.iterator));
        this.foodProduceList = this.iterator;
    }
    
    validateDuplicates(){
        let numberOfRecordsWithSameSpecies = 0 ; 
        let arrSpecies = [];
        let duplicateSpecies = [];
            for(let item of this.iterator){
                    
                if(arrSpecies.includes(item.Species_of_Fish__c)){
                    duplicateSpecies.push(item.Species_of_Fish__c);
                }else{
                    arrSpecies.push(item.Species_of_Fish__c);
                }
            }

            if(duplicateSpecies.length > 0){
                this.hasError = true; 
                console.log("There are more than one item with the same species");
                this.validationMessage = "Duplicate species of fish record. Please remove duplicate. 鱼类品种重复了。请删除重复的记录。";
                for(let item of this.iterator){
                    let articleBlock = this.template.querySelector('article[data-id="'+ item.autoNumber +'"]');
                    console.log("retrieved article block", JSON.stringify(articleBlock));
                    if(duplicateSpecies.includes(item.Species_of_Fish__c)){
                        if(articleBlock){
                            articleBlock.classList.add('errorneousRecord');
                            item.errorMsg = "Duplicate species of fish record. Please remove duplicate. 鱼类品种重复了。请删除重复的记录。"
                        }  
                    }else{
                        if(articleBlock){
                            articleBlock.classList.remove('errorneousRecord');
                            item.errorMsg = "";
                        } 
                    }
                }
                return true; 
            }else{ 
                this.hasError = false;
                for(let item of this.iterator){
                    let articleBlock = this.template.querySelector('article[data-id="'+ item.autoNumber +'"]');
                    if(articleBlock){
                        articleBlock.classList.remove('errorneousRecord');
                        item.errorMsg = "";
                    } 
                }
            }
    }

    validateThresholds(storeErrorMessage){

        console.log("Threshold Validation is executed", JSON.stringify(this.previousYearData));
        console.log("Number of previous year data" , this.previousYearData.length);
        this.errorMessage = ""; 
        if(this.previousYearData.length>0)
            for(let item of this.iterator){
                let species = item.Species_of_Fish__c; 
                let quantity = item.Quantity__c; 
                let currentPrice = item.Average_Price__c; 
                let pastRecord = this.previousYearData.filter(x => x.Species_of_Fish__c == item.Species_of_Fish__c);
                console.log("Past record retrieved", pastRecord);
                if(pastRecord != null){
                    let lowerThresholdQuantity = (1- this.percentThreshold) * pastRecord[0].Quantity__c; 
                    let upperThresholdQuantity = (1+ this.percentThreshold) * pastRecord[0].Quantity__c; 
                    let lowerThresholdPrice = (1- this.percentThreshold) * pastRecord[0].Average_Price__c; 
                    let upperThresholdPrice = (1+ this.percentThreshold) * pastRecord[0].Average_Price__c; 
                    let quantityInput = this.template.querySelector('lightning-input[data-autonumber="'+ item.autoNumber +'"][data-name="Quantity__c"]');
                    let priceInput = this.template.querySelector('lightning-input[data-autonumber="'+ item.autoNumber +'"][data-name="Average_Price__c"]');

                    if(quantity >upperThresholdQuantity || quantity < lowerThresholdQuantity){
                        console.log("species crosses threshold ", species , quantity);
                        console.log("lightning input", JSON.stringify(quantityInput));
                        if(storeErrorMessage){
                            this.errorMessage = this.errorMessage? this.errorMessage + "<br/>" + species + "- Please revalidate data. Quantity differs significantly from past year data of " +  pastRecord[0].Quantity__c : species + "- Please revalidate data. Quantity differs significantly from past year data of " +  pastRecord[0].Quantity__c ; 
                        }
                        item.Attention_Details__c = "Exceed Threshold";
                        quantityInput.setCustomValidity("Please revalidate data. Quantity differs significantly from past year data of " +  pastRecord[0].Quantity__c);
                        quantityInput.reportValidity();
                        //data-autonumber ={it.value.autoNumber}
                        //name="Quantity__c" 
                    }else{
                        quantityInput.setCustomValidity("");
                        quantityInput.reportValidity();
                    }

                    if(currentPrice >upperThresholdPrice || currentPrice < lowerThresholdPrice){
                        console.log("species crosses threshold ", species , quantity);
                        console.log("lightning input", JSON.stringify(quantityInput));
                        if(storeErrorMessage){
                            this.errorMessage = this.errorMessage? this.errorMessage + "<br/>" + species + "- Please revalidate data. Average Price differs significantly from past year data of S$" +  pastRecord[0].Average_Price__c : species + "- Please revalidate data. Average Price differs significantly from past year data of S$" +  pastRecord[0].Average_Price__c ; 
                        }
                        item.Attention_Details__c = "Exceed Threshold";
                        priceInput.setCustomValidity("Please revalidate data. Price differs significantly from past year data of S$" +  pastRecord[0].Average_Price__c);
                        priceInput.reportValidity();
                        //data-autonumber ={it.value.autoNumber}
                        //name="Quantity__c" 
                    }else{
                        priceInput.setCustomValidity("");
                        priceInput.reportValidity();
                    }
                } 
            }

            if(storeErrorMessage){
                for(let item of this.previousYearData){
                    let currentData = this.iterator.filter(x => x.Species_of_Fish__c == item.Species_of_Fish__c);
                    if(currentData.length ==0){
                        this.errorMessage = this.errorMessage ? this.errorMessage + "<br/>": this.errorMessage; 
                        this.errorMessage += item.Species_of_Fish__c + " - Missing Species Entry."; 
                    }
                }
            }
            
        //this.previousYearData
    }

    validateRequired(){
        console.log("This.iterator" , JSON.stringify(this.iterator));
        let hasRequiredError = false; 
        for(let item of this.iterator){
            //let lightningInputList = this.template.querySelectorAll('lightning-input[data-autonumber="'+ item.autoNumber +'"]');
            let lightningInputQty = this.template.querySelector('lightning-input[data-autonumber="'+ item.autoNumber +'"][data-name="Quantity__c"]');
            let lightningInputPrice = this.template.querySelector('lightning-input[data-autonumber="'+ item.autoNumber +'"][data-name="Average_Price__c"]');
            let lightningInputSpecies = this.template.querySelector('lightning-combobox[data-autonumber="'+ item.autoNumber +'"][data-name="Species_of_Fish__c"]');
            //console.log("retrieved lightningInputLists", JSON.stringify(lightningInputList));

            console.log("commencing data validity");
            console.log("validity of lightning input lightningInputQty", JSON.stringify(lightningInputQty.validity.valid) );
            console.log("validity of lightning input lightningInputPrice",  JSON.stringify(lightningInputPrice.validity.valid) );
            console.log("validity of lightning input lightningInputSpecies", JSON.stringify(lightningInputSpecies.validity.valid) );
            //lightningInputQty.reportValidity();
            //lightningInputPrice.reportValidity();
            //lightningInputSpecies.reportValidity();

            if(lightningInputQty.validity.valid == false && lightningInputQty.validity.valueMissing == true){
                hasRequiredError = true; 
                console.log("quantity found validity false " + item.autoNumber);
                this.validationMessage = "Quantity Required for Item " + item.autoNumber;
                lightningInputQty.reportValidity();

            }

            if(lightningInputPrice.validity.valid == false && lightningInputPrice.validity.valueMissing == true){
                hasRequiredError = true; 
                console.log("Price found validity false " + item.autoNumber);
                this.validationMessage = "Average Price Required for Item " + item.autoNumber;
                lightningInputPrice.reportValidity();

            }

            if(lightningInputSpecies.validity.valid == false && lightningInputSpecies.validity.valueMissing == true){
                hasRequiredError = true; 
                console.log("lightningInputSpecies found validity false " + item.autoNumber);
                this.validationMessage = "Species Required for Item " + item.autoNumber;
                lightningInputSpecies.reportValidity();

            }

            if(hasRequiredError == false && this.hasError == false){
                this.hasError = false; 
            }else if(hasRequiredError == true){
                this.hasError = true; 
            }

            
        }
    }

    handleSpeciesChange(event){
        //event.target.dataset.id
    }//end of handleSpeciesChange function

    handleQuantityChange(event){

    }//end of handleQuantityChange function

    handlePriceChange(event){

    }//end of handlePriceChange function

    handleTranshippedChange(event){
        
    }//end of handleTranshippedChange function


    //handleAddProduction is used for adding new item in the list 
    handleAddProduction(event){
        this.count++;
        console.log("adding autonumber" + this.count);
        this.iterator.push({
            'autoNumber': this.count,
            'Id': '',
            'Species_of_Fish__c': '',
            'Fingerlings_Eggs_Species__c': '', 
            'Quantity__c': '',
            'Transhipped__c': '',
            'Unit_of_Measure__c': 'Kg' ,
            'Average_Price__c': '',
            'Food_Production_Submission__c': this.foodProductionSubmissionId
        });
        refreshApex(this.iterator);

    }//end of handleAddProduction function

    handleRemoveItem(event){

        this.isLoading = true; 
        const id = event.target.dataset.id; 
        const autoNumber = event.target.dataset.index; 
        if(id == ""){
            console.log("removing autoNumber", autoNumber);
            const spliceIndex = event.target.dataset.index;
            console.log("The iterator before splicing", JSON.stringify(this.iterator));
            console.log("splicing item index", this.iterator.findIndex(item => item.autoNumber == autoNumber));
            this.iterator = this.iterator.filter(item => item.autoNumber != autoNumber );
            console.log("The iterator after splicing", JSON.stringify(this.iterator));
            this.showToast("success", "Success","Successfully removed record")
            this.isLoading = false; 
        }else{
            console.log("removing Id", id);
            deleteRecord(id)
            .then(result => {
                console.log("Deletion Result" , result);
                console.log("Successfully removed item; "+ id);
                this.iterator = this.iterator.filter(item => item.Id != id );
                //this.iterator.splice(this.iterator.findIndex(item => item.Id == id), 1);
                this.isLoading = false; 
                this.showToast("success", "Success","Successfully removed record")
            }).catch(error => {
                this.isLoading = false; 
                this.showToast("error", "Failed","Failed to removed record")
                console.log('81-->',JSON.stringify(error));
            });
        }
        
        refreshApex(this.iterator);
        
    }

    handleBack() {
        console.log("This.iterator" , JSON.stringify(this.iterator));
        this.updateProductionData();
        /*createCertificateRecords({ contactId: this.contactId, coachApplicationId:this.coachApplicationId,  certificateList: this.iterator })
        .then(result => {
            // Handle success
            console.log('Dynamic object processed successfully:', result);
        })
        .catch(error => {
            // Handle error
            console.error('Error processing dynamic object:', error);
        });*/
        
        const navigateBackEvent = new FlowNavigationBackEvent();
        this.dispatchEvent(navigateBackEvent);
          
    }

    handleNext(){
        this.validateDuplicates();
        this.validateRequired();
        this.validateThresholds(true)

        console.log("next has error?", this.hasError);
        if(this.hasError == true){
            this.showToast('error','Errorneous Data', this.validationMessage);
            // myArray.filter((value, index, array) => array.indexOf(value) === index);
        }else{
            this.foodProduceList = this.iterator;
            this.updateProductionData();
            const navigateNextEvent = new FlowNavigationNextEvent();
            this.dispatchEvent(navigateNextEvent);
        }
            
    }

    updateProductionData(){
        this.isLoading = true;
        let recordToInsert =  this.iterator.filter(item => item.Id == "").map(({Id, ...rest}) => {
            return rest;
          });
        let recordToUpdate = this.iterator.filter(item => item.Id != "");
        
        console.log("Records to Insert", JSON.stringify(recordToInsert));
        console.log("Records to Update" , JSON.stringify(recordToUpdate));
        //String parendtId, List<Food_Production__c> insertProductionList, List<Food_Production__c> updateProductionList
        this.foodProduceList = this.iterator;

        insertUpdateNewProductionRecords({parendtId:this.foodProductionSubmissionId,insertProductionList:recordToInsert, updateProductionList:recordToUpdate })
            .then(result =>{
                console.log("Succesfully updated records");
                this.retrieveExistingData();
                this.isLoading = false;
                this.showToast("success", "Success","Successfully saved data.")
                return true;
            }).catch(error => {
            // Handle error
                this.showToast("error", "Failed","Failed to save data. Contact your administrator.")
                console.error('Error updating records', error);
                this.isLoading = false;

                return false;
             });
    }

    showToast(variant, title,message){
        const event = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(event);
    }
}