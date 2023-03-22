(function ($) {
	/************************************************
	*                                               *
	*   Templatefunktionen fuer Create/Edit         *
	*                                               *
	*************************************************/
	// copy the ori to another method name
	$.hik.jtable.prototype._showAddRecordFormOri = $.hik.jtable.prototype._showAddRecordForm;
	$.hik.jtable.prototype._showEditFormOri = $.hik.jtable.prototype._showEditForm;
	$.hik.jtable.prototype._createInputLabelForRecordFieldOri = $.hik.jtable.prototype._createInputLabelForRecordField;
	
	//extension members
	$.extend(true, $.hik.jtable.prototype, {
	
		/***********************************************************************************
        * DEFAULT OPTIONS / EVENTS                                                         *
		* Modifikation: Option Template eingefügt, Template für jede Table einzeln wählbar *
        ***********************************************************************************/
        options: {
			template: '#JTableCreateFormTemplate',
		},
		/* Shows add new record dialog form.
		*************************************************************************/
		_showAddRecordForm: function () {
			var self = this;
			var template = $(this.options.template).clone().get(0);
	
			if(!template) {
				// call the ori if not found the template!
				self._showAddRecordFormOri();return;}
			//Create add new record form
			var $addRecordForm = $('<form id="jtable-create-form" class="jtable-dialog-form jtable-create-form" action="' + self.options.actions.createAction + '" method="POST"></form>');
	
			//Create input elements
			for (var i = 0; i < self._fieldList.length; i++) {
				var fieldName = self._fieldList[i];
				var field = self.options.fields[fieldName];
				var labelPos = $('#__LABEL_' + fieldName + '__', template).get(0);
				var inputPos = $('#__' + fieldName + '__', template).get(0);
				//Do not create input for fields that is key and not specially marked as creatable
				if (field.key == true && field.create != true) {continue;}
				//Do not create input for fields that are not creatable
				if (field.create == false) {continue;}
				if (field.type == 'hidden') {$(template).append( self._createInputForHidden(fieldName, field.defaultValue) );continue;}
				//Create a label for input
				var $label = self._createInputLabelForRecordField(fieldName);
				if(labelPos) {$(labelPos).replaceWith( $label.contents() );}
				else {$(template).append( $label );}
				//Create input element
				var $input = self._createInputForRecordField({fieldName: fieldName, formType: 'create', form: $addRecordForm});
	
				if(inputPos) {$(inputPos).replaceWith( $input.contents() );}
				else {$(template).append( $input );}
			}
	
			$addRecordForm.append( $(template).contents() );
			self._makeCascadeDropDowns($addRecordForm, undefined, 'create');
			//Open the form
			self._$addRecordDiv.append($addRecordForm).dialog('open');
			self._trigger("formCreated", null, { form: $addRecordForm, formType: 'create' });
		},
	
		/* Shows edit form for a row.
		*************************************************************************/
		_showEditForm: function ($tableRow) {
			var self = this;
			var record = $tableRow.data('record');
			var template = $(this.options.template).clone().get(0);
			
			if(!template) {
				// call the ori if not found the template!
				self._showEditFormOri($tableRow);return;}
			//Create edit form
			var $editForm = $('<form id="jtable-edit-form" class="jtable-dialog-form jtable-edit-form" action="' + self.options.actions.updateAction + '" method="POST"></form>');
	
			//Create input fields
			for (var i = 0; i < self._fieldList.length; i++) {
				var fieldName = self._fieldList[i];
				var field = self.options.fields[fieldName];
				var fieldValue = record[fieldName];
				var labelPos = $('#__LABEL_' + fieldName + '__', template).get(0);
				var inputPos = $('#__' + fieldName + '__', template).get(0);
				if (field.key == true) {
					if (field.edit != true) {
						//Create hidden field for key
						$(template).append( self._createInputForHidden(fieldName, fieldValue) );continue;} 
					else {
						//Create a special hidden field for key (since key is be editable)
						$(template).append( self._createInputForHidden('jtRecordKey', fieldValue) );}
				}
	
				//Do not create element for non-editable fields
				if (field.edit == false) {continue;}
				//Hidden field
				if (field.type == 'hidden') {$(template).append( self._createInputForHidden(fieldName, field.defaultValue) );continue;}
				//Create a label for input
				var $label = self._createInputLabelForRecordField(fieldName);
				if(labelPos) {$(labelPos).replaceWith( $label.contents() );} 
				else {$(template).append( $label );}
	
				//Create input element with it's current value
				var currentValue = self._getValueForRecordField(record, fieldName);
				var $input = self._createInputForRecordField({fieldName: fieldName,value: currentValue,record: record,formType: 'edit',form: $editForm});
				if(inputPos) {$(inputPos).replaceWith( $input.contents() );} 
				else {$(template).append( $input );}
			}
			$editForm.append( $(template).contents() );
			self._makeCascadeDropDowns($editForm, record, 'edit');
			//Open dialog
			self._$editingRow = $tableRow;
			self._$editDiv.append($editForm).dialog('open');
			self._trigger("formCreated", null, { form: $editForm, formType: 'edit', record: record, row: $tableRow });
		},
		
		/*downloadOptions: function (data){
			this._downloadOptions(data.fieldName, data.url)
		},*/
		
		/* Creates label for an input element.
        *************************************************************************/
        _createInputLabelForRecordField: function (fieldName) {
            //TODO: May create label tag instead of a div.
			$label = $('<label />')
					.attr({"for": "Edit-" + fieldName, "title": this.options.fields[fieldName].tooltip})
					.tooltip({ tooltipClass: "jtable-tooltip", content: function(){return $(this).prop('title');} })
					.html(this.options.fields[fieldName].inputTitle || this.options.fields[fieldName].title);
            return $('<div />')
				.append($label)
                .addClass('jtable-input-label');
        },
	});
})(jQuery);