
function getType() {
    var table = new GlideRecord('x_akt_guardicore_config');
    table.addQuery('sys_id', 'ecae7f0a832d0210264dc8a6feaad35d');
    table.setLimit(1);
    table.query();


    while (table.next()) {

        var glideElement = table.getElement('label_key_fields');
        gs.info('record name ' + glideElement);
        var descriptor = glideElement.getED();
        var internalType = descriptor.getInternalType();
        gs.info('type of value ' + internalType);


    }
    return glideElement;
}

var glideElement = getType();




function getList(getElement){

    var getType = new GlideRecord('cmdb_ci_service');
    getType.addQuery('sys_id', '26da329f0a0a0bb400f69d8159bc753d');
    getType.setLimit(1);
    getType.query();


    while (getType.next()) {

        var Element = getType.getElement(getElement);
        gs.info('!!field value ' +Element);
        var descripto = Element.getED();
        var internalTyp = descripto.getInternalType();
        gs.info('Type of value ' + internalTyp);


    }
}

getList(glideElement);




