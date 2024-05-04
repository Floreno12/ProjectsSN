
var EmptyArray = [];
var configGR = new GlideRecord('x_akt_guardicore_config');
var server = new GlideRecord('cmdb_ci_service');
this.amount = 5;
this.setname = 'forward';
//add index oportunity inserting the table 
this.indexcreat = ['cmdb_ci_server','cmdb_ci_service'];
//add the json format for autput

// Call the function to process relationships
_processRelationships(server, EmptyArray, configGR);

// Function to process relationships
function _processRelationships(server, EmptyArray) {
var Tableserever = server;
    //var Tableserever = new GlideRecord(server);
    Tableserever.addNotNullQuery('ip_address'); // Add conditions to not null fields
    // Add more not null queries as needed

    Tableserever.query();
    while (Tableserever.next()) {
        //Call the function to check duplicates and push into EmptyArray
        if (EmptyArray.indexOf(Tableserever.sys_id.toString()) == -1) {
            EmptyArray.push(Tableserever.sys_id.toString());
        }

 //and i wont to add the amount of record wich i wont to generet        
//this can help my to automatecli update newRecord in cmdb
// if(var i = 0; i < amount;i++){
// var gr = Tableserever;
// gr.newRecord();
// gr.setValue('name', this.setname);
// gr.caller_id='a8f98bb0eb32010045e1a5115206fe3a';
// gr.short_description='demoinsert';
// gr.insert(); 
// }


// Add conditions to not null fields

this.gelint = 0;


        //  if(var i = 0; i < this.gelint; i++){
        //     var configGR = new GlideRecord('x_akt_guardicore_config');
        //     var Counting = 0;
        //     configGR.setValue(Counting, this.gelint);
        //     configGR.update();
            
        //  }

gs.info('how many value with ip' +Tableserever.getValue('name'));
        //gs.info('Counting the table ' + Tableserever.getValue('name') + ': ' + CountCI.getAggregate('COUNT'));
    }
    
    

    for(var i = 0; i < this.amount; i++){
        var Creat = new GlideRecord('cmdb_ci_server');
        Creat.newRecord();
        Creat.caller_id('a8f98bb0eb32010045e1a5115206fe3a');
        Creat.short_description('new Record already exist');
        Creat.setValue('name', this.setname);
        Creat.insert();
    }

             var CountCI = new GlideAggregate('cmdb_ci_service');
         CountCI.addNotNullQuery('ip_address');
         CountCI.addAggregate('COUNT','ip_address'); // Count the 'ip_address' field
         CountCI.query();

         while(CountCI.next()){
            this.gelint++;
            var calculate = CountCI.getAggregate('COUNT', 'ip_address');
            gs.info('finde mant ip ' +calculate);
            //gs.info('how many times' +this.gelint);
            //this.gelint =+ 1;
         }

         this.nullu = 0;
         if(this.nullu < this.gelint){
            gs.info('Counting ' +this.gelint);
         }
}