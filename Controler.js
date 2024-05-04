var Controler = class.create();


Init: function (){

this.parm = '';
}



getParm: function (){
    var modes = current.getValue('mode');
    if(modes == 'replicated'){
    var gr = new GlideRecord ();
    gr.addQuery('',);
    gr.


    }
}

UIType: function (){
    var ui16 = new GlideRecord('UI Script');
    ui16.addQuery
    ui16.query();
}

send: function(){
    var sends = new RestmessageV2(vendor);
    sends.
    
    var URL = "https://your servicenow instance/api/now/v1/table/incident";


    var UserName = "admin";
    
    
    var Password = "your password"
    
    
    var r = new sn_ws.RESTMessageV2();
    
    
    r.setHttpMethod("get");
    
    
    r.setEndpoint(URL);
    
    
    r.setRequestHeader("Accept", "application/json");
    
    
    r.setBasicAuth(UserName,Password);
    
    
    var response = r.execute();
    
    
    gs.addInfoMessage(response.getBody());
}



var ConfigP = new GlideRecord('x_akt_guardicore_config');
ConfigP.initialythe();
ConfigP.setValue('username', 'snow-api');
ConfigP.setValue('endpoint', 'lab11-a.td.guardicore.com');
ConfigP.setValue('password', 'Ncx9boPZGchOQ8T2$');
ConfigP.setValue('encoded_query', 'nameSTARTSWITHKeyFieldsBigTestChainP');//create castom encoded query for table 

var newRecordId = ConfigP.insert();




var parent = new GlideRecord('x_akt_guardicore_config');
parent.initialythe();
parent.setValue('username', 'snow-api');
parent.setValue('endpoint', 'lab11-a.td.guardicore.com');
parent.setValue('password', 'Nc9boPZGchOQ8T2$');
var parentid = parent.insert();


if(parent){
    var child = new GlideRecord('x_akt_guardicore_config');
child.initialythe();
child.setValue('sys_id', parentid);//refernce field here
child.setValue('username', 'snow-api');
child.setValue('endpoint', 'lab11-a.td.guardicore.com');
child.setValue('password', 'Nc9boPZGchOQ8T2$');
var childid = child.insert();
gs.info('Child sys_id' +childid);
}




