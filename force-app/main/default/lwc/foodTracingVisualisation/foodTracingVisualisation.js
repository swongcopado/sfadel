import {LightningElement, api, wire, track} from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {loadScript} from 'lightning/platformResourceLoader';
import D3 from '@salesforce/resourceUrl/d3js';
import getSupplyChainData from '@salesforce/apex/ProductionDataController.getSupplyChainData';
import getFoodSupplyTracingData from '@salesforce/apex/ProductionDataController.getFoodSupplyTracingData';
import getAccountData from '@salesforce/apex/ProductionDataController.getAccountData';
import legendImage from "@salesforce/resourceUrl/nodeLegend";
//getFoodSupplyTracingData

import FOOD_SUPPLY_TRACING_FIELD from '@salesforce/schema/Supply_Chain__c.Food_Supply_Tracing__c';

//to remove after testing
import getAccounts from '@salesforce/apex/D3PlaygroundController.getAccounts';

const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Delete', name: 'delete' },
];

const supplyChainColumns = [
    { label: 'Reported By', fieldName: 'Reported_By__c' },
    { label: 'Source From', fieldName: 'Source_From_Name__c' },
    { label: 'Supply To', fieldName: 'Supply_To_Name__c', type: 'text' },
    { label: 'Quantity', fieldName: 'Quantity__c', type: 'number' },
    { label: 'Unit', fieldName: 'Unit_of_Measure__c', type: 'text' },
    { label: 'Status', fieldName: 'Status__c', type: 'text' },
    { label: 'Days Since Initiated', fieldName: 'Days_Since_Initiated__c', type: 'number' },
    { label: 'Timeliness', fieldName: 'Timeliness__c'},
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    }
];


export default class FoodTracingVisualisation extends LightningElement {

    legendImage = legendImage; 
    d3Initialized = false;
    svgWidth = 1400;
    svgHeight = 500;
    foodTracingId ="a4bao000000OCHlAAO";


    @track showMenu = false; 

    linkData = [];
    nodeData = []; 

    //@wire(getAccounts)
    data;
    foodRecallHeaders = [{label:"FST-00001 - Häagen-Dazs", value:"FST-00001"} , {label:"FST-00002 - EGO Swiss Roll" , value:"FST-00002"}];
    supplyChainColumns = supplyChainColumns; 
    @track supplyChainData = [];
    tableDisplayData = [];

    @track timeVal = '0:0:0:0';
    timeIntervalInstance;
    totalMilliseconds = 0;

    fsProduct;
    fsLot;
    fsStatus;
    fsReason;
    fsTargetComplete; 

    selectedNodeId ="";
    selectedNodeName = "All";

    start(targetDateTime){
        var parentThis = this;
        // Run timer code in every 100 milliseconds
        let durationDifference = Date.parse(this.fsTargetComplete) - Date.now() ;
        parentThis.totalMilliseconds = durationDifference;
        this.timeIntervalInstance = setInterval(function() {

            // Time calculations for hours, minutes, seconds and milliseconds
            var days = new String(Math.floor((parentThis.totalMilliseconds / (1000 * 60 * 60 * 24))));
            var hours = new String(Math.floor((parentThis.totalMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
            var minutes = new String(Math.floor((parentThis.totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60)));
            var seconds = new String(Math.floor((parentThis.totalMilliseconds % (1000 * 60)) / 1000));
            var milliseconds = Math.floor((parentThis.totalMilliseconds % (1000)));

            // Output the result in the timeVal variable
            parentThis.timeVal = days + " day(s) " + hours.padStart(2, '0') + ":" + minutes.padStart(2, '0') + ":" +seconds.padStart(2, '0') ;   
            parentThis.totalMilliseconds -= 1000;

        }, 1000);
    }

    connectedCallback(){

        this.refreshFoodTracingData();
       
        this.template.addEventListener('click', event=>{
            //console.log("captured document click event", this.showMenu);
            console.log("clicked on element", JSON.stringify(event.target));
            let dropDownMenu = this.template.querySelector("div[data-id='dropDownMenu']");
            if(dropDownMenu){
                dropDownMenu.classList.remove("slds-is-open"); 
                this.selectedNodeName = "All" 
                this.selectedNodeId ="";
            }
            this.tableDisplayData = this.supplyChainData;
        }, false);
    }

    handleMenuSelection(event){
       console.log("function pressed", event.target.dataset.id); 
    }

    disconnectedCallback(){
        //document.removeEventListener('click', this.clickHandler, true);
    }

    clickHandler(event){
        console.log("captured document click event", this);
        let dropDownMenu = this.template.querySelector("div[data-id='dropDownMenu']");
        if(dropDownMenu){
            dropDownMenu.classList.remove("slds-is-open"); 
        }
    }



    renderedCallback() {
        if (this.d3Initialized) {
            return;
        }
        this.d3Initialized = true;

        loadScript(this, D3)//+ '/d3.min.js'
            .then(() => {
                //return getAccounts();
                return [{source: "Establishment A", target: "Establishment B", status: "Require", sourceDetermined:true},{source: "Establishment B", target: "Establishment C", type: "suit",sourceDetermined:false},{source: "Establishment D", target: "Establishment B", type: "licensing",sourceDetermined:true}]
            })
            .then((response) => {
                //this.renderBarChart(response);
                //this.renderNetwork(response);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                       title: 'Error loading D3',
                        message: error.message,
                        variant: 'error'
                    })
                );
            });
    }

    handleFoodRecallChange(event){
        console.log("event.target.value",event.target.value );
        this.foodTracingId = event.target.value; 
        this.refreshFoodTracingData(); 
    }

    
    renderNetwork(data, nodeData){
        const svg = d3.select(this.template.querySelector('svg.d3'));
        //d3.select("svg").remove();

        const width = this.svgWidth;
        
        if(nodeData.length > 10){
            let additionalHeight = (nodeData.length - 10) *30;
            this.svgHeight = this.svgHeight + additionalHeight;
        }
        const height = this.svgHeight;

        //{source: "Establishment A", target: "Establishment B", type: "licensing", sourceDetermined:true}
        const types = Array.from(new Set(data.map(d => d.type)));
        const sourceDetermineds = Array.from(new Set(data.map(d => d.sourceDetermined)));
        const nodes = nodeData ? nodeData : Array.from(new Set(data.flatMap(l => [l.source, l.target])), id => ({id}));
        console.log("Nodes data", JSON.stringify(nodes));
        const links = data.map(d => Object.create(d))
        const color = d3.scaleOrdinal(types, d3.schemeCategory10);
        const color2 = d3.scaleOrdinal(sourceDetermineds, d3.schemeCategory10);
        //const linkArc =  d =>`M${d.source.x},${d.source.y}A0,0 0 0,1 ${d.target.x},${d.target.y}`;
    
        function linkArc(d) {
            const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
            return `
                M${d.source.x},${d.source.y}
                A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
            `;
        }

        const drag = simulation => {
    
                function dragstarted(event, d) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
                }
                
                function dragged(event, d) {
                
                d.fx = clamp(event.x, 0, width);
                    d.fy = clamp(event.y, 0, height);
                    simulation.alpha(1).restart();
                }
                
                function dragended(event, d) {
                /* if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;*/
                }
                
                return d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended);
        }

        const updateNode = (selection) => {
            selection.attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
        }

        const updateLink = (selection) => {
            selection
                .attr("x1", (d) => d.source.x)
                .attr("y1", (d) => d.source.y)
                .attr("x2", (d) => d.target.x)
                .attr("y2", (d) => d.target.y);
        };


        const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(300))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force("center", d3.forceCenter(width / 2, height / 3))
        .force('collide', d3.forceCollide(d => 50));
       
       // svg.attr("viewBox", [-this.svgWidth / 2, -this.svgHeight / 2, this.svgWidth, this.svgHeight]);
        
       //for the arrows
        svg.append("defs").selectAll("marker")
        .data(types)
        .join("marker")
        .attr("id", d => `arrow-${d}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 25)
        .attr("refY", -1)
        .attr("markerWidth", 7)
        .attr("markerHeight", 7)
        .attr("orient", "auto")
        .append("path")
        .attr("fill", colorLink)
        .attr("d", 'M0,-5L10,0L0,5');

        //alignment and font 
        svg
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto; font: 12px sans-serif;");

        //For the links between the nodes. 
        const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .selectAll("path")
        .data(links)
        .join("path")
        .attr("stroke", d => colorLink(d.type))
        .attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, location)})`);
//
        link.append("title")
        .text(function (d) {
            return d.type;
        });
    
        //defining the nodes
        const node = svg.append("g")
        .attr("fill", "currentColor")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .call(drag(simulation))
        .classed("nodeCursor", true);
        
    
        //defining outline of the node circle and fill 
        node.append("circle")
        .attr("stroke", d => colorNodeBorder(d.Name))
        .attr("stroke-width", 2)
        .attr("r", 15)
        .attr('fill', d => colorNode(d.Type));
        
        // for the text on the node 
        node.append("text")
            .attr("x", 17)
            .attr("y", "0.31em")
            .text(d => d.Name)
            .clone(true).lower()
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-width", 3);
        
        //for the hover over
        node.append('title').text(d => {
            return d.Name;
        });
        

        node.on('dblclick', (e, d) => console.log(nodes[d.index]));
        
        node.on('click', (e, d) => {
            console.log("clicked! node index", nodes[d.index]);
            this.selectedNodeName = nodes[d.index].Name; 
            this.selectedNodeId = nodes[d.index].id;

            this.tableDisplayData = this.supplyChainData.filter(x => (x.Supply_To__c ==this.selectedNodeId || x.Source_From__c ==this.selectedNodeId) );
            /*delete d.fx;
            delete d.fy;
            simulation.alpha(1).restart();*/
            //trigger event to display more data!
              
        });

     

        node.on('contextmenu', (event, d) => {
            event.preventDefault();
            console.log("this.showmenu", this.showMenu);
            console.log("🖱 right click detected!", nodes[d.index]);
            let dropDownMenu = this.template.querySelector("div[data-id='dropDownMenu']");
            if(dropDownMenu){
                dropDownMenu.classList.add("slds-is-open"); 
                dropDownMenu.style = "position:absolute; top:" + (nodes[d.index].y + 100) + "px; left:" + (nodes[d.index].x +300) + "px;";
            }
            this.showMenu = true; 
        });

        simulation.on("tick", anotherTicked);


        //help with spreading the nodes
        /*
        simulation.on("tick", () => {
            link.attr("d", linkArc);
            node.attr("transform", d => `translate(${d.x},${d.y})`);
        });
        */

        //simulation.force('link').links(links);
        //simulation.nodes(nodes).on('tick', ticked);
        function ticked() {
            link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
            node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
        }

        function anotherTicked(e){
            /*var ky = e.alpha;
            links.forEach(function(d, i) {
              d.target.y += (d.target.depth * 100 - d.target.y) * 5 * ky;
            });*/

            link.attr("d", linkArc);
            /*link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);*/
            node.attr("transform", d => `translate(${d.x},${d.y})`);
        }


        function sourceDeterminedColor(d){
            console.log("d", d);
            if(d == true){
                return "green";
            }else{
                return "red";
            }
        }

        function colorLink(d){
            console.log("color gathered", d);
            if(d=="Complete"){
                return "Green";
            }else if (d=="Initiated Entry"){
                return "Purple";
            }else if (d=="In Progress"){
                return "Orange";
            }else if (d=="Require Follow Up"){
                return "Red";
            }else if (d=="New"){
                return "Grey";
            }
        }

        function colorNode(d){
            if(d=="Distributor"){
                return "Green";
            }else if (d=="Merchant"){
                return "Orange";
            }else if (d=="Supplier"){
                return "Pink";
            }else{
                return "Grey";
            }
        }

        function colorNodeBorder(d){
            if(d=="Valentino Restaurant"){
                return "Red";
            }else {
                return "Grey";
            }
        }

        function clamp(x, lo, hi) {
            return x < lo ? lo : x > hi ? hi : x;
        }

   
    }//end of render Network


  

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'delete':
                this.deleteRow(row);
                break;
            case 'show_details':
                this.showRowDetails(row);
                break;
            default:
        }
    }

    deleteRow(row){

    }

    showRowDetails(row){

    }
    
    refreshSupplyChainData(){
        //foodTracingId
        this.supplyChainData = [];
        getSupplyChainData({foodTracingId:this.foodTracingId })
            .then(result => {
                console.log("supply chain data ", JSON.stringify(result));
                if(result){
                    this.supplyChainData = result;
                    if(this.selectedNodeId == ""){
                        this.tableDisplayData = this.supplyChainData;
                    }
                    this.linkData = [];
                    for(let item of this.supplyChainData){
                        //Id,Days_Since_Initiated__c,Source_From__c, Source_From_Name__c,Supply_To__c, Supply_To_Name__c,Status__c, Quantity__c,Unit_of_Measure__c,Source_Confirmed__c,Supply_Confirmed__c,Is_End_Node__c, Food_Supply_Tracing__c
                        this.linkData.push({source: item.Source_From__c, target: item.Supply_To__c, type: item.Status__c});
                    }
                    console.log("link data", this.linkData);
                    let accountIds = [];
                    accountIds = Array.from(new Set(this.linkData.flatMap(l => [l.source, l.target])), id => (id));
                    console.log("accountids", accountIds);
                    getAccountData({accountList:accountIds}).then(accountOutput =>{
                        if(accountOutput){
                            this.nodeData = accountOutput; 
                            this.nodeData = this.nodeData.map(({
                                Id: id,
                                ...rest
                              }) => ({
                                id,
                                ...rest
                              }));
                            console.log("this.node data", JSON.stringify(this.nodeData));

                            this.renderNetwork(this.linkData, this.nodeData)
                        }
                        

                    });
                    //this.renderNetwork(response);

                }

                
            
            });
    }

    refreshFoodTracingData(){
        
        getFoodSupplyTracingData({foodTracingId:this.foodTracingId })
            .then(result => {
                console.log("supply chain data ", JSON.stringify(result));
                if(result){

                    if(result.length ==0){
                        this.fsProduct = "";
                        this.fsLot = "";
                        this.fsStatus = "";
                        this.fsReason = "";
                        this.fsTargetComplete = "";
                        return;
                    }

                    //Product__c, Reason_for_Tracing__c,Status__c,Target_Completion_Date__c
                    this.foodSupplyTracingData = result;

                    this.fsProduct = this.foodSupplyTracingData[0].Product__c;
                    this.fsLot = this.foodSupplyTracingData[0].Affected_Lot_Number__c;
                    this.fsStatus = this.foodSupplyTracingData[0].Status__c;
                    this.fsReason = this.foodSupplyTracingData[0].Reason_for_Tracing__c;
                    this.fsTargetComplete = this.foodSupplyTracingData[0].Target_Completion_Date__c;

                    this.start();
                    
                    /*fsProduct;
                        fsLot;
                        fsStatus;
                        fsReason;*/
                }else{
                    
                }
                this.refreshSupplyChainData()
            
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

}//end of main export