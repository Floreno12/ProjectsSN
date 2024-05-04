var countLabelsToDelete = 1024;

var batch = 350; // should be less or equal 1024
var start_at = 280; // to skip some amount of labels. use it when you have a lot of failed labels
var expand = 'dynamic_assets'; // "static_assets"


// GET TOKEN
token: function(){
var centraIP = "lab11-a.td.guardicore.com";
var sm = new sn_ws.RESTMessageV2('GuardicoreRESTUtils', 'GetToken');
sm.setStringParameterNoEscape('aggregatorIP', centraIP);

var body = {
    "username": "snow-api",
    "password": "Ncx9boPZGchOQ8T2$"
};

sm.setRequestBody(JSON.stringify(body));


var response = sm.execute();
var responseBody = response.haveError() ? response.getErrorMessage() : response.getBody();
var status = response.getStatusCode();
var requestBody = sm ? sm.getRequestBody() : null;

var token = JSON.parse(responseBody).access_token;

gs.info("status:" + status);
gs.info("token = " + token);
if (status != 200) {
    gs.error("gu: execute() Centra IP: " + centraIP + "\nToken receiving failed, HTTP Status: " + status + ' | ' + body.username);
} else {
    gs.info("gu: execute: Centra IP: " + centraIP + "\nToken receiving successfull HTTP Status: " + status + " | " + gs.getUserName());
}
return token;
}



// MAIN CYCLE
var countToSkip = 0;
var countDeletedLabels = 0;


getList: function(centraIP,body){
while (countDeletedLabels < countLabelsToDelete) {

    try {
        // GET LIST OF LABEL IDs
        var sm = new sn_ws.RESTMessageV2('GuardicoreRESTUtils', 'GetListOfLabels');
        sm.setStringParameter('aggregatorIP', centraIP);
        sm.setRequestHeader('Authorization', 'bearer' + ' ' + token);

        sm.setQueryParameter('expand', expand);
        sm.setQueryParameter('fields', 'id');
        sm.setQueryParameter('max_results', batch);
        sm.setQueryParameter('start_at', 0 + countToSkip);

        var response = sm.execute();
        var responseBody = response.haveError() ? response.getErrorMessage() : response.getBody();
        var status = response.getStatusCode();

        gs.info("status = " + status);

        var labelsIDs = JSON.parse(responseBody).objects; // JSON string, list of ids

    

        // DELETE IDS
        var sm = new sn_ws.RESTMessageV2('GuardicoreRESTUtils', 'DeleteLabels');
        sm.setStringParameter('aggregatorIP', centraIP);
        sm.setRequestHeader('Authorization', 'bearer' + ' ' + token);

        body = labelsIDs;

        sm.setRequestBody(JSON.stringify(body));

        var response = sm.execute();
        var responseBody = response.haveError() ? response.getErrorMessage() : response.getBody();
        var status = response.getStatusCode();

        if (status != 200)
            gs.error("gu: _sendLabelsRequest() >> Centra IP: " + centraIP + "\nLabel creation/updation failed, HTTP Status: " + status + ' Response:' + responseBody + " | " + gs.getUserName());
        else {
            gs.info("gu: _sendLabelsRequest() >> Centra IP: " + centraIP + "\nLabel creation/updation successfull, HTTP Status: " + status + ' Response:' + responseBody + " | " + gs.getUserName());
        }

        // SUCCESS AND FAILED LABELS
        var responseBodyObject = JSON.parse(responseBody);

        var succededLabels = responseBodyObject.succeeded; // JSON string, list of ids
        var faildLabes = responseBodyObject.failed; // JSON string, list of ids
        
        countDeletedLabels += succededLabels.length;
        countToSkip = faildLabes.length;

        gs.info("!!!faildLabes length: " + faildLabes.length);
        gs.info("!!! SUCCEDED: " + countDeletedLabels);
    } catch (ex) {
        gs.info(ex);
    }
}
}
