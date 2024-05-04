var table = "cmdb_ci_service"; // remember, that parent table contains all child records
var recordPrefix = "Scale Test Service 10000p"; // for selecting records in table for popukete all in records

//query
//query by table for  cmdb_ci_service
var queryString = "nameSTARTSWITH" + recordPrefix;
var gr = new GlideRecord(table);
gr.addEncodedQuery(queryString);
gr.query();


// Available types:
//population typy which you will be yo use 
var FieldType = {
	String: "String",
	Integer: "Integer",
	Boolean: "Boolean",
	Choice: "Choice"
};

// set filed sys_name and field type 
var field = "u_custom_integer_field";  // your (custom) field for populating 
var fieldType = FieldType.Integer; // must be one of the values from the "FieldType" objcet. CAN BE POPULATED AUTOMATICALLY (in future)

// set preferences for populating
var strValuePrefix = "CustomStringP "; // only for string type
var choices = ["value1", "value2", "value3"]; // only for choices type. Any count of values
var startInt = 0; // only for int type

var i = 1;
while (gr.next()) {

	switch(fieldType) {
		case FieldType.String:
		var strValue = strValuePrefix + i;
			gr.setValue(field, strValue);
		break;

		case FieldType.Choice:
			var index = (i - 1) % choices.length;
			var choiceValue = choices[index]; // even distribution
			gr.setValue(field, choiceValue);
		break;

		case FieldType.Integer:
			var intValue = startInt + i - 1;
			gr.setValue(field, intValue);
		break;
		
		case FieldType.Boolean:
			var boolValue = i % 2 == true; // 50% true and 50% false
			gr.setValue(field, boolValue);
		break;
	}
	
	gr.setWorkflow(false);
	gr.update();

	i += 1;
}

gs.info(i-1); 
