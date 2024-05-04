









//GuardicoreUtils

function Controler (name,pass,...){
//2.var password = current.getValue('password');
var access = current.getValue('on');


    if(access == true){


        var config = GlideRecord('akt_guardicore');
        config.insert('5d41ee8247ed4250df9c02b2846d4317');
        config.setValue(password, 'password');
        config.setValue(user, 'admin');
        config.update()


        while(config.next()){


        }
    }

}


//one more GlideRecord for creted by


//time: new GlideDataTime('');
//use the bissess rule
//sort by created and by prefix
//populete this in function in GuardicoreUtils
//



function getParm (table, prefix, prefixCH){

    var table = '';
    var prefix = '';

    

var create = '';// create config
var filter = '';//populete filter
//create config
//loop by every record in cmdb 
while(){

}


var get_value = '';
var filter_prifix = '';


for(var i = 0; i < records.length; i++){
var array_record = [];
array_record.push();
}

//create filter dependency from amount records and name

var gr = GlideRecord();
gr.setValue(Filter, array_record+Prefix);
gr.query();





}