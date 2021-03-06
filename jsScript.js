var typeOfShift= "";
var currentTimeStamp= new Date();
var previousTimeStamp= new Date();
var sg1CountCurrent= 0,sg2CountCurrent= 0,sg1TotalCount= 0,sg2TotalCount= 0;
document.getElementById('workDetails').style.display= 'none';
document.getElementById('liveReport').style.display= 'none';
const breakValue= "Break";
/***
 * This function is getting used for reading the initial shift details from the user
 * @returns false always to prevent submission of the form
 */
function initialShiftSelection(){
    typeOfShift= document.getElementById('shiftName').value;
    initializeSystem();
    document.getElementById('shiftDetails').style.display= 'none';
    document.getElementById('workDetails').style.display= '';
    document.getElementById('liveReport').style.display= '';
    return false;
}
/***
 * This function is mainly getting used for initializing the Page after receving initial Details
 */
function initializeSystem(){
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let basicDetails= document.getElementById("basicDetails");
    let textNode= "Report For "+currentTimeStamp.getDate()+" "+months[currentTimeStamp.getMonth()]+" "+currentTimeStamp.getFullYear()+" "+days[currentTimeStamp.getDay()]+" "+typeOfShift;
    let heading1= document.createElement("h2");
    heading1.setAttribute("id","reportHeading");
    heading1.appendChild(document.createTextNode(textNode));
    basicDetails.appendChild(heading1);
    let tableCaption= document.createElement("caption");
    tableCaption.appendChild(document.createTextNode(textNode));
    let table1= document.getElementById('reportDetails');
    table1.insertBefore(tableCaption,table1.childNodes[0]);
    //For the summary data table part
    let totalDataCaption= document.createElement("caption");
    totalDataCaption.appendChild(document.createTextNode(textNode.replace("Report For","Total Data of")));
    let summaryDataTable= document.getElementById("summaryDetails");
    summaryDataTable.insertBefore(totalDataCaption,summaryDataTable.childNodes[0]);
    const options= {weekday: 'long',year:'numeric',month: 'short', day:'numeric'};
    document.title= 'SIA - Report For '+currentTimeStamp.toLocaleDateString('en-us',options)+" "+typeOfShift;
    let selectMenu= document.getElementById('typeOfJob');
    let optionForBreak= document.createElement('option');
    optionForBreak.text= breakValue;
    optionForBreak.value= breakValue;
    selectMenu.add(optionForBreak);
    if(typeOfShift!='Normal Shift'){//Incase the shift is not morning
        let rtOption= document.createElement('option');
        rtOption.text= "Real Time";
        rtOption.value= "Real Time";
        selectMenu.add(rtOption);
    }
}
/***
 * Changes the date entry object to CSV Readable Format
 * @param {Date} date1 Date Object which is required to be converted to the required CSV String
 * @returns Excel Readable String
 */
 function dateToString(date1){
    let month= date1.getMonth()+1;
    let text= month+"/"+date1.getDate()+"/"+date1.getFullYear()+" "+date1.getHours()+":"+date1.getMinutes()+":"+date1.getSeconds();
    return text;
}
/***
 * This function is mainly getting used to add works in between two intervals in the work.
 */
function addWork(){
    let formForWork= document.getElementById('formForWorkDetails');
    let formDetails= new FormData(formForWork);
    let typeOfJob= formDetails.get('typeOfJob');
    let reviewerCount= formDetails.get('reviewerCount');
    let currentWorkCount;
    let reviewerCrash= false;
    let reviwerCrashInput= (formDetails.get('reviewerStatus')=='reviewerCrashed')?true:false;
    previousTimeStamp= currentTimeStamp;
    currentTimeStamp= new Date();
    switch(typeOfJob){
        case "Scan Gap 1":
            currentWorkCount= reviewerCount-sg1CountCurrent;
            if(reviwerCrashInput){
                sg1CountCurrent= reviewerCount;
                sg1TotalCount= sg1TotalCount+parseInt(reviewerCount);
                currentWorkCount= reviewerCount;
                reviewerCrash= true;
            }
            else if(currentWorkCount<=0){
                reviewerCrash= confirm("The count entered is the less than the previous input Count\nHas The Reviewer crashed ?\nPlease enter the restoration time\nPress Ok to Confirm otherwise press cancel to discard");
                if(reviewerCrash==false)
                    return false;
                else{
                    sg1CountCurrent= reviewerCount;
                    sg1TotalCount= sg1TotalCount+parseInt(reviewerCount);
                    currentWorkCount= reviewerCount;
                }
            }
            else{
                sg1CountCurrent= reviewerCount;
                sg1TotalCount= sg1TotalCount+currentWorkCount;
            }
        break;
        case "Scan Gap 2":
            currentWorkCount= reviewerCount-sg2CountCurrent;
            if(reviwerCrashInput){//This part checks whether the reviewer crashed
                sg2CountCurrent= reviewerCount;
                sg2TotalCount= sg2TotalCount+parseInt(reviewerCount);//Fixed this part
                currentWorkCount= reviewerCount;
                reviewerCrash= true;
            }
            else if(currentWorkCount<=0){
                reviewerCrash= confirm("The count entered is the less than the previous input Count\nHas The Reviewer crashed ?\nPlease enter the restoration time\nPress Ok to Confirm otherwise press cancel to discard");
                if(reviewerCrash==false)
                    return false;
                else{
                    sg2CountCurrent= reviewerCount;
                    sg2TotalCount= sg2TotalCount+parseInt(reviewerCount);//Fixed this part
                    currentWorkCount= reviewerCount;
                }
            }
            else{
                sg2CountCurrent= reviewerCount;
                sg2TotalCount= sg2TotalCount+currentWorkCount;
            }
        break;
    }
    let tbody1= document.getElementById('reportDetails').querySelector('tbody');
    let row= tbody1.insertRow();
    row.insertCell().appendChild(document.createTextNode(dateToString(previousTimeStamp)));
    row.insertCell().appendChild(document.createTextNode(dateToString(currentTimeStamp)));
    row.insertCell().appendChild(document.createTextNode(typeOfJob));
    if(typeOfJob=="TC"){
        row.insertCell().appendChild(document.createTextNode("Refer To Script Data"));
        row.insertCell().appendChild(document.createTextNode("Refer To Script Data"));
    }
    else if((typeOfJob=='Real Time')||(typeOfJob==breakValue)){//This option is mainly for Real Time
        row.insertCell().appendChild(document.createTextNode("Not Applicable"));
        row.insertCell().appendChild(document.createTextNode("Not Applicable"));
    }
    else{
        row.insertCell().appendChild(document.createTextNode(reviewerCount));
        row.insertCell().appendChild(document.createTextNode(currentWorkCount));
    }
    if(reviewerCrash==true)
        row.insertCell().appendChild(document.createTextNode("Reviewer Crashed"));
    else{
        row.insertCell();
    }
    formForWork.reset();
    let cellForSG1Count= document.getElementById('sg1Count');
    let cellForSG2Count= document.getElementById('sg2Count');
    cellForSG1Count.innerText= sg1TotalCount;
    cellForSG2Count.innerText= sg2TotalCount;
    document.getElementById('reviewerCount').disabled= false;
    return false;
}
/***
 * This function mainly sets the count deactive or active based on the type of the job
 */
function checkCount(){
    let valueOfSelection= document.getElementById('typeOfJob').value;
    if((valueOfSelection=="TC")||(valueOfSelection=='Real Time')||(valueOfSelection==breakValue))
        document.getElementById('reviewerCount').disabled= true;
    else
        document.getElementById('reviewerCount').disabled= false;
}
/***
 * This function is mainly used for generating the CSV File from the given records
 */
function generateReport(){
    const table1= document.getElementById('reportDetails');
    let rows= table1.getElementsByTagName('tr');
    if(rows.length==1)
        alert('No Records Found To Download');
    else{
        let csv_data= [];
        for(let i= 0;i<rows.length;i++){
            let cols= rows[i].querySelectorAll('td,th');
            let csv_row= [];
            for(let j= 0;j<cols.length;j++)
                csv_row.push(cols[j].innerHTML);
            csv_data.push(csv_row.join(","));
        }
        csv_final_string= csv_data.join("\n");
        generateCSV(csv_final_string);
    }
}
/***
 * This function is creating the csv file for download
 */
function generateCSV(csv_data){
    CSVFile= new Blob([csv_data],{type: "text/csv"});
    let tempLink= document.createElement('a');
    tempLink.download= generateFileName();
    let url= window.URL.createObjectURL(CSVFile);
    tempLink.href= url;
    tempLink.style.display= "none";
    tempLink.click();
}
/***
 * This function is maily working to generate the file name based on the shift details entered prior
 * @returns The Generated File Name
 */
function generateFileName(){
    let currentTime= new Date();
    let finalString= "SIAReport_"+currentTime.getFullYear()+"-"+(currentTime.getMonth()+1)+"-"+currentTime.getDate()+"_"+currentTime.getHours()+"-"+currentTime.getMinutes()+"-"+currentTime.getSeconds()+"_"+typeOfShift.replace(/ /g,'_')+".csv";
    return finalString;
}