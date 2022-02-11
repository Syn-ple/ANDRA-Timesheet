/* YOUSSEF BOUIGUA */
sap.ui.define([
	"./CoreService",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (CoreService,Sorter,Filter, FilterOperator) {
	"use strict";

	var TimesheetService = CoreService.extend("hcm.fab.mytimesheet.HCMFAB_MY_TIMEExtension.service.TimesheetService", {
		getTimeEntries: function (oStartDate,oEndDate) {
			var mParameters = {
				filters: [
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
						]
			};
			return this.odata("/TimeEntries").get(mParameters);
		}
	});
	return new TimesheetService();
});