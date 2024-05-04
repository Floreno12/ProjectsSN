getEstimatedTimeOfConfig: function(configID) {
    // GET CONFIG
    var configGR = new GlideRecord('x_akt_guardicore_config');
    if (configGR.get(configID)) {

        // START CONFIGURATION
        var config = configGR;
        var table = configGR.getValue('server_table');
        var maxExecutionTime = config.getValue('time');

        
        // GET KEYFIELDS AND THEIR TYPES
        var keyFields = config.getValue('label_key_fields').trim().split(','); // test splitting using (',')
        var keyFieldsObject = {}; // {"ip_address" : "string"}

        for (var i = 0; i < keyFields.length; i++) {
            keyFieldsObject.sys_name = keyFields[i];
            keyFieldsObject.fieldType = getTypeOfKeyField(keyFields[i], table);
        }


        // UPDATING "RECORD COUNTER" FIELD
        var aggregate = new GlideAggregate(configGR.getValue('server_table'));
        var countRecords = 0;

        var encodedQuery = configGR.encoded_query + '';
        if (encodedQuery.toString().trim() != '') aggregate.addEncodedQuery(encodedQuery);
        aggregate.addAggregate('COUNT');
        aggregate.query();

        if (aggregate.next()) {
            countRecords = parseInt(aggregate.getAggregate('COUNT'));
            configGR.count = countRecords;
            configGR.workflow_state = 'skipped';
            configGR.update();
        }


        // CALCULATING ESTIMATED TIME OF PARENT KEYFIELDS
        var totalEstimatedTime = 0; // in seconds

        for (var keyFieldName in keyFieldsObject) {
            var keyFieldType = keyFieldsObject[keyFieldName];
            totalEstimatedTime += getEstimatedTimeOfKeyField(keyFieldType, keyFieldName, countRecords);
        }


        // // CALCULATING CHILD ESTIMATED TIME
        // var ETFromChildConfigs = 100;
        // totalEstimatedTime += ETFromChildConfigs;


        // APPLYING COEFFICINETS
        var totalCoeff = 1.0; // 100% - base ET

        // MORE THEN 60k RECORDS LIMIT COEFFICIENT
        var bigDataCoeff = 1.3; // +30%
        var isMoreThan60k = countRecords > 60000;
        if (isMoreThan60k) {
            totalCoeff += bigDataCoeff - 1;
        }


        // BUFFER COEFF
        var bufferCoeff = 1.1; // +10% to ET
        totalCoeff += bufferCoeff - 1;


        // DEBUGGING COEFF
        var debugMode = config.getValue('debug');
        var debugCoeff = 1.16; // +16% to ET
        var verbose = 2;
        if (debugMode == verbose) {
            totalCoeff += debugCoeff - 1;
        }

        totalEstimatedTime *= totalCoeff;
    }

    gs.info("Guardicore >> getEstimatedTimeOfConfig() >> totalEstimatedTime: " + totalEstimatedTime + "seconds");

    return totalEstimatedTime;
}


getEstimatedTimeOfKeyField: function(keyFieldType, keyFieldName, amountOfRecords){
    var defaultSpeed = 20; // [Label/Sec] For types, that not estimated ever
    var speedMatrix = { // [Label/Sec] For estimated types
        'string': 67,
        'integer': 25.3,
        'choice': 94,
        'boolean': 96,
        'custom_string': 58.8,
        'custom_choice': 94,
        'custom_boolean': 96,
        'custom_integer': 25.3,
    }

    isCustom = keyFieldName.slice(0, 2) == 'u_';
    if (isCustom) {
        keyFieldType = "custom_" + keyFieldType;
    }

    var totalFieldET = 0;
    var speed = 0;

    
    
    switch (keyFieldType) {
        case 'string':
        case 'integer':
        case 'choice':
        case 'boolean':
        case 'custom_string':
        case 'custom_choice':
        case 'custom_integer':
        case 'custom_boolean':
            var speed = speedMatrix[keyFieldType];
            break;
        default:
            speed = defaultSpeed;
            break;
    }

    totalFieldET = (amountOfRecords / speed);
    return totalFieldET;
}

getTypeOfKeyField: function(keyFieldName, table){
    var type = "string";
    return type;
}