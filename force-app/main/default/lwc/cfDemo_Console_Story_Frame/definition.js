let definition =
      {"states":[{"fields":[],"conditions":{"id":"state-condition-object","isParent":true,"group":[]},"definedActions":{"actions":[]},"name":"Active","isSmartAction":false,"smartAction":{},"styleObject":{"padding":[],"margin":[{"type":"bottom","size":"x-small","label":"bottom:x-small"}],"container":{"class":""},"size":{"isResponsive":false,"default":"12"},"sizeClass":"slds-size_12-of-12 ","class":" slds-m-bottom_x-small ","background":{"color":"","image":"","size":"","repeat":"","position":""},"border":{"type":[],"width":"","color":"","radius":"","style":""},"elementStyleProperties":{},"text":{"align":"","color":""},"inlineStyle":"","style":"             "},"components":{"layer-0":{"children":[{"name":"Block","element":"block","size":{"isResponsive":false,"default":"12"},"stateIndex":0,"class":"slds-col ","property":{"label":"Block","collapsible":false,"record":"{record}","collapsedByDefault":false,"card":"{card}"},"type":"block","styleObject":{"padding":[{"type":"around","size":"x-small","label":"around:x-small"}],"class":"slds-p-around_x-small ","sizeClass":"slds-size_12-of-12 ","margin":[],"background":{"color":"#F4F6F9","image":"","size":"","repeat":"","position":""},"size":{"isResponsive":false,"default":"12"},"container":{"class":""},"border":{"type":"","width":"","color":"","radius":"","style":""},"elementStyleProperties":{},"text":{"align":"","color":""},"inlineStyle":"","style":"background-color:#F4F6F9;             "},"children":[{"name":"Text","element":"outputField","size":{"isResponsive":true,"default":"9","large":"9","medium":"11","small":"11"},"stateIndex":0,"class":"slds-col ","property":{"record":"{record}","mergeField":"%3Cdiv%3E%3Cspan%20style=%22font-size:%2012pt;%22%3E%3Cspan%20class=%22slds-text-heading_medium%22%3E%7BfilterLabel%7D%3C/span%3E%3C/span%3E%3C/div%3E","card":"{card}"},"type":"text","styleObject":{"sizeClass":"slds-large-size_9-of-12  slds-medium-size_11-of-12  slds-small-size_11-of-12  slds-size_9-of-12 ","size":{"isResponsive":true,"default":"9","large":"9","medium":"11","small":"11"},"padding":[],"margin":[],"background":{"color":"","image":"","size":"","repeat":"","position":""},"container":{"class":""},"border":{"type":"","width":"","color":"","radius":"","style":""},"elementStyleProperties":{},"text":{"align":"","color":""},"inlineStyle":"padding-top:10px; padding-left:18px","minHeight":"20px","class":"","style":"          min-height:20px;   padding-top:10px; padding-left:18px"},"elementLabel":"txtCustomerStoryLabel","userUpdatedElementLabel":true,"key":"element_element_block_0_0_outputField_0_0","parentElementKey":"element_block_0_0"},{"name":"Menu","element":"flexMenu","size":{"isResponsive":true,"default":"3","large":"3","medium":"1","small":"1"},"stateIndex":0,"class":"slds-col ","property":{"type":"action","size":"small","variant":"neutral","iconName":"utility:filter","overflow":true,"record":"{record}","card":"{card}","menuItems":[{"name":"menu-item-0-0","label":"All","iconName":"","actionData":{"stateObj":"{record}","card":"{card}","stateAction":{"id":"flex-action-1608762639558","type":"cardAction","displayName":"All","vlocityIcon":"","targetType":"Web Page","openUrlIn":"Current Window","Web Page":{"targetName":"/apex"},"eventName":"updatedatasource","parent":"menu","message":"{\"type\":\"IntegrationProcedures\",\"value\":{\"ipMethod\":\"CustomerStory_Marshaller\",\"vlocityAsync\":false,\"inputMap\":{\"accountId\":\"{recordId}\",\"inboundFilter\":\"\"}},\"orderBy\":{\"name\":\"\",\"isReverse\":false},\"contextVariables\":[{\"name\":\"recordId\",\"val\":\"001ao00000D6zwnAAS\",\"id\":2}]}"},"isTrackingDisabled":true},"iconPosition":""},{"name":"menu-item-1631568894296-0","label":"Paused Process","iconName":"","actionData":{"stateObj":"{record}","card":"{card}","stateAction":{"id":"flex-action-1631571303915","type":"cardAction","displayName":"Paused Process","vlocityIcon":"","targetType":"Web Page","openUrlIn":"Current Window","Web Page":{"targetName":"/apex"},"eventName":"updatedatasource","message":"{\"type\":\"IntegrationProcedures\",\"value\":{\"dsDelay\":0,\"ipMethod\":\"CustomerStory_Marshaller\",\"vlocityAsync\":false,\"inputMap\":{\"accountId\":\"{recordId}\",\"inboundFilter\":\"OmniScript\"}},\"orderBy\":{\"name\":\"\",\"isReverse\":false},\"contextVariables\":[{\"name\":\"recordId\",\"val\":\"001ao00000D6zwoAAB\",\"id\":2}]}","parent":"menu"}}},{"name":"menu-item-1-0","label":"Cases","iconName":"","actionData":{"stateObj":"{record}","card":"{card}","stateAction":{"id":"flex-action-1608762715596","type":"cardAction","displayName":"Cases","vlocityIcon":"","targetType":"Web Page","openUrlIn":"Current Window","Web Page":{"targetName":"/apex"},"eventName":"updatedatasource","parent":"menu","message":"{\"type\":\"IntegrationProcedures\",\"value\":{\"ipMethod\":\"CustomerStory_Marshaller\",\"vlocityAsync\":false,\"inputMap\":{\"accountId\":\"{recordId}\",\"inboundFilter\":\"Cases\"}},\"orderBy\":{\"name\":\"\",\"isReverse\":false},\"contextVariables\":[{\"name\":\"recordId\",\"val\":\"001ao00000D6zwnAAS\",\"id\":2}]}"},"isTrackingDisabled":true},"iconPosition":""},{"name":"menu-item-2-0","label":"Opportunities","iconName":"","actionData":{"stateObj":"{record}","card":"{card}","stateAction":{"id":"flex-action-1608763321487","type":"cardAction","displayName":"Opportunities","vlocityIcon":"","targetType":"Web Page","openUrlIn":"Current Window","Web Page":{"targetName":"/apex"},"parent":"menu","eventName":"updatedatasource","message":"{\"type\":\"IntegrationProcedures\",\"value\":{\"ipMethod\":\"CustomerStory_Marshaller\",\"vlocityAsync\":false,\"inputMap\":{\"accountId\":\"{recordId}\",\"inboundFilter\":\"Opportunities\"}},\"orderBy\":{\"name\":\"\",\"isReverse\":false},\"contextVariables\":[{\"name\":\"recordId\",\"val\":\"001ao00000D6zwnAAS\",\"id\":2}]}"},"isTrackingDisabled":true},"iconPosition":""},{"name":"menu-item-5-0","label":"Orders","iconName":"","actionData":{"stateObj":"{record}","card":"{card}","stateAction":{"id":"flex-action-1617074155480","type":"cardAction","displayName":"Orders","vlocityIcon":"","targetType":"Web Page","openUrlIn":"Current Window","Web Page":{"targetName":"/apex"},"eventName":"updatedatasource","parent":"menu","message":"{\"type\":\"IntegrationProcedures\",\"value\":{\"ipMethod\":\"CustomerStory_Marshaller\",\"vlocityAsync\":false,\"inputMap\":{\"accountId\":\"{recordId}\",\"inboundFilter\":\"Orders\"}},\"orderBy\":{\"name\":\"\",\"isReverse\":false},\"contextVariables\":[{\"name\":\"recordId\",\"val\":\"001ao00000D6zwoAAB\",\"id\":2}]}"}}},{"name":"menu-item-6-0","label":"Work Orders","iconName":"","actionData":{"stateObj":"{record}","card":"{card}","stateAction":{"id":"flex-action-1617074165863","type":"cardAction","displayName":"Work Orders","vlocityIcon":"","targetType":"Web Page","openUrlIn":"Current Window","Web Page":{"targetName":"/apex"},"eventName":"updatedatasource","parent":"menu","message":"{\"type\":\"IntegrationProcedures\",\"value\":{\"ipMethod\":\"CustomerStory_Marshaller\",\"vlocityAsync\":false,\"inputMap\":{\"accountId\":\"{recordId}\",\"inboundFilter\":\"WorkOrders\"}},\"orderBy\":{\"name\":\"\",\"isReverse\":false},\"contextVariables\":[{\"name\":\"recordId\",\"val\":\"001ao00000D6zwoAAB\",\"id\":2}]}"}}},{"name":"menu-item-3-0","label":"Tasks","iconName":"","actionData":{"stateObj":"{record}","card":"{card}","stateAction":{"id":"flex-action-1617073822838","type":"cardAction","displayName":"Tasks","vlocityIcon":"","targetType":"Web Page","openUrlIn":"Current Window","Web Page":{"targetName":"/apex"},"eventName":"updatedatasource","parent":"menu","message":"{\"type\":\"IntegrationProcedures\",\"value\":{\"ipMethod\":\"CustomerStory_Marshaller\",\"vlocityAsync\":false,\"inputMap\":{\"accountId\":\"{recordId}\",\"inboundFilter\":\"Tasks\"}},\"orderBy\":{\"name\":\"\",\"isReverse\":false},\"contextVariables\":[{\"name\":\"recordId\",\"val\":\"001ao00000D6zwnAAS\",\"id\":2}]}"},"isTrackingDisabled":true},"iconPosition":""},{"name":"menu-item-1622764336697-0","label":"Application","iconName":"","actionData":{"stateObj":"{record}","card":"{card}","stateAction":{"id":"flex-action-1622764336726","type":"cardAction","displayName":"Application","vlocityIcon":"","targetType":"Web Page","openUrlIn":"Current Window","Web Page":{"targetName":"/apex"},"eventName":"updatedatasource","message":"{\"type\":\"IntegrationProcedures\",\"value\":{\"ipMethod\":\"CustomerStory_Marshaller\",\"vlocityAsync\":false,\"inputMap\":{\"accountId\":\"{recordId}\",\"inboundFilter\":\"Applications\"}},\"orderBy\":{\"name\":\"\",\"isReverse\":false},\"contextVariables\":[{\"name\":\"recordId\",\"val\":\"001ao00000D6zwoAAB\",\"id\":2}]}","parent":"menu"}}}],"label":"","position":"right","iconPosition":"left","iconSize":"x-small"},"type":"element","styleObject":{"sizeClass":"slds-large-size_3-of-12 slds-medium-size_1-of-12 slds-small-size_1-of-12 slds-size_3-of-12 ","size":{"isResponsive":true,"default":"3","large":"3","medium":"1","small":"1"},"padding":[{"type":"right","size":"x-small","label":"right:x-small"}],"margin":[],"background":{"color":"","image":"","size":"","repeat":"","position":""},"container":{"class":""},"border":{"type":"","width":"","color":"","radius":"","style":""},"elementStyleProperties":{},"text":{"align":"left","color":""},"inlineStyle":"padding-top:7px;","minHeight":"","class":"slds-text-align_left slds-p-right_x-small ","style":"     : #ccc 1px solid; \n         padding-top:7px;"},"elementLabel":"mnuFilter","userUpdatedElementLabel":true,"key":"element_element_block_0_0_flexMenu_1_0","parentElementKey":"element_block_0_0","styleObjects":[{"key":0,"conditions":"default","styleObject":{"sizeClass":"slds-large-size_3-of-12 slds-medium-size_1-of-12 slds-small-size_1-of-12 slds-size_3-of-12 ","size":{"isResponsive":true,"default":"3","large":"3","medium":"1","small":"1"},"padding":[{"type":"right","size":"x-small","label":"right:x-small"}],"margin":[],"background":{"color":"","image":"","size":"","repeat":"","position":""},"container":{"class":""},"border":{"type":"","width":"","color":"","radius":"","style":""},"elementStyleProperties":{},"text":{"align":"left","color":""},"inlineStyle":"padding-top:7px;","minHeight":"","class":"slds-text-align_left slds-p-right_x-small ","style":"     : #ccc 1px solid; \n         padding-top:7px;"},"label":"Default","name":"Default","conditionString":"","draggable":false}]}],"elementLabel":"Block-3"},{"name":"FlexCard","element":"childCardPreview","size":{"isResponsive":true,"default":"12","large":"12","medium":"12","small":"12"},"stateIndex":0,"class":"slds-col ","property":{"cardName":"demo_Console_Story_Card","recordId":"{recordId}","cardNode":"{record.InteractionActivities}","selectedState":"Case","isChildCardTrackingEnabled":false},"type":"element","styleObject":{"sizeClass":"slds-large-size_12-of-12 slds-medium-size_12-of-12 slds-small-size_12-of-12 slds-size_12-of-12 ","padding":[{"type":"left","size":"x-small","label":"left:x-small"},{"type":"top","size":"x-small","label":"top:x-small"},{"type":"right","size":"x-small","label":"right:x-small"}],"margin":[],"background":{"color":"#ffffff","image":"","size":"","repeat":"","position":""},"size":{"isResponsive":true,"default":"12","large":"12","medium":"12","small":"12"},"container":{"class":""},"border":{"type":"","width":"","color":"","radius":"","style":""},"elementStyleProperties":{},"text":{"align":"","color":""},"inlineStyle":"","class":"slds-p-left_x-small slds-p-top_x-small slds-p-right_x-small ","style":"background-color:#ffffff;             "},"elementLabel":"FlexCard-4"}]}},"childCards":["demo_Console_Story_Card"],"actions":[],"omniscripts":[],"documents":[]}],"dataSource":{"type":"IntegrationProcedures","value":{"dsDelay":"","ipMethod":"CustomerStory_Marshaller","vlocityAsync":false,"inputMap":{"accountId":"{recordId}"},"resultVar":""},"orderBy":{"name":"","isReverse":false},"contextVariables":[]},"title":"demo_Console_Story_Frame","enableLwc":true,"isFlex":true,"theme":"slds","lwc":{"DeveloperName":"cfDemo_Console_Story_Frame_3_sfi","Id":"0Rbao000000TeKpKAA","MasterLabel":"cfDemo_Console_Story_Frame_3_sfi","NamespacePrefix":"c","ManageableState":"unmanaged"},"events":[{"eventname":"data","channelname":"interactionStoryList","element":"action","eventtype":"pubsub","recordIndex":"0","actionData":{"card":"{card}","stateAction":{"id":"flex-action-1608761832946","type":"cardAction","eventName":"updatedatasource","message":"{\"type\":\"IntegrationProcedures\",\"value\":{\"ipMethod\":\"CustomerStory_Marshaller\",\"vlocityAsync\":false,\"inputMap\":{\"accountId\":\"{recordId}\",\"inboundFilter\":\"\"}},\"orderBy\":{\"name\":\"\",\"isReverse\":false},\"contextVariables\":[{\"name\":\"recordId\",\"val\":\"\",\"id\":1}]}"},"isTrackingDisabled":true},"key":"event-0","displayLabel":"interactionStoryList:data","eventLabel":"pubsub"}],"dynamicCanvasWidth":{"type":"desktop"},"globalCSS":true,"Id":"0koao0000001v7YQAI","OmniUiCardKey":"demo_Console_Story_Frame/sfi/3/1631568839688","OmniUiCardType":"Parent"};
  export default definition