export const OMNIDEF = {"userTimeZone":-420,"userProfile":"System Administrator","userName":"contributor@gps.ido","userId":"005ao0000013YJIQAE","userCurrencyCode":"USD","timeStamp":"2022-07-13T19:07:16.991Z","sOmniScriptId":"0jNao000000345dUAQ","sobjPL":{},"RPBundle":"","rMap":{},"response":null,"propSetMap":{"mockResponseMap":{},"ttlMinutes":5,"queueableChainableHeapSizeLimit":6,"queueableChainableCpuLimit":40000,"queueableChainableQueriesLimit":120,"additionalChainableResponse":{},"chainableActualTimeLimit":null,"chainableSoslQueriesLimit":null,"chainableQueryRowsLimit":null,"chainableDMLRowsLimit":null,"chainableHeapSizeLimit":null,"chainableCpuLimit":2000,"chainableDMLStatementsLimit":null,"chainableQueriesLimit":50,"rollbackOnError":false,"nameColumn":"","description":"","labelPlural":"","labelSingular":"","relationshipFieldsMap":[],"columnsPropertyMap":[],"includeAllActionsInResponse":false,"trackingCustomData":{},"linkToExternalObject":""},"prefillJSON":"{}","lwcId":"492c4528-eb92-f6ef-d1e3-05bffee9f4c9","labelMap":{"ipResponse":"ipResponse","generateDocumentService":"generateDocumentService","setupServiceCallInputParams":"setupServiceCallInputParams"},"labelKeyMap":{},"errorMsg":"","error":"OK","dMap":{},"depSOPL":{},"depCusPL":{},"cusPL":{},"children":[{"type":"Set Values","propSetMap":{"disOnTplt":false,"label":"SetValues1","show":null,"actionMessage":"","chainOnStep":false,"responseJSONNode":"","responseJSONPath":"","elementValueMap":{"title":"=IF(OR(%title%==null, %title%==''), null, %title%)"},"failOnStepError":true,"failureConditionalFormula":"","executionConditionalFormula":"","aggElements":{}},"offSet":0,"name":"setupServiceCallInputParams","level":0,"indexInParent":0,"bHasAttachment":false,"bEmbed":false,"bSetValues":true,"JSONPath":"setupServiceCallInputParams","lwcId":"lwc0"},{"type":"Remote Action","propSetMap":{"disOnTplt":false,"label":"RemoteAction1","show":null,"additionalChainableResponse":{},"actionMessage":"","chainOnStep":false,"remoteMethod":"generateDocument","remoteOptions":{"outputFileFormat":"%outputFileFormat%","title":"%setupServiceCallInputParams:title%"},"remoteClass":"DocumentServiceGateway","sendJSONNode":"","sendJSONPath":"","responseJSONNode":"","responseJSONPath":"","returnOnlyFailureResponse":false,"returnOnlyAdditionalOutput":false,"sendOnlyAdditionalInput":false,"failureResponse":{},"additionalOutput":{},"additionalInput":{"templateId":"%templateId%","objectId":"%objectId%"},"useFormulas":true,"failOnStepError":true,"failureConditionalFormula":"","executionConditionalFormula":"","aggElements":{}},"offSet":0,"name":"generateDocumentService","level":0,"indexInParent":1,"bHasAttachment":false,"bEmbed":false,"bRemoteAction":true,"JSONPath":"generateDocumentService","lwcId":"lwc1"},{"type":"Response Action","propSetMap":{"disOnTplt":false,"label":"ResponseAction1","show":null,"vlcResponseHeaders":{},"responseDefaultData":{},"sendJSONNode":"","sendJSONPath":"","responseJSONNode":"","responseJSONPath":"","responseFormat":"JSON","returnFullDataJSON":false,"returnOnlyAdditionalOutput":true,"additionalOutput":{"jobId":"=%generateDocumentService:jobId%","errorMessage":"=IF(%generateDocumentService:success%==true, '', %generateDocumentService:error%)","isSuccessfulTransaction":"=%generateDocumentService:success%","pdfContentVersionId":"%generateDocumentService:pdfContentVersionId%","docContentVersionId":"%generateDocumentService:docContentVersionId%"},"useFormulas":true,"executionConditionalFormula":"","aggElements":{}},"offSet":0,"name":"ipResponse","level":0,"indexInParent":2,"bHasAttachment":false,"bEmbed":false,"JSONPath":"ipResponse","lwcId":"lwc2"}],"bReusable":false,"bpVersion":1,"bpType":"DocumentServiceGateway","bpSubType":"DocGeneration","bpLang":"Procedure","bHasAttachment":false,"lwcVarMap":{}};