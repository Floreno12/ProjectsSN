var countLabelsToDelete = 500000;

var batch = 500; // should be less or equal 1024
var start_at = 126; // to skip some amount of labels. use it when you have a lot of failed labels
var expand = 'dynamic_assets'; // "static_assets"

// MAIN SCRIPT
var startGDT = new GlideDateTime();

var terminationTime = new GlideDateTime();
var cancelAfterHours = 10; // current config contains termination hours		
terminationTime.addSeconds(3600 * cancelAfterHours); //3600


// GET TOKEN
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

gs.info("Deleter >> GET TOKEN >> status:" + status);
gs.info("Deleter >> GET TOKEN >> token: " + token);
if (status != 200) {
    gs.error("Deleter >> GET TOKEN >> Centra IP: " + centraIP + "\nToken receiving failed, HTTP Status: " + status + ' | ' + body.username);
} else {
    gs.info("Deleter >> GET TOKEN >> Centra IP: " + centraIP + "\nToken receiving successfull HTTP Status: " + status + " | " + gs.getUserName());
}




// MAIN CYCLE
var countToSkip = 0;
var countDeletedLabels = 0;
var countFailedLabels = 0;
var countErrors = 0;

while (countDeletedLabels < countLabelsToDelete) {

    if (isTerminationTime(terminationTime)) {
        gs.info("Termination TIME >>  BREAK terminationTime: " + terminationTime);
        gs.info(new GlideDateTime());
        break;
    }

    if (countLabelsToDelete - countDeletedLabels < batch) {
        batch = countLabelsToDelete - countDeletedLabels;
    }

    try {
        // GET LIST OF LABEL IDs
        var sm = new sn_ws.RESTMessageV2('GuardicoreRESTUtils', 'GetListOfLabels');
        sm.setStringParameter('aggregatorIP', centraIP);
        sm.setRequestHeader('Authorization', 'bearer' + ' ' + token);

        sm.setQueryParameter('expand', expand);
        sm.setQueryParameter('fields', 'id');
        sm.setQueryParameter('max_results', batch);
        sm.setQueryParameter('start_at', start_at + countToSkip);

        var response = sm.execute();
        var responseBody = response.haveError() ? response.getErrorMessage() : response.getBody();
        var status = response.getStatusCode();

        gs.info("Deleter >> GET LIST OF LABEL IDs >> status = " + status);

        var labelsIDs = null;
        if (status == 200) {
            labelsIDs = JSON.parse(responseBody).objects; // JSON string, list of ids
        } else {
            countErrors += 1;
            continue;
        }

        // DELETE LABELS
        if (labelsIDs) {
            var sm = new sn_ws.RESTMessageV2('GuardicoreRESTUtils', 'DeleteLabels');
            sm.setStringParameter('aggregatorIP', centraIP);
            sm.setRequestHeader('Authorization', 'bearer' + ' ' + token);

            body = labelsIDs;
            sm.setRequestBody(JSON.stringify(body));

            sm.executeAsync();
            
            // test
            countDeletedLabels += batch;
            // test

            // var responseBody = response.haveError() ? response.getErrorMessage() : response.getBody();
            // var status = response.getStatusCode();

            // gs.info("Deleter >> DELETE LABELS >> status = " + status);
            // if (status != 200)
            //     gs.error("Deleter >> DELETE LABELS >> Centra IP: " + centraIP + "\nLabel deleting failed, HTTP Status: " + status + ' Response:' + responseBody + " | " + gs.getUserName());
            // else {
            //     gs.info("Deleter >> DELETE LABELS >> Centra IP: " + centraIP + "\nLabel deleting successfull, HTTP Status: " + status + ' Response:' + responseBody + " | " + gs.getUserName());
            // }


            // // SUCCESS AND FAILED LABELS
            // var responseBodyObject = JSON.parse(responseBody);

            // var succededLabels = responseBodyObject.succeeded; // JSON string, list of ids
            // var faildLabes = responseBodyObject.failed; // JSON string, list of ids
            
            // countDeletedLabels += succededLabels.length;
            // countFailedLabels += faildLabes.length;
            // countToSkip += faildLabes.length;
            
            // gs.info("Deleter >> Failed: " + faildLabes.length + " Labels");
            // gs.info("Deleter >> Succeded: " + succededLabels.length  + " Labels");
            // gs.info("Deleter >> SUCCEDED TOTAL: " + countDeletedLabels  + " Labels");
            // gs.info("Deleter >> FAILED TOTAL: " + countFailedLabels + " Labels");
        }
    } catch (ex) {
        gs.info("Deleter >> exception: " + ex);
        countErrors += 1;
    }
}

// END OF SCRIPT
var endGDT = new GlideDateTime();

gs.info("Deleter >> REPORT >> STARTED at " + startGDT.getDisplayValue() + " FINISHED at " + endGDT.getDisplayValue());

// CALCULATE DURATION AND SPEED
var countTotalLabels = countDeletedLabels;
var dur = GlideDateTime.subtract(startGDT, endGDT);

var days = dur.getDayPart();
var hours = Number(dur.getByFormat('HH'));
var minutes = Number(dur.getByFormat('mm'));
var seconds = Number(dur.getByFormat('ss'));
var durationInSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;

var speedTotal = getSpeed(countTotalLabels, durationInSeconds);

// gs.info("Deleter >> REPORT >> Succeded total: " + countDeletedLabels);
// gs.info("Deleter >> REPORT >> Failed total: " + countFailedLabels);
gs.info("Deleter >> REPORT >> Count Errors: " + countErrors); // should be tested
gs.info("Deleter >> REPORT >> Dutation: " + hours + " hours " + minutes + " minutes " + seconds + " seconds");
gs.info("Deleter >> REPORT >> Speed Total: " + speedTotal.toFixed(1)  + " Label/Sec");

// // FUCNTIONS
function getSpeed(count, time) {
	return count / time;
}

function isTerminationTime(terminationTime) {
    return !terminationTime.after(new GlideDateTime());
}