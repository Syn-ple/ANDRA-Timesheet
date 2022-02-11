/*
 * Author : Youssef BOUIGUA (Synvance)
 */
sap.ui.define([], function () {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function (sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},

		visibility: function (longtext, rejReason) {
			if (longtext == 'X' || rejReason) {
				return true;
			} else {
				return false;
			}
		},
		status: function (sValue) {
			this.oBundle = this.getModel("i18n").getResourceBundle();
			if (sValue == '10' || sValue == '60') {
				return this.oBundle.getText('InProcess');
			} else if (sValue == '20') {
				return this.oBundle.getText('Submitted');
			} else if (sValue == '30') {
				return this.oBundle.getText('Approved');
			} else if (sValue == '40') {
				return this.oBundle.getText('Rejected');
			} else if (sValue == '100') {
				return this.oBundle.getText('allStatus');
			} else if (sValue == '99') {
				return this.oBundle.getText('Approved');
			}

		},
		state: function (sValue) {
			if (sValue == '10') {
				return 'None';
			} else if (sValue == '20') {
				return 'None';
			} else if (sValue == '30') {
				return 'Success';
			} else if (sValue == '40') {
				return 'Error';
			}
		},
		dateString: function (sValue) {
			this.oFormatYyyymmdd = sap.ui.core.format.DateFormat.getInstance({
				pattern: "yyyy-MM-dd",
				calendarType: sap.ui.core.CalendarType.Gregorian
			});
			return String(this.oFormatYyyymmdd.format(sValue));
		},
		dateStringFormat: function (sValue) {
			this.oFormatYyyymmdd = sap.ui.core.format.DateFormat.getInstance({
				pattern: "EEEE, MMMM d",
				calendarType: sap.ui.core.CalendarType.Gregorian
			});
			return String(this.oFormatYyyymmdd.format(sValue));
		},
		dateStringFormat2: function (sValue) {
			// var dateString = new Date(sValue.match(/\d+/)[0] * 1);
			this.oFormatddMMMyyyy = sap.ui.core.format.DateFormat.getInstance({
				pattern: "dd MMM, yyyy",
				calendarType: sap.ui.core.CalendarType.Gregorian
			});
			return String(this.oFormatddMMMyyyy.format(sValue));
		},
		dateStringFormat2View: function (sValue) {
			return new Date(sValue.match(/\d+/)[0] * 1);
		},
		hoursValidation: function (recorded, target) {
			if (parseInt(recorded) < parseInt(target)) {
				return "Warning";
			} else if (parseInt(recorded) == 0 && parseInt(target) == 0) {
				return "None";
			} else if (parseInt(recorded) >= parseInt(target)) {
				return "Success";
			}
		},
		concatStrings: function (recorded, target) {
			return recorded + " / " + target;
		},
		mobconcatStrings: function (target, recorded) {
			this.oBundle = this.getModel("i18n").getResourceBundle();
			var oMissing = (parseFloat(target) - parseFloat(recorded)) > parseFloat(0) ? (parseFloat(target) - parseFloat(recorded)) : parseFloat(
				0);
			return this.oBundle.getText("mobMissingHours", [parseFloat(oMissing).toFixed(2)]);
		},
		concatDates: function (dateFrom, dateTo) {
			return dateFrom + "-" + dateTo;
		},
		formatToBackendString: function (oDate) {
			if (typeof oDate !== "object") {
				oDate = new Date(oDate);
			}
			var year = oDate.getUTCFullYear();
			var month = oDate.getUTCMonth() + 1;
			var day = oDate.getUTCDate();
			if (day < 10) {
				day = '0' + day;
			}
			if (month < 10) {
				month = '0' + month;
			}
			return year + '-' + month + '-' + day;
		},
		TodoState: function (status) {
			if (status == "40") {
				return "Error";
			} else {
				return "None";
			}
		},
		switchVisibility: function (status) {
			if (status) {
				return true;
			} else {
				return false;
			}
		},
		switchState: function (oValue) {
			if (typeof oValue === 'boolean') {
				return oValue;
			} else {
				return false;
			}
		},
		returnEditedTaskValue: function (FieldName) {
			var data = this.getModel('EditedTask').getData();
			return data[FieldName];
		},
		longtextButtons: function (sValue) {
			if (sValue == 'X') {
				return "sap-icon://notification-2";
			} else {
				return "sap-icon://write-new-document";
			}
		},
		getItems: function (sValue) {
			if (sap.ui.Device.system.phone === true) {
				return "{path:'TimeData>/', sorter: { path: 'TimeEntryDataFields/WORKDATE', descending:false, group: true  }, groupHeaderFactory:'.getGroupHeader'}";
			} else {
				return "{path:'TimeData>/', sorter: { path: 'TimeEntryDataFields/WORKDATE', descending:false, group: false  }, groupHeaderFactory:'.getGroupHeader'}";
			}
		},
		activeTasks: function (status, valStart, valEnd, fields) {
			if ((status === "1") && (fields.WORKDATE >= valStart) && (fields.WORKDATE <= valEnd)) {
				//Active Assignment
				return true;
			} else if ((status === "1") && (valStart == undefined) && (valEnd == undefined)) {
				//Assignment Group
				return true;
			} else {
				//Inactive Assignment
				return false;
			}
		},
		dayOfWeek: function (sValue) {
			switch (sValue) {
			case "SUNDAY":
				return 0;
			case "MONDAY":
				return 1;
			case "TUESDAY":
				return 2;
			case "WEDNESDAY":
				return 3;
			case "THURSDAY":
				return 4;
			case "FRIDAY":
				return 5;
			case "SATURDAY":
				return 6;
			default:
				return 0;
			}
		},
		formatTime: function (oTime) {
			var timeParser = sap.ui.core.format.DateFormat.getTimeInstance({
				pattern: "HHmm"
			});
			var timeFormatter = sap.ui.core.format.DateFormat.getTimeInstance({
				style: "short"
			});
			if (oTime === "000000") {
				return "00:00";
			}
			oTime = timeParser.parse(oTime);
			oTime = timeFormatter.format(oTime);
			return oTime;
		},
		convertTime: function (oTime) {
			var timeFormat = sap.ui.core.format.DateFormat
				.getTimeInstance({
					pattern: "HHmmss"
				});
			return timeFormat.format(oTime);
		},
		concatTimeStrings: function (startTime, endTime) {
			var timeParser = sap.ui.core.format.DateFormat.getTimeInstance({
				pattern: "HHmm"
			});
			var timeFormatter = sap.ui.core.format.DateFormat.getTimeInstance({
				style: "short"
			});
			startTime = timeParser.parse(startTime);
			startTime = timeFormatter.format(startTime);
			endTime = timeParser.parse(endTime);
			endTime = timeFormatter.format(endTime);
			if (startTime === endTime) {
				return "00:00" + " - " + "00:00";
			} else {
				return startTime + " - " + endTime;
			}

		},
		assignmentState: function (state) {
			if (state === true) {
				return sap.ui.core.ValueState.Success;
			} else {
				return sap.ui.core.ValueState.Error;
			}
		},
		assignmentName: function (oAssignment, oAssignmentId, Counter, Status) {
			if (oAssignmentId !== "" && parseFloat(oAssignmentId).toFixed(2) !== parseFloat("0.0000000").toFixed(2)) {
				return oAssignment;
			} else if (((oAssignmentId === "" || parseFloat(oAssignmentId).toFixed(2) === parseFloat("0.0000000").toFixed(2)) && Counter !== "")) {
				return this.oBundle.getText('noAssignment');
			} else if (Status == '99') {
				return this.oBundle.getText('hrRecord');
			}
		},
		getUnitTexts: function (key, hours) {
			if (this.getModel("UNIT")) {
				var data = this.getModel("UNIT").getData();
				var text;
				this.oBundle = this.getModel("i18n").getResourceBundle();
				if (key !== "" && key !== "H") {
					var obj = $.grep(data, function (element, index) {
						return element.DispField1Id === key;
					});
					if (obj.length > 0) {
						text = obj[0].DispField1Val;

					}
				} else {
					if (key === "H" && parseInt(hours) > 1) {
						text = this.oBundle.getText("hours");
					} else if (parseInt(hours) == 1) {
						text = this.oBundle.getText("hour");
					} else {
						text = this.oBundle.getText("hours");
					}
				}

				return text;
			}

		},
		formatText: function () {

		},
		assignmentstatus: function (status) {
			return status === true ? this.oBundle.getText('activeStatus') : this.oBundle.getText('inactiveStatus');
		},
		typeKind: function (oType) {
			switch (oType) {
			case "C":
				return sap.m.InputType.Text;
			case "N":
				return sap.m.InputType.Number;
			default:
				return sap.m.InputType.Text;
			}

		},
		fieldLength: function (oLength, oType) {
			if (oLength !== undefined && oLength !== null) {
				switch (oType) {
				case "C":
					return parseInt(oLength);
				case "N":
					return parseInt(oLength);
				case "D":
					return parseInt(oLength);
				default:
					return parseInt(oLength);
				}

			} else {
				return 0;
			}
		},
		getTexts: function (oFieldName, oFieldValue, oFieldValueText) {
			var oModel = this.getModel(oFieldName);
			var data;
			var text;
			if (oFieldName == 'RPROJ') {
				if (oModel) {
					data = oModel.getData();
					if (data) {
						text = $.grep(data, function (element, index) {
							return element.DispField1Id === oFieldValue;
						});
						if (text.length > 0) {
							return text[0].DispField1Val;
						} else {
							if (!oFieldValueText) {
								return oFieldValue;
							} else {
								return oFieldValueText;
							}
						}
					} else {
						if (!oFieldValueText) {
							return oFieldValue;
						} else {
							return oFieldValueText;
						}
					}
				} else {
					if (!oFieldValueText) {
						return oFieldValue;
					} else {
						return oFieldValueText;
					}
				}
			} else {
				if (oModel) {
					data = oModel.getData();
					if (data) {
						text = $.grep(data, function (element, index) {
							return element.DispField1Id === oFieldValue;
						});
						if (text.length > 0) {
							if (oFieldName === "APPROVER") {
								return text[0].DispField2Val;
							} else {
								return text[0].DispField1Val;
							}

						} else {
							return oFieldValue;
						}
					} else {
						return oFieldValue;
					}
				} else {
					return oFieldValue;
				}
			}

		},
		isSelected: function (status) {
			var a = status;
			return status;
		},
		calHoursQuanAmount: function (catsHours, catsQuantity, catsAmount) {
			var numberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
				maxFractionDigits: 2
			});
			var numberFormatQuan = sap.ui.core.format.NumberFormat.getFloatInstance({
				maxFractionDigits: 3
			});
			if (parseFloat(catsHours).toFixed(2) === parseFloat("0.00").toFixed(2) && parseFloat(catsQuantity).toFixed(2) === parseFloat("0.00").toFixed(
					2) && parseFloat(catsAmount).toFixed(2) === parseFloat("0.00").toFixed(2)) {
				return numberFormat.format(catsHours);
			} else if (parseFloat(catsHours).toFixed(2) !== parseFloat("0.00").toFixed(2) && parseFloat(catsQuantity).toFixed(2) === parseFloat(
					"0.00").toFixed(
					2) && parseFloat(catsAmount).toFixed(2) === parseFloat("0.00").toFixed(2)) {
				return numberFormat.format(catsHours);
			} else if (parseFloat(catsHours).toFixed(2) === parseFloat("0.00").toFixed(2) && parseFloat(catsQuantity).toFixed(2) !== parseFloat(
					"0.00").toFixed(
					2) && parseFloat(catsAmount).toFixed(2) === parseFloat("0.00").toFixed(2)) {
				return numberFormatQuan.format(catsQuantity);
			} else if (parseFloat(catsHours).toFixed(2) === parseFloat("0.00").toFixed(2) && parseFloat(catsQuantity).toFixed(2) === parseFloat(
					"0.00").toFixed(
					2) && parseFloat(catsAmount).toFixed(2) === parseFloat("0.00").toFixed(2)) {
				return numberFormat.format(catsAmount);
			} else if (parseFloat(catsHours).toFixed(2) !== parseFloat("0.00").toFixed(2) && parseFloat(catsQuantity).toFixed(2) !== parseFloat(
					"0.00").toFixed(
					2) && parseFloat(catsAmount).toFixed(2) === parseFloat("0.00").toFixed(2)) {
				return numberFormat.format(catsHours);
			} else if (parseFloat(catsHours).toFixed(2) === parseFloat("0.00").toFixed(2) && parseFloat(catsQuantity).toFixed(2) !== parseFloat(
					"0.00").toFixed(
					2) && parseFloat(catsAmount).toFixed(2) !== parseFloat("0.00").toFixed(2)) {
				return numberFormat.format(catsAmount);
			} else if (parseFloat(catsHours).toFixed(2) !== parseFloat("0.00").toFixed(2) && parseFloat(catsQuantity).toFixed(2) === parseFloat(
					"0.00").toFixed(
					2) && parseFloat(catsAmount).toFixed(2) !== parseFloat("0.00").toFixed(2)) {
				return numberFormat.format(catsHours);
			} else {
				return numberFormat.format(catsHours);
			}

		},
		calHoursQuanAmountInput: function (catsHours, catsQuantity, catsAmount) {
			// var numberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
			// 	maxFractionDigits: 2
			// });
			// var numberFormatQuan = sap.ui.core.format.NumberFormat.getFloatInstance({
			// 	maxFractionDigits: 3
			// });
			var catsHours = parseFloat(catsHours).toFixed(2);
			var catsAmount = parseFloat(catsAmount).toFixed(2);
			var catsQuantity = parseFloat(catsQuantity).toFixed(2);
			var zero = parseFloat("0.00").toFixed(2);
			if (catsHours === zero && catsQuantity === parseFloat("0.00").toFixed(
					2) && parseFloat(catsAmount).toFixed(2) === zero) {
				return catsHours;
			} else if (parseFloat(catsHours).toFixed(2) !== zero && parseFloat(catsQuantity).toFixed(2) === zero &&
				parseFloat(catsAmount).toFixed(2) === zero) {
				return catsHours;
			} else if (parseFloat(catsHours).toFixed(2) === zero && parseFloat(catsQuantity).toFixed(2) !== zero &&
				parseFloat(catsAmount).toFixed(2) === zero) {
				return catsQuantity;
			} else if (parseFloat(catsHours).toFixed(2) === zero && parseFloat(catsQuantity).toFixed(2) === zero &&
				parseFloat(catsAmount).toFixed(2) === zero) {
				return catsAmount;
			} else if (parseFloat(catsHours).toFixed(2) !== zero && parseFloat(catsQuantity).toFixed(2) !== zero &&
				parseFloat(catsAmount).toFixed(2) === zero) {
				return catsHours;
			} else if (parseFloat(catsHours).toFixed(2) === zero && parseFloat(catsQuantity).toFixed(2) !== zero &&
				parseFloat(catsAmount).toFixed(2) !== zero) {
				return catsAmount;
			} else if (parseFloat(catsHours).toFixed(2) !== zero && parseFloat(catsQuantity).toFixed(2) === zero &&
				parseFloat(catsAmount).toFixed(2) !== zero) {
				return catsHours;
			} else {
				return catsHours;
			}

		},
		commentDisplay: function (longtext, rejReason) {
			var dispText;
			this.oBundle = this.getModel("i18n").getResourceBundle();
			if (longtext) {
				dispText = longtext;
			}
			if (rejReason) {
				if (dispText !== undefined) {
					dispText = dispText + "\n\n" + this.oBundle.getText("rejReason") + ":\n" + rejReason;
				} else {
					dispText = this.oBundle.getText("rejReason") + ":\n" + rejReason;
				}
			}
			return dispText;
		},
		checkHrRecord: function (status, hoursDisabled) {
			if (status == '99') {
				return false;
			} else {
				if (hoursDisabled) {
					return false;
				} else {
					return true;
				}

			}
		},
		projectsVisible: function (cpr_guid, cpr_objguid) {
			if (cpr_guid === "" && cpr_objguid === "") {
				return false;
			} else {
				return true;
			}

		},
		isDate: function (value, type) {
			if (type === 'D') {
				return value;
			} else {
				return null;
			}
		},

		getUTCDate: function (date) {
			return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

		},
		
		EOTP_OUTPUT: function(eOtp, Description){
			debugger;
			var output = "";
			if(eOtp !== "" && Description !== ""){
				return eOtp + " - " + Description;
			}
			return eOtp;
		},
		catsstatus_output: function (sValue) {
			if (sValue == '10') {
				return sap.ui.core.ValueState.None;
			} else if (sValue == '20') {
				return sap.ui.core.ValueState.Information
			} else if (sValue == '30') {
				return sap.ui.core.ValueState.Success;
			} else if (sValue == '40') {
				return sap.ui.core.ValueState.Error
			} else if (sValue == '100') {
				return sap.ui.core.ValueState.None;
			} else if (sValue == '99') {
				return sap.ui.core.ValueState.Error;
			}
			return sap.ui.core.ValueState.None;
		},
		parseInt: function(oValue){
			//oValue = (oValue === null)?"0":oValue;
			oValue = (oValue === null || oValue === undefined)?"0":oValue.toString();
			return parseInt(oValue.replace(".", ','));
		},
		isWBSEditableByCat: function(oAwart){ // Boolean
			var that = this;
			var EotpObligatoire = that.getModel("VH").getProperty("/ZV_CAT_PRES_VH('"+oAwart+"')/EotpObligatoire");
			//TODO : Model needs to be preloaded before this is executed
			if(EotpObligatoire === undefined || EotpObligatoire === 'X' || oAwart === "" || oAwart === undefined || oAwart === null){
				return true;
			}
			return false;
		},
		isRowDeletable: function(oStatus){
			var that = this;
			
			oStatus = (oStatus === null)?10 : parseInt(oStatus);
			if (oStatus == 10) {
				return true;
			} else if (oStatus == 20) {
				return  true;
			} else if (oStatus == 30) {
				return false;
			} else if (oStatus == 40) {
				return true;
			}
		},
		statusHighlight: function(oStatus){
			oStatus = (oStatus === null)?10 : parseInt(oStatus);
			if (oStatus == 10) {
				return "None"
			} else if (oStatus == 20) {
				return  sap.ui.core.MessageType.Information;
			} else if (oStatus == 30) {
				return sap.ui.core.MessageType.Success;
			} else if (oStatus == 40) {
				return sap.ui.core.MessageType.Error;
			}
		},
		awartValueState: function(oAllowEdit, oAwart){
			var presenceModifiable = this.getModel("VH").getProperty("/ZV_CAT_PRES_VH('" + oAwart + "')/Modifiable");
			//var presenceEotpObligatoire = this.getModel("VH").getProperty("/ZV_CAT_PRES_VH('" + oAwart + "')/EotpObligatoire");
			if(oAllowEdit == true &&  presenceModifiable === ''){
				return sap.ui.core.ValueState.Error;
			}else{
				return sap.ui.core.ValueState.None;
			}
		},
		rprojVaueState: function(oAwart, oRproj){
			//var presenceModifiable = this.getModel("VH").getProperty("/ZV_CAT_PRES_VH('" + oAwart + "')/Modifiable");
			var presenceEotpObligatoire = this.getModel("VH").getProperty("/ZV_CAT_PRES_VH('" + oAwart + "')/EotpObligatoire");
			if( presenceEotpObligatoire === 'X' && oRproj === ""){
				return sap.ui.core.ValueState.Error;
			}
		},
		boolean: function(oValue){
			if(oValue === 'X'){
				return true;
			}
			return false;
		},
		removeCheck: function(oAllowEdit, oStatus){
			return oAllowEdit || parseInt(oStatus) === 40;
		}
		
	};

});