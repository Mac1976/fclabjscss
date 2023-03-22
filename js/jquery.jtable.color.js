(function ($) {
	// copy the ori to another method name
	$.hik.jtable.prototype._createInputForRecordFieldOri = $.hik.jtable.prototype._createInputForRecordField;
	
	$.extend(true, $.hik.jtable.prototype, {
		_createInputForRecordField: function (funcParams) {
            var self = this;
			var fieldName = funcParams.fieldName,
                value = funcParams.value,
                record = funcParams.record,
                formType = funcParams.formType,
                form = funcParams.form;

            //Get the field
            var field = this.options.fields[fieldName];
			
			//Create input according to field type
            if (field.type == 'color') {
                return this._createColorInputForField(field, fieldName, value);
            } else {
				return self._createInputForRecordFieldOri(funcParams);
			}
		},
		_createColorInputForField: function (field, fieldName, value) {
            var $colors =['#FFFF00', '#0000FF', '#00FF00', '#FFCC99', '#FF8080', '#FF6600', '#FF0000', '#808080', '#C0C0C0', '#FFFFFF'];
			// Inverts a hex-colour
			var hexInvert = function (hex) {
				var r = hex.substr(0, 2);
				var g = hex.substr(2, 2);
				var b = hex.substr(4, 2);
		
				return 0.212671 * r + 0.715160 * g + 0.072169 * b < 0.5 ? 'ffffff' : '000000'
			};
			var $input = $('<input class="' + field.inputClass + ' small" id="Edit-' + fieldName + '" type="text" name="' + fieldName + '"></input>');
            
			if (value != undefined) {
                $input.val(value);
            }
			
			var $icon  = $('<a href="#" id="color-link"><img src="http://www.tide.ti.com/clab/BDB/images/color.gif" alt="Farbeauswahl" /></a>').click(function () {$dialog.dialog( "open" );});
			$('img', $icon).css({left: '5px', position: 'relative', top: '5px'});
			
			var $dialog = $('<div id="jquery-color-picker"></div>').dialog({autoOpen: false, modal: true, position: { my: "left top", at: "left top", of: "#color-link" }, width: 150, height: 160, buttons: {Ok: function() {$( this ).dialog( "close" );}}});
            var $loc   = '';
			for ($index = 0; $index < $colors.length; ++$index) {
				$loc += '<li><a href="#" title="'+ $colors[$index] + '" rel="' + $colors[$index] + '" style="background: ' + $colors[$index] + '; color: #' + hexInvert($colors[$index]) + ';">' + $colors[$index] + '</a></li>';
			}
			$dialog.append('<ul>' + $loc + '</ul>');
			// When you click a colour in the colour-picker
			$('a', $dialog).click(function () {
				// The hex is stored in the link's rel-attribute
				var $hex = jQuery(this).attr('rel');
	
				$input.val($hex);
	
				// If user wants to, change the input's BG to reflect the newly selected colour
				$input.css({background: '#' + $hex, color: '#' + hexInvert($hex)});
	
				// Trigger change-event on input
				$input.change();
	
				// Hide the colour-picker and return false
				$dialog.dialog( "close" );
	
				return false;
			});
			
			return $('<div />')
                .addClass('jtable-input jtable-text-input')
                .append($input)
				.append($icon);
        }
	});
})(jQuery);