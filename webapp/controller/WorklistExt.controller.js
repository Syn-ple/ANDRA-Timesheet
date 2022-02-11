/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"hcm/fab/mytimesheet/controller/Worklist.controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/ui/core/format/DateFormat",
	//"hcm/fab/mytimesheet/model/formatter",
	'hcm/fab/mytimesheet/HCMFAB_MY_TIMEExtension/model/formatter',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	'sap/m/MessagePopover',
	'sap/m/MessagePopoverItem',
	'sap/m/TablePersoController',
	'sap/m/GroupHeaderListItem',
	'sap/ui/core/Fragment',
	'sap/m/Dialog',
	'sap/m/Text',
	'hcm/fab/mytimesheet/HCMFAB_MY_TIMEExtension/lib/lodash',
	'hcm/fab/mytimesheet/HCMFAB_MY_TIMEExtension/lib/DateWeek',
	'hcm/fab/mytimesheet/HCMFAB_MY_TIMEExtension/lib/date',
	'hcm/fab/mytimesheet/HCMFAB_MY_TIMEExtension/service/TimesheetService'
], function (WorklistController, JSONModel, History, DateFormat, formatter, Filter, FilterOperator, MessageBox, MessagePopover, MessagePopoverItem,
	TablePersoController, GroupHeaderListItem, Fragment, Dialog, Text, Lodash, DateWeek,Datejs, TimesheetService) {
	"use strict";
//	/**
//	 * Sets the error state of controls that use a data type.
//	 * 
//	 * @param {object} oEvent
//	 *   the event raised by UI5 when validation occurs.    
//	 */
//	function controlErrorHandler(oEvent) {
//		var oControl = oEvent.getParameter("element");
//		var sErrorMessage = oEvent.getParameter("message");
//
//		if (oControl && oControl.setValueStateText && sErrorMessage) {
//			oControl.setValueStateText(sErrorMessage);
//		}
//		if (oControl && oControl.setValueState) {
//			oControl.setValueState("Error");
//		}
//	}
//	/**
//	 * Sets the normal state of controls that passed a validation.
//	 *
//	 * @param {object} oEvent
//	 *   the event raised by UI5 when validation occurs.
//	 */
//	function controlNoErrorHandler(oEvent) {
//		var oControl = oEvent.getParameter("element");
//		if (oControl && oControl.setValueState) {
//			oControl.setValueState("None");
//		}
//	}

	var WorklistExt = WorklistController.extend("hcm.fab.mytimesheet.HCMFAB_MY_TIMEExtension.controller.WorklistExt", {
		lodash : Lodash,
		formatter: formatter,
		timesheetService: TimesheetService,
		extHookChangeObjectBeforeSubmit: null,
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {
			WorklistController.prototype.onInit.apply(this,arguments);
			var that = this;
			var timeData = {
				'TimeEntries':[]
			};
			var modelData = {
				'ZV_CAT_PRES_VH':[
					{	CategoriePresence:'PRES', Description:'Présence', Modifiable: 'X', EotpObligatoire : 'X' }
/*					{	CategoriePresence:'1000', Description:'Formation HTT', Modifiable: 'X' , EotpObligatoire : ''},
					{	CategoriePresence:'1001', Description:'Temps partiel', Modifiable: 'X' , EotpObligatoire : ''},
					{	CategoriePresence:'1002', Description:'Grêves', Modifiable: 'X' , EotpObligatoire: ''},
					{	CategoriePresence:'1003', Description:'CET', Modifiable: 'X' , EotpObligatoire: ''},
					{	CategoriePresence:'1004', Description:'Autres absences', Modifiable: 'X' , EotpObligatoire: ''},
					{	CategoriePresence:'ABS', Description:'Congés statutaires', Modifiable: '' , EotpObligatoire: ''},
					{	CategoriePresence:'AUT', Description:'Autres absences', Modifiable : '' , EotpObligatoire :  ''},
					{	CategoriePresence:'CSS', Description:'Congé sans solde', Modifiable : '' , EotpObligatoire : ''},
					{	CategoriePresence:'MAL', Description:'Maladie', Modifiable : '' , EotpObligatoire : ''}*/
				],
				'ZC_WBSElementVH':[
					{	WBSElement:'TEST', WBSDescription:'Test eOTP'},
					{	WBSElement:'TU-A', WBSDescription:'Test Agence'}
				],
				'WeekNumber': 0,
				'CatsStatus_text': "Status",
				'CatsStatus': 99,
				'TimeEntries':[]
			};
		  	const oVHModel = this.getOwnerComponent().getModel("VH");
		  	oVHModel.metadataLoaded().then(this.onMetadataLoaded.bind(this, oVHModel));
			this.timesheetService.setModel(oVHModel);
			this.selectedAwart = null;
			var oJsonmodel = new sap.ui.model.json.JSONModel(modelData);
			oJsonmodel.attachPropertyChange(this.onJsonModelChanged.bind(this));
			this.getView().setModel(oJsonmodel,"json");
			this.oTimeTable = this.getView().byId("timeTable");
			this.oTimeTable.setModel(oVHModel);
			
			var oTimeModel = new sap.ui.model.json.JSONModel(timeData);
			this.setModel(oTimeModel, "time");
			this.timeData = this.getModel("time").getData();
			oTimeModel.attachPropertyChange(this.onTimeDataChanged.bind(this));
			
			var oTotalModel = new sap.ui.model.json.JSONModel(
			{
					Day1:0,
					Day2:0,
					Day3:0,
					Day4:0,
					Day5:0,
					Day6:0,
					Day7:0,
					Holiday1:"",
					Holiday2:"",
					Holiday3:"",
					Holiday4:"",
					Holiday5:"",
					Holiday6:"",
					Holiday7:"",
			});
			this.setModel(oTotalModel, "totals");
			this.totals = this.getModel("totals").getData();
			
			this.zCreateMessagePopover();
		},
		onTimeDataChanged: function(oEvent){
			debuggger;
			this.totals.Day1 = 6;
		},
		onJsonModelChanged: function(oEvent){
			//debugger;
		},
		onMetadataLoaded: function(oVHModel) {
			var that = this;
			oVHModel.read("/ZV_CAT_PRES_VH",{
				success: function(oData){
					//console.log("/ZV_CAT_PRES_VH", oData)
					that.getModel("json").setProperty("/ZV_CAT_PRES_VH", oData.results);
				},
				error: function(oError){
					console.error("/ZV_CAT_PRES_VH", oError);
				}
			});
			oVHModel.read("/ZC_WBSElementVH?$orderby=Favoris desc",{
				success: function(oData){
					//console.log("/ZC_WBSElementVH", oData)
					that.getModel("json").setProperty("/ZC_WBSElementVH", oData.results);
				},
				error: function(oError){
					console.error("/ZC_WBSElementVH", oError);
				}
			});
		},
		getResourceBundle : function(){
			this.oBundle = this.getView().getModel("i18n") === undefined ?null:this.getView().getModel("i18n").getResourceBundle();
			if(this.oBundle === null){	
		         var i18nModel = new sap.ui.model.resource.ResourceModel({
		            bundleName: "hcm.fab.mytimesheet.HCMFAB_MY_TIMEExtension.i18n.i18n"
		         });
		         this.getView().setModel(i18nModel, "i18n");
				 this.oBundle = i18nModel.getResourceBundle();
			}
			return this.oBundle;
		},
		catsstatus: function (sValue) {
			this.oBundle = this.getResourceBundle();
			if (sValue == '10') {
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
		onCheckboxSelection: function (oEvent) {
//			var that = this;
//			var index = oEvent.getParameter('selectedItem').getBindingContext('TimeData').getPath().split("/")[1];
//			this.getModel('TimeData').getData()[index].SetDraft = true;
//			this.getModel('controls').setProperty('isOverviewChanged', true);
			WorklistController.prototype.onCheckboxSelection.apply(this,arguments);
		},

		getTimeEntries: function (dateFrom, dateTo) {
			if(dateFrom.is().sunday()){
				dateFrom = dateFrom.next().monday();
			}
			WorklistController.prototype.getTimeEntries.apply(this,arguments);
			// YBO - ADD - Bind Week number
			this._updateWeekNumber();
			// YBO - END - Bind Week number
		},
		initPersonalization: function () {
			WorklistController.prototype.initPersonalization.apply(this,arguments);
		},
		onPersButtonPressed: function (oEvent) {
//			this.oTablePersoController.openDialog();
			WorklistController.prototype.onPersButtonPressed.apply(this,arguments);
		},
		onPersTodoButtonPressed: function (oEvent) {
//			this.oTableTodoPersoController.openDialog();
			WorklistController.prototype.onPersTodoButtonPressed.apply(this,arguments);
		},
		onPersTaskButtonPressed: function (oEvent) {
//			this.oTableTaskPersoController.openDialog();
			WorklistController.prototype.onPersTaskButtonPressed.apply(this,arguments);
		},
		getTasks: function (initLoad, startDate, endDate) {
			WorklistController.prototype.getTasks.apply(this,arguments);
		},
		getToDoList: function () {
			WorklistController.prototype.getToDoList.apply(this,arguments);
		},
		onToDoDataChanged: function () {
//			var that = this;
//			var oControls = this.getModel("controls");
//			oControls.setProperty('todoDataChanged', true);
			WorklistController.prototype.onToDoDataChanged.apply(this,arguments);
		},
		getProfileFields: function (empId) {
			WorklistController.prototype.getProfileFields.apply(this,arguments);
		},
		longtextPopover: function (oEvent) {
			WorklistController.prototype.longtextPopover.apply(this,arguments);
		},

		onTextEdit: function (oEvent) {
//			if (oEvent.getSource().getParent().getParent().getAggregation('items')[0].getText()) {
//				this.byId('feedInput').setValue(oEvent.getSource().getParent().getParent().getAggregation('items')[0].getText());
//				this.byId('feedInput').setEnabled(true);
//			}
			WorklistController.prototype.onTextEdit.apply(this,arguments);
		},
		onTextDelete: function (oEvent) {
			if (oEvent.getSource().getParent().getParent().getAggregation('items')[0].getText()) {
				var index = oEvent.getSource().getParent().getParent().getBindingContext('TimeData').getPath().split('/')[1];
				oEvent.getSource().getParent().getParent().getAggregation('items')[0].setText("");
				var okButton = oEvent.getSource().getParent().getParent().getParent().getAggregation('beginButton');
				var data = this.getModel('TimeData').getData();
				// data[index].TimeEntryDataFields.LTXA1 = oEvent.getParameter('value');
				data[index].TimeEntryDataFields.LONGTEXT_DATA = "";
				data[index].TimeEntryDataFields.LONGTEXT = '';
				if (data[index].Counter !== "") {
					data[index].TimeEntryOperation = 'U';
				} else {
					data[index].TimeEntryOperation = 'C';
				}
				var oModel = new JSONModel(data);
				this.setModel(oModel, "TimeData");
				okButton.setEnabled(true);
			}
		},
		onTextDeleteTodo: function (oEvent) {
			if (oEvent.getSource().getParent().getParent().getAggregation('items')[0].getText()) {
				var index = oEvent.getSource().getParent().getParent().getBindingContext('TodoList').getPath().split('/')[1];
				oEvent.getSource().getParent().getParent().getAggregation('items')[0].setText("");
				var okButton = oEvent.getSource().getParent().getParent().getParent().getAggregation('beginButton');
				var data = this.getModel('TodoList').getData();
				data[index].TimeEntryDataFields.LONGTEXT_DATA = "";
				data[index].TimeEntryDataFields.LONGTEXT = '';
				if (data[index].Counter !== "") {
					data[index].TimeEntryOperation = 'U';
				} else {
					data[index].TimeEntryOperation = 'C';
				}
				var oModel = new JSONModel(data);
				this.setModel(oModel, "TodoList");
				okButton.setEnabled(true);
			}
		},
		getGroupHeader: function (oGroup, count) {
			oGroup.key = this.oFormatDate.format(new Date(oGroup.date));
			return new GroupHeaderListItem({
				title: oGroup.key,
				upperCase: false
			});
		},
		onStatusChange: function (oEvent) {
			var selectedKey = oEvent.getParameter('selectedItem').getKey();
			var oFilter = [];
			var oControl = this.getModel("controls");
			if (selectedKey !== '100') {
				oFilter.push(new Filter("Status", FilterOperator.Contains, selectedKey));
			}

			var oRef = this.oTable.getBinding('items').filter(oFilter);
			if (oRef.getLength() === 0) {
				oControl.setProperty('/overviewEditEnabled', false);
			} else {
				if (oControl.getProperty('/onEdit') === "None") {
					oControl.setProperty('/overviewEditEnabled', true);
				}
			}
		},
		handleDupTaskCalendarSelect: function (oEvent) {
			var oCalendar = oEvent.getSource();
			var aSelectedDates = oCalendar.getSelectedDates();
			var oDate;
			var oData = {
				selectedDates: []
			};
			var oModel = new JSONModel();
			if (aSelectedDates.length > 0) {
				for (var i = 0; i < aSelectedDates.length; i++) {
					oDate = aSelectedDates[i].getStartDate();
					oData.selectedDates.push({
						Date: oDate
					});
				}
				oModel.setData(oData);
				this.setModel(oModel, 'selectedDatesDup').updateBindings();
			} else {
				oModel.setData([]);
				this.setModel(oModel, 'selectedDatesDup').updateBindings();
			}
			if (this.getModel("TimeDataDuplicateTask").getData().length >= 1 &&
				this.getModel("selectedDatesDup").getData().selectedDates.length >= 1) {
				this.getModel("controls").setProperty("/duplicateTaskButtonEnable", true);
			}
		},
		EditTodoLongTextPopover: function (oEvent) {
			// create popover
			var that = this;
			var oDialogController = {
				handleClose: function (event) {
					that.dialog.close();
					that.dialog.destroy();
				},
				onLongTextEdit: this.onTextEdit.bind(this),
				onLongTextDelete: this.onTextDeleteTodo.bind(this),
				onPost: this.onTodoLongTextPost.bind(this),
				formatter: this.formatter.visibility.bind(this),
				handleOk: function (oEvent) {
					that.getModel("controls").setProperty("/isToDoChanged", true);
					that.getModel("controls").setProperty("/todoDataChanged", true);
					that.dialog.close();
					that.dialog.destroy();
				}.bind(this)
			};
			var data = $.extend(true, [], this.getModel('TodoList').getData());
			var oModel = new JSONModel(data);
			this.setModel(oModel, "oldModel");
			// if (!this.dialog) {
			this.dialog = sap.ui.xmlfragment(this.getView().getId(), "hcm.fab.mytimesheet.view.fragments.EditToDoLongTextPopOver",
				oDialogController);
			this.getView().addDependent(this.dialog);
			this.dialog.bindElement('TodoList>' + oEvent.getSource().getBindingContext('TodoList').getPath());
			var index = oEvent.getSource().getBindingContext('TodoList').getPath().split('/')[1];
			var selectModel = new JSONModel(data);
			this.setModel(selectModel, "TimeEntry");
			// var data = $.extend(true, [], this.getModel('TimeData').getData());
			// var oModel = new JSONModel(data);
			// this.setModel(oModel, "oldModel");
			var oControl = this.getModel('controls');
			if (this.formatter.visibility(data[index].TimeEntryDataFields.LONGTEXT)) {
				// var oControl = this.getModel('controls');
				oControl.setProperty('editLongTextEnabled', false);
				oControl.setProperty('feedListVisibility', true);
			}
			this.setModel(oControl, "controls");
			var oButton = oEvent.getSource();
			jQuery.sap.delayedCall(0, this, function () {
				this.dialog.open(oButton);
			});
		},
		displaylongtextPopover: function (oEvent) {
			// create popover
			var that = this;
			var oDialogController = {
				handleClose: function (event) {
					that._oPopover.close();
				},
				commentDisplay: this.formatter.commentDisplay.bind(this)
			};
			this._oPopover = sap.ui.xmlfragment(this.getView().getId(), "hcm.fab.mytimesheet.view.fragments.LongTextPopOver",
				oDialogController);
			this.getView().addDependent(this._oPopover);
			this._oPopover.bindElement('TimeData>' + oEvent.getSource().getBindingContext('TimeData').getPath());

			// delay because addDependent will do a async rerendering and the popover will immediately close without it
			var oButton = oEvent.getSource();
			jQuery.sap.delayedCall(0, this, function () {
				this._oPopover.openBy(oButton);
			});
		},

		displayTodoLongtextPopover: function (oEvent) {
			// create popover
			var that = this;
			// if (this._oPopover) {
			// 	this._oPopover.close();
			// }
			var oDialogController = {
				handleClose: function (event) {
					that._oPopover.close();
				},
				onChange: this.onLongTextChange.bind(this)
			};
			this._oPopover = sap.ui.xmlfragment(this.getView().getId(), "hcm.fab.mytimesheet.view.fragments.LongTextPopOver",
				oDialogController);
			this.getView().addDependent(this._oPopover);

			// delay because addDependent will do a async rerendering and the popover will immediately close without it
			var oButton = oEvent.getSource();
			jQuery.sap.delayedCall(0, this, function () {
				this._oPopover.openBy(oButton);
			});
		},

		dynamicBindingRows: function (index, context) {
			var that = this;
			var obj = context.getObject();
			if (this.getModel('Tasks').getData()) {

			} else {
				return;
			}
			var data = this.getModel('Tasks').getData();
			var index = context.getPath().split('/')[1];
			var row = new sap.m.ColumnListItem({
				type: "Navigation",
				press: this.onAssignmentPress.bind(this)
			});
			for (var k in obj) {
				if (k === "AssignmentStatus") {
					row.addCell(
						new sap.m.ObjectStatus({
							text: obj[k] === true ? this.oBundle.getText('activeStatus') : this.oBundle.getText('inactiveStatus'),
							state: obj[k] === true ? sap.ui.core.ValueState.Success : sap.ui.core.ValueState.Error,
							customData: [new sap.ui.core.CustomData({
									"key": "FieldName",
									"value": k
								}), new sap.ui.core.CustomData({
									"key": "AssignmentId",
									"value": data[index].AssignmentId
								}),
								new sap.ui.core.CustomData({
									"key": "FieldValue",
									"value": obj[k]
								})

							]
						})
					);
				} else if (k === "ValidityStartDate" || k === "ValidityEndDate") {
					row.addCell(new sap.m.Text({
						text: this.oFormatYyyymmdd.format(new Date(obj[k])),
						customData: [new sap.ui.core.CustomData({
							"key": "FieldName",
							"value": k
						}), new sap.ui.core.CustomData({
							"key": "AssignmentId",
							"value": data[index].AssignmentId
						})]
					}));
				} else if (k === "RPROJ") { //Note
					var oModel = this.getModel(k);
					if (oModel) {
						var text = oModel.getData();
						if (text) {
							var textFound = $.grep(text, function (element, index) {
								return element.DispField1Id === obj[k];
							});
							if (textFound.length > 0) {
								if (obj[k] !== "") {
									row.addCell(new sap.m.Text({
										text: textFound[0].DispField1Val,
										customData: [new sap.ui.core.CustomData({
											"key": "FieldName",
											"value": k
										}), new sap.ui.core.CustomData({
											"key": "AssignmentId",
											"value": data[index].AssignmentId
										})]
									}));
								} else {
									row.addCell(new sap.m.Text({
										text: data[index].AssignmentFields.POSID,
										customData: [new sap.ui.core.CustomData({
											"key": "FieldName",
											"value": k
										}), new sap.ui.core.CustomData({
											"key": "AssignmentId",
											"value": data[index].AssignmentId
										})]
									}));
								}

							} else {
								if (obj[k] !== "") {
									this.renderFieldTexts.push({
										key: k,
										value: obj[k]
									});
									row.addCell(new sap.m.Text({
										text: data[index].AssignmentFields.POSID,
										customData: [new sap.ui.core.CustomData({
											"key": "FieldName",
											"value": k
										}), new sap.ui.core.CustomData({
											"key": "AssignmentId",
											"value": data[index].AssignmentId
										})]
									}));
								} else {
									row.addCell(new sap.m.Text({
										text: data[index].AssignmentFields.POSID,
										customData: [new sap.ui.core.CustomData({
											"key": "FieldName",
											"value": k
										}), new sap.ui.core.CustomData({
											"key": "AssignmentId",
											"value": data[index].AssignmentId
										})]
									}));
								}

							}
						} else {
							row.addCell(new sap.m.Text({
								text: data[index].AssignmentFields.POSID,
								customData: [new sap.ui.core.CustomData({
									"key": "FieldName",
									"value": k
								}), new sap.ui.core.CustomData({
									"key": "AssignmentId",
									"value": data[index].AssignmentId
								})]
							}));
						}
					} else {
						row.addCell(new sap.m.Text({
							text: data[index].AssignmentFields.POSID,
							customData: [new sap.ui.core.CustomData({
								"key": "FieldName",
								"value": k
							}), new sap.ui.core.CustomData({
								"key": "AssignmentId",
								"value": data[index].AssignmentId
							})]
						}));
					}

				} else if (k === "PEDD") {
					if (obj[k]) {
						row.addCell(new sap.m.Text({
							text: this.oFormatDate.format(obj[k]),
							customData: [new sap.ui.core.CustomData({
								"key": "FieldName",
								"value": k
							}), new sap.ui.core.CustomData({
								"key": "AssignmentId",
								"value": data[index].AssignmentId
							})]
						}));
					} else {
						row.addCell(new sap.m.Text({
							text: "",
							customData: [new sap.ui.core.CustomData({
								"key": "FieldName",
								"value": k
							}), new sap.ui.core.CustomData({
								"key": "AssignmentId",
								"value": data[index].AssignmentId
							})]
						}));
					}

				} else {
					var oModel = this.getModel(k);
					if (oModel) {
						var text = oModel.getData();
						if (text) {
							var textFound = $.grep(text, function (element, index) {
								return element.DispField1Id === obj[k];
							});
							if (textFound.length > 0) {
								row.addCell(new sap.m.Text({
									text: textFound[0].DispField1Val,
									customData: [new sap.ui.core.CustomData({
										"key": "FieldName",
										"value": k
									}), new sap.ui.core.CustomData({
										"key": "AssignmentId",
										"value": data[index].AssignmentId
									})]
								}));
							} else {
								if (obj[k] !== "") {
									this.renderFieldTexts.push({
										key: k,
										value: obj[k]
									});
									row.addCell(new sap.m.Text({
										text: obj[k],
										customData: [new sap.ui.core.CustomData({
											"key": "FieldName",
											"value": k
										}), new sap.ui.core.CustomData({
											"key": "AssignmentId",
											"value": data[index].AssignmentId
										})]
									}));
								} else {
									row.addCell(new sap.m.Text({
										text: obj[k],
										customData: [new sap.ui.core.CustomData({
											"key": "FieldName",
											"value": k
										}), new sap.ui.core.CustomData({
											"key": "AssignmentId",
											"value": data[index].AssignmentId
										})]
									}));
								}

							}
						} else {
							row.addCell(new sap.m.Text({
								text: obj[k],
								customData: [new sap.ui.core.CustomData({
									"key": "FieldName",
									"value": k
								}), new sap.ui.core.CustomData({
									"key": "AssignmentId",
									"value": data[index].AssignmentId
								})]
							}));
						}
					} else {
						row.addCell(new sap.m.Text({
							text: obj[k],
							customData: [new sap.ui.core.CustomData({
								"key": "FieldName",
								"value": k
							}), new sap.ui.core.CustomData({
								"key": "AssignmentId",
								"value": data[index].AssignmentId
							})]
						}));
					}
				}
			}
			// this.renderTexts();
			return row;
		},
		dynamicBindingRowsWorklist: function (index, context) {
			//Need to handle date range
			var obj = context.getObject();
			var data = this.getModel('Worklist').getData();
			var index = context.getPath().split('/')[1];
			var row = new sap.m.ColumnListItem({
				// type: "Navigation",
				// press: this.onAssignmentWorklistPress.bind(this)
			});
			for (var k in obj) {
				if (k === "RANGE") {
					if (data[index].WorkListDataFields.BEGDA === null && data[index].WorkListDataFields.ENDDA === null) {
						row.addCell(new sap.m.DateRangeSelection({
							dateValue: new Date(new Date().getFullYear(), 0, 1),
							secondDateValue: new Date(new Date().getFullYear(), 11, 31),
							maxLength: 30,
							customData: [new sap.ui.core.CustomData({
								"key": "FieldName",
								"value": "RANGE"
							}), new sap.ui.core.CustomData({
								"key": "Index",
								"value": index
							})]
						}));
					} else {
						row.addCell(new sap.m.DateRangeSelection({
							dateValue: new Date(data[index].WorkListDataFields.BEGDA),
							secondDateValue: new Date(data[index].WorkListDataFields.ENDDA),
							maxLength: 30,
							customData: [new sap.ui.core.CustomData({
								"key": "FieldName",
								"value": "RANGE"
							}), new sap.ui.core.CustomData({
								"key": "Index",
								"value": index
							})]
						}));
					}

				} else if (k === "NAME") {
					row.addCell(new sap.m.Input({
						type: sap.m.InputType.Text,
						value: obj[k],
						required: true,
						// liveChange: this.handleUserInput().bind(this),
						maxLength: 30,
						placeholder: this.getResourceBundle().getText("worklistNamePlaceholder"),
						customData: [new sap.ui.core.CustomData({
							"key": "FieldName",
							"value": "NAME"
						}), new sap.ui.core.CustomData({
							"key": "Index",
							"value": index
						})]
					}));
				} else if (k === "RPROJ") { //Note
					if (data[index].WorkListDataFields.POSID !== "") {
						row.addCell(new sap.m.Text({
							text: obj[k] + " (" + data[index].WorkListDataFields.POSID + ")",
							customData: [new sap.ui.core.CustomData({
								"key": "FieldName",
								"value": k
							}), new sap.ui.core.CustomData({
								"key": "Index",
								"value": index
							})]
						}));
					} else {
						row.addCell(new sap.m.Text({
							text: obj[k],
							customData: [new sap.ui.core.CustomData({
								"key": "FieldName",
								"value": k
							}), new sap.ui.core.CustomData({
								"key": "Index",
								"value": index
							})]
						}));
					}
				} else {
					row.addCell(new sap.m.Text({
						text: obj[k],
						customData: [new sap.ui.core.CustomData({
							"key": "FieldName",
							"value": k
						}), new sap.ui.core.CustomData({
							"key": "Index",
							"value": index
						})]
					}));
				}
			}

			return row;
		},
		dynamicBindingRowsAdminlist: function (index, context) {
			var obj = context.getObject();
			if (this.getModel('AdminTasks').getData()) {

			} else {
				return;
			}
			var data = this.getModel('AdminTasks').getData();
			var index = context.getPath().split('/')[1];
			var row = new sap.m.ColumnListItem({
				// type: "Navigation",
				// press: this.onAssignmentPress.bind(this)
			});
			for (var k in obj) {
				if (k === "AssignmentStatus") {
					row.addCell(
						new sap.m.ObjectStatus({
							text: obj[k] === true ? this.oBundle.getText('activeStatus') : this.oBundle.getText('inactiveStatus'),
							state: obj[k] === true ? sap.ui.core.ValueState.Success : sap.ui.core.ValueState.Error,
							customData: [new sap.ui.core.CustomData({
									"key": "FieldName",
									"value": k
								}), new sap.ui.core.CustomData({
									"key": "AssignmentId",
									"value": data[index].AssignmentId
								}),
								new sap.ui.core.CustomData({
									"key": "FieldValue",
									"value": obj[k]
								})

							]
						})
					);
				} else if (k === "ValidityStartDate" || k === "ValidityEndDate") {
					row.addCell(new sap.m.Text({
						text: this.oFormatYyyymmdd.format(new Date(obj[k])),
						customData: [new sap.ui.core.CustomData({
							"key": "FieldName",
							"value": k
						}), new sap.ui.core.CustomData({
							"key": "AssignmentId",
							"value": data[index].AssignmentId
						})]
					}));
				} else {
					var oModel = this.getModel(k);
					if (oModel) {
						var text = oModel.getData();
						if (text) {
							var textFound = $.grep(text, function (element, index) {
								return element.DispField1Id === obj[k];
							});
							if (textFound.length > 0) {
								row.addCell(new sap.m.Text({
									text: textFound[0].DispField1Val,
									customData: [new sap.ui.core.CustomData({
										"key": "FieldName",
										"value": k
									}), new sap.ui.core.CustomData({
										"key": "AssignmentId",
										"value": data[index].AssignmentId
									}), new sap.ui.core.CustomData({
										"key": "FieldCode",
										"value": obj[k]
									})]
								}));
							} else {
								row.addCell(new sap.m.Text({
									text: obj[k],
									customData: [new sap.ui.core.CustomData({
										"key": "FieldName",
										"value": k
									}), new sap.ui.core.CustomData({
										"key": "AssignmentId",
										"value": data[index].AssignmentId
									})]
								}));
							}
						} else {
							row.addCell(new sap.m.Text({
								text: obj[k],
								customData: [new sap.ui.core.CustomData({
									"key": "FieldName",
									"value": k
								}), new sap.ui.core.CustomData({
									"key": "AssignmentId",
									"value": data[index].AssignmentId
								})]
							}));
						}
					} else {
						row.addCell(new sap.m.Text({
							text: obj[k],
							customData: [new sap.ui.core.CustomData({
								"key": "FieldName",
								"value": k
							}), new sap.ui.core.CustomData({
								"key": "AssignmentId",
								"value": data[index].AssignmentId
							})]
						}));
					}
				}
			}

			return row;
		},
		dynamicBindingColumns: function (index, context) {
			var obj = context.getObject();
			var data = this.getModel('ProfileFields').getData();
			var index = context.getPath().split('/')[1];
			var column;
			if (sap.ui.Device.system.phone === true) {
				if (data[index].FieldName === "AssignmentStatus") {
					column = new sap.m.Column(data[index].FieldName, {
						// text: data[index].FieldName,
						demandPopin: true,
						hAlign: 'End',
					}).setHeader(new sap.m.Text({
						text: data[index].FieldLabel
					}));
				} else if (data[index].FieldName === "AssignmentName") {
					column = new sap.m.Column(data[index].FieldName, {
						// text: data[index].FieldName,
						demandPopin: true,
						hAlign: 'Begin',
					}).setHeader(new sap.m.Text({
						text: data[index].FieldLabel
					}));
				} else if (data[index].FieldName === "ValidityStartDate") {
					column = new sap.m.Column(data[index].FieldName, {
						// text: data[index].FieldName,
						demandPopin: true,
						hAlign: 'End',
						visible: false,
					}).setHeader(new sap.m.Text({
						text: data[index].FieldLabel
					}));
				} else if (data[index].FieldName === "ValidityEndDate") {
					column = new sap.m.Column(data[index].FieldName, {
						// text: data[index].FieldName,
						demandPopin: true,
						hAlign: 'End',
						visible: false,
					}).setHeader(new sap.m.Text({
						text: data[index].FieldLabel
					}));
				} else {
					column = new sap.m.Column(data[index].FieldName, {
						// text: data[index].FieldName,
						demandPopin: true,
						hAlign: 'Begin',
						visible: false,
					}).setHeader(new sap.m.Text({
						text: data[index].FieldLabel
					}));
				}

			} else {
				if (index > 5 && data[index].FieldName !== "AssignmentName" && data[index].FieldName !== "AssignmentStatus" && data[index].FieldName !==
					"APPROVER" && data[index].FieldName !== "ValidityStartDate" && data[index].FieldName !== "ValidityEndDate") {
					column = new sap.m.Column(data[index].FieldName, {
						// text: data[index].FieldName,
						minScreenWidth: "Desktop",
						demandPopin: true,
						// popinDisplay: "Inline"
					}).setHeader(new sap.m.Text({
						text: data[index].FieldLabel
					}));
				} else {
					if (data[index].FieldName == "ValidityStartDate" || data[index].FieldName == "ValidityEndDate") {
						column = new sap.m.Column(data[index].FieldName, {
							// text: data[index].FieldName,
							minScreenWidth: "Desktop",
							demandPopin: true,
							hAlign: 'End',
							// popinDisplay: "Inline"
						}).setHeader(new sap.m.Text({
							text: data[index].FieldLabel
						}));
					} else if (data[index].FieldName == "AssignmentStatus") {
						column = new sap.m.Column(data[index].FieldName, {
							hAlign: 'End',
							demandPopin: true,
						}).setHeader(new sap.m.Text({
							text: data[index].FieldLabel
						}));
					} else if (data[index].FieldName == "AssignmentName") {
						column = new sap.m.Column(data[index].FieldName, {
							hAlign: 'Begin',
							demandPopin: true,
						}).setHeader(new sap.m.Text({
							text: data[index].FieldLabel
						}));
					} else {
						column = new sap.m.Column(data[index].FieldName, {
							minScreenWidth: "Desktop",
							demandPopin: true,
						}).setHeader(new sap.m.Text({
							text: data[index].FieldLabel
						}));
					}

				}

			}

			return column;
		},
		dynamicBindingColumnsWorklist: function (index, context) {
			var obj = context.getObject();
			var data = this.getModel('WorklistProfileFields').getData();
			var index = context.getPath().split('/')[1];
			if (sap.ui.Device.system.phone === true) {
				var column = new sap.m.Column({
					minScreenWidth: "2800px",
					demandPopin: true
				}).setHeader(new sap.m.Text({
					text: data[index].FieldLabel
				}));
				return column;
			} else {
				if (index > 5) {
					var column = new sap.m.Column({
						minScreenWidth: "2800px",
						demandPopin: true
					}).setHeader(new sap.m.Text({
						text: data[index].FieldLabel
					}));
				} else {
					var column = new sap.m.Column({
						minScreenWidth: "Tablet",
						demandPopin: true
					}).setHeader(new sap.m.Text({
						text: data[index].FieldLabel
					}));
				}

				return column;
			}

		},
		dynamicBindingColumnsAdminlist: function (index, context) {
			var obj = context.getObject();
			var data = this.getModel('ProfileFields').getData();
			var index = context.getPath().split('/')[1];
			var column;
			if (sap.ui.Device.system.phone === true) {
				if (data[index].FieldName === "AssignmentStatus") {
					column = new sap.m.Column("Admin" + data[index].FieldName, {
						demandPopin: true,
						hAlign: 'End'
					}).setHeader(new sap.m.Text({
						text: data[index].FieldLabel
					}));
				} else if (data[index].FieldName === "AssignmentName") {
					column = new sap.m.Column("Admin" + data[index].FieldName, {
						demandPopin: true,
						hAlign: 'Begin'
					}).setHeader(new sap.m.Text({
						text: data[index].FieldLabel
					}));
				} else if (data[index].FieldName === "ValidityStartDate") {
					column = new sap.m.Column("Admin" + data[index].FieldName, {
						demandPopin: true,
						hAlign: 'End',
					}).setHeader(new sap.m.Text({
						text: data[index].FieldLabel
					}));
				} else if (data[index].FieldName === "ValidityEndDate") {
					column = new sap.m.Column("Admin" + data[index].FieldName, {
						demandPopin: true,
						hAlign: 'End',
					}).setHeader(new sap.m.Text({
						text: data[index].FieldLabel
					}));
				} else {
					column = new sap.m.Column("Admin" + data[index].FieldName, {
						minScreenWidth: sap.m.ScreenSize.Small,
						demandPopin: true,
						hAlign: 'Begin',
					}).setHeader(new sap.m.Text({
						text: data[index].FieldLabel
					}));
				}

			} else {
				if (index > 5 && data[index].FieldName !== "AssignmentName" && data[index].FieldName !== "AssignmentStatus" && data[index].FieldName !==
					"APPROVER" && data[index].FieldName !== "ValidityStartDate" && data[index].FieldName !== "ValidityEndDate") {
					column = new sap.m.Column("Admin" + data[index].FieldName, {
						minScreenWidth: "2800px",
						demandPopin: true,
					}).setHeader(new sap.m.Text({
						text: data[index].FieldLabel
					}));
				} else {
					if (data[index].FieldName !== "ValidityStartDate" && data[index].FieldName !== "ValidityEndDate") {
						column = new sap.m.Column("Admin" + data[index].FieldName, {
							minScreenWidth: "Tablet",
							demandPopin: true,
						}).setHeader(new sap.m.Text({
							text: data[index].FieldLabel
						}));
					} else {
						column = new sap.m.Column("Admin" + data[index].FieldName, {
							minScreenWidth: "Tablet",
							demandPopin: true,
							hAlign: 'End',
						}).setHeader(new sap.m.Text({
							text: data[index].FieldLabel
						}));
					}

				}

			}

			return column;
		},
		performImportAssignments: function (selectedItems) {
			var that = this;
			that.oDataReturnCount = 0;
			this.showBusy();
			that.oDataImportAssignmentsModel = this.getOwnerComponent().getModel();
			that.oDataImportAssignmentsModel.resetChanges();
			that.oDataImportAssignmentsModel.setChangeBatchGroups({
				"*": {
					groupId: "ImportAssignments",
					changeSetId: "ImportAssignments",
					single: false
				}
			});
			that.oDataImportAssignmentsModel.setDeferredGroups(["ImportAssignments"]);
			that.oDataImportAssignmentsModel
				.refreshSecurityToken(
					function (oData) {
						if (selectedItems.length > 0) {
							for (var j = 0; j < selectedItems.length; j++) {
								var obj = {
									properties: {
										ApproverId: selectedItems[j].ApproverId,
										ApproverName: selectedItems[j].ApproverName,
										AssignmentId: selectedItems[j].AssignmentId,
										AssignmentName: selectedItems[j].AssignmentName,
										AssignmentOperation: selectedItems[j].AssignmentOperation,
										AssignmentStatus: selectedItems[j].AssignmentStatus,
										Counter: selectedItems[j].Counter,
										Pernr: selectedItems[j].Pernr,
										ProfileId: selectedItems[j].ProfileId,
										ValidityStartDate: selectedItems[j].ValidityStartDate,
										ValidityEndDate: selectedItems[j].ValidityEndDate,
										AssignmentFields: {
											AENAM: selectedItems[j].AssignmentFields.AENAM,
											ALLDF: selectedItems[j].AssignmentFields.ALLDF,
											APDAT: selectedItems[j].AssignmentFields.APDAT,
											APNAM: selectedItems[j].AssignmentFields.APNAM,
											ARBID: selectedItems[j].AssignmentFields.ARBID,
											ARBPL: selectedItems[j].AssignmentFields.ARBPL,
											AUERU: selectedItems[j].AssignmentFields.AUERU,
											AUFKZ: selectedItems[j].AssignmentFields.AUFKZ,
											AUTYP: selectedItems[j].AssignmentFields.AUTYP,
											AWART: selectedItems[j].AssignmentFields.AWART,
											BEGUZ: selectedItems[j].AssignmentFields.BEGUZ,
											BELNR: selectedItems[j].AssignmentFields.BELNR,
											BEMOT: selectedItems[j].AssignmentFields.BEMOT,
											BUDGET_PD: selectedItems[j].AssignmentFields.BUDGET_PD,
											BUKRS: selectedItems[j].AssignmentFields.BUKRS,
											BWGRL: selectedItems[j].AssignmentFields.BWGRL,
											CATSAMOUNT: selectedItems[j].AssignmentFields.CATSAMOUNT,
											CATSHOURS: selectedItems[j].AssignmentFields.CATSHOURS,
											CATSQUANTITY: selectedItems[j].AssignmentFields.CATSQUANTITY,
											CPR_EXTID: selectedItems[j].AssignmentFields.CPR_EXTID,
											CPR_GUID: selectedItems[j].AssignmentFields.CPR_GUID,
											CPR_OBJGEXTID: selectedItems[j].AssignmentFields.CPR_OBJGEXTID,
											CPR_OBJGUID: selectedItems[j].AssignmentFields.CPR_OBJGUID,
											CPR_OBJTYPE: selectedItems[j].AssignmentFields.CPR_OBJTYPE,
											ENDUZ: selectedItems[j].AssignmentFields.ENDUZ,
											ERNAM: selectedItems[j].AssignmentFields.ERNAM,
											ERSDA: selectedItems[j].AssignmentFields.ERSDA,
											ERSTM: selectedItems[j].AssignmentFields.ERSTM,
											ERUZU: selectedItems[j].AssignmentFields.ERUZU,
											EXTAPPLICATION: selectedItems[j].AssignmentFields.EXTAPPLICATION,
											EXTDOCUMENTNO: selectedItems[j].AssignmentFields.EXTDOCUMENTNO,
											EXTSYSTEM: selectedItems[j].AssignmentFields.EXTSYSTEM,
											FUNC_AREA: selectedItems[j].AssignmentFields.FUNC_AREA,
											FUND: selectedItems[j].AssignmentFields.FUND,
											GRANT_NBR: selectedItems[j].AssignmentFields.GRANT_NBR,
											HRBUDGET_PD: selectedItems[j].AssignmentFields.HRBUDGET_PD,
											HRCOSTASG: selectedItems[j].AssignmentFields.HRCOSTASG,
											HRFUNC_AREA: selectedItems[j].AssignmentFields.HRFUNC_AREA,
											HRFUND: selectedItems[j].AssignmentFields.HRFUND,
											HRGRANT_NBR: selectedItems[j].AssignmentFields.HRGRANT_NBR,
											HRKOSTL: selectedItems[j].AssignmentFields.HRKOSTL,
											HRLSTAR: selectedItems[j].AssignmentFields.HRLSTAR,
											KAPAR: selectedItems[j].AssignmentFields.KAPAR,
											KAPID: selectedItems[j].AssignmentFields.KAPID,
											KOKRS: selectedItems[j].AssignmentFields.KOKRS,
											LAEDA: selectedItems[j].AssignmentFields.LAEDA,
											LAETM: selectedItems[j].AssignmentFields.LAETM,
											LGART: selectedItems[j].AssignmentFields.LGART,
											LOGSYS: selectedItems[j].AssignmentFields.LOGSYS,
											LONGTEXT: selectedItems[j].AssignmentFields.LONGTEXT,
											LONGTEXT_DATA: selectedItems[j].AssignmentFields.LONGTEXT_DATA,
											LSTAR: selectedItems[j].AssignmentFields.LSTAR,
											LSTNR: selectedItems[j].AssignmentFields.LSTNR,
											LTXA1: selectedItems[j].AssignmentFields.LTXA1,
											MEINH: selectedItems[j].AssignmentFields.MEINH,
											OFMNW: selectedItems[j].AssignmentFields.OFMNW,
											OTYPE: selectedItems[j].AssignmentFields.OTYPE,
											PAOBJNR: selectedItems[j].AssignmentFields.PAOBJNR,
											PEDD: selectedItems[j].AssignmentFields.PEDD,
											PERNR: selectedItems[j].AssignmentFields.PERNR,
											PLANS: selectedItems[j].AssignmentFields.PLANS,
											POSID: selectedItems[j].AssignmentFields.POSID,
											PRAKN: selectedItems[j].AssignmentFields.PRAKN,
											PRAKZ: selectedItems[j].AssignmentFields.PRAKZ,
											PRICE: selectedItems[j].AssignmentFields.PRICE,
											RAPLZL: selectedItems[j].AssignmentFields.RAPLZL,
											RAUFNR: selectedItems[j].AssignmentFields.RAUFNR,
											RAUFPL: selectedItems[j].AssignmentFields.RAUFPL,
											REASON: selectedItems[j].AssignmentFields.REASON,
											REFCOUNTER: selectedItems[j].AssignmentFields.REFCOUNTER,
											REINR: selectedItems[j].AssignmentFields.REINR,
											RKDAUF: selectedItems[j].AssignmentFields.RKDAUF,
											RKDPOS: selectedItems[j].AssignmentFields.RKDPOS,
											RKOSTL: selectedItems[j].AssignmentFields.RKOSTL,
											RKSTR: selectedItems[j].AssignmentFields.RKSTR,
											RNPLNR: selectedItems[j].AssignmentFields.RNPLNR,
											RPROJ: selectedItems[j].AssignmentFields.RPROJ,
											RPRZNR: selectedItems[j].AssignmentFields.RPRZNR,
											SBUDGET_PD: selectedItems[j].AssignmentFields.SBUDGET_PD,
											SEBELN: selectedItems[j].AssignmentFields.SEBELN,
											SEBELP: selectedItems[j].AssignmentFields.SEBELP,
											SKOSTL: selectedItems[j].AssignmentFields.SKOSTL,
											SPLIT: selectedItems[j].AssignmentFields.SPLIT,
											SPRZNR: selectedItems[j].AssignmentFields.SPRZNR,
											STATKEYFIG: selectedItems[j].AssignmentFields.STATKEYFIG,
											STATUS: selectedItems[j].AssignmentFields.STATUS,
											S_FUNC_AREA: selectedItems[j].AssignmentFields.S_FUNC_AREA,
											S_FUND: selectedItems[j].AssignmentFields.S_FUND,
											S_GRANT_NBR: selectedItems[j].AssignmentFields.S_GRANT_NBR,
											TASKCOMPONENT: selectedItems[j].AssignmentFields.TASKCOMPONENT,
											TASKCOUNTER: selectedItems[j].AssignmentFields.TASKCOUNTER,
											TASKLEVEL: selectedItems[j].AssignmentFields.TASKLEVEL,
											TASKTYPE: selectedItems[j].AssignmentFields.TASKTYPE,
											TCURR: selectedItems[j].AssignmentFields.TCURR,
											TRFGR: selectedItems[j].AssignmentFields.TRFGR,
											TRFST: selectedItems[j].AssignmentFields.TRFST,
											UNIT: selectedItems[j].AssignmentFields.UNIT,
											UVORN: selectedItems[j].AssignmentFields.UVORN,
											VERSL: selectedItems[j].AssignmentFields.VERSL,
											VORNR: selectedItems[j].AssignmentFields.VORNR,
											VTKEN: selectedItems[j].AssignmentFields.VTKEN,
											WABLNR: selectedItems[j].AssignmentFields.WABLNR,
											WAERS: selectedItems[j].AssignmentFields.WAERS,
											WERKS: selectedItems[j].AssignmentFields.WERKS,
											WORKDATE: selectedItems[j].AssignmentFields.WORKDATE,
											WORKITEMID: selectedItems[j].AssignmentFields.WORKITEMID,
											WTART: selectedItems[j].AssignmentFields.WTART
										}
									},
									success: function (oDataReturn) {
										that.oDataReturnCount++;
										if (that.oDataReturnCount == selectedItems.length) {
											that.oDataReturnCount = 0;
											that.getTasks(false);
											that.hideBusy();
											var toastMsg = that.oBundle.getText("assignmentsImported");
											sap.m.MessageToast.show(toastMsg, {
												duration: 3000
											});
										}
									},
									error: function (oError) {
										that.hideBusy();
										that.oErrorHandler.processError(oError);
									},
									changeSetId: "ImportAssignments",
									groupId: "ImportAssignments"
								};
								var keyNames = Object.keys(selectedItems[j].AssignmentFields);
								for (var k = 0; k < keyNames.length; k++) {
									obj.properties.AssignmentFields[keyNames[k]] = selectedItems[j].AssignmentFields[keyNames[k]];
								}
								that.oDataImportAssignmentsModel
									.createEntry(
										"/AssignmentCollection",
										obj);
							}
						}
						that.oDataImportAssignmentsModel.submitChanges({
							groupId: "ImportAssignments",
							changeSetId: "ImportAssignments"
						});
					}, true);
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function (oEvent) {
			return;
/*			var that = this;
			var oControl = this.getModel('controls');
			var oJSONData = this.getView().getModel('json').getData();
			var timeData = this.getModel('TimeData').getData();
			var timeEntries = this.getModel('TimeEntries').getData();
			oJSONData.CatsStatus = timeEntries.find( el => oJSONData.WeekNumber == el.CaleDate.getWeek() ).Weekstatus;
			this.getView().getModel('json').setData(oJSONData);*/
		},
		onTimeUpdateFinished: function (oEvent) {
/*			var that 		=	this;
			var	weekstatus	=	10;
			var timeEntries = oEvent.getSource().getBinding("items").getCurrentContexts();
			if(Array.isArray(timeEntries) && timeEntries.length > 0){
				weekstatus = parseInt(timeEntries[0].getObject().Weekstatus);
				//this.getModel("controls").setProperty("/duplicateWeekEnabled", false);
				this.getView().byId("duplicateWeekButton").setVisible(false);
			}else{
				this.getView().byId("duplicateWeekButton").setVisible(true);
				//this.getModel("controls").setProperty("/duplicateWeekEnabled", true);
				for(var i=0;i<7;i++){
					this.onAddItem();
				}
			}
			this.getModel("json").getData().TimeEntries.map((el) => {
				el.Day1 = parseInt(el.Day1);
				el.Day2 = parseInt(el.Day2);
				el.Day3 = parseInt(el.Day3);
				el.Day4 = parseInt(el.Day4);
				el.Day5 = parseInt(el.Day5);
				el.Day6 = parseInt(el.Day6);
				el.Day7 = parseInt(el.Day7);
			});
			//weekstatus = _.min(this.getModel("json").getData().TimeEntries, (el) => parseInt(el.Weekstatiius) ).Weekstatus
			weekstatus = _.min(this.getModel("json").getData().TimeEntries.map((el) => el.Weekstatus = parseInt(el.Weekstatus)));
			this.getView().getModel('json').setProperty("/CatsStatus",weekstatus);
			this.getView().getModel('json').setProperty("/AllowRelease",( weekstatus !== 30 ));*/
			this.oTimeTable.setBusy(false);
		},
		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress: function (oEvent) {
			// The source is the list item that got pressed
		},

		onLongTextPost: function (oEvent) {
			var index = oEvent.getSource().getParent().getBindingContext('TimeData').getPath().split('/')[1];
			var okButton = oEvent.getSource().getParent().getAggregation('beginButton');
			var data = this.getModel('TimeData').getData();
			if (oEvent.getParameter('value')) {
				data[index].TimeEntryDataFields.LONGTEXT_DATA = oEvent.getParameter('value');
				data[index].TimeEntryDataFields.LONGTEXT = 'X';
				if (data[index].Counter !== "") {
					data[index].TimeEntryOperation = 'U';
				} else {
					data[index].TimeEntryOperation = 'C';
				}
				var oModel = new JSONModel(data);
				this.setModel(oModel, "TimeData");
				okButton.setEnabled(true);
			}
		},

		onTodoLongTextPost: function (oEvent) {
			var index = oEvent.getSource().getParent().getBindingContext('TodoList').getPath().split('/')[1];
			var okButton = oEvent.getSource().getParent().getAggregation('beginButton');
			var data = this.getModel('TodoList').getData();
			if (oEvent.getParameter('value')) {
				data[index].TimeEntryDataFields.LTXA1 = oEvent.getParameter('value');
				data[index].TimeEntryDataFields.LONGTEXT = 'X';
				if (data[index].Counter !== "") {
					data[index].TimeEntryOperation = 'U';
				} else {
					data[index].TimeEntryOperation = 'C';
				}
				data[index].TimeEntryDataFields.LONGTEXT_DATA = oEvent.getParameter('value');
				var oModel = new JSONModel(data);
				this.setModel(oModel, "TodoList");
				okButton.setEnabled(true);
			}
		},
		zCreateMessagePopover: function (oEvent) {
			var oMessageTemplate = new MessagePopoverItem({
				type: '{message>severity}',
				description: "{message>description}",
				title: '{message>message}'
				/*
				link: new sap.m.Link({
					text: this.oBundle.getText("clickHere"),
					press: this.onClickFocusError.bind(this),
					visible: "{=${message>code} === undefined ? false : true}",
					customData: [new sap.ui.core.CustomData({
						key: "counter",
						value: "{message>additionalText}"
					}), new sap.ui.core.CustomData({
						key: "code",
						value: "{message>code}"
					})]
				})
				*/
			});
			var oMessagePopover = new MessagePopover({
				items: {
					path: "message>/",
					template: oMessageTemplate
				}
			});
			this.oMessagePopover = oMessagePopover;
			this.oMessagePopover.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "message");
		},
		handleMessagePopover: function (oEvent) {
			if(this.oMessagePopover === undefined || this.oMessagePopover === null){
				this.zCreateMessagePopover();
			}
			this.oMessagePopover.toggle(oEvent.getSource());
		},
		showPopover :function(){
			var btn = this.getView().byId("msgsBtn");
			btn.firePress();
		},
		onClickFocusError: function (oEvent) {
			var that = this;
			var oRecRowNo = oEvent.getSource().getCustomData("counter")[0].getValue();
			var dataModel = oEvent.getSource().getCustomData("code")[1].getValue();
			var oEntries = this.getModel(dataModel).getData();
			var highlightedRecords = $.grep(oEntries, function (element, ind) {
				if (element.valueState) {
					return element.valueState === "Error";
				}
			});
			for (var i = 0; i < highlightedRecords.length; i++) {
				highlightedRecords[i].valueState = "None";
			}
			this.getModel('TimeData').updateBindings();
			var entry = $.grep(oEntries, function (element, ind) {
				if (element.RecRowNo) {
					return element.RecRowNo === parseInt(oRecRowNo).toString();
				}
			});
			if (entry.length > 0) {
				entry[0].valueState = "Error";
			}
			this.getModel('TimeData').updateBindings();
			this.oMessagePopover.close();
		},

		handleCalendarSelect: function (oEvent) {
			var that = this;
			var oControl = this.getModel('controls');
			if (sap.ui.Device.system.phone === true) {
				var oCalendar = oEvent.getSource();
				var aSelectedDates = oCalendar.getSelectedDates();
				this.mCalendar.destroySelectedDates();
				this.startdate = aSelectedDates[0].getStartDate();
				this.enddate = aSelectedDates[0].getStartDate();
				// this.startdate = new Date(this.startdate.getUTCFullYear(), this.startdate.getUTCMonth(), this.startdate.getUTCDate());
				// this.enddate = new Date(this.enddate.getUTCFullYear(), this.enddate.getUTCMonth(), this.enddate.getUTCDate());
				this.calendarSelection(oCalendar, new Date(this.startdate), new Date(this.enddate));
				this.bindTable(new Date(this.startdate), new Date(this.enddate));
				if (this.oReadOnlyTemplate) {
					this.rebindTableWithTemplate(this.oTable, "TimeData>/", this.oReadOnlyTemplate, "Navigation");
				}
			} else {
				var oCalendar = oEvent.getSource();
				var aSelectedDates = oCalendar.getSelectedDates();
				this.calendar.destroySelectedDates();
				this.startdate = this.getFirstDayOfWeek(aSelectedDates[0].getStartDate(), this.firstDayOfWeek);
				this.enddate = this.getLastDayOfWeek(aSelectedDates[0].getStartDate(), this.firstDayOfWeek);
				this.calendarSelection(oCalendar, new Date(this.startdate), new Date(this.enddate));
				// this.startdate = new Date(this.startdate.getUTCFullYear(), this.startdate.getUTCMonth(), this.startdate.getUTCDate());
				// this.enddate = new Date(this.enddate.getUTCFullYear(), this.enddate.getUTCMonth(), this.enddate.getUTCDate());
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				if (oControl.getProperty("/isOverviewChanged") === true) { // || oControl.getProperty("/overviewDataChanged") === true ) {
					sap.m.MessageBox.warning(
						that.oBundle.getText("confirmationSwitchTabGeneral"), {
							title: that.oBundle.getText("confirm"),
							actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
							styleClass: bCompact ? "sapUiSizeCompact" : "",
							onClose: function (sAction) {
								if (sAction === "CANCEL") {
									that.bindTable(new Date(that.prestartdate), new Date(that.preenddate));
									oControl.setProperty('/onEdit', "None");
									oControl.setProperty('/duplicateVisibility', true);
									oControl.setProperty('/duplicateWeekVisibility', true);
									oControl.setProperty('/overviewEdit', false);
									Control.setProperty('/overviewEditable', true);
									oControl.setProperty('/showFooter', true);
								} else {
									that.calendarSelection(oCalendar, new Date(that.startdate), new Date(that.enddate));
									that.bindTable(new Date(that.startdate), new Date(that.enddate));
									if (that.oReadOnlyTemplate) {
										that.rebindTableWithTemplate(that.oTable, "TimeData>/", that.oReadOnlyTemplate, "Navigation");
									}
									oControl.setProperty('/isOverviewChanged', false);
									oControl.setProperty('/isOverviewDataChanged', false);
									oControl.setProperty('/onEdit', "None");
									oControl.setProperty('/duplicateVisibility', false);
									oControl.setProperty('/duplicateWeekVisibility', false);
									oControl.setProperty('/overviewEdit', true);
									oControl.setProperty('/overviewEditable', false);
									oControl.setProperty('/showFooter', false);
								}
							}
						}

					);
				} else {
					this.bindTable(new Date(this.startdate), new Date(this.enddate));
					if (this.oReadOnlyTemplate) {
						this.rebindTableWithTemplate(this.oTable, "TimeData>/", this.oReadOnlyTemplate, "Navigation");
					}
				}

			}
			oControl.setProperty('/onEdit', "None");
			oControl.setProperty('/duplicateVisibility', false);
			oControl.setProperty('/duplicateWeekVisibility', false);
			oControl.setProperty('/overviewEdit', true);
			oControl.setProperty('/overviewEditable', false);
			oControl.setProperty('/showFooter', false);
			// YBO - ADD - Bind Week number
			this._bindTimeTable(new Date(this.startdate), new Date(this.enddate));
			this._updateWeekNumber();
			// YBO - END - Bind Week number
		},
		// YBO - _updateWeekNumber - Bind Week number
		_updateWeekNumber: function(){
			//var oEditEnabled = true;
			if(this.startdate.is().sunday()){
				this.startdate = this.startdate.next().monday();
			}
			var jsonData = this.getView().getModel("json").getData();
			jsonData.WeekNumber = this.startdate.getWeek();
			this.getView().getModel("json").setData(jsonData);
/*			if(jsonData.CatsStatus == 30 || jsonData.CatsStatus == 20){
				oEditEnabled = false;
			}*/
			//this.getView().getModel("controls").setProperty("/overviewEditEnabled",oEditEnabled);
		},
		// YBO - _moveWeekBy - Move to next week
		_moveWeekBy: function(n){
			if(isNaN(n) || parseInt(n) === undefined){
				n = 1;
			}
			var nextWeekDate = this.startdate + 7 * n;
			this.getView().byId("mCalendar").setStartdate(nextWeekDate);
		},
		// YBO - setNextWeek - Move to next week
		setNextWeek: function(n){
			var newSelection = new sap.ui.unified.DateRange();
			newSelection.setStartDate(this.startdate.next().monday())
			newSelection.setEndDate(this.enddate.next().sunday())
			this.calendar.destroySelectedDates();
			this.calendar.addSelectedDate(newSelection);
			this.calendar.fireSelect({});
			this.calendar.focusDate(this.startdate);
		},
		// YBO - setPreviousWeek - Back to previous week
		setPreviousWeek: function(n){
			var newSelection = new sap.ui.unified.DateRange();
			newSelection.setStartDate(this.startdate.last().monday())
			newSelection.setEndDate(this.enddate.last().sunday())
			this.calendar.destroySelectedDates();
			this.calendar.addSelectedDate(newSelection);
			this.calendar.fireSelect({});
			this.calendar.focusDate(this.startdate);
		},
		// YBO - setEditable - Back to previous week
		setEditable: function(editable){
			var oModel = this.getModel('controls');
			oModel.setProperty('/showFooter', editable);
			oModel.setProperty('/sendForApproval', editable);
			//oModel.setProperty('/submitDraft', this.profileInfo.AllowRelease === "TRUE" ? false : true);
			oModel.setProperty('/overviewCancel', editable);
			oModel.setProperty('/todoCancel', editable);
			oModel.setProperty('/duplicateVisibility', editable);
			if (sap.ui.Device.system.phone === false) {
				oModel.setProperty('/duplicateWeekVisibility', editable);
			}
			oModel.setProperty('/overviewEditable', editable);
			//oModel.setProperty('/overviewEdit', editable);
			oModel.setProperty('/todoDone', editable);
			// oModel.setProperty('/onEdit', "MultiSelect");
			//oModel.setProperty('/onEdit', "None");
			//oModel.setProperty('/duplicateTaskEnable', editable);
		},
		handleDuplicateWeekCalendar: function (oEvent) {
			var oCalendar = oEvent.getSource();
			var aSelectedDates = oCalendar.getSelectedDates();
			var dateFrom = this.getFirstDayOfWeek(aSelectedDates[0].getStartDate(), this.firstDayOfWeek);
			var dateTo = this.getLastDayOfWeek(aSelectedDates[0].getStartDate(), this.firstDayOfWeek);
			this.duplicateWeekCalendar(oCalendar, dateFrom, dateTo);
			var oDate;
			var oData = {
				selectedWeek: []
			};
			var oModel = new JSONModel();

			if (this.getModel("selectedDatesDupWeek")) {
				var data = this.getModel("selectedDatesDupWeek").getData();
				var search = $.grep(data.selectedWeek, function (element, index) {
					return element.dateFrom.toDateString() === dateFrom.toDateString();
				});
				if (search.length === 0) {
					data.selectedWeek.push({
						dateFrom: dateFrom,
						dateTo: dateTo
					});
				}
				oModel.setData(data);
			} else {
				oData.selectedWeek.push({
					dateFrom: dateFrom,
					dateTo: dateTo
				});
				oModel.setData(oData);
			}
			this.setModel(oModel, "selectedDatesDupWeek");
			this.getModel('controls').setProperty("/duplicateWeekButtonEnable", true);
		},

		calendarSelection: function (oCalendar, startDate, endDate) {
			oCalendar.destroySelectedDates();
			var selectedDates = new sap.ui.unified.DateRange();
			selectedDates.setStartDate(startDate);
			selectedDates.setEndDate(endDate);
			oCalendar.addSelectedDate(selectedDates);
		},

		duplicateWeekCalendar: function (oCalendar, startDate, endDate) {
			oCalendar.destroySelectedDates();
			var selectedDates = new sap.ui.unified.DateRange();
			selectedDates.setStartDate(startDate);
			selectedDates.setEndDate(endDate);
			oCalendar.addSelectedDate(selectedDates);
		},

		bindTable: function (startDate, endDate) {
			this._bindTimeTable(startDate, endDate);
/*			var that = this;
			this.oTable.setBusy(true);
			var entries = $.extend(true, [], this.getModel('TimeEntries').getData());
			var oModel = new sap.ui.model.json.JSONModel();
			var timedata = [];
			var statusdata = [{
				key: '100',
				text: '{i18n>allStatus}'
			}, {
				key: '10'
			}, {
				key: '20'
			}, {
				key: '30'
			}, {
				key: '40'
			}];
			for (var i = startDate; i <= endDate; i.setDate(i.getDate() + 1)) {
				// var dateSearch = new Date(i.getUTCFullYear(), i.getUTCMonth(), i.getUTCDate());
				var dateSearch = i;
				var daterecords = $.grep(entries, function (element, index) {
					return that.oFormatyyyymmdd.format(element.CaleDate) == that.oFormatyyyymmdd.format(dateSearch) && element.Status !== '99';
				});
				if (daterecords.length === 0) {
					continue;
				}
				var recordTemplate = {
					AllowEdit: "X",
					AllowRelease: "",
					AssignmentId: "",
					AssignmentName: "",
					CatsDocNo: "",
					Counter: "",
					Pernr: this.empID,
					RefCounter: "",
					RejReason: "",
					Status: "",
					SetDraft: false,
					HeaderData: {
						target: daterecords[0].TargetHours,
						sum: "0.00",
						date: new Date(i),
						addButton: false,
						highlight: false
					},
					target: daterecords[0].TargetHours,
					TimeEntryDataFields: {
						AENAM: "",
						ALLDF: "",
						APDAT: null,
						APNAM: "",
						ARBID: "00000000",
						ARBPL: "",
						AUERU: "",
						AUFKZ: "",
						AUTYP: "00",
						AWART: "",
						BEGUZ: "000000",
						BELNR: "",
						BEMOT: "",
						BUDGET_PD: "",
						BUKRS: "",
						BWGRL: "0.0",
						CATSAMOUNT: "0.0",
						CATSHOURS: "0.00",
						CATSQUANTITY: "0.0",
						CPR_EXTID: "",
						CPR_GUID: "",
						CPR_OBJGEXTID: "",
						CPR_OBJGUID: "",
						CPR_OBJTYPE: "",
						ENDUZ: "000000",
						ERNAM: "",
						ERSDA: "",
						ERSTM: "",
						ERUZU: "",
						EXTAPPLICATION: "",
						EXTDOCUMENTNO: "",
						EXTSYSTEM: "",
						FUNC_AREA: "",
						FUND: "",
						GRANT_NBR: "",
						HRBUDGET_PD: "",
						HRCOSTASG: "0",
						HRFUNC_AREA: "",
						HRFUND: "",
						HRGRANT_NBR: "",
						HRKOSTL: "",
						HRLSTAR: "",
						KAPAR: "",
						KAPID: "00000000",
						KOKRS: "",
						LAEDA: "",
						LAETM: "",
						LGART: "",
						LOGSYS: "",
						LONGTEXT: "",
						LONGTEXT_DATA: "",
						LSTAR: "",
						LSTNR: "",
						LTXA1: "",
						MEINH: "",
						OFMNW: "0.0",
						OTYPE: "",
						PAOBJNR: "0000000000",
						PEDD: null,
						PERNR: "00000000",
						PLANS: "00000000",
						POSID: "",
						PRAKN: "",
						PRAKZ: "0000",
						PRICE: "0.0",
						RAPLZL: "00000000",
						RAUFNR: "",
						RAUFPL: "0000000000",
						REASON: "",
						REFCOUNTER: "000000000000",
						REINR: "0000000000",
						RKDAUF: "",
						RKDPOS: "000000",
						RKOSTL: "",
						RKSTR: "",
						RNPLNR: "",
						RPROJ: "00000000",
						RPRZNR: "",
						SBUDGET_PD: "",
						SEBELN: "",
						SEBELP: "00000",
						SKOSTL: "",
						SPLIT: "0",
						SPRZNR: "",
						STATKEYFIG: "",
						STATUS: "",
						S_FUNC_AREA: "",
						S_FUND: "",
						S_GRANT_NBR: "",
						TASKCOMPONENT: "",
						TASKCOUNTER: "",
						TASKLEVEL: "",
						TASKTYPE: "",
						TCURR: "",
						TRFGR: "",
						TRFST: "",
						UNIT: "",
						UVORN: "",
						VERSL: "",
						VORNR: "",
						VTKEN: "",
						WABLNR: "",
						WAERS: "",
						WERKS: "",
						WORKDATE: new Date(i),
						WORKITEMID: "000000000000",
						WTART: ""
					},
					TimeEntryOperation: "",
					Awart: "PRES",
					Rproj: "",
					Day1: 0,
					Day2: 0,
					Day3: 0,
					Day4: 0,
					Day5: 0,
					Day6: 0,
					Day7: 0,
					Weeknr:0,
					Weekstatus:99
				};
				//this.recordTemplate = recordTemplate;
				if (daterecords[0].TimeEntries.results.length > 1) {
					daterecords[0].TimeEntries.results = daterecords[0].TimeEntries.results.sort(function (obj1, obj2) {
						if (parseFloat(obj1.TimeEntryDataFields.CATSHOURS) > parseFloat(obj2.TimeEntryDataFields.CATSHOURS) || obj1.Status === '99') {
							return -1;
						} else if (parseFloat(obj2.TimeEntryDataFields.CATSHOURS) > parseFloat(obj1.TimeEntryDataFields.CATSHOURS) || obj2.Status ===
							'99') {
							return 1;
						}
					});
				}
				var sumHours = 0;
				for (var j = 0; j < daterecords[0].TimeEntries.results.length; j++) {

					daterecords[0].TimeEntries.results[j].target = daterecords[0].TargetHours;
					daterecords[0].TimeEntries.results[j].TimeEntryDataFields.CATSHOURS = parseFloat(daterecords[0].TimeEntries.results[j].TimeEntryDataFields
						.CATSHOURS).toFixed(2);
					if (daterecords[0].TimeEntries.results[j].TimeEntryDataFields.STATUS !== '10' && daterecords[0].TimeEntries.results[j].TimeEntryDataFields
						.STATUS !== '40') {
						sumHours = parseFloat(sumHours) + parseFloat(daterecords[0].TimeEntries.results[j].TimeEntryDataFields
							.CATSHOURS);
					}
					timedata.push(daterecords[0].TimeEntries.results[j]);

				}
				for (var j = 0; j < daterecords[0].TimeEntries.results.length; j++) {
					daterecords[0].TimeEntries.results[j].totalHours = sumHours.toFixed(2);
					if ((j + 1) === daterecords[0].TimeEntries.results.length) {
						daterecords[0].TimeEntries.results[j].addButton = true;
						daterecords[0].TimeEntries.results[j].addButtonEnable = true;
						daterecords[0].TimeEntries.results[j].deleteButton = true;
						daterecords[0].TimeEntries.results[j].deleteButtonEnable = true;
						daterecords[0].TimeEntries.results[j].SetDraft = false;
						daterecords[0].TimeEntries.results[j].HeaderData = {
							target: daterecords[0].TargetHours,
							sum: sumHours,
							date: new Date(i),
							addButton: true,
							highlight: false
						};
					} else {
						daterecords[0].TimeEntries.results[j].addButton = false;
						daterecords[0].TimeEntries.results[j].deleteButton = true;
						daterecords[0].TimeEntries.results[j].deleteButtonEnable = true;
						daterecords[0].TimeEntries.results[j].SetDraft = false;
						daterecords[0].TimeEntries.results[j].HeaderData = {
							target: daterecords[0].TargetHours,
							sum: sumHours,
							date: new Date(i),
							addButton: false,
							highlight: false
						};
					}
				}
				if (daterecords[0].TimeEntries.results.length === 0 || (daterecords[0].TimeEntries.results.length === 1 && daterecords[0].TimeEntries
						.results[0].Status === '99')) {
					recordTemplate.totalHours = sumHours.toFixed(2);
					recordTemplate.addButton = true;
					recordTemplate.HeaderData.addButton = true;
					recordTemplate.addButtonEnable = false;
					recordTemplate.deleteButtonEnable = false;
					recordTemplate.SetDraft = false;
					timedata.push(recordTemplate);
				}

			}
			for (var i = 0; i < timedata.length; i++) {
				if (timedata[i].TimeEntryDataFields.STATUS === "10") {
					timedata[i].SetDraft = true;
				}
				var element = $.grep(statusdata, function (element, index) {
					if (timedata[i].TimeEntryDataFields.STATUS && timedata[i].TimeEntryDataFields.STATUS != "")
						return element.key === timedata[i].TimeEntryDataFields.STATUS;
				});
				if (element && element.length > 0) {
					continue;
				}
				timedata[i].highlight = "None";
				timedata[i].valueState = "None";
			}
			/* YBO01 : Update Time entries to meet the new structure */
/*			
			var oldtimedata = timedata,
				compactTimes = [],
				//newTimes = _.uniqWith(timedata,function(element){ return {'AWART':element.Awart,'RPROJ':element.Rproj}});
				newTimes = _.uniqWith(timedata,function(line1, line2){ return ( line1.Awart == line2.Awart && line1.Rproj == line2.Rproj )});
				_.remove(newTimes,(el)=>el.Day7+el.Day6+el.Day5+el.Day4+el.Day3+el.Day2+el.Day1 === 0)
			newTimes.forEach((line) => {
					//if(line.Awart !== "" && line.Rproj !== ""){
						var lineCopy = Object.assign({}, line);
						lineCopy.Day1 = lineCopy.Day2 = lineCopy.Day3 = lineCopy.Day4 = lineCopy.Day5 = lineCopy.Day6 = lineCopy.Day7 = parseInt("0");
						timedata.forEach((el) => {
							if(line.Awart == el.Awart && line.Rproj == el.Rproj) {
								lineCopy.Day1 += parseInt(el.Day1);
								lineCopy.Day2 += parseInt(el.Day2);
								lineCopy.Day3 += parseInt(el.Day3);
								lineCopy.Day4 += parseInt(el.Day4);
								lineCopy.Day5 += parseInt(el.Day5);
								lineCopy.Day6 += parseInt(el.Day6);
								lineCopy.Day7 += parseInt(el.Day7);
							}
						});
						var oCat = _.find(this.getModel("json").getData().CategorySet, function(o) { return o.key === lineCopy.Awart });
						if( oCat !== undefined && oCat.editable){
							lineCopy.AllowEdit = "X" ;
						}
						compactTimes.push(lineCopy);
					//}
			});
			timedata = compactTimes;
			if(timedata.length == 0){
				for(var i = 0; i<6 ;i++){
					timedata.push(this.recordTemplate());
				}
			}
			console.log("Current time entries",timedata);
			/* YBO01 : Update Time entries to meet the new structure */
			/*
			oModel.setData(timedata);
			//oModel.attachPropertyChange(this.onOverviewDataChanged.bind(this));
			this.setModel(oModel, "TimeData");
			this.setModel(new JSONModel(statusdata), "Status");
			this.oTable.setBusy(false);
			*/
		},
		zReadHolidays: function(parametres, onSuccess=null, onError=null){
			
			var that=this;
			
			var oStartDate 	= parametres.oStartDate,
				oEndDate	= parametres.oEndDate;
			
			this.getModel("VH").read("/ZV_I_THOC_3", {
				filters:[
				    new Filter({
				      path: "Datum",
				      operator: FilterOperator.BT,
				      value1: oStartDate,
				      value2: oEndDate
				    }),
				],
				success: function(oData){
					var oHolidayModel = new sap.ui.model.json.JSONModel();
					oHolidayModel.setProperty("/Holidays", oData.results);
					that.setModel(oHolidayModel, "holiday");
/*					oData.results.forEach( (line) =>{
						debugger;
					})*/
					console.log("Holidays", oData.results);
					if(typeof onSuccess === "function"){
						onSuccess(parametres);
					}
				},
				error: function(oError){
					console.error(oError);
					if(typeof onError === "function"){
						onError(parametres)
					}
				}
			});
		},
		_bindTimeTable: function(oStartDate, oEndDate){
			var that = this;
			this.oTimeTable.setBusy(true);
			this.oTimeTable.destroyItems();
			oStartDate.setHours(5);
			oEndDate.setHours(5);
			
			var parametres = {
				"oStartDate"	: oStartDate,
				"oEndDate"	 	: oEndDate
			};
			
			that.zReadHolidays(parametres,
				function(parametres){
					var oStartDate 	= parametres.oStartDate,
						oEndDate	= parametres.oEndDate;
					that.getModel("VH").read("/TimeEntries", {
						filters:[
						    new Filter({
						      path: "StartDate",
						      operator: FilterOperator.EQ,
						      value1: oStartDate
						    }),
						    new Filter({
						      path: "EndDate",
						      operator: FilterOperator.EQ,
						      value1: oEndDate
						    }),
						],
						success: function(oData,oContext){
							that.zSetTimeModel(oData.results);
						},
						error: function(oError){
							//TODO : Error message Box
						}
					});
				}
			);
			//this.getModel("VH").attachPropertyChange(this.onTimeOverviewDataChanged.bind(this));
		},
		zSetTimeModel: function(results){
			var that = this;
			var oModel = that.getModel("json");
			
			var oTimeModel = that.getModel("time");
			
			var oTotalsModel = that.getModel("totals");
			
			//var oHolidaysModel = that.getModel("holiday");
			
			var totals = that.getModel("totals").getData();
			
			totals.Day1 = 0;
			totals.Day2 = 0;
			totals.Day3 = 0;
			totals.Day4 = 0;
			totals.Day5 = 0;
			totals.Day6 = 0;
			totals.Day7 = 0;
			
			console.log("TimeEntries", results);
			
/*			if(results.length > 0){
				
				
				
				for( let i = 0;i<results.length;i++){
					
					var line = results[i];
					
					var monday = new Date();
					Object.assign(monday,line.StartDate);
					totals.Day1 += parseInt(line.Day1);
					totals.Day2 += parseInt(line.Day2);
					totals.Day3 += parseInt(line.Day3);
					totals.Day4 += parseInt(line.Day4);
					totals.Day5 += parseInt(line.Day5);
					totals.Day6 += parseInt(line.Day6);
					totals.Day7 += parseInt(line.Day7);
					
					line.Date1 = new Date(monday);//.setHours(0)  ;
					line.Date2 = new Date(monday.next().tuesday());
					line.Date3 = new Date(monday.next().wednesday());
					line.Date4 = new Date(monday.next().thursday());
					line.Date5 = new Date(monday.next().friday());
					line.Date6 = new Date(monday.next().saturday());
					line.Date7 = new Date(monday.next().sunday());
					
					totals.Holiday1 = oHolidaysModel.getData().Holidays.find( (el)=> el.Datum.toString("yyyyMMdd") === line.Date1.toString("yyyyMMdd") )!= undefined ? "holidayCls" : "";
					totals.Holiday2 = oHolidaysModel.getData().Holidays.find( (el)=> el.Datum.toString("yyyyMMdd") === line.Date2.toString("yyyyMMdd") )!= undefined ? "holidayCls" : "";
					totals.Holiday3 = oHolidaysModel.getData().Holidays.find( (el)=> el.Datum.toString("yyyyMMdd") === line.Date3.toString("yyyyMMdd") )!= undefined ? "holidayCls" : "";
					totals.Holiday4 = oHolidaysModel.getData().Holidays.find( (el)=> el.Datum.toString("yyyyMMdd") === line.Date4.toString("yyyyMMdd") )!= undefined ? "holidayCls" : "";
					totals.Holiday5 = oHolidaysModel.getData().Holidays.find( (el)=> el.Datum.toString("yyyyMMdd") === line.Date5.toString("yyyyMMdd") )!= undefined ? "holidayCls" : "";
					totals.Holiday6 = oHolidaysModel.getData().Holidays.find( (el)=> el.Datum.toString("yyyyMMdd") === line.Date6.toString("yyyyMMdd") )!= undefined ? "holidayCls" : "";
					totals.Holiday7 = oHolidaysModel.getData().Holidays.find( (el)=> el.Datum.toString("yyyyMMdd") === line.Date7.toString("yyyyMMdd") )!= undefined ? "holidayCls" : "";
				}
			}*/
			oModel.setProperty("/TimeEntries", results);
			oTimeModel.setProperty("/TimeEntries", results);
/*			oTotalsModel.setData(totals);
			console.log("zSetTimeModel:Totals: ", this.getModel("totals").getData() );*/
			this.onTimeModelUpdated();
		},
		onTimeModelUpdated: function(){
			var that 		=	this;
			var	weekstatus	=	10;
			var timeEntries = this.getModel("json").getData().TimeEntries;
			if(Array.isArray(timeEntries) && timeEntries.length > 0){
				this.getModel("controls").setProperty("/duplicateWeekEnabled", false);
				//this.getView().byId("duplicateWeekButton").setVisible(false);
			}else{
				//this.getView().byId("duplicateWeekButton").setVisible(true);
				this.getModel("controls").setProperty("/duplicateWeekEnabled", true);
				for(var i=0;i<7;i++){
					this.onAddItem();
				}
			}
			this.getModel("json").getData().TimeEntries.map((el) => {
				el.Day1 = parseInt(el.Day1);
				el.Day2 = parseInt(el.Day2);
				el.Day3 = parseInt(el.Day3);
				el.Day4 = parseInt(el.Day4);
				el.Day5 = parseInt(el.Day5);
				el.Day6 = parseInt(el.Day6);
				el.Day7 = parseInt(el.Day7);
			});
			//weekstatus = _.min(this.getModel("json").getData().TimeEntries, (el) => parseInt(el.Weekstatiius) ).Weekstatus
			weekstatus = _.min(this.getModel("json").getData().TimeEntries.map((el) => el.Weekstatus = parseInt(el.Weekstatus)));
			this.getView().getModel('json').setProperty("/CatsStatus",weekstatus);
			this.getView().getModel('json').setProperty("/AllowRelease",( weekstatus !== 30 ));
			this.updateTotals();
			this.checkTotals();
		},
		onTimeOverviewDataChanged: function (context, field, newValue) {
			var that = this;
			if(field.charAt(0) !=='/'){
				field = '/'+field ;
			}
			
			this.getModel("controls").setProperty('/overviewDataChanged', true);
			this.getModel("time").setProperty(context + field, newValue);
			this.updateTotals();
			this.checkTotals();
/*			var jsonData = this.getModel("json").getData();
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var sHoursValidation = oBundle.getText("HoursValidation");
			var sMsg = oBundle.getText("HoursMinMax", [jsonData.HoursMin, jsonData.HoursMax]);
			sap.ui.getCore().getMessageManager().removeAllMessages();
			Object.keys(totals).forEach( (key)=>{
				
				var hours = totals[key];
				
				var oOn = that.getView().byId("on"+key);
				
				if( oOn.getParent().getVisible() === true && 
				( hours < jsonData.HoursMin ||  hours > jsonData.HoursMax )
				){
					oOn.setState(sap.ui.core.ValueState.Error);
					sap.ui.getCore().getMessageManager().addMessages(
						new sap.ui.core.message.Message({
							id: oOn.getId(),
							message: sHoursValidation,
							description: sMsg,
							type: sap.ui.core.MessageType.Error,
							processor: that.getOwnerComponent().oMessageProcessor,
							code: "time"
						}));
				}else{
					oOn.setState(sap.ui.core.ValueState.None);
				}
			});*/
		},
		updateTotals: function(){
			
			var oHolidaysModel = this.getModel("holiday");
			
			var Day1 = 0 ;
			var Day2 = 0 ;
			var Day3 = 0 ;
			var Day4 = 0 ;
			var Day5 = 0 ;
			var Day6 = 0 ;
			var Day7 = 0 ;
	
			this.getModel("time").getData().TimeEntries.forEach( (line)=>{
				Day1 += parseInt(line.Day1);
				Day2 += parseInt(line.Day2);
				Day3 += parseInt(line.Day3);
				Day4 += parseInt(line.Day4);
				Day5 += parseInt(line.Day5);
				Day6 += parseInt(line.Day6);
				Day7 += parseInt(line.Day7);
			});
			this.getModel("totals").setProperty("/Day1", Day1);
			this.getModel("totals").setProperty("/Day2", Day2);
			this.getModel("totals").setProperty("/Day3", Day3);
			this.getModel("totals").setProperty("/Day4", Day4);
			this.getModel("totals").setProperty("/Day5", Day5);
			this.getModel("totals").setProperty("/Day6", Day6);
			this.getModel("totals").setProperty("/Day7", Day7);
			
			var monday = new Date(this.startdate);
			var totals = this.getModel("totals").getData();
			
			this.getModel("totals").setProperty("/Date1",new Date(monday));//.setHours(0)  ;
			this.getModel("totals").setProperty("/Date2",new Date(monday.next().tuesday()));
			this.getModel("totals").setProperty("/Date3",new Date(monday.next().wednesday()));
			this.getModel("totals").setProperty("/Date4",new Date(monday.next().thursday()));
			this.getModel("totals").setProperty("/Date5",new Date(monday.next().friday()));
			this.getModel("totals").setProperty("/Date6",new Date(monday.next().saturday()));
			this.getModel("totals").setProperty("/Date7",new Date(monday.next().sunday()));
			
			this.getModel("totals").setProperty("/Holiday1",oHolidaysModel.getData().Holidays.find( (el)=> el.Datum.toString("yyyyMMdd") === totals.Date1.toString("yyyyMMdd") )!= undefined ? "holidayCls" : "");
			this.getModel("totals").setProperty("/Holiday2",oHolidaysModel.getData().Holidays.find( (el)=> el.Datum.toString("yyyyMMdd") === totals.Date2.toString("yyyyMMdd") )!= undefined ? "holidayCls" : "");
			this.getModel("totals").setProperty("/Holiday3",oHolidaysModel.getData().Holidays.find( (el)=> el.Datum.toString("yyyyMMdd") === totals.Date3.toString("yyyyMMdd") )!= undefined ? "holidayCls" : "");
			this.getModel("totals").setProperty("/Holiday4",oHolidaysModel.getData().Holidays.find( (el)=> el.Datum.toString("yyyyMMdd") === totals.Date4.toString("yyyyMMdd") )!= undefined ? "holidayCls" : "");
			this.getModel("totals").setProperty("/Holiday5",oHolidaysModel.getData().Holidays.find( (el)=> el.Datum.toString("yyyyMMdd") === totals.Date5.toString("yyyyMMdd") )!= undefined ? "holidayCls" : "");
			this.getModel("totals").setProperty("/Holiday6",oHolidaysModel.getData().Holidays.find( (el)=> el.Datum.toString("yyyyMMdd") === totals.Date6.toString("yyyyMMdd") )!= undefined ? "holidayCls" : "");
			this.getModel("totals").setProperty("/Holiday7",oHolidaysModel.getData().Holidays.find( (el)=> el.Datum.toString("yyyyMMdd") === totals.Date7.toString("yyyyMMdd") )!= undefined ? "holidayCls" : "");
		
			
			console.log("updateTotals:Totals: ", this.getModel("totals").getData() );
		},
		checkTotals: function(checkMin = true, checkMax = true){
			var that = this;
			var check = true;
			var jsonData = this.getModel("json").getData();
			var totals = this.getModel("totals").getData();
			console.log("checkTotals:Totals: ", this.getModel("totals").getData() );
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var sHoursValidation = oBundle.getText("HoursValidation");
			var sMsg = oBundle.getText("HoursMinMax", [jsonData.HoursMin, jsonData.HoursMax]);
			sap.ui.getCore().getMessageManager().removeAllMessages();
			Object.keys(totals).forEach( (key)=>{
				
				if( key.substr(0,3) !== "Day" ){
					return;
				}
				
				var dayIndex = key.substr(3,1);
				
				var isHoliday = totals["Holiday"+dayIndex] !== "" ? true:false;
				
				if(isHoliday){
					
					checkMin = false;
					
				}
				
				var hours = totals[key];
				
				var oOn = that.getView().byId("on"+key);
				
				if( oOn.getParent().getVisible() === true && 
				( ( hours < jsonData.HoursMin && checkMin ) ||  ( hours > jsonData.HoursMax  && checkMax ) )
				){
					oOn.setState(sap.ui.core.ValueState.Error);
					sap.ui.getCore().getMessageManager().addMessages(
						new sap.ui.core.message.Message({
							id: oOn.getId(),
							message: sHoursValidation,
							description: sMsg,
							type: sap.ui.core.MessageType.Error,
							processor: that.getOwnerComponent().oMessageProcessor,
							code: "time"
						}));
						check = false;
				}else{
					oOn.setState(sap.ui.core.ValueState.None);
				}
			});
			return check;
		},		
		onOverviewDataChanged: function () {
			var that = this;
			var oControl = this.getModel("controls");
			oControl.setProperty('/overviewDataChanged', true);
		},
		getFirstDayOfWeek: function (date, from) {
			//Default start week from 'Sunday'. You can change it yourself.
			var index = from;
			var start = index >= 0 ? index : 0;
			var d = new Date(date);
			var day = d.getDay();
			var diff = d.getDate() - day + (start > day ? start - 7 : start);
			d.setDate(diff);
			return d;
		},
		getLastDayOfWeek: function (date, from) {
			var index = from;
			var start = index >= 0 ? index : 0;
			var d = new Date(date);
			var day = d.getDay();
			var diff = d.getDate() - day + (start > day ? start - 1 : 6 + start);
			d.setDate(diff);
			return d;
		},
		onEdit: function () {
			var oModel = this.getModel('controls');
			oModel.setProperty('/showFooter', true);
			oModel.setProperty('/sendForApproval', true);
			oModel.setProperty('/submitDraft', this.profileInfo.AllowRelease === "TRUE" ? false : true);
			oModel.setProperty('/overviewCancel', true);
			oModel.setProperty('/todoCancel', false);
			oModel.setProperty('/duplicateVisibility', true);
			if (sap.ui.Device.system.phone === false) {
				oModel.setProperty('/duplicateWeekVisibility', true);
			}
			oModel.setProperty('/overviewEditable', true);
			oModel.setProperty('/overviewEdit', false);
			oModel.setProperty('/todoDone', false);
			// oModel.setProperty('/onEdit', "MultiSelect");
			oModel.setProperty('/onEdit', "None");
			oModel.setProperty('/duplicateTaskEnable', false);

/*/*			this.readTemplate = new sap.m.ColumnListItem({
				cells: [
					new sap.m.Text({
						text: "{path: 'TimeData>TimeEntryDataFields/WORKDATE', type: 'sap.ui.model.type.Date', formatOptions: { pattern: 'EEEE, MMMM d' }}"
					}),
					new sap.m.ObjectIdentifier({
						text: "{TimeData>TimeEntryDataFields/AWART}"
					}),
					// new sap.m.ObjectIdentifier({
					// 	text: "{TimeData>TimeEntryDataFields/CATSHOURS} / {TimeData>target}",
					// 	state: {
					// 		parts: [{
					// 			path: 'TimeData>TimeEntryDataFields/CATSHOURS'
					// 		}, {
					// 			path: 'TimeData>target'
					// 		}],
					// 		formatter: formatter.hoursValidation
					// 	}
					// }),
					new sap.m.ObjectStatus({
						text: {
							path: 'TimeData>TimeEntryDataFields/STATUS',
							formatter: formatter.status
						},
						state: {
							path: 'TimeData>TimeEntryDataFields/STATUS',
							formatter: formatter.state
						}
					}),
					new sap.m.ObjectStatus({
						icon: "sap-icon://notes",
						visible: {
							parts: [{
								path: 'TimeData>TimeEntryDataFields/LONGTEXT'
							}, {
								path: 'TimeData>RejReasondesc'
							}],
							formatter: formatter.visibility
						}
					})
				]
			});
			// this.
			this.getView().byId("idOverviewTable").removeItem(0);*/

			// this.getView().byId("idOverviewTable").setMode("MultiSelect");
/*			
			this.oEditableTemplate = new sap.m.ColumnListItem({
				highlight: "{TimeData>highlight}",
				cells: [
					// new sap.ui.layout.VerticalLayout({content:[					
					// 	new sap.m.Text({
					// 	text: "{path: 'TimeData>TimeEntryDataFields/WORKDATE', type: 'sap.ui.model.type.Date', formatOptions: { pattern: 'EEEE, MMMM d' }}"
					// }),
					// new sap.m.ObjectStatus({
					// 	text: {
					// 		parts: [{
					// 			path: 'TimeData>totalHours'
					// 		}, {
					// 			path: 'TimeData>target'
					// 		}],
					// 		formatter: formatter.concatStrings
					// 	},
					// 	state: {
					// 		parts: [{
					// 			path: 'TimeData>totalHours'
					// 		}, {
					// 			path: 'TimeData>target'
					// 		}],
					// 		formatter: formatter.hoursValidation
					// 	}
					// }),
					// ]}),
					// new sap.m.Text({
					// 	text: "{path: 'TimeData>TimeEntryDataFields/WORKDATE', type: 'sap.ui.model.type.Date', formatOptions: { pattern: 'EEE, MMM d' }}"
					// }),
					// new sap.m.ObjectStatus({
					// 	text: {
					// 		parts: [{
					// 			path: 'TimeData>totalHours'
					// 		}, {
					// 			path: 'TimeData>target'
					// 		}],
					// 		formatter: formatter.concatStrings
					// 	},
					// 	state: {
					// 		parts: [{
					// 			path: 'TimeData>totalHours'
					// 		}, {
					// 			path: 'TimeData>target'
					// 		}],
					// 		formatter: formatter.hoursValidation
					// 	}
					// }),
					// new sap.m.ComboBox({
					// 	selectedKey: "{TimeData>AssignmentId}",
					// 	selectionChange: this.onSelectionChange
					// }).bindItems({
					// 	path: "Tasks>/",
					// 	// factory: this.activeTasks,
					// 	template: new sap.ui.core.Item({
					// 		key: "{Tasks>AssignmentId}",
					// 		text: "{Tasks>AssignmentName}",
					// 		enabled: {
					// 			path: 'Tasks>AssignmentStatus',
					// 			formatter: this.formatter.activeTasks
					// 		}
					// 	}),
					// 	templateShareable: true
					// }),
					new sap.m.ObjectStatus({
						text: {
							parts: [{
								path: 'TimeData>totalHours',
								type: 'sap.ui.model.odata.type.Decimal',
								formatOptions: {
									parseAsString: true,
									decimals: 2,
									maxFractionDigits: 2,
									minFractionDigits: 0
								},
								constraints: {
									precision: 4,
									scale: 2,
									minimum: '0',
									maximum: '10000'
								}
							}, {
								path: 'TimeData>target',
								type: 'sap.ui.model.odata.type.Decimal',
								formatOptions: {
									parseAsString: true,
									decimals: 2,
									maxFractionDigits: 2,
									minFractionDigits: 0
								},
								constraints: {
									precision: 4,
									scale: 2,
									minimum: '0',
									maximum: '10000'
								}
							}],
							formatter: formatter.concatStrings
						},
						visible: true
					}),
					new sap.m.ComboBox({
						selectedKey: "{:=${TimeData>AssignmentId}}",
						selectionChange: this.onSelectionChange.bind(this),
						enabled: {
							path: 'TimeData>Status',
							formatter: this.formatter.checkHrRecord.bind(this)
						},
						showSecondaryValues: true
					}).bindItems({
						path: "TasksWithGroups>/",
						// factory: this.activeTasks,
						template: new sap.ui.core.ListItem({
							key: "{TasksWithGroups>AssignmentId}",
							text: "{TasksWithGroups>AssignmentName}",
							enabled: {
								parts: [{
									path: 'TasksWithGroups>AssignmentStatus'
								}, {
									path: 'TasksWithGroups>ValidityStartDate'
								}, {
									path: 'TasksWithGroups>ValidityEndDate'
								}, {
									path: 'TimeData>TimeEntryDataFields'
								}],
								formatter: this.formatter.activeTasks
							},
							additionalText: "{TasksWithGroups>AssignmentType}"
						}),
						templateShareable: true
					}),

					// new sap.ui.layout.VerticalLayout({
					// content: [
					new sap.ui.layout.HorizontalLayout({
						content: [
							new sap.m.StepInput({
								value: {
									parts: [{
										path: 'TimeData>TimeEntryDataFields/CATSHOURS'
									}, {
										path: 'TimeData>TimeEntryDataFields/CATSQUANTITY'
									}, {
										path: 'TimeData>TimeEntryDataFields/CATSAMOUNT'
									}],
									formatter: formatter.calHoursQuanAmountInput.bind(this)
								},
								description: {
									parts: [{
										path: 'TimeData>TimeEntryDataFields/UNIT'
									}, {
										path: 'TimeData>TimeEntryDataFields/CATSHOURS'
									}],
									formatter: formatter.getUnitTexts.bind(this)
								},
								change: this.liveChangeHours.bind(this),
								displayValuePrecision: 2,
								step: 1,
								min: 0,
								fieldWidth: "60%",
								valueState: "{TimeData>valueState}",
								valueStateText: "{TimeData>valueStateText}",
								enabled: {
									parts: [{
										path: 'TimeData>Status'
									}, {
										path: 'controls>/hoursDisabled'
									}],
									formatter: this.formatter.checkHrRecord.bind(this)
								}
							})
						]
					}),
					new sap.m.CheckBox({
						selected: "{TimeData>SetDraft}",
						visible: this.draftStatus,
						enabled: {
							path: 'TimeData>Status',
							formatter: this.formatter.checkHrRecord.bind(this)
						}
					}).attachSelect(this.onSelectionDraft.bind(this)),
					new sap.m.Button({
						icon: "sap-icon://activity-items",
						type: sap.m.ButtonType.Transparent,
						press: this.onReadOnlyProjectDetails.bind(this),
						visible: {
							parts: [{
								path: 'TimeData>TimeEntryDataFields/CPR_GUID'
							}, {
								path: 'TimeData>TimeEntryDataFields/CPR_OBJGUID'
							}],
							formatter: this.formatter.projectsVisible.bind(this)
						}
					}),
					new sap.m.TimePicker({
						value: {
							path: 'TimeData>TimeEntryDataFields/BEGUZ',
							formatter: this.formatter.formatTime.bind(this)
						},
						visible: this.clockTimeVisible,
						valueFormat: "HH:mm",
						displayFormat: "HH:mm",
						change: this.startTimeChange.bind(this),
						placeholder: this.oBundle.getText("startTime"),
						enabled: {
							path: 'TimeData>Status',
							formatter: this.formatter.checkHrRecord.bind(this)
						}
					}),
					new sap.m.TimePicker({
						value: {
							path: 'TimeData>TimeEntryDataFields/ENDUZ',
							formatter: this.formatter.formatTime.bind(this)
						},
						visible: this.clockTimeVisible,
						valueFormat: "HH:mm",
						displayFormat: "HH:mm",
						change: this.endTimeChange.bind(this),
						placeholder: this.oBundle.getText("endTime"),
						enabled: {
							path: 'TimeData>Status',
							formatter: this.formatter.checkHrRecord.bind(this)
						}
					}),
					new sap.m.ObjectStatus({
						text: {
							path: 'TimeData>TimeEntryDataFields/STATUS',
							formatter: formatter.status
						},
						state: {
							path: 'TimeData>TimeEntryDataFields/STATUS',
							formatter: formatter.state
						}
					}),
					// ]}),
					new sap.m.Button({
						icon: {
							path: 'TimeData>TimeEntryDataFields/LONGTEXT',
							formatter: formatter.longtextButtons
						},
						type: sap.m.ButtonType.Transparent,
						press: this.longtextPopover.bind(this),
						enabled: {
							path: 'TimeData>Status',
							formatter: this.formatter.checkHrRecord.bind(this)
						}
					}),
					new sap.ui.layout.HorizontalLayout({
						content: [new sap.m.Button({
								icon: "sap-icon://sys-cancel",
								type: sap.m.ButtonType.Transparent,
								press: this.onOverviewDeleteRow.bind(this),
								visible: "{TimeData>deleteButton}",
								enabled: "{TimeData>deleteButtonEnable}"
							}),
							new sap.m.Button({
								icon: "sap-icon://add",
								type: sap.m.ButtonType.Transparent,
								press: this.onOverviewAddRow.bind(this),
								visible: "{TimeData>addButton}",
								enabled: "{TimeData>addButtonEnable}"
							})
						],
						visible: {
							path: 'TimeData>Status',
							formatter: this.formatter.checkHrRecord.bind(this)
						}
					})

				],
				customData: [new sap.ui.core.CustomData({
					key: "counter",
					value: "{TimeData>Counter}"
				})]
			});
			this.oEditableTemplate = this.getView().byId("timeDataTemplate");
			this.oEditableTemplate = this.oReadOnlyTemplate
			// this.rebindTable(this.oEditableTemplate, "Edit");
			this.rebindTableWithTemplate(this.oTable, "TimeData>/", this.oEditableTemplate, "Edit");*/
		},
		onSave: function () {

		},
		onSelectionDraft: function (oEvent) {
			var that = this;
			var oModel = this.oTable.getModel('TimeData');
			var index = parseInt(oEvent.getSource().getParent().getBindingContext('TimeData').getPath().split('/')[1]);
			var data = oModel.getData();
			var counter = oEvent.getSource().getParent().getCustomData('counter')[0].getValue();
			if (counter && counter !== null) {
				data[index].TimeEntryOperation = 'U';
			} else {
				data[index].TimeEntryOperation = 'C';
			}
			this.getModel("controls").setProperty("/isOverviewChanged", true);
			this.getModel("controls").setProperty("/overviewDataChanged", true);
		},
		onSelectionChange: function (oEvent) {
			var selectedKey = oEvent.getParameter('selectedItem').getKey();
			var selectedText = oEvent.getParameter('selectedItem').getText();

			if (oEvent.getParameter('selectedItem').getBindingContext('TasksWithGroups').getModel().getData()[parseInt(oEvent.getParameter(
					'selectedItem').getBindingContext('TasksWithGroups').getPath().split("/")[1])].Type === "group") {
				var entry;
				var oModel = this.getModel('TimeData');
				var oGroups = this.getModel('AssignmentGroups').getData();
				var data = oModel.getData();
				var index = parseInt(oEvent.getSource().getParent().getBindingContext('TimeData').getPath().split('/')[1]);
				var oSelectedGroup = $.grep(oGroups, function (element, ind) {
					return element.groupId === selectedKey;
				});
				for (var i = 0; i < oSelectedGroup[0].Assignments.length; i++) {
					var workdate = new Date(data[index].TimeEntryDataFields.WORKDATE);
					var hours = data[index].TimeEntryDataFields.CATSHOURS;
					var status = data[index].TimeEntryDataFields.STATUS;
					var startTime = data[index].TimeEntryDataFields.BEGUZ;
					var endTime = data[index].TimeEntryDataFields.ENDUZ;
					// delete data[index].TimeEntryDataFields;
					var taskdata = this.getModel('Tasks').getData();
					var task = $.grep(taskdata, function (element, ind) {
						return element.AssignmentId === oSelectedGroup[0].Assignments[i].AssignmentId;
					});
					if (i === 0) {
						data[index].TimeEntryDataFields = $.extend(true, {}, task[0].AssignmentFields);
						if (this.getModel('controls').getProperty('/approverAllowed')) {
							data[index].ApproverId = task[0].ApproverId;
						}
						data[index].AssignmentId = task[0].AssignmentId;
						data[index].AssignmentName = task[0].AssignmentName;
						data[index].TimeEntryDataFields
							.WORKDATE = workdate;
						data[index].TimeEntryDataFields.CATSHOURS = hours;
						data[index].TimeEntryDataFields.STATUS = status;
						data[
							index].TimeEntryDataFields.BEGUZ = startTime;
						data[index].TimeEntryDataFields.ENDUZ = endTime;
						// insert.AssignmentName = selectedText;
						// insert.AssignmentId = selectedKey;
						if (data[index].Counter && data[index].Counter !== null && data[index].Counter !== "") {
							data[index].TimeEntryOperation = 'U';
							data[index].deleteButtonEnable = true;
							// if (i == oSelectedGroup[0].Assignments.length - 1) {
							data[index].addButtonEnable = true;
							// }

						} else {
							data[index].TimeEntryOperation = 'C';
							data[index].Counter = "";
							data[index].deleteButtonEnable = true;
							// if (i == oSelectedGroup[0].Assignments.length - 1) {
							data[index].addButtonEnable = true;
							// }
						}
						data[index].highlight = sap.ui.core.MessageType.Information;
						data[index].HeaderData.highlight = sap.ui.core.MessageType.Information;
						data[
							index].HeaderData.addButton = true;
					} else {
						var insert = $.extend(true, {}, data[index]);
						insert.TimeEntryDataFields = $.extend(true, {}, task[0].AssignmentFields);
						if (this.getModel('controls').getProperty('/approverAllowed')) {
							insert.ApproverId = task[0].ApproverId;
						}
						insert.AssignmentId = task[0].AssignmentId;
						insert.AssignmentName = task[0].AssignmentName;
						insert.TimeEntryDataFields.WORKDATE = workdate;
						insert.TimeEntryDataFields.CATSHOURS = hours;
						insert.TimeEntryDataFields.STATUS = status;
						insert.TimeEntryDataFields.BEGUZ = startTime;
						insert.TimeEntryDataFields.ENDUZ = endTime;
						// insert.AssignmentName = selectedText;
						// insert.AssignmentId = selectedKey;
						// if (insert.Counter && insert.Counter !== null && insert.Counter !== "") {
						// 	insert.TimeEntryOperation = 'U';
						// 	insert.deleteButtonEnable = true;
						// 	if (i == oSelectedGroup[0].Assignments.length - 1) {
						// 		insert.addButtonEnable = true;
						// 	}

						// } else {
						insert.TimeEntryOperation = 'C';
						insert.Counter = "";
						insert.deleteButtonEnable = true;
						// if (i == oSelectedGroup[0].Assignments.length - 1) {
						insert.addButtonEnable = false;
						insert.addButton = false;
						// }
						// }
						insert.highlight = sap.ui.core.MessageType.Information;
						insert.HeaderData.highlight = sap.ui.core.MessageType.Information;
						insert.HeaderData.addButton = false;
						data.splice(index, 0, insert);
					}

				}
				var toastMsg = this.getModel("i18n").getResourceBundle().getText('groupImported');
				sap.m.MessageToast.show(toastMsg, {
					duration: 2000
				});
			} else {
				var entry;
				var oModel = this.getModel('TimeData');
				var data = oModel.getData();
				var index = parseInt(oEvent.getSource().getParent().getBindingContext('TimeData').getPath().split('/')[1]);
				var workdate = data[index].TimeEntryDataFields.WORKDATE;
				var hours = data[index].TimeEntryDataFields.CATSHOURS;
				var status = data[index].TimeEntryDataFields.STATUS;
				var startTime = data[index].TimeEntryDataFields.BEGUZ;
				var endTime = data[index].TimeEntryDataFields.ENDUZ;
				delete data[index].TimeEntryDataFields;
				var taskdata = this.getModel('Tasks').getData();
				var task = $.grep(taskdata, function (element, ind) {
					return element.AssignmentId === selectedKey;
				});
				data[index].TimeEntryDataFields = $.extend(true, {}, task[0].AssignmentFields);
				if (this.getModel('controls').getProperty('/approverAllowed')) {
					data[index].ApproverId = task[0].ApproverId;
				}
				data[index].TimeEntryDataFields.WORKDATE = workdate;
				data[index].TimeEntryDataFields.CATSHOURS = hours;
				data[index].TimeEntryDataFields.STATUS = status;
				data[index].TimeEntryDataFields.BEGUZ = startTime;
				data[index].TimeEntryDataFields.ENDUZ = endTime;
				data[index].AssignmentName = selectedText;
				data[index].AssignmentId = selectedKey;
				if (data[index].Counter && data[index].Counter !== null && data[index].Counter !== "") {
					data[index].TimeEntryOperation = 'U';
					data[index].deleteButtonEnable = true;
					data[index].addButtonEnable = true;
				} else {
					data[index].TimeEntryOperation = 'C';
					data[index].Counter = "";
					data[index].deleteButtonEnable = true;
					data[index].addButtonEnable = true;
				}
				// oModel.setData(data);
				// this.setModel(oModel, 'TimeData');
				//
			}
			var item = $.grep(this.oTable.getItems(), function (element, index) {
				if (!element.getAggregation('cells')) {
					return false;
				} else {
					return true;
				}
			});
			this.getModel("controls").setProperty("/isOverviewChanged", true);
			this.getModel("controls").setProperty("/overviewDataChanged", true);
			item[index].focus();
		},
		onSelectionChangeToDo: function (oEvent) {
			var selectedKey = oEvent.getParameter('selectedItem').getKey();
			var selectedText = oEvent.getParameter('selectedItem').getText();

			if (oEvent.getParameter('selectedItem').getBindingContext('TasksWithGroups').getModel().getData()[parseInt(oEvent.getParameter(
					'selectedItem').getBindingContext('TasksWithGroups').getPath().split("/")[1])].Type === "group") {
				var entry;
				var oModel = this.getModel('TodoList');
				var oGroups = this.getModel('AssignmentGroups').getData();
				var data = oModel.getData();
				var index = parseInt(oEvent.getSource().getParent().getBindingContext('TodoList').getPath().split('/')[1]);
				var oSelectedGroup = $.grep(oGroups, function (element, ind) {
					return element.groupId === selectedKey;
				});
				for (var i = 0; i < oSelectedGroup[0].Assignments.length; i++) {
					var workdate = new Date(data[index].TimeEntryDataFields.WORKDATE);
					var hours = data[index].TimeEntryDataFields.CATSHOURS;
					var status = data[index].TimeEntryDataFields.STATUS;
					var startTime = data[index].TimeEntryDataFields.BEGUZ;
					var endTime = data[index].TimeEntryDataFields.ENDUZ;
					// delete data[index].TimeEntryDataFields;
					var taskdata = this.getModel('Tasks').getData();
					var task = $.grep(taskdata, function (element, ind) {
						return element.AssignmentId === oSelectedGroup[0].Assignments[i].AssignmentId;
					});
					if (i === 0) {
						data[index].TimeEntryDataFields = $.extend(true, {}, task[0].AssignmentFields);
						if (this.getModel('controls').getProperty('/approverAllowed')) {
							data[index].ApproverId = task[0].ApproverId;
						}
						data[index].AssignmentId = task[0].AssignmentId;
						data[index].AssignmentName = task[0].AssignmentName;
						data[index].TimeEntryDataFields.WORKDATE = workdate;
						data[index].TimeEntryDataFields.CATSHOURS = hours;
						data[index].TimeEntryDataFields.STATUS = status;
						data[index].TimeEntryDataFields.BEGUZ = startTime;
						data[index].TimeEntryDataFields.ENDUZ = endTime;
						data[index].highlight = sap.ui.core.MessageType.Information;
						// insert.AssignmentName = selectedText;
						// insert.AssignmentId = selectedKey;
						if (data[index].Counter && data[index].Counter !== null && data[index].Counter !== "") {
							data[index].TimeEntryOperation = 'U';
							data[index].deleteButtonEnable = true;
							// if (i == oSelectedGroup[0].Assignments.length - 1) {
							data[index].addButtonEnable = true;
							// }

						} else {
							data[index].TimeEntryOperation = 'C';
							data[index].Counter = "";
							data[index].deleteButtonEnable = true;
							// if (i == oSelectedGroup[0].Assignments.length - 1) {
							data[index].addButtonEnable = true;
							// }
						}
					} else {
						var insert = $.extend(true, {}, data[index]);
						insert.TimeEntryDataFields = $.extend(true, {}, task[0].AssignmentFields);
						if (this.getModel('controls').getProperty('/approverAllowed')) {
							insert.ApproverId = task[0].ApproverId;
						}
						insert.AssignmentId = task[0].AssignmentId;
						insert.AssignmentName = task[0].AssignmentName;
						insert.TimeEntryDataFields.WORKDATE = workdate;
						insert.TimeEntryDataFields.CATSHOURS = hours;
						insert.TimeEntryDataFields.STATUS = status;
						insert.TimeEntryDataFields.BEGUZ = startTime;
						insert.TimeEntryDataFields.ENDUZ = endTime;
						insert.highlight = sap.ui.core.MessageType.Information;
						// insert.AssignmentName = selectedText;
						// insert.AssignmentId = selectedKey;
						insert.TimeEntryOperation = 'C';
						insert.Counter = "";
						insert.deleteButtonEnable = true;
						// if (i == oSelectedGroup[0].Assignments.length - 1) {
						// 	insert.addButtonEnable = true;
						// }
						insert.addButton = false;
						// insert.highlight = sap.ui.core.MessageType.Information;
						// insert.HeaderData.highlight = sap.ui.core.MessageType.Information;
						// insert.HeaderData.addButton = true;
						data.splice(index, 0, insert);
					}

				}
				var toastMsg = this.getModel("i18n").getResourceBundle().getText('groupImported');
				sap.m.MessageToast.show(toastMsg, {
					duration: 2000
				});
			} else {
				var entry;
				var oModel = this.getModel('TodoList');
				var data = oModel.getData();
				var index = parseInt(oEvent.getSource().getParent().getBindingContext('TodoList').getPath().split('/')[1]);
				var workdate = data[index].TimeEntryDataFields.WORKDATE;
				var hours = data[index].TimeEntryDataFields.CATSHOURS;
				var status = data[index].TimeEntryDataFields.STATUS;
				var startTime = data[index].TimeEntryDataFields.BEGUZ;
				var endTime = data[index].TimeEntryDataFields.ENDUZ;
				delete data[index].TimeEntryDataFields;
				var taskdata = this.getModel('Tasks').getData();
				var task = $.grep(taskdata, function (element, ind) {
					return element.AssignmentId === selectedKey;
				});
				data[index].TimeEntryDataFields = $.extend(true, {}, task[0].AssignmentFields);
				if (this.getModel('controls').getProperty('/approverAllowed')) {
					data[index].ApproverId = task[0].ApproverId;
				}
				data[index].TimeEntryDataFields.WORKDATE = workdate;
				data[index].TimeEntryDataFields.CATSHOURS = hours;
				data[index].TimeEntryDataFields.STATUS = status;
				data[index].TimeEntryDataFields.BEGUZ = startTime;
				data[index].TimeEntryDataFields.ENDUZ = endTime;
				data[index].highlight = sap.ui.core.MessageType.Information;
				data[index].AssignmentName = selectedText;
				data[index].AssignmentId = selectedKey;
				if (data[index].Counter && data[index].Counter !== null && data[index].Counter !== "") {
					data[index].TimeEntryOperation = 'U';
					data[index].deleteButtonEnable = true;
					data[index].addButtonEnable = true;
				} else {
					data[index].TimeEntryOperation = 'C';
					data[index].Counter = "";
					data[index].deleteButtonEnable = true;
					data[index].addButtonEnable = true;
				}
				oModel.setData(data);
				this.setModel(oModel, 'TodoList');
			}
			var item = $.grep(this.oToDoTable.getItems(), function (element, index) {
				if (!element.getAggregation('cells')) {
					return false;
				} else {
					return true;
				}
			});
			this.getModel("controls").setProperty("/isToDoChanged", true);
			this.getModel("controls").setProperty("/todoDataChanged", true);
			item[index].focus();
		},
		onOverviewDeleteRow: function (oEvent) {
			var that = this;
			this.oTable.setBusy(true);
			var counter = oEvent.getSource().getParent().getParent().getCustomData('counter')[0].getValue();
			var oModel = this.getModel('TimeData');
			var data = oModel.getData();
			this.setModel(oModel, 'OriginalTime');
			var index = parseInt(oEvent.getSource().getParent().getBindingContext('TimeData').getPath().split('/')[1]);
			var deleteRow = $.extend(true, {}, data[index]);
			var delModel = this.getModel('deleteRecords');
			var deleteArray = this.getModel('deleteRecords').getData();
			var recordTemplate = this.recordTemplate();
			if (data[index].Counter && data[index].Counter != null) {
				if (deleteArray.length) {
					deleteArray.push(deleteRow);
					delModel.setData(deleteArray);
				} else {
					delModel.setData([deleteRow]);
				}
				this.setModel(delModel, 'deleteRecords');
			}
			var otherRecords = $.grep(data, function (element, ind) {
				return that.oFormatyyyymmdd.format(new Date(element.TimeEntryDataFields.WORKDATE)) === that.oFormatyyyymmdd.format(new Date(
					data[
						index].TimeEntryDataFields
					.WORKDATE)) && element.Status !== '99';
			});
			var date = that.oFormatyyyymmdd.format(new Date(data[
					index].TimeEntryDataFields
				.WORKDATE));
			if (otherRecords.length >= 2) {
				data.splice(index, 1);
				var otherRecords = $.grep(data, function (element, ind) {
					return that.oFormatyyyymmdd.format(new Date(element.TimeEntryDataFields.WORKDATE)) === date && element.Status !== '99';
				});
				otherRecords[otherRecords.length - 1].addButtonEnable = true;
				otherRecords[otherRecords.length - 1].addButton = true;
				otherRecords[otherRecords.length - 1].HeaderData.addButton = true;
				data = this.calculateSum(new Date(otherRecords[otherRecords.length - 1].TimeEntryDataFields.WORKDATE), data);
				oModel.setData(data);
				this.setModel(oModel, 'TimeData');
			} else {
				var recordTemplate = this.recordTemplate();
				data[index].AssignmentId = "";
				data[index].AssignmentName = "";
				data[index].addButton = true;
				data[index].deleteButtonEnable = false;
				data[index].addButtonEnable = false;
				data[index].SetDraft = false;
				data[index].HeaderData.addButton = true;
				data[index].Counter = "";
				Object.getOwnPropertyNames(data[index].TimeEntryDataFields).forEach(function (prop) {
					if (prop == "WORKDATE") {} else {
						data[index].TimeEntryDataFields[prop] = recordTemplate.TimeEntryDataFields[prop];
					}
				});
				data = this.calculateSum(new Date(data[index].TimeEntryDataFields.WORKDATE), data);
				oModel.setData(data);
				this.setModel(oModel, 'TimeData');
			}
			this.getModel("controls").setProperty("/isOverviewChanged", true);
			this.getModel("controls").setProperty("/overviewDataChanged", true);
			this.oTable.setBusy(false);
			var item = $.grep(this.oTable.getItems(), function (element, index) {
				if (!element.getAggregation('cells')) {
					return false;
				} else {
					return true;
				}
			});
			item[index].focus();
		},

		onOverviewAddRow: function (oEvent) {
			this.oTable.setBusy(true);
			var newRecord = this.recordTemplate();
			var oControls = this.getModel("controls");
			var counter = oEvent.getSource().getParent().getParent().getCustomData('counter')[0].getValue();
			var oModel = this.getModel('TimeData');
			var index = parseInt(oEvent.getSource().getParent().getBindingContext('TimeData').getPath().split('/')[1]);
			var data = oModel.getData();
			data[index].addButton = false;
			var insert = $.extend(true, {}, newRecord);
			insert.totalHours = data[index].totalHours;
			insert.TimeEntryDataFields.WORKDATE = new Date(data[index].TimeEntryDataFields.WORKDATE);
			insert.target = data[index].target;
			insert.HeaderData = $.extend(true, {}, data[index].HeaderData);
			data[index].HeaderData.addButton = false;
			insert.highlight = sap.ui.core.MessageType.Information;
			insert.HeaderData.highlight = true;
			insert.HeaderData.addButton = true;
			insert.addButton = true;
			data.splice(index + 1, 0, insert);
			oModel.setData(data);
			this.setModel(oModel, 'TimeData');
			this.getModel("controls").setProperty("/isOverviewChanged", true);
			this.getModel("controls").setProperty("/overviewDataChanged", true);
			var item = $.grep(this.oTable.getItems(), function (element, index) {
				if (!element.getAggregation('cells')) {
					return false;
				} else {
					return true;
				}
			});
			item[index + 1].focus();
			this.oTable.setBusy(false);
		},
		onTodoAddRow: function (oEvent) {
			this.oToDoTable.setBusy(true);
			var newRecord = this.recordTemplate();
			var counter = oEvent.getSource().getParent().getParent().getCustomData('counter')[0].getValue();
			var oModel = this.getModel('TodoList');
			var index = parseInt(oEvent.getSource().getParent().getBindingContext('TodoList').getPath().split('/')[1]);
			var data = oModel.getData();
			data[index].addButton = false;
			var insert = $.extend(true, {}, data[index]);
			insert.TimeEntryDataFields = newRecord.TimeEntryDataFields;
			insert.TimeEntryDataFields.WORKDATE = new Date(data[index].TimeEntryDataFields.WORKDATE);
			insert.AssignmentId = "";
			insert.AssignmentName = "";
			insert.TimeEntryDataFields.CATSHOURS = "0.00";
			insert.TimeEntryDataFields.STATUS = "";
			insert.Counter = "";
			insert.highlight = sap.ui.core.MessageType.Information;
			// insert.total = parseFloat(0.00).toFixed(2);
			insert.addButton = true;
			data.splice(index + 1, 0, insert);
			oModel.setData(data);
			this.setModel(oModel, 'TodoList');
			this.getModel("controls").setProperty("/isToDoChanged", true);
			this.getModel("controls").setProperty("/todoDataChanged", true);
			this.oToDoTable.setBusy(false);
			var item = $.grep(this.oToDoTable.getItems(), function (element, index) {
				if (!element.getAggregation('cells')) {
					return false;
				} else {
					return true;
				}
			});
			item[index + 1].focus();

		},
		onTodoDeleteRow: function (oEvent) {
			var that = this;
			this.oToDoTable.setBusy(true);
			var counter = oEvent.getSource().getParent().getParent().getCustomData('counter')[0].getValue();
			var oModel = this.getModel('TodoList');
			var data = oModel.getData();
			this.setModel(oModel, 'OriginalTodoTime');
			var index = parseInt(oEvent.getSource().getParent().getBindingContext('TodoList').getPath().split('/')[1]);
			var deleteRow = $.extend(true, {}, data[index]);
			var delModel = this.getModel('deleteRecords');
			var deleteArray = this.getModel('deleteRecords').getData();
			var recordTemplate = this.recordTemplate();
			// if (data[index].Counter && data[index].Counter != null) {
			// 	if (deleteArray.length) {
			// 		deleteArray.push(deleteRow);
			// 		delModel.setData(deleteArray);
			// 	} else {
			// 		delModel.setData([deleteRow]);
			// 	}
			// 	this.setModel(delModel, 'deleteRecords');
			// }
			var otherRecords = $.grep(data, function (element, ind) {
				return that.oFormatyyyymmdd.format(new Date(element.TimeEntryDataFields.WORKDATE)) === that.oFormatyyyymmdd.format(new Date(
					data[
						index].TimeEntryDataFields
					.WORKDATE));
			});
			var date = that.oFormatyyyymmdd.format(new Date(data[
					index].TimeEntryDataFields
				.WORKDATE));
			if (otherRecords.length >= 2) {
				// if(index!==0 && index > 0 ){
				// data[index-1].addButtonEnable = true;
				// data[index-1].addButton = true;	
				// }
				data.splice(index, 1);
				var otherRecords = $.grep(data, function (element, ind) {
					return that.oFormatyyyymmdd.format(new Date(element.TimeEntryDataFields.WORKDATE)) === date;
				});
				otherRecords[otherRecords.length - 1].addButtonEnable = true;
				otherRecords[otherRecords.length - 1].addButton = true;
				data = this.calculateSumToDo(new Date(otherRecords[otherRecords.length - 1].TimeEntryDataFields.WORKDATE), data);
				oModel.setData(data);
				this.setModel(oModel, 'TodoList');
			} else {
				data[index].AssignmentId = "";
				data[index].AssignmentName = "";
				data[index].addButton = true;
				data[index].addButtonEnable = true;
				Object.getOwnPropertyNames(data[index].TimeEntryDataFields).forEach(function (prop) {
					if (prop == "WORKDATE") {} else {
						data[index].TimeEntryDataFields[prop] = recordTemplate.TimeEntryDataFields[prop];
					}
				});
				data = this.calculateSumToDo(new Date(data[index].TimeEntryDataFields.WORKDATE), data);
				oModel.setData(data);
				this.setModel(oModel, 'TodoList');
			}
			this.getModel("controls").setProperty("/isToDoChanged", true);
			this.getModel("controls").setProperty("/todoDataChanged", true);
			this.oToDoTable.setBusy(false);
			var item = $.grep(this.oToDoTable.getItems(), function (element, index) {
				if (!element.getAggregation('cells')) {
					return false;
				} else {
					return true;
				}
			});
			if (item.length > 0) {
				item[index].focus();
			}
		},
		liveChangeHours: function (oEvent) {
			var val = /^\d+(\.\d{1,2})?$/;
			this.getModel("controls").setProperty("/isOverviewChanged", true);
			this.getModel("controls").setProperty("/overviewDataChanged", true);
			// if (!isNaN(parseFloat(oEvent.getSource().getValue()))) {
			if (val.test(oEvent.getSource().getValue())) {
				var counter = oEvent.getSource().getParent().getParent().getCustomData('counter')[0].getValue();
				// var oModel = this.getModel('TimeData');
				var oModel = this.oTable.getModel('TimeData');
				var index = parseInt(oEvent.getSource().getParent().getParent().getBindingContext('TimeData').getPath().split('/')[1]);
				var data = oModel.getData();
				if (counter && counter !== null) {
					data[index].TimeEntryOperation = 'U';
					data[index].TimeEntryDataFields.CATSHOURS = parseFloat(oEvent.getSource().getValue()).toFixed(2);
				} else {
					data[index].TimeEntryOperation = 'C';
					data[index].TimeEntryDataFields.CATSHOURS = parseFloat(oEvent.getSource().getValue()).toFixed(2);
				}
				data = this.calculateSum(new Date(data[index].TimeEntryDataFields.WORKDATE), data);
				this.setModel(new JSONModel(data), 'TimeData');
				var item = $.grep(this.oTable.getItems(), function (element, index) {
					if (!element.getAggregation('cells')) {
						return false;
					} else {
						return true;
					}
				});
				item[index].focus();

			}

		},
		checkTimeEntry: function (oSource, oAssignmentId, hours, starttime, endtime, workdate, counter) {
			var that = this;
			var obj = null;
			if (counter && counter !== null) {
				obj = {
					'AssignmentId': oAssignmentId,
					'CatsHours': hours,
					'Counter': counter,
					'EndTime': endtime,
					'Operation': "U",
					'StartTime': starttime,
					'WorkDate': workdate
				};
			} else {
				obj = {
					'AssignmentId': oAssignmentId,
					'CatsHours': hours,
					'Counter': counter,
					'EndTime': endtime,
					'Operation': "C",
					'StartTime': starttime,
					'WorkDate': workdate
				};
			}
			var mParameters = {
				// urlParameters: 'AssignmentId='+oAssignmentId+'&CatsHours='+hours+'m&Counter='+counter+'&EndTime='+endtime+'&Operation=C&StartTime='+starttime+'&WorkDate=datetime'+"'"+workdate"'",
				urlParameters: obj,
				success: function (oData, oResponse) {
					if (oData.results.length >= 1) {
						oSource.setValueState("Warning");
						oSource.setValueStateText(oData.results[0].Text);
					}

				},
				error: function (oError) {
					that.oErrorHandler.processError(oError);
				}
			};
			this.oDataModel.callFunction('/CheckTimesheet', mParameters);
		},
		calculateChangeCount: function () {
			return;
/*			var data = this.getModel('TimeData').getData();
			var controls = this.getModel('controls').getData();
			var newRecords = $.grep(data, function (element, index) {
				return element.TimeEntryOperation == 'C';
			});
			var updateRecords = $.grep(data, function (element, index) {
				return element.TimeEntryOperation == 'U';
			});
			var selectedRecords = $.grep(data, function (element, index) {
				return element.TimeEntryOperation == 'R';
			});
			if (selectedRecords.length > 0) {
				controls.numberOfRecords = selectedRecords.length;
			} else {
				controls.numberOfRecords = newRecords.length + updateRecords.length;
			}
			this.getModel('controls').setData(controls);*/
		},
		calculateSum: function (oDate, data) {
			var that = this;
			var sum = parseFloat(0);
			oDate = this.oFormatyyyymmdd.format(oDate);
			var element = $.grep(data, function (element, index) {
				return that.oFormatyyyymmdd.format(new Date(element.TimeEntryDataFields.WORKDATE)) == oDate;
			});
			for (var i = 0; i < element.length; i++) {
				if (element[i].TimeEntryDataFields.STATUS !== '10' && element[i].TimeEntryDataFields.STATUS !== '40') {
					sum = (parseFloat(sum) + parseFloat(element[i].TimeEntryDataFields.CATSHOURS)).toFixed(2);
				}
			}
			for (var j = 0; j < data.length; j++) {
				if (that.oFormatyyyymmdd.format(new Date(data[j].TimeEntryDataFields.WORKDATE)) === oDate) {
					data[j].totalHours = sum;
					data[j].HeaderData.sum = sum;
				}
			}
			return data;

		},
		calculateSumToDo: function (oDate, data) {
			var that = this;
			var sum = parseFloat(0);
			oDate = this.oFormatyyyymmdd.format(oDate);
			var element = $.grep(data, function (element, index) {
				return that.oFormatyyyymmdd.format(new Date(element.TimeEntryDataFields.WORKDATE)) == oDate;
			});
			var total = ((parseFloat(element[0].target) - parseFloat(element[0].missing))).toFixed(2);
			for (var i = 0; i < element.length; i++) {
				if (element[i].TimeEntryDataFields.STATUS !== '10' && element[i].TimeEntryDataFields.STATUS !== '40') {
					sum = (parseFloat(sum) + parseFloat(element[i].TimeEntryDataFields.CATSHOURS)).toFixed(2);
				}
			}
			for (var j = 0; j < data.length; j++) {
				if (that.oFormatyyyymmdd.format(new Date(data[j].TimeEntryDataFields.WORKDATE)) === oDate) {
					data[j].total = (parseFloat(sum) + parseFloat(total)).toFixed(2);
					data[j].currentMissing = ((parseFloat(data[j].target)) - parseFloat(data[j].total)) < 0 ? parseFloat(0).toFixed(2) : ((
						parseFloat(
							data[j].target)) - parseFloat(data[j].total)).toFixed(2);
				}
			}
			return data;

		},
		onCancel: function () {
			var that = this;
			var oControl = this.getModel('controls');
			oControl.setProperty('/duplicateVisibility', false);
			oControl.setProperty('/duplicateWeekVisibility', false);
			oControl.setProperty('/overviewEdit', true);
			oControl.setProperty('/overviewEditable', false);
			oControl.setProperty('/onEdit', "None");
			oControl.setProperty('/showFooter', false);
			oControl.setProperty('/overviewDataChanged', false);
			oControl.setProperty('/isOverviewChanged', false);
			that.bindTable(new Date(that.startdate), new Date(that.enddate));
			// this.rebindTable(this.oReadOnlyTemplate, "Navigation");
			//this.rebindTableWithTemplate(this.oTable, "TimeData>/", this.oReadOnlyTemplate, "Navigation");
			//TODO
			var data = {};
			var oModel = new JSONModel();
			oModel.setData(data);
			this.setModel(oModel, 'deleteRecords');
			this.setModel(oModel, 'changedRecords');
			this.setModel(oModel, 'newRecords');
			this.setModel(oControl, "controls");
			sap.ui.getCore().getMessageManager().removeAllMessages();
			// this.rebindTable(this.readTemplate, "Navigation");
		},
		onTodoCancel: function () {
			var oControl = this.getModel('controls');
			// oControl.setProperty('/todoCancel', false);
			// oControl.setProperty('/todoDone', false);
			oControl.setProperty('/editTodoVisibility', true);
			oControl.setProperty('/showFooter', false);          
			var oModel = new JSONModel($.extend(true, [], this.todolist));
			this.setModel(oModel, "TodoList");
			if (this.oReadOnlyToDoTemplate) {
				this.rebindTableWithTemplate(this.oToDoTable, "TodoList>/", this.oReadOnlyToDoTemplate, "Navigation");
			}
			sap.ui.getCore().getMessageManager().removeAllMessages();
		},
		rebindTable: function (oTemplate, sKeyboardMode) {
			return;
/*			this.oTable.bindItems({
				path: "TimeData>/",
				template: oTemplate,

				templateShareable: true
			}).setKeyboardMode(sKeyboardMode);*/
		},
		rebindTableWithTemplate: function (oTable, sPath, oTemplate, sKeyboardMode) {
			return;
			/*if (sPath === 'TimeData>/' && sap.ui.Device.system.phone === false) {
				oTable.bindItems({
					path: sPath,
					sorter: [
						new sap.ui.model.Sorter("Awart", false),
						new sap.ui.model.Sorter("Rproj", false)
					],
					template: oTemplate,
					templateShareable: true
					//groupHeaderFactory: this.getGroupHeader.bind(this)
				}).setKeyboardMode(sKeyboardMode);
			} else if (sPath === 'TimeData>/' && sap.ui.Device.system.phone === true) {
				oTable.bindItems({
					path: sPath,
					//sorter: [new sap.ui.model.Sorter("TimeEntryDataFields/WORKDATE", false, false)
						// , new sap.ui.model.Sorter(
						// 	"TimeEntryDataFields/CATSHOURS", true, false)
					//],
					template: oTemplate,
					templateShareable: true,
					// groupHeaderFactory: this.getGroupHeader
				}).setKeyboardMode(sKeyboardMode);
			} else if (sPath === 'TodoList>/') {
				oTable.bindItems({
					path: sPath,
					template: oTemplate,
					templateShareable: true
				}).setKeyboardMode(sKeyboardMode);
			}*/
		},
		compareRows: function (a, b) {
			if (new Date(a.date) > new Date(b.date)) {
				return 1;
			} else if (new Date(b.date) > new Date(a.date)) {
				return -1;
			} else {
				if (a.addButton == true && b.addButton == true) {
					return 0;
				} else if (b.addButton == true) {
					return -1;
				} else if (a.addButton == true) {
					return 1;
				} else if (a.highlight == true && b.highlight == true) {
					return 0;
				} else if (a.highlight == true) {
					return 1;
				} else if (b.highlight == true) {
					return -1;
				}
			}
		},

		loadTasks: function () {
			return new sap.ui.core.Item({
				key: "{Tasks>AssignmentName}",
				text: "{Tasks>AssignmentName}"
			});
		},
		onTaskCreate: function (oEvent) {
			var that = this;
			that.byId("idTasks").setBusy(true);
			var oView = this.getView();
			var formElements = [];
			var formContainers = [];
			var form = {
				name: null,
				status: false,
				containers: null
			};
			var oControl = this.getModel("controls");
			oControl.setProperty('/createAssignment', true);
			oControl.setProperty('/editAssignment', false);
			oControl.setProperty('/copyAssignment', false);
			oControl.setProperty('/displayAssignment', false);
			oControl.setProperty('/editAssignmentCancel', true);
			oControl.setProperty('/displayAssignmentCancel', false);
			oControl.setProperty('/assignmentTitle', this.oBundle.getText("createAssignment"));
			this.setGlobalModel(oControl, "controls");
			this.setGlobalModel(oControl, "controls");
			// var selectedTask = oTable.getSelectedItem().getAggregation('cells');
			var profileFields = $.extend(true, [], this.getModel('ProfileFields').getData());

			var oModel = new JSONModel();
			for (var i = 0; i < profileFields.length; i++) {
				// var obj = $.grep(data, function(element, index) {
				// 	return element.FieldName == selectedTask[i].getCustomData('FieldName')[0].getValue();
				// });
				if (profileFields[i].FieldName !== "AssignmentName" && profileFields[i].FieldName !== "ValidityStartDate" && profileFields[i].FieldName !==
					"ValidityEndDate") {
					formElements.push(profileFields[i]);
				}
				if (((formElements.length + 1) % 5) === 0 || i === (profileFields.length - 1)) {
					formContainers.push({
						form: $.extend(formElements, [], true)
					});
					formElements = [];
				}
			}
			form.containers = formContainers;
			// form.formElements = formElements;
			oModel.setData(form);
			this.setGlobalModel(oModel, "EditedTask");
			that.byId("idTasks").setBusy(false);
			this.getRouter().navTo("editAssignment", {}, false);
		},
		//delete confirmation added 
		// Note 2890326 Starts
		onTaskDeleteConfirm: function (oEvent) {
			var that = this;
			var messageHeader = that.oBundle.getText("confirmationDeleteAssignment");
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			sap.m.MessageBox.warning(
				messageHeader, {
					title: that.oBundle.getText("delete"),
					actions: [sap.m.MessageBox.Action.DELETE, sap.m.MessageBox.Action.CANCEL],
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					onClose: function (sAction) {
						if (sAction === "DELETE") {
							that.onTaskDelete();
						}
					}
				}
			);
		},
		//Note 2890326 Ends
		onTaskDelete: function (oEvent) {
			var that = this;
			this.showBusy();
			var oTable = this.byId('idTasks');
			var data = this.getModel('Tasks').getData();
			var selectedItems = oTable.getSelectedItems();
			var deleteEntries = [];
			for (var i = 0; i < selectedItems.length; i++) {
				var selectedTask = selectedItems[i].getAggregation('cells');
				var AssignmentId = selectedTask[0].getAggregation('customData')[1].getValue();
				var index = selectedItems[i].getBindingContext('TaskFields').getPath().split("/")[1];
				delete data[index].ToGrps;
				data[index].ValidityStartDate = this.oFormatYyyymmdd.format(new Date(data[index].ValidityStartDate)) + "T00:00:00";
				data[index].ValidityEndDate = this.oFormatYyyymmdd.format(new Date(data[index].ValidityEndDate)) + "T00:00:00";
				var oData = $.extend(true, {}, data[index]);
				oData.AssignmentOperation = "D";
				deleteEntries.push(oData);
			}
			var oModel = $.extend(true, {}, this.oDataModel);
			oModel.setChangeBatchGroups({
				"*": {
					groupId: "TimeEntry",
					changeSetId: "TimeEntry",
					single: false
				}
			});
			oModel.setDeferredGroups(["TimeEntry"]);
			oModel
				.refreshSecurityToken(
					function (oData) {
						for (var i = 0; i < deleteEntries.length; i++) {
							var obj = {
								properties: deleteEntries[i],
								changeSetId: "TimeEntry",
								groupId: "TimeEntry"
							};
							oModel
								.createEntry(
									"/AssignmentCollection",
									obj);
						}
						oModel.submitChanges({
							groupId: "TimeEntry",
							changeSetId: "TimeEntry",
							success: function (oData, res) {
								if (!oData.__batchResponses[0].__changeResponses) {
									// for (var i=0; i<that.batches.length;i++){
									// 	that.batches[i].TimeEntryDataFields.WORKDATE = new Date(that.batches[i].TimeEntryDataFields.WORKDATE);
									// }
									that.hideBusy(true);
									return;
								}
								var toastMsg = that.oBundle.getText("tasksDeletedSuccessfully");
								sap.m.MessageToast.show(toastMsg, {
									duration: 1000
								});
								that.getTasks(false);
								that.hideBusy(true);
							},
							error: function (oError) {
								that.hideBusy(true);
								that.oErrorHandler.processError(oError);
							}
						});

					}, true);
			that.hideBusy(true);
		},

		onTaskEdit: function (oEvent) {
			var that = this;
			that.byId("idTasks").setBusy(true);
			var oView = this.getView();
			var oTable = this.byId('idTasks');
			var oModel = new JSONModel();
			var data = this.getModel('ProfileFields').getData();
			var tasks = this.getModel('Tasks').getData();
			var index = oTable.getSelectedItem().getBindingContext('TaskFields').getPath().split("/")[1];
			var formElements = [];
			var formContainers = [];
			var form = {
				name: null,
				status: false,
				containers: null
			};
			var oControl = this.getModel("controls");
			oControl.setProperty('/createAssignment', false);
			oControl.setProperty('/editAssignment', true);
			oControl.setProperty('/editAssignmentCancel', true);
			oControl.setProperty('/displayAssignment', false);
			oControl.setProperty('/displayAssignmentCancel', false);
			oControl.setProperty('/copyAssignment', false);
			oControl.setProperty('/assignmentTitle', this.oBundle.getText("editAssignment"));
			this.setGlobalModel(oControl, "controls");
			var selectedTask = oTable.getSelectedItem().getAggregation('cells');
			var profileFields = $.extend(true, [], this.getModel('ProfileFields').getData());
			for (var i = 0; i < selectedTask.length; i++) {
				var obj = $.grep(data, function (element, index) {
					return element.FieldName == selectedTask[i].getCustomData('FieldName')[0].getValue();
				});
				if (selectedTask[i].getCustomData('FieldName')[0].getValue() !== "AssignmentStatus" && selectedTask[i].getCustomData(
						'FieldName')[
						0].getValue() !== "AssignmentName" && selectedTask[i].getCustomData('FieldName')[
						0].getValue() !== "ValidityStartDate" && selectedTask[i].getCustomData('FieldName')[
						0].getValue() !== "ValidityEndDate") {
					if (tasks[index].AssignmentFields[selectedTask[i].getCustomData('FieldName')[0].getValue()] !== undefined) {
						obj[0].FieldValue = tasks[index].AssignmentFields[selectedTask[i].getCustomData('FieldName')[0].getValue()];
					}
					obj[0].AssignmentId = selectedTask[i].getAggregation('customData')[1].getValue();
				} else {
					if (selectedTask[i].getCustomData('FieldName')[0].getValue() === "AssignmentStatus") {
						obj[0].FieldValue = selectedTask[i].getAggregation('customData')[2].getValue();
						obj[0].AssignmentId = selectedTask[i].getAggregation('customData')[1].getValue();
					} else if (selectedTask[i].getCustomData('FieldName')[0].getValue() === "AssignmentName") {
						obj[0].FieldValue = selectedTask[i].getText();
						obj[0].AssignmentId = selectedTask[i].getAggregation('customData')[1].getValue();
					} else if (selectedTask[i].getCustomData('FieldName')[0].getValue() === "ValidityStartDate") {
						obj[0].FieldValue = selectedTask[i].getText();
						obj[0].AssignmentId = selectedTask[i].getAggregation('customData')[1].getValue();
					} else if (selectedTask[i].getCustomData('FieldName')[0].getValue() === "ValidityEndDate") {
						obj[0].FieldValue = selectedTask[i].getText();
						obj[0].AssignmentId = selectedTask[i].getAggregation('customData')[1].getValue();
					}
				}
				if (selectedTask[i].getCustomData('FieldName')[0].getValue() !== "AssignmentName" && selectedTask[i].getCustomData('FieldName')[
						0]
					.getValue() !== "AssignmentStatus" && selectedTask[i].getCustomData('FieldName')[
						0].getValue() !== "ValidityStartDate" && selectedTask[i].getCustomData('FieldName')[
						0].getValue() !== "ValidityEndDate") {
					formElements.push(obj[0]);
				} else {
					if (selectedTask[i].getCustomData('FieldName')[0].getValue() === "AssignmentName") {
						form.name = obj[0].FieldValue;
					} else if (selectedTask[i].getCustomData('FieldName')[0].getValue() === "AssignmentStatus") {
						form.status = obj[0].FieldValue;
					} else if (selectedTask[i].getCustomData('FieldName')[0].getValue() === "ValidityStartDate") {
						form.validFrom = new Date(obj[0].FieldValue);
					} else if (selectedTask[i].getCustomData('FieldName')[0].getValue() === "ValidityEndDate") {
						form.validTo = new Date(obj[0].FieldValue);
					}
				}
				if (((formElements.length + 1) % 5) === 0 || i === (selectedTask.length - 1)) {
					formContainers.push({
						form: $.extend(formElements, [], true)
					});
					formElements = [];
				}
			}
			form.containers = formContainers;
			oModel.setData(form);
			this.setGlobalModel(oModel, "EditedTask");

			that.byId("idTasks").setBusy(false);
			this.getRouter().navTo("editAssignment", {}, false);
		},
		onTaskSelection: function (oEvent) {
			var oControl = this.getModel("controls");
			// var oSelectedItems = oEvent.getParameter("selectedContexts");
			if (oEvent.getParameters().listItem.getSelected() === true && this.oTaskTable.getSelectedItems().length == 1) {
				oControl.setProperty("/taskEdit", true);
				oControl.setProperty("/taskDelete", true);
				oControl.setProperty("/taskCopy", true);
				oControl.setProperty("/createGroupButton", true);
			} else if (this.oTaskTable.getSelectedItems().length == 1) {
				oControl.setProperty("/taskEdit", true);
				oControl.setProperty("/taskDelete", true);
				oControl.setProperty("/taskCopy", true);
				oControl.setProperty("/createGroupButton", true);
			} else {
				oControl.setProperty("/taskEdit", false);
				oControl.setProperty("/taskDelete", true);
				oControl.setProperty("/taskCopy", false);
				oControl.setProperty("/createGroupButton", true);
			}
		},
		deleteSelectedDays: function (oEvent) {
			var index = oEvent.getParameters().listItem.getBindingContext('selectedDatesDup').getPath().split('/selectedDates/')[1];
			var data = this.getModel('selectedDatesDup').getData();
			// this.byId("duplicateCalendar").removeSelectedDate(new sap.ui.unified.DateRange({startDate:data.selectedDates[index].Date}));
			// this.byId("mDuplicateCalendar").removeSelectedDate(new sap.ui.unified.DateRange({startDate:data.selectedDates[index].Date}));
			this.byId("duplicateCalendar").removeAllSelectedDates();
			this.byId("mDuplicateCalendar").removeAllSelectedDates();
			delete data.selectedDates[index].Date;
			data.selectedDates.splice(index, 1);
			for (var i = 0; i < data.selectedDates.length; i++) {
				this.byId("duplicateCalendar").addSelectedDate(new sap.ui.unified.DateRange({
					startDate: data.selectedDates[i].Date
				}));
				this.byId("mDuplicateCalendar").addSelectedDate(new sap.ui.unified.DateRange({
					startDate: data.selectedDates[i].Date
				}));
			}
			var oModel = new JSONModel(data);
			this.setModel(oModel, 'selectedDatesDup');
			if (this.getModel("selectedDatesDup")) {
				if (this.getModel("selectedDatesDup").getData().selectedDates.length >= 1 &&
					this.getModel("TimeDataDuplicateTask").getData().length >= 1) {
					this.getModel("controls").setProperty("/duplicateTaskButtonEnable", true);
				} else {
					this.getModel("controls").setProperty("/duplicateTaskButtonEnable", false);
				}
			}
		},
		onDuplicateTask: function (oEvent) {
			var that = this;
			var oView = this.getView();
			var oTable = this.byId('idTasks');
			var oModel = new JSONModel();
			var oDialog;
			var oDialogController = {
				handleCancel: function () {
					oDialog.close();
					oDialog.destroy();
					this.setModel(new JSONModel({
						selectedDates: []
					}), "selectedDatesDup");
					this.setModel(new JSONModel([]), "TimeDataDuplicateTask");
					this.getModel("controls").setProperty("/duplicateTaskButtonEnable", false);
				}.bind(this),
				onSelect: this.handleDupTaskCalendarSelect.bind(this),
				onDelete: this.deleteSelectedDays.bind(this),
				onOverviewSelect: this.onOverviewSelectDup.bind(this),
				handleConfirm: function () {
					var sucess = this.handleDuplicateTaskConfirm();
					if (sucess) {
						oDialog.close();
						oDialog.destroy();
						this.calendar.removeAllSelectedDates();
						this.setModel(new JSONModel({
							selectedDates: []
						}), "selectedDatesDup");
						this.setModel(new JSONModel([]), "TimeDataDuplicateTask");
						var toastMsg = that.oBundle.getText("duplicatedSuccessfully");
						sap.m.MessageToast.show(toastMsg, {
							duration: 3000
						});
						this.getModel("controls").setProperty("/overviewDataChanged", true);
						this.getModel("controls").setProperty("/isOverviewChanged", true);
						this.getModel("controls").setProperty("/duplicateTaskButtonEnable", false);
					}

				}.bind(this),
				dayOfWeek: this.formatter.dayOfWeek.bind(this),

			};
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "hcm.fab.mytimesheet.view.fragments.DuplicateTask", oDialogController);
				// oDialog.bindElement('TimeDataDuplicateTask>/0');
				// connect dialog to view (models, lifecycle)
				oView.addDependent(oDialog);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), oDialog);

			jQuery.sap.delayedCall(0, this, function () {
				oDialog.open();
			});

		},
		onDuplicateWeek: function (oEvent) {
			var that = this;
			this.oTimeTable.setBusy(true);
			this.oTimeTable.destroyItems();
			var oStartDate = this.startdate.previous().monday();
			var oEndDate = this.enddate.previous().sunday();
			oStartDate.setHours(5);
			oEndDate.setHours(5);
			this.getModel("VH").read("/TimeEntries", {
				filters:[
				    new Filter({
				      path: "StartDate",
				      operator: FilterOperator.EQ,
				      value1: oStartDate
				    }),
				    new Filter({
				      path: "EndDate",
				      operator: FilterOperator.EQ,
				      value1: oEndDate
				    }),
				],
				success: function(oData,oContext){
					
					var oModel = that.getModel("json");
					
					var oTimeModel = that.getModel("time");
					
					var oTotalsModel = that.getModel("totals");
					
					var totals = oTotalsModel.getData();
					
					totals.Day1 = 0;
					totals.Day2 = 0;
					totals.Day3 = 0;
					totals.Day4 = 0;
					totals.Day5 = 0;
					totals.Day6 = 0;
					totals.Day7 = 0;
					
					var results = oData.results.map( (line)=>{ 
						
						var nLine = new that.newTimeInstance();
						
/*						var nLine = new that.newTimeInstance();
						
						nLine.Awart = line.Awart;
						nLine.Rproj = line.Rproj;
						
						line = nLine;*/
						
						line.Day1 = 0;
						line.Day2 = 0;
						line.Day3 = 0;
						line.Day4 = 0;
						line.Day5 = 0;
						line.Day6 = 0;
						line.Day7 = 0;
						
						line.Status1 = "";
						line.Status2 = "";
						line.Status3 = "";
						line.Status4 = "";
						line.Status5 = "";
						line.Status6 = "";
						line.Status7 = "";
						
						line.Counter1 = "";
						line.Counter2 = "";
						line.Counter3 = "";
						line.Counter4 = "";
						line.Counter5 = "";
						line.Counter6 = "";
						line.Counter7 = "";
						
						line.AllowEdit = true;
						
						line.Weekstatus = nLine.Weekstatus;
						
						line.EndDate = "";
						line.StartDate = "";
						line.Weeknr = "";
						line.Pernr = "";
						
						
						delete line.__metadata;
						
					});
					
					console.log("Reading Week " + this.startdate.getWeek() );

					
					oModel.setProperty("/TimeEntries", oData.results);
					
					oTimeModel.setProperty("/TimeEntries", oData.results);
					
					oData.results.forEach( (line)=>{
						totals.Day1 += parseInt(line.Day1);
						totals.Day2 += parseInt(line.Day2);
						totals.Day3 += parseInt(line.Day3);
						totals.Day4 += parseInt(line.Day4);
						totals.Day5 += parseInt(line.Day5);
						totals.Day6 += parseInt(line.Day6);
						totals.Day7 += parseInt(line.Day7);
					});
					this.startdate.next().monday();
					this.enddate.next().sunday();
					oTotalsModel.setData(totals);
				}.bind(this),
				error: function(oError){
					this.startdate.next().monday();
					this.enddate.next().sunday();
				}
			});
			//this.getModel("VH").attachPropertyChange(this.onTimeOverviewDataChanged.bind(this));
		},
		deleteSelectedWeeks: function (oEvent) {
			var index = oEvent.getParameters().listItem.getBindingContext('selectedDatesDupWeek').getPath().split('/selectedWeek/')[1];
			var data = this.getModel('selectedDatesDupWeek').getData();
			delete data.selectedWeek[index].dateFrom;
			data.selectedWeek.splice(index, 1);
			var oModel = new JSONModel(data);
			this.setModel(oModel, 'selectedDatesDupWeek');
		},
		handleConfirmDuplicateWeek: function (oEvent) {
			var data = $.extend(true, [], this.getModel('TimeData').getData());
			var timeFrom = new Date(this.oFormatYyyymmdd.format(data[0].TimeEntryDataFields.WORKDATE) + "T00:00:00");
			var timeTo = new Date(this.oFormatYyyymmdd.format(data[data.length - 1].TimeEntryDataFields.WORKDATE) + "T00:00:00");
			if (this.getModel('selectedDatesDupWeek') && this.getModel('selectedDatesDupWeek').getData().selectedWeek.length > 0) {
				var dates = this.getModel('selectedDatesDupWeek').getData().selectedWeek;
			} else {
				var toastMsg = this.oBundle.getText("selectWeekDup");
				sap.m.MessageToast.show(toastMsg, {
					duration: 3000
				});
				return false;
			}
			var oModel = new JSONModel();
			var WeekData = [];
			for (var k = new Date(timeFrom); k <= timeTo; k.setDate(k.getDate() + 1)) {
				var entries = $.grep(data, function (element, index) {
					return element.TimeEntryDataFields.WORKDATE.toDateString() === k.toDateString();
				});
				var day = {
					day: entries
				};
				WeekData.push(day);
			}
			for (var i = 0; i < dates.length; i++) {
				for (var j = new Date(dates[i].dateFrom), k = 0; j <= dates[i].dateTo, k < 7; j.setDate(
						j.getDate() + 1, k++)) {
					for (var m = 0; m < WeekData[k].day.length; m++) {
						var entry = $.extend(true, {}, WeekData[k].day[m]);
						entry.TimeEntryDataFields.WORKDATE = new Date(j);
						entry.Counter = "";
						entry.TimeEntryDataFields.STATUS = "";
						entry.TimeEntryDataFields.LONGTEXT = "";
						entry.TimeEntryDataFields.LONGTEXT_DATA = "";
						entry.TimeEntryDataFields.REFCOUNTER = "";
						entry.TimeEntryDataFields.UNIT = "";
						entry.TimeEntryDataFields.MEINH = "";
						entry.HeaderData.date = new Date(j);
						entry.highlight = sap.ui.core.MessageType.Information;
						entry.HeaderData.highlight = sap.ui.core.MessageType.Information;
						// entry.HeaderData.addButton = true;
						if (entry.TimeEntryDataFields.CATSHOURS !== "0.00") {
							entry.TimeEntryOperation = "C";
						}
						data.push(entry);

					}
				}
			}
			oModel.setData(data);
			this.setModel(oModel, "TimeData");
			this.oTable.bindItems({
				path: 'TimeData>/',
				sorter: [new sap.ui.model.Sorter("HeaderData", false, true, this.compareRows)],
				template: this.oEditableTemplate,
				templateShareable: true,
				groupHeaderFactory: this.getGroupHeader.bind(this)
			}).setKeyboardMode('Edit');
			this.getModel('controls').setProperty("/duplicateWeekButtonEnable", false);
			return true;
		},
		handleDuplicateWeekCalSelect: function (oEvent) {
			var oCalendar = oEvent.getSource();
			var aSelectedDates = oCalendar.getSelectedDates();
			var oDate;
			var oData = {
				selectedDates: []
			};
			var oModel = new JSONModel();
			if (aSelectedDates.length > 0) {
				for (var i = 0; i < aSelectedDates.length; i++) {
					oDate = aSelectedDates[i].getStartDate();
					oData.selectedDates.push({
						Date: oDate
					});
				}
				oModel.setData(oData);
				this.setModel(oModel, 'selectedDatesDup');
			} else {
				// this._clearModel();
			}
		},
		onOverviewSelect: function (oEvent) {
			var that = this;
			var selectedItem = oEvent;
			var oControl = this.getModel('controls');
			var data = this.getModel('TimeData');
			var oModel = new JSONModel();
			var index = null;
			var data = this.getModel('TimeData').getData();
			var taskModel = this.getModel('TimeDataDuplicateTask');
			var task = [];
			if (oEvent.getParameters().listItem.getBindingContext('TimeData')) {
				index = oEvent.getParameters().listItem.getBindingContext('TimeData').getPath().split('/')[1];
				data[index].TimeEntryOperation = "";
				var previousSelected = $.grep(data, function (element, ind) {
					return element.TimeEntryOperation == 'R';
				});
				for (var i = 0; i < previousSelected.length; i++) {
					previousSelected[i].TimeEntryOperation = "";
				}
			}
			if (this.oTable.getSelectedItems().length >= 1) {
				var selected = this.oTable.getSelectedContextPaths();
				for (var i = 0; i < selected.length; i++) {
					if (data[selected[i].split('/')[1]].Counter !==
						null && data[selected[i].split('/')[1]].Counter && data[selected[i].split('/')[1]].Counter !== "" || (parseFloat(data[
							selected[
								i]
							.split('/')[1]].TimeEntryDataFields.CATSHOURS).toFixed(2) !== parseFloat("0.00").toFixed(2) || parseFloat(data[selected[i].split(
							'/')[1]].TimeEntryDataFields.CATSQUANTITY).toFixed(2) !== parseFloat("0.00").toFixed(2) || parseFloat(data[selected[i].split(
							'/')[1]].TimeEntryDataFields.CATSAMOUNT).toFixed(2) !== parseFloat("0.00").toFixed(2))) {
						data[selected[i].split('/')[1]].TimeEntryOperation = "R";
						task.push($.extend(true, {}, data[selected[i].split('/')[1]]));
						// oControl.setProperty('/duplicateTaskEnable', true);
					}
				}
			} else {
				// oControl.setProperty('/duplicateTaskEnable', false);
				// oControl.setProperty('/duplicateWeekEnable', true);
			}
			oModel.setData(task);
			this.setModel(oModel, 'TimeDataDuplicateTask');
			that.calculateChangeCount();
		},
		onOverviewSelectDup: function (oEvent) {
			var that = this;
			var selectedItem = oEvent;
			var oControl = this.getModel('controls');
			var data = this.getModel('TimeData');
			var oModel = new JSONModel();
			var index = null;
			var data = this.getModel('TimeData').getData();
			var taskModel = this.getModel('TimeDataDuplicateTask');
			var task = [];
			if (oEvent.getSource().getSelectedItems().length >= 1) {
				// oControl.setProperty('/duplicateTaskEnable', true);
				var selected = oEvent.getSource().getSelectedContextPaths();
				for (var i = 0; i < selected.length; i++) {
					task.push($.extend(true, {}, data[selected[i].split('/')[1]]));
				}
			} else {
				// oControl.setProperty('/duplicateTaskEnable', false);
				// oControl.setProperty('/duplicateWeekEnable', true);
			}
			oModel.setData(task);
			this.setModel(oModel, 'TimeDataDuplicateTask');
			if (this.getModel("selectedDatesDup")) {
				if (this.getModel("selectedDatesDup").getData().selectedDates.length >= 1 &&
					this.getModel("TimeDataDuplicateTask").getData().length >= 1) {
					this.getModel("controls").setProperty("/duplicateTaskButtonEnable", true);
				} else {
					this.getModel("controls").setProperty("/duplicateTaskButtonEnable", false);
				}
			}
			// that.calculateChangeCount();
		},
		handleDuplicateTaskConfirm: function () {
			if (this.getModel("TimeDataDuplicateTask") && this.getModel("TimeDataDuplicateTask").getData().length > 0) {
				var oModel = this.getModel("TimeDataDuplicateTask");
			} else {
				var toastMsg = this.oBundle.getText("selectRecordDup");
				sap.m.MessageToast.show(toastMsg, {
					duration: 3000
				});
				return false;
			}
			if (this.getModel("selectedDatesDup") && this.getModel("selectedDatesDup").getData().selectedDates.length > 0) {
				var dates = this.getModel("selectedDatesDup").getData();
			} else {
				var toastMsg = this.oBundle.getText("selectDatesDup");
				sap.m.MessageToast.show(toastMsg, {
					duration: 3000
				});
				return false;
			}

			var timeData = this.getModel("TimeData").getData();
			for (var i = 0; i < dates.selectedDates.length; i++) {
				var data = $.extend(true, [], oModel.getData());
				for (var j = 0; j < data.length; j++) {
					data[j].TimeEntryDataFields.WORKDATE = new Date(dates.selectedDates[i].Date);
					data[j].Counter = "";
					data[j].TimeEntryOperation = 'C';
					data[j].TimeEntryDataFields.STATUS = "";
					data[j].TimeEntryDataFields.LONGTEXT = "";
					data[j].TimeEntryDataFields.LONGTEXT_DATA = "";
					data[j].TimeEntryDataFields.UNIT = "";
					data[j].TimeEntryDataFields.MEINH = "";
					data[j].HeaderData.date = new Date(dates.selectedDates[i].Date);
					data[j].HeaderData.key = new Date(dates.selectedDates[i].Date);
					data[j].highlight = sap.ui.core.MessageType.Information;
					data[j].HeaderData.highlight = sap.ui.core.MessageType.Information;
					data[j].HeaderData.addButton = false;
					data[j].addButton = false;
					if (j == 0) {
						var select = $.grep(timeData, function (element, ind) {
							return element.TimeEntryDataFields.WORKDATE.toDateString() === data[j].TimeEntryDataFields.WORKDATE.toDateString();
						});
						if (select.length === 0) {
							data[j].HeaderData.addButton = true;
							data[j].addButton = true;
						}
					}

					timeData.push(data[j]);
				}
			}
			oModel.setData(timeData);
			this.setModel(oModel, "TimeData");
			this.oTable.bindItems({
				path: 'TimeData>/',
				sorter: [new sap.ui.model.Sorter("HeaderData", false, true, this.compareRows)],
				template: this.oEditableTemplate,
				templateShareable: true,
				groupHeaderFactory: this.getGroupHeader.bind(this)
			}).setKeyboardMode('Edit');
			return true;
		},
		promiseText: function (fieldName, value) {
			var that = this;
			return new Promise(function (fnResolve, fnReject) {
				that.getFieldText(fieldName, value);
				fnResolve(this.getModel(fieldName));
			}).bind(this);
		},
		onAssignmentQuickView: function (oEvent) {
			var that = this;
			var index = oEvent.getSource().getParent().getBindingContext('TimeData').getPath().split('/')[1];
			var timeData = this.getModel('TimeData').getData();
			var profileData = this.getModel('ProfileFields').getData();
			var data = [{
				label: this.oBundle.getText("name"),
				value: timeData[index].AssignmentName
			}];
			var item;
			var element = {
				label: null,
				value: null,
				fieldname: null
			};
			profileData.forEach(function (item, ind) {
				var oModel = that.getModel(item.FieldName);
				if (oModel) {
					var text = oModel.getData();
				}
				if (item.FieldName !== "AssignmentStatus" && item.FieldName !== "APPROVER" && item.FieldName !== "AssignmentName" && item.FieldName !==
					"ValidityStartDate" && item.FieldName !== "ValidityEndDate") {
					element.label = item.FieldLabel;
					element.fieldname = item.FieldName;
					element.value = timeData[index].TimeEntryDataFields[item.FieldName];
					var fieldValue = timeData[index].TimeEntryDataFields[item.FieldName];
					if (text) {
						var textFound = $.grep(text, function (element, ind) {
							return element.DispField1Id === fieldValue;
						});
						if (textFound.length && textFound.length > 0) {
							element.value = timeData[index].TimeEntryDataFields[item.FieldName] + "  " + textFound[0].DispField1Val;
						} else {
							if (item.DispValueText === "TRUE") {
								if (fieldValue !== "") {

									that.getFieldText(item.FieldName, fieldValue).then(function (oModel) {
										var timeData = that.getModel("TimeDataDetail").getData();
										if (oModel) {
											var text = oModel.getData();
											if (text) {
												var textFound = $.grep(text, function (element, ind) {
													return element.DispField1Id === fieldValue;
												});
												if (textFound.length && textFound.length > 0) {
													var element = $.grep(timeData, function (element, index) {
														return element.fieldname === text[text.length - 1].FieldName;
													});
													element[0].value = element[0].value + "  " + textFound[0].DispField1Val;
													that.setModel(new JSONModel(timeData), "TimeDataDetail");
												}
											}
										}
									}.bind(this));
								}
							} else {
								element.value = timeData[index].TimeEntryDataFields[item.FieldName];
							}
						}
					} else {
						if (item.DispValueText === "TRUE") {
							if (fieldValue !== "") {
								that.getFieldText(item.FieldName, fieldValue).then(function (oModel) {
									var timeData = that.getModel("TimeDataDetail").getData();
									if (oModel) {
										var text = oModel.getData();
										if (text) {
											var textFound = $.grep(text, function (element, ind) {
												return element.DispField1Id === fieldValue;
											});
											if (textFound.length && textFound.length > 0) {
												var element = $.grep(timeData, function (element, index) {
													return element.fieldname === text[text.length - 1].FieldName;
												});
												element[0].value = element[0].value + "  " + textFound[0].DispField1Val;
												that.setModel(new JSONModel(timeData), "TimeDataDetail");
											}
										}
									}
								}.bind(this));
							}
						} else {
							element.value = timeData[index].TimeEntryDataFields[item.FieldName];
						}

					}
					// element.value = textFound[0].FieldValue + "(" + timeData[index].TimeEntryDataFields[item.FieldName] + ")";
					item = $.extend(true, {}, element);
					data.push(item);
				}

			});
			var oModel = new JSONModel(data);
			this.setModel(oModel, "TimeDataDetail");
			var oDialog;
			if (oDialog) {
				oDialog.close();
			}
			var oDialogController = {
				handleClose: function (event) {
					oDialog.close();
				}
			};
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(this.getView().getId(), "hcm.fab.mytimesheet.view.fragments.AssignmentQuickView",
					oDialogController);
				this.getView().addDependent(oDialog);
				// oDialog.bindElement('TimeData>' + oEvent.getSource().getBindingContext('TimeData').getPath());
			}

			// delay because addDependent will do a async rerendering and the popover will immediately close without it
			var oButton = oEvent.getSource();
			jQuery.sap.delayedCall(0, this, function () {
				oDialog.openBy(oButton);
			});
		},
		UpdateTask: function (TaskData) {
			var that = this;
			var oModel = new JSONModel();
			var mParameters = {
				success: function (oData, oResponse) {
					var data = oData.results;
				},
				error: function (oError) {
					that.oErrorHandler.processError(oError);
				}
			};
			this.oDataModel.create('/AssignmentCollection', TaskData, mParameters);
		},
		SubmitTask: function (TaskData) {
			var that = this;
			var oModel = new JSONModel();
			var mParameters = {
				success: function (oData, oResponse) {
					var data = oData.results;
					var toastMsg = that.oBundle.getText("taskSaved");
					sap.m.MessageToast.show(toastMsg, {
						duration: 1000
					});
					that.getTasks(false);
				},
				error: function (oError) {
					that.oErrorHandler.processError(oError);
				}
			};
			this.oDataModel.create('/AssignmentCollection', TaskData, mParameters);
			// this.oDataModel.submitChanges();
		},

		iconTabSelection: function (oEvent) {
			var oControl = this.getModel('controls');
			var that = this;
			var messageHeader = that.oBundle.getText("confirmationSwitchTab");
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			if (this.filterAppliedFlag === "X" && oEvent.getParameter('section').getId().split("worklist--")[1] !== "tasks") {
				sap.m.MessageBox.warning(
					messageHeader, {
						title: that.oBundle.getText("confirm"),
						actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
						styleClass: bCompact ? "sapUiSizeCompact" : "",
						onClose: function (sAction) {
							if (sAction === "CANCEL") {
								// that.byId("ObjectPageLayout").setSelectedSection("application-MyTimesheet-display-component---worklist--tasks");
								that.byId("ObjectPageLayout").setSelectedSection(that.byId("ObjectPageLayout").getSections()[2].getId());
								return;
							} else {
								that.filterAppliedFlag = "";
								that.getTasks(false);
								sap.ui.getCore().getMessageManager().removeAllMessages();
								this.iconTabSelectionProcessing(oEvent.getParameter('section').getId().split("worklist--")[1]);
							}
						}
					}

				);
			}
			if ((oControl.getProperty("/isOverviewChanged") || oControl.getProperty("/overviewDataChanged")) && oEvent.getParameter(
					'section')
				.getId()
				.split("worklist--")[1] !== "overview") {
				sap.m.MessageBox.warning(
					that.oBundle.getText("confirmationSwitchTabGeneral"), {
						title: that.oBundle.getText("confirm"),
						actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
						styleClass: bCompact ? "sapUiSizeCompact" : "",
						onClose: function (sAction) {
							if (sAction === "CANCEL") {
								// that.byId("ObjectPageLayout").setSelectedSection("application-MyTimesheet-display-component---worklist--tasks");
								that.byId("ObjectPageLayout").setSelectedSection(that.byId("ObjectPageLayout").getSections()[0].getId());
								return;
							} else {
								that.onCancel();

								sap.ui.getCore().getMessageManager().removeAllMessages();
								this.iconTabSelectionProcessing(oEvent.getParameter('section').getId().split("worklist--")[1]);
							}
						}
					}

				);
			} else if (!(oControl.getProperty("/isOverviewChanged") || oControl.getProperty("/overviewDataChanged")) && oEvent.getParameter(
					'section').getId().split("worklist--")[1] !== "overview") {
				that.onCancel();
				if (oControl.getProperty("/isToDoChanged") || oControl.getProperty("/todoDataChanged")) {
					oControl.setProperty("/showFooter", true);
				}
				// this.iconTabSelectionProcessing(oEvent.getParameter('section').getId().split("worklist--")[1]);
			}
			if ((oControl.getProperty("/isToDoChanged") || oControl.getProperty("/todoDataChanged")) && oEvent.getParameter('section').getId()
				.split(
					"worklist--")[1] !== "todolist") {
				sap.m.MessageBox.warning(
					that.oBundle.getText("confirmationSwitchTabGeneral"), {
						title: that.oBundle.getText("confirm"),
						actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
						styleClass: bCompact ? "sapUiSizeCompact" : "",
						onClose: function (sAction) {
							if (sAction === "CANCEL") {
								that.byId("ObjectPageLayout").setSelectedSection(that.byId("ObjectPageLayout").getSections()[1].getId());
								return;
							} else {
								that.onTodoCancel();
								oControl.setProperty("/isToDoChanged", false);
								oControl.setProperty("/todoDataChanged", false);
								sap.ui.getCore().getMessageManager().removeAllMessages();
								this.iconTabSelectionProcessing(oEvent.getParameter('section').getId().split("worklist--")[1]);
							}
						}
					}

				);
			} else if (!(oControl.getProperty("/isToDoChanged") || oControl.getProperty("/todoDataChanged")) && oEvent.getParameter(
					'section')
				.getId()
				.split(
					"worklist--")[1] !== "todolist") {
				that.onTodoCancel();
				oControl.setProperty("/isToDoChanged", false);
				oControl.setProperty("/todoDataChanged", false);
				if (oControl.getProperty("/isOverviewChanged") || oControl.getProperty("/overviewDataChanged")) {
					oControl.setProperty("/showFooter", true);
				}
				// this.iconTabSelectionProcessing(oEvent.getParameter('section').getId().split("worklist--")[1]);
			}
			// this.iconTabSelectionProcessing(oEvent.getParameter('section').getId().split("worklist--")[1]);
		},
		iconTabSelectionProcessing: function (section) {
			var oControl = this.getModel('controls');
			if (section == "overview") {
				oControl.setProperty('/showFooter', false);
				// oControl.setProperty('/todoCancel', false);
				oControl.setProperty('/overviewEdit', true);
				oControl.setProperty('/overviewEditable', false);
				oControl.setProperty('/editTodoVisibility', true);
				oControl.setProperty('/duplicateVisibility', false);
				oControl.setProperty('/duplicateWeekVisibility', false);
				// oControl.setProperty('/todoDone', false);
				if (this.oReadOnlyToDoTemplate) {
					this.rebindTableWithTemplate(this.oToDoTable, "TodoList>/", this.oReadOnlyToDoTemplate, "Navigation");
					oControl.setProperty('/showFooter', false);
				}
			} else if (section == "todolist") {
				// oControl.setProperty('/overviewCancel', false);
				// oControl.setProperty('/sendForApproval', false);
				// oControl.setProperty('/submitDraft', false);
				oControl.setProperty('/showFooter', false);
				// oControl.setProperty('/todoDone', false);
				// oControl.setProperty('/editTodoVisibility', true);
				oControl.setProperty('/onEdit', "None");
				oControl.setProperty('/duplicateVisibility', false);
				oControl.setProperty('/duplicateWeekVisibility', false);
				// oControl.setProperty('/showFooter', false);
				if (this.oReadOnlyTemplate) {
					this.rebindTableWithTemplate(this.oTable, "TimeData>/", this.oReadOnlyTemplate, "Navigation");
					oControl.setProperty('/showFooter', false);
				}

			} else if (section == "tasks") {
				oControl.setProperty('/showFooter', false);
				// oControl.setProperty('/overviewCancel', false);
				// oControl.setProperty('/sendForApproval', false);
				// oControl.setProperty('/submitDraft', false);
				// oControl.setProperty('/todoDone', false);
				oControl.setProperty('/onEdit', "None");
				if (this.oReadOnlyTemplate) {
					this.rebindTableWithTemplate(this.oTable, "TimeData>/", this.oReadOnlyTemplate, "Navigation");
					oControl.setProperty('/showFooter', false);
				}

				// oControl.setProperty('/todoCancel', false);
				oControl.setProperty('/overviewEdit', true);
				oControl.setProperty('/overviewEditable', false);
				// if (!sap.ui.Device.system.phone) {
				oControl.setProperty('/editTodoVisibility', true);
				// }
				oControl.setProperty('/duplicateVisibility', false);
				oControl.setProperty('/duplicateWeekVisibility', false);
				// oControl.setProperty('/todoDone', false);
				if (this.oReadOnlyToDoTemplate) {
					this.rebindTableWithTemplate(this.oToDoTable, "TodoList>/", this.oReadOnlyToDoTemplate, "Navigation");
				}
				oControl.setProperty('/showFooter', false);
			} else {
				oControl.setProperty('/showFooter', false);
				// oControl.setProperty('/overviewCancel', false);
				// oControl.setProperty('/sendForApproval', false);
				// oControl.setProperty('/submitDraft', false);
				// oControl.setProperty('/todoDone', false);
				oControl.setProperty('/onEdit', "None");
				if (this.oReadOnlyTemplate) {
					this.rebindTableWithTemplate(this.oTable, "TimeData>/", this.oReadOnlyTemplate, "Navigation");
					oControl.setProperty('/showFooter', false);
				}

				// oControl.setProperty('/todoCancel', false);
				oControl.setProperty('/overviewEdit', true);
				oControl.setProperty('/overviewEditable', false);
				// if (!sap.ui.Device.system.phone) {
				oControl.setProperty('/editTodoVisibility', true);
				// }
				oControl.setProperty('/duplicateVisibility', false);
				oControl.setProperty('/duplicateWeekVisibility', false);
				// oControl.setProperty('/todoDone', false);
				if (this.oReadOnlyToDoTemplate) {
					this.rebindTableWithTemplate(this.oToDoTable, "TodoList>/", this.oReadOnlyToDoTemplate, "Navigation");
				}
				oControl.setProperty('/showFooter', false);
			}
			this.setModel(oControl, "controls");
		},
		onValueHelp: function (oEvent) {
			var that = this;
			var FieldName = oEvent.getSource().getCustomData('FieldName')[0].getValue();
			new Promise(
				function (fnResolve, fnReject) {
					that.getValueHelpCollection(FieldName);
					fnResolve(that.valueHelpFragment());
					fnReject();
				}
			);
		},
		valueHelpFragment: function () {
			var that = this;
			var that = this;
			var oView = this.getView();
			// create dialog lazily
			var oDialog;
			if (!oDialog) {
				var oDialogController = {
					handleConfirm: that.handleClick.bind(that),
					handleCancel: function (oEvent) {
						// oDialog.close();
						oDialog.destroy();
					}.bind(that),
					onValueHelp: that.onValueHelp.bind(that),
					handleClickValueHelp: that.handleClick.bind(that)
				};
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "hcm.fab.mytimesheet.view.fragments.ValueHelp", oDialogController);
				// connect dialog to view (models, lifecycle)
				oView.addDependent(oDialog);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), oDialog);

			jQuery.sap.delayedCall(0, this, function () {
				oDialog.open();
			});
		},
		getValueHelpCollection: function (FieldName) {
			var that = this;
			var oModel = new sap.ui.model.json.JSONModel();
			var f = [];
			var c = new sap.ui.model.Filter({
				path: "Pernr",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: this.empID
			});
			var d = new sap.ui.model.Filter({
				path: "FieldName",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: FieldName
			});
			// f.push(a);
			// f.push(b);
			f.push(c);
			f.push(d);
			var mParameters = {
				urlParameters: '$expand=ValueHelpHits',
				filters: f,
				success: function (oData, oResponse) {
					that.results = oData.results[0].ValueHelpHits.results;;
					oModel.setData(that.results);
					that.setModel(oModel, "ValueHelp");
				},
				error: function (oError) {
					that.oErrorHandler.processError(oError);
				}
			};
			this.oDataModel.read('/ValueHelpCollection', mParameters);
		},
		handleClick: function (oEvent) {
			var that = this;
			var value = oEvent.getParameter('selectedItem');
		},
		onToDoEdit: function (oEvent) {
			var that = this;
			var oModel = this.getModel('controls');
			oModel.setProperty('/sendForApproval', false);
			oModel.setProperty('/submitDraft', false);
			oModel.setProperty('/overviewCancel', false);
			oModel.setProperty('/todoCancel', true);
			oModel.setProperty('/todoDone', true);
			oModel.setProperty('/showFooter', true);
			oModel.setProperty('/editTodoVisibility', false);
			this.oReadOnlyToDoTemplate = this.getView().byId("idToDoList").removeItem(0);
			this.oEditableToDoTemplate = new sap.m.ColumnListItem({
				highlight: "{TodoList>highlight}",
				cells: [
					new sap.m.Text({
						text: "{path: 'TodoList>TimeEntryDataFields/WORKDATE', type: 'sap.ui.model.type.Date', formatOptions: { style: 'full' }}"
					}),
					new sap.m.ObjectStatus({
						text: {
							parts: [{
								path: 'TodoList>total',
								type: 'sap.ui.model.odata.type.Decimal',
								formatOptions: {
									parseAsString: true,
									decimals: 2,
									maxFractionDigits: 2,
									minFractionDigits: 0
								},
								constraints: {
									precision: 4,
									scale: 2,
									minimum: '0',
									maximum: '10000'
								}
							}, {
								path: 'TodoList>target',
								type: 'sap.ui.model.odata.type.Decimal',
								formatOptions: {
									parseAsString: true,
									decimals: 2,
									maxFractionDigits: 2,
									minFractionDigits: 0
								},
								constraints: {
									precision: 4,
									scale: 2,
									minimum: '0',
									maximum: '10000'
								}
							}],
							formatter: formatter.concatStrings
						},

					}),

					new sap.m.ObjectStatus({
						text: {
							path: 'TodoList>currentMissing',
							type: 'sap.ui.model.odata.type.Decimal',
							formatOptions: {
								parseAsString: true,
								decimals: 2,
								maxFractionDigits: 2,
								minFractionDigits: 0
							},
							constraints: {
								precision: 4,
								scale: 2,
								minimum: '0',
								maximum: '10000'
							}
						}

					}),

					new sap.m.ComboBox({
						selectedKey: "{:=${TodoList>AssignmentId}}",
						selectionChange: this.onSelectionChangeToDo.bind(this),
						showSecondaryValues: true
					}).bindItems({
						path: "TasksWithGroups>/",
						// factory: this.activeTasks,
						template: new sap.ui.core.ListItem({
							key: "{TasksWithGroups>AssignmentId}",
							text: "{TasksWithGroups>AssignmentName}",
							enabled: {
								parts: [{
									path: 'TasksWithGroups>AssignmentStatus'
								}, {
									path: 'TasksWithGroups>ValidityStartDate'
								}, {
									path: 'TasksWithGroups>ValidityEndDate'
								}, {
									path: 'TodoList>TimeEntryDataFields'
								}],
								formatter: this.formatter.activeTasks
							},
							additionalText: "{TasksWithGroups>AssignmentType}"
						}),
						templateShareable: true
					}),
					// new sap.ui.layout.HorizontalLayout({
					// 	content: [new sap.m.Input({
					// 		value: "{TodoList>TimeEntryDataFields/CATSHOURS}",
					// 		type: sap.m.InputType.Number,
					// 		width: "60%",
					// 		liveChange: this.liveChangeHoursToDo.bind(this)
					// 	}), new sap.m.Text({
					// 		text: "{TodoList>TimeEntryDataFields/UNIT}"
					// 	})]
					// }),
					new sap.ui.layout.HorizontalLayout({
						content: [
							// new sap.m.Input({
							// 	value: "{TodoList>TimeEntryDataFields/CATSHOURS}",
							// 	description: {
							// 		parts: [{
							// 			path: 'TodoList>TimeEntryDataFields/UNIT'
							// 		}, {
							// 			path: 'TodoList>TimeEntryDataFields/CATSHOURS'
							// 		}],
							// 		formatter: formatter.getUnitTexts.bind(this)
							// 	},
							// 	liveChange: this.liveChangeHoursToDo.bind(this),
							// 	type: sap.m.InputType.Number,
							// 	width: "100%",
							// 	fieldWidth: "60%"
							// })
							new sap.m.StepInput({
								value: {
									parts: [{
										path: 'TodoList>TimeEntryDataFields/CATSHOURS'
									}, {
										path: 'TodoList>TimeEntryDataFields/CATSQUANTITY'
									}, {
										path: 'TodoList>TimeEntryDataFields/CATSAMOUNT'
									}],
									formatter: formatter.calHoursQuanAmountInput.bind(this)
								},
								description: {
									parts: [{
										path: 'TodoList>TimeEntryDataFields/UNIT'
									}, {
										path: 'TodoList>TimeEntryDataFields/CATSHOURS'
									}],
									formatter: formatter.getUnitTexts.bind(this)
								},
								change: this.liveChangeHoursToDo.bind(this),
								displayValuePrecision: 2,
								step: 1,
								min: 0,
								fieldWidth: "60%",
								valueState: "{TodoList>valueState}",
								valueStateText: "{TodoList>valueStateText}",
								enabled: {
									parts: [{
										path: 'TodoList>Status'
									}, {
										path: 'controls>/hoursDisabled'
									}],
									formatter: this.formatter.checkHrRecord.bind(this)
								}
							})
							// 	, 
							// 	new sap.m.Label({
							// 		text: "{TimeData>TimeEntryDataFields/UNIT}",
							// 		style: "Bold"
						]
					}),
					new sap.m.TimePicker({
						value: {
							path: 'TodoList>TimeEntryDataFields/BEGUZ',
							formatter: this.formatter.formatTime.bind(this)
						},
						visible: this.clockTimeVisible,
						valueFormat: "HH:mm",
						displayFormat: "HH:mm",
						change: this.startTimeToDoChange.bind(this),
						placeholder: this.oBundle.getText("startTime")
					}),
					new sap.m.TimePicker({
						value: {
							path: 'TodoList>TimeEntryDataFields/ENDUZ',
							formatter: this.formatter.formatTime.bind(this)
						},
						visible: this.clockTimeVisible,
						valueFormat: "HH:mm",
						displayFormat: "HH:mm",
						change: this.stopTimeToDoChange.bind(this),
						placeholder: this.oBundle.getText("endTime")
					}),

					new sap.m.ObjectStatus({
						text: {
							path: 'TodoList>TimeEntryDataFields/STATUS',
							formatter: formatter.status
						},
						state: {
							path: 'TodoList>TimeEntryDataFields/STATUS',
							formatter: formatter.TodoState
						}
					}),
					new sap.m.Button({
						icon: {
							path: 'TodoList>TimeEntryDataFields/LONGTEXT',
							formatter: formatter.longtextButtons
						},
						type: sap.m.ButtonType.Transparent,
						press: this.EditTodoLongTextPopover.bind(this)

					}),

					new sap.ui.layout.HorizontalLayout({
						content: [
							new sap.m.Button({
								icon: "sap-icon://sys-cancel",
								type: sap.m.ButtonType.Transparent,
								press: this.onTodoDeleteRow.bind(this),
								visible: "{TodoList>deleteButton}",
								enabled: "{TodoList>deleteButtonEnable}"
							}),
							new sap.m.Button({
								icon: "sap-icon://add",
								type: sap.m.ButtonType.Transparent,
								press: this.onTodoAddRow.bind(this),
								visible: "{TodoList>addButton}",
								enabled: "{TodoList>addButtonEnable}"
							})
						]
					})
				],
				customData: [new sap.ui.core.CustomData({
					key: "counter",
					value: "{TodoList>Counter}"
				})]
			});
			this.rebindTableWithTemplate(this.oToDoTable, "TodoList>/", this.oEditableToDoTemplate, "Edit");

		},
		liveChangeHoursToDo: function (oEvent) {
			this.getModel("controls").setProperty("/isToDoChanged", true);
			this.getModel("controls").setProperty("/todoDataChanged", true);
			var val = /^\d+(\.\d{1,2})?$/;
			// if (parseFloat(oEvent.getSource().getValue())) {
			if (val.test(oEvent.getSource().getValue())) {
				var counter = oEvent.getSource().getParent().getParent().getCustomData('counter')[0].getValue();
				var oModel = this.oToDoTable.getModel('TodoList');
				var index = parseInt(oEvent.getSource().getParent().getBindingContext('TodoList').getPath().split('/')[1]);
				var data = oModel.getData();
				data[index].addButtonEnable = true;
				data[index].deleteButtonEnable = true;
				data[index].sendButton = true;
				data[index].TimeEntryDataFields.CATSHOURS = parseFloat(oEvent.getSource().getValue()).toFixed(2);
				// data[index].total = ((parseFloat(data[index].target) - parseFloat(data[index].missing)) + parseFloat(oEvent.getSource().getValue()))
				// 	.toFixed(2);
				if (counter && counter !== null) {
					data[index].TimeEntryOperation = 'U';
				} else {
					data[index].TimeEntryOperation = 'C';
				}
				data = this.calculateSumToDo(new Date(data[index].TimeEntryDataFields.WORKDATE), data);
				this.setModel(new JSONModel(data), "TodoList");
				var item = $.grep(this.oToDoTable.getItems(), function (element, index) {
					if (!element.getAggregation('cells')) {
						return false;
					} else {
						return true;
					}
				});
				item[index].focus();
			}
		},
		onCopyTask: function (oEvent) {
			var that = this;
			var oView = this.getView();
			var oTable = this.byId('idTasks');
			var oModel = new JSONModel();
			var data = this.getModel('ProfileFields').getData();
			var tasks = this.getModel('Tasks').getData();
			var index = oTable.getSelectedItem().getBindingContext('TaskFields').getPath().split("/")[1];
			var formElements = [];
			var formContainers = [];
			var form = {
				name: null,
				status: false,
				containers: null
			};
			var oControl = this.getModel("controls");
			oControl.setProperty('/createAssignment', false);
			oControl.setProperty('/editAssignment', false);
			oControl.setProperty('/copyAssignment', true);
			oControl.setProperty('/displayAssignment', false);
			oControl.setProperty('/assignmentTitle', this.oBundle.getText("copyAssignment"));
			this.setGlobalModel(oControl, "controls");
			var selectedTask = oTable.getSelectedItem().getAggregation('cells');
			var profileFields = $.extend(true, [], this.getModel('ProfileFields').getData());
			for (var i = 0; i < selectedTask.length; i++) {
				var obj = $.grep(data, function (element, index) {
					return element.FieldName == selectedTask[i].getCustomData('FieldName')[0].getValue();
				});
				if (selectedTask[i].getCustomData('FieldName')[0].getValue() !== "AssignmentStatus" && selectedTask[i].getCustomData(
						'FieldName')[
						0].getValue() !== "AssignmentName" && selectedTask[i].getCustomData('FieldName')[
						0].getValue() !== "ValidityStartDate" && selectedTask[i].getCustomData('FieldName')[
						0].getValue() !== "ValidityEndDate") {
					if (tasks[index].AssignmentFields[selectedTask[i].getCustomData('FieldName')[0].getValue()] !== undefined) {
						obj[0].FieldValue = tasks[index].AssignmentFields[selectedTask[i].getCustomData('FieldName')[0].getValue()];
					}
					obj[0].AssignmentId = selectedTask[i].getAggregation('customData')[1].getValue();
				} else {
					if (selectedTask[i].getCustomData('FieldName')[0].getValue() === "AssignmentStatus") {
						obj[0].FieldValue = selectedTask[i].getAggregation('customData')[2].getValue();
						obj[0].AssignmentId = selectedTask[i].getAggregation('customData')[1].getValue();
					} else if (selectedTask[i].getCustomData('FieldName')[0].getValue() === "AssignmentName") {
						// obj[0].FieldValue = selectedTask[i].getText();
						obj[0].AssignmentId = selectedTask[i].getAggregation('customData')[1].getValue();
						obj[0].FieldValue = "";
					} else if (selectedTask[i].getCustomData('FieldName')[0].getValue() === "ValidityStartDate") {
						obj[0].FieldValue = selectedTask[i].getText();
						obj[0].AssignmentId = selectedTask[i].getAggregation('customData')[1].getValue();
					} else if (selectedTask[i].getCustomData('FieldName')[0].getValue() === "ValidityEndDate") {
						obj[0].FieldValue = selectedTask[i].getText();
						obj[0].AssignmentId = selectedTask[i].getAggregation('customData')[1].getValue();
					}
				}
				if (selectedTask[i].getCustomData('FieldName')[0].getValue() !== "AssignmentName" && selectedTask[i].getCustomData('FieldName')[
						0]
					.getValue() !== "AssignmentStatus" && selectedTask[i].getCustomData('FieldName')[
						0].getValue() !== "ValidityStartDate" && selectedTask[i].getCustomData('FieldName')[
						0].getValue() !== "ValidityEndDate") {
					formElements.push(obj[0]);
				} else {
					if (selectedTask[i].getCustomData('FieldName')[0].getValue() === "AssignmentName") {
						form.name = obj[0].FieldValue;
					} else if (selectedTask[i].getCustomData('FieldName')[0].getValue() === "AssignmentStatus") {
						form.status = obj[0].FieldValue;
					} else if (selectedTask[i].getCustomData('FieldName')[0].getValue() === "ValidityStartDate") {
						form.validFrom = new Date(obj[0].FieldValue);
					} else if (selectedTask[i].getCustomData('FieldName')[0].getValue() === "ValidityEndDate") {
						form.validTo = new Date(obj[0].FieldValue);
					}
				}
				if (((formElements.length + 1) % 5) === 0 || i === (selectedTask.length - 1)) {
					formContainers.push({
						form: $.extend(formElements, [], true)
					});
					formElements = [];
				}
			}

			form.containers = formContainers;
			oModel.setData(form);
			this.setGlobalModel(oModel, "EditedTask");
			this.getRouter().navTo("editAssignment", {}, false);
		},
		onSendForApprovalToDo: function (oEvent) {
			var that = this;
			// this.showBusy();
			var index = parseInt(oEvent.getSource().getBindingContext('TodoList').getPath().split('/')[1]);
			var oModel = this.getModel("TodoList");
			var oAprModel = this.getModel("TodoListApproval");
			var aprData;
			var data = oModel.getData();
			if (oAprModel) {
				aprData = oAprModel.getData();
				aprData.push(data[index]);
			} else {
				aprData = [data[index]];
				oAprModel = new JSONModel();
			}
			oAprModel.setData(aprData);
			this.setModel(oAprModel, "TodoListApproval");
			data.splice(index, 1);
			oModel.setData(data);
			this.setModel(oModel, "TodoList");
			var toastMsg = that.oBundle.getText("todoEntriesSaved");
			sap.m.MessageToast.show(toastMsg, {
				duration: 2000
			});
		},
		onToDoSubmit: function (oEvent) {
			var that = this;
			this.showBusy();
			var submitEntries = this.fetchToDoRecords();
			var selectedItems;
			var oModel = $.extend(true, {}, this.oDataModel);
			var oControl = this.getModel("controls");
			oModel.setChangeBatchGroups({
				"*": {
					groupId: "TimeEntry",
					changeSetId: "TimeEntry",
					single: false
				}
			});
			oModel.setDeferredGroups(["TimeEntry"]);
			oModel
				.refreshSecurityToken(
					function (oData) {
						if (submitEntries.length === 0) {
							that.hideBusy(true);
							var toastMsg = that.oBundle.getText("noEntriesToSubmit");
							sap.m.MessageToast.show(toastMsg, {
								duration: 3000
							});
							return;
						}
						for (var i = 0; i < submitEntries.length; i++) {
							var obj = {
								properties: submitEntries[i],
								changeSetId: "TimeEntry",
								groupId: "TimeEntry"
							};
							oModel
								.createEntry(
									"/TimeEntryCollection",
									obj);
						}
						oModel.submitChanges({
							groupId: "TimeEntry",
							changeSetId: "TimeEntry",
							success: function (oData, res) {
								// that.responses = oData.__batchResponses[0].__changeResponses;
								if (that.oMessagePopover) {
									// that.oMessagePopover.removeAllItems();
									that.oMessagePopover.destroy();
									sap.ui.getCore().getMessageManager().removeAllMessages();
									// that.oMessagePopover.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "message");
								}
								var error = false;
								var entries = that.getModel('TodoList').getData();
								var oMessages = [];
								if (!oData.__batchResponses[0].__changeResponses) {
									var messageText = "";
									var messageType = "";
									var errorJSON = JSON.parse(oData.__batchResponses[0].response.body);
									var totalLength = errorJSON.error.innererror.errordetails.length - 1;
									sap.ui.getCore().getMessageManager().removeAllMessages();
									// Additional coding to handle error message(s)
									for (var len = 0; len < totalLength; len++) {
										messageText = errorJSON.error.innererror.errordetails[len].message;
										messageType = errorJSON.error.innererror.errordetails[len].severity;
										if (messageType == "warning") {
											sap.ui.getCore().getMessageManager().addMessages(
												new sap.ui.core.message.Message({
													message: messageText,
													description: messageText,
													type: sap.ui.core.MessageType.Warning,
													processor: that.getOwnerComponent().oMessageProcessor,
													code: "TimeData"
												}));
										} else {
											sap.ui.getCore().getMessageManager().addMessages(
												new sap.ui.core.message.Message({
													message: messageText,
													description: messageText,
													type: sap.ui.core.MessageType.Error,
													processor: that.getOwnerComponent().oMessageProcessor,
													code: "TimeData"
												}));
											error = true;
										}
									}
									//if message type is error then add the last error message
									if (!errorJSON.error.innererror.errordetails[len].code.match("/IWBEP")) {
										messageText = errorJSON.error.innererror.errordetails[len].message;
										sap.ui.getCore().getMessageManager().addMessages(
											new sap.ui.core.message.Message({
												message: messageText,
												description: messageText,
												type: sap.ui.core.MessageType.Error,
												processor: that.getOwnerComponent().oMessageProcessor,
												code: "TimeData"
											}));
										error = true;
									}
									that.hideBusy(true);
								} else {
									for (var i = 0; i < oData.__batchResponses[0].__changeResponses.length; i++) {
										var entry = $.grep(entries, function (element, ind) {
											if (element.RecRowNo) {
												return element.RecRowNo === parseInt(oData.__batchResponses[0].__changeResponses[i].data.RecRowNo).toString();
											}
										});
										if (oData.__batchResponses[0].__changeResponses[i].data.ErrorMsg !== "") {
											error = true;
											if (entry.length > 0) {
												entry[0].valueState = "Error";
												entry[0].highlight = "Error";
												entry[0].valueStateText = oData.__batchResponses[0].__changeResponses[i].data.ErrorMsg;
												oMessages.push(new sap.ui.core.message.Message({
													message: oData.__batchResponses[0].__changeResponses[i].data.ErrorMsg,
													description: oData.__batchResponses[0].__changeResponses[i].data.ErrorMsg,
													type: sap.ui.core.MessageType.Error,
													processor: that.getOwnerComponent().oMessageProcessor,
													additionalText: parseInt(oData.__batchResponses[0].__changeResponses[i].data.RecRowNo),
													code: "TodoList"
												}));
											}

										} else {
											if (entry.length > 0) {
												entry[0].valueState = "Success";
												entry[0].highlight = "Success";
											}
										}
									}
								}
								sap.ui.getCore().getMessageManager().addMessages(
									oMessages
								);
								that.getModel('TodoList').updateBindings();
								// that.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "message");
								var toastMsg;
								if (!error) {
									toastMsg = that.oBundle.getText("timeEntriesSaved");
								} else {
									toastMsg = that.oBundle.getText("resubmitTimeEntries");
								}
								sap.m.MessageToast.show(toastMsg, {
									duration: 1000
								});
								that.getToDoList();
								that.getTimeEntries(new Date(that.dateFrom), new Date(that.dateTo));
								sap.ui.getCore().getMessageManager().removeAllMessages();
								var data = [];
								var oModel = new JSONModel();
								oModel.setData(data);
								that.setModel(oModel, 'deleteRecords');
								that.setModel(oModel, 'changedRecords');
								that.setModel(oModel, 'newRecords');
								if (that.oReadOnlyToDoTemplate) {
									that.rebindTableWithTemplate(that.oToDoTable, "TodoList>/", that.oReadOnlyToDoTemplate, "Navigation");
								}
								oControl.setProperty("/editTodoVisibility", true);
								oControl.setProperty("/todoDone", false);
								oControl.setProperty("/todoCancel", false);
								oControl.setProperty("/showFooter", false);
								oControl.setProperty("/todoDataChanged", false);
								oControl.setProperty("/isToDoChanged", false);

								that.hideBusy(true);
							},
							error: function (oError) {
								that.hideBusy(true);
								that.oErrorHandler.processError(oError);
							}
						});

					}, true);
			oModel.attachBatchRequestCompleted(this.onSubmissionSuccess.bind(this));
		},
		onStartDateChange: function (oEvent) {
			var that = this;
			var oCalendar = oEvent.getSource();
			var oControl = this.getModel("controls");
			var curDate = new Date();
			curDate = new Date(oCalendar.getStartDate());
			// if (curDate > this.minDate && curDate < this.maxDate) {

			// } else {
			// 	curDate = this.minDate;
			// }
			if (sap.ui.Device.system.phone === true) {
				this.dateFrom = this.getFirstDayOfWeek(oCalendar.getStartDate(), that.firstDayOfWeek);
				// curDate.setDate(oCalendar.getStartDate().getDate() + 6);
				this.dateTo = this.getLastDayOfWeek(oCalendar.getStartDate(), that.firstDayOfWeek);
				this.startdate = this.getFirstDayOfWeek(oCalendar.getStartDate(), that.firstDayOfWeek);
				this.enddate = this.getFirstDayOfWeek(oCalendar.getStartDate(), that.firstDayOfWeek);
			} else {
				this.dateFrom = this.getFirstDayOfWeek(oCalendar.getStartDate(), that.firstDayOfWeek);
				curDate.setMonth(curDate.getMonth() + 2, 0);
				this.dateTo = this.getLastDayOfWeek(curDate, that.firstDayOfWeek);
				this.startdate = this.getFirstDayOfWeek(oCalendar.getStartDate(), that.firstDayOfWeek);
				this.enddate = this.getLastDayOfWeek(oCalendar.getStartDate(), that.firstDayOfWeek);
			}
			this.showBusy();
			if (this.oReadOnlyTemplate) {
				this.rebindTableWithTemplate(this.oTable, "TimeData>/", this.oReadOnlyTemplate, "Navigation");
			}
			oControl.setProperty('/overviewCancel', false);
			oControl.setProperty('/sendForApproval', false);
			oControl.setProperty('/submitDraft', false);
			oControl.setProperty('/todoDone', false);
			oControl.setProperty('/todoCancel', false);
			oControl.setProperty('/onEdit', "None");
			oControl.setProperty('/submitDraft', false);
			oControl.setProperty('/duplicateVisibility', false);
			oControl.setProperty('/duplicateWeekVisibility', false);
			oControl.setProperty('/overviewEdit', true);
			oControl.setProperty('/overviewEditable', false);
			that.getTimeEntries(new Date(that.dateFrom), new Date(that.dateTo));
			// that.bindTable(new Date(this.startdate), new Date(this.enddate));
		},

		onSendApproval: function () {
			var that = this;
			this.showBusy();
			var submitEntries = this.fetchRecords(true);
			var submitEntries = this.getModel("TimeData");
			for (var c = 0; c < submitEntries.length; c++) {
				if ((submitEntries[c].TimeEntryDataFields.CATSHOURS == 0) && (submitEntries[c].TimeEntryDataFields.CATSAMOUNT == 0) && (
						submitEntries[c].TimeEntryDataFields.CATSQUANTITY == 0)) {
					//If it is a zero hour/amount/quantity
					if ((submitEntries[c].TimeEntryDataFields.BEGUZ == 0) && (submitEntries[c].TimeEntryDataFields.ENDUZ == 0)) {
						submitEntries.splice(c, 1);
						//If start time and end time are also not specified then do not consider record for submit
						c--;
					}
				}
			}
			var selectedItems;
			var data;
			var oModel = $.extend(true, {}, this.oDataModel);
			var oControl = this.getModel("controls");
			this.batches = submitEntries;
			var mParameters;
			oModel.setChangeBatchGroups({
				"*": {
					groupId: "TimeEntry",
					changeSetId: "TimeEntry",
					single: true
				}
			});
			oModel.setDeferredGroups(["TimeEntry"]);
			oModel
				.refreshSecurityToken(
					function (oData) {
						if (submitEntries.length === 0) {
							that.hideBusy(true);
							var toastMsg = that.oBundle.getText("noEntriesToSubmit");
							sap.m.MessageToast.show(toastMsg, {
								duration: 3000
							});
							return;
						}
						for (var i = 0; i < submitEntries.length; i++) {
							var obj = {
								properties: submitEntries[i],
								changeSetId: "TimeEntry",
								groupId: "TimeEntry"
							};
							oModel
								.createEntry(
									"/TimeEntryCollection",
									obj);
						}

						oModel.submitChanges({
							groupId: "TimeEntry",
							changeSetId: "TimeEntry",
							success: function (oData, res) {
								// that.responses = oData.__batchResponses[0].__changeResponses;
								if (that.oMessagePopover) {
									// that.oMessagePopover.removeAllItems();
									that.oMessagePopover.destroy();
									sap.ui.getCore().getMessageManager().removeAllMessages();
									// that.oMessagePopover.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "message");
								}
								var error = false;
								var entries = that.getModel('TimeData').getData();
								var oMessages = [];
								if (!oData.__batchResponses[0].__changeResponses) {
									var messageText = "";
									var messageType = "";
									var errorJSON = JSON.parse(oData.__batchResponses[0].response.body);
									var totalLength = errorJSON.error.innererror.errordetails.length - 1;
									sap.ui.getCore().getMessageManager().removeAllMessages();
									// Additional coding to handle error message(s)
									for (var len = 0; len < totalLength; len++) {
										messageText = errorJSON.error.innererror.errordetails[len].message;
										messageType = errorJSON.error.innererror.errordetails[len].severity;
										if (messageType == "warning") {
											sap.ui.getCore().getMessageManager().addMessages(
												new sap.ui.core.message.Message({
													message: messageText,
													description: messageText,
													type: sap.ui.core.MessageType.Warning,
													processor: that.getOwnerComponent().oMessageProcessor,
													code: "TimeData"
												}));
										} else {
											sap.ui.getCore().getMessageManager().addMessages(
												new sap.ui.core.message.Message({
													message: messageText,
													description: messageText,
													type: sap.ui.core.MessageType.Error,
													processor: that.getOwnerComponent().oMessageProcessor,
													code: "TimeData"
												}));
											error = true;
										}
									}
									//if message type is error then add the last error message
									if (!errorJSON.error.innererror.errordetails[len].code.match("/IWBEP")) {
										messageText = errorJSON.error.innererror.errordetails[len].message;
										sap.ui.getCore().getMessageManager().addMessages(
											new sap.ui.core.message.Message({
												message: messageText,
												description: messageText,
												type: sap.ui.core.MessageType.Error,
												processor: that.getOwnerComponent().oMessageProcessor,
												code: "TimeData"
											}));
										error = true;
									}
									that.hideBusy(true);
									//	return;
								} else {
									for (var i = 0; i < oData.__batchResponses[0].__changeResponses.length; i++) {
										var entry = $.grep(entries, function (element, ind) {
											if (element.RecRowNo) {
												return element.RecRowNo === parseInt(oData.__batchResponses[0].__changeResponses[i].data.RecRowNo).toString();
											}
										});
										if (oData.__batchResponses[0].__changeResponses[i].data.ErrorMsg !== "") {
											error = true;
											if (entry.length > 0) {
												entry[0].valueState = "Error";
												entry[0].highlight = "Error";
												entry[0].valueStateText = oData.__batchResponses[0].__changeResponses[i].data.ErrorMsg;
												oMessages.push(new sap.ui.core.message.Message({
													message: oData.__batchResponses[0].__changeResponses[i].data.ErrorMsg,
													description: oData.__batchResponses[0].__changeResponses[i].data.ErrorMsg,
													type: sap.ui.core.MessageType.Error,
													processor: that.getOwnerComponent().oMessageProcessor,
													additionalText: parseInt(oData.__batchResponses[0].__changeResponses[i].data.RecRowNo),
													code: "TimeData"
												}));
											}
											error = true;

										} else {
											if (entry.length > 0) {
												entry[0].valueState = "Success";
												entry[0].highlight = "Success";
											}
										}
									}
								}
								sap.ui.getCore().getMessageManager().addMessages(
									oMessages
								);

								// that.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "message");
								var toastMsg;
								if (!error) {
									toastMsg = that.oBundle.getText("timeEntriesSaved");
								} else {
									toastMsg = that.oBundle.getText("resubmitTimeEntries");
								}
								sap.m.MessageToast.show(toastMsg, {
									duration: 1000
								});
								that.getTimeEntries(new Date(that.minDate), new Date(that.maxDate));
								that.getToDoList();
								sap.ui.getCore().getMessageManager().removeAllMessages();
								var data = [];
								var oModel = new JSONModel();
								oModel.setData(data);
								that.setModel(oModel, 'deleteRecords');
								that.setModel(oModel, 'changedRecords');
								that.setModel(oModel, 'newRecords');
								if (that.oReadOnlyTemplate) {
									that.rebindTableWithTemplate(that.oTable, "TimeData>/", that.oReadOnlyTemplate, "Navigation");
								}
								oControl.setProperty("/overviewEdit", true);
								oControl.setProperty('/overviewEditable', false);
								oControl.setProperty("/overviewCancel", false);
								oControl.setProperty("/submitDraft", false);
								oControl.setProperty("/sendForApproval", false);
								oControl.setProperty("/duplicateVisibility", false);
								oControl.setProperty("/showFooter", false);
								oControl.setProperty("/duplicateWeekVisibility", false);
								oControl.setProperty("/onEdit", "None");
								oControl.setProperty('/overviewDataChanged', false);
								oControl.setProperty("/isOverviewChanged", false);
								that.setModel(oControl, "controls");
								that.calculateChangeCount();

								that.hideBusy(true);
								that.oTable.focus();
							},
							error: function (oError) {
								that.hideBusy(true);
								that.oErrorHandler.processError(oError);
							}
						});

					}, true);
			oModel.attachBatchRequestCompleted(this.onSubmissionSuccess.bind(this));
			oModel.attachBatchRequestFailed(function () {
				that.handleMessagePopover(new sap.m.Button());
			});

		},
		timeTableValidate: function(oEvent,oRelease){
			var that = this;
			
			sap.ui.getCore().getMessageManager().removeAllMessages();
			
			var isValid = true;
			
			var newLines = []
			
			this.oTimeTable.getItems().forEach( (oItem) => {
				var i = 0, newLine = {};
				oItem.getCells().forEach( (oControl) => {
					
/*							if(newLine.Awart === "PRES" &&  newLine.Rproj === '' ){
								oControl.setValueState(sap.ui.core.ValueState.Error);
								oControl.setValueStateText("Veuillez saisir un élément d'OTP");
								oControl.focus();
								isValid = false;
							}*/
					
					if(typeof oControl.getValueState === "function"
						&& oControl.getEnabled() === true
						&& oControl.getVisible() === true
						&& oControl.getValueState() === sap.ui.core.ValueState.Error){
						oControl.focus();
						isValid = false;
					}
					switch(i++){
						case 0://AWART
							newLine.Awart = oControl.getSelectedKey();
							break;
						case 1://RPROJ
							newLine.Rproj = oControl.getValue();
							break;
						case 2://Day1
							newLine.Day1 = oControl.getValue();
							break;
						case 3://Day2
							newLine.Day2 = oControl.getValue();
							break;
						case 4://Day3
							newLine.Day3 = oControl.getValue();
							break;
						case 5://Day4
							newLine.Day4 = oControl.getValue();
							break;
						case 6://Day5
							newLine.Day5 = oControl.getValue();
							break;
						case 7://Day6
							newLine.Day6 = oControl.getValue();
							break;		
						case 8://Day7
							newLine.Day7 = oControl.getValue();
							break;			
					}
				});
				
/*				newLine.Pernr = this.empId;
				newLine.Weeknr = this.getModel("json").getData().WeekNumber;*/
				
				/*
				if( oItem.getBindingContextPath() === undefined ){
					newLine.Action = 'C';
					newLines.push(newLine);
				}else{
					newLine.Action = 'U';
				}
				*/
				//this.getModel("json").
				
			});
			
			var totals = this.getModel("totals").getData();
			var that = this;
			this.getModel("json").getData().TimeEntries.forEach( (entry) => {
				var Days=
				parseInt(entry.Day1) + 
				parseInt(entry.Day2) +
				parseInt(entry.Day3) +
				parseInt(entry.Day4) +
				parseInt(entry.Day5) +
				parseInt(entry.Day6) + 
				parseInt(entry.Day7);
				if(Days > 0 && entry.Awart === "PRES" && ( entry.Rproj === "" || entry.Rproj === "00000000")){
					for(var i=1;i<8;i++){
						
						if(totals["Holiday"+i] === ""){
							
							that.addErrorMsg("Veuillez saisir un élément d'OTP");
							isValid = false;
							break;
						}
						
					}
				}
			}); 
			
			if(oRelease){
				isValid = isValid && this.checkTotals();
			}
			
			return isValid;
		},
		
		onSubmitDraft: function (oEvent, oRelease = false) {
			var that = this;
			if(! this.timeTableValidate(oEvent,oRelease) ){
				
				this.showPopover();
				
				return;
			}
			
			//var submitEntries = this.fetchRecords(false);
			//var submitEntries = this.getModel("TimeData").getData();
			//var submitEntries = this.newLines;
			//var submitEntries = this.getModel("json").getData().TimeEntries.find( (el)=> el.AllowEdit == true)
			var submitEntries = _.filter(this.getModel("json").getData().TimeEntries, (el)=> el.AllowEdit == true);
			if(typeof submitEntries.length === "undefined"){
				submitEntries = [ submitEntries ];
			}
			/*
			submitEntries.map((el) => el.Action = 'C');
			this.oTimeTable.getBinding("items").getCurrentContexts().forEach( (context) => {
				var oDataLine = that.getModel("VH").getObject(context.sPath);
				oDataLine.Action = 'U';
				if(oDataLine.AllowEdit === true){
					submitEntries.push(oDataLine);
				}
			});
			debugger;
/*			var deletedEntries = this.getModel("deleteRecords").getData();*/
/*			if(deletedEntries.length > 0){
				deletedEntries.map((el) => el.AllowEdit = 'D');
				submitEntries = submitEntries.concat(deletedEntries);
			}*/
			//var selectedItems;
			
			//var oModel = $.extend(true, {}, this.oDataModel);
			var oModel = $.extend(true, {}, this.getModel("VH"));
			var oControl = this.getModel("controls");
			this.batches = submitEntries;
			oModel.setChangeBatchGroups({
				"*": {
					groupId: "TimeEntries",
					changeSetId: "TimeEntries",
					single: false
				}
			});
			oModel.setDeferredGroups(["TimeEntries"]);
			oModel
				.refreshSecurityToken(
					function (oData) {
						for (var i = 0; i < submitEntries.length; i++) {
							
							var temp = that.newTimeInstance();
							
							Object.keys(submitEntries[i]).filter(key => key in temp).forEach(key => 
								temp[key] = submitEntries[i][key] == "" ? temp[key] : submitEntries[i][key]
							);
							
							temp.Weeknr = that.startdate.getWeek().toString();
							
							temp.Counter = "";
							
							temp.Pernr = that.getPernr().getData();
							//temp.Workdate = that.startdate;//submitEntries[i].TimeEntryDataFields.WORKDATE;
							//temp.Workdate.setHours(5);
							temp.ProfileId = that.profileInfo.ProfileId;
							
							temp.Day1 = temp.Day1.toString() === ""?"0":temp.Day1.toString();
							temp.Day2 = temp.Day2.toString() === ""?"0":temp.Day2.toString();
							temp.Day3 = temp.Day3.toString() === ""?"0":temp.Day3.toString();
							temp.Day4 = temp.Day4.toString() === ""?"0":temp.Day4.toString();
							temp.Day5 = temp.Day5.toString() === ""?"0":temp.Day5.toString();
							temp.Day6 = temp.Day6.toString() === ""?"0":temp.Day6.toString();
							temp.Day7 = temp.Day7.toString() === ""?"0":temp.Day7.toString();
							
							if(typeof submitEntries[i].__metadata === "undefined"){
								temp.Action = oRelease?'S':'C';
							}else{			
								temp.Action = oRelease?'V':'U';
							}
							
							temp.Weekstatus = temp.Weekstatus.toString();
							var obj = {
								properties: temp,
								changeSetId: "TimeEntries",
								groupId: "TimeEntries"
							};
							//if(temp.Rproj !== "" && temp.Awart !== "" && temp.Day1.concat(temp.Day2,temp.Day3,temp.Day4,temp.Day5,temp.Day6,temp.Day7) !== null){
							if(temp.Awart !== ""){//&& temp.Day1.concat(temp.Day2,temp.Day3,temp.Day4,temp.Day5,temp.Day6,temp.Day7) !== "0000000"){
								delete obj.properties.Workdate;
								obj.properties.StartDate = that.startdate.toString("yyyy-MM-dd")+"T00:00:00";
								obj.properties.EndDate = that.enddate.toString("yyyy-MM-dd")+"T00:00:00";
								// delete obj.properties.EndDate;
								delete obj.properties.OldRproj;
								delete obj.properties.OldAwart;
								delete obj.properties.Lstar;
								delete obj.properties.Meinh;
								oModel.createEntry("/TimeEntries",obj);	
								console.log("New C Action for TimeEntries" , obj);
							}else{
								//Remove the line insted
								var link = "/TimeEntries(Weeknr='$Weeknr',Pernr='$Pernr',Weekstatus='$Weekstatus',Awart='$Awart',Rproj='$Rproj')";
								link	=	link.replace("$Weeknr",obj.properties.Weeknr)
											.replace("$Pernr",obj.properties.Pernr)
											.replace("$Weekstatus",'0'+obj.properties.Weekstatus)
											.replace("$Awart",obj.properties.Awart)
											.replace("$Rproj",obj.properties.Rproj);
								that.getModel("VH").remove(link);
								console.log("New D Action for TimeEntries" , obj);
							}
						}
						oModel.submitChanges({
							groupId: "TimeEntries",
							changeSetId: "TimeEntries",
							success: function (oData, res) {
/*								if (!oData.__batchResponses[0].__changeResponses) {
									// for (var i=0; i<that.batches.length;i++){
									// 	that.batches[i].TimeEntryDataFields.WORKDATE = new Date(that.batches[i].TimeEntryDataFields.WORKDATE);
									// }
									return;
								}*/
								if( oData.__batchResponses[0].response !== undefined){
									var oMessageProcessor = that.getView().getModel();
									var er = JSON.parse(oData.__batchResponses[0].response.body).error;
									sap.ui.getCore().getMessageManager().addMessages(
									    new sap.ui.core.message.Message({
									        message: er.message.value,
									        type: sap.ui.core.MessageType.Error,
									        target: "/Dummy",
									        processor: oMessageProcessor
									     })
									);
									MessageBox.error(er.message.value);
								}else{
									var toastMsg = oRelease?that.oBundle.getText("timeEntriesSent"):that.oBundle.getText("timeEntriesSaved");
									sap.m.MessageToast.show(toastMsg, {
										duration: 1000
									});
								//
								//that.getTimeEntries(new Date(that.dateFrom), new Date(that.dateTo));
								//that._bindTimeTable(new Date(that.dateFrom), new Date(that.dateTo));
								sap.ui.getCore().getMessageManager().removeAllMessages();
								var data = [];
								var oModel = new JSONModel();
								oModel.setData(data);
								that.setModel(oModel, 'deleteRecords');
								that.setModel(oModel, 'changedRecords');
								that.setModel(oModel, 'newRecords');
								
								/*
								if (that.oReadOnlyTemplate) {
									that.rebindTableWithTemplate(that.oTable, "TimeData>/", that.oReadOnlyTemplate, "Navigation");
								}*/
								
								oControl.setProperty("/overviewEdit", true);
								oControl.setProperty('/overviewEditable', false);
								oControl.setProperty("/overviewCancel", false);
								oControl.setProperty("/submitDraft", false);
								oControl.setProperty("/showFooter", false);
								oControl.setProperty("/sendForApproval", false);
								oControl.setProperty("/duplicateVisibility", false);
								oControl.setProperty("/duplicateWeekVisibility", false);
								oControl.setProperty("/onEdit", "None");
								that.setModel(oControl, "controls");
								that.getTimeEntries(new Date(that.dateFrom), new Date(that.dateTo));
								}
							},
							error: function (oError) {
								that.oErrorHandler.processError(oError);
							}
						});

					}, true);
			//oModel.attachBatchRequestCompleted(this.onSubmissionSuccess.bind(this));
		},
		addErrorMsg: function(msg){
			var oMessageProcessor = this.getView().getModel();
			new sap.ui.core.message.Message({
				message: msg,
				type: sap.ui.core.MessageType.Error,
				target: "/Dummy",
				processor: oMessageProcessor
			 });
			MessageBox.error(msg);
		},
		onSubmitAproval: function (oEvent) {
			this.onSubmitDraft(oEvent,true);
		},
		onSubmissionSuccess: function (oEvent) {
			this.getTimeEntries(new Date(this.dateFrom), new Date(this.dateTo));
		},

		fetchRecords: function (oRelease) {
			var timeEntries = [];
			var deleteRecords = this.getModel('deleteRecords').getData();
			// var entries = $.extend(true, [], this.getModel('TimeData').getData());
			var entries = this.getModel('TimeData').getData();
			var newRecords = $.grep(entries, function (element, index) {
				return element.TimeEntryOperation == 'C';
			});
			var changedRecords = $.grep(entries, function (element, index) {
				return element.TimeEntryOperation == 'U';
			});
			var selectedRecords = $.grep(entries, function (element, index) {
				return element.TimeEntryOperation == 'R';
			});

			for (var i = 0; i < changedRecords.length; i++) {
				changedRecords[i].TimeEntryOperation = 'U';
				if (changedRecords[i].SetDraft) {
					changedRecords[i].AllowRelease = '';
					// delete changedRecords[i].SetDraft;
				} else {
					changedRecords[i].AllowRelease = 'X';
					// delete changedRecords[i].SetDraft;
				}
			}
			for (var i = 0; i < newRecords.length; i++) {
				newRecords[i].TimeEntryOperation = 'C';
				if (newRecords[i].SetDraft) {
					newRecords[i].AllowRelease = '';
					// delete newRecords[i].SetDraft;
				} else {
					newRecords[i].AllowRelease = 'X';
					// delete newRecords[i].SetDraft;
				}
			}
			for (var i = 0; i < deleteRecords.length; i++) {

				deleteRecords[i].TimeEntryOperation = 'D';

				if (deleteRecords[i].SetDraft) {
					deleteRecords[i].AllowRelease = '';
					// delete deleteRecords[i].SetDraft;
				} else {
					deleteRecords[i].AllowRelease = 'X';
					// delete deleteRecords[i].SetDraft;
				}
			}
			if (deleteRecords.length > 0) {
				for (var i = 0; i < deleteRecords.length; i++) {
					timeEntries.push(deleteRecords[i]);
				}

			}
			if (changedRecords.length > 0) {
				for (var i = 0; i < changedRecords.length; i++) {
					timeEntries.push(changedRecords[i]);
				}
			}
			if (newRecords.length > 0) {
				for (var i = 0; i < newRecords.length; i++) {
					timeEntries.push(newRecords[i]);
				}
			}
			// }
			for (var i = 0; i < timeEntries.length; i++) {
				timeEntries[i].RecRowNo = (i + 1).toString();
				if (timeEntries[i].TimeEntryDataFields.CATSHOURS === "") {
					timeEntries[i].TimeEntryDataFields.CATSHOURS = "0.00";
				}
			}
			var copiedEntries = $.extend(true, [], timeEntries);
			for (var i = 0; i < copiedEntries.length; i++) {
				delete copiedEntries[i].target;
				delete copiedEntries[i].totalHours;
				delete copiedEntries[i].addButton;
				delete copiedEntries[i].addButtonEnable;
				delete copiedEntries[i].deleteButtonEnable;
				delete copiedEntries[i].deleteButton;
				delete copiedEntries[i].TimeEntryDataFields.ERSDA;
				delete copiedEntries[i].TimeEntryDataFields.LAEDA;
				delete copiedEntries[i].TimeEntryDataFields.LAETM;
				delete copiedEntries[i].TimeEntryDataFields.ERSTM;
				delete copiedEntries[i].TimeEntryDataFields.APDAT;
				delete copiedEntries[i].HeaderData;
				delete copiedEntries[i].highlight;
				delete copiedEntries[i].SetDraft;
				delete copiedEntries[i].valueStateText;
				delete copiedEntries[i].valueState;
				copiedEntries[i].TimeEntryDataFields.WORKDATE = this.formatter.formatToBackendString(copiedEntries[i].TimeEntryDataFields.WORKDATE) +
					"T00:00:00";
				copiedEntries[i].TimeEntryDataFields.CATSHOURS = parseFloat(copiedEntries[i].TimeEntryDataFields.CATSHOURS).toFixed(2);
			}
			/**
			 * @ControllerHook Modify the post object
			 * This hook method can be used to modify the object before the post call
			 * It is called when the decision options for the detail item are fetched successfully
			 * @callback hcm.mytimesheet.view.S3~extHookChangeObjectBeforeSubmit
			 * @param {object} Post Object
			 * @return {object} Final Post Object
			 */

			if (this.extHookChangeObjectBeforeSubmit) {
				copiedEntries = this.extHookChangeObjectBeforeSubmit(copiedEntries);
			}
			return copiedEntries;
		},
		fetchToDoRecords: function () {
			var timeEntries = [];
			// var deleteRecords = this.getModel('deleteRecords').getData();
			var entries = this.getModel('TodoList').getData();
			var newRecords = $.grep(entries, function (element, index) {
				return element.TimeEntryOperation == 'C';
			});
			var changedRecords = $.grep(entries, function (element, index) {
				return element.TimeEntryOperation == 'U';
			});
			for (var i = 0; i < changedRecords.length; i++) {

				changedRecords[i].TimeEntryOperation = 'U';
				changedRecords[i].AllowRelease = 'X';
			}
			for (var i = 0; i < newRecords.length; i++) {

				newRecords[i].TimeEntryOperation = 'C';
				newRecords[i].AllowRelease = 'X';
			}
			if (changedRecords.length > 0) {
				for (var i = 0; i < changedRecords.length; i++) {
					timeEntries.push(changedRecords[i]);
				}
			}
			if (newRecords.length > 0) {
				for (var i = 0; i < newRecords.length; i++) {
					timeEntries.push(newRecords[i]);
				}
			}
			for (var i = 0; i < timeEntries.length; i++) {
				timeEntries[i].RecRowNo = (i + 1).toString();
				if (timeEntries[i].TimeEntryDataFields.CATSHOURS === "") {
					timeEntries[i].TimeEntryDataFields.CATSHOURS = "0.00";
				}
			}
			var copiedEntries = $.extend(true, [], timeEntries);
			for (var i = 0; i < copiedEntries.length; i++) {
				delete copiedEntries[i].target;
				delete copiedEntries[i].total;
				delete copiedEntries[i].addButton;
				delete copiedEntries[i].addButtonEnable;
				delete copiedEntries[i].deleteButtonEnable;
				delete copiedEntries[i].deleteButton;
				delete copiedEntries[i].TimeEntryDataFields.ERSDA;
				delete copiedEntries[i].TimeEntryDataFields.LAEDA;
				delete copiedEntries[i].TimeEntryDataFields.LAETM;
				delete copiedEntries[i].TimeEntryDataFields.ERSTM;
				delete copiedEntries[i].TimeEntryDataFields.APDAT;
				delete copiedEntries[i].HeaderData;
				delete copiedEntries[i].highlight;
				delete copiedEntries[i].SetDraft;
				delete copiedEntries[i].valueStateText;
				delete copiedEntries[i].valueState;
				delete copiedEntries[i].missing;
				delete copiedEntries[i].currentMissing;
				delete copiedEntries[i].sendButton;
				delete copiedEntries[i].total;
				copiedEntries[i].TimeEntryDataFields.WORKDATE = this.formatter.formatToBackendString(copiedEntries[i].TimeEntryDataFields.WORKDATE) +
					"T00:00:00";
				copiedEntries[i].TimeEntryDataFields.CATSHOURS = parseFloat(copiedEntries[i].TimeEntryDataFields.CATSHOURS).toFixed(2);
			}
			/**
			 * @ControllerHook Modify the post object
			 * This hook method can be used to modify the object before the post call
			 * It is called when the decision options for the detail item are fetched successfully
			 * @callback hcm.mytimesheet.view.S3~extHookChangeObjectBeforeSubmit
			 * @param {object} Post Object
			 * @return {object} Final Post Object
			 */

			if (this.extHookChangeObjectBeforeSubmit) {
				copiedEntries = this.extHookChangeObjectBeforeSubmit(copiedEntries);
			}
			return copiedEntries;
		},
		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function () {},

		onSearch: function (oEvent) {

		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function () {
			// var oTable = this.byId("table");
			// oTable.getBinding("items").refresh();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showObject: function (oItem) {
			// this.getRouter().navTo("object", {
			// 	objectId: oItem.getBindingContext().getProperty("EmployeeID")
			// });
		},
		onAssignmentsLoaded: function (oEvent) {
			var that = this;
			this.empID = oEvent.getParameter('defaultAssignment');
			// this.setModel(oEvent.getSource().getModel("commonModel"),"libCommon");
			this.setPernr(this.empID);
			this.initPernr(this.empID);
			this.showBusy();
			this.getFieldTexts("UNIT");
			this.getEmployeeDetails(this.empID);
			this.getCustomerEmployeeDetails(this.empID);
			new Promise(
				function (fnResolve, fnReject) {
					that.getProfileFields(that.empID);
					that.getWorklistFields(that.empID);
					fnResolve(that.getTasks(true));
					fnReject();
				}
			);
			this.getTimeEntries(that.dateFrom, that.dateTo);
			this.getToDoList();
			// this.getProfileFields(this.empID);
			this._updateWeekNumber();
		},
		onAssignmentSwitch: function (oEvent) {
			var that = this;
			this.empID = oEvent.getParameter('selectedAssignment');
			this.setPernr(this.empID);
			this.initPernr(this.empID);
			this.getTimeEntries(this.dateFrom, this.dateTo);
			this.getEmployeeDetails(this.empID);
			// this.getTasks();
			this.getToDoList();
			// this.getProfileFields(this.empID);
			new Promise(
				function (fnResolve, fnReject) {
					that.getProfileFields(that.empID);
					that.getWorklistFields(that.empID);
					fnResolve(that.getTasks(true));
					fnReject();
				}
			);

		},
		onSwitchProfile: function (oEvent) {
			var that = this;
			that.ProfilesModel = that.getOwnerComponent().getModel();
			var mProfilesParameters = {
				success: function (oData) {
					var oProfilesModel = new sap.ui.model.json.JSONModel(oData.results);
					that.getView().setModel(oProfilesModel, "ProfilesModel");
					var profileListRef = that.byId("SwitchProfileList");
					for (var q = 0; q < profileListRef.getItems().length; q++) {
						if (profileListRef.getItems()[q].getTitle() === that.profileId) {
							profileListRef.getItems()[q].setSelected(true);
						}
					}
				},
				error: function (oError) {
					that.oErrorHandler.processError(oError);
				}
			};
			that.ProfilesModel
				.read("/MultipleProfilesSet", mProfilesParameters);
			// create dialog lazily
			if (!that.oSwitchProfileDialog) {
				var oDialogController = {
					onConfirm: function (evnt) {
						var profileListRef = that.byId("SwitchProfileList");
						if (profileListRef.getSelectedItem() !== null) {
							var selectedProfile = profileListRef.getSelectedItem().getCustomData()[0].getProperty("value");
						}
						// 	this.empID = oEvent.getParameter('selectedAssignment');
						// 	this.setPernr(this.empID);
						// 	this.initPernr(this.empID);
						that.profileId = selectedProfile;
						that.getTimeEntries(that.dateFrom, that.dateTo);
						that.getEmployeeDetails(that.empID);
						that.getToDoList();
						new Promise(
							function (fnResolve, fnReject) {
								that.getProfileFields(that.empID);
								that.getWorklistFields(that.empID);
								fnResolve(that.getTasks(true));
								fnReject();
							}
						);
						that.oSwitchProfileDialog.close();
					},
					onCancel: function (evnt) {
						that.oSwitchProfileDialog.close();
					}
				};
				// create dialog via fragment factory
				that.oSwitchProfileDialog = sap.ui.xmlfragment(that.getView().getId(),
					"hcm.fab.mytimesheet.view.fragments.SwitchProfilePopOver",
					oDialogController);
				// connect dialog to view (models, lifecycle)
				that.getView().addDependent(that.oSwitchProfileDialog);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), that.oSwitchProfileDialog);
			that.oSwitchProfileDialog.open();
		},
		getEmployeeDetails: function (empID) {
			var that = this;
			var oModel = new JSONModel();
			var f = [];
			var c = new sap.ui.model.Filter({
				path: "EmployeeNumber",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: this.empID
			});
			f.push(c);
			this.oCEModel.createKey("EmployeeDetailSet", {
				EmployeeNumber: empID,
				ApplicationId: 'CATS'
			});
			var mParameters = {
				filters: f,
				success: function (oData, oResponse) {
					oModel.setData(oData.results[0]);
					that.setModel(oModel, "libCommon");
				},
				error: function (oError) {
					that.oErrorHandler.processError(oError);
				}
			};
			this.oCEModel.read('/EmployeeDetailSet', mParameters);
		},
		getCustomerEmployeeDetails: function (empID) {
			var that = this;
			var mParameters = {
				success: function (oData, oResponse) {
					var jsonData = that.getModel("json").getData();
					jsonData.HoursMin = parseInt(oData.results[0].HoursMin);
					jsonData.HoursMax = parseInt(oData.results[0].HoursMax);
					that.getModel("json").setData(jsonData);
				},
				error: function (oError) {
					that.oErrorHandler.processError(oError);
				}
			};
			this.getModel("VH").read('/Params', mParameters);
		},
		onTaskAll: function (oEvent) {
			var oFilter = [];
			this.oTaskTable.getBinding('items').filter(oFilter);
		},
		onTaskActive: function (oEvent) {
			var oFilter = [];
			var selectedKey = true;
			oFilter.push(new Filter("AssignmentStatus", FilterOperator.EQ, selectedKey));

			this.oTaskTable.getBinding('items').filter(oFilter);
		},
		onTaskInactive: function (oEvent) {
			var oFilter = [];
			var selectedKey = false;
			oFilter.push(new Filter("AssignmentStatus", FilterOperator.EQ, selectedKey));
			this.oTaskTable.getBinding('items').filter(oFilter);
		},
		worklistRouteMatched: function (oEvent) {
			var oModel = this.getGlobalModel("TaskReload");
			var oControls = this.getGlobalModel("controls");
			if (oModel) {
				var oTasks = oModel.getData();
				if (oTasks.reloadTasks) {
					var toastMsg = this.oBundle.getText("taskSaved");
					this.getTasks(false);
					sap.m.MessageToast.show(toastMsg, {
						duration: 5000
					});
					oTasks.reloadTasks = false;
				}
			}
			if (oControls && oControls.getProperty('/groupReload') === true) {
				var toastMsg = this.oBundle.getText("performGroup");
				this.getTasks(false);
				sap.m.MessageToast.show(toastMsg, {
					duration: 5000
				});
				oControls.setProperty('/groupReload', false);
			}
			// this.getToDoList();
		},
		onMenuAction: function (oEvent) {
			if (oEvent.getParameter("item").getKey() === "selectFromWorklist") {
				this.onImportWorklist();
			} else if (oEvent.getParameter("item").getKey() === "selectFromAdminlist") {
				this.onImportAdminlist();
			} else if (oEvent.getParameter("item").getKey() === "selectFromAssignment") {
				this.onTaskCreate(oEvent);
			} else if (oEvent.getParameter("item").getKey() === "selectFromGroups") {
				this.onCreateGroup(oEvent);
			}
		},
		onImportWorklist: function (oEvent) {
			var that = this;
			this.showBusy();
			var oModel = new JSONModel();
			var oModel_wlist = new JSONModel(); //Note
			var worklist = {};
			var worklistEntry = [];
			var data;
			var mParameters = {
				success: function (oData, oResponse) {
					oModel.setData(oData.results);
					oModel_wlist.setData(oData.results); //Note
					that.setModel(oModel_wlist, "Worklist"); //Note
					// that.setModel(oModel, "Worklist");
					data = oData.results;
					var worklistProfileFields = that.getModel("WorklistProfileFields").getData();
					for (var j = 0; j < data.length; j++) {
						for (var i = 0; i < worklistProfileFields.length; i++) {
							if (data[j].WorkListDataFields[worklistProfileFields[i].FieldName] !== undefined) {
								worklist[worklistProfileFields[i].FieldName] = data[j].WorkListDataFields[worklistProfileFields[i].FieldName];
							} else {
								worklist[worklistProfileFields[i].FieldName] = "";
							}
						}
						var finaltask = $.extend(true, {}, worklist);
						worklistEntry.push(finaltask);
						oModel.setData(worklistEntry);
						that.setModel(oModel, "WorklistFields");
					}
					that.worklistPopover();
					that.hideBusy(true);
				},
				error: function (oError) {
					that.hideBusy(true);
					that.oErrorHandler.processError(oError);
				}
			};
			this.oDataModel.read('/WorkListCollection', mParameters);
		},
		onImportAdminlist: function (oEvent) {
			var that = this;
			this.showBusy();
			var oModel = new sap.ui.model.json.JSONModel();
			var AdminTaskModel = new sap.ui.model.json.JSONModel();
			// var oControl;
			var obj;
			var AdminTaskFields = [];
			var adminTask = {};
			var a = new sap.ui.model.Filter({
				path: "Pernr",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: this.empID
			});
			var b = new sap.ui.model.Filter({
				path: "ValidityStartDate",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: new Date()
			});
			var c = new sap.ui.model.Filter({
				path: "ValidityEndDate",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: new Date()
			});
			var d = new sap.ui.model.Filter({
				path: "AdminAssignmentFlag",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "X"
			});
			var f = [];
			f.push(b);
			f.push(c);
			f.push(a);
			f.push(d);
			var mParameters = {
				filters: f,
				success: function (oData, oResponse) {
					var tempDate;
					for (var l = 0; l < oData.results.length; l++) {
						try {
							tempDate = new Date(oData.results[l].ValidityStartDate);
							oData.results[l].ValidityStartDate = new Date(tempDate.getUTCFullYear(), tempDate.getUTCMonth(), tempDate.getUTCDate());
							tempDate = new Date(oData.results[l].ValidityEndDate);
							oData.results[l].ValidityEndDate = new Date(tempDate.getUTCFullYear(), tempDate.getUTCMonth(), tempDate.getUTCDate());
						} catch (o) {
							//retain dates in local format
						}
					}
					that.adminTasks = oData.results;
					oModel.setData(that.adminTasks);
					that.setModel(oModel, "AdminTasks");
					if (that.adminTasks.length === 0) {
						that.noAssignmentsDialog();
					}
					for (var j = 0; j < that.adminTasks.length; j++) {
						for (var i = 0; i < that.profileFields.length; i++) {
							if (that.profileFields[i].FieldName === "APPROVER" || that.profileFields[i].FieldName === "AssignmentStatus" || that.profileFields[
									i].FieldName === "AssignmentName" || that.profileFields[i].FieldName === "ValidityStartDate" || that.profileFields[i].FieldName ===
								"ValidityEndDate") {
								if (that.profileFields[i].FieldName === "AssignmentStatus") {
									adminTask[that.profileFields[i].FieldName] = that.adminTasks[j][that.profileFields[i].FieldName] === "1" ? true : false;
								} else if (that.profileFields[i].FieldName === "ValidityStartDate") {
									adminTask[that.profileFields[i].FieldName] = that.adminTasks[j][that.profileFields[i].FieldName];
								} else if (that.profileFields[i].FieldName === "ValidityEndDate") {
									adminTask[that.profileFields[i].FieldName] = that.adminTasks[j][that.profileFields[i].FieldName];
								} else if (that.profileFields[i].FieldName === "APPROVER") {
									adminTask["APPROVER"] = that.adminTasks[j].ApproverName;
								} else {
									adminTask[that.profileFields[i].FieldName] = that.adminTasks[j][that.profileFields[i].FieldName];
								}
							} else {
								adminTask[that.profileFields[i].FieldName] = that.adminTasks[j].AssignmentFields[that.profileFields[i].FieldName];
								//Display text only if it enabled via BAdI hcmfab_b_tsh_textfields in the backend
								// if (that.profileFields[i].DispValueText === "TRUE") {
								that.getFieldTexts(that.profileFields[i].FieldName);
								// }
							}

						}
						var finaltask = $.extend(true, {}, adminTask);
						AdminTaskFields.push(finaltask);
					}
					// obj = $.grep(AdminTaskFields, function (element, ind) {
					// 	return element.AssignmentStatus === true;
					// });
					AdminTaskModel.setData(AdminTaskFields);
					that.setModel(AdminTaskModel, "AdminTaskFields");
					that.adminlistPopover();
					that.hideBusy(true);
				},
				error: function (oError) {
					that.hideBusy(true);
					that.oErrorHandler.processError(oError);
				}
			};
			this.oDataModel.read('/AssignmentCollection', mParameters);
		},
		getWorklistFields: function (oPernr) {
			var that = this;
			var oModel = new sap.ui.model.json.JSONModel();
			var a = new sap.ui.model.Filter({
				path: "Pernr",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: oPernr
			});
			var b = new sap.ui.model.Filter({
				path: "SelWorkList",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "X"
			});
			var f = [];
			f.push(a);
			f.push(b);
			if (that.profileId) {
				var c = new sap.ui.model.Filter({
					path: "ProfileId",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: that.profileId
				});
				if (that.profileId !== undefined) {
					f.push(c);
				}
			}
			var mParameters = {
				filters: f,
				success: function (oData, oResponse) {
					var worklistFields = $.extend(true, [], oData.results);
					//that.readOnlyTemplate();

					//add Name Field to WorklistFields
					var nameField = [];
					nameField.FieldName = "NAME";
					nameField.FieldLength = 30;
					nameField.FieldType = "C";
					nameField.IsReadOnly = "FALSE";
					nameField.SelWorkList = "X";
					nameField.FieldLabel = that.oBundle.getText("name");
					worklistFields.splice(0, 0, nameField);

					//add Range Field to WorklistFields
					var rangeField = [];
					rangeField.FieldName = "RANGE";
					rangeField.FieldLabel = that.oBundle.getText("validPeriod");
					rangeField.IsReadOnly = "FALSE";
					rangeField.SelWorkList = "X";
					worklistFields.splice(1, 0, rangeField);

					oModel.setData(worklistFields);
					that.worklistFields = worklistFields;
					that.setModel(oModel, "WorklistProfileFields");
					// that.setGlobalModel(oModel, "WorklistFields");
				},
				error: function (oError) {
					that.oErrorHandler.processError(oError);
				}
			};
			this.oDataModel.read('/ProfileFieldCollection', mParameters);
						this.setEditable(false);
		},
		worklistPopover: function () {
			// create popover
			var that = this;
			var oDialogController = {
				handleClose: function (event) {
					that._oPopover.close();
					that._oPopover.destroy();
				},
				handleConfirm: function (event) {
					var TaskData = {
						ApproverId: "",
						ApproverName: "",
						AssignmentFields: {
							AENAM: "",
							ALLDF: "",
							APDAT: null,
							APNAM: "",
							ARBID: "",
							ARBPL: "",
							AUERU: "",
							AUFKZ: "",
							AUTYP: "",
							AWART: "",
							BEGUZ: "",
							BELNR: "",
							BEMOT: "",
							BUDGET_PD: "",
							BUKRS: "",
							BWGRL: "0.0",
							CATSAMOUNT: "0.0",
							CATSHOURS: "0.00",
							CATSQUANTITY: "0.0",
							CPR_EXTID: "",
							CPR_GUID: "",
							CPR_OBJGEXTID: "",
							CPR_OBJGUID: "",
							CPR_OBJTYPE: "",
							ENDUZ: "",
							ERNAM: "",
							ERSDA: null,
							ERSTM: "",
							ERUZU: "",
							EXTAPPLICATION: "",
							EXTDOCUMENTNO: "",
							EXTSYSTEM: "",
							FUNC_AREA: "",
							FUND: "",
							GRANT_NBR: "",
							HRBUDGET_PD: "",
							HRCOSTASG: "",
							HRFUNC_AREA: "",
							HRFUND: "",
							HRGRANT_NBR: "",
							HRKOSTL: "",
							HRLSTAR: "",
							KAPAR: "",
							KAPID: "",
							KOKRS: "",
							LAEDA: null,
							LAETM: "",
							LGART: "",
							LOGSYS: "",
							LONGTEXT: "",
							LONGTEXT_DATA: "",
							LSTAR: "",
							LSTNR: "",
							LTXA1: "",
							MEINH: "",
							OFMNW: "0.0",
							OTYPE: "",
							PAOBJNR: "",
							PEDD: null,
							PERNR: "",
							PLANS: "",
							POSID: "",
							PRAKN: "",
							PRAKZ: "",
							PRICE: "0.0",
							RAPLZL: "",
							RAUFNR: "",
							RAUFPL: "",
							REASON: "",
							REFCOUNTER: "",
							REINR: "",
							RKDAUF: "",
							RKDPOS: "",
							RKOSTL: "",
							RKSTR: "",
							RNPLNR: "",
							RPROJ: "",
							RPRZNR: "",
							SBUDGET_PD: "",
							SEBELN: "",
							SEBELP: "",
							SKOSTL: "",
							SPLIT: "0",
							SPRZNR: "",
							STATKEYFIG: "",
							STATUS: "",
							S_FUNC_AREA: "",
							S_FUND: "",
							S_GRANT_NBR: "",
							TASKCOMPONENT: "",
							TASKCOUNTER: "",
							TASKLEVEL: "",
							TASKTYPE: "",
							TCURR: "",
							TRFGR: "",
							TRFST: "",
							UNIT: "",
							UVORN: "",
							VERSL: "",
							VORNR: "",
							VTKEN: "",
							WABLNR: "",
							WAERS: "",
							WERKS: "",
							WORKDATE: null,
							WORKITEMID: "",
							WTART: ""
						},
						AssignmentId: "",
						AssignmentName: "",
						AssignmentOperation: "C",
						AssignmentStatus: "",
						Counter: "",
						Pernr: that.empID,
						ProfileId: "",
						ValidityStartDate: "",
						ValidityEndDate: ""
					};
					var selectedItems = [];
					var selectedItemsCount = 0;
					var worklistTable = that.byId("worklistTableId");
					var oItems = worklistTable.getItems();
					var worklistData = that.getModel("Worklist").getData();
					var checkFlag = "";
					for (var i = 0; i < oItems.length; i++) {
						if (oItems[i].getProperty("selected") == true) {
							selectedItemsCount++;
							for (var j = 0; j < that.worklistFields.length; j++) {
								if (oItems[i].getCells()[j].getCustomData()[0].getValue() == "NAME") {
									if (oItems[i].getCells()[j].getValue() === "") {
										oItems[i].getCells()[j].setValueState(sap.ui.core.ValueState.Error);
										//Set a flag for avoiding incorrect Import
										checkFlag = "X";
									}
									TaskData["AssignmentName"] = oItems[i].getCells()[j].getValue();
								} else if (oItems[i].getCells()[j].getCustomData()[0].getValue() == "APPROVER") {
									TaskData["ApproverName"] = oItems[i].getCells()[j].getValue();
								} else if (oItems[i].getCells()[j].getCustomData()[0].getValue() == "AssignmentStatus") {
									TaskData["AssignmentStatus"] = oItems[i].getCells()[j].getValue() ? "1" : "";
								} else if (oItems[i].getCells()[j].getCustomData()[0].getValue() == "RANGE") {
									TaskData["ValidityStartDate"] = that.formatter.formatToBackendString(oItems[i].getCells()[j].getDateValue()) +
										"T00:00:00";
									TaskData["ValidityEndDate"] = that.formatter.formatToBackendString(oItems[i].getCells()[j].getSecondDateValue()) +
										"T00:00:00";
								} else if (oItems[i].getCells()[j].getCustomData()[0].getValue() == "CPR_TEXT") {
									//Do nothing - Continue
								} else if (oItems[i].getCells()[j].getCustomData()[0].getValue() == "CPR_OBJTEXT") {
									//Do nothing - Continue
								} else {
									// TaskData.AssignmentFields[oItems[i].getCells()[j].getCustomData()[0].getValue()] =
									// 	oItems[i].getCells()[j].getText();

									TaskData.AssignmentFields[oItems[i].getCells()[j].getCustomData()[0].getValue()] = worklistData[oItems[i].getBindingContext(
										"WorklistFields").getPath().split("/")[1]].WorkListDataFields[oItems[i].getCells()[j].getCustomData()[0].getValue()];
								}
								// var data = $.extend(true, {}, selected);
								// selectedItems.push(data);
								if (TaskData.AssignmentFields.BWGRL === "") {
									TaskData.AssignmentFields.BWGRL = "0.00";
								}
								if (TaskData.AssignmentFields.PRICE === "") {
									TaskData.AssignmentFields.PRICE = "0.00";
								}
								if (TaskData.AssignmentFields.OFMNW === "") {
									TaskData.AssignmentFields.OFMNW = "0.00";
								}
								if (TaskData.AssignmentFields.PEDD !== null) {
									TaskData.AssignmentFields.PEDD = this.formatter.formatToBackendString(new Date(TaskData.AssignmentFields.PEDD)) +
										"T00:00:00";
								}
							}
							var data = $.extend(true, {}, TaskData);
							selectedItems.push(data);
						}
					}
					if (selectedItemsCount < 1) {
						var toastMsg = that.oBundle.getText("noSelectionMade");
						sap.m.MessageToast.show(toastMsg, {
							duration: 3000
						});
					} else if (checkFlag === "X") {
						var toastMsg1 = that.oBundle.getText("fillRequiredEntries");
						sap.m.MessageToast.show(toastMsg1, {
							duration: 3000
						});
					} else {
						that.performImportAssignments(selectedItems);
						that._oPopover.close();
						that._oPopover.destroy();
					}
				},
				onNavBack: function (event) {
					var oNavCon = Fragment.byId(that.getView().getId(), "NavC");
					oNavCon.back();
				},
				onValueHelp: this.onValueHelp.bind(this),
				switchState: this.formatter.switchState.bind(this),
				dynamicBindingColumnsWorklist: this.dynamicBindingColumnsWorklist.bind(this),
				dynamicBindingRowsWorklist: this.dynamicBindingRowsWorklist.bind(this)
			};
			// if (!this._oPopover) {
			this._oPopover = sap.ui.xmlfragment(this.getView().getId(), "hcm.fab.mytimesheet.view.fragments.WorklistPopover",
				oDialogController);
			this.getView().addDependent(this._oPopover);
			// }

			// delay because addDependent will do a async rerendering and the popover will immediately close without it
			jQuery.sap.delayedCall(0, this, function () {
				this._oPopover.open();
			});
		},
		adminlistPopover: function () {
			// create popover
			var that = this;
			var oDialogController = {
				handleClose: function (event) {
					that._oAdminlistPopover.close();
					that._oAdminlistPopover.destroy();
				},
				handleConfirm: function (event) {
					var TaskData = {
						ApproverId: "",
						ApproverName: "",
						AssignmentFields: {
							AENAM: "",
							ALLDF: "",
							APDAT: null,
							APNAM: "",
							ARBID: "",
							ARBPL: "",
							AUERU: "",
							AUFKZ: "",
							AUTYP: "",
							AWART: "",
							BEGUZ: "",
							BELNR: "",
							BEMOT: "",
							BUDGET_PD: "",
							BUKRS: "",
							BWGRL: "0.0",
							CATSAMOUNT: "0.0",
							CATSHOURS: "0.00",
							CATSQUANTITY: "0.0",
							CPR_EXTID: "",
							CPR_GUID: "",
							CPR_OBJGEXTID: "",
							CPR_OBJGUID: "",
							CPR_OBJTYPE: "",
							ENDUZ: "",
							ERNAM: "",
							ERSDA: null,
							ERSTM: "",
							ERUZU: "",
							EXTAPPLICATION: "",
							EXTDOCUMENTNO: "",
							EXTSYSTEM: "",
							FUNC_AREA: "",
							FUND: "",
							GRANT_NBR: "",
							HRBUDGET_PD: "",
							HRCOSTASG: "",
							HRFUNC_AREA: "",
							HRFUND: "",
							HRGRANT_NBR: "",
							HRKOSTL: "",
							HRLSTAR: "",
							KAPAR: "",
							KAPID: "",
							KOKRS: "",
							LAEDA: null,
							LAETM: "",
							LGART: "",
							LOGSYS: "",
							LONGTEXT: "",
							LONGTEXT_DATA: "",
							LSTAR: "",
							LSTNR: "",
							LTXA1: "",
							MEINH: "",
							OFMNW: "0.0",
							OTYPE: "",
							PAOBJNR: "",
							PEDD: null,
							PERNR: "",
							PLANS: "",
							POSID: "",
							PRAKN: "",
							PRAKZ: "",
							PRICE: "0.0",
							RAPLZL: "",
							RAUFNR: "",
							RAUFPL: "",
							REASON: "",
							REFCOUNTER: "",
							REINR: "",
							RKDAUF: "",
							RKDPOS: "",
							RKOSTL: "",
							RKSTR: "",
							RNPLNR: "",
							RPROJ: "",
							RPRZNR: "",
							SBUDGET_PD: "",
							SEBELN: "",
							SEBELP: "",
							SKOSTL: "",
							SPLIT: "0",
							SPRZNR: "",
							STATKEYFIG: "",
							STATUS: "",
							S_FUNC_AREA: "",
							S_FUND: "",
							S_GRANT_NBR: "",
							TASKCOMPONENT: "",
							TASKCOUNTER: "",
							TASKLEVEL: "",
							TASKTYPE: "",
							TCURR: "",
							TRFGR: "",
							TRFST: "",
							UNIT: "",
							UVORN: "",
							VERSL: "",
							VORNR: "",
							VTKEN: "",
							WABLNR: "",
							WAERS: "",
							WERKS: "",
							WORKDATE: null,
							WORKITEMID: "",
							WTART: ""
						},
						AssignmentId: "",
						AssignmentName: "",
						AssignmentOperation: "C",
						AssignmentStatus: "",
						Counter: "",
						Pernr: that.empID,
						ProfileId: "",
						ValidityStartDate: "",
						ValidityEndDate: ""
					};
					var selectedItemsCount = 0;
					var selectedItems = [];
					//Fetch the selected assignments
					var adminlistTable = that.byId("adminlistTableId");
					var oItems = adminlistTable.getItems();
					for (var i = 0; i < oItems.length; i++) {
						if (oItems[i].getProperty("selected") == true) {
							selectedItemsCount++;
							for (var j = 0; j < that.profileFields.length; j++) {
								if (oItems[i].getCells()[j].getCustomData()[0].getValue() == "AssignmentName") {
									TaskData["AssignmentName"] = oItems[i].getCells()[j].getText();
								} else if (oItems[i].getCells()[j].getCustomData()[0].getValue() == "APPROVER") {
									TaskData["ApproverName"] = oItems[i].getCells()[j].getText();
								} else if (oItems[i].getCells()[j].getCustomData()[0].getValue() == "AssignmentStatus") {
									TaskData["AssignmentStatus"] = (oItems[i].getCells()[j].getText() === "Active") ? "1" : "";
								} else if (oItems[i].getCells()[j].getCustomData()[0].getValue() == "ValidityStartDate") {
									TaskData["ValidityStartDate"] = that.formatter.formatToBackendString(oItems[i].getCells()[j].getText()) +
										"T00:00:00";
								} else if (oItems[i].getCells()[j].getCustomData()[0].getValue() == "ValidityEndDate") {
									TaskData["ValidityEndDate"] = that.formatter.formatToBackendString(oItems[i].getCells()[j].getText()) +
										"T00:00:00";
								} else if (oItems[i].getCells()[j].getCustomData()[0].getValue() == "CPR_TEXT") {
									//Do nothing - Continue
								} else if (oItems[i].getCells()[j].getCustomData()[0].getValue() == "CPR_OBJTEXT") {
									//Do nothing - Continue
								} else {
									if (oItems[i].getCells()[j].getCustomData()[2]) {
										TaskData.AssignmentFields[oItems[i].getCells()[j].getCustomData()[0].getValue()] =
											oItems[i].getCells()[j].getCustomData()[2].getValue();
									} else {
										TaskData.AssignmentFields[oItems[i].getCells()[j].getCustomData()[0].getValue()] =
											oItems[i].getCells()[j].getText();
									}
								}
								if (TaskData.AssignmentFields.BWGRL === "") {
									TaskData.AssignmentFields.BWGRL = "0.00";
								}
								if (TaskData.AssignmentFields.PRICE === "") {
									TaskData.AssignmentFields.PRICE = "0.00";
								}
								if (TaskData.AssignmentFields.OFMNW === "") {
									TaskData.AssignmentFields.OFMNW = "0.00";
								}
								if (TaskData.AssignmentFields.PEDD !== null) {
									TaskData.AssignmentFields.PEDD = this.formatter.formatToBackendString(new Date(TaskData.AssignmentFields.PEDD)) +
										"T00:00:00";
								}
							}
							var data = $.extend(true, {}, TaskData);
							selectedItems.push(data);
						}
					}
					if (selectedItemsCount < 1) {
						var toastMsg = that.oBundle.getText("noSelectionMade");
						sap.m.MessageToast.show(toastMsg, {
							duration: 3000
						});
					} else {
						that.performImportAssignments(selectedItems);
						that._oAdminlistPopover.close();
						that._oAdminlistPopover.destroy();
					}
				},
				onNavBack: function (event) {
					var oNavCon = Fragment.byId(that.getView().getId(), "NavC");
					oNavCon.back();
				},
				dynamicBindingColumnsAdminlist: this.dynamicBindingColumnsAdminlist.bind(this),
				dynamicBindingRowsAdminlist: this.dynamicBindingRowsAdminlist.bind(this)
			};
			// if (!this._oPopover) {
			this._oAdminlistPopover = sap.ui.xmlfragment(this.getView().getId(), "hcm.fab.mytimesheet.view.fragments.AdminlistPopover",
				oDialogController);
			this.getView().addDependent(this._oAdminlistPopover);
			// }

			// delay because addDependent will do a async rerendering and the popover will immediately close without it
			jQuery.sap.delayedCall(0, this, function () {
				this._oAdminlistPopover.open();
			});
		},
		clockTimesPopOver: function (oEvent) {
			// create popover
			var that = this;
			var oDialogController = {
				handleClose: function (event) {
					that._oPopover.close();
					that._oPopover.destroy();
				},
				handleOk: function (event) {
					var index = oEvent.getSource().getParent().getBindingContext('TimeData').getPath().split('/')[1];
					var data = that.getModel('TimeData').getData();
					if (that.clockTimeChange) {
						data[index].TimeEntryDataFields.BEGUZ = that.formatter.convertTime(oEvent.getSource().getParent().getAggregation('content')[
								0]
							.getAggregation('content')[0].getDateValue());
						data[index].TimeEntryDataFields.ENDUZ = that.formatter.convertTime(oEvent.getSource().getParent().getAggregation('content')[
								0]
							.getAggregation('content')[1].getDateValue());
						if (data[index].Counter !== "") {
							data[index].TimeEntryOperation = 'U';
						} else {
							data[index].TimeEntryOperation = 'C';
						}
						var oModel = new JSONModel(data);
						that.setModel(oModel, "TimeData");
					}
					that._oPopover.close();
					that._oPopover.destroy();
				},
				handleChange: function (oEvent) {
					that.clockTimeChange = true;
				},
				formatTime: this.formatter.formatTime.bind(this)
			};
			var data = $.extend(true, [], this.getModel('TimeData').getData());
			var oModel = new JSONModel(data);
			this.setModel(oModel, "oldModel");
			// if (!this._oPopover) {
			this._oPopover = sap.ui.xmlfragment(this.getView().getId(), "hcm.fab.mytimesheet.view.fragments.ClockTimesPopOver",
				oDialogController);
			this._oPopover.bindElement('TimeData>' + oEvent.getSource().getBindingContext('TimeData').getPath());
			this.getView().addDependent(this._oPopover);

			// }

			// delay because addDependent will do a async rerendering and the popover will immediately close without it
			jQuery.sap.delayedCall(0, this, function () {
				this._oPopover.open(oEvent.getSource());
			});
		},
		readOnlyTemplate: function () {
			// this.oReadOnlyTemplate = this.oTable.removeItem(0);
/*			this.oReadOnlyTemplate = new sap.m.ColumnListItem({
				cells: [
					new sap.m.ObjectStatus({
						text: {
							parts: [{
								path: 'TimeData>totalHours',
								type: 'sap.ui.model.odata.type.Decimal',
								formatOptions: {
									parseAsString: true,
									decimals: 2,
									maxFractionDigits: 2,
									minFractionDigits: 0
								},
								constraints: {
									precision: 4,
									scale: 2,
									minimum: '0',
									maximum: '10000'
								}
							}, {
								path: 'TimeData>target',
								type: 'sap.ui.model.odata.type.Decimal',
								formatOptions: {
									parseAsString: true,
									decimals: 2,
									maxFractionDigits: 2,
									minFractionDigits: 0
								},
								constraints: {
									precision: 4,
									scale: 2,
									minimum: '0',
									maximum: '10000'
								}
							}],
							formatter: formatter.concatStrings
						},
						visible: true
					}),
					new sap.m.Link({
						text: {
							parts: [{
								path: 'TimeData>AssignmentName'
							}, {
								path: 'TimeData>AssignmentId'
							}, {
								path: 'TimeData>Counter'
							}, {
								path: 'TimeData>Status'
							}],
							formatter: this.formatter.assignmentName.bind(this)
						},
						press: this.onAssignmentQuickView.bind(this)
					}),

					new sap.m.ObjectNumber({
						number: {
							parts: [{
								path: 'TimeData>TimeEntryDataFields/CATSHOURS'
							}, {
								path: 'TimeData>TimeEntryDataFields/CATSQUANTITY'
							}, {
								path: 'TimeData>TimeEntryDataFields/CATSAMOUNT'
							}],
							formatter: formatter.calHoursQuanAmount.bind(this)
						},
						unit: {
							parts: [{
								path: 'TimeData>TimeEntryDataFields/UNIT'
							}, {
								path: 'TimeData>TimeEntryDataFields/CATSHOURS'
							}],
							formatter: formatter.getUnitTexts.bind(this)
						}
					}),
					new sap.m.CheckBox({
						editable: false,
						visible: this.draftStatus,
						selected: "{TimeData>SetDraft}"
					}),
					new sap.m.Button({
						icon: "sap-icon://activity-items",
						type: sap.m.ButtonType.Transparent,
						press: this.onReadOnlyProjectDetails.bind(this),
						visible: {
							parts: [{
								path: 'TimeData>TimeEntryDataFields/CPR_GUID'
							}, {
								path: 'TimeData>TimeEntryDataFields/CPR_OBJGUID'
							}],
							formatter: this.formatter.projectsVisible.bind(this)
						}
					}),

					new sap.m.ObjectStatus({
						text: {
							path: 'TimeData>TimeEntryDataFields/BEGUZ',
							formatter: this.formatter.formatTime.bind(this)
						},
						visible: this.clockTimeVisible
					}),
					new sap.m.ObjectStatus({
						text: {
							path: 'TimeData>TimeEntryDataFields/ENDUZ',
							formatter: this.formatter.formatTime.bind(this)
						},
						visible: this.clockTimeVisible
					}),
					new sap.m.ObjectStatus({
						text: {
							path: 'TimeData>TimeEntryDataFields/STATUS',
							formatter: formatter.status
						},
						state: {
							path: 'TimeData>TimeEntryDataFields/STATUS',
							formatter: formatter.state
						}
					}),
					new sap.m.Button({
						icon: "sap-icon://notification-2",
						type: sap.m.ButtonType.Transparent,
						press: this.displaylongtextPopover.bind(this),
						visible: {
							parts: [{
								path: 'TimeData>TimeEntryDataFields/LONGTEXT'
							}, {
								path: 'TimeData>RejReasondesc'
							}],
							formatter: formatter.visibility
						}
					})

				],
				customData: [new sap.ui.core.CustomData({
					key: "counter",
					value: "{TimeData>Counter}"
				})]
			});*/
			
/*			this.oReadOnlyTemplate = new sap.m.ColumnListItem({
				cells: [
					new sap.m.Select({
								forceSelection: false ,
								enabled : "{controls>/overviewEditable}", // boolean, since 1.12.0
								editable : "{= ${TimeData>AllowEdit}  === 'X' ? true : false }",
								selectedKey : "{TimeData>Awart}", // string
								items: {
										path: "json>/CategorySet",      //no curly brackets here!
										template: new sap.ui.core.Item({
											text : "{json>key} - {json>value}",
											key : "{json>key}"
										})
								}
							}),
							
					new sap.m.Input({
						valueLiveUpdate:false,
						visible: true, // boolean
						//textFormatter: this.formatter.EOTP_OUTPUT.bind(this),
						textFormatMode : sap.m.InputTextFormatMode.Key,
						value: "{= ${TimeData>Rproj}  === '00000000' ? '' : ${TimeData>Rproj} }", // string
						width: "100%", // sap.ui.core.CSSSize
						enabled: "{controls>/overviewEditable}", // boolean
						placeholder: "eOTP", // string
						editable : "{= ${TimeData>AllowEdit}  === 'X' ? true : false }",
						required: true, // boolean, since 1.38.4
						type: sap.m.InputType.Text, // sap.m.InputType
						valueHelpRequest : this.onWBSValueHelpRequested.bind(this),
						showValueHelp: true, // boolean, since 1.16
						//showSuggestion: false, // boolean, since 1.16.1
						valueHelpOnly: false, // boolean, since 1.21.0
						/*
						suggestionItems : {
							path: "VH>/ZC_WBSElementVH",
							sorter: { path: 'VH>WBSElement' },
							template: new sap.ui.core.Item({
								key: "{VH>WBSElement}",
								text : "{VH>WBSDescription}",
							}),
							templateShareble
						},
						*/
						/*
						filterSuggests: true, // boolean
						//maxSuggestionWidth: "70%", // sap.ui.core.CSSSize, since 1.21.1
						//fieldWidth: "100%", // sap.ui.core.CSSSize
						suggest : this.handleSuggest.bind(this),
						suggestionColumns:[
							new sap.m.Column({ header: new sap.m.Label({
								text: "Favoris"
							}) }),
							new sap.m.Column({ header: new sap.m.Label({
								text: "eOTP"
							}) }),
							new sap.m.Column({ header: new sap.m.Label({
								text: "Description"
							}) })
						],
						suggestionRows: {
							path: "VH>/ZC_WBSElementVH",
							template: new sap.m.ColumnListItem({
							cells: [
								new sap.m.Button({ icon: "sap-icon://favorite" }),
								new sap.m.Label({ text : "{VH>WBSElement}" }),
								new sap.m.Label({ text : "{VH>WBSDescription}" }),
								]
							})
						}
					}),
					new sap.m.MaskInput({
						mask:"9",
						editable : "{= ${TimeData>AllowEdit}  === 'X' ? true : false }",
						enabled: "{controls>/overviewEditable}", // boolean
						placeholderSymbol: " ",
						value: "{TimeData>Day1}" // string
					}),
					new sap.m.MaskInput({
						mask:"9",
						editable : "{= ${TimeData>AllowEdit}  === 'X' ? true : false }",
						enabled: "{controls>/overviewEditable}", // boolean
						placeholderSymbol: " ",
						value: "{TimeData>Day2}" // string
					}),
					new sap.m.MaskInput({
						mask:"9",
						editable : "{= ${TimeData>AllowEdit}  === 'X' ? true : false }",
						enabled: "{controls>/overviewEditable}", // boolean
						placeholderSymbol: " ",
						value: "{TimeData>Day3}" // string
					}),
					new sap.m.MaskInput({
						mask:"9",
						editable : "{= ${TimeData>AllowEdit}  === 'X' ? true : false }",
						enabled: "{controls>/overviewEditable}", // boolean
						placeholderSymbol: " ",
						value: "{TimeData>Day4}" // string
					}),
					new sap.m.MaskInput({
						mask:"9",
						editable : "{= ${TimeData>AllowEdit}  === 'X' ? true : false }",
						enabled: "{controls>/overviewEditable}", // boolean
						placeholderSymbol: " ",
						value: "{TimeData>Day5}" // string
					}),
					new sap.m.MaskInput({
						mask:"9",
						editable : "{= ${TimeData>AllowEdit}  === 'X' ? true : false }",
						enabled: "{controls>/overviewEditable}", // boolean
						placeholderSymbol: " ",
						value: "{TimeData>Day6}" // string
					}),
					new sap.m.MaskInput({
						mask:"9",
						editable : "{= ${TimeData>AllowEdit}  === 'X' ? true : false }",
						enabled: "{controls>/overviewEditable}", // boolean
						placeholderSymbol: " ",
						value: "{TimeData>Day7}" // string
					}),	
					
					,new sap.m.Button({
						visible : false,
						icon: {
							path: 'TimeData>TimeEntryDataFields/LONGTEXT',
							formatter: formatter.longtextButtons
						},
						enabled: "{controls>/overviewEditable}", // boolean
						type: sap.m.ButtonType.Transparent,
						press: this.longtextPopover.bind(this)
					})
					
					,new sap.m.Button({
						visible : true,
						icon: "sap-icon://sys-cancel",
						type: sap.m.ButtonType.Reject,
						press: this.removePopover.bind(this),
						enabled: "{= ${TimeData>AllowEdit}  === 'X' ? true && ${controls>/overviewEditable} : false && ${controls>/overviewEditable} }",
					})
					
					]
			});*/
			
			//this.oReadOnlyTemplate = this.getView().byId("timeDataTemplate");
/*			this.oTable.bindItems({ path: 'TimeData>/', template: this.oReadOnlyTemplate, templateShareable: false });*/
		},
		comboBoxhandleChange: function (oEvent) {
			var oValidatedComboBox = oEvent.getSource(),
				sSelectedKey = oValidatedComboBox.getSelectedKey(),
				sValue = oValidatedComboBox.getValue();

			if (!sSelectedKey && sValue) {
				oValidatedComboBox.setValueState("Error");
				oValidatedComboBox.setValueStateText("Veuillez choisir une catégorie correcte");
			} else {
				oValidatedComboBox.setValueState("None");
			}
		},
// YBO BEGIN:	onHoursTap 	
		onHoursTap: function(oEvent){
//			var oValue = oEvent.getParameter("newValue");
//			oEvent.getSource().setValue("".concat(oValue).replaceAll(',','').replaceAll('.',''));
		},
// YBO END: 	onHoursTap 		
// YBO BEGIN:	ValueHelpFunctions 
		onWBSValueHelpRequested: function(oEvent){
			this.editLine = oEvent.getSource().getParent().getBindingContextPath();
			console.log("Edited line is : " + this.editLine);
			this.sourceInput = oEvent.getSource();
			var oColsModel = new JSONModel(
					{ 
						cols:  [
						
/*							{"label": "ID","template": "WBSElementInternalID","width": "5rem"},*/
						
							{"label": "eOTP","template": "WBSElement","width": "20rem"},
							
							{"label": "Description","template": "WBSDescription","width": "30rem"},
						
							{"label": "Projet","template": "ProjectDescription"}
						]
					}
			);
			
			var aCols = this._aCols = oColsModel.getData().cols; 
			this._oBasicSearchField = new sap.m.SearchField({
				showSearchButton: false
			});

			this._oWBSValueHelpDialog = sap.ui.xmlfragment("hcm.fab.mytimesheet.HCMFAB_MY_TIMEExtension.view.RprojValueHelp", this);
			this.getView().addDependent(this._oWBSValueHelpDialog);

			this._oWBSValueHelpDialog.setRangeKeyFields([{
				label: "eOTP",
				key: "WBSElement",
				type: "string",
				typeInstance: new sap.ui.model.type.String({}, {
					maxLength: 100
				})
			}]);

			//this._oWBSValueHelpDialog.getFilterBar().setBasicSearch(this._oBasicSearchField);

			this._oWBSValueHelpDialog.getTableAsync().then(function (oTable) {
				oTable.setModel(this.getView().getModel());
				oTable.setModel(oColsModel, "columns");
				oTable.setModel(this.getView().getModel("VH"));

				if (oTable.bindRows) {
					oTable.bindAggregation("rows", "/ZC_WBSElementVH");
				}

				if (oTable.bindItems) {
					oTable.bindAggregation("items", "/ZC_WBSElementVH", function () {
						return new ColumnListItem({
							cells: aCols.map(function (column) {
								return new Label({ text: "{" + column.template + "}" });
							})
						});
					});
					var oToken = new sap.m.Token();
					oToken.setKey(this.sourceInput.getSelectedKey());
					oToken.setText(this.sourceInput.getValue());
					this._oWBSValueHelpDialog.setTokens([oToken]);
					this._oWBSValueHelpDialog.update();
				}
			}.bind(this));
			
			this._oWBSValueHelpDialog.open();
		},
		onValueHelpOkPress: function (oEvent) {
			console.log("Updating line : " + this.editLine);
			var aTokens = oEvent.getParameter("tokens");
			var selectedKey = aTokens[0].getProperty("key");
			var selectedText = aTokens[0].getProperty("text");
			//this.sourceInput.setValue(selectedKey);
			if(this.editLine === undefined){
				this.sourceInput.setValue(selectedKey);
				this.sourceInput = null;
			}else{
				this.getModel("json").setProperty(this.editLine+"/Rproj",selectedKey);
				this.getModel("json").setProperty(this.editLine+"/Posi1",selectedText);
			}
			this._oWBSValueHelpDialog.close();
		},

		onValueHelpCancelPress: function () {
			this._oWBSValueHelpDialog.close();
		},

		onValueHelpAfterClose: function () {
			this._oWBSValueHelpDialog.destroy();
			this.editLine = null;
		},
		onFilterBarSearch: function (oEvent) {
			var sSearchQuery = this._oBasicSearchField.getValue(),
				aSelectionSet = oEvent.getParameter("selectionSet");
			
			var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
				if (oControl.getValue()) {
					aResult.push(new Filter({
						path: oControl.getName(),
						operator: FilterOperator.Contains,
						value1: oControl.getValue()
					}));
				}

				return aResult;
			}, []);
			var aCols = this._aCols;
			aFilters.push(new Filter({
				
				filters: aCols.map( col =>
							new Filter({ path: col.template, operator: FilterOperator.Contains, value1: sSearchQuery })
						),
						/*
				oldfilters: [
					new Filter({ path: "ProductId", operator: FilterOperator.Contains, value1: sSearchQuery }),
					new Filter({ path: "Name", operator: FilterOperator.Contains, value1: sSearchQuery }),
					new Filter({ path: "Category", operator: FilterOperator.Contains, value1: sSearchQuery })
				],
				*/
				and: false
			}));

			this._filterTable(new Filter({
				filters: aFilters,
				and: true
			}));
		},
		_filterTable: function (oFilter) {
			var oValueHelpDialog = this._oWBSValueHelpDialog;
			oValueHelpDialog.getTableAsync().then(function (oTable) {
				if (oTable.bindRows) {
					oTable.getBinding("rows").filter(oFilter);
				}

				if (oTable.bindItems) {
					oTable.getBinding("items").filter(oFilter);
				}
				oValueHelpDialog.update();
			});
		},
		_onWBSInputValidate: function(oArgs) {
			if (oArgs.suggestionObject) {
				var oObject = oArgs.suggestionObject.getBindingContext().getObject(),
					oToken = new Token();
				oToken.setKey(oObject.WBSElement);
				oToken.setText(oObject.WBSElement + " - " + oObject.WBSDescription);
				return oToken;
			}

			return null;
		},
		onSelectSuggestion: function(oEvent){
			oEvent.getSource().setValue(oEvent.getParameter("selectedRow").getCells()[1].getText());
		},
// YBO END:		ValueHelpFunctions 
		
		onAddItem: function (oEvent){
			
			var timeEntries = this.getModel("time").getData().TimeEntries;
			
			var newLine = 
			
			{
			    "AllowEdit": true,
			    "Day1": "0.00",
			    "Weeknr": "",
			    "Counter": (timeEntries.length + 1).toString(),
			    "Pernr": "",
			    "StartDate": "",
			    "Weekstatus": "010",
			    "Awart": "PRES",
			    "EndDate": "",
			    "ProfileId": "",
			    "Rproj": "",
			    "Post1": "",
			    "Day2": "0.0",
			    "Day3": "0.0",
			    "Day4": "0.0",
			    "Day5": "0.0",
			    "Day6": "0.0",
			    "Day7": "0.0",
			    "Counter1": "",
			    "Counter2": "",
			    "Counter3": "",
			    "Counter4": "",
			    "Counter5": "",
			    "Counter6": "",
			    "Counter7": "",
			    "Status1": "",
			    "Status2": "",
			    "Status3": "",
			    "Status4": "",
			    "Status5": "",
			    "Status6": "",
			    "Status7": "",
			    "Action": ""
			};
			
			var newTimeEntries = timeEntries.concat(newLine);
			
			this.getModel("json").setProperty("/TimeEntries",newTimeEntries);
			
			this.getModel("time").setProperty("/TimeEntries",newTimeEntries);
			
/*			var oTable = this.getView().byId("idOverviewTable");

			var oModel = oTable.getModel("TimeData");

			var oData = oModel.getData();

			var added = oData.concat(this.recordTemplate());

			oModel.setData(added);*/
			
			//var oTimeListItem = this.getView().byId("timeListItem").clone();
			//this.oTimeTable.addItem(oTimeListItem);
			
		},
		removePopover: function (oEvent) {
			var that = this;
			var oCurrentItem = oEvent.getSource().getParent();
			var sPath = "/TimeEntries/"+this.oTimeTable.indexOfItem(oCurrentItem);
			var currentLine = this.getModel("json").getProperty(sPath);
			var oVHModel = that.oTimeTable.getModel("VH");
			var lineIndex = sPath.charAt(sPath.lastIndexOf("/")+1);
			if(currentLine.Pernr === ""){
				this.removeTimeItem(lineIndex, oCurrentItem);
			}else{
				var link = "/TimeEntries(Weeknr='$Weeknr',Pernr='$Pernr',Weekstatus='$Weekstatus',Awart='$Awart',Rproj='$Rproj')";
				link	=	link.replace("$Weeknr",currentLine.Weeknr)
							.replace("$Pernr",currentLine.Pernr)
							.replace("$Weekstatus",'0'+currentLine.Weekstatus)
							.replace("$Awart",currentLine.Awart)
							.replace("$Rproj",currentLine.Rproj);
				MessageBox.show(
					"Votre saisie va être définitivement supprimée, êtes-vous sûr ?", {
						icon: MessageBox.Icon.WARNING,
						title: "Ma feuille de saisie des temps",
						actions: [MessageBox.Action.YES, MessageBox.Action.NO],
						emphasizedAction: MessageBox.Action.YES,
						onClose: function (oAction) { 
							if(oAction === sap.m.MessageBox.Action.YES ){
								oVHModel.remove(link);
								that.removeTimeItem(lineIndex,oCurrentItem);
							}
						}
					}
				);
			}
		},
		removeTimeItem: function(lineIndex, oLineItem){
			var oJsonModel = this.getModel("json");
			this.oTimeTable.removeItem( oLineItem );
			var data = oJsonModel.getData();
    		var removed = data.TimeEntries.splice(lineIndex, 1);
    		oJsonModel.setProperty("TimeEntries",data.TimeEntries);
			//data = this.getModel("time").getData();
    		//var removed = data.TimeEntries.splice(lineIndex, 1);
			console.log("removeTimeItem: ", removed)
			this.updateTotals();
			this.checkTotals();
		},
		handleSuggest: function(oEvent) {
		       var sTerm = oEvent.getParameter("suggestValue");

			  var filters = [];
	
				filters.push(new Filter("Favoris", sap.ui.model.FilterOperator.EQ, 'X'));
				
				
				if(sTerm !== " "){
		      		filters.push(new Filter("WBSElement", sap.ui.model.FilterOperator.Contains, sTerm));
					filters.push(new Filter("WBSDescription", sap.ui.model.FilterOperator.Contains, sTerm));
				}

			  var aFilters = new Filter({
			    filters: filters,
			    and: false});
		       oEvent.getSource().getBinding("suggestionRows").filter(aFilters,sap.ui.model.FilterType.Application);
		},
		clockTimesToDoPopOver: function (oEvent) {
			// create popover
			var that = this;
			var oDialogController = {
				handleClose: function (event) {
					that._oPopover.close();
					that._oPopover.destroy();
				},
				handleOk: function (event) {
					var index = oEvent.getSource().getParent().getBindingContext('TodoList').getPath().split('/')[1];
					var data = that.getModel('TodoList').getData();
					if (that.clockTimeChange) {
						data[index].TimeEntryDataFields.BEGUZ = that.formatter.convertTime(oEvent.getSource().getParent().getAggregation('content')[
								0]
							.getAggregation('content')[0].getDateValue());
						data[index].TimeEntryDataFields.ENDUZ = that.formatter.convertTime(oEvent.getSource().getParent().getAggregation('content')[
								0]
							.getAggregation('content')[1].getDateValue());
						if (data[index].Counter !== "") {
							data[index].TimeEntryOperation = 'U';
						} else {
							data[index].TimeEntryOperation = 'C';
						}
						var oModel = new JSONModel(data);
						that.setModel(oModel, "TodoList");
					}
					that._oPopover.close();
					that._oPopover.destroy();
				},
				handleChange: function (oEvent) {
					that.clockTimeChange = true;
				},
				formatTime: this.formatter.formatTime.bind(this)
			};
			var data = $.extend(true, [], this.getModel('TodoList').getData());
			var oModel = new JSONModel(data);
			this.setModel(oModel, "oldModel");
			// if (!this._oPopover) {
			this._oPopover = sap.ui.xmlfragment(this.getView().getId(), "hcm.fab.mytimesheet.view.fragments.ClockTimesPopOver",
				oDialogController);
			this._oPopover.bindElement('TodoList>' + oEvent.getSource().getBindingContext('TodoList').getPath());
			this.getView().addDependent(this._oPopover);

			// }

			// delay because addDependent will do a async rerendering and the popover will immediately close without it
			jQuery.sap.delayedCall(0, this, function () {
				this._oPopover.open(oEvent.getSource());
			});
		},
		clockTimeChange: function (oEvent) {
			this.clockTimeChange = true;
		},
		showBusy: function () {
			this._nCounter++;
			if (this._nCounter === 1) {
				this.busyDialog.open();
			}
		},
		hideBusy: function (forceHide) {
			if (this._nCounter === 0) {
				return;
			}
			this._nCounter = forceHide ? 0 : Math.max(0,
				this._nCounter - 1);
			if (this._nCounter > 0) {
				return;
			}
			this.busyDialog.close();
		},
		onAssignmentPress: function (oEvent) {
			// if (sap.ui.Device.system.phone === true) {
			var that = this;
			var oView = this.getView();
			var oTable = this.byId('idTasks');
			oTable.setBusy(true);
			var oModel = new JSONModel();
			var data = this.getModel('ProfileFields').getData();
			var tasks = this.getModel('Tasks').getData();
			var index = parseInt(oEvent.getSource().getBindingContext('TaskFields').getPath().split('/')[1]);
			var oControl = this.getModel("controls");
			var formElements = [];
			var formContainers = [];
			var form = {
				name: null,
				status: false,
				containers: null
			};
			var oAssignmentModel = new JSONModel();
			oAssignmentModel.setData(tasks[index]);
			this.setGlobalModel(oAssignmentModel, "selectedAssignment");
			oControl.setProperty('/createAssignment', false);
			oControl.setProperty('/editAssignment', false);
			oControl.setProperty('/displayAssignment', true);
			oControl.setProperty('/copyAssignment', false);
			oControl.setProperty('/assignmentTitle', this.oBundle.getText("displayAssignment"));
			this.setGlobalModel(oControl, "controls");
			var selectedTask = oEvent.getSource().getAggregation('cells');
			var profileFields = $.extend(true, [], this.getModel('ProfileFields').getData());
			for (var i = 0; i < selectedTask.length; i++) {
				var obj = $.grep(profileFields, function (element, index) {
					return element.FieldName == selectedTask[i].getCustomData('FieldName')[0].getValue();
				});
				if (selectedTask[i].getCustomData('FieldName')[0].getValue() !== "AssignmentStatus" && selectedTask[i].getCustomData(
						'FieldName')[
						0].getValue() !== "AssignmentName" && selectedTask[i].getCustomData('FieldName')[
						0].getValue() !== "ValidityStartDate" && selectedTask[i].getCustomData('FieldName')[
						0].getValue() !== "ValidityEndDate" && selectedTask[i].getCustomData('FieldName')[
						0].getValue() !== "APPROVER") {
					if (selectedTask[i].getCustomData('FieldName')[0].getValue() !== 'RPROJ') {
						if (tasks[index].AssignmentFields[selectedTask[i].getCustomData('FieldName')[0].getValue()] !== undefined) {
							obj[0].FieldValue = tasks[index].AssignmentFields[selectedTask[i].getCustomData('FieldName')[0].getValue()];
						}
					} else {
						if (tasks[index].AssignmentFields[selectedTask[i].getCustomData('FieldName')[0].getValue()] !== undefined) {
							obj[0].FieldValue = tasks[index].AssignmentFields[selectedTask[i].getCustomData('FieldName')[0].getValue()];
							obj[0].FieldValueText = tasks[index].AssignmentFields['POSID'];
						}
					}

					obj[0].AssignmentId = selectedTask[i].getAggregation('customData')[1].getValue();
				} else {
					if (selectedTask[i].getCustomData('FieldName')[0].getValue() === "AssignmentStatus") {
						obj[0].FieldValue = selectedTask[i].getAggregation('customData')[2].getValue();
						obj[0].AssignmentId = selectedTask[i].getAggregation('customData')[1].getValue();
					} else if (selectedTask[i].getCustomData('FieldName')[0].getValue() === "AssignmentName") {
						obj[0].FieldValue = selectedTask[i].getText();
						obj[0].AssignmentId = selectedTask[i].getAggregation('customData')[1].getValue();
					} else if (selectedTask[i].getCustomData('FieldName')[0].getValue() === "ValidityStartDate") {
						obj[0].FieldValue = selectedTask[i].getText();
						obj[0].AssignmentId = selectedTask[i].getAggregation('customData')[1].getValue();
					} else if (selectedTask[i].getCustomData('FieldName')[0].getValue() === "ValidityEndDate") {
						obj[0].FieldValue = selectedTask[i].getText();
						obj[0].AssignmentId = selectedTask[i].getAggregation('customData')[1].getValue();
					} else if (selectedTask[i].getCustomData('FieldName')[
							0].getValue() === "APPROVER") {
						obj[0].FieldValue = tasks[index].ApproverId;
					}
				}
				if (selectedTask[i].getCustomData('FieldName')[0].getValue() !== "AssignmentName" && selectedTask[i].getCustomData('FieldName')[
						0]
					.getValue() !== "AssignmentStatus" && selectedTask[i].getCustomData('FieldName')[
						0].getValue() !== "ValidityStartDate" && selectedTask[i].getCustomData('FieldName')[
						0].getValue() !== "ValidityEndDate") {
					formElements.push(obj[0]);
				} else {
					if (selectedTask[i].getCustomData('FieldName')[0].getValue() === "AssignmentName") {
						form.name = obj[0].FieldValue;
					} else if (selectedTask[i].getCustomData('FieldName')[0].getValue() === "AssignmentStatus") {
						form.status = obj[0].FieldValue;
					} else if (selectedTask[i].getCustomData('FieldName')[0].getValue() === "ValidityStartDate") {
						form.validFrom = new Date(obj[0].FieldValue);
					} else if (selectedTask[i].getCustomData('FieldName')[0].getValue() === "ValidityEndDate") {
						form.validTo = new Date(obj[0].FieldValue);
					}
				}
				if (((formElements.length + 1) % 5) === 0 || i === (selectedTask.length - 1)) {
					formContainers.push({
						form: $.extend(true, [], formElements)
					});
					formElements = [];
				}
			}
			// for (var i = 0; i < profileFields.length; i++) {
			// 	if (profileFields[i].FieldName !== "AssignmentStatus") {
			// 		if (tasks[index][profileFields[i].FieldName]) {
			// 			profileFields[i].FieldValue = tasks[index][profileFields[i].FieldName];
			// 		}
			// 	}
			// 	if (profileFields[i].FieldName !== "AssignmentName" && profileFields[i].FieldName !== "AssignmentStatus") {
			// 		formElements.push(profileFields[i]);
			// 	} else {
			// 		if (profileFields[i].FieldName === "AssignmentName") {
			// 			form.name = profileFields[i].FieldValue;
			// 		} else {
			// 			form.status = profileFields[i].FieldValue;
			// 		}
			// 	}
			// 	if (((i + 1) % 5) === 0 || i === (selectedTask.length - 1)) {
			// 		formContainers.push({
			// 			form:  $.extend(true, [], formElements)
			// 		});
			// 		formElements = [];
			// 	}
			// }			
			form.containers = formContainers;
			oModel.setData(form);
			this.setGlobalModel(oModel, "EditedTask");

			// this.oRouter.navTo("createAssignment", {}, false);
			oTable.setBusy(false);
			this.oRouter.navTo("editAssignment", {}, false);
			// }
		},
		onAssignmentWorklistPress: function (oEvent) {
			var that = this;
			var oCtx = oEvent.getSource().getBindingContext();
			// var obj = oEvent.getSource().getBindingContext().getObject();
			var data = this.getModel('WorklistFields').getData();
			var oControl = this.getModel("controls");
			var index = oEvent.getSource().getBindingContext("WorklistFields").getPath().split('/')[1];
			var oModel = new JSONModel();
			var data = this.getModel('ProfileFields').getData();
			var tasks = this.getModel('WorklistFields').getData();
			var formElements = [];
			var formContainers = [];
			var form = {
				name: null,
				status: false,
				containers: null
			};
			var oControl = this.getModel("controls");
			this.setGlobalModel(oControl, "controls");
			var selectedTask = oEvent.getSource().getAggregation('cells');
			var profileFields = $.extend(true, [], this.getModel('ProfileFields').getData());
			for (var i = 0; i < profileFields.length; i++) {
				if (profileFields[i].FieldName !== "AssignmentStatus") {
					if (tasks[index][profileFields[i].FieldName]) {
						profileFields[i].FieldValue = tasks[index][profileFields[i].FieldName];
					}
				}
				if (profileFields[i].FieldName !== "AssignmentName" && profileFields[i].FieldName !== "AssignmentStatus") {
					formElements.push(profileFields[i]);
				} else {
					if (profileFields[i].FieldName === "AssignmentName") {
						form.name = profileFields[i].FieldValue;
					} else {
						form.status = profileFields[i].FieldValue;
					}
				}
				if (((i + 1) % 5) === 0 || i === (selectedTask.length - 1)) {
					formContainers.push({
						form: $.extend(true, [], formElements)
					});
					formElements = [];
				}
			}
			form.containers = formContainers;
			oModel.setData(form);
			// oModel.setData(data);
			oControl.setProperty('/createAssignment', false);
			oControl.setProperty('/editAssignment', false);
			oControl.setProperty('/displayAssignment', false);
			oControl.setProperty('/copyAssignment', false);
			oControl.setProperty('/importAssignment', true);
			oControl.setProperty('/assignmentTitle', this.oBundle.getText("displayAssignment"));
			this.setGlobalModel(oControl, "controls");
			this.setGlobalModel(oModel, "EditedTask");
			this.getRouter().navTo("editAssignment", {}, false);
		},
		onExit: function () {
			sap.ui.getCore().getMessageManager().removeAllMessages();
			// The personalization table must be destroyed by the app. If not, when the app is restarted another personalization
			// table is created with the same ID and thus the app can't be started.
			if (this.oTablePersoController) {
				this.oTablePersoController.destroy();
				delete this.oTablePersoController;
			}
			if (this.oTableTodoPersoController) {
				this.oTableTodoPersoController.destroy();
				delete this.oTableTodoPersoController;
			}
			if (this.oTableTaskPersoController) {
				this.oTableTaskPersoController.destroy();
				delete this.oTableTaskPersoController;
			}
		},
		timeInstance: function(){
			
			return {
					AllowEdit: "N",
					AllowRelease: "",
					ProfileId:"",
					Pernr:"",
					Weeknr:"",
					Counter:"",
					Awart:"",
					Rproj:"",
					Day1:"0",
					Day2:"0",
					Day3:"0",
					Day4:"0",
					Day5:"0",
					Day6:"0",
					Day7:"0",
					Workdate:"",
					Status:"",
					OldAwart:"",
					OldRproj:"",
				};
		},
		recordTemplate: function () {
			var that = this;
			var recordTemplate = {
				AllowEdit: "X",
				AllowRelease: "",
				AssignmentId: "",
				AssignmentName: "",
				CatsDocNo: "",
				Counter: "",
				Pernr: that.empID,
				RefCounter: "",
				RejReason: "",
				Status: "",
				target: "",
				TimeEntryDataFields: {
					AENAM: "",
					ALLDF: "",
					APDAT: null,
					APNAM: "",
					ARBID: "00000000",
					ARBPL: "",
					AUERU: "",
					AUFKZ: "",
					AUTYP: "00",
					AWART: "",
					BEGUZ: "000000",
					BELNR: "",
					BEMOT: "",
					BUDGET_PD: "",
					BUKRS: "",
					BWGRL: "0.0",
					CATSAMOUNT: "0.0",
					CATSHOURS: "0.00",
					CATSQUANTITY: "0.0",
					CPR_EXTID: "",
					CPR_GUID: "",
					CPR_OBJGEXTID: "",
					CPR_OBJGUID: "",
					CPR_OBJTYPE: "",
					ENDUZ: "000000",
					ERNAM: "",
					ERSDA: null,
					ERSTM: null,
					ERUZU: "",
					EXTAPPLICATION: "",
					EXTDOCUMENTNO: "",
					EXTSYSTEM: "",
					FUNC_AREA: "",
					FUND: "",
					GRANT_NBR: "",
					HRBUDGET_PD: "",
					HRCOSTASG: "0",
					HRFUNC_AREA: "",
					HRFUND: "",
					HRGRANT_NBR: "",
					HRKOSTL: "",
					HRLSTAR: "",
					KAPAR: "",
					KAPID: "00000000",
					KOKRS: "",
					LAEDA: null,
					LAETM: null,
					LGART: "",
					LOGSYS: "",
					LONGTEXT: "",
					LONGTEXT_DATA: "",
					LSTAR: "",
					LSTNR: "",
					LTXA1: "",
					MEINH: "",
					OFMNW: "0.0",
					OTYPE: "",
					PAOBJNR: "0000000000",
					PEDD: null,
					PERNR: "00000000",
					PLANS: "00000000",
					POSID: "",
					PRAKN: "",
					PRAKZ: "0000",
					PRICE: "0.0",
					RAPLZL: "00000000",
					RAUFNR: "",
					RAUFPL: "0000000000",
					REASON: "",
					REFCOUNTER: "000000000000",
					REINR: "0000000000",
					RKDAUF: "",
					RKDPOS: "000000",
					RKOSTL: "",
					RKSTR: "",
					RNPLNR: "",
					RPROJ: "00000000",
					RPRZNR: "",
					SBUDGET_PD: "",
					SEBELN: "",
					SEBELP: "00000",
					SKOSTL: "",
					SPLIT: "0",
					SPRZNR: "",
					STATKEYFIG: "",
					STATUS: "",
					S_FUNC_AREA: "",
					S_FUND: "",
					S_GRANT_NBR: "",
					TASKCOMPONENT: "",
					TASKCOUNTER: "",
					TASKLEVEL: "",
					TASKTYPE: "",
					TCURR: "",
					TRFGR: "",
					TRFST: "",
					UNIT: "",
					UVORN: "",
					VERSL: "",
					VORNR: "",
					VTKEN: "",
					WABLNR: "",
					WAERS: "",
					WERKS: "",
					WORKDATE: "",
					WORKITEMID: "000000000000",
					WTART: ""
				},
				TimeEntryOperation: "",
				Awart: "PRES",
				Rproj: "",
				Day1: 0,
				Day2: 0,
				Day3: 0,
				Day4: 0,
				Day5: 0,
				Day6: 0,
				Day7: 0,
				Weeknr:0,
				Weekstatus:99
			};
			return recordTemplate;
		},
		newTimeInstance: function(){
			var instance =
			{
					Counter : "",
					Pernr : "",
					StartDate : "",
					Weeknr : "",
					Weekstatus : "",
					Awart : "",
					EndDate : "",
					ProfileId : "",
					Rproj : "",
					Post1 : "",
					Lstar : "",
					Day1 : "",
					Day2 : "",
					Day3 : "",
					Day4 : "",
					Day5 : "",
					Day6 : "",
					Day7 : "",
					Counter1 : "",
					Counter2 : "",
					Counter3 : "",
					Counter4 : "",
					Counter5 : "",
					Counter6 : "",
					Counter7 : "",
					Status1 : "",
					Status2 : "",
					Status3 : "",
					Status4 : "",
					Status5 : "",
					Status6 : "",
					Status7 : "",
					Meinh : "",
					Workdate : "",
					OldAwart : "",
					OldRproj : "",
					Action : ""
			};		
			
			return instance;
		},
		
		
		onEditTodoListMobile: function (oEvent) {
			var that = this;
			var index = oEvent.getSource().getParent().getBindingContext('TodoList').getPath().split('/')[1];
			var todolist = this.getModel('TodoList').getData();
			var oModel = new JSONModel(todolist[index]);
			this.setGlobalModel(oModel, "EditTodo");
			this.getRouter().navTo("editToDo", {}, false);
		},
		getFieldTexts: function (oFieldName) {
			var that = this;
			that.showBusy();
			var texts;
			var oModel = new sap.ui.model.json.JSONModel();
			var f = [];
			var c = new sap.ui.model.Filter({
				path: "Pernr",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: this.empID
			});
			var d = new sap.ui.model.Filter({
				path: "FieldName",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: oFieldName
			});
			var e = new sap.ui.model.Filter({
				path: "MaximumHits",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "10000"
			});
			f.push(c);
			f.push(d);
			f.push(e);
			var mParameters = {
				urlParameters: '$expand=ValueHelpHits',
				filters: f,
				success: function (oData, oResponse) {
					texts = oData.results[0].ValueHelpHits.results;
					oModel.setData(texts);
					that.setModel(oModel, oFieldName);
					that.setGlobalModel(oModel, oFieldName);
					that.oTaskTable.bindItems({
						path: 'TaskFields>/',
						factory: that.dynamicBindingRows.bind(that)
					});
					that.hideBusy();
				},
				error: function (oError) {
					that.oErrorHandler.processError(oError);
				}
			};
			this.oDataModel.read('/ValueHelpCollection', mParameters);

		},
		getFieldText: function (oFieldName, key) {
			var that = this;
			return new Promise(function (fnResolve, fnReject) {
				// that.showBusy();
				var texts;
				var oModel = new sap.ui.model.json.JSONModel();
				var f = [];
				var c = new sap.ui.model.Filter({
					path: "Pernr",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: this.empID
				});
				var d = new sap.ui.model.Filter({
					path: "FieldName",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: oFieldName
				});
				var e = new sap.ui.model.Filter({
					path: "SelField1Name",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: oFieldName
				});
				var g = new sap.ui.model.Filter({
					path: "SelField1Val",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: key
				});
				f.push(c);
				f.push(d);
				f.push(e);
				f.push(g);
				var mParameters = {
					urlParameters: '$expand=ValueHelpHits',
					filters: f,
					success: function (oData, oResponse) {
						var data = [];
						var texts;

						if (that.getModel(oFieldName)) {
							var data = that.getModel(oFieldName).getData();
							if (oData.results[0].ValueHelpHits.results.length > 0) {
								texts = oData.results[0].ValueHelpHits.results[1];
								data.push(texts);
							}

						} else {
							if (oData.results[0].ValueHelpHits.results.length > 0) {
								data.push(oData.results[0].ValueHelpHits.results[1]);
							}
						}
						oModel.setData(data);
						that.setModel(oModel, oFieldName);
						that.setGlobalModel(oModel, oFieldName);
						that.oTaskTable.bindItems({
							path: 'TaskFields>/',
							factory: that.dynamicBindingRows.bind(that)
						});

						// that.hideBusy();

						fnResolve(oModel);
					},
					error: function (oError) {
						that.oErrorHandler.processError(oError);
					}
				};
				this.oDataModel.read('/ValueHelpCollection', mParameters);
			}.bind(this));

		},
		startTimeChange: function (oEvent) {
			var that = this;
			var data = this.getModel("TimeData").getData();
			var index = oEvent.getSource().getParent().getBindingContext('TimeData').getPath().split('/')[1];
			data[index].TimeEntryDataFields.BEGUZ = that.formatter.convertTime(oEvent.getSource().getDateValue());
			// data[index].TimeEntryDataFields.ENDUZ = that.formatter.convertTime(oEvent.getSource().getDateValue());
			if (data[index].Counter !== "") {
				data[index].TimeEntryOperation = 'U';
			} else {
				data[index].TimeEntryOperation = 'C';
			}
			var oModel = new JSONModel(data);
			that.setModel(oModel, "TimeData");
			this.getModel("controls").setProperty("/isOverviewChanged", true);
			this.getModel("controls").setProperty("/overviewDataChanged", true);
			var item = $.grep(this.oTable.getItems(), function (element, index) {
				if (!element.getAggregation('cells')) {
					return false;
				} else {
					return true;
				}
			});
			item[index].focus();
		},
		endTimeChange: function (oEvent) {
			var that = this;
			var data = this.getModel("TimeData").getData();
			var oControl = this.getModel("controls");
			var index = oEvent.getSource().getParent().getBindingContext('TimeData').getPath().split('/')[1];
			data[index].TimeEntryDataFields.ENDUZ = that.formatter.convertTime(oEvent.getSource().getDateValue());
			if (data[index].Counter !== "") {
				data[index].TimeEntryOperation = 'U';
			} else {
				data[index].TimeEntryOperation = 'C';
			}
			var oModel = new JSONModel(data);
			that.setModel(oModel, "TimeData");
			this.getModel("controls").setProperty("/isOverviewChanged", true);
			this.getModel("controls").setProperty("/overviewDataChanged", true);
			var item = $.grep(this.oTable.getItems(), function (element, index) {
				if (!element.getAggregation('cells')) {
					return false;
				} else {
					return true;
				}
			});
			item[index].focus();
		},
		startTimeToDoChange: function (oEvent) {
			var that = this;
			var data = this.getModel("TodoList").getData();
			var index = oEvent.getSource().getParent().getBindingContext('TodoList').getPath().split('/')[1];
			data[index].TimeEntryDataFields.BEGUZ = that.formatter.convertTime(oEvent.getSource().getDateValue());
			if (data[index].Counter !== "") {
				data[index].TimeEntryOperation = 'U';
			} else {
				data[index].TimeEntryOperation = 'C';
			}
			var oModel = new JSONModel(data);
			that.setModel(oModel, "TodoList");
			var item = $.grep(this.oToDoTable.getItems(), function (element, index) {
				if (!element.getAggregation('cells')) {
					return false;
				} else {
					return true;
				}
			});
			item[index].focus();
		},

		stopTimeToDoChange: function (oEvent) {
			var that = this;
			var data = this.getModel("TodoList").getData();
			var index = oEvent.getSource().getParent().getBindingContext('TodoList').getPath().split('/')[1];
			data[index].TimeEntryDataFields.ENDUZ = that.formatter.convertTime(oEvent.getSource().getDateValue());
			if (data[index].Counter !== "") {
				data[index].TimeEntryOperation = 'U';
			} else {
				data[index].TimeEntryOperation = 'C';
			}
			var oModel = new JSONModel(data);
			that.setModel(oModel, "TodoList");
			var item = $.grep(this.oToDoTable.getItems(), function (element, index) {
				if (!element.getAggregation('cells')) {
					return false;
				} else {
					return true;
				}
			});
			item[index].focus();
		},
		noAssignmentsDialog: function () {
			var that = this;
		},
		handleConfirmationDiscard: function (oEvent) {
			this._confirmationFunction();
		},
		showConfirmBox: function (oEvent, ok) {
			var that = this;
			var oDialogController = {
				handleClose: function (oEvent) {
					that._oDialog.destroy();
				},
				handleConfirmationDiscard: function (oEvent) {
					ok();
					that._oDialog.destroy();
				}
			};
			// if (!this._oDialog) {
			this._oDialog = sap.ui.xmlfragment(this.getView().getId(), "hcm.fab.mytimesheet.view.fragments.CancelConfirmationPopOver",
				oDialogController);
			this.getView().addDependent(this._oDialog);
			// }
			this._oDialog.openBy(oEvent.getSource());
			// this._confirmationFunction = ok;
		},
		onCancelConfirm: function (oEvent) {
			var oControls = this.getModel("controls");
			if (oControls.getProperty("/isOverviewChanged") === true) {
				this.showConfirmBox(oEvent, this.onCancel.bind(this));
				oControls.setProperty("/isOverviewChanged", false);
			} else {
				this.onCancel();
				oControls.setProperty("/isOverviewChanged", false);
			}
			oControls.setProperty("/overviewDataChanged", false);
			sap.ui.getCore().getMessageManager().removeAllMessages();

		},
		onTodoCancelConfirm: function (oEvent) {
			var oControls = this.getModel("controls");
			if (oControls.getProperty("/isToDoChanged") === true) {
				this.showConfirmBox(oEvent, this.onTodoCancel.bind(this));
				oControls.setProperty("/isToDoChanged", false);
			} else {
				this.onTodoCancel();
				oControls.setProperty("/isToDoChanged", false);
			}
			oControls.setProperty("/todoDataChanged", false);
			sap.ui.getCore().getMessageManager().removeAllMessages();
		},
		onCreateGroup: function (oEvent) {
			var oSelectedItems = this.byId("idTasks").getSelectedContexts();
			var oAssignments = this.getModel("Tasks").getData();
			var group = {
				"groupId": null,
				"groupName": "",
				"count": 0,
				"Assignments": [],
			};
			this.byId("idTasks").setBusy(true);
			for (var i = 0; i < oSelectedItems.length; i++) {
				var index = oSelectedItems[i].sPath.split('/')[1];
				group.Assignments.push({
					"AssignmentId": oAssignments[index].AssignmentId,
					"AssignmentName": oAssignments[index].AssignmentName,
					"ValidityStartDate": oAssignments[index].ValidityStartDate,
					"ValidityEndDate": oAssignments[index].ValidityEndDate
				});
			}
			var oControls = this.getModel("controls");
			oControls.setProperty('/displayGroup', false);
			oControls.setProperty('/GroupCancel', true);
			oControls.setProperty('/createGroup', true);
			oControls.setProperty('/displayGroupCancel', false);
			oControls.setProperty('/GroupCancel', true);
			this.setGlobalModel(oControls, "controls");
			this.setGlobalModel(new JSONModel(group), "createGroup");
			this.byId("idTasks").setBusy(false);
			this.getRouter().navTo("createGroup", {}, false);
		},
		getAssignmentGroups: function () {
			this.oTaskTable.setBusy(true);
			var that = this;
			// var oModel = new sap.ui.model.json.JSONModel();
			// var TaskModel = new sap.ui.model.json.JSONModel();
			// var oControl;
			// var obj;
			// var TaskFields = [];
			// var task = {};
			var a = new sap.ui.model.Filter({
				path: "Pernr",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: this.empID
			});
			var f = [];
			f.push(a);

			var mParameters = {
				filters: f,
				urlParameters: '$expand=ToGrps',
				success: function (oData, oResponse) {
					that.tasks = oData.results;
				},
				error: function (oError) {
					that.oTaskTable.setBusy(false);
					that.oErrorHandler.processError(oError);
				}
			};
			this.oDataModel.read('/AssignmentCollection', mParameters);

		},
		onDisplayGroup: function (oEvent) {
			var that = this;
			var oControls = this.getModel("controls");
			oControls.setProperty('/displayGroup', true);
			oControls.setProperty('/createGroup', false);
			oControls.setProperty('/editGroup', false);
			oControls.setProperty('/displayGroupCancel', false);
			oControls.setProperty('/GroupCancel', false);
			this.setGlobalModel(oControls, "controls");
			var Assignments = this.getModel('AssignmentGroups').getData();
			var index = parseInt(oEvent.getSource().getBindingContext('AssignmentGroups').getPath().split('/')[1]);
			this.setGlobalModel(new JSONModel(Assignments[index]), "createGroup");
			this.getRouter().navTo("createGroup", {}, false);
		},
		onEditGroup: function (oEvent) {
			var that = this;
			var oControls = this.getModel("controls");
			oControls.setProperty('/displayGroup', false);
			oControls.setProperty('/editGroup', true);
			oControls.setProperty('/displayGroupCancel', false);
			oControls.setProperty('/GroupCancel', true);
			this.setGlobalModel(oControls, "controls");
			var Assignments = this.getModel('AssignmentGroups').getData();
			var index = parseInt(this.byId('idGroups').getSelectedItem().getBindingContext('AssignmentGroups').getPath().split("/")[1]);
			this.setGlobalModel(new JSONModel(Assignments[index]), "createGroup");
			this.getRouter().navTo("createGroup", {}, false);
		},
		handleDateChange: function (oEvent) {
			var that = this;
			var oDialogController = {
				handleConfirm: function (oEvent) {
					var dateFrom = oDateRange.getDateValue();
					var dateTo = oDateRange.getSecondDateValue();
					if (dateFrom == null && dateTo == null) {
						if (oDialog) {
							oDialog.destroy();
						}
					} else {
						that.getTasks(false, dateFrom, dateTo);
						that.filterAppliedFlag = "X";
						that.getView().byId("filterGroupAssignment").setType(sap.m.ButtonType.Emphasized);
					}
					if (oDialog) {
						oDialog.destroy();
					}
				},
				handleCancel: function (oEvent) {
					if (oDialog) {
						oDialog.destroy();
					}
				},
				handleResetFilters: function (oEvent) {
					if (oDialog && that.filterAppliedFlag == "X") {
						that.getTasks(false);
						that.getView().byId("filterGroupAssignment").setType(sap.m.ButtonType.Transparent);
						oDialog.destroy();
					}
				}
			};

			var oDialog = sap.ui.xmlfragment(this.getView().getId(), "hcm.fab.mytimesheet.view.fragments.FilterAssignment",
				oDialogController);
			// Set initial and reset value for Slider in custom control
			var oDateRange = oDialog.getFilterItems()[0].getCustomControl();
			this.getView().addDependent(oDialog);
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), oDialog);
			oDialog.open();

		},
		// group delete confirmation added
		//Note 2890326 Starts
		onGroupDeleteConfirm: function (oEvent) {
			var that = this;
			var messageHeader = that.oBundle.getText("confirmationDeleteGroup");
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			sap.m.MessageBox.warning(
				messageHeader, {
					title: that.oBundle.getText("delete"),
					actions: [sap.m.MessageBox.Action.DELETE, sap.m.MessageBox.Action.CANCEL],
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					onClose: function (sAction) {
						if (sAction === "DELETE") {
							that.onGroupDelete();
						}
					}
				}
			);
		},
		//Note 2890326 Ends
		onGroupSelection: function (oEvent) {
			var oControl = this.getModel("controls");
			var oSelectedItems = oEvent.getParameter("selectedContexts");
			if (oEvent.getParameters().listItem.getSelected() === true && this.byId("idGroups").getSelectedItems().length == 1) {
				oControl.setProperty("/EditGroup", true);
				oControl.setProperty("/DeleteGroup", true);
				oControl.setProperty("/createGroupButton", true);
			} else if (this.oTaskTable.getSelectedItems().length == 1) {
				oControl.setProperty("/EditGroup", true);
				oControl.setProperty("/DeleteGroup", true);
				oControl.setProperty("/createGroupButton", true);
			} else {
				oControl.setProperty("/EditGroup", false);
				if (this.byId("idGroups").getSelectedItems().length === 0) {
					oControl.setProperty("/DeleteGroup", false);
				} else {
					oControl.setProperty("/DeleteGroup", true);
				}
				oControl.setProperty("/createGroupButton", true);
			}
		},
		onGroupDelete: function (oEvent) {
			var that = this;
			var oGroupData = [];
			var oDelGroup = this.getModel('AssignmentGroups').getData();
			var oSelectedItems = this.byId('idGroups').getSelectedItems();
			for (var k = 0; k < oSelectedItems.length; k++) {
				var index = parseInt(oSelectedItems[k].getBindingContext('AssignmentGroups').getPath().split("/")[1]);
				if (oDelGroup[index].Assignments) {
					for (var i = 0; i < oDelGroup[index].Assignments.length; i++) {
						var data = {
							GrpId: oDelGroup[index].groupId,
							GrpName: oDelGroup[index].groupName,
							AssignmentId: oDelGroup[index].Assignments[i].AssignmentId,
							GrpOperation: 'D'
						};
						oGroupData.push(data);
					}
				}
			}
			this.SubmitGroup(oGroupData);
			// this.setGlobalModel(new JSONModel(Assignments[index]), "createGroup");
			// this.getRouter().navTo("createGroup", {}, false);
		},
		SubmitGroup: function (GroupData) {
			var that = this;
			var oModel = $.extend(true, {}, this.oDataModel);
			oModel.setChangeBatchGroups({
				"*": {
					groupId: "TimeGroup",
					changeSetId: "TimeGroup",
					single: false
				}
			});
			oModel.setDeferredGroups(["TimeGroup"]);
			oModel
				.refreshSecurityToken(
					function (oData) {
						for (var i = 0; i < GroupData.length; i++) {
							var obj = {
								properties: GroupData[i],
								changeSetId: "TimeGroup",
								groupId: "TimeGroup"
							};
							oModel
								.createEntry(
									"/AssignmentGrpsSet",
									obj);
						}
						oModel.submitChanges({
							groupId: "TimeGroup",
							changeSetId: "TimeGroup",
							success: function (oData, res) {
								var toastMsg = that.oBundle.getText("deleteGroup");
								sap.m.MessageToast.show(toastMsg, {
									duration: 3000
								});
								that.getTasks(false);
							},
							error: function (oError) {
								that.oErrorHandler.processError(oError);
							}
						});

					}, true);
		},
		handleSearchAssignments: function (oEvent) {
			WorklistController.prototype.handleSearchAssignments.apply(this,arguments);
		},
		handleSearchGroups: function (oEvent) {
			WorklistController.prototype.handleSearchGroups.apply(this,arguments);
		},
		navigateToTasks: function () {
			WorklistController.prototype.navigateToTasks.apply(this,arguments);
		},
		onShowOverviewMessage: function (oEvent) {
			WorklistController.prototype.onShowOverviewMessage.apply(this,arguments);
		},
		onCloseOverviewMessage: function (oEvent) {
			WorklistController.prototype.onCloseOverviewMessage.apply(this,arguments);
		},
		onShowAssignmentsMessage: function (oEvent) {
			WorklistController.prototype.onShowAssignmentsMessage.apply(this,arguments);
		},
		onCloseAssignmentsMessage: function (oEvent) {
			WorklistController.prototype.onCloseAssignmentsMessage.apply(this,arguments);
		},
		onShowGroupMessage: function (oEvent) {
			WorklistController.prototype.onShowGroupMessage.apply(this,arguments);
		},
		onCloseGroupMessage: function (oEvent) {
			WorklistController.prototype.onCloseGroupMessage.apply(this,arguments);
		},
		resizeWindow: function (oEvent) {
			WorklistController.prototype.resizeWindow.apply(this,arguments);
		},
		onProjectDetails: function (oEvent) {
			WorklistController.prototype.onProjectDetails.apply(this,arguments);
		},
		onReadOnlyProjectDetails: function (oEvent) {
			WorklistController.prototype.readOnlyProject.apply(this,arguments);
		},
		readOnlyProject: function () {
			WorklistController.prototype.readOnlyProject.apply(this,arguments);
		},
		getProjectDetails: function (oPernr, oProjectGuid, oTaskGuid) {
			WorklistController.prototype.getProjectDetails.apply(this,arguments);
		},
		renderTexts: function () {
			WorklistController.prototype.renderTexts.apply(this,arguments);
		},
		getFieldTextAsync: function (oFieldName, key) {
			WorlistController.prototype.getFieldTextAsync.apply(this, arguments);
		},
		onHoursChange: function(oEvent){
			var hours = oEvent.getSource().getValue();
/*			var jsonData = this.getModel("json").getData();
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var sMsg = oBundle.getText("HoursMinMax", [jsonData.HoursMin, jsonData.HoursMax]);
			if( hours < jsonData.HoursMin ||  hours > jsonData.HoursMax ){
				oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
				oEvent.getSource().setValueStateText(sMsg)
			}else{
				oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
			}*/
			var contextPath = oEvent.getSource().getParent().getBindingContextPath();
			//+ "/" + oEvent.getSource().getBindingInfo("value").parts[0].path;
			
			//console.log("onHoursChange: " + contextPath);
			
/*			this.getModel("time").setProperty( 
				oEvent.getSource().getParent().getBindingContextPath() + "/" + oEvent.getSource().getBindingInfo("value").parts[0].path, hours );*/
			
			this.onTimeOverviewDataChanged(contextPath, oEvent.getSource().getBindingInfo("value").parts[0].path, hours);
		},
		onPresenceChange: function(oEvent){
			var presence = oEvent.getParameter("selectedItem").getKey();
			var selectedItem = oEvent.getParameter("selectedItem");
			
			if(selectedItem === null){
				return;
			}
			
			var presence = oEvent.getParameter("selectedItem").getKey();
			//var presenceModifiable = this.getModel("VH").getProperty("/ZV_CAT_PRES_VH('" + presence + "')/Modifiable");
			var presenceEotpObligatoire = this.getModel("VH").getProperty("/ZV_CAT_PRES_VH('" + presence + "')/EotpObligatoire");
			var eOtpInputField = oEvent.getSource().getParent().getCells()[1];
			//oEvent.getSource().getParent().getCells()[1].setVisible(presenceEotpObligatoire=='X'?true:false);
			if( presenceEotpObligatoire === 'X'){
/*				eOtpInputField.setValueState(sap.ui.core.ValueState.Error);
				eOtpInputField.setValueStateText("Veuillez saisir un élément d'OTP");
				eOtpInputField.focus();*/
			}else{
				eOtpInputField.setValue("");
			}
/*			}else if( presenceModifiable !== 'X'){
				oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
				oEvent.getSource().setValueStateText("Catég. de présence non utilisable sur cette appliaction");
				oEvent.getSource().setSelected
			}else{
				oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
				eOtpInputField.setValueState(sap.ui.core.ValueState.None);
			}*/
/*			this.getModel("json").setProperty( 
				oEvent.getSource().getParent().getBindingContextPath() + "/Awart", presence );		*/	
			this.onTimeOverviewDataChanged(oEvent.getSource().getParent().getBindingContextPath(), "/Awart", presence);
		},
		zGetTimeEntryKey:function(){
			debugger;
		},
		zOnWBSChange: function(oEvent){
			var eOtpInputField = oEvent.getSource();
			var newValue = oEvent.getParameter("newValue");
			var awartInputField = oEvent.getSource().getParent().getCells()[0];
			var presence = awartInputField.getSelectedItem().getKey();
			if(presence === null || presence === undefined){
				return;
			}
			//var presenceModifiable = this.getModel("VH").getProperty("/ZV_CAT_PRES_VH('" + presence + "')/Modifiable");
			var presenceEotpObligatoire = this.getModel("VH").getProperty("/ZV_CAT_PRES_VH('" + presence + "')/EotpObligatoire");
			eOtpInputField.setValueState(sap.ui.core.ValueState.None);
			if( presenceEotpObligatoire === 'X' && eOtpInputField.getValue() === ""){
				eOtpInputField.setValueState(sap.ui.core.ValueState.Error);
				eOtpInputField.setValueStateText("Veuillez saisir un élément d'OTP");
				eOtpInputField.focus();
			}
/*			this.getModel("json").setProperty( 
				oEvent.getSource().getParent().getBindingContextPath() + "/Rproj", newValue );*/
			this.onTimeOverviewDataChanged(oEvent.getSource().getParent().getBindingContextPath(), "/Rproj",newValue );
		},
		forceIntegerInput: function(oEvent){
			if(oEvent.getSource().getValue() === ""){
                oEvent.getSource().setValue(0);
				oEvent.getSource().fireChange();
            }
			var isLastKeyaNumber = /^\d+$/.test(oEvent.getSource().getValue());
			if(!isLastKeyaNumber){
			    oEvent.getSource().setValue(oEvent.getParameter("newValue").substr(0,oEvent.getParameter("newValue").length-1))
			}
		},
		WBSFav: function(){
			//var oDateFormat = DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}); 
			var oEdmTimeType = new sap.ui.model.odata.type.DateTime({pattern : "PThh'H'mm'M'ss'S'"});
			return {
				     Uname : sap.ushell.Container.getService("UserInfo").getId(),
				     Posid : '',
				     Post1 : '',
				     Erdat  : new Date(),
				     Erzet  : oEdmTimeType.formatValue( new Date() , 'string')
			}
		},
		onFavorisPress: function(oEvent){
			var that = this;
			var oModel = this.getModel("ZC_HCMFAB_FAV_CDS");
			var obj = new this.WBSFav();
			this.presssedBtn = oEvent.getSource();
			const pressed = oEvent.getSource().getPressed();
			obj.Posid = oEvent.getSource().getParent().getCells()[1].getText();
			obj.Post1 = oEvent.getSource().getParent().getCells()[2].getText();
			if(pressed){
				//oModel.create("/zc_hcmfab_fav",obj,{success: function(response){ debugger; },success: function(response){ debugger; }});
				oModel.create("/zc_hcmfab_fav",obj,{
					success: function(oData){
						var pressed = this.presssedBtn.getPressed()?"X":"";
						var rsIndex = _.findIndex(this.getModel("json").getData().ZC_WBSElementVH, (el)=> el.WBSElement === oData.Posid);
						this.getModel("json").setProperty("/ZC_WBSElementVH/"+rsIndex+"/Favoris",pressed);
					}.bind(that)
				});
			}else{
				var link = "/zc_hcmfab_fav(Uname='$Uname',Posid='$Posid')";
				link = 	link.replace("$Uname", obj.Uname)
							.replace("$Posid", obj.Posid);
				oModel.remove(link,{
				success: function(oData){
						var pressed = this.presssedBtn.getPressed()?"X":"";
						var Posid = this.presssedBtn.getParent().getCells()[1].getText();
						var rsIndex = _.findIndex(this.getModel("json").getData().ZC_WBSElementVH, (el)=> el.WBSElement === Posid);
						this.getModel("json").setProperty("/ZC_WBSElementVH/"+rsIndex+"/Favoris",pressed);
					}.bind(that)
				});
			}	
		}
/*		onAfterRendering: function(oEvent){
			var oSmartNavigation = sap.ushell.Container.getService("SmartNavigation");
			if( sap.ushell.Container.getService("UserInfo").getId() !== "FIORI_UT" ){
				MessageBox.alert("La tuile est en développement", 
					{
	    				title: "Alert",                                      // default
	    				onClose: function(oAction) {
						sap.ushell.Container.getService("SmartNavigation").toExternal({
						target: {
						semanticObject: "Shell",
						action: "home"
						}});		
						}
					}
				);
			}
		}
*/		
	});
	return WorklistExt;
});