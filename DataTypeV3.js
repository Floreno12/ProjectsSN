function getType(keyFields,config) {
    var table = new GlideRecord(config);
    table.setLimit(1);
    table.query();


    while (table.next()) {

        var glideElement = table.getElement(keyFields);
        gs.info('record name ' + glideElement);
        var descriptor = glideElement.getED();
        var internalType = descriptor.getInternalType();
        gs.info('type of value ' + internalType);


    }
    return internalType;
}

getType();