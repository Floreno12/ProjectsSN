var ConfigP = new GlideRecord('x_akt_guardicore_config');
ConfigP.initialize();
ConfigP.username = 'snow-api';
ConfigP.endpoint = 'lab11-a.td.guardicore.com';
ConfigP.password = 'Ncx9boPZGchOQ8T2$';
ConfigP.encoded_query = 'nameSTARTSWITHKeyFieldsBigTestChainP'; // Create custom encoded query for table 
var parentRecordId = ConfigP.insert();

// Check if the parent record was inserted successfully before creating the child record
if (parentRecordId) {
    // Create the child record
    var ConfigCH = new GlideRecord('x_akt_guardicore_config');
    ConfigCH.initialize();
    ConfigCH.username = 'snow-api';
    ConfigCH.endpoint = 'lab11-a.td.guardicore.com';
    ConfigCH.password = 'Ncx9boPZGchOQ8T2$';
    ConfigCH.encoded_query = 'nameSTARTSWITHKeyFieldsBigTestChainP'; // Create custom encoded query for table 
    ConfigCH.parent = parentRecordId; // Set the reference field to the sys_id of the parent record
    var childRecordId = ConfigCH.insert();
}


//here
