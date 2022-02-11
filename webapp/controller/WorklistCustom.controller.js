sap.ui.define([
	"hcm/fab/mytimesheet/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"hcm/fab/mytimesheet/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessagePopover",
	"sap/m/MessagePopoverItem",
	"sap/m/TablePersoController",
	"sap/m/GroupHeaderListItem",
	"sap/ui/core/Fragment",
	"sap/m/Dialog",
	"sap/m/Text"
], function (B, J, H, e, F, g, M, h, T, G, l, D, n) {
	"use strict";

	function o(E) {
		var c = E.getParameter("element");
		var s = E.getParameter("message");
		if (c && c.setValueStateText && s) {
			c.setValueStateText(s);
		}
		if (c && c.setValueState) {
			c.setValueState("Error");
		}
	}

	function p(E) {
		var c = E.getParameter("element");
		if (c && c.setValueState) {
			c.setValueState("None");
		}
	}
	return sap.ui.controller("hcm.fab.mytimesheet.HCMFAB_MY_TIMEExtension.controller.WorklistCustom", {
		//    formatter: e,
		//    onInit: function () {
		//        this.oDataModel = this.getOwnerComponent().getModel();
		//        this.oCEModel = this.getOwnerComponent().getModel("ce");
		//        this.oBundle = this.getResourceBundle();
		//        this.oErrorHandler = this.getOwnerComponent()._oErrorHandler;
		//        this.initoDataModel(this.oDataModel);
		//        this.initoBundle(this.oBundle);
		//        this.initRouter(this.getRouter());
		//        this.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "message");
		//        this.empId = null;
		//        this._nCounter = 0;
		//        this.oFormatYyyymmdd = sap.ui.core.format.DateFormat.getInstance({
		//            pattern: "yyyy-MM-dd",
		//            calendarType: sap.ui.core.CalendarType.Gregorian
		//        });
		//        this.oFormatyyyymmdd = sap.ui.core.format.DateFormat.getInstance({
		//            pattern: "yyyyMMdd",
		//            calendarType: sap.ui.core.CalendarType.Gregorian
		//        });
		//        this.oFormatDate = sap.ui.core.format.DateFormat.getInstance({
		//            style: "full",
		//            calendarType: sap.ui.core.CalendarType.Gregorian
		//        });
		//        sap.ui.getCore().attachParseError(o);
		//        sap.ui.getCore().attachValidationSuccess(p);
		//        this.busyDialog = new sap.m.BusyDialog();
		//        this.oRouter = this.getOwnerComponent().getRouter();
		//        this.calendar = this.byId("idCalendar");
		//        this.mCalendar = this.byId("mCalendar");
		//        this.oTable = this.byId("idOverviewTable");
		//        this.oTaskTable = this.byId("idTasks");
		//        this.oToDoTable = this.byId("idToDoList");
		//        this.oRouter.getRoute("worklist").attachMatched(this.worklistRouteMatched.bind(this), this);
		//        var d = [];
		//        var m = new J();
		//        m.setData(d);
		//        this.setModel(m, "deleteRecords");
		//        this.setModel(m, "changedRecords");
		//        this.setModel(m, "newRecords");
		//        this.updatedRecords = [];
		//        this.originalTimedata = [];
		//        this.newRecords = [];
		//        this.deleteRecords = [];
		//        var c = new Date();
		//        var f = this.byId("idCalendar").getStartDate();
		//        f.setMonth(c.getMonth() - 1, 1);
		//        this.dateFrom = this.getFirstDayOfWeek(new Date(f), "Sunday");
		//        c = new Date();
		//        c.setMonth(c.getMonth() + 3, 0);
		//        this.dateTo = c;
		//        this.calendar.destroySelectedDates();
		//        this.startdate = this.getFirstDayOfWeek(new Date(), "Sunday");
		//        this.enddate = this.getLastDayOfWeek(new Date(), "Sunday");
		//        var s = new sap.ui.unified.DateRange();
		//        s.setStartDate(this.startdate);
		//        s.setEndDate(this.enddate);
		//        var a = new J({
		//            showFooter: false,
		//            submitDraft: false,
		//            sendForApproval: false,
		//            clockEntry: false,
		//            overviewCancel: false,
		//            todoCancel: false,
		//            todoDone: false,
		//            taskEdit: false,
		//            taskDelete: false,
		//            taskCopy: false,
		//            duplicateVisibility: false,
		//            duplicateWeekVisibility: false,
		//            onEdit: "None",
		//            duplicateTaskEnable: false,
		//            duplicateWeekEnable: true,
		//            editLongTextEnabled: false,
		//            feedListVisibility: false,
		//            firstDayOfWeek: 0,
		//            isGroup: false,
		//            startDate: s,
		//            createAssignment: false,
		//            copyAssignment: false,
		//            displayAssignment: false,
		//            displayAssignmentCancel: false,
		//            editAssignment: false,
		//            assignmentTitle: null,
		//            tasksActiveLength: null,
		//            tasksInactiveLength: null,
		//            clockTimeVisible: false,
		//            editTodoVisibility: true,
		//            numberOfRecords: 0,
		//            overviewEditEnabled: true,
		//            importAssignment: true,
		//            showFooterAssignment: false,
		//            importWorklist: false,
		//            approverAllowed: false,
		//            displayGroup: false,
		//            groupReload: false,
		//            createGroup: false,
		//            EditGroup: false,
		//            DeleteGroup: false,
		//            isOverviewChanged: false,
		//            isToDoChanged: false,
		//            overviewDataChanged: false,
		//            todoDataChanged: false,
		//            showOverviewMessage: true,
		//            showAssignmentsMessage: true,
		//            showGroupMessage: true,
		//            duplicateTaskButtonEnable: false,
		//            duplicateWeekButtonEnable: false
		//        });
		//        if (sap.ui.Device.system.phone === true) {
		//            a.isGroup = true;
		//        }
		//        this.setModel(a, "controls");
		//        this.calendar.addSelectedDate(s);
		//        sap.ui.getCore().attachParseError(o);
		//        sap.ui.getCore().attachValidationSuccess(p);
		//        sap.ui.getCore().getMessageManager().registerObject(this.getView(), true);
		//        this.filterAppliedFlag = "";
		//    },
		//    onCheckboxSelection: function (E) {
		//        var t = this;
		//        var i = E.getParameter("selectedItem").getBindingContext("TimeData").getPath().split("/")[1];
		//        this.getModel("TimeData").getData()[i].SetDraft = true;
		//        this.getModel("controls").setProperty("isOverviewChanged", true);
		//    },
		//    getTimeEntries: function (d, j) {
		//        var t = this;
		//        var m = new sap.ui.model.json.JSONModel();
		//        var a = new sap.ui.model.Filter({
		//            path: "StartDate",
		//            operator: sap.ui.model.FilterOperator.EQ,
		//            value1: this.oFormatYyyymmdd.format(d)
		//        });
		//        var b = new sap.ui.model.Filter({
		//            path: "EndDate",
		//            operator: sap.ui.model.FilterOperator.EQ,
		//            value1: this.oFormatYyyymmdd.format(j)
		//        });
		//        var c = new sap.ui.model.Filter({
		//            path: "Pernr",
		//            operator: sap.ui.model.FilterOperator.EQ,
		//            value1: this.empID
		//        });
		//        var f = [];
		//        f.push(a);
		//        f.push(b);
		//        f.push(c);
		//        var P = {
		//            filters: f,
		//            urlParameters: "$expand=TimeEntries",
		//            success: function (k, r) {
		//                t.timeEntries = k.results;
		//                t.minDate = k.results[0].CaleNavMinDate;
		//                t.maxDate = k.results[0].CaleNavMaxDate;
		//                m.setData(t.timeEntries);
		//                t.setModel(m, "TimeEntries");
		//                if (t.firstDayOfWeek == undefined) {
		//                    t.firstDayOfWeek = e.dayOfWeek(t.timeEntries[0].FirstDayOfWeek);
		//                    var q = new Date();
		//                    var s = t.byId("idCalendar").getStartDate();
		//                    s.setMonth(q.getMonth() - 1, 1);
		//                    t.dateFrom = t.getFirstDayOfWeek(new Date(s), t.firstDayOfWeek);
		//                    q = new Date();
		//                    q.setMonth(q.getMonth() + 3, 0);
		//                    t.dateTo = q;
		//                    t.calendar.destroySelectedDates();
		//                    if (sap.ui.Device.system.phone === true) {
		//                        var u = t.getFirstDayOfWeek(new Date(), t.firstDayOfWeek);
		//                        t.mCalendar.setStartDate(u);
		//                        t.startdate = new Date();
		//                        t.enddate = new Date();
		//                    } else {
		//                        t.startdate = t.getFirstDayOfWeek(new Date(), t.firstDayOfWeek);
		//                        t.enddate = t.getLastDayOfWeek(new Date(), t.firstDayOfWeek);
		//                    }
		//                }
		//                t.bindTable(new Date(t.startdate), new Date(t.enddate));
		//                if (t.oReadOnlyTemplate) {
		//                    t.rebindTableWithTemplate(t.oTable, "TimeData>/", t.oReadOnlyTemplate, "Navigation");
		//                }
		//                if (sap.ui.Device.system.phone === true) {
		//                    var u = t.getFirstDayOfWeek(t.startdate, t.firstDayOfWeek);
		//                    t.mCalendar.setStartDate(u);
		//                    t.calendarSelection(t.mCalendar, t.startdate, t.enddate);
		//                } else {
		//                    t.calendarSelection(t.calendar, t.startdate, t.enddate);
		//                }
		//                var v = $.grep(t.timeEntries, function (A, C) {
		//                    return A.Status == "MISSING";
		//                });
		//                var w = $.grep(t.timeEntries, function (A, C) {
		//                    return A.Status == "DONE";
		//                });
		//                var x = $.grep(t.timeEntries, function (A, C) {
		//                    return A.Status == "REJECTED";
		//                });
		//                var y = $.grep(t.timeEntries, function (A, C) {
		//                    return A.Status == "FORAPPROVAL";
		//                });
		//                var z = $.grep(t.timeEntries, function (A, C) {
		//                    return A.Status == "DRAFT";
		//                });
		//                for (var i = 0; i < z.length; i++) {
		//                    if (sap.ui.Device.system.phone === true) {
		//                        t.mCalendar.addSpecialDate(new sap.ui.unified.DateTypeRange({
		//                            startDate: new Date(z[i].CaleDate.substring(0, 4) + "-" + z[i].CaleDate.substring(4, 6) + "-" + z[i].CaleDate.substring(6, 8)),
		//                            type: sap.ui.unified.CalendarDayType.Type01,
		//                            tooltip: t.oBundle.getText("timeMissing")
		//                        }));
		//                    } else {
		//                        t.calendar.addSpecialDate(new sap.ui.unified.DateTypeRange({
		//                            startDate: new Date(z[i].CaleDate.substring(0, 4) + "-" + z[i].CaleDate.substring(4, 6) + "-" + z[i].CaleDate.substring(6, 8)),
		//                            type: sap.ui.unified.CalendarDayType.Type01,
		//                            tooltip: t.oBundle.getText("timeMissing")
		//                        }));
		//                    }
		//                }
		//                if (sap.ui.Device.system.phone === true) {
		//                    for (var i = 0; i < v.length; i++) {
		//                        t.mCalendar.addSpecialDate(new sap.ui.unified.DateTypeRange({
		//                            startDate: new Date(v[i].CaleDate.substring(0, 4) + "-" + v[i].CaleDate.substring(4, 6) + "-" + v[i].CaleDate.substring(6, 8)),
		//                            type: sap.ui.unified.CalendarDayType.Type01,
		//                            tooltip: t.oBundle.getText("timeMissing")
		//                        }));
		//                    }
		//                } else {
		//                    for (var i = 0; i < v.length; i++) {
		//                        t.calendar.addSpecialDate(new sap.ui.unified.DateTypeRange({
		//                            startDate: new Date(v[i].CaleDate.substring(0, 4) + "-" + v[i].CaleDate.substring(4, 6) + "-" + v[i].CaleDate.substring(6, 8)),
		//                            type: sap.ui.unified.CalendarDayType.Type01,
		//                            tooltip: t.oBundle.getText("timeMissing")
		//                        }));
		//                    }
		//                }
		//                if (sap.ui.Device.system.phone === true) {
		//                    for (var i = 0; i < y.length; i++) {
		//                        t.mCalendar.addSpecialDate(new sap.ui.unified.DateTypeRange({
		//                            startDate: new Date(y[i].CaleDate.substring(0, 4) + "-" + y[i].CaleDate.substring(4, 6) + "-" + y[i].CaleDate.substring(6, 8)),
		//                            type: sap.ui.unified.CalendarDayType.Type01,
		//                            tooltip: t.oBundle.getText("timeMissing")
		//                        }));
		//                    }
		//                } else {
		//                    for (var i = 0; i < y.length; i++) {
		//                        t.calendar.addSpecialDate(new sap.ui.unified.DateTypeRange({
		//                            startDate: new Date(y[i].CaleDate.substring(0, 4) + "-" + y[i].CaleDate.substring(4, 6) + "-" + y[i].CaleDate.substring(6, 8)),
		//                            type: sap.ui.unified.CalendarDayType.Type01,
		//                            tooltip: t.oBundle.getText("timeMissing")
		//                        }));
		//                    }
		//                }
		//                if (sap.ui.Device.system.phone === true) {
		//                    for (var i = 0; i < w.length; i++) {
		//                        t.mCalendar.addSpecialDate(new sap.ui.unified.DateTypeRange({
		//                            startDate: new Date(w[i].CaleDate.substring(0, 4) + "-" + w[i].CaleDate.substring(4, 6) + "-" + w[i].CaleDate.substring(6, 8)),
		//                            type: sap.ui.unified.CalendarDayType.Type08,
		//                            tooltip: t.oBundle.getText("timeCompleted")
		//                        }));
		//                    }
		//                } else {
		//                    for (var i = 0; i < w.length; i++) {
		//                        t.calendar.addSpecialDate(new sap.ui.unified.DateTypeRange({
		//                            startDate: new Date(w[i].CaleDate.substring(0, 4) + "-" + w[i].CaleDate.substring(4, 6) + "-" + w[i].CaleDate.substring(6, 8)),
		//                            type: sap.ui.unified.CalendarDayType.Type08,
		//                            tooltip: t.oBundle.getText("timeCompleted")
		//                        }));
		//                    }
		//                }
		//                if (sap.ui.Device.system.phone === true) {
		//                    for (var i = 0; i < x.length; i++) {
		//                        t.mCalendar.addSpecialDate(new sap.ui.unified.DateTypeRange({
		//                            startDate: new Date(x[i].CaleDate.substring(0, 4) + "-" + x[i].CaleDate.substring(4, 6) + "-" + x[i].CaleDate.substring(6, 8)),
		//                            type: sap.ui.unified.CalendarDayType.Type03,
		//                            tooltip: t.oBundle.getText("timeRejected")
		//                        }));
		//                    }
		//                } else {
		//                    for (var i = 0; i < x.length; i++) {
		//                        t.calendar.addSpecialDate(new sap.ui.unified.DateTypeRange({
		//                            startDate: new Date(x[i].CaleDate.substring(0, 4) + "-" + x[i].CaleDate.substring(4, 6) + "-" + x[i].CaleDate.substring(6, 8)),
		//                            type: sap.ui.unified.CalendarDayType.Type03,
		//                            tooltip: t.oBundle.getText("timeRejected")
		//                        }));
		//                    }
		//                }
		//                t.calculateChangeCount();
		//                t.hideBusy(true);
		//            },
		//            error: function (E) {
		//                t.hideBusy(true);
		//                t.oErrorHandler.processError(E);
		//            }
		//        };
		//        this.oDataModel.read("/WorkCalendarCollection", P);
		//    },
		//    initPersonalization: function () {
		//        var t = this;
		//        if (sap.ushell.Container) {
		//            var P = sap.ushell.Container.getService("Personalization");
		//            var a = P.getPersonalizer({
		//                container: "hcm.fab.mytimesheet",
		//                item: "idOverviewTable"
		//            });
		//            var b = P.getPersonalizer({
		//                container: "hcm.fab.mytimesheet",
		//                item: "idToDoList"
		//            });
		//            var c = P.getPersonalizer({
		//                container: "hcm.fab.mytimesheet",
		//                item: "idTasks"
		//            });
		//            this.oTableTodoPersoController = new T({
		//                table: this.oToDoTable,
		//                componentName: "MyTimesheet",
		//                persoService: b
		//            }).activate();
		//            this.oTableTodoPersoController.getPersoService().getPersData().done(function (d) {
		//                if (d) {
		//                    var s = $.grep(d.aColumns, function (i, j) {
		//                        return i.id.split("-")[i.id.split("-").length - 1] === "todoStartTime";
		//                    });
		//                    var f = $.grep(d.aColumns, function (i, j) {
		//                        return i.id.split("-")[i.id.split("-").length - 1] === "todoEndTime";
		//                    });
		//                    if (t.clockTimeVisible) {
		//                        s[0].visible = true;
		//                        f[0].visible = true;
		//                    } else {
		//                        s[0].visible = false;
		//                        f[0].visible = false;
		//                    }
		//                    t.oTableTodoPersoController.getPersoService().setPersData(d).done(function () {
		//                    });
		//                }
		//            });
		//            this.oTableTaskPersoController = new T({
		//                table: this.oTaskTable,
		//                componentName: "MyTimesheet",
		//                persoService: c
		//            }).activate();
		//            this.oTablePersoController = new T({
		//                table: this.oTable,
		//                componentName: "MyTimesheet",
		//                persoService: a
		//            }).activate();
		//            if (sap.ui.Device.system.phone === true) {
		//                this.oTableTaskPersoController.getPersoService().getPersData().done(function (d) {
		//                    if (d) {
		//                        var f = $.grep(d.aColumns, function (j, k) {
		//                            return j.id.split("-")[j.id.split("-").length - 1] !== "AssignmentName" && j.id.split("-")[j.id.split("-").length - 1] !== "AssignmentStatus";
		//                        });
		//                        for (var i = 0; i < f.length; i++) {
		//                            f[i].visible = false;
		//                        }
		//                        t.oTableTaskPersoController.getPersoService().setPersData(d).done(function () {
		//                        });
		//                    }
		//                });
		//            }
		//            this.oTablePersoController.getPersoService().getPersData().done(function (d) {
		//                if (d) {
		//                    var s = $.grep(d.aColumns, function (k, m) {
		//                        return k.id.split("-")[k.id.split("-").length - 1] === "startTime";
		//                    });
		//                    var f = $.grep(d.aColumns, function (k, m) {
		//                        return k.id.split("-")[k.id.split("-").length - 1] === "endTime";
		//                    });
		//                    var i = $.grep(d.aColumns, function (k, m) {
		//                        return k.id.split("-")[k.id.split("-").length - 1] === "draft";
		//                    });
		//                    var j = $.grep(d.aColumns, function (k, m) {
		//                        return k.id.split("-")[k.id.split("-").length - 1] === "entered";
		//                    });
		//                    if (t.clockTimeVisible) {
		//                        s[0].visible = true;
		//                        f[0].visible = true;
		//                    } else {
		//                        s[0].visible = false;
		//                        f[0].visible = false;
		//                    }
		//                    if (t.draftStatus) {
		//                        i[0].visible = true;
		//                    } else {
		//                        i[0].visible = false;
		//                    }
		//                    if (sap.ui.Device.system.phone === true) {
		//                        j[0].visible = false;
		//                    } else {
		//                        j[0].visible = true;
		//                    }
		//                    t.oTablePersoController.getPersoService().setPersData(d).done(function () {
		//                    });
		//                }
		//            });
		//        }
		//    },
		//    onPersButtonPressed: function (E) {
		//        this.oTablePersoController.openDialog();
		//    },
		//    onPersTodoButtonPressed: function (E) {
		//        this.oTableTodoPersoController.openDialog();
		//    },
		//    onPersTaskButtonPressed: function (E) {
		//        this.oTableTaskPersoController.openDialog();
		//    },
		//    getTasks: function (d, s, m) {
		//        this.oTaskTable.setBusy(true);
		//        var t = this;
		//        var q = new sap.ui.model.json.JSONModel();
		//        var r = new sap.ui.model.json.JSONModel();
		//        var C;
		//        var u;
		//        var v = [];
		//        var w = {};
		//        if (s === undefined && m === undefined) {
		//            s = new Date();
		//            m = new Date();
		//        }
		//        var x = {
		//            "AssignmentId": null,
		//            "AssignmentName": null
		//        };
		//        var y = [];
		//        var a = new sap.ui.model.Filter({
		//            path: "Pernr",
		//            operator: sap.ui.model.FilterOperator.EQ,
		//            value1: this.empID
		//        });
		//        var b = new sap.ui.model.Filter({
		//            path: "ValidityStartDate",
		//            operator: sap.ui.model.FilterOperator.EQ,
		//            value1: s
		//        });
		//        var c = new sap.ui.model.Filter({
		//            path: "ValidityEndDate",
		//            operator: sap.ui.model.FilterOperator.EQ,
		//            value1: m
		//        });
		//        var f = [];
		//        f.push(b);
		//        f.push(c);
		//        f.push(a);
		//        var P = {
		//            filters: f,
		//            urlParameters: "$expand=ToGrps",
		//            success: function (z, R) {
		//                t.tasks = z.results;
		//                for (var i = 0; i < t.tasks.length; i++) {
		//                    t.tasks[i].ValidityStartDate = t.tasks[i].ValidityStartDate;
		//                    t.tasks[i].ValidityEndDate = t.tasks[i].ValidityEndDate;
		//                }
		//                q.setData(t.tasks);
		//                if (t.tasks.length === 0 && d) {
		//                    t.noAssignmentsDialog();
		//                }
		//                C = t.getModel("controls");
		//                t.setModel(q, "Tasks");
		//                t.setGlobalModel(q, "Tasks");
		//                for (var j = 0; j < t.tasks.length; j++) {
		//                    w["AssignmentName"] = t.tasks[j].AssignmentName;
		//                    for (var k = 0; k < t.tasks[j].ToGrps.results.length; k++) {
		//                        var A = $.grep(y, function (O, Q) {
		//                            return O.groupId == t.tasks[j].ToGrps.results[k].GrpId;
		//                        });
		//                        if (A.length > 0) {
		//                            var E = $.grep(A[0].Assignments, function (O, Q) {
		//                                return O.AssignmentId == t.tasks[j].AssignmentId;
		//                            });
		//                            if (E.length == 0) {
		//                                var x = {
		//                                    "AssignmentId": t.tasks[j].AssignmentId,
		//                                    "AssignmentName": t.tasks[j].AssignmentName,
		//                                    "ValidityStartDate": t.tasks[j].ValidityStartDate,
		//                                    "ValidityEndDate": t.tasks[j].ValidityEndDate,
		//                                    "Status": t.tasks[j].AssignmentStatus
		//                                };
		//                                A[0].Assignments.push(x);
		//                                A[0].count = parseInt(A[0].count) + 1;
		//                            }
		//                        } else if (t.tasks[j].ToGrps.results[k].GrpId && t.tasks[j].ToGrps.results[k].GrpId !== undefined && t.tasks[j].ToGrps.results[k].GrpId !== "") {
		//                            var I = {
		//                                "groupId": t.tasks[j].ToGrps.results[k].GrpId,
		//                                "groupName": t.tasks[j].ToGrps.results[k].GrpName,
		//                                "count": 1,
		//                                "Assignments": [{
		//                                        "AssignmentId": t.tasks[j].AssignmentId,
		//                                        "AssignmentName": t.tasks[j].AssignmentName,
		//                                        "ValidityStartDate": t.tasks[j].ValidityStartDate,
		//                                        "ValidityEndDate": t.tasks[j].ValidityEndDate,
		//                                        "Status": t.tasks[j].AssignmentStatus
		//                                    }]
		//                            };
		//                            y.push(I);
		//                        }
		//                    }
		//                    for (var i = 0; i < t.profileFields.length; i++) {
		//                        if (t.profileFields[i].FieldName === "APPROVER" || t.profileFields[i].FieldName === "AssignmentStatus" || t.profileFields[i].FieldName === "AssignmentName" || t.profileFields[i].FieldName === "ValidityStartDate" || t.profileFields[i].FieldName === "ValidityEndDate") {
		//                            if (t.profileFields[i].FieldName === "AssignmentStatus") {
		//                                w[t.profileFields[i].FieldName] = t.tasks[j][t.profileFields[i].FieldName] === "1" ? true : false;
		//                            } else if (t.profileFields[i].FieldName === "ValidityStartDate") {
		//                                w[t.profileFields[i].FieldName] = t.formatter.dateStringFormat2(t.tasks[j][t.profileFields[i].FieldName]);
		//                            } else if (t.profileFields[i].FieldName === "ValidityEndDate") {
		//                                w[t.profileFields[i].FieldName] = t.formatter.dateStringFormat2(t.tasks[j][t.profileFields[i].FieldName]);
		//                            } else if (t.profileFields[i].FieldName === "APPROVER") {
		//                                w["APPROVER"] = t.tasks[j].ApproverId;
		//                            } else {
		//                                w[t.profileFields[i].FieldName] = t.tasks[j][t.profileFields[i].FieldName];
		//                            }
		//                        } else {
		//                            w[t.profileFields[i].FieldName] = t.tasks[j].AssignmentFields[t.profileFields[i].FieldName];
		//                            t.getFieldTexts(t.profileFields[i].FieldName);
		//                        }
		//                    }
		//                    var K = $.extend(true, {}, w);
		//                    v.push(K);
		//                }
		//                u = $.grep(v, function (O, Q) {
		//                    return O.AssignmentStatus === true;
		//                });
		//                C.setProperty("/tasksActiveLength", u.length);
		//                u = $.grep(v, function (O, Q) {
		//                    return O.AssignmentStatus === false;
		//                });
		//                C.setProperty("/tasksInactiveLength", u.length);
		//                C.setProperty("/taskEdit", false);
		//                C.setProperty("/taskDelete", false);
		//                C.setProperty("/taskCopy", false);
		//                r.setData(v);
		//                t.setModel(r, "TaskFields");
		//                t.setModel(new J(y), "AssignmentGroups");
		//                var L = $.extend(true, [], y);
		//                for (var i = 0; i < L.length; i++) {
		//                    L[i].AssignmentName = L[i].groupName;
		//                    L[i].AssignmentId = L[i].groupId;
		//                    L[i].AssignmentType = t.oBundle.getText("group");
		//                    L[i].Type = "group";
		//                    L[i].AssignmentStatus = "1";
		//                }
		//                var N = $.extend(true, [], t.tasks);
		//                for (var i = 0; i < N.length; i++) {
		//                    N[i].AssignmentType = "";
		//                }
		//                t.setModel(new J(L.concat(N)), "TasksWithGroups");
		//                if (d) {
		//                    t.initPersonalization();
		//                }
		//                t.oTaskTable.setBusy(false);
		//            },
		//            error: function (E) {
		//                t.oTaskTable.setBusy(false);
		//                t.oErrorHandler.processError(E);
		//            }
		//        };
		//        this.oDataModel.read("/AssignmentCollection", P);
		//    },
		//    getToDoList: function () {
		//        var t = this;
		//        this.oToDoTable.setBusy(true);
		//        var m = new sap.ui.model.json.JSONModel();
		//        var a = new sap.ui.model.Filter({
		//            path: "Pernr",
		//            operator: sap.ui.model.FilterOperator.EQ,
		//            value1: this.empID
		//        });
		//        var f = [];
		//        f.push(a);
		//        var P = {
		//            filters: f,
		//            urlParameters: "$expand=TimeEntries",
		//            success: function (d, r) {
		//                t.todolist = [];
		//                var b = t.recordTemplate();
		//                for (var i = 0; i < d.results.length; i++) {
		//                    d.results[i].CaleDate = new Date(d.results[i].CaleDate.substring(0, 4) + "-" + d.results[i].CaleDate.substring(4, 6) + "-" + d.results[i].CaleDate.substring(6, 8));
		//                    d.results[i].Status = t.oBundle.getText("timeMissing");
		//                    var b = t.recordTemplate();
		//                    b.AssignmentId = d.results[i].AssignmentId;
		//                    b.AssignmentName = d.results[i].AssignmentName;
		//                    b.Pernr = t.empID;
		//                    b.target = parseFloat(d.results[i].TargetHours).toFixed(2);
		//                    b.missing = parseFloat(d.results[i].MissingHours).toFixed(2);
		//                    b.currentMissing = b.missing;
		//                    b.total = parseFloat(b.target - b.missing).toFixed(2);
		//                    b.sendButton = false;
		//                    b.addButton = true;
		//                    b.addButtonEnable = false;
		//                    b.deleteButtonEnable = false;
		//                    b.TimeEntryDataFields.WORKDATE = d.results[i].CaleDate;
		//                    if (d.results[i].TimeEntries.results) {
		//                        for (var j = 0; j < d.results[i].TimeEntries.results.length; j++) {
		//                            var c = d.results[i].TimeEntries.results[j];
		//                            c.missing = parseFloat(c.TimeEntryDataFields.CATSHOURS).toFixed(2);
		//                            c.target = parseFloat(d.results[i].TargetHours).toFixed(2);
		//                            c.total = parseFloat(c.target - c.missing).toFixed(2);
		//                            c.currentMissing = c.missing;
		//                            c.sendButton = false;
		//                            c.addButton = true;
		//                            c.addButtonEnable = false;
		//                            c.deleteButtonEnable = false;
		//                            c.TimeEntryDataFields.CATSHOURS = parseFloat(c.TimeEntryDataFields.CATSHOURS).toFixed(2);
		//                            t.todolist.push(c);
		//                        }
		//                    }
		//                    if (d.results[i].TimeEntries.results.length === 0) {
		//                        t.todolist.push(b);
		//                    }
		//                }
		//                m.setData($.extend(true, [], t.todolist));
		//                m.attachPropertyChange(t.onToDoDataChanged.bind(t));
		//                t.setModel(m, "TodoList");
		//                t.setModel(new J($.extend(true, [], t.todolist)), "OriginalTodo");
		//                t.oToDoTable.setBusy(false);
		//            },
		//            error: function (E) {
		//                t.oToDoTable.setBusy(false);
		//                t.oErrorHandler.processError(E);
		//            }
		//        };
		//        this.oDataModel.read("/ActionItemCollection", P);
		//    },
		//    onToDoDataChanged: function () {
		//        var t = this;
		//        var c = this.getModel("controls");
		//        c.setProperty("todoDataChanged", true);
		//    },
		//    getProfileFields: function (b) {
		//        var t = this;
		//        var m = new sap.ui.model.json.JSONModel();
		//        var a = new sap.ui.model.Filter({
		//            path: "Pernr",
		//            operator: sap.ui.model.FilterOperator.EQ,
		//            value1: this.empID
		//        });
		//        var f = [];
		//        f.push(a);
		//        var P = {
		//            filters: f,
		//            urlParameters: "$expand=ProfileFields",
		//            success: function (d, r) {
		//                t.profileInfo = $.extend(true, [], d.results[0]);
		//                var c = t.getModel("controls");
		//                c.setProperty("/submitDraft", d.results[0].AllowRelease === "TRUE" ? false : true);
		//                c.setProperty("/clockTimeVisible", d.results[0].AllowClockEntry === "TRUE" ? true : false);
		//                t.draftStatus = d.results[0].AllowRelease === "TRUE" ? false : true;
		//                t.clockTimeVisible = d.results[0].AllowClockEntry === "TRUE" ? true : false;
		//                t.profileFields = $.extend(true, [], d.results[0].ProfileFields.results);
		//                var i = $.extend(true, [], d.results[0].ProfileFields.results);
		//                c.setProperty("/importWorklist", d.results[0].DisplayWorklist === "TRUE" ? true : false);
		//                c.setProperty("/approverAllowed", d.results[0].ApproverEntryAllowed === "TRUE" ? true : false);
		//                t.readOnlyTemplate();
		//                var A = {
		//                    "DefaultValue": "",
		//                    "FieldLabel": t.oBundle.getText("name"),
		//                    "FieldName": "AssignmentName",
		//                    "FieldLength": "00064",
		//                    "HasF4": "X",
		//                    "IsReadOnly": "FALSE",
		//                    "FieldType": "C",
		//                    "Pernr": t.empID,
		//                    "ProfileId": ""
		//                };
		//                i.unshift(A);
		//                if (c.getProperty("/approverAllowed")) {
		//                    var A = {
		//                        "DefaultValue": "",
		//                        "FieldLabel": t.oBundle.getText("approver"),
		//                        "FieldName": "APPROVER",
		//                        "FieldLength": "00008",
		//                        "FieldType": "C",
		//                        "HasF4": "",
		//                        "IsReadOnly": "FALSE",
		//                        "Pernr": t.empID,
		//                        "ProfileId": ""
		//                    };
		//                    i.push(A);
		//                }
		//                var A = {
		//                    "DefaultValue": "",
		//                    "FieldLabel": t.oBundle.getText("status"),
		//                    "FieldName": "AssignmentStatus",
		//                    "FieldLength": "00000",
		//                    "HasF4": "",
		//                    "IsReadOnly": "FALSE",
		//                    "Pernr": t.empID,
		//                    "ProfileId": "HR-ONLY",
		//                    "Switch": "true"
		//                };
		//                i.push(A);
		//                var V = {
		//                    "DefaultValue": "",
		//                    "FieldLabel": t.oBundle.getText("validFrom"),
		//                    "FieldName": "ValidityStartDate",
		//                    "HasF4": "X",
		//                    "IsReadOnly": "FALSE",
		//                    "Pernr": t.empID
		//                };
		//                i.push(V);
		//                var j = {
		//                    "DefaultValue": "",
		//                    "FieldLabel": t.oBundle.getText("validTo"),
		//                    "FieldName": "ValidityEndDate",
		//                    "HasF4": "X",
		//                    "IsReadOnly": "FALSE",
		//                    "Pernr": t.empID
		//                };
		//                i.push(j);
		//                m.setData(i);
		//                t.profileFields = i;
		//                t.setModel(m, "ProfileFields");
		//                t.setGlobalModel(m, "ProfileFields");
		//            },
		//            error: function (E) {
		//                t.oErrorHandler.processError(E);
		//            }
		//        };
		//        this.oDataModel.read("/ProfileInfoCollection", P);
		//    },
		//    longtextPopover: function (E) {
		//        var t = this;
		//        var d = {
		//            handleClose: function (f) {
		//                var a = $.extend(true, [], this.getModel("oldModel").getData());
		//                var m = new J(a);
		//                this.setModel(m, "TimeData");
		//                t.dialog.close();
		//                t.dialog.destroy();
		//            }.bind(this),
		//            onLongTextEdit: this.onTextEdit.bind(this),
		//            onLongTextDelete: this.onTextDelete.bind(this),
		//            onPost: this.onLongTextPost.bind(this),
		//            formatter: this.formatter.visibility.bind(this),
		//            formatText: function (f) {
		//                return f;
		//            },
		//            handleOk: function (E) {
		//                t.getModel("controls").setProperty("/isOverviewChanged", true);
		//                t.getModel("controls").setProperty("/overviewDataChanged", true);
		//                t.dialog.close();
		//                t.dialog.destroy();
		//            }.bind(this)
		//        };
		//        var a = $.extend(true, [], this.getModel("TimeData").getData());
		//        var m = new J(a);
		//        this.setModel(m, "oldModel");
		//        this.dialog = sap.ui.xmlfragment(this.getView().getId(), "hcm.fab.mytimesheet.view.fragments.EditLongTextPopOver", d);
		//        this.getView().addDependent(this.dialog);
		//        this.dialog.bindElement("TimeData>" + E.getSource().getBindingContext("TimeData").getPath());
		//        var i = E.getSource().getBindingContext("TimeData").getPath().split("/")[1];
		//        var s = new J(a);
		//        this.setModel(s, "TimeEntry");
		//        var c = this.getModel("controls");
		//        if (this.formatter.visibility(a[i].TimeEntryDataFields.LONGTEXT)) {
		//            c.setProperty("editLongTextEnabled", false);
		//            c.setProperty("feedListVisibility", true);
		//        }
		//        this.setModel(c, "controls");
		//        var b = E.getSource();
		//        jQuery.sap.delayedCall(0, this, function () {
		//            this.dialog.open(b);
		//        });
		//    },
		//    onTextEdit: function (E) {
		//        if (E.getSource().getParent().getParent().getAggregation("items")[0].getText()) {
		//            this.byId("feedInput").setValue(E.getSource().getParent().getParent().getAggregation("items")[0].getText());
		//            this.byId("feedInput").setEnabled(true);
		//        }
		//    },
		//    onTextDelete: function (E) {
		//        if (E.getSource().getParent().getParent().getAggregation("items")[0].getText()) {
		//            var i = E.getSource().getParent().getParent().getBindingContext("TimeData").getPath().split("/")[1];
		//            E.getSource().getParent().getParent().getAggregation("items")[0].setText("");
		//            var a = E.getSource().getParent().getParent().getParent().getAggregation("beginButton");
		//            var d = this.getModel("TimeData").getData();
		//            d[i].TimeEntryDataFields.LONGTEXT_DATA = "";
		//            d[i].TimeEntryDataFields.LONGTEXT = "";
		//            if (d[i].Counter !== "") {
		//                d[i].TimeEntryOperation = "U";
		//            } else {
		//                d[i].TimeEntryOperation = "C";
		//            }
		//            var m = new J(d);
		//            this.setModel(m, "TimeData");
		//            a.setEnabled(true);
		//        }
		//    },
		//    getGroupHeader: function (a, c) {
		//        a.key = this.oFormatDate.format(new Date(this.oFormatYyyymmdd.format(a.date) + "T00:00:00"));
		//        return new G({
		//            title: a.key,
		//            upperCase: false
		//        });
		//    },
		//    onStatusChange: function (E) {
		//        var s = E.getParameter("selectedItem").getKey();
		//        var f = [];
		//        var c = this.getModel("controls");
		//        if (s !== "100") {
		//            f.push(new F("Status", g.Contains, s));
		//        }
		//        var r = this.oTable.getBinding("items").filter(f);
		//        if (r.getLength() === 0) {
		//            c.setProperty("/overviewEditEnabled", false);
		//        } else {
		//            if (c.getProperty("/onEdit") === "None") {
		//                c.setProperty("/overviewEditEnabled", true);
		//            }
		//        }
		//    },
		//    handleDupTaskCalendarSelect: function (E) {
		//        var c = E.getSource();
		//        var s = c.getSelectedDates();
		//        var d;
		//        var a = { selectedDates: [] };
		//        var m = new J();
		//        if (s.length > 0) {
		//            for (var i = 0; i < s.length; i++) {
		//                d = s[i].getStartDate();
		//                a.selectedDates.push({ Date: d });
		//            }
		//            m.setData(a);
		//            this.setModel(m, "selectedDatesDup").updateBindings();
		//        } else {
		//        }
		//        if (this.getModel("TimeDataDuplicateTask").getData().length >= 1) {
		//            this.getModel("controls").setProperty("/duplicateTaskButtonEnable", true);
		//        }
		//    },
		//    EditTodoLongTextPopover: function (E) {
		//        var t = this;
		//        var d = {
		//            handleClose: function (f) {
		//                t.dialog.close();
		//                t.dialog.destroy();
		//            },
		//            onLongTextEdit: this.onTextEdit.bind(this),
		//            onLongTextDelete: this.onTextDelete.bind(this),
		//            onPost: this.onTodoLongTextPost.bind(this),
		//            formatter: this.formatter.visibility.bind(this),
		//            handleOk: function (E) {
		//                t.getModel("controls").setProperty("/isToDoChanged", true);
		//                t.getModel("controls").setProperty("/todoDataChanged", true);
		//                t.dialog.close();
		//                t.dialog.destroy();
		//            }.bind(this)
		//        };
		//        var a = $.extend(true, [], this.getModel("TodoList").getData());
		//        var m = new J(a);
		//        this.setModel(m, "oldModel");
		//        this.dialog = sap.ui.xmlfragment(this.getView().getId(), "hcm.fab.mytimesheet.view.fragments.EditToDoLongTextPopOver", d);
		//        this.getView().addDependent(this.dialog);
		//        this.dialog.bindElement("TodoList>" + E.getSource().getBindingContext("TodoList").getPath());
		//        var i = E.getSource().getBindingContext("TodoList").getPath().split("/")[1];
		//        var s = new J(a);
		//        this.setModel(s, "TimeEntry");
		//        var c = this.getModel("controls");
		//        if (this.formatter.visibility(a[i].TimeEntryDataFields.LONGTEXT)) {
		//            c.setProperty("editLongTextEnabled", false);
		//            c.setProperty("feedListVisibility", true);
		//        }
		//        this.setModel(c, "controls");
		//        var b = E.getSource();
		//        jQuery.sap.delayedCall(0, this, function () {
		//            this.dialog.open(b);
		//        });
		//    },
		//    displaylongtextPopover: function (E) {
		//        var t = this;
		//        var d = {
		//            handleClose: function (a) {
		//                t._oPopover.close();
		//            }
		//        };
		//        this._oPopover = sap.ui.xmlfragment(this.getView().getId(), "hcm.fab.mytimesheet.view.fragments.LongTextPopOver", d);
		//        this.getView().addDependent(this._oPopover);
		//        this._oPopover.bindElement("TimeData>" + E.getSource().getBindingContext("TimeData").getPath());
		//        var b = E.getSource();
		//        jQuery.sap.delayedCall(0, this, function () {
		//            this._oPopover.openBy(b);
		//        });
		//    },
		//    displayTodoLongtextPopover: function (E) {
		//        var t = this;
		//        var d = {
		//            handleClose: function (a) {
		//                t._oPopover.close();
		//            },
		//            onChange: this.onLongTextChange.bind(this)
		//        };
		//        this._oPopover = sap.ui.xmlfragment(this.getView().getId(), "hcm.fab.mytimesheet.view.fragments.LongTextPopOver", d);
		//        this.getView().addDependent(this._oPopover);
		//        this._oPopover.bindElement("TodoList>" + E.getSource().getBindingContext("TodoList").getPath());
		//        var b = E.getSource();
		//        jQuery.sap.delayedCall(0, this, function () {
		//            this._oPopover.openBy(b);
		//        });
		//    },
		//    dynamicBindingRows: function (i, c) {
		//        var a = c.getObject();
		//        if (this.getModel("Tasks").getData()) {
		//        } else {
		//            return;
		//        }
		//        var d = this.getModel("Tasks").getData();
		//        var i = c.getPath().split("/")[1];
		//        var r = new sap.m.ColumnListItem({
		//            type: "Navigation",
		//            press: this.onAssignmentPress.bind(this)
		//        });
		//        for (var k in a) {
		//            if (k === "AssignmentStatus") {
		//                r.addCell(new sap.m.ObjectStatus({
		//                    text: a[k] === true ? this.oBundle.getText("activeStatus") : this.oBundle.getText("inactiveStatus"),
		//                    state: a[k] === true ? sap.ui.core.ValueState.Success : sap.ui.core.ValueState.Error,
		//                    customData: [
		//                        new sap.ui.core.CustomData({
		//                            "key": "FieldName",
		//                            "value": k
		//                        }),
		//                        new sap.ui.core.CustomData({
		//                            "key": "AssignmentId",
		//                            "value": d[i].AssignmentId
		//                        }),
		//                        new sap.ui.core.CustomData({
		//                            "key": "FieldValue",
		//                            "value": a[k]
		//                        })
		//                    ]
		//                }));
		//            } else if (k === "ValidityStartDate" || k === "ValidityEndDate") {
		//                r.addCell(new sap.m.Text({
		//                    text: this.oFormatDate.format(new Date(a[k])),
		//                    customData: [
		//                        new sap.ui.core.CustomData({
		//                            "key": "FieldName",
		//                            "value": k
		//                        }),
		//                        new sap.ui.core.CustomData({
		//                            "key": "AssignmentId",
		//                            "value": d[i].AssignmentId
		//                        })
		//                    ]
		//                }));
		//            } else if (k === "PEDD") {
		//                if (a[k]) {
		//                    r.addCell(new sap.m.Text({
		//                        text: this.oFormatDate.format(a[k]),
		//                        customData: [
		//                            new sap.ui.core.CustomData({
		//                                "key": "FieldName",
		//                                "value": k
		//                            }),
		//                            new sap.ui.core.CustomData({
		//                                "key": "AssignmentId",
		//                                "value": d[i].AssignmentId
		//                            })
		//                        ]
		//                    }));
		//                } else {
		//                    r.addCell(new sap.m.Text({
		//                        text: "",
		//                        customData: [
		//                            new sap.ui.core.CustomData({
		//                                "key": "FieldName",
		//                                "value": k
		//                            }),
		//                            new sap.ui.core.CustomData({
		//                                "key": "AssignmentId",
		//                                "value": d[i].AssignmentId
		//                            })
		//                        ]
		//                    }));
		//                }
		//            } else {
		//                var m = this.getModel(k);
		//                if (m) {
		//                    var t = m.getData();
		//                    if (t) {
		//                        var b = $.grep(t, function (f, i) {
		//                            return f.DispField1Id === a[k];
		//                        });
		//                        if (b.length > 0) {
		//                            r.addCell(new sap.m.Text({
		//                                text: b[0].DispField1Val,
		//                                customData: [
		//                                    new sap.ui.core.CustomData({
		//                                        "key": "FieldName",
		//                                        "value": k
		//                                    }),
		//                                    new sap.ui.core.CustomData({
		//                                        "key": "AssignmentId",
		//                                        "value": d[i].AssignmentId
		//                                    })
		//                                ]
		//                            }));
		//                        } else {
		//                            r.addCell(new sap.m.Text({
		//                                text: a[k],
		//                                customData: [
		//                                    new sap.ui.core.CustomData({
		//                                        "key": "FieldName",
		//                                        "value": k
		//                                    }),
		//                                    new sap.ui.core.CustomData({
		//                                        "key": "AssignmentId",
		//                                        "value": d[i].AssignmentId
		//                                    })
		//                                ]
		//                            }));
		//                        }
		//                    } else {
		//                        r.addCell(new sap.m.Text({
		//                            text: a[k],
		//                            customData: [
		//                                new sap.ui.core.CustomData({
		//                                    "key": "FieldName",
		//                                    "value": k
		//                                }),
		//                                new sap.ui.core.CustomData({
		//                                    "key": "AssignmentId",
		//                                    "value": d[i].AssignmentId
		//                                })
		//                            ]
		//                        }));
		//                    }
		//                } else {
		//                    r.addCell(new sap.m.Text({
		//                        text: a[k],
		//                        customData: [
		//                            new sap.ui.core.CustomData({
		//                                "key": "FieldName",
		//                                "value": k
		//                            }),
		//                            new sap.ui.core.CustomData({
		//                                "key": "AssignmentId",
		//                                "value": d[i].AssignmentId
		//                            })
		//                        ]
		//                    }));
		//                }
		//            }
		//        }
		//        return r;
		//    },
		//    dynamicBindingRowsWorklist: function (i, c) {
		//        var a = c.getObject();
		//        var i = c.getPath().split("/")[1];
		//        var r = new sap.m.ColumnListItem({});
		//        for (var k in a) {
		//            if (k === "RANGE") {
		//                r.addCell(new sap.m.DateRangeSelection({
		//                    dateValue: new Date(new Date().getFullYear(), 0, 1),
		//                    secondDateValue: new Date(new Date().getFullYear(), 11, 31),
		//                    maxLength: 30,
		//                    customData: [
		//                        new sap.ui.core.CustomData({
		//                            "key": "FieldName",
		//                            "value": "RANGE"
		//                        }),
		//                        new sap.ui.core.CustomData({
		//                            "key": "Index",
		//                            "value": i
		//                        })
		//                    ]
		//                }));
		//            } else if (k === "NAME") {
		//                r.addCell(new sap.m.Input({
		//                    type: sap.m.InputType.Text,
		//                    value: a[k],
		//                    required: true,
		//                    maxLength: 30,
		//                    placeholder: this.getResourceBundle().getText("worklistNamePlaceholder"),
		//                    customData: [
		//                        new sap.ui.core.CustomData({
		//                            "key": "FieldName",
		//                            "value": "NAME"
		//                        }),
		//                        new sap.ui.core.CustomData({
		//                            "key": "Index",
		//                            "value": i
		//                        })
		//                    ]
		//                }));
		//            } else {
		//                r.addCell(new sap.m.Text({
		//                    text: a[k],
		//                    customData: [
		//                        new sap.ui.core.CustomData({
		//                            "key": "FieldName",
		//                            "value": k
		//                        }),
		//                        new sap.ui.core.CustomData({
		//                            "key": "Index",
		//                            "value": i
		//                        })
		//                    ]
		//                }));
		//            }
		//        }
		//        return r;
		//    },
		//    dynamicBindingRowsAdminlist: function (i, c) {
		//        var a = c.getObject();
		//        if (this.getModel("AdminTasks").getData()) {
		//        } else {
		//            return;
		//        }
		//        var d = this.getModel("AdminTasks").getData();
		//        var i = c.getPath().split("/")[1];
		//        var r = new sap.m.ColumnListItem({});
		//        for (var k in a) {
		//            if (k === "AssignmentStatus") {
		//                r.addCell(new sap.m.ObjectStatus({
		//                    text: a[k] === true ? this.oBundle.getText("activeStatus") : this.oBundle.getText("inactiveStatus"),
		//                    state: a[k] === true ? sap.ui.core.ValueState.Success : sap.ui.core.ValueState.Error,
		//                    customData: [
		//                        new sap.ui.core.CustomData({
		//                            "key": "FieldName",
		//                            "value": k
		//                        }),
		//                        new sap.ui.core.CustomData({
		//                            "key": "AssignmentId",
		//                            "value": d[i].AssignmentId
		//                        }),
		//                        new sap.ui.core.CustomData({
		//                            "key": "FieldValue",
		//                            "value": a[k]
		//                        })
		//                    ]
		//                }));
		//            } else {
		//                var m = this.getModel(k);
		//                if (m) {
		//                    var t = m.getData();
		//                    if (t) {
		//                        var b = $.grep(t, function (f, i) {
		//                            return f.DispField1Id === a[k];
		//                        });
		//                        if (b.length > 0) {
		//                            r.addCell(new sap.m.Text({
		//                                text: b[0].DispField1Val,
		//                                customData: [
		//                                    new sap.ui.core.CustomData({
		//                                        "key": "FieldName",
		//                                        "value": k
		//                                    }),
		//                                    new sap.ui.core.CustomData({
		//                                        "key": "AssignmentId",
		//                                        "value": d[i].AssignmentId
		//                                    }),
		//                                    new sap.ui.core.CustomData({
		//                                        "key": "FieldCode",
		//                                        "value": a[k]
		//                                    })
		//                                ]
		//                            }));
		//                        } else {
		//                            r.addCell(new sap.m.Text({
		//                                text: a[k],
		//                                customData: [
		//                                    new sap.ui.core.CustomData({
		//                                        "key": "FieldName",
		//                                        "value": k
		//                                    }),
		//                                    new sap.ui.core.CustomData({
		//                                        "key": "AssignmentId",
		//                                        "value": d[i].AssignmentId
		//                                    })
		//                                ]
		//                            }));
		//                        }
		//                    } else {
		//                        r.addCell(new sap.m.Text({
		//                            text: a[k],
		//                            customData: [
		//                                new sap.ui.core.CustomData({
		//                                    "key": "FieldName",
		//                                    "value": k
		//                                }),
		//                                new sap.ui.core.CustomData({
		//                                    "key": "AssignmentId",
		//                                    "value": d[i].AssignmentId
		//                                })
		//                            ]
		//                        }));
		//                    }
		//                } else {
		//                    r.addCell(new sap.m.Text({
		//                        text: a[k],
		//                        customData: [
		//                            new sap.ui.core.CustomData({
		//                                "key": "FieldName",
		//                                "value": k
		//                            }),
		//                            new sap.ui.core.CustomData({
		//                                "key": "AssignmentId",
		//                                "value": d[i].AssignmentId
		//                            })
		//                        ]
		//                    }));
		//                }
		//            }
		//        }
		//        return r;
		//    },
		//    dynamicBindingColumns: function (i, c) {
		//        var a = c.getObject();
		//        var d = this.getModel("ProfileFields").getData();
		//        var i = c.getPath().split("/")[1];
		//        var b;
		//        if (sap.ui.Device.system.phone === true) {
		//            if (d[i].FieldName === "AssignmentStatus") {
		//                b = new sap.m.Column(d[i].FieldName, {
		//                    demandPopin: true,
		//                    hAlign: "End"
		//                }).setHeader(new sap.m.Text({ text: d[i].FieldLabel }));
		//            } else if (d[i].FieldName === "AssignmentName") {
		//                b = new sap.m.Column(d[i].FieldName, {
		//                    demandPopin: true,
		//                    hAlign: "Begin"
		//                }).setHeader(new sap.m.Text({ text: d[i].FieldLabel }));
		//            } else if (d[i].FieldName === "ValidityStartDate") {
		//                b = new sap.m.Column(d[i].FieldName, {
		//                    demandPopin: true,
		//                    hAlign: "End",
		//                    visible: false
		//                }).setHeader(new sap.m.Text({ text: d[i].FieldLabel }));
		//            } else if (d[i].FieldName === "ValidityEndDate") {
		//                b = new sap.m.Column(d[i].FieldName, {
		//                    demandPopin: true,
		//                    hAlign: "End",
		//                    visible: false
		//                }).setHeader(new sap.m.Text({ text: d[i].FieldLabel }));
		//            } else {
		//                b = new sap.m.Column(d[i].FieldName, {
		//                    minScreenWidth: sap.m.ScreenSize.Small,
		//                    demandPopin: true,
		//                    hAlign: "Begin",
		//                    visible: false
		//                }).setHeader(new sap.m.Text({ text: d[i].FieldLabel }));
		//            }
		//        } else {
		//            if (i > 5 && d[i].FieldName !== "AssignmentName" && d[i].FieldName !== "AssignmentStatus" && d[i].FieldName !== "APPROVER" && d[i].FieldName !== "ValidityStartDate" && d[i].FieldName !== "ValidityEndDate") {
		//                b = new sap.m.Column(d[i].FieldName, {
		//                    minScreenWidth: "2800px",
		//                    demandPopin: true
		//                }).setHeader(new sap.m.Text({ text: d[i].FieldLabel }));
		//            } else {
		//                if (d[i].FieldName !== "ValidityStartDate" && d[i].FieldName !== "ValidityEndDate") {
		//                    b = new sap.m.Column(d[i].FieldName, {
		//                        minScreenWidth: "Tablet",
		//                        demandPopin: true
		//                    }).setHeader(new sap.m.Text({ text: d[i].FieldLabel }));
		//                } else {
		//                    b = new sap.m.Column(d[i].FieldName, {
		//                        minScreenWidth: "Tablet",
		//                        demandPopin: true,
		//                        hAlign: "End"
		//                    }).setHeader(new sap.m.Text({ text: d[i].FieldLabel }));
		//                }
		//            }
		//        }
		//        return b;
		//    },
		//    dynamicBindingColumnsWorklist: function (i, c) {
		//        var a = c.getObject();
		//        var d = this.getModel("WorklistProfileFields").getData();
		//        var i = c.getPath().split("/")[1];
		//        if (sap.ui.Device.system.phone === true) {
		//            var b = new sap.m.Column({
		//                minScreenWidth: "2800px",
		//                demandPopin: true
		//            }).setHeader(new sap.m.Text({ text: d[i].FieldLabel }));
		//            return b;
		//        } else {
		//            if (i > 5) {
		//                var b = new sap.m.Column({
		//                    minScreenWidth: "2800px",
		//                    demandPopin: true
		//                }).setHeader(new sap.m.Text({ text: d[i].FieldLabel }));
		//            } else {
		//                var b = new sap.m.Column({
		//                    minScreenWidth: "Tablet",
		//                    demandPopin: true
		//                }).setHeader(new sap.m.Text({ text: d[i].FieldLabel }));
		//            }
		//            return b;
		//        }
		//    },
		//    dynamicBindingColumnsAdminlist: function (i, c) {
		//        var a = c.getObject();
		//        var d = this.getModel("ProfileFields").getData();
		//        var i = c.getPath().split("/")[1];
		//        var b;
		//        if (sap.ui.Device.system.phone === true) {
		//            if (d[i].FieldName === "AssignmentStatus") {
		//                b = new sap.m.Column("Admin" + d[i].FieldName, {
		//                    demandPopin: true,
		//                    hAlign: "End"
		//                }).setHeader(new sap.m.Text({ text: d[i].FieldLabel }));
		//            } else if (d[i].FieldName === "AssignmentName") {
		//                b = new sap.m.Column("Admin" + d[i].FieldName, {
		//                    demandPopin: true,
		//                    hAlign: "Begin"
		//                }).setHeader(new sap.m.Text({ text: d[i].FieldLabel }));
		//            } else if (d[i].FieldName === "ValidityStartDate") {
		//                b = new sap.m.Column("Admin" + d[i].FieldName, {
		//                    demandPopin: true,
		//                    hAlign: "End"
		//                }).setHeader(new sap.m.Text({ text: d[i].FieldLabel }));
		//            } else if (d[i].FieldName === "ValidityEndDate") {
		//                b = new sap.m.Column("Admin" + d[i].FieldName, {
		//                    demandPopin: true,
		//                    hAlign: "End"
		//                }).setHeader(new sap.m.Text({ text: d[i].FieldLabel }));
		//            } else {
		//                b = new sap.m.Column("Admin" + d[i].FieldName, {
		//                    minScreenWidth: sap.m.ScreenSize.Small,
		//                    demandPopin: true,
		//                    hAlign: "Begin"
		//                }).setHeader(new sap.m.Text({ text: d[i].FieldLabel }));
		//            }
		//        } else {
		//            if (i > 5 && d[i].FieldName !== "AssignmentName" && d[i].FieldName !== "AssignmentStatus" && d[i].FieldName !== "APPROVER" && d[i].FieldName !== "ValidityStartDate" && d[i].FieldName !== "ValidityEndDate") {
		//                b = new sap.m.Column("Admin" + d[i].FieldName, {
		//                    minScreenWidth: "2800px",
		//                    demandPopin: true
		//                }).setHeader(new sap.m.Text({ text: d[i].FieldLabel }));
		//            } else {
		//                if (d[i].FieldName !== "ValidityStartDate" && d[i].FieldName !== "ValidityEndDate") {
		//                    b = new sap.m.Column("Admin" + d[i].FieldName, {
		//                        minScreenWidth: "Tablet",
		//                        demandPopin: true
		//                    }).setHeader(new sap.m.Text({ text: d[i].FieldLabel }));
		//                } else {
		//                    b = new sap.m.Column("Admin" + d[i].FieldName, {
		//                        minScreenWidth: "Tablet",
		//                        demandPopin: true,
		//                        hAlign: "End"
		//                    }).setHeader(new sap.m.Text({ text: d[i].FieldLabel }));
		//                }
		//            }
		//        }
		//        return b;
		//    },
		//    performImportAssignments: function (s) {
		//        var t = this;
		//        this.showBusy();
		//        t.oDataImportAssignmentsModel = this.getOwnerComponent().getModel();
		//        t.oDataImportAssignmentsModel.resetChanges();
		//        t.oDataImportAssignmentsModel.setChangeBatchGroups({
		//            "*": {
		//                groupId: "ImportAssignments",
		//                changeSetId: "ImportAssignments",
		//                single: false
		//            }
		//        });
		//        t.oDataImportAssignmentsModel.setDeferredGroups(["ImportAssignments"]);
		//        t.oDataImportAssignmentsModel.refreshSecurityToken(function (d) {
		//            if (s.length > 0) {
		//                for (var j = 0; j < s.length; j++) {
		//                    var a = {
		//                        properties: {
		//                            ApproverId: s[j].ApproverId,
		//                            ApproverName: s[j].ApproverName,
		//                            AssignmentId: s[j].AssignmentId,
		//                            AssignmentName: s[j].AssignmentName,
		//                            AssignmentOperation: s[j].AssignmentOperation,
		//                            AssignmentStatus: s[j].AssignmentStatus,
		//                            Counter: s[j].Counter,
		//                            Pernr: s[j].Pernr,
		//                            ProfileId: s[j].ProfileId,
		//                            ValidityStartDate: s[j].ValidityStartDate,
		//                            ValidityEndDate: s[j].ValidityEndDate,
		//                            AssignmentFields: {
		//                                AENAM: s[j].AssignmentFields.AENAM,
		//                                ALLDF: s[j].AssignmentFields.ALLDF,
		//                                APDAT: s[j].AssignmentFields.APDAT,
		//                                APNAM: s[j].AssignmentFields.APNAM,
		//                                ARBID: s[j].AssignmentFields.ARBID,
		//                                ARBPL: s[j].AssignmentFields.ARBPL,
		//                                AUERU: s[j].AssignmentFields.AUERU,
		//                                AUFKZ: s[j].AssignmentFields.AUFKZ,
		//                                AUTYP: s[j].AssignmentFields.AUTYP,
		//                                AWART: s[j].AssignmentFields.AWART,
		//                                BEGUZ: s[j].AssignmentFields.BEGUZ,
		//                                BELNR: s[j].AssignmentFields.BELNR,
		//                                BEMOT: s[j].AssignmentFields.BEMOT,
		//                                BUDGET_PD: s[j].AssignmentFields.BUDGET_PD,
		//                                BUKRS: s[j].AssignmentFields.BUKRS,
		//                                BWGRL: s[j].AssignmentFields.BWGRL,
		//                                CATSAMOUNT: s[j].AssignmentFields.CATSAMOUNT,
		//                                CATSHOURS: s[j].AssignmentFields.CATSHOURS,
		//                                CATSQUANTITY: s[j].AssignmentFields.CATSQUANTITY,
		//                                CPR_EXTID: s[j].AssignmentFields.CPR_EXTID,
		//                                CPR_GUID: s[j].AssignmentFields.CPR_GUID,
		//                                CPR_OBJGEXTID: s[j].AssignmentFields.CPR_OBJGEXTID,
		//                                CPR_OBJGUID: s[j].AssignmentFields.CPR_OBJGUID,
		//                                CPR_OBJTYPE: s[j].AssignmentFields.CPR_OBJTYPE,
		//                                ENDUZ: s[j].AssignmentFields.ENDUZ,
		//                                ERNAM: s[j].AssignmentFields.ERNAM,
		//                                ERSDA: s[j].AssignmentFields.ERSDA,
		//                                ERSTM: s[j].AssignmentFields.ERSTM,
		//                                ERUZU: s[j].AssignmentFields.ERUZU,
		//                                EXTAPPLICATION: s[j].AssignmentFields.EXTAPPLICATION,
		//                                EXTDOCUMENTNO: s[j].AssignmentFields.EXTDOCUMENTNO,
		//                                EXTSYSTEM: s[j].AssignmentFields.EXTSYSTEM,
		//                                FUNC_AREA: s[j].AssignmentFields.FUNC_AREA,
		//                                FUND: s[j].AssignmentFields.FUND,
		//                                GRANT_NBR: s[j].AssignmentFields.GRANT_NBR,
		//                                HRBUDGET_PD: s[j].AssignmentFields.HRBUDGET_PD,
		//                                HRCOSTASG: s[j].AssignmentFields.HRCOSTASG,
		//                                HRFUNC_AREA: s[j].AssignmentFields.HRFUNC_AREA,
		//                                HRFUND: s[j].AssignmentFields.HRFUND,
		//                                HRGRANT_NBR: s[j].AssignmentFields.HRGRANT_NBR,
		//                                HRKOSTL: s[j].AssignmentFields.HRKOSTL,
		//                                HRLSTAR: s[j].AssignmentFields.HRLSTAR,
		//                                KAPAR: s[j].AssignmentFields.KAPAR,
		//                                KAPID: s[j].AssignmentFields.KAPID,
		//                                KOKRS: s[j].AssignmentFields.KOKRS,
		//                                LAEDA: s[j].AssignmentFields.LAEDA,
		//                                LAETM: s[j].AssignmentFields.LAETM,
		//                                LGART: s[j].AssignmentFields.LGART,
		//                                LOGSYS: s[j].AssignmentFields.LOGSYS,
		//                                LONGTEXT: s[j].AssignmentFields.LONGTEXT,
		//                                LONGTEXT_DATA: s[j].AssignmentFields.LONGTEXT_DATA,
		//                                LSTAR: s[j].AssignmentFields.LSTAR,
		//                                LSTNR: s[j].AssignmentFields.LSTNR,
		//                                LTXA1: s[j].AssignmentFields.LTXA1,
		//                                MEINH: s[j].AssignmentFields.MEINH,
		//                                OFMNW: s[j].AssignmentFields.OFMNW,
		//                                OTYPE: s[j].AssignmentFields.OTYPE,
		//                                PAOBJNR: s[j].AssignmentFields.PAOBJNR,
		//                                PEDD: s[j].AssignmentFields.PEDD,
		//                                PERNR: s[j].AssignmentFields.PERNR,
		//                                PLANS: s[j].AssignmentFields.PLANS,
		//                                POSID: s[j].AssignmentFields.POSID,
		//                                PRAKN: s[j].AssignmentFields.PRAKN,
		//                                PRAKZ: s[j].AssignmentFields.PRAKZ,
		//                                PRICE: s[j].AssignmentFields.PRICE,
		//                                RAPLZL: s[j].AssignmentFields.RAPLZL,
		//                                RAUFNR: s[j].AssignmentFields.RAUFNR,
		//                                RAUFPL: s[j].AssignmentFields.RAUFPL,
		//                                REASON: s[j].AssignmentFields.REASON,
		//                                REFCOUNTER: s[j].AssignmentFields.REFCOUNTER,
		//                                REINR: s[j].AssignmentFields.REINR,
		//                                RKDAUF: s[j].AssignmentFields.RKDAUF,
		//                                RKDPOS: s[j].AssignmentFields.RKDPOS,
		//                                RKOSTL: s[j].AssignmentFields.RKOSTL,
		//                                RKSTR: s[j].AssignmentFields.RKSTR,
		//                                RNPLNR: s[j].AssignmentFields.RNPLNR,
		//                                RPROJ: s[j].AssignmentFields.RPROJ,
		//                                RPRZNR: s[j].AssignmentFields.RPRZNR,
		//                                SBUDGET_PD: s[j].AssignmentFields.SBUDGET_PD,
		//                                SEBELN: s[j].AssignmentFields.SEBELN,
		//                                SEBELP: s[j].AssignmentFields.SEBELP,
		//                                SKOSTL: s[j].AssignmentFields.SKOSTL,
		//                                SPLIT: s[j].AssignmentFields.SPLIT,
		//                                SPRZNR: s[j].AssignmentFields.SPRZNR,
		//                                STATKEYFIG: s[j].AssignmentFields.STATKEYFIG,
		//                                STATUS: s[j].AssignmentFields.STATUS,
		//                                S_FUNC_AREA: s[j].AssignmentFields.S_FUNC_AREA,
		//                                S_FUND: s[j].AssignmentFields.S_FUND,
		//                                S_GRANT_NBR: s[j].AssignmentFields.S_GRANT_NBR,
		//                                TASKCOMPONENT: s[j].AssignmentFields.TASKCOMPONENT,
		//                                TASKCOUNTER: s[j].AssignmentFields.TASKCOUNTER,
		//                                TASKLEVEL: s[j].AssignmentFields.TASKLEVEL,
		//                                TASKTYPE: s[j].AssignmentFields.TASKTYPE,
		//                                TCURR: s[j].AssignmentFields.TCURR,
		//                                TRFGR: s[j].AssignmentFields.TRFGR,
		//                                TRFST: s[j].AssignmentFields.TRFST,
		//                                UNIT: s[j].AssignmentFields.UNIT,
		//                                UVORN: s[j].AssignmentFields.UVORN,
		//                                VERSL: s[j].AssignmentFields.VERSL,
		//                                VORNR: s[j].AssignmentFields.VORNR,
		//                                VTKEN: s[j].AssignmentFields.VTKEN,
		//                                WABLNR: s[j].AssignmentFields.WABLNR,
		//                                WAERS: s[j].AssignmentFields.WAERS,
		//                                WERKS: s[j].AssignmentFields.WERKS,
		//                                WORKDATE: s[j].AssignmentFields.WORKDATE,
		//                                WORKITEMID: s[j].AssignmentFields.WORKITEMID,
		//                                WTART: s[j].AssignmentFields.WTART
		//                            }
		//                        },
		//                        success: function (b) {
		//                            if (j == s.length) {
		//                                t.getTasks(false);
		//                                t.hideBusy();
		//                                var c = t.oBundle.getText("assignmentsImported");
		//                                sap.m.MessageToast.show(c, { duration: 3000 });
		//                            }
		//                        },
		//                        error: function (E) {
		//                            t.hideBusy();
		//                            t.oErrorHandler.processError(E);
		//                        },
		//                        changeSetId: "ImportAssignments",
		//                        groupId: "ImportAssignments"
		//                    };
		//                    t.oDataImportAssignmentsModel.createEntry("/AssignmentCollection", a);
		//                }
		//            }
		//            t.oDataImportAssignmentsModel.submitChanges({
		//                groupId: "ImportAssignments",
		//                changeSetId: "ImportAssignments"
		//            });
		//        }, true);
		//    },
		//    onUpdateFinished: function (E) {
		//    },
		//    onPress: function (E) {
		//    },
		//    onLongTextPost: function (E) {
		//        var i = E.getSource().getParent().getBindingContext("TimeData").getPath().split("/")[1];
		//        var a = E.getSource().getParent().getAggregation("beginButton");
		//        var d = this.getModel("TimeData").getData();
		//        if (E.getParameter("value")) {
		//            d[i].TimeEntryDataFields.LONGTEXT_DATA = E.getParameter("value");
		//            d[i].TimeEntryDataFields.LONGTEXT = "X";
		//            if (d[i].Counter !== "") {
		//                d[i].TimeEntryOperation = "U";
		//            } else {
		//                d[i].TimeEntryOperation = "C";
		//            }
		//            var m = new J(d);
		//            this.setModel(m, "TimeData");
		//            a.setEnabled(true);
		//        }
		//    },
		//    onTodoLongTextPost: function (E) {
		//        var i = E.getSource().getParent().getBindingContext("TodoList").getPath().split("/")[1];
		//        var a = E.getSource().getParent().getAggregation("beginButton");
		//        var d = this.getModel("TodoList").getData();
		//        if (E.getParameter("value")) {
		//            d[i].TimeEntryDataFields.LTXA1 = E.getParameter("value");
		//            d[i].TimeEntryDataFields.LONGTEXT = "X";
		//            if (d[i].Counter !== "") {
		//                d[i].TimeEntryOperation = "U";
		//            } else {
		//                d[i].TimeEntryOperation = "C";
		//            }
		//            d[i].TimeEntryDataFields.LONGTEXT_DATA = E.getParameter("value");
		//            var m = new J(d);
		//            this.setModel(m, "TodoList");
		//            a.setEnabled(true);
		//        }
		//    },
		//    handleMessagePopover: function (E) {
		//        var m = new h({
		//            type: "{message>severity}",
		//            description: "{message>description}",
		//            title: "{message>message}",
		//            link: new sap.m.Link({
		//                text: this.oBundle.getText("clickHere"),
		//                press: this.onClickFocusError.bind(this),
		//                visible: "{=${message>code} === undefined ? false : true}",
		//                customData: [
		//                    new sap.ui.core.CustomData({
		//                        key: "counter",
		//                        value: "{message>additionalText}"
		//                    }),
		//                    new sap.ui.core.CustomData({
		//                        key: "code",
		//                        value: "{message>code}"
		//                    })
		//                ]
		//            })
		//        });
		//        var a = new M({
		//            items: {
		//                path: "message>/",
		//                template: m
		//            }
		//        });
		//        this.oMessagePopover = a;
		//        this.oMessagePopover.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "message");
		//        this.oMessagePopover.toggle(E.getSource());
		//    },
		//    onClickFocusError: function (E) {
		//        var t = this;
		//        var r = E.getSource().getCustomData("counter")[0].getValue();
		//        var d = E.getSource().getCustomData("code")[1].getValue();
		//        var a = this.getModel(d).getData();
		//        var b = $.grep(a, function (f, j) {
		//            if (f.valueState) {
		//                return f.valueState === "Error";
		//            }
		//        });
		//        for (var i = 0; i < b.length; i++) {
		//            b[i].valueState = "None";
		//        }
		//        this.getModel("TimeData").updateBindings();
		//        var c = $.grep(a, function (f, j) {
		//            if (f.RecRowNo) {
		//                return f.RecRowNo === parseInt(r).toString();
		//            }
		//        });
		//        if (c.length > 0) {
		//            c[0].valueState = "Error";
		//        }
		//        this.getModel("TimeData").updateBindings();
		//        this.oMessagePopover.close();
		//    },
		//    handleCalendarSelect: function (E) {
		//        var c = this.getModel("controls");
		//        if (sap.ui.Device.system.phone === true) {
		//            var C = E.getSource();
		//            var s = C.getSelectedDates();
		//            this.mCalendar.destroySelectedDates();
		//            this.startdate = s[0].getStartDate();
		//            this.enddate = s[0].getStartDate();
		//            this.calendarSelection(C, new Date(this.startdate), new Date(this.enddate));
		//            this.bindTable(new Date(this.startdate), new Date(this.enddate));
		//            if (this.oReadOnlyTemplate) {
		//                this.rebindTableWithTemplate(this.oTable, "TimeData>/", this.oReadOnlyTemplate, "Navigation");
		//            }
		//        } else {
		//            var C = E.getSource();
		//            var s = C.getSelectedDates();
		//            this.calendar.destroySelectedDates();
		//            this.startdate = this.getFirstDayOfWeek(s[0].getStartDate(), this.firstDayOfWeek);
		//            this.enddate = this.getLastDayOfWeek(s[0].getStartDate(), this.firstDayOfWeek);
		//            this.calendarSelection(C, new Date(this.startdate), new Date(this.enddate));
		//            var a = new Date(this.startdate);
		//            var b = new Date(this.enddate);
		//            this.bindTable(new Date(this.startdate), new Date(this.enddate));
		//            if (this.oReadOnlyTemplate) {
		//                this.rebindTableWithTemplate(this.oTable, "TimeData>/", this.oReadOnlyTemplate, "Navigation");
		//            }
		//        }
		//        c.setProperty("/onEdit", "None");
		//        c.setProperty("/duplicateVisibility", false);
		//        c.setProperty("/duplicateWeekVisibility", false);
		//        c.setProperty("/overviewEdit", true);
		//        c.setProperty("/showFooter", false);
		//    },
		//    handleDuplicateWeekCalendar: function (E) {
		//        var c = E.getSource();
		//        var s = c.getSelectedDates();
		//        var d = this.getFirstDayOfWeek(s[0].getStartDate(), this.firstDayOfWeek);
		//        var a = this.getLastDayOfWeek(s[0].getStartDate(), this.firstDayOfWeek);
		//        this.duplicateWeekCalendar(c, d, a);
		//        var b;
		//        var f = { selectedWeek: [] };
		//        var m = new J();
		//        if (this.getModel("selectedDatesDupWeek")) {
		//            var i = this.getModel("selectedDatesDupWeek").getData();
		//            var j = $.grep(i.selectedWeek, function (k, q) {
		//                return k.dateFrom.toDateString() === d.toDateString();
		//            });
		//            if (j.length === 0) {
		//                i.selectedWeek.push({
		//                    dateFrom: d,
		//                    dateTo: a
		//                });
		//            }
		//            m.setData(i);
		//        } else {
		//            f.selectedWeek.push({
		//                dateFrom: d,
		//                dateTo: a
		//            });
		//            m.setData(f);
		//        }
		//        this.setModel(m, "selectedDatesDupWeek");
		//        this.getModel("controls").setProperty("/duplicateWeekButtonEnable", true);
		//    },
		//    calendarSelection: function (c, s, a) {
		//        c.destroySelectedDates();
		//        var b = new sap.ui.unified.DateRange();
		//        b.setStartDate(s);
		//        b.setEndDate(a);
		//        c.addSelectedDate(b);
		//    },
		//    duplicateWeekCalendar: function (c, s, a) {
		//        c.destroySelectedDates();
		//        var b = new sap.ui.unified.DateRange();
		//        b.setStartDate(s);
		//        b.setEndDate(a);
		//        c.addSelectedDate(b);
		//    },
		//    bindTable: function (s, a) {
		//        this.oTable.setBusy(true);
		//        var b = $.extend(true, [], this.getModel("TimeEntries").getData());
		//        var m = new sap.ui.model.json.JSONModel();
		//        var t = [];
		//        var c = [
		//            {
		//                key: "100",
		//                text: "{i18n>allStatus}"
		//            },
		//            { key: "10" },
		//            { key: "20" },
		//            { key: "30" },
		//            { key: "40" }
		//        ];
		//        for (var i = s; i <= a; i.setDate(i.getDate() + 1)) {
		//            var d = this.oFormatyyyymmdd.format(i);
		//            var f = $.grep(b, function (q, u) {
		//                return q.CaleDate == d;
		//            });
		//            if (f.length === 0) {
		//                continue;
		//            }
		//            var r = {
		//                AllowEdit: "",
		//                AllowRelease: "",
		//                AssignmentId: "",
		//                AssignmentName: "",
		//                CatsDocNo: "",
		//                Counter: "",
		//                Pernr: this.empID,
		//                RefCounter: "",
		//                RejReason: "",
		//                Status: "",
		//                SetDraft: false,
		//                HeaderData: {
		//                    target: f[0].TargetHours,
		//                    sum: "0.00",
		//                    date: new Date(i),
		//                    addButton: false,
		//                    highlight: false
		//                },
		//                target: f[0].TargetHours,
		//                TimeEntryDataFields: {
		//                    AENAM: "",
		//                    ALLDF: "",
		//                    APDAT: null,
		//                    APNAM: "",
		//                    ARBID: "00000000",
		//                    ARBPL: "",
		//                    AUERU: "",
		//                    AUFKZ: "",
		//                    AUTYP: "00",
		//                    AWART: "",
		//                    BEGUZ: "000000",
		//                    BELNR: "",
		//                    BEMOT: "",
		//                    BUDGET_PD: "",
		//                    BUKRS: "",
		//                    BWGRL: "0.0",
		//                    CATSAMOUNT: "0.0",
		//                    CATSHOURS: "0.00",
		//                    CATSQUANTITY: "0.0",
		//                    CPR_EXTID: "",
		//                    CPR_GUID: "",
		//                    CPR_OBJGEXTID: "",
		//                    CPR_OBJGUID: "",
		//                    CPR_OBJTYPE: "",
		//                    ENDUZ: "000000",
		//                    ERNAM: "",
		//                    ERSDA: "",
		//                    ERSTM: "",
		//                    ERUZU: "",
		//                    EXTAPPLICATION: "",
		//                    EXTDOCUMENTNO: "",
		//                    EXTSYSTEM: "",
		//                    FUNC_AREA: "",
		//                    FUND: "",
		//                    GRANT_NBR: "",
		//                    HRBUDGET_PD: "",
		//                    HRCOSTASG: "0",
		//                    HRFUNC_AREA: "",
		//                    HRFUND: "",
		//                    HRGRANT_NBR: "",
		//                    HRKOSTL: "",
		//                    HRLSTAR: "",
		//                    KAPAR: "",
		//                    KAPID: "00000000",
		//                    KOKRS: "",
		//                    LAEDA: "",
		//                    LAETM: "",
		//                    LGART: "",
		//                    LOGSYS: "",
		//                    LONGTEXT: "",
		//                    LONGTEXT_DATA: "",
		//                    LSTAR: "",
		//                    LSTNR: "",
		//                    LTXA1: "",
		//                    MEINH: "",
		//                    OFMNW: "0.0",
		//                    OTYPE: "",
		//                    PAOBJNR: "0000000000",
		//                    PEDD: "00000000",
		//                    PERNR: "00000000",
		//                    PLANS: "00000000",
		//                    POSID: "",
		//                    PRAKN: "",
		//                    PRAKZ: "0000",
		//                    PRICE: "0.0",
		//                    RAPLZL: "00000000",
		//                    RAUFNR: "",
		//                    RAUFPL: "0000000000",
		//                    REASON: "",
		//                    REFCOUNTER: "000000000000",
		//                    REINR: "0000000000",
		//                    RKDAUF: "",
		//                    RKDPOS: "000000",
		//                    RKOSTL: "",
		//                    RKSTR: "",
		//                    RNPLNR: "",
		//                    RPROJ: "00000000",
		//                    RPRZNR: "",
		//                    SBUDGET_PD: "",
		//                    SEBELN: "",
		//                    SEBELP: "00000",
		//                    SKOSTL: "",
		//                    SPLIT: 0,
		//                    SPRZNR: "",
		//                    STATKEYFIG: "",
		//                    STATUS: "",
		//                    S_FUNC_AREA: "",
		//                    S_FUND: "",
		//                    S_GRANT_NBR: "",
		//                    TASKCOMPONENT: "",
		//                    TASKCOUNTER: "",
		//                    TASKLEVEL: "",
		//                    TASKTYPE: "",
		//                    TCURR: "",
		//                    TRFGR: "",
		//                    TRFST: "",
		//                    UNIT: "",
		//                    UVORN: "",
		//                    VERSL: "",
		//                    VORNR: "",
		//                    VTKEN: "",
		//                    WABLNR: "",
		//                    WAERS: "",
		//                    WERKS: "",
		//                    WORKDATE: new Date(i),
		//                    WORKITEMID: "000000000000",
		//                    WTART: ""
		//                },
		//                TimeEntryOperation: ""
		//            };
		//            if (f[0].TimeEntries.results.length > 1) {
		//                f[0].TimeEntries.results = f[0].TimeEntries.results.sort(function (u, v) {
		//                    if (parseFloat(u.TimeEntryDataFields.CATSHOURS) > parseFloat(v.TimeEntryDataFields.CATSHOURS)) {
		//                        return -1;
		//                    } else if (parseFloat(v.TimeEntryDataFields.CATSHOURS) > parseFloat(u.TimeEntryDataFields.CATSHOURS)) {
		//                        return 1;
		//                    }
		//                });
		//            }
		//            var k = 0;
		//            for (var j = 0; j < f[0].TimeEntries.results.length; j++) {
		//                f[0].TimeEntries.results[j].target = f[0].TargetHours;
		//                f[0].TimeEntries.results[j].TimeEntryDataFields.CATSHOURS = parseFloat(f[0].TimeEntries.results[j].TimeEntryDataFields.CATSHOURS).toFixed(2);
		//                k = parseFloat(k) + parseFloat(f[0].TimeEntries.results[j].TimeEntryDataFields.CATSHOURS);
		//                t.push(f[0].TimeEntries.results[j]);
		//            }
		//            for (var j = 0; j < f[0].TimeEntries.results.length; j++) {
		//                f[0].TimeEntries.results[j].totalHours = k.toFixed(2);
		//                if (j + 1 === f[0].TimeEntries.results.length) {
		//                    f[0].TimeEntries.results[j].addButton = true;
		//                    f[0].TimeEntries.results[j].addButtonEnable = true;
		//                    f[0].TimeEntries.results[j].deleteButton = true;
		//                    f[0].TimeEntries.results[j].deleteButtonEnable = true;
		//                    f[0].TimeEntries.results[j].SetDraft = false;
		//                    f[0].TimeEntries.results[j].HeaderData = {
		//                        target: f[0].TargetHours,
		//                        sum: k,
		//                        date: new Date(i),
		//                        addButton: true,
		//                        highlight: false
		//                    };
		//                } else {
		//                    f[0].TimeEntries.results[j].addButton = false;
		//                    f[0].TimeEntries.results[j].deleteButton = true;
		//                    f[0].TimeEntries.results[j].deleteButtonEnable = true;
		//                    f[0].TimeEntries.results[j].SetDraft = false;
		//                    f[0].TimeEntries.results[j].HeaderData = {
		//                        target: f[0].TargetHours,
		//                        sum: k,
		//                        date: new Date(i),
		//                        addButton: false,
		//                        highlight: false
		//                    };
		//                }
		//            }
		//            if (f[0].TimeEntries.results.length === 0) {
		//                r.totalHours = k.toFixed(2);
		//                r.addButton = true;
		//                r.HeaderData.addButton = true;
		//                r.addButtonEnable = false;
		//                r.deleteButtonEnable = false;
		//                r.SetDraft = false;
		//                t.push(r);
		//            }
		//        }
		//        for (var i = 0; i < t.length; i++) {
		//            if (t[i].TimeEntryDataFields.STATUS === "10") {
		//                t[i].SetDraft = true;
		//            }
		//            var q = $.grep(c, function (q, u) {
		//                if (t[i].TimeEntryDataFields.STATUS && t[i].TimeEntryDataFields.STATUS != "")
		//                    return q.key === t[i].TimeEntryDataFields.STATUS;
		//            });
		//            if (q && q.length > 0) {
		//                continue;
		//            }
		//            t[i].highlight = "None";
		//            t[i].valueState = "None";
		//        }
		//        m.setData(t);
		//        m.attachPropertyChange(this.onOverviewDataChanged.bind(this));
		//        this.setModel(m, "TimeData");
		//        this.setModel(new J(c), "Status");
		//        this.oTable.setBusy(false);
		//    },
		//    onOverviewDataChanged: function () {
		//        var t = this;
		//        var c = this.getModel("controls");
		//        c.setProperty("/overviewDataChanged", true);
		//    },
		//    getFirstDayOfWeek: function (a, f) {
		//        var i = f;
		//        var s = i >= 0 ? i : 0;
		//        var d = new Date(a);
		//        var b = d.getDay();
		//        var c = d.getDate() - b + (s > b ? s - 7 : s);
		//        d.setDate(c);
		//        return d;
		//    },
		//    getLastDayOfWeek: function (a, f) {
		//        var i = f;
		//        var s = i >= 0 ? i : 0;
		//        var d = new Date(a);
		//        var b = d.getDay();
		//        var c = d.getDate() - b + (s > b ? s - 1 : 6 + s);
		//        d.setDate(c);
		//        return d;
		//    },
		//    onEdit: function () {
		//        var m = this.getModel("controls");
		//        m.setProperty("/showFooter", true);
		//        m.setProperty("/sendForApproval", true);
		//        m.setProperty("/submitDraft", this.profileInfo.AllowRelease === "TRUE" ? false : true);
		//        m.setProperty("/overviewCancel", true);
		//        m.setProperty("/todoCancel", false);
		//        m.setProperty("/duplicateVisibility", true);
		//        if (sap.ui.Device.system.phone === false) {
		//            m.setProperty("/duplicateWeekVisibility", true);
		//        }
		//        m.setProperty("/overviewEdit", false);
		//        m.setProperty("/todoDone", false);
		//        m.setProperty("/onEdit", "None");
		//        m.setProperty("/duplicateTaskEnable", false);
		//        this.readTemplate = new sap.m.ColumnListItem({
		//            cells: [
		//                new sap.m.Text({ text: "{path: 'TimeData>TimeEntryDataFields/WORKDATE', type: 'sap.ui.model.type.Date', formatOptions: { pattern: 'EEEE, MMMM d' }}" }),
		//                new sap.m.ObjectIdentifier({ text: "{TimeData>TimeEntryDataFields/AWART}" }),
		//                new sap.m.ObjectStatus({
		//                    text: {
		//                        path: "TimeData>TimeEntryDataFields/STATUS",
		//                        formatter: e.status
		//                    },
		//                    state: {
		//                        path: "TimeData>TimeEntryDataFields/STATUS",
		//                        formatter: e.state
		//                    }
		//                }),
		//                new sap.m.ObjectStatus({
		//                    icon: "sap-icon://notes",
		//                    visible: {
		//                        path: "TimeData>TimeEntryDataFields/LONGTEXT",
		//                        formatter: e.visibility
		//                    }
		//                })
		//            ]
		//        });
		//        this.oEditableTemplate = new sap.m.ColumnListItem({
		//            highlight: "{TimeData>highlight}",
		//            cells: [
		//                new sap.m.ObjectStatus({
		//                    text: {
		//                        parts: [
		//                            {
		//                                path: "TimeData>totalHours",
		//                                type: "sap.ui.model.odata.type.Decimal",
		//                                formatOptions: {
		//                                    parseAsString: true,
		//                                    decimals: 2,
		//                                    maxFractionDigits: 2,
		//                                    minFractionDigits: 0
		//                                },
		//                                constraints: {
		//                                    precision: 4,
		//                                    scale: 2,
		//                                    minimum: "0",
		//                                    maximum: "10000"
		//                                }
		//                            },
		//                            {
		//                                path: "TimeData>target",
		//                                type: "sap.ui.model.odata.type.Decimal",
		//                                formatOptions: {
		//                                    parseAsString: true,
		//                                    decimals: 2,
		//                                    maxFractionDigits: 2,
		//                                    minFractionDigits: 0
		//                                },
		//                                constraints: {
		//                                    precision: 4,
		//                                    scale: 2,
		//                                    minimum: "0",
		//                                    maximum: "10000"
		//                                }
		//                            }
		//                        ],
		//                        formatter: e.concatStrings
		//                    },
		//                    visible: sap.ui.Device.system.phone ? false : true
		//                }),
		//                new sap.m.ComboBox({
		//                    selectedKey: "{TimeData>AssignmentId}",
		//                    selectionChange: this.onSelectionChange,
		//                    showSecondaryValues: true
		//                }).bindItems({
		//                    path: "TasksWithGroups>/",
		//                    template: new sap.ui.core.ListItem({
		//                        key: "{TasksWithGroups>AssignmentId}",
		//                        text: "{TasksWithGroups>AssignmentName}",
		//                        enabled: {
		//                            path: "TasksWithGroups>AssignmentStatus",
		//                            formatter: this.formatter.activeTasks
		//                        },
		//                        additionalText: "{TasksWithGroups>AssignmentType}"
		//                    }),
		//                    templateShareable: true
		//                }),
		//                new sap.ui.layout.HorizontalLayout({
		//                    content: [new sap.m.StepInput({
		//                            value: {
		//                                parts: [
		//                                    { path: "TimeData>TimeEntryDataFields/CATSHOURS" },
		//                                    { path: "TimeData>TimeEntryDataFields/CATSQUANTITY" },
		//                                    { path: "TimeData>TimeEntryDataFields/CATSAMOUNT" }
		//                                ],
		//                                formatter: e.calHoursQuanAmountInput.bind(this)
		//                            },
		//                            description: {
		//                                parts: [
		//                                    { path: "TimeData>TimeEntryDataFields/UNIT" },
		//                                    { path: "TimeData>TimeEntryDataFields/CATSHOURS" }
		//                                ],
		//                                formatter: e.getUnitTexts.bind(this)
		//                            },
		//                            change: this.liveChangeHours.bind(this),
		//                            displayValuePrecision: 2,
		//                            step: 1,
		//                            min: 0,
		//                            fieldWidth: "60%",
		//                            valueState: "{TimeData>valueState}",
		//                            valueStateText: "{TimeData>valueStateText}"
		//                        })]
		//                }),
		//                new sap.m.CheckBox({
		//                    selected: "{TimeData>SetDraft}",
		//                    visible: this.draftStatus
		//                }).attachSelect(this.onSelectionDraft.bind(this)),
		//                new sap.m.TimePicker({
		//                    value: {
		//                        path: "TimeData>TimeEntryDataFields/BEGUZ",
		//                        formatter: this.formatter.formatTime.bind(this)
		//                    },
		//                    visible: this.clockTimeVisible,
		//                    valueFormat: "HH:mm",
		//                    displayFormat: "HH:mm",
		//                    change: this.startTimeChange.bind(this),
		//                    placeholder: this.oBundle.getText("startTime")
		//                }),
		//                new sap.m.TimePicker({
		//                    value: {
		//                        path: "TimeData>TimeEntryDataFields/ENDUZ",
		//                        formatter: this.formatter.formatTime.bind(this)
		//                    },
		//                    visible: this.clockTimeVisible,
		//                    valueFormat: "HH:mm",
		//                    displayFormat: "HH:mm",
		//                    change: this.endTimeChange.bind(this),
		//                    placeholder: this.oBundle.getText("endTime")
		//                }),
		//                new sap.m.ObjectStatus({
		//                    text: {
		//                        path: "TimeData>TimeEntryDataFields/STATUS",
		//                        formatter: e.status
		//                    },
		//                    state: {
		//                        path: "TimeData>TimeEntryDataFields/STATUS",
		//                        formatter: e.state
		//                    }
		//                }),
		//                new sap.m.Button({
		//                    icon: {
		//                        path: "TimeData>TimeEntryDataFields/LONGTEXT",
		//                        formatter: e.longtextButtons
		//                    },
		//                    type: sap.m.ButtonType.Transparent,
		//                    press: this.longtextPopover.bind(this)
		//                }),
		//                new sap.ui.layout.HorizontalLayout({
		//                    content: [
		//                        new sap.m.Button({
		//                            icon: "sap-icon://sys-cancel",
		//                            type: sap.m.ButtonType.Transparent,
		//                            press: this.onOverviewDeleteRow.bind(this),
		//                            visible: "{TimeData>deleteButton}",
		//                            enabled: "{TimeData>deleteButtonEnable}"
		//                        }),
		//                        new sap.m.Button({
		//                            icon: "sap-icon://add",
		//                            type: sap.m.ButtonType.Transparent,
		//                            press: this.onOverviewAddRow.bind(this),
		//                            visible: "{TimeData>addButton}",
		//                            enabled: "{TimeData>addButtonEnable}"
		//                        })
		//                    ]
		//                })
		//            ],
		//            customData: [new sap.ui.core.CustomData({
		//                    key: "counter",
		//                    value: "{TimeData>Counter}"
		//                })]
		//        });
		//        this.rebindTableWithTemplate(this.oTable, "TimeData>/", this.oEditableTemplate, "Edit");
		//    },
		//    onSave: function () {
		//    },
		//    onSelectionDraft: function (E) {
		//        var t = this;
		//        var m = this.oTable.getModel("TimeData");
		//        var i = parseInt(E.getSource().getParent().getBindingContext("TimeData").getPath().split("/")[1]);
		//        var d = m.getData();
		//        var c = E.getSource().getParent().getCustomData("counter")[0].getValue();
		//        if (c && c !== null) {
		//            d[i].TimeEntryOperation = "U";
		//        } else {
		//            d[i].TimeEntryOperation = "C";
		//        }
		//        this.getModel("controls").setProperty("/isOverviewChanged", true);
		//        this.getModel("controls").setProperty("/overviewDataChanged", true);
		//    },
		//    onSelectionChange: function (E) {
		//        var s = E.getParameter("selectedItem").getKey();
		//        var a = E.getParameter("selectedItem").getText();
		//        if (E.getParameter("selectedItem").getBindingContext("TasksWithGroups").getModel().getData()[parseInt(E.getParameter("selectedItem").getBindingContext("TasksWithGroups").getPath().split("/")[1])].Type === "group") {
		//            var b;
		//            var m = this.getModel("TimeData");
		//            var c = this.getModel("AssignmentGroups").getData();
		//            var d = m.getData();
		//            var f = parseInt(E.getSource().getParent().getBindingContext("TimeData").getPath().split("/")[1]);
		//            var S = $.grep(c, function (y, z) {
		//                return y.groupId === s;
		//            });
		//            for (var i = 0; i < S[0].Assignments.length; i++) {
		//                var w = new Date(d[f].TimeEntryDataFields.WORKDATE);
		//                var j = d[f].TimeEntryDataFields.CATSHOURS;
		//                var k = d[f].TimeEntryDataFields.STATUS;
		//                var q = d[f].TimeEntryDataFields.BEGUZ;
		//                var r = d[f].TimeEntryDataFields.ENDUZ;
		//                var t = this.getModel("Tasks").getData();
		//                var u = $.grep(t, function (y, z) {
		//                    return y.AssignmentId === S[0].Assignments[i].AssignmentId;
		//                });
		//                if (i === 0) {
		//                    d[f].TimeEntryDataFields = $.extend(true, {}, u[0].AssignmentFields);
		//                    if (this.getModel("controls").getProperty("/approverAllowed")) {
		//                        d[f].ApproverId = u[0].ApproverId;
		//                    }
		//                    d[f].AssignmentId = u[0].AssignmentId;
		//                    d[f].AssignmentName = u[0].AssignmentName;
		//                    d[f].TimeEntryDataFields.WORKDATE = w;
		//                    d[f].TimeEntryDataFields.CATSHOURS = j;
		//                    d[f].TimeEntryDataFields.STATUS = k;
		//                    d[f].TimeEntryDataFields.BEGUZ = q;
		//                    d[f].TimeEntryDataFields.ENDUZ = r;
		//                    if (d[f].Counter && d[f].Counter !== null && d[f].Counter !== "") {
		//                        d[f].TimeEntryOperation = "U";
		//                        d[f].deleteButtonEnable = true;
		//                        d[f].addButtonEnable = true;
		//                    } else {
		//                        d[f].TimeEntryOperation = "C";
		//                        d[f].Counter = "";
		//                        d[f].deleteButtonEnable = true;
		//                        d[f].addButtonEnable = true;
		//                    }
		//                    d[f].highlight = sap.ui.core.MessageType.Information;
		//                    d[f].HeaderData.highlight = sap.ui.core.MessageType.Information;
		//                    d[f].HeaderData.addButton = true;
		//                } else {
		//                    var v = $.extend(true, {}, d[f]);
		//                    v.TimeEntryDataFields = $.extend(true, {}, u[0].AssignmentFields);
		//                    if (this.getModel("controls").getProperty("/approverAllowed")) {
		//                        v.ApproverId = u[0].ApproverId;
		//                    }
		//                    v.AssignmentId = u[0].AssignmentId;
		//                    v.AssignmentName = u[0].AssignmentName;
		//                    v.TimeEntryDataFields.WORKDATE = w;
		//                    v.TimeEntryDataFields.CATSHOURS = j;
		//                    v.TimeEntryDataFields.STATUS = k;
		//                    v.TimeEntryDataFields.BEGUZ = q;
		//                    v.TimeEntryDataFields.ENDUZ = r;
		//                    v.TimeEntryOperation = "C";
		//                    v.Counter = "";
		//                    v.deleteButtonEnable = true;
		//                    v.addButtonEnable = false;
		//                    v.addButton = false;
		//                    v.highlight = sap.ui.core.MessageType.Information;
		//                    v.HeaderData.highlight = sap.ui.core.MessageType.Information;
		//                    v.HeaderData.addButton = false;
		//                    d.splice(f, 0, v);
		//                }
		//            }
		//            var x = this.getModel("i18n").getResourceBundle().getText("groupImported");
		//            sap.m.MessageToast.show(x, { duration: 2000 });
		//        } else {
		//            var b;
		//            var m = this.getModel("TimeData");
		//            var d = m.getData();
		//            var f = parseInt(E.getSource().getParent().getBindingContext("TimeData").getPath().split("/")[1]);
		//            var w = d[f].TimeEntryDataFields.WORKDATE;
		//            var j = d[f].TimeEntryDataFields.CATSHOURS;
		//            var k = d[f].TimeEntryDataFields.STATUS;
		//            var q = d[f].TimeEntryDataFields.BEGUZ;
		//            var r = d[f].TimeEntryDataFields.ENDUZ;
		//            delete d[f].TimeEntryDataFields;
		//            var t = this.getModel("Tasks").getData();
		//            var u = $.grep(t, function (y, z) {
		//                return y.AssignmentId === s;
		//            });
		//            d[f].TimeEntryDataFields = $.extend(true, {}, u[0].AssignmentFields);
		//            if (this.getModel("controls").getProperty("/approverAllowed")) {
		//                d[f].ApproverId = u[0].ApproverId;
		//            }
		//            d[f].TimeEntryDataFields.WORKDATE = w;
		//            d[f].TimeEntryDataFields.CATSHOURS = j;
		//            d[f].TimeEntryDataFields.STATUS = k;
		//            d[f].TimeEntryDataFields.BEGUZ = q;
		//            d[f].TimeEntryDataFields.ENDUZ = r;
		//            d[f].AssignmentName = a;
		//            d[f].AssignmentId = s;
		//            if (d[f].Counter && d[f].Counter !== null && d[f].Counter !== "") {
		//                d[f].TimeEntryOperation = "U";
		//                d[f].deleteButtonEnable = true;
		//                d[f].addButtonEnable = true;
		//            } else {
		//                d[f].TimeEntryOperation = "C";
		//                d[f].Counter = "";
		//                d[f].deleteButtonEnable = true;
		//                d[f].addButtonEnable = true;
		//            }
		//        }
		//        this.getModel("controls").setProperty("/isOverviewChanged", true);
		//        this.getModel("controls").setProperty("/overviewDataChanged", true);
		//    },
		//    onSelectionChangeToDo: function (E) {
		//        var s = E.getParameter("selectedItem").getKey();
		//        var a = E.getParameter("selectedItem").getText();
		//        if (E.getParameter("selectedItem").getBindingContext("TasksWithGroups").getModel().getData()[parseInt(E.getParameter("selectedItem").getBindingContext("TasksWithGroups").getPath().split("/")[1])].Type === "group") {
		//            var b;
		//            var m = this.getModel("TodoList");
		//            var c = this.getModel("AssignmentGroups").getData();
		//            var d = m.getData();
		//            var f = parseInt(E.getSource().getParent().getBindingContext("TodoList").getPath().split("/")[1]);
		//            var S = $.grep(c, function (y, z) {
		//                return y.groupId === s;
		//            });
		//            for (var i = 0; i < S[0].Assignments.length; i++) {
		//                var w = new Date(d[f].TimeEntryDataFields.WORKDATE);
		//                var j = d[f].TimeEntryDataFields.CATSHOURS;
		//                var k = d[f].TimeEntryDataFields.STATUS;
		//                var q = d[f].TimeEntryDataFields.BEGUZ;
		//                var r = d[f].TimeEntryDataFields.ENDUZ;
		//                var t = this.getModel("Tasks").getData();
		//                var u = $.grep(t, function (y, z) {
		//                    return y.AssignmentId === S[0].Assignments[i].AssignmentId;
		//                });
		//                if (i === 0) {
		//                    d[f].TimeEntryDataFields = $.extend(true, {}, u[0].AssignmentFields);
		//                    if (this.getModel("controls").getProperty("/approverAllowed")) {
		//                        d[f].ApproverId = u[0].ApproverId;
		//                    }
		//                    d[f].AssignmentId = u[0].AssignmentId;
		//                    d[f].AssignmentName = u[0].AssignmentName;
		//                    d[f].TimeEntryDataFields.WORKDATE = w;
		//                    d[f].TimeEntryDataFields.CATSHOURS = j;
		//                    d[f].TimeEntryDataFields.STATUS = k;
		//                    d[f].TimeEntryDataFields.BEGUZ = q;
		//                    d[f].TimeEntryDataFields.ENDUZ = r;
		//                    d[f].highlight = sap.ui.core.MessageType.Information;
		//                    if (d[f].Counter && d[f].Counter !== null && d[f].Counter !== "") {
		//                        d[f].TimeEntryOperation = "U";
		//                        d[f].deleteButtonEnable = true;
		//                        d[f].addButtonEnable = true;
		//                    } else {
		//                        d[f].TimeEntryOperation = "C";
		//                        d[f].Counter = "";
		//                        d[f].deleteButtonEnable = true;
		//                        d[f].addButtonEnable = true;
		//                    }
		//                } else {
		//                    var v = $.extend(true, {}, d[f]);
		//                    v.TimeEntryDataFields = $.extend(true, {}, u[0].AssignmentFields);
		//                    if (this.getModel("controls").getProperty("/approverAllowed")) {
		//                        v.ApproverId = u[0].ApproverId;
		//                    }
		//                    v.AssignmentId = u[0].AssignmentId;
		//                    v.AssignmentName = u[0].AssignmentName;
		//                    v.TimeEntryDataFields.WORKDATE = w;
		//                    v.TimeEntryDataFields.CATSHOURS = j;
		//                    v.TimeEntryDataFields.STATUS = k;
		//                    v.TimeEntryDataFields.BEGUZ = q;
		//                    v.TimeEntryDataFields.ENDUZ = r;
		//                    v.highlight = sap.ui.core.MessageType.Information;
		//                    v.TimeEntryOperation = "C";
		//                    v.Counter = "";
		//                    v.deleteButtonEnable = true;
		//                    v.addButton = false;
		//                    d.splice(f, 0, v);
		//                }
		//            }
		//            var x = this.getModel("i18n").getResourceBundle().getText("groupImported");
		//            sap.m.MessageToast.show(x, { duration: 2000 });
		//        } else {
		//            var b;
		//            var m = this.getModel("TodoList");
		//            var d = m.getData();
		//            var f = parseInt(E.getSource().getParent().getBindingContext("TodoList").getPath().split("/")[1]);
		//            var w = d[f].TimeEntryDataFields.WORKDATE;
		//            var j = d[f].TimeEntryDataFields.CATSHOURS;
		//            var k = d[f].TimeEntryDataFields.STATUS;
		//            var q = d[f].TimeEntryDataFields.BEGUZ;
		//            var r = d[f].TimeEntryDataFields.ENDUZ;
		//            delete d[f].TimeEntryDataFields;
		//            var t = this.getModel("Tasks").getData();
		//            var u = $.grep(t, function (y, z) {
		//                return y.AssignmentId === s;
		//            });
		//            d[f].TimeEntryDataFields = $.extend(true, {}, u[0].AssignmentFields);
		//            if (this.getModel("controls").getProperty("/approverAllowed")) {
		//                d[f].ApproverId = u[0].ApproverId;
		//            }
		//            d[f].TimeEntryDataFields.WORKDATE = w;
		//            d[f].TimeEntryDataFields.CATSHOURS = j;
		//            d[f].TimeEntryDataFields.STATUS = k;
		//            d[f].TimeEntryDataFields.BEGUZ = q;
		//            d[f].TimeEntryDataFields.ENDUZ = r;
		//            d[f].highlight = sap.ui.core.MessageType.Information;
		//            d[f].AssignmentName = a;
		//            d[f].AssignmentId = s;
		//            if (d[f].Counter && d[f].Counter !== null && d[f].Counter !== "") {
		//                d[f].TimeEntryOperation = "U";
		//                d[f].deleteButtonEnable = true;
		//                d[f].addButtonEnable = true;
		//            } else {
		//                d[f].TimeEntryOperation = "C";
		//                d[f].Counter = "";
		//                d[f].deleteButtonEnable = true;
		//                d[f].addButtonEnable = true;
		//            }
		//            m.setData(d);
		//            this.setModel(m, "TodoList");
		//        }
		//        this.getModel("controls").setProperty("/isToDoChanged", true);
		//        this.getModel("controls").setProperty("/todoDataChanged", true);
		//    },
		//    onOverviewDeleteRow: function (E) {
		//        var t = this;
		//        this.oTable.setBusy(true);
		//        var c = E.getSource().getParent().getParent().getCustomData("counter")[0].getValue();
		//        var m = this.getModel("TimeData");
		//        var d = m.getData();
		//        this.setModel(m, "OriginalTime");
		//        var i = parseInt(E.getSource().getParent().getBindingContext("TimeData").getPath().split("/")[1]);
		//        var a = $.extend(true, {}, d[i]);
		//        var b = this.getModel("deleteRecords");
		//        var f = this.getModel("deleteRecords").getData();
		//        var r = this.recordTemplate();
		//        if (d[i].Counter && d[i].Counter != null) {
		//            if (f.length) {
		//                f.push(a);
		//                b.setData(f);
		//            } else {
		//                b.setData([a]);
		//            }
		//            this.setModel(b, "deleteRecords");
		//        }
		//        var j = $.grep(d, function (q, s) {
		//            return t.oFormatyyyymmdd.format(new Date(q.TimeEntryDataFields.WORKDATE)) === t.oFormatyyyymmdd.format(new Date(d[i].TimeEntryDataFields.WORKDATE));
		//        });
		//        var k = t.oFormatyyyymmdd.format(new Date(d[i].TimeEntryDataFields.WORKDATE));
		//        if (j.length >= 2) {
		//            d.splice(i, 1);
		//            var j = $.grep(d, function (q, s) {
		//                return t.oFormatyyyymmdd.format(new Date(q.TimeEntryDataFields.WORKDATE)) === k;
		//            });
		//            j[j.length - 1].addButtonEnable = true;
		//            j[j.length - 1].addButton = true;
		//            j[j.length - 1].HeaderData.addButton = true;
		//            d = this.calculateSum(new Date(j[j.length - 1].TimeEntryDataFields.WORKDATE), d);
		//            m.setData(d);
		//            this.setModel(m, "TimeData");
		//        } else {
		//            d[i].AssignmentId = "";
		//            d[i].AssignmentName = "";
		//            d[i].addButton = true;
		//            d[i].deleteButtonEnable = false;
		//            d[i].addButtonEnable = false;
		//            d[i].SetDraft = false;
		//            d[i].HeaderData.addButton = true;
		//            Object.getOwnPropertyNames(d[i].TimeEntryDataFields).forEach(function (q) {
		//                if (q == "WORKDATE") {
		//                } else {
		//                    d[i].TimeEntryDataFields[q] = r.TimeEntryDataFields[q];
		//                }
		//            });
		//            d = this.calculateSum(new Date(d[i].TimeEntryDataFields.WORKDATE), d);
		//            m.setData(d);
		//            this.setModel(m, "TimeData");
		//        }
		//        this.getModel("controls").setProperty("/isOverviewChanged", true);
		//        this.getModel("controls").setProperty("/overviewDataChanged", true);
		//        this.oTable.setBusy(false);
		//    },
		//    onOverviewAddRow: function (E) {
		//        this.oTable.setBusy(true);
		//        var a = this.recordTemplate();
		//        var c = this.getModel("controls");
		//        var b = E.getSource().getParent().getParent().getCustomData("counter")[0].getValue();
		//        var m = this.getModel("TimeData");
		//        var i = parseInt(E.getSource().getParent().getBindingContext("TimeData").getPath().split("/")[1]);
		//        var d = m.getData();
		//        d[i].addButton = false;
		//        var f = $.extend(true, {}, a);
		//        f.totalHours = d[i].totalHours;
		//        f.TimeEntryDataFields.WORKDATE = new Date(d[i].TimeEntryDataFields.WORKDATE);
		//        f.target = d[i].target;
		//        f.HeaderData = $.extend(true, {}, d[i].HeaderData);
		//        d[i].HeaderData.addButton = false;
		//        f.highlight = sap.ui.core.MessageType.Information;
		//        f.HeaderData.highlight = true;
		//        f.HeaderData.addButton = true;
		//        f.addButton = true;
		//        d.splice(i + 1, 0, f);
		//        m.setData(d);
		//        this.setModel(m, "TimeData");
		//        this.getModel("controls").setProperty("/isOverviewChanged", true);
		//        this.getModel("controls").setProperty("/overviewDataChanged", true);
		//        this.oTable.setBusy(false);
		//    },
		//    onTodoAddRow: function (E) {
		//        this.oToDoTable.setBusy(true);
		//        var c = E.getSource().getParent().getParent().getCustomData("counter")[0].getValue();
		//        var m = this.getModel("TodoList");
		//        var i = parseInt(E.getSource().getParent().getBindingContext("TodoList").getPath().split("/")[1]);
		//        var d = m.getData();
		//        d[i].addButton = false;
		//        var a = $.extend(true, {}, d[i]);
		//        a.TimeEntryDataFields.CATSHOURS = "0.00";
		//        a.TimeEntryDataFields.STATUS = "";
		//        a.Counter = "";
		//        a.highlight = sap.ui.core.MessageType.Information;
		//        a.addButton = true;
		//        d.splice(i + 1, 0, a);
		//        m.setData(d);
		//        this.setModel(m, "TodoList");
		//        this.getModel("controls").setProperty("/isToDoChanged", true);
		//        this.getModel("controls").setProperty("/todoDataChanged", true);
		//        this.oToDoTable.setBusy(false);
		//    },
		//    onTodoDeleteRow: function (E) {
		//        var t = this;
		//        this.oToDoTable.setBusy(true);
		//        var c = E.getSource().getParent().getParent().getCustomData("counter")[0].getValue();
		//        var m = this.getModel("TodoList");
		//        var d = m.getData();
		//        this.setModel(m, "OriginalTodoTime");
		//        var i = parseInt(E.getSource().getParent().getBindingContext("TodoList").getPath().split("/")[1]);
		//        var a = $.extend(true, {}, d[i]);
		//        var b = this.getModel("deleteRecords");
		//        var f = this.getModel("deleteRecords").getData();
		//        var r = this.recordTemplate();
		//        var j = $.grep(d, function (q, s) {
		//            return t.oFormatyyyymmdd.format(new Date(q.TimeEntryDataFields.WORKDATE)) === t.oFormatyyyymmdd.format(new Date(d[i].TimeEntryDataFields.WORKDATE));
		//        });
		//        var k = t.oFormatyyyymmdd.format(new Date(d[i].TimeEntryDataFields.WORKDATE));
		//        if (j.length >= 2) {
		//            d.splice(i, 1);
		//            var j = $.grep(d, function (q, s) {
		//                return t.oFormatyyyymmdd.format(new Date(q.TimeEntryDataFields.WORKDATE)) === k;
		//            });
		//            j[j.length - 1].addButtonEnable = true;
		//            j[j.length - 1].addButton = true;
		//            d = this.calculateSumToDo(new Date(j[j.length - 1].TimeEntryDataFields.WORKDATE), d);
		//            m.setData(d);
		//            this.setModel(m, "TodoList");
		//        } else {
		//            d[i].AssignmentId = "";
		//            d[i].AssignmentName = "";
		//            d[i].addButton = true;
		//            d[i].addButtonEnable = true;
		//            Object.getOwnPropertyNames(d[i].TimeEntryDataFields).forEach(function (q) {
		//                if (q == "WORKDATE") {
		//                } else {
		//                    d[i].TimeEntryDataFields[q] = r.TimeEntryDataFields[q];
		//                }
		//            });
		//            d = this.calculateSumToDo(new Date(d[i].TimeEntryDataFields.WORKDATE), d);
		//            m.setData(d);
		//            this.setModel(m, "TodoList");
		//        }
		//        this.getModel("controls").setProperty("/isToDoChanged", true);
		//        this.getModel("controls").setProperty("/todoDataChanged", true);
		//        this.oToDoTable.setBusy(false);
		//    },
		//    liveChangeHours: function (E) {
		//        var v = /^\d+(\.\d{1,2})?$/;
		//        this.getModel("controls").setProperty("/isOverviewChanged", true);
		//        this.getModel("controls").setProperty("/overviewDataChanged", true);
		//        if (v.test(E.getSource().getValue())) {
		//            var c = E.getSource().getParent().getParent().getCustomData("counter")[0].getValue();
		//            var m = this.oTable.getModel("TimeData");
		//            var i = parseInt(E.getSource().getParent().getParent().getBindingContext("TimeData").getPath().split("/")[1]);
		//            var d = m.getData();
		//            if (c && c !== null) {
		//                d[i].TimeEntryOperation = "U";
		//                d[i].TimeEntryDataFields.CATSHOURS = parseFloat(E.getSource().getValue()).toFixed(2);
		//            } else {
		//                d[i].TimeEntryOperation = "C";
		//                d[i].TimeEntryDataFields.CATSHOURS = parseFloat(E.getSource().getValue()).toFixed(2);
		//            }
		//            d = this.calculateSum(new Date(d[i].TimeEntryDataFields.WORKDATE), d);
		//            if (d[i].AssignmentId && d[i].AssignmentId !== "") {
		//            }
		//            this.setModel(new J(d), "TimeData");
		//        }
		//    },
		//    checkTimeEntry: function (s, a, b, c, d, w, f) {
		//        var t = this;
		//        var i = null;
		//        if (f && f !== null) {
		//            i = {
		//                "AssignmentId": a,
		//                "CatsHours": b,
		//                "Counter": f,
		//                "EndTime": d,
		//                "Operation": "U",
		//                "StartTime": c,
		//                "WorkDate": w
		//            };
		//        } else {
		//            i = {
		//                "AssignmentId": a,
		//                "CatsHours": b,
		//                "Counter": f,
		//                "EndTime": d,
		//                "Operation": "C",
		//                "StartTime": c,
		//                "WorkDate": w
		//            };
		//        }
		//        var P = {
		//            urlParameters: i,
		//            success: function (j, r) {
		//                if (j.results.length >= 1) {
		//                    s.setValueState("Warning");
		//                    s.setValueStateText(j.results[0].Text);
		//                }
		//            },
		//            error: function (E) {
		//                t.oErrorHandler.processError(E);
		//            }
		//        };
		//        this.oDataModel.callFunction("/CheckTimesheet", P);
		//    },
		//    calculateChangeCount: function () {
		//        var d = this.getModel("TimeData").getData();
		//        var c = this.getModel("controls").getData();
		//        var a = $.grep(d, function (b, i) {
		//            return b.TimeEntryOperation == "C";
		//        });
		//        var u = $.grep(d, function (b, i) {
		//            return b.TimeEntryOperation == "U";
		//        });
		//        var s = $.grep(d, function (b, i) {
		//            return b.TimeEntryOperation == "R";
		//        });
		//        if (s.length > 0) {
		//            c.numberOfRecords = s.length;
		//        } else {
		//            c.numberOfRecords = a.length + u.length;
		//        }
		//        this.getModel("controls").setData(c);
		//    },
		//    calculateSum: function (d, a) {
		//        var t = this;
		//        var s = parseFloat(0);
		//        d = this.oFormatyyyymmdd.format(d);
		//        var b = $.grep(a, function (b, c) {
		//            return t.oFormatyyyymmdd.format(new Date(b.TimeEntryDataFields.WORKDATE)) == d;
		//        });
		//        for (var i = 0; i < b.length; i++) {
		//            s = (parseFloat(s) + parseFloat(b[i].TimeEntryDataFields.CATSHOURS)).toFixed(2);
		//        }
		//        for (var j = 0; j < a.length; j++) {
		//            if (t.oFormatyyyymmdd.format(new Date(a[j].TimeEntryDataFields.WORKDATE)) === d) {
		//                a[j].totalHours = s;
		//                a[j].HeaderData.sum = s;
		//            }
		//        }
		//        return a;
		//    },
		//    calculateSumToDo: function (d, a) {
		//        var t = this;
		//        var s = parseFloat(0);
		//        d = this.oFormatyyyymmdd.format(d);
		//        var b = $.grep(a, function (b, f) {
		//            return t.oFormatyyyymmdd.format(new Date(b.TimeEntryDataFields.WORKDATE)) == d;
		//        });
		//        var c = (parseFloat(b[0].target) - parseFloat(b[0].missing)).toFixed(2);
		//        for (var i = 0; i < b.length; i++) {
		//            s = (parseFloat(s) + parseFloat(b[i].TimeEntryDataFields.CATSHOURS)).toFixed(2);
		//        }
		//        for (var j = 0; j < a.length; j++) {
		//            if (t.oFormatyyyymmdd.format(new Date(a[j].TimeEntryDataFields.WORKDATE)) === d) {
		//                a[j].total = (parseFloat(s) + parseFloat(c)).toFixed(2);
		//                a[j].currentMissing = parseFloat(a[j].target) - parseFloat(a[j].total) < 0 ? parseFloat(0).toFixed(2) : (parseFloat(a[j].target) - parseFloat(a[j].total)).toFixed(2);
		//            }
		//        }
		//        return a;
		//    },
		//    onCancel: function () {
		//        var t = this;
		//        var c = this.getModel("controls");
		//        c.setProperty("/duplicateVisibility", false);
		//        c.setProperty("/duplicateWeekVisibility", false);
		//        c.setProperty("/overviewEdit", true);
		//        c.setProperty("/onEdit", "None");
		//        c.setProperty("/showFooter", false);
		//        c.setProperty("/overviewDataChanged", false);
		//        c.setProperty("/isOverviewChanged", false);
		//        t.bindTable(new Date(t.startdate), new Date(t.enddate));
		//        this.rebindTableWithTemplate(this.oTable, "TimeData>/", this.oReadOnlyTemplate, "Navigation");
		//        var d = {};
		//        var m = new J();
		//        m.setData(d);
		//        this.setModel(m, "deleteRecords");
		//        this.setModel(m, "changedRecords");
		//        this.setModel(m, "newRecords");
		//        this.setModel(c, "controls");
		//        sap.ui.getCore().getMessageManager().removeAllMessages();
		//    },
		//    onTodoCancel: function () {
		//        var c = this.getModel("controls");
		//        c.setProperty("/editTodoVisibility", true);
		//        c.setProperty("/showFooter", false);
		//        var m = new J($.extend(true, [], this.todolist));
		//        this.setModel(m, "TodoList");
		//        if (this.oReadOnlyToDoTemplate) {
		//            this.rebindTableWithTemplate(this.oToDoTable, "TodoList>/", this.oReadOnlyToDoTemplate, "Navigation");
		//        }
		//        sap.ui.getCore().getMessageManager().removeAllMessages();
		//    },
		//    rebindTable: function (t, k) {
		//        this.oTable.bindItems({
		//            path: "TimeData>/",
		//            template: t,
		//            templateShareable: true
		//        }).setKeyboardMode(k);
		//    },
		//    rebindTableWithTemplate: function (t, P, a, k) {
		//        if (P === "TimeData>/" && sap.ui.Device.system.phone === false) {
		//            t.bindItems({
		//                path: P,
		//                sorter: [new sap.ui.model.Sorter("HeaderData", false, true, this.compareRows)],
		//                template: a,
		//                templateShareable: true,
		//                groupHeaderFactory: this.getGroupHeader.bind(this)
		//            }).setKeyboardMode(k);
		//        } else if (P === "TimeData>/" && sap.ui.Device.system.phone === true) {
		//            t.bindItems({
		//                path: P,
		//                sorter: [new sap.ui.model.Sorter("TimeEntryDataFields/WORKDATE", false, false)],
		//                template: a,
		//                templateShareable: true
		//            }).setKeyboardMode(k);
		//        } else if (P === "TodoList>/") {
		//            t.bindItems({
		//                path: P,
		//                template: a,
		//                templateShareable: true
		//            }).setKeyboardMode(k);
		//        }
		//    },
		//    compareRows: function (a, b) {
		//        if (new Date(a.date) > new Date(b.date)) {
		//            return 1;
		//        } else if (new Date(b.date) > new Date(a.date)) {
		//            return -1;
		//        } else {
		//            if (a.addButton == true && b.addButton == true) {
		//                return 0;
		//            } else if (b.addButton == true) {
		//                return -1;
		//            } else if (a.addButton == true) {
		//                return 1;
		//            } else if (a.highlight == true && b.highlight == true) {
		//                return 0;
		//            } else if (a.highlight == true) {
		//                return 1;
		//            } else if (b.highlight == true) {
		//                return -1;
		//            }
		//        }
		//    },
		//    loadTasks: function () {
		//        return new sap.ui.core.Item({
		//            key: "{Tasks>AssignmentName}",
		//            text: "{Tasks>AssignmentName}"
		//        });
		//    },
		//    onTaskCreate: function (E) {
		//        var t = this;
		//        t.byId("idTasks").setBusy(true);
		//        var v = this.getView();
		//        var f = [];
		//        var a = [];
		//        var b = {
		//            name: null,
		//            status: false,
		//            containers: null
		//        };
		//        var c = this.getModel("controls");
		//        c.setProperty("/createAssignment", true);
		//        c.setProperty("/editAssignment", false);
		//        c.setProperty("/copyAssignment", false);
		//        c.setProperty("/displayAssignment", false);
		//        c.setProperty("/editAssignmentCancel", true);
		//        c.setProperty("/displayAssignmentCancel", false);
		//        c.setProperty("/assignmentTitle", this.oBundle.getText("createAssignment"));
		//        this.setGlobalModel(c, "controls");
		//        this.setGlobalModel(c, "controls");
		//        var d = $.extend(true, [], this.getModel("ProfileFields").getData());
		//        var m = new J();
		//        for (var i = 0; i < d.length; i++) {
		//            if (d[i].FieldName !== "AssignmentName" && d[i].FieldName !== "ValidityStartDate" && d[i].FieldName !== "ValidityEndDate") {
		//                f.push(d[i]);
		//            }
		//            if ((f.length + 1) % 5 === 0 || i === d.length - 1) {
		//                a.push({ form: $.extend(f, [], true) });
		//                f = [];
		//            }
		//        }
		//        b.containers = a;
		//        m.setData(b);
		//        this.setGlobalModel(m, "EditedTask");
		//        t.byId("idTasks").setBusy(false);
		//        this.getRouter().navTo("editAssignment", {}, false);
		//    },
		//    onTaskDelete: function (E) {
		//        var t = this;
		//        this.showBusy();
		//        var a = this.byId("idTasks");
		//        var d = this.getModel("Tasks").getData();
		//        var s = a.getSelectedItems();
		//        var b = [];
		//        for (var i = 0; i < s.length; i++) {
		//            var c = s[i].getAggregation("cells");
		//            var A = c[0].getAggregation("customData")[1].getValue();
		//            var f = s[i].getBindingContext("TaskFields").getPath().split("/")[1];
		//            delete d[f].ToGrps;
		//            d[f].ValidityStartDate = this.oFormatYyyymmdd.format(new Date(d[f].ValidityStartDate)) + "T00:00:00";
		//            d[f].ValidityEndDate = this.oFormatYyyymmdd.format(new Date(d[f].ValidityEndDate)) + "T00:00:00";
		//            var j = $.extend(true, {}, d[f]);
		//            j.AssignmentOperation = "D";
		//            b.push(j);
		//        }
		//        var m = $.extend(true, {}, this.oDataModel);
		//        m.setChangeBatchGroups({
		//            "*": {
		//                groupId: "TimeEntry",
		//                changeSetId: "TimeEntry",
		//                single: false
		//            }
		//        });
		//        m.setDeferredGroups(["TimeEntry"]);
		//        m.refreshSecurityToken(function (j) {
		//            for (var i = 0; i < b.length; i++) {
		//                var k = {
		//                    properties: b[i],
		//                    changeSetId: "TimeEntry",
		//                    groupId: "TimeEntry"
		//                };
		//                m.createEntry("/AssignmentCollection", k);
		//            }
		//            m.submitChanges({
		//                groupId: "TimeEntry",
		//                changeSetId: "TimeEntry",
		//                success: function (j, r) {
		//                    if (!j.__batchResponses[0].__changeResponses) {
		//                        t.hideBusy(true);
		//                        return;
		//                    }
		//                    var q = t.oBundle.getText("tasksDeletedSuccessfully");
		//                    sap.m.MessageToast.show(q, { duration: 1000 });
		//                    t.getTasks(false);
		//                    t.hideBusy(true);
		//                },
		//                error: function (q) {
		//                    t.hideBusy(true);
		//                    t.oErrorHandler.processError(q);
		//                }
		//            });
		//        }, true);
		//        t.hideBusy(true);
		//    },
		//    onTaskEdit: function (E) {
		//        var t = this;
		//        t.byId("idTasks").setBusy(true);
		//        var v = this.getView();
		//        var a = this.byId("idTasks");
		//        var m = new J();
		//        var d = this.getModel("ProfileFields").getData();
		//        var b = this.getModel("Tasks").getData();
		//        var c = a.getSelectedItem().getBindingContext("TaskFields").getPath().split("/")[1];
		//        var f = [];
		//        var j = [];
		//        var k = {
		//            name: null,
		//            status: false,
		//            containers: null
		//        };
		//        var C = this.getModel("controls");
		//        C.setProperty("/createAssignment", false);
		//        C.setProperty("/editAssignment", true);
		//        C.setProperty("/editAssignmentCancel", true);
		//        C.setProperty("/displayAssignment", false);
		//        C.setProperty("/displayAssignmentCancel", false);
		//        C.setProperty("/copyAssignment", false);
		//        C.setProperty("/assignmentTitle", this.oBundle.getText("editAssignment"));
		//        this.setGlobalModel(C, "controls");
		//        var s = a.getSelectedItem().getAggregation("cells");
		//        var q = $.extend(true, [], this.getModel("ProfileFields").getData());
		//        for (var i = 0; i < s.length; i++) {
		//            var r = $.grep(d, function (u, c) {
		//                return u.FieldName == s[i].getCustomData("FieldName")[0].getValue();
		//            });
		//            if (s[i].getCustomData("FieldName")[0].getValue() !== "AssignmentStatus" && s[i].getCustomData("FieldName")[0].getValue() !== "AssignmentName" && s[i].getCustomData("FieldName")[0].getValue() !== "ValidityStartDate" && s[i].getCustomData("FieldName")[0].getValue() !== "ValidityEndDate") {
		//                if (b[c].AssignmentFields[s[i].getCustomData("FieldName")[0].getValue()] !== undefined) {
		//                    r[0].FieldValue = b[c].AssignmentFields[s[i].getCustomData("FieldName")[0].getValue()];
		//                }
		//                r[0].AssignmentId = s[i].getAggregation("customData")[1].getValue();
		//            } else {
		//                if (s[i].getCustomData("FieldName")[0].getValue() === "AssignmentStatus") {
		//                    r[0].FieldValue = s[i].getAggregation("customData")[2].getValue();
		//                    r[0].AssignmentId = s[i].getAggregation("customData")[1].getValue();
		//                } else if (s[i].getCustomData("FieldName")[0].getValue() === "AssignmentName") {
		//                    r[0].FieldValue = s[i].getText();
		//                    r[0].AssignmentId = s[i].getAggregation("customData")[1].getValue();
		//                } else if (s[i].getCustomData("FieldName")[0].getValue() === "ValidityStartDate") {
		//                    r[0].FieldValue = s[i].getText();
		//                    r[0].AssignmentId = s[i].getAggregation("customData")[1].getValue();
		//                } else if (s[i].getCustomData("FieldName")[0].getValue() === "ValidityEndDate") {
		//                    r[0].FieldValue = s[i].getText();
		//                    r[0].AssignmentId = s[i].getAggregation("customData")[1].getValue();
		//                }
		//            }
		//            if (s[i].getCustomData("FieldName")[0].getValue() !== "AssignmentName" && s[i].getCustomData("FieldName")[0].getValue() !== "AssignmentStatus" && s[i].getCustomData("FieldName")[0].getValue() !== "ValidityStartDate" && s[i].getCustomData("FieldName")[0].getValue() !== "ValidityEndDate") {
		//                f.push(r[0]);
		//            } else {
		//                if (s[i].getCustomData("FieldName")[0].getValue() === "AssignmentName") {
		//                    k.name = r[0].FieldValue;
		//                } else if (s[i].getCustomData("FieldName")[0].getValue() === "AssignmentStatus") {
		//                    k.status = r[0].FieldValue;
		//                } else if (s[i].getCustomData("FieldName")[0].getValue() === "ValidityStartDate") {
		//                    k.validFrom = new Date(r[0].FieldValue);
		//                } else if (s[i].getCustomData("FieldName")[0].getValue() === "ValidityEndDate") {
		//                    k.validTo = new Date(r[0].FieldValue);
		//                }
		//            }
		//            if ((f.length + 1) % 5 === 0 || i === s.length - 1) {
		//                j.push({ form: $.extend(f, [], true) });
		//                f = [];
		//            }
		//        }
		//        k.containers = j;
		//        m.setData(k);
		//        this.setGlobalModel(m, "EditedTask");
		//        t.byId("idTasks").setBusy(false);
		//        this.getRouter().navTo("editAssignment", {}, false);
		//    },
		//    onTaskSelection: function (E) {
		//        var c = this.getModel("controls");
		//        if (E.getParameters().listItem.getSelected() === true && this.oTaskTable.getSelectedItems().length == 1) {
		//            c.setProperty("/taskEdit", true);
		//            c.setProperty("/taskDelete", true);
		//            c.setProperty("/taskCopy", true);
		//            c.setProperty("/createGroupButton", true);
		//        } else if (this.oTaskTable.getSelectedItems().length == 1) {
		//            c.setProperty("/taskEdit", true);
		//            c.setProperty("/taskDelete", true);
		//            c.setProperty("/taskCopy", true);
		//            c.setProperty("/createGroupButton", true);
		//        } else {
		//            c.setProperty("/taskEdit", false);
		//            c.setProperty("/taskDelete", true);
		//            c.setProperty("/taskCopy", false);
		//            c.setProperty("/createGroupButton", true);
		//        }
		//    },
		//    deleteSelectedDays: function (E) {
		//        var a = E.getParameters().listItem.getBindingContext("selectedDatesDup").getPath().split("/selectedDates/")[1];
		//        var d = this.getModel("selectedDatesDup").getData();
		//        this.byId("duplicateCalendar").removeAllSelectedDates();
		//        this.byId("mDuplicateCalendar").removeAllSelectedDates();
		//        delete d.selectedDates[a].Date;
		//        d.selectedDates.splice(a, 1);
		//        for (var i = 0; i < d.selectedDates.length; i++) {
		//            this.byId("duplicateCalendar").addSelectedDate(new sap.ui.unified.DateRange({ startDate: d.selectedDates[i].Date }));
		//            this.byId("mDuplicateCalendar").addSelectedDate(new sap.ui.unified.DateRange({ startDate: d.selectedDates[i].Date }));
		//        }
		//        var m = new J(d);
		//        this.setModel(m, "selectedDatesDup");
		//    },
		//    onDuplicateTask: function (E) {
		//        var t = this;
		//        var v = this.getView();
		//        var a = this.byId("idTasks");
		//        var m = new J();
		//        var d;
		//        var b = {
		//            handleCancel: function () {
		//                d.close();
		//                d.destroy();
		//                this.setModel(new J({ selectedDates: [] }), "selectedDatesDup");
		//                this.setModel(new J([]), "TimeDataDuplicateTask");
		//                this.getModel("controls").setProperty("/duplicateTaskButtonEnable", false);
		//            }.bind(this),
		//            onSelect: this.handleDupTaskCalendarSelect.bind(this),
		//            onDelete: this.deleteSelectedDays.bind(this),
		//            onOverviewSelect: this.onOverviewSelectDup.bind(this),
		//            handleConfirm: function () {
		//                var s = this.handleDuplicateTaskConfirm();
		//                if (s) {
		//                    d.close();
		//                    d.destroy();
		//                    this.calendar.removeAllSelectedDates();
		//                    this.setModel(new J({ selectedDates: [] }), "selectedDatesDup");
		//                    this.setModel(new J([]), "TimeDataDuplicateTask");
		//                    var c = t.oBundle.getText("duplicatedSuccessfully");
		//                    sap.m.MessageToast.show(c, { duration: 3000 });
		//                    this.getModel("controls").setProperty("/overviewDataChanged", true);
		//                    this.getModel("controls").setProperty("/isOverviewChanged", true);
		//                    this.getModel("controls").setProperty("/duplicateTaskButtonEnable", false);
		//                }
		//            }.bind(this),
		//            dayOfWeek: this.formatter.dayOfWeek.bind(this)
		//        };
		//        if (!d) {
		//            d = sap.ui.xmlfragment(v.getId(), "hcm.fab.mytimesheet.view.fragments.DuplicateTask", b);
		//            v.addDependent(d);
		//        }
		//        jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), d);
		//        jQuery.sap.delayedCall(0, this, function () {
		//            d.open();
		//        });
		//    },
		//    onDuplicateWeek: function (E) {
		//        var t = this;
		//        var v = this.getView();
		//        var a = this.byId("idTasks");
		//        var m = new J();
		//        var d;
		//        var b = {
		//            handleCancel: function () {
		//                d.close();
		//                d.destroy();
		//                this.setModel(new J({ selectedWeek: [] }), "selectedDatesDupWeek");
		//                this.getModel("controls").setProperty("/duplicateWeekButtonEnable", false);
		//            }.bind(this),
		//            concatDates: this.formatter.concatDates.bind(this),
		//            onDelete: this.deleteSelectedWeeks.bind(this),
		//            handleDuplicateWeekCalendar: this.handleDuplicateWeekCalendar.bind(this),
		//            dayOfWeek: this.formatter.dayOfWeek.bind(this),
		//            handleConfirm: function (E) {
		//                var s = this.handleConfirmDuplicateWeek(E);
		//                if (s) {
		//                    d.close();
		//                    d.destroy();
		//                    this.calendar.removeAllSelectedDates();
		//                    this.setModel(new J({ selectedWeek: [] }), "selectedDatesDupWeek");
		//                    var c = t.oBundle.getText("duplicatedSuccessfully");
		//                    sap.m.MessageToast.show(c, { duration: 3000 });
		//                    this.getModel("controls").setProperty("/overviewDataChanged", true);
		//                    this.getModel("controls").setProperty("/isOverviewChanged", true);
		//                }
		//            }.bind(this)
		//        };
		//        if (!d) {
		//            d = sap.ui.xmlfragment(v.getId(), "hcm.fab.mytimesheet.view.fragments.DuplicateWeek", b);
		//            v.addDependent(d);
		//        }
		//        jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), d);
		//        jQuery.sap.delayedCall(0, this, function () {
		//            d.open();
		//        });
		//    },
		//    deleteSelectedWeeks: function (E) {
		//        var i = E.getParameters().listItem.getBindingContext("selectedDatesDupWeek").getPath().split("/selectedWeek/")[1];
		//        var d = this.getModel("selectedDatesDupWeek").getData();
		//        delete d.selectedWeek[i].dateFrom;
		//        d.selectedWeek.splice(i, 1);
		//        var m = new J(d);
		//        this.setModel(m, "selectedDatesDupWeek");
		//    },
		//    handleConfirmDuplicateWeek: function (E) {
		//        var d = $.extend(true, [], this.getModel("TimeData").getData());
		//        var t = new Date(this.oFormatYyyymmdd.format(d[0].TimeEntryDataFields.WORKDATE) + "T00:00:00");
		//        var a = new Date(this.oFormatYyyymmdd.format(d[d.length - 1].TimeEntryDataFields.WORKDATE) + "T00:00:00");
		//        if (this.getModel("selectedDatesDupWeek") && this.getModel("selectedDatesDupWeek").getData().selectedWeek.length > 0) {
		//            var b = this.getModel("selectedDatesDupWeek").getData().selectedWeek;
		//        } else {
		//            var c = this.oBundle.getText("selectWeekDup");
		//            sap.m.MessageToast.show(c, { duration: 3000 });
		//            return false;
		//        }
		//        var f = new J();
		//        var W = [];
		//        for (var k = new Date(t); k <= a; k.setDate(k.getDate() + 1)) {
		//            var q = $.grep(d, function (u, v) {
		//                return u.TimeEntryDataFields.WORKDATE.toDateString() === k.toDateString();
		//            });
		//            var r = { day: q };
		//            W.push(r);
		//        }
		//        for (var i = 0; i < b.length; i++) {
		//            for (var j = new Date(b[i].dateFrom), k = 0; j <= b[i].dateTo, k < 7; j.setDate(j.getDate() + 1, k++)) {
		//                for (var m = 0; m < W[k].day.length; m++) {
		//                    var s = $.extend(true, {}, W[k].day[m]);
		//                    s.TimeEntryDataFields.WORKDATE = new Date(j);
		//                    s.Counter = "";
		//                    s.TimeEntryDataFields.STATUS = "";
		//                    s.TimeEntryDataFields.LONGTEXT = "";
		//                    s.TimeEntryDataFields.LONGTEXT_DATA = "";
		//                    s.TimeEntryDataFields.REFCOUNTER = "";
		//                    s.HeaderData.date = new Date(j);
		//                    s.highlight = sap.ui.core.MessageType.Information;
		//                    s.HeaderData.highlight = sap.ui.core.MessageType.Information;
		//                    if (s.TimeEntryDataFields.CATSHOURS !== "0.00") {
		//                        s.TimeEntryOperation = "C";
		//                    }
		//                    d.push(s);
		//                }
		//            }
		//        }
		//        f.setData(d);
		//        this.setModel(f, "TimeData");
		//        this.oTable.bindItems({
		//            path: "TimeData>/",
		//            sorter: [new sap.ui.model.Sorter("HeaderData", false, true, this.compareRows)],
		//            template: this.oEditableTemplate,
		//            templateShareable: true,
		//            groupHeaderFactory: this.getGroupHeader.bind(this)
		//        }).setKeyboardMode("Edit");
		//        this.getModel("controls").setProperty("/duplicateWeekButtonEnable", false);
		//        return true;
		//    },
		//    handleDuplicateWeekCalSelect: function (E) {
		//        var c = E.getSource();
		//        var s = c.getSelectedDates();
		//        var d;
		//        var a = { selectedDates: [] };
		//        var m = new J();
		//        if (s.length > 0) {
		//            for (var i = 0; i < s.length; i++) {
		//                d = s[i].getStartDate();
		//                a.selectedDates.push({ Date: d });
		//            }
		//            m.setData(a);
		//            this.setModel(m, "selectedDatesDup");
		//        } else {
		//        }
		//    },
		//    onOverviewSelect: function (E) {
		//        var t = this;
		//        var s = E;
		//        var c = this.getModel("controls");
		//        var d = this.getModel("TimeData");
		//        var m = new J();
		//        var a = null;
		//        var d = this.getModel("TimeData").getData();
		//        var b = this.getModel("TimeDataDuplicateTask");
		//        var f = [];
		//        if (E.getParameters().listItem.getBindingContext("TimeData")) {
		//            a = E.getParameters().listItem.getBindingContext("TimeData").getPath().split("/")[1];
		//            d[a].TimeEntryOperation = "";
		//            var j = $.grep(d, function (q, r) {
		//                return q.TimeEntryOperation == "R";
		//            });
		//            for (var i = 0; i < j.length; i++) {
		//                j[i].TimeEntryOperation = "";
		//            }
		//        }
		//        if (this.oTable.getSelectedItems().length >= 1) {
		//            var k = this.oTable.getSelectedContextPaths();
		//            for (var i = 0; i < k.length; i++) {
		//                if (d[k[i].split("/")[1]].Counter !== null && d[k[i].split("/")[1]].Counter && d[k[i].split("/")[1]].Counter !== "" || (parseFloat(d[k[i].split("/")[1]].TimeEntryDataFields.CATSHOURS).toFixed(2) !== parseFloat("0.00").toFixed(2) || parseFloat(d[k[i].split("/")[1]].TimeEntryDataFields.CATSQUANTITY).toFixed(2) !== parseFloat("0.00").toFixed(2) || parseFloat(d[k[i].split("/")[1]].TimeEntryDataFields.CATSAMOUNT).toFixed(2) !== parseFloat("0.00").toFixed(2))) {
		//                    d[k[i].split("/")[1]].TimeEntryOperation = "R";
		//                    f.push($.extend(true, {}, d[k[i].split("/")[1]]));
		//                }
		//            }
		//        } else {
		//        }
		//        m.setData(f);
		//        this.setModel(m, "TimeDataDuplicateTask");
		//        t.calculateChangeCount();
		//    },
		//    onOverviewSelectDup: function (E) {
		//        var t = this;
		//        var s = E;
		//        var c = this.getModel("controls");
		//        var d = this.getModel("TimeData");
		//        var m = new J();
		//        var a = null;
		//        var d = this.getModel("TimeData").getData();
		//        var b = this.getModel("TimeDataDuplicateTask");
		//        var f = [];
		//        if (E.getSource().getSelectedItems().length >= 1) {
		//            var j = E.getSource().getSelectedContextPaths();
		//            for (var i = 0; i < j.length; i++) {
		//                f.push($.extend(true, {}, d[j[i].split("/")[1]]));
		//            }
		//        } else {
		//        }
		//        m.setData(f);
		//        this.setModel(m, "TimeDataDuplicateTask");
		//        if (this.getModel("selectedDatesDup").getData().selectedDates.length >= 1) {
		//            this.getModel("controls").setProperty("/duplicateTaskButtonEnable", true);
		//        }
		//    },
		//    handleDuplicateTaskConfirm: function () {
		//        if (this.getModel("TimeDataDuplicateTask") && this.getModel("TimeDataDuplicateTask").getData().length > 0) {
		//            var m = this.getModel("TimeDataDuplicateTask");
		//        } else {
		//            var t = this.oBundle.getText("selectRecordDup");
		//            sap.m.MessageToast.show(t, { duration: 3000 });
		//            return false;
		//        }
		//        if (this.getModel("selectedDatesDup") && this.getModel("selectedDatesDup").getData().selectedDates.length > 0) {
		//            var d = this.getModel("selectedDatesDup").getData();
		//        } else {
		//            var t = this.oBundle.getText("selectDatesDup");
		//            sap.m.MessageToast.show(t, { duration: 3000 });
		//            return false;
		//        }
		//        var a = this.getModel("TimeData").getData();
		//        for (var i = 0; i < d.selectedDates.length; i++) {
		//            var b = $.extend(true, [], m.getData());
		//            for (var j = 0; j < b.length; j++) {
		//                b[j].TimeEntryDataFields.WORKDATE = new Date(d.selectedDates[i].Date);
		//                b[j].Counter = "";
		//                b[j].TimeEntryOperation = "C";
		//                b[j].TimeEntryDataFields.STATUS = "";
		//                b[j].TimeEntryDataFields.LONGTEXT = "";
		//                b[j].TimeEntryDataFields.LONGTEXT_DATA = "";
		//                b[j].HeaderData.date = new Date(d.selectedDates[i].Date);
		//                b[j].highlight = sap.ui.core.MessageType.Information;
		//                b[j].HeaderData.highlight = sap.ui.core.MessageType.Information;
		//                b[j].HeaderData.addButton = false;
		//                b[j].addButton = false;
		//                if (j == 0) {
		//                    var s = $.grep(a, function (c, f) {
		//                        return c.TimeEntryDataFields.WORKDATE.toDateString() === b[j].TimeEntryDataFields.WORKDATE.toDateString();
		//                    });
		//                    if (s.length === 0) {
		//                        b[j].HeaderData.addButton = true;
		//                        b[j].addButton = true;
		//                    }
		//                }
		//                a.push(b[j]);
		//            }
		//        }
		//        m.setData(a);
		//        this.setModel(m, "TimeData");
		//        this.oTable.bindItems({
		//            path: "TimeData>/",
		//            sorter: [new sap.ui.model.Sorter("HeaderData", false, true, this.compareRows)],
		//            template: this.oEditableTemplate,
		//            templateShareable: true,
		//            groupHeaderFactory: this.getGroupHeader.bind(this)
		//        }).setKeyboardMode("Edit");
		//        return true;
		//    },
		//    onAssignmentQuickView: function (E) {
		//        var t = this;
		//        var i = E.getSource().getParent().getBindingContext("TimeData").getPath().split("/")[1];
		//        var a = this.getModel("TimeData").getData();
		//        var b = this.getModel("ProfileFields").getData();
		//        var d = [{
		//                label: this.oBundle.getText("name"),
		//                value: a[i].AssignmentName
		//            }];
		//        var c;
		//        var f = {
		//            label: null,
		//            value: null
		//        };
		//        b.forEach(function (c, r) {
		//            var m = t.getModel(c.FieldName);
		//            if (m) {
		//                var s = m.getData();
		//            }
		//            if (c.FieldName !== "AssignmentStatus" && c.FieldName !== "APPROVER" && c.FieldName !== "AssignmentName" && c.FieldName !== "ValidityStartDate" && c.FieldName !== "ValidityEndDate") {
		//                f.label = c.FieldLabel;
		//                var u = a[i].TimeEntryDataFields[c.FieldName];
		//                if (s) {
		//                    var v = $.grep(s, function (f, r) {
		//                        return f.DispField1Id === u;
		//                    });
		//                    if (v.length && v.length > 0) {
		//                        f.value = a[i].TimeEntryDataFields[c.FieldName] + "  " + v[0].DispField1Val;
		//                    } else {
		//                        f.value = a[i].TimeEntryDataFields[c.FieldName];
		//                    }
		//                } else {
		//                    f.value = a[i].TimeEntryDataFields[c.FieldName];
		//                }
		//                c = $.extend(true, {}, f);
		//                d.push(c);
		//            }
		//        });
		//        var m = new J(d);
		//        this.setModel(m, "TimeDataDetail");
		//        var j;
		//        if (j) {
		//            j.close();
		//        }
		//        var k = {
		//            handleClose: function (r) {
		//                j.close();
		//            }
		//        };
		//        if (!j) {
		//            j = sap.ui.xmlfragment(this.getView().getId(), "hcm.fab.mytimesheet.view.fragments.AssignmentQuickView", k);
		//            this.getView().addDependent(j);
		//        }
		//        var q = E.getSource();
		//        jQuery.sap.delayedCall(0, this, function () {
		//            j.openBy(q);
		//        });
		//    },
		//    UpdateTask: function (a) {
		//        var t = this;
		//        var m = new J();
		//        var P = {
		//            success: function (d, r) {
		//                var b = d.results;
		//            },
		//            error: function (E) {
		//                t.oErrorHandler.processError(E);
		//            }
		//        };
		//        this.oDataModel.create("/AssignmentCollection", a, P);
		//    },
		//    SubmitTask: function (a) {
		//        var t = this;
		//        var m = new J();
		//        var P = {
		//            success: function (d, r) {
		//                var b = d.results;
		//                var c = t.oBundle.getText("taskSaved");
		//                sap.m.MessageToast.show(c, { duration: 1000 });
		//                t.getTasks(false);
		//            },
		//            error: function (E) {
		//                t.oErrorHandler.processError(E);
		//            }
		//        };
		//        this.oDataModel.create("/AssignmentCollection", a, P);
		//    },
		//    iconTabSelection: function (E) {
		//        var c = this.getModel("controls");
		//        var t = this;
		//        var m = t.oBundle.getText("confirmationSwitchTab");
		//        var C = !!this.getView().$().closest(".sapUiSizeCompact").length;
		//        if (this.filterAppliedFlag === "X" && E.getParameter("section").getId().split("worklist--")[1] !== "tasks") {
		//            sap.m.MessageBox.warning(m, {
		//                title: t.oBundle.getText("confirm"),
		//                actions: [
		//                    sap.m.MessageBox.Action.OK,
		//                    sap.m.MessageBox.Action.CANCEL
		//                ],
		//                styleClass: C ? "sapUiSizeCompact" : "",
		//                onClose: function (a) {
		//                    if (a === "CANCEL") {
		//                        t.byId("ObjectPageLayout").setSelectedSection(t.byId("ObjectPageLayout").getSections()[2].getId());
		//                        return;
		//                    } else {
		//                        t.filterAppliedFlag = "";
		//                        t.getTasks(false);
		//                        sap.ui.getCore().getMessageManager().removeAllMessages();
		//                        this.iconTabSelectionProcessing(E.getParameter("section").getId().split("worklist--")[1]);
		//                    }
		//                }
		//            });
		//        }
		//        if ((c.getProperty("/isOverviewChanged") || c.getProperty("/overviewDataChanged")) && E.getParameter("section").getId().split("worklist--")[1] !== "overview") {
		//            sap.m.MessageBox.warning(t.oBundle.getText("confirmationSwitchTabGeneral"), {
		//                title: t.oBundle.getText("confirm"),
		//                actions: [
		//                    sap.m.MessageBox.Action.OK,
		//                    sap.m.MessageBox.Action.CANCEL
		//                ],
		//                styleClass: C ? "sapUiSizeCompact" : "",
		//                onClose: function (a) {
		//                    if (a === "CANCEL") {
		//                        t.byId("ObjectPageLayout").setSelectedSection(t.byId("ObjectPageLayout").getSections()[0].getId());
		//                        return;
		//                    } else {
		//                        t.onCancel();
		//                        sap.ui.getCore().getMessageManager().removeAllMessages();
		//                        this.iconTabSelectionProcessing(E.getParameter("section").getId().split("worklist--")[1]);
		//                    }
		//                }
		//            });
		//        } else if (!(c.getProperty("/isOverviewChanged") || c.getProperty("/overviewDataChanged")) && E.getParameter("section").getId().split("worklist--")[1] !== "overview") {
		//            t.onCancel();
		//            if (c.getProperty("/isToDoChanged") || c.getProperty("/todoDataChanged")) {
		//                c.setProperty("/showFooter", true);
		//            }
		//        }
		//        if ((c.getProperty("/isToDoChanged") || c.getProperty("/todoDataChanged")) && E.getParameter("section").getId().split("worklist--")[1] !== "todolist") {
		//            sap.m.MessageBox.warning(t.oBundle.getText("confirmationSwitchTabGeneral"), {
		//                title: t.oBundle.getText("confirm"),
		//                actions: [
		//                    sap.m.MessageBox.Action.OK,
		//                    sap.m.MessageBox.Action.CANCEL
		//                ],
		//                styleClass: C ? "sapUiSizeCompact" : "",
		//                onClose: function (a) {
		//                    if (a === "CANCEL") {
		//                        t.byId("ObjectPageLayout").setSelectedSection(t.byId("ObjectPageLayout").getSections()[1].getId());
		//                        return;
		//                    } else {
		//                        t.onTodoCancel();
		//                        c.setProperty("/isToDoChanged", false);
		//                        c.setProperty("/todoDataChanged", false);
		//                        sap.ui.getCore().getMessageManager().removeAllMessages();
		//                        this.iconTabSelectionProcessing(E.getParameter("section").getId().split("worklist--")[1]);
		//                    }
		//                }
		//            });
		//        } else if (!(c.getProperty("/isToDoChanged") || c.getProperty("/todoDataChanged")) && E.getParameter("section").getId().split("worklist--")[1] !== "todolist") {
		//            t.onTodoCancel();
		//            c.setProperty("/isToDoChanged", false);
		//            c.setProperty("/todoDataChanged", false);
		//            if (c.getProperty("/isOverviewChanged") || c.getProperty("/overviewDataChanged")) {
		//                c.setProperty("/showFooter", true);
		//            }
		//        }
		//    },
		//    iconTabSelectionProcessing: function (s) {
		//        var c = this.getModel("controls");
		//        if (s == "overview") {
		//            c.setProperty("/showFooter", false);
		//            c.setProperty("/overviewEdit", true);
		//            c.setProperty("/editTodoVisibility", true);
		//            c.setProperty("/duplicateVisibility", false);
		//            c.setProperty("/duplicateWeekVisibility", false);
		//            if (this.oReadOnlyToDoTemplate) {
		//                this.rebindTableWithTemplate(this.oToDoTable, "TodoList>/", this.oReadOnlyToDoTemplate, "Navigation");
		//                c.setProperty("/showFooter", false);
		//            }
		//        } else if (s == "todolist") {
		//            c.setProperty("/showFooter", false);
		//            c.setProperty("/onEdit", "None");
		//            c.setProperty("/duplicateVisibility", false);
		//            c.setProperty("/duplicateWeekVisibility", false);
		//            if (this.oReadOnlyTemplate) {
		//                this.rebindTableWithTemplate(this.oTable, "TimeData>/", this.oReadOnlyTemplate, "Navigation");
		//                c.setProperty("/showFooter", false);
		//            }
		//        } else if (s == "tasks") {
		//            c.setProperty("/showFooter", false);
		//            c.setProperty("/onEdit", "None");
		//            if (this.oReadOnlyTemplate) {
		//                this.rebindTableWithTemplate(this.oTable, "TimeData>/", this.oReadOnlyTemplate, "Navigation");
		//                c.setProperty("/showFooter", false);
		//            }
		//            c.setProperty("/overviewEdit", true);
		//            c.setProperty("/editTodoVisibility", true);
		//            c.setProperty("/duplicateVisibility", false);
		//            c.setProperty("/duplicateWeekVisibility", false);
		//            if (this.oReadOnlyToDoTemplate) {
		//                this.rebindTableWithTemplate(this.oToDoTable, "TodoList>/", this.oReadOnlyToDoTemplate, "Navigation");
		//            }
		//            c.setProperty("/showFooter", false);
		//        } else {
		//            c.setProperty("/showFooter", false);
		//            c.setProperty("/onEdit", "None");
		//            if (this.oReadOnlyTemplate) {
		//                this.rebindTableWithTemplate(this.oTable, "TimeData>/", this.oReadOnlyTemplate, "Navigation");
		//                c.setProperty("/showFooter", false);
		//            }
		//            c.setProperty("/overviewEdit", true);
		//            c.setProperty("/editTodoVisibility", true);
		//            c.setProperty("/duplicateVisibility", false);
		//            c.setProperty("/duplicateWeekVisibility", false);
		//            if (this.oReadOnlyToDoTemplate) {
		//                this.rebindTableWithTemplate(this.oToDoTable, "TodoList>/", this.oReadOnlyToDoTemplate, "Navigation");
		//            }
		//            c.setProperty("/showFooter", false);
		//        }
		//        this.setModel(c, "controls");
		//    },
		//    onValueHelp: function (E) {
		//        var t = this;
		//        var a = E.getSource().getCustomData("FieldName")[0].getValue();
		//        new Promise(function (r, R) {
		//            t.getValueHelpCollection(a);
		//            r(t.valueHelpFragment());
		//            R();
		//        });
		//    },
		//    valueHelpFragment: function () {
		//        var t = this;
		//        var t = this;
		//        var v = this.getView();
		//        var d;
		//        if (!d) {
		//            var a = {
		//                handleConfirm: t.handleClick.bind(t),
		//                handleCancel: function (E) {
		//                    d.destroy();
		//                }.bind(t),
		//                onValueHelp: t.onValueHelp.bind(t),
		//                handleClickValueHelp: t.handleClick.bind(t)
		//            };
		//            d = sap.ui.xmlfragment(v.getId(), "hcm.fab.mytimesheet.view.fragments.ValueHelp", a);
		//            v.addDependent(d);
		//        }
		//        jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), d);
		//        jQuery.sap.delayedCall(0, this, function () {
		//            d.open();
		//        });
		//    },
		//    getValueHelpCollection: function (a) {
		//        var t = this;
		//        var m = new sap.ui.model.json.JSONModel();
		//        var f = [];
		//        var c = new sap.ui.model.Filter({
		//            path: "Pernr",
		//            operator: sap.ui.model.FilterOperator.EQ,
		//            value1: this.empID
		//        });
		//        var d = new sap.ui.model.Filter({
		//            path: "FieldName",
		//            operator: sap.ui.model.FilterOperator.EQ,
		//            value1: a
		//        });
		//        f.push(c);
		//        f.push(d);
		//        var P = {
		//            urlParameters: "$expand=ValueHelpHits",
		//            filters: f,
		//            success: function (b, r) {
		//                t.results = b.results[0].ValueHelpHits.results;
		//                ;
		//                m.setData(t.results);
		//                t.setModel(m, "ValueHelp");
		//            },
		//            error: function (E) {
		//                t.oErrorHandler.processError(E);
		//            }
		//        };
		//        this.oDataModel.read("/ValueHelpCollection", P);
		//    },
		//    handleClick: function (E) {
		//        var t = this;
		//        var v = E.getParameter("selectedItem");
		//    },
		//    onToDoEdit: function (E) {
		//        var t = this;
		//        var m = this.getModel("controls");
		//        m.setProperty("/sendForApproval", false);
		//        m.setProperty("/submitDraft", false);
		//        m.setProperty("/overviewCancel", false);
		//        m.setProperty("/todoCancel", true);
		//        m.setProperty("/todoDone", true);
		//        m.setProperty("/showFooter", true);
		//        m.setProperty("/editTodoVisibility", false);
		//        this.oReadOnlyToDoTemplate = this.getView().byId("idToDoList").removeItem(0);
		//        this.oEditableToDoTemplate = new sap.m.ColumnListItem({
		//            highlight: "{TodoList>highlight}",
		//            cells: [
		//                new sap.m.Text({ text: "{path: 'TodoList>TimeEntryDataFields/WORKDATE', type: 'sap.ui.model.type.Date', formatOptions: { style: 'full' }}" }),
		//                new sap.m.ObjectStatus({
		//                    text: {
		//                        parts: [
		//                            {
		//                                path: "TodoList>total",
		//                                type: "sap.ui.model.odata.type.Decimal",
		//                                formatOptions: {
		//                                    parseAsString: true,
		//                                    decimals: 2,
		//                                    maxFractionDigits: 2,
		//                                    minFractionDigits: 0
		//                                },
		//                                constraints: {
		//                                    precision: 4,
		//                                    scale: 2,
		//                                    minimum: "0",
		//                                    maximum: "10000"
		//                                }
		//                            },
		//                            {
		//                                path: "TodoList>target",
		//                                type: "sap.ui.model.odata.type.Decimal",
		//                                formatOptions: {
		//                                    parseAsString: true,
		//                                    decimals: 2,
		//                                    maxFractionDigits: 2,
		//                                    minFractionDigits: 0
		//                                },
		//                                constraints: {
		//                                    precision: 4,
		//                                    scale: 2,
		//                                    minimum: "0",
		//                                    maximum: "10000"
		//                                }
		//                            }
		//                        ],
		//                        formatter: e.concatStrings
		//                    }
		//                }),
		//                new sap.m.ObjectStatus({
		//                    text: {
		//                        path: "TodoList>currentMissing",
		//                        type: "sap.ui.model.odata.type.Decimal",
		//                        formatOptions: {
		//                            parseAsString: true,
		//                            decimals: 2,
		//                            maxFractionDigits: 2,
		//                            minFractionDigits: 0
		//                        },
		//                        constraints: {
		//                            precision: 4,
		//                            scale: 2,
		//                            minimum: "0",
		//                            maximum: "10000"
		//                        }
		//                    }
		//                }),
		//                new sap.m.ComboBox({
		//                    selectedKey: "{TodoList>AssignmentId}",
		//                    selectionChange: this.onSelectionChangeToDo,
		//                    showSecondaryValues: true
		//                }).bindItems({
		//                    path: "TasksWithGroups>/",
		//                    template: new sap.ui.core.ListItem({
		//                        key: "{TasksWithGroups>AssignmentId}",
		//                        text: "{TasksWithGroups>AssignmentName}",
		//                        enabled: {
		//                            path: "TasksWithGroups>AssignmentStatus",
		//                            formatter: this.formatter.activeTasks
		//                        },
		//                        additionalText: "{TasksWithGroups>AssignmentType}"
		//                    }),
		//                    templateShareable: true
		//                }),
		//                new sap.ui.layout.HorizontalLayout({
		//                    content: [new sap.m.StepInput({
		//                            value: {
		//                                parts: [
		//                                    { path: "TodoList>TimeEntryDataFields/CATSHOURS" },
		//                                    { path: "TodoList>TimeEntryDataFields/CATSQUANTITY" },
		//                                    { path: "TodoList>TimeEntryDataFields/CATSAMOUNT" }
		//                                ],
		//                                formatter: e.calHoursQuanAmountInput.bind(this)
		//                            },
		//                            description: {
		//                                parts: [
		//                                    { path: "TodoList>TimeEntryDataFields/UNIT" },
		//                                    { path: "TodoList>TimeEntryDataFields/CATSHOURS" }
		//                                ],
		//                                formatter: e.getUnitTexts.bind(this)
		//                            },
		//                            change: this.liveChangeHoursToDo.bind(this),
		//                            displayValuePrecision: 2,
		//                            step: 1,
		//                            min: 0,
		//                            fieldWidth: "60%",
		//                            valueState: "{TodoList>valueState}",
		//                            valueStateText: "{TodoList>valueStateText}"
		//                        })]
		//                }),
		//                new sap.m.TimePicker({
		//                    value: {
		//                        path: "TodoList>TimeEntryDataFields/BEGUZ",
		//                        formatter: this.formatter.formatTime.bind(this)
		//                    },
		//                    visible: this.clockTimeVisible,
		//                    valueFormat: "HH:mm",
		//                    displayFormat: "HH:mm",
		//                    change: this.startTimeToDoChange.bind(this),
		//                    placeholder: this.oBundle.getText("startTime")
		//                }),
		//                new sap.m.TimePicker({
		//                    value: {
		//                        path: "TodoList>TimeEntryDataFields/ENDUZ",
		//                        formatter: this.formatter.formatTime.bind(this)
		//                    },
		//                    visible: this.clockTimeVisible,
		//                    valueFormat: "HH:mm",
		//                    displayFormat: "HH:mm",
		//                    change: this.stopTimeToDoChange.bind(this),
		//                    placeholder: this.oBundle.getText("endTime")
		//                }),
		//                new sap.m.ObjectStatus({
		//                    text: {
		//                        path: "TodoList>TimeEntryDataFields/STATUS",
		//                        formatter: e.status
		//                    },
		//                    state: {
		//                        path: "TodoList>TimeEntryDataFields/STATUS",
		//                        formatter: e.TodoState
		//                    }
		//                }),
		//                new sap.m.Button({
		//                    icon: {
		//                        path: "TodoList>TimeEntryDataFields/LONGTEXT",
		//                        formatter: e.longtextButtons
		//                    },
		//                    type: sap.m.ButtonType.Transparent,
		//                    press: this.EditTodoLongTextPopover.bind(this)
		//                }),
		//                new sap.ui.layout.HorizontalLayout({
		//                    content: [
		//                        new sap.m.Button({
		//                            icon: "sap-icon://sys-cancel",
		//                            type: sap.m.ButtonType.Transparent,
		//                            press: this.onTodoDeleteRow.bind(this),
		//                            visible: "{TodoList>deleteButton}",
		//                            enabled: "{TodoList>deleteButtonEnable}"
		//                        }),
		//                        new sap.m.Button({
		//                            icon: "sap-icon://add",
		//                            type: sap.m.ButtonType.Transparent,
		//                            press: this.onTodoAddRow.bind(this),
		//                            visible: "{TodoList>addButton}",
		//                            enabled: "{TodoList>addButtonEnable}"
		//                        })
		//                    ]
		//                })
		//            ],
		//            customData: [new sap.ui.core.CustomData({
		//                    key: "counter",
		//                    value: "{TodoList>Counter}"
		//                })]
		//        });
		//        this.rebindTableWithTemplate(this.oToDoTable, "TodoList>/", this.oEditableToDoTemplate, "Edit");
		//    },
		//    liveChangeHoursToDo: function (E) {
		//        this.getModel("controls").setProperty("/isToDoChanged", true);
		//        this.getModel("controls").setProperty("/todoDataChanged", true);
		//        var v = /^\d+(\.\d{1,2})?$/;
		//        if (v.test(E.getSource().getValue())) {
		//            var c = E.getSource().getParent().getParent().getCustomData("counter")[0].getValue();
		//            var m = this.oToDoTable.getModel("TodoList");
		//            var i = parseInt(E.getSource().getParent().getBindingContext("TodoList").getPath().split("/")[1]);
		//            var d = m.getData();
		//            d[i].addButtonEnable = true;
		//            d[i].deleteButtonEnable = true;
		//            d[i].sendButton = true;
		//            d[i].TimeEntryDataFields.CATSHOURS = parseFloat(E.getSource().getValue()).toFixed(2);
		//            if (c && c !== null) {
		//                d[i].TimeEntryOperation = "U";
		//            } else {
		//                d[i].TimeEntryOperation = "C";
		//            }
		//            d = this.calculateSumToDo(new Date(d[i].TimeEntryDataFields.WORKDATE), d);
		//            this.setModel(new J(d), "TodoList");
		//        }
		//    },
		//    onCopyTask: function (E) {
		//        var t = this;
		//        var v = this.getView();
		//        var a = this.byId("idTasks");
		//        var m = new J();
		//        var d = this.getModel("ProfileFields").getData();
		//        var b = this.getModel("Tasks").getData();
		//        var c = a.getSelectedItem().getBindingContext("TaskFields").getPath().split("/")[1];
		//        var f = [];
		//        var j = [];
		//        var k = {
		//            name: null,
		//            status: false,
		//            containers: null
		//        };
		//        var C = this.getModel("controls");
		//        C.setProperty("/createAssignment", false);
		//        C.setProperty("/editAssignment", false);
		//        C.setProperty("/copyAssignment", true);
		//        C.setProperty("/displayAssignment", false);
		//        C.setProperty("/assignmentTitle", this.oBundle.getText("copyAssignment"));
		//        this.setGlobalModel(C, "controls");
		//        var s = a.getSelectedItem().getAggregation("cells");
		//        var q = $.extend(true, [], this.getModel("ProfileFields").getData());
		//        for (var i = 0; i < s.length; i++) {
		//            var r = $.grep(d, function (u, c) {
		//                return u.FieldName == s[i].getCustomData("FieldName")[0].getValue();
		//            });
		//            if (s[i].getCustomData("FieldName")[0].getValue() !== "AssignmentStatus" && s[i].getCustomData("FieldName")[0].getValue() !== "AssignmentName" && s[i].getCustomData("FieldName")[0].getValue() !== "ValidityStartDate" && s[i].getCustomData("FieldName")[0].getValue() !== "ValidityEndDate") {
		//                if (b[c].AssignmentFields[s[i].getCustomData("FieldName")[0].getValue()] !== undefined) {
		//                    r[0].FieldValue = b[c].AssignmentFields[s[i].getCustomData("FieldName")[0].getValue()];
		//                }
		//                r[0].AssignmentId = s[i].getAggregation("customData")[1].getValue();
		//            } else {
		//                if (s[i].getCustomData("FieldName")[0].getValue() === "AssignmentStatus") {
		//                    r[0].FieldValue = s[i].getAggregation("customData")[2].getValue();
		//                    r[0].AssignmentId = s[i].getAggregation("customData")[1].getValue();
		//                } else if (s[i].getCustomData("FieldName")[0].getValue() === "AssignmentName") {
		//                    r[0].AssignmentId = s[i].getAggregation("customData")[1].getValue();
		//                    r[0].FieldValue = "";
		//                } else if (s[i].getCustomData("FieldName")[0].getValue() === "ValidityStartDate") {
		//                    r[0].FieldValue = s[i].getText();
		//                    r[0].AssignmentId = s[i].getAggregation("customData")[1].getValue();
		//                } else if (s[i].getCustomData("FieldName")[0].getValue() === "ValidityEndDate") {
		//                    r[0].FieldValue = s[i].getText();
		//                    r[0].AssignmentId = s[i].getAggregation("customData")[1].getValue();
		//                }
		//            }
		//            if (s[i].getCustomData("FieldName")[0].getValue() !== "AssignmentName" && s[i].getCustomData("FieldName")[0].getValue() !== "AssignmentStatus" && s[i].getCustomData("FieldName")[0].getValue() !== "ValidityStartDate" && s[i].getCustomData("FieldName")[0].getValue() !== "ValidityEndDate") {
		//                f.push(r[0]);
		//            } else {
		//                if (s[i].getCustomData("FieldName")[0].getValue() === "AssignmentName") {
		//                    k.name = r[0].FieldValue;
		//                } else if (s[i].getCustomData("FieldName")[0].getValue() === "AssignmentStatus") {
		//                    k.status = r[0].FieldValue;
		//                } else if (s[i].getCustomData("FieldName")[0].getValue() === "ValidityStartDate") {
		//                    k.validFrom = new Date(r[0].FieldValue);
		//                } else if (s[i].getCustomData("FieldName")[0].getValue() === "ValidityEndDate") {
		//                    k.validTo = new Date(r[0].FieldValue);
		//                }
		//            }
		//            if ((f.length + 1) % 5 === 0 || i === s.length - 1) {
		//                j.push({ form: $.extend(f, [], true) });
		//                f = [];
		//            }
		//        }
		//        k.containers = j;
		//        m.setData(k);
		//        this.setGlobalModel(m, "EditedTask");
		//        this.getRouter().navTo("editAssignment", {}, false);
		//    },
		//    onSendForApprovalToDo: function (E) {
		//        var t = this;
		//        var i = parseInt(E.getSource().getBindingContext("TodoList").getPath().split("/")[1]);
		//        var m = this.getModel("TodoList");
		//        var a = this.getModel("TodoListApproval");
		//        var b;
		//        var d = m.getData();
		//        if (a) {
		//            b = a.getData();
		//            b.push(d[i]);
		//        } else {
		//            b = [d[i]];
		//            a = new J();
		//        }
		//        a.setData(b);
		//        this.setModel(a, "TodoListApproval");
		//        d.splice(i, 1);
		//        m.setData(d);
		//        this.setModel(m, "TodoList");
		//        var c = t.oBundle.getText("todoEntriesSaved");
		//        sap.m.MessageToast.show(c, { duration: 2000 });
		//    },
		//    onToDoSubmit: function (E) {
		//        var t = this;
		//        this.showBusy();
		//        var s = this.fetchToDoRecords();
		//        var a;
		//        var m = $.extend(true, {}, this.oDataModel);
		//        var c = this.getModel("controls");
		//        m.setChangeBatchGroups({
		//            "*": {
		//                groupId: "TimeEntry",
		//                changeSetId: "TimeEntry",
		//                single: false
		//            }
		//        });
		//        m.setDeferredGroups(["TimeEntry"]);
		//        m.refreshSecurityToken(function (d) {
		//            if (s.length === 0) {
		//                t.hideBusy(true);
		//                var b = t.oBundle.getText("noEntriesToSubmit");
		//                sap.m.MessageToast.show(b, { duration: 3000 });
		//                return;
		//            }
		//            for (var i = 0; i < s.length; i++) {
		//                var f = {
		//                    properties: s[i],
		//                    changeSetId: "TimeEntry",
		//                    groupId: "TimeEntry"
		//                };
		//                m.createEntry("/TimeEntryCollection", f);
		//            }
		//            m.submitChanges({
		//                groupId: "TimeEntry",
		//                changeSetId: "TimeEntry",
		//                success: function (d, r) {
		//                    if (t.oMessagePopover) {
		//                        t.oMessagePopover.destroy();
		//                        sap.ui.getCore().getMessageManager().removeAllMessages();
		//                    }
		//                    var j = false;
		//                    var k = t.getModel("TodoList").getData();
		//                    var q = [];
		//                    if (!d.__batchResponses[0].__changeResponses) {
		//                        t.hideBusy(true);
		//                        return;
		//                    } else {
		//                        for (var i = 0; i < d.__batchResponses[0].__changeResponses.length; i++) {
		//                            var u = $.grep(k, function (w, x) {
		//                                if (w.RecRowNo) {
		//                                    return w.RecRowNo === parseInt(d.__batchResponses[0].__changeResponses[i].data.RecRowNo).toString();
		//                                }
		//                            });
		//                            if (d.__batchResponses[0].__changeResponses[i].data.ErrorMsg !== "") {
		//                                j = true;
		//                                if (u.length > 0) {
		//                                    u[0].valueState = "Error";
		//                                    u[0].highlight = "Error";
		//                                    u[0].valueStateText = d.__batchResponses[0].__changeResponses[i].data.ErrorMsg;
		//                                    q.push(new sap.ui.core.message.Message({
		//                                        message: d.__batchResponses[0].__changeResponses[i].data.ErrorMsg,
		//                                        description: d.__batchResponses[0].__changeResponses[i].data.ErrorMsg,
		//                                        type: sap.ui.core.MessageType.Error,
		//                                        processor: t.getOwnerComponent().oMessageProcessor,
		//                                        additionalText: parseInt(d.__batchResponses[0].__changeResponses[i].data.RecRowNo),
		//                                        code: "TodoList"
		//                                    }));
		//                                }
		//                            } else {
		//                                if (u.length > 0) {
		//                                    u[0].valueState = "Success";
		//                                    u[0].highlight = "Success";
		//                                }
		//                            }
		//                        }
		//                    }
		//                    sap.ui.getCore().getMessageManager().addMessages(q);
		//                    t.getModel("TodoList").updateBindings();
		//                    if (!j) {
		//                        var b = t.oBundle.getText("timeEntriesSaved");
		//                        sap.m.MessageToast.show(b, { duration: 1000 });
		//                        t.getToDoList();
		//                        t.getTimeEntries(new Date(t.dateFrom), new Date(t.dateTo));
		//                        sap.ui.getCore().getMessageManager().removeAllMessages();
		//                        var v = [];
		//                        var m = new J();
		//                        m.setData(v);
		//                        t.setModel(m, "deleteRecords");
		//                        t.setModel(m, "changedRecords");
		//                        t.setModel(m, "newRecords");
		//                        if (t.oReadOnlyToDoTemplate) {
		//                            t.rebindTableWithTemplate(t.oToDoTable, "TodoList>/", t.oReadOnlyToDoTemplate, "Navigation");
		//                        }
		//                        c.setProperty("/editTodoVisibility", true);
		//                        c.setProperty("/todoDone", false);
		//                        c.setProperty("/todoCancel", false);
		//                        c.setProperty("/showFooter", false);
		//                        c.setProperty("/todoDataChanged", false);
		//                        c.setProperty("/isToDoChanged", false);
		//                    }
		//                    t.hideBusy(true);
		//                },
		//                error: function (j) {
		//                    t.hideBusy(true);
		//                    t.oErrorHandler.processError(j);
		//                }
		//            });
		//        }, true);
		//        m.attachBatchRequestCompleted(this.onSubmissionSuccess.bind(this));
		//    },
		//    onStartDateChange: function (E) {
		//        var t = this;
		//        var c = E.getSource();
		//        var C = this.getModel("controls");
		//        var a = new Date();
		//        a = new Date(c.getStartDate());
		//        if (sap.ui.Device.system.phone === true) {
		//            this.dateFrom = this.getFirstDayOfWeek(c.getStartDate(), t.firstDayOfWeek);
		//            this.dateTo = this.getLastDayOfWeek(c.getStartDate(), t.firstDayOfWeek);
		//            this.startdate = this.getFirstDayOfWeek(c.getStartDate(), t.firstDayOfWeek);
		//            this.enddate = this.getFirstDayOfWeek(c.getStartDate(), t.firstDayOfWeek);
		//        } else {
		//            this.dateFrom = this.getFirstDayOfWeek(c.getStartDate(), t.firstDayOfWeek);
		//            a.setMonth(a.getMonth() + 2, 0);
		//            this.dateTo = this.getLastDayOfWeek(a, t.firstDayOfWeek);
		//            this.startdate = this.getFirstDayOfWeek(c.getStartDate(), t.firstDayOfWeek);
		//            this.enddate = this.getLastDayOfWeek(c.getStartDate(), t.firstDayOfWeek);
		//        }
		//        this.showBusy();
		//        if (this.oReadOnlyTemplate) {
		//            this.rebindTableWithTemplate(this.oTable, "TimeData>/", this.oReadOnlyTemplate, "Navigation");
		//        }
		//        C.setProperty("/overviewCancel", false);
		//        C.setProperty("/sendForApproval", false);
		//        C.setProperty("/submitDraft", false);
		//        C.setProperty("/todoDone", false);
		//        C.setProperty("/todoCancel", false);
		//        C.setProperty("/onEdit", "None");
		//        C.setProperty("/submitDraft", false);
		//        C.setProperty("/duplicateVisibility", false);
		//        C.setProperty("/duplicateWeekVisibility", false);
		//        C.setProperty("/overviewEdit", true);
		//        t.getTimeEntries(new Date(t.dateFrom), new Date(t.dateTo));
		//    },
		//    onSendApproval: function () {
		//        var t = this;
		//        this.showBusy();
		//        var s = this.fetchRecords(true);
		//        var a;
		//        var d;
		//        var m = $.extend(true, {}, this.oDataModel);
		//        var c = this.getModel("controls");
		//        this.batches = s;
		//        var P;
		//        m.setChangeBatchGroups({
		//            "*": {
		//                groupId: "TimeEntry",
		//                changeSetId: "TimeEntry",
		//                single: true
		//            }
		//        });
		//        m.setDeferredGroups(["TimeEntry"]);
		//        m.refreshSecurityToken(function (b) {
		//            if (s.length === 0) {
		//                t.hideBusy(true);
		//                var f = t.oBundle.getText("noEntriesToSubmit");
		//                sap.m.MessageToast.show(f, { duration: 3000 });
		//                return;
		//            }
		//            for (var i = 0; i < s.length; i++) {
		//                var j = {
		//                    properties: s[i],
		//                    changeSetId: "TimeEntry",
		//                    groupId: "TimeEntry"
		//                };
		//                m.createEntry("/TimeEntryCollection", j);
		//            }
		//            m.submitChanges({
		//                groupId: "TimeEntry",
		//                changeSetId: "TimeEntry",
		//                success: function (b, r) {
		//                    if (t.oMessagePopover) {
		//                        t.oMessagePopover.destroy();
		//                        sap.ui.getCore().getMessageManager().removeAllMessages();
		//                    }
		//                    var k = false;
		//                    var q = t.getModel("TimeData").getData();
		//                    var u = [];
		//                    if (!b.__batchResponses[0].__changeResponses) {
		//                        sap.ui.getCore().getMessageManager().removeAllMessages();
		//                        sap.ui.getCore().getMessageManager().addMessages(new sap.ui.core.message.Message({
		//                            message: JSON.parse(b.__batchResponses[0].response.body).error.message.value,
		//                            description: JSON.parse(b.__batchResponses[0].response.body).error.message.value,
		//                            type: sap.ui.core.MessageType.Error,
		//                            processor: t.getOwnerComponent().oMessageProcessor,
		//                            code: "TimeData"
		//                        }));
		//                        t.hideBusy(true);
		//                        return;
		//                    } else {
		//                        for (var i = 0; i < b.__batchResponses[0].__changeResponses.length; i++) {
		//                            var v = $.grep(q, function (w, x) {
		//                                if (w.RecRowNo) {
		//                                    return w.RecRowNo === parseInt(b.__batchResponses[0].__changeResponses[i].data.RecRowNo).toString();
		//                                }
		//                            });
		//                            if (b.__batchResponses[0].__changeResponses[i].data.ErrorMsg !== "") {
		//                                k = true;
		//                                if (v.length > 0) {
		//                                    v[0].valueState = "Error";
		//                                    v[0].highlight = "Error";
		//                                    v[0].valueStateText = b.__batchResponses[0].__changeResponses[i].data.ErrorMsg;
		//                                    u.push(new sap.ui.core.message.Message({
		//                                        message: b.__batchResponses[0].__changeResponses[i].data.ErrorMsg,
		//                                        description: b.__batchResponses[0].__changeResponses[i].data.ErrorMsg,
		//                                        type: sap.ui.core.MessageType.Error,
		//                                        processor: t.getOwnerComponent().oMessageProcessor,
		//                                        additionalText: parseInt(b.__batchResponses[0].__changeResponses[i].data.RecRowNo),
		//                                        code: "TimeData"
		//                                    }));
		//                                }
		//                            } else {
		//                                if (v.length > 0) {
		//                                    v[0].valueState = "Success";
		//                                    v[0].highlight = "Success";
		//                                }
		//                            }
		//                        }
		//                    }
		//                    sap.ui.getCore().getMessageManager().addMessages(u);
		//                    t.getModel("TimeData").updateBindings();
		//                    if (!k) {
		//                        var f = t.oBundle.getText("timeEntriesSaved");
		//                        sap.m.MessageToast.show(f, { duration: 1000 });
		//                        t.getTimeEntries(new Date(t.minDate), new Date(t.maxDate));
		//                        t.getToDoList();
		//                        sap.ui.getCore().getMessageManager().removeAllMessages();
		//                        var d = [];
		//                        var m = new J();
		//                        m.setData(d);
		//                        t.setModel(m, "deleteRecords");
		//                        t.setModel(m, "changedRecords");
		//                        t.setModel(m, "newRecords");
		//                        if (t.oReadOnlyTemplate) {
		//                            t.rebindTableWithTemplate(t.oTable, "TimeData>/", t.oReadOnlyTemplate, "Navigation");
		//                        }
		//                        c.setProperty("/overviewEdit", true);
		//                        c.setProperty("/overviewCancel", false);
		//                        c.setProperty("/submitDraft", false);
		//                        c.setProperty("/sendForApproval", false);
		//                        c.setProperty("/duplicateVisibility", false);
		//                        c.setProperty("/showFooter", false);
		//                        c.setProperty("/duplicateWeekVisibility", false);
		//                        c.setProperty("/onEdit", "None");
		//                        c.setProperty("/overviewDataChanged", false);
		//                        c.setProperty("/isOverviewChanged", false);
		//                        t.setModel(c, "controls");
		//                        t.calculateChangeCount();
		//                    }
		//                    t.hideBusy(true);
		//                },
		//                error: function (E) {
		//                    t.hideBusy(true);
		//                    t.oErrorHandler.processError(E);
		//                }
		//            });
		//        }, true);
		//        m.attachBatchRequestCompleted(this.onSubmissionSuccess.bind(this));
		//        m.attachBatchRequestFailed(function () {
		//            t.handleMessagePopover(new sap.m.Button());
		//        });
		//    },
		//    onSubmitDraft: function () {
		//        var t = this;
		//        var s = this.fetchRecords(false);
		//        var a;
		//        var m = $.extend(true, {}, this.oDataModel);
		//        var c = this.getModel("controls");
		//        this.batches = s;
		//        m.setChangeBatchGroups({
		//            "*": {
		//                groupId: "TimeEntry",
		//                changeSetId: "TimeEntry",
		//                single: false
		//            }
		//        });
		//        m.setDeferredGroups(["TimeEntry"]);
		//        m.refreshSecurityToken(function (d) {
		//            for (var i = 0; i < s.length; i++) {
		//                var b = {
		//                    properties: s[i],
		//                    changeSetId: "TimeEntry",
		//                    groupId: "TimeEntry"
		//                };
		//                m.createEntry("/TimeEntryCollection", b);
		//            }
		//            m.submitChanges({
		//                groupId: "TimeEntry",
		//                changeSetId: "TimeEntry",
		//                success: function (d, r) {
		//                    if (!d.__batchResponses[0].__changeResponses) {
		//                        return;
		//                    }
		//                    var f = t.oBundle.getText("timeEntriesSaved");
		//                    sap.m.MessageToast.show(f, { duration: 1000 });
		//                    t.getTimeEntries(new Date(t.dateFrom), new Date(t.dateTo));
		//                    sap.ui.getCore().getMessageManager().removeAllMessages();
		//                    var j = [];
		//                    var m = new J();
		//                    m.setData(j);
		//                    t.setModel(m, "deleteRecords");
		//                    t.setModel(m, "changedRecords");
		//                    t.setModel(m, "newRecords");
		//                    if (t.oReadOnlyTemplate) {
		//                        t.rebindTableWithTemplate(t.oTable, "TimeData>/", t.oReadOnlyTemplate, "Navigation");
		//                    }
		//                    c.setProperty("/overviewEdit", true);
		//                    c.setProperty("/overviewCancel", false);
		//                    c.setProperty("/submitDraft", false);
		//                    c.setProperty("/showFooter", false);
		//                    c.setProperty("/sendForApproval", false);
		//                    c.setProperty("/duplicateVisibility", false);
		//                    c.setProperty("/duplicateWeekVisibility", false);
		//                    c.setProperty("/onEdit", "None");
		//                    t.setModel(c, "controls");
		//                },
		//                error: function (E) {
		//                    t.oErrorHandler.processError(E);
		//                }
		//            });
		//        }, true);
		//        m.attachBatchRequestCompleted(this.onSubmissionSuccess.bind(this));
		//    },
		//    onSubmissionSuccess: function () {
		//    },
		//    fetchRecords: function (r) {
		//        var t = [];
		//        var d = this.getModel("deleteRecords").getData();
		//        var a = this.getModel("TimeData").getData();
		//        var b = $.grep(a, function (j, k) {
		//            return j.TimeEntryOperation == "C";
		//        });
		//        var c = $.grep(a, function (j, k) {
		//            return j.TimeEntryOperation == "U";
		//        });
		//        var s = $.grep(a, function (j, k) {
		//            return j.TimeEntryOperation == "R";
		//        });
		//        for (var i = 0; i < c.length; i++) {
		//            c[i].TimeEntryOperation = "U";
		//            if (c[i].SetDraft) {
		//                c[i].AllowRelease = "";
		//            } else {
		//                c[i].AllowRelease = "X";
		//            }
		//        }
		//        for (var i = 0; i < b.length; i++) {
		//            b[i].TimeEntryOperation = "C";
		//            if (b[i].SetDraft) {
		//                b[i].AllowRelease = "";
		//            } else {
		//                b[i].AllowRelease = "X";
		//            }
		//        }
		//        for (var i = 0; i < d.length; i++) {
		//            d[i].TimeEntryOperation = "D";
		//            if (d[i].SetDraft) {
		//                d[i].AllowRelease = "";
		//            } else {
		//                d[i].AllowRelease = "X";
		//            }
		//        }
		//        if (d.length > 0) {
		//            for (var i = 0; i < d.length; i++) {
		//                t.push(d[i]);
		//            }
		//        }
		//        if (c.length > 0) {
		//            for (var i = 0; i < c.length; i++) {
		//                t.push(c[i]);
		//            }
		//        }
		//        if (b.length > 0) {
		//            for (var i = 0; i < b.length; i++) {
		//                t.push(b[i]);
		//            }
		//        }
		//        for (var i = 0; i < t.length; i++) {
		//            t[i].RecRowNo = (i + 1).toString();
		//            if (t[i].TimeEntryDataFields.CATSHOURS === "") {
		//                t[i].TimeEntryDataFields.CATSHOURS = "0.00";
		//            }
		//        }
		//        var f = $.extend(true, [], t);
		//        for (var i = 0; i < f.length; i++) {
		//            delete f[i].target;
		//            delete f[i].totalHours;
		//            delete f[i].addButton;
		//            delete f[i].addButtonEnable;
		//            delete f[i].deleteButtonEnable;
		//            delete f[i].deleteButton;
		//            delete f[i].TimeEntryDataFields.ERSDA;
		//            delete f[i].TimeEntryDataFields.LAEDA;
		//            delete f[i].TimeEntryDataFields.LAETM;
		//            delete f[i].TimeEntryDataFields.ERSTM;
		//            delete f[i].TimeEntryDataFields.APDAT;
		//            delete f[i].HeaderData;
		//            delete f[i].highlight;
		//            delete f[i].SetDraft;
		//            delete f[i].valueStateText;
		//            delete f[i].valueState;
		//            f[i].TimeEntryDataFields.WORKDATE = this.formatter.formatToBackendString(f[i].TimeEntryDataFields.WORKDATE) + "T00:00:00";
		//            f[i].TimeEntryDataFields.CATSHOURS = parseFloat(f[i].TimeEntryDataFields.CATSHOURS).toFixed(2);
		//        }
		//        return f;
		//    },
		//    fetchToDoRecords: function () {
		//        var t = [];
		//        var a = this.getModel("TodoList").getData();
		//        var b = $.grep(a, function (f, j) {
		//            return f.TimeEntryOperation == "C";
		//        });
		//        var c = $.grep(a, function (f, j) {
		//            return f.TimeEntryOperation == "U";
		//        });
		//        for (var i = 0; i < c.length; i++) {
		//            c[i].TimeEntryOperation = "U";
		//            c[i].AllowRelease = "X";
		//        }
		//        for (var i = 0; i < b.length; i++) {
		//            b[i].TimeEntryOperation = "C";
		//            b[i].AllowRelease = "X";
		//        }
		//        if (c.length > 0) {
		//            for (var i = 0; i < c.length; i++) {
		//                t.push(c[i]);
		//            }
		//        }
		//        if (b.length > 0) {
		//            for (var i = 0; i < b.length; i++) {
		//                t.push(b[i]);
		//            }
		//        }
		//        for (var i = 0; i < t.length; i++) {
		//            t[i].RecRowNo = (i + 1).toString();
		//            if (t[i].TimeEntryDataFields.CATSHOURS === "") {
		//                t[i].TimeEntryDataFields.CATSHOURS = "0.00";
		//            }
		//        }
		//        var d = $.extend(true, [], t);
		//        for (var i = 0; i < d.length; i++) {
		//            delete d[i].target;
		//            delete d[i].total;
		//            delete d[i].addButton;
		//            delete d[i].addButtonEnable;
		//            delete d[i].deleteButtonEnable;
		//            delete d[i].deleteButton;
		//            delete d[i].TimeEntryDataFields.ERSDA;
		//            delete d[i].TimeEntryDataFields.LAEDA;
		//            delete d[i].TimeEntryDataFields.LAETM;
		//            delete d[i].TimeEntryDataFields.ERSTM;
		//            delete d[i].TimeEntryDataFields.APDAT;
		//            delete d[i].HeaderData;
		//            delete d[i].highlight;
		//            delete d[i].SetDraft;
		//            delete d[i].valueStateText;
		//            delete d[i].valueState;
		//            delete d[i].missing;
		//            delete d[i].currentMissing;
		//            delete d[i].sendButton;
		//            delete d[i].total;
		//            d[i].TimeEntryDataFields.WORKDATE = this.formatter.formatToBackendString(d[i].TimeEntryDataFields.WORKDATE) + "T00:00:00";
		//            d[i].TimeEntryDataFields.CATSHOURS = parseFloat(d[i].TimeEntryDataFields.CATSHOURS).toFixed(2);
		//        }
		//        return d;
		//    },
		//    onShareInJamPress: function () {
		//    },
		//    onSearch: function (E) {
		//    },
		//    onRefresh: function () {
		//    },
		//    _showObject: function (i) {
		//    },
		//    onAssignmentsLoaded: function (E) {
		//        var t = this;
		//        this.empID = E.getParameter("defaultAssignment");
		//        this.setPernr(this.empID);
		//        this.initPernr(this.empID);
		//        this.showBusy();
		//        this.getFieldTexts("UNIT");
		//        this.getEmployeeDetails(this.empID);
		//        new Promise(function (r, R) {
		//            t.getProfileFields(t.empID);
		//            t.getWorklistFields(t.empID);
		//            r(t.getTasks(true));
		//            R();
		//        });
		//        this.getTimeEntries(t.dateFrom, t.dateTo);
		//        this.getToDoList();
		//    },
		//    onAssignmentSwitch: function (E) {
		//        var t = this;
		//        this.empID = E.getParameter("selectedAssignment");
		//        this.setPernr(this.empID);
		//        this.initPernr(this.empID);
		//        this.getTimeEntries(this.dateFrom, this.dateTo);
		//        this.getEmployeeDetails(this.empID);
		//        this.getToDoList();
		//        new Promise(function (r, R) {
		//            t.getProfileFields(t.empID);
		//            t.getWorklistFields(t.empID);
		//            r(t.getTasks(true));
		//            R();
		//        });
		//    },
		//    getEmployeeDetails: function (a) {
		//        var t = this;
		//        var m = new J();
		//        var f = [];
		//        var c = new sap.ui.model.Filter({
		//            path: "EmployeeNumber",
		//            operator: sap.ui.model.FilterOperator.EQ,
		//            value1: this.empID
		//        });
		//        f.push(c);
		//        this.oCEModel.createKey("EmployeeDetailSet", {
		//            EmployeeNumber: a,
		//            ApplicationId: "CATS"
		//        });
		//        var P = {
		//            filters: f,
		//            success: function (d, r) {
		//                m.setData(d.results[0]);
		//                t.setModel(m, "libCommon");
		//            },
		//            error: function (E) {
		//                t.oErrorHandler.processError(E);
		//            }
		//        };
		//        this.oCEModel.read("/EmployeeDetailSet", P);
		//    },
		//    onTaskAll: function (E) {
		//        var f = [];
		//        this.oTaskTable.getBinding("items").filter(f);
		//    },
		//    onTaskActive: function (E) {
		//        var f = [];
		//        var s = true;
		//        f.push(new F("AssignmentStatus", g.EQ, s));
		//        this.oTaskTable.getBinding("items").filter(f);
		//    },
		//    onTaskInactive: function (E) {
		//        var f = [];
		//        var s = false;
		//        f.push(new F("AssignmentStatus", g.EQ, s));
		//        this.oTaskTable.getBinding("items").filter(f);
		//    },
		//    worklistRouteMatched: function (E) {
		//        var m = this.getGlobalModel("TaskReload");
		//        var c = this.getGlobalModel("controls");
		//        if (m) {
		//            var t = m.getData();
		//            if (t.reloadTasks) {
		//                var a = this.oBundle.getText("taskSaved");
		//                this.getTasks(false);
		//                sap.m.MessageToast.show(a, { duration: 5000 });
		//                t.reloadTasks = false;
		//            }
		//        }
		//        if (c && c.getProperty("/groupReload") === true) {
		//            var a = this.oBundle.getText("performGroup");
		//            this.getTasks(false);
		//            sap.m.MessageToast.show(a, { duration: 5000 });
		//            c.setProperty("/groupReload", false);
		//        }
		//    },
		//    onMenuAction: function (E) {
		//        if (E.getParameter("item").getKey() === "selectFromWorklist") {
		//            this.onImportWorklist();
		//        } else if (E.getParameter("item").getKey() === "selectFromAdminlist") {
		//            this.onImportAdminlist();
		//        } else if (E.getParameter("item").getKey() === "selectFromAssignment") {
		//            this.onTaskCreate(E);
		//        } else if (E.getParameter("item").getKey() === "selectFromGroups") {
		//            this.onCreateGroup(E);
		//        }
		//    },
		//    onImportWorklist: function (E) {
		//        var t = this;
		//        this.showBusy();
		//        var m = new J();
		//        var w = {};
		//        var a = [];
		//        var d;
		//        var P = {
		//            success: function (b, r) {
		//                m.setData(b.results);
		//                d = b.results;
		//                var c = t.getModel("WorklistProfileFields").getData();
		//                for (var j = 0; j < d.length; j++) {
		//                    for (var i = 0; i < c.length; i++) {
		//                        if (d[j].WorkListDataFields[c[i].FieldName] !== undefined) {
		//                            w[c[i].FieldName] = d[j].WorkListDataFields[c[i].FieldName];
		//                        } else {
		//                            w[c[i].FieldName] = "";
		//                        }
		//                    }
		//                    var f = $.extend(true, {}, w);
		//                    a.push(f);
		//                    m.setData(a);
		//                    t.setModel(m, "WorklistFields");
		//                }
		//                t.worklistPopover();
		//                t.hideBusy(true);
		//            },
		//            error: function (b) {
		//                t.hideBusy(true);
		//                t.oErrorHandler.processError(b);
		//            }
		//        };
		//        this.oDataModel.read("/WorkListCollection", P);
		//    },
		//    onImportAdminlist: function (E) {
		//        var t = this;
		//        this.showBusy();
		//        var m = new sap.ui.model.json.JSONModel();
		//        var A = new sap.ui.model.json.JSONModel();
		//        var k;
		//        var q = [];
		//        var r = {};
		//        var a = new sap.ui.model.Filter({
		//            path: "Pernr",
		//            operator: sap.ui.model.FilterOperator.EQ,
		//            value1: this.empID
		//        });
		//        var b = new sap.ui.model.Filter({
		//            path: "ValidityStartDate",
		//            operator: sap.ui.model.FilterOperator.EQ,
		//            value1: new Date()
		//        });
		//        var c = new sap.ui.model.Filter({
		//            path: "ValidityEndDate",
		//            operator: sap.ui.model.FilterOperator.EQ,
		//            value1: new Date()
		//        });
		//        var d = new sap.ui.model.Filter({
		//            path: "AdminAssignmentFlag",
		//            operator: sap.ui.model.FilterOperator.EQ,
		//            value1: "X"
		//        });
		//        var f = [];
		//        f.push(b);
		//        f.push(c);
		//        f.push(a);
		//        f.push(d);
		//        var P = {
		//            filters: f,
		//            success: function (s, R) {
		//                t.adminTasks = s.results;
		//                m.setData(t.adminTasks);
		//                t.setModel(m, "AdminTasks");
		//                if (t.adminTasks.length === 0) {
		//                    t.noAssignmentsDialog();
		//                }
		//                for (var j = 0; j < t.adminTasks.length; j++) {
		//                    for (var i = 0; i < t.profileFields.length; i++) {
		//                        if (t.profileFields[i].FieldName === "APPROVER" || t.profileFields[i].FieldName === "AssignmentStatus" || t.profileFields[i].FieldName === "AssignmentName" || t.profileFields[i].FieldName === "ValidityStartDate" || t.profileFields[i].FieldName === "ValidityEndDate") {
		//                            if (t.profileFields[i].FieldName === "AssignmentStatus") {
		//                                r[t.profileFields[i].FieldName] = t.adminTasks[j][t.profileFields[i].FieldName] === "1" ? true : false;
		//                            } else if (t.profileFields[i].FieldName === "ValidityStartDate") {
		//                                r[t.profileFields[i].FieldName] = t.formatter.dateStringFormat2(t.adminTasks[j][t.profileFields[i].FieldName]);
		//                            } else if (t.profileFields[i].FieldName === "ValidityEndDate") {
		//                                r[t.profileFields[i].FieldName] = t.formatter.dateStringFormat2(t.adminTasks[j][t.profileFields[i].FieldName]);
		//                            } else if (t.profileFields[i].FieldName === "APPROVER") {
		//                                r["APPROVER"] = t.adminTasks[j].ApproverName;
		//                            } else {
		//                                r[t.profileFields[i].FieldName] = t.adminTasks[j][t.profileFields[i].FieldName];
		//                            }
		//                        } else {
		//                            r[t.profileFields[i].FieldName] = t.adminTasks[j].AssignmentFields[t.profileFields[i].FieldName];
		//                            t.getFieldTexts(t.profileFields[i].FieldName);
		//                        }
		//                    }
		//                    var u = $.extend(true, {}, r);
		//                    q.push(u);
		//                }
		//                A.setData(q);
		//                t.setModel(A, "AdminTaskFields");
		//                t.adminlistPopover();
		//                t.hideBusy(true);
		//            },
		//            error: function (i) {
		//                t.hideBusy(true);
		//                t.oErrorHandler.processError(i);
		//            }
		//        };
		//        this.oDataModel.read("/AssignmentCollection", P);
		//    },
		//    getWorklistFields: function (P) {
		//        var t = this;
		//        var m = new sap.ui.model.json.JSONModel();
		//        var a = new sap.ui.model.Filter({
		//            path: "Pernr",
		//            operator: sap.ui.model.FilterOperator.EQ,
		//            value1: P
		//        });
		//        var b = new sap.ui.model.Filter({
		//            path: "SelWorkList",
		//            operator: sap.ui.model.FilterOperator.EQ,
		//            value1: "X"
		//        });
		//        var f = [];
		//        f.push(a);
		//        f.push(b);
		//        var c = {
		//            filters: f,
		//            success: function (d, r) {
		//                var w = $.extend(true, [], d.results);
		//                t.readOnlyTemplate();
		//                var i = [];
		//                i.FieldName = "NAME";
		//                i.FieldLength = 30;
		//                i.FieldType = "C";
		//                i.IsReadOnly = "FALSE";
		//                i.SelWorkList = "X";
		//                i.FieldLabel = t.oBundle.getText("name");
		//                w.splice(0, 0, i);
		//                var j = [];
		//                j.FieldName = "RANGE";
		//                j.FieldLabel = t.oBundle.getText("validPeriod");
		//                j.IsReadOnly = "FALSE";
		//                j.SelWorkList = "X";
		//                w.splice(1, 0, j);
		//                m.setData(w);
		//                t.setModel(m, "WorklistProfileFields");
		//            },
		//            error: function (E) {
		//                t.oErrorHandler.processError(E);
		//            }
		//        };
		//        this.oDataModel.read("/ProfileFieldCollection", c);
		//    },
		//    worklistPopover: function () {
		//        var t = this;
		//        var d = {
		//            handleClose: function (a) {
		//                t._oPopover.close();
		//                t._oPopover.destroy();
		//            },
		//            handleConfirm: function (a) {
		//                var b = {
		//                    ApproverId: "",
		//                    ApproverName: "",
		//                    AssignmentFields: {
		//                        AENAM: "",
		//                        ALLDF: "",
		//                        APDAT: null,
		//                        APNAM: "",
		//                        ARBID: "",
		//                        ARBPL: "",
		//                        AUERU: "",
		//                        AUFKZ: "",
		//                        AUTYP: "",
		//                        AWART: "",
		//                        BEGUZ: "",
		//                        BELNR: "",
		//                        BEMOT: "",
		//                        BUDGET_PD: "",
		//                        BUKRS: "",
		//                        BWGRL: "0.0",
		//                        CATSAMOUNT: "0.0",
		//                        CATSHOURS: "0.00",
		//                        CATSQUANTITY: "0.0",
		//                        CPR_EXTID: "",
		//                        CPR_GUID: "",
		//                        CPR_OBJGEXTID: "",
		//                        CPR_OBJGUID: "",
		//                        CPR_OBJTYPE: "",
		//                        ENDUZ: "",
		//                        ERNAM: "",
		//                        ERSDA: null,
		//                        ERSTM: "",
		//                        ERUZU: "",
		//                        EXTAPPLICATION: "",
		//                        EXTDOCUMENTNO: "",
		//                        EXTSYSTEM: "",
		//                        FUNC_AREA: "",
		//                        FUND: "",
		//                        GRANT_NBR: "",
		//                        HRBUDGET_PD: "",
		//                        HRCOSTASG: "",
		//                        HRFUNC_AREA: "",
		//                        HRFUND: "",
		//                        HRGRANT_NBR: "",
		//                        HRKOSTL: "",
		//                        HRLSTAR: "",
		//                        KAPAR: "",
		//                        KAPID: "",
		//                        KOKRS: "",
		//                        LAEDA: null,
		//                        LAETM: "",
		//                        LGART: "",
		//                        LOGSYS: "",
		//                        LONGTEXT: "",
		//                        LONGTEXT_DATA: "",
		//                        LSTAR: "",
		//                        LSTNR: "",
		//                        LTXA1: "",
		//                        MEINH: "",
		//                        OFMNW: "0.0",
		//                        OTYPE: "",
		//                        PAOBJNR: "",
		//                        PEDD: null,
		//                        PERNR: "",
		//                        PLANS: "",
		//                        POSID: "",
		//                        PRAKN: "",
		//                        PRAKZ: "",
		//                        PRICE: "0.0",
		//                        RAPLZL: "",
		//                        RAUFNR: "",
		//                        RAUFPL: "",
		//                        REASON: "",
		//                        REFCOUNTER: "",
		//                        REINR: "",
		//                        RKDAUF: "",
		//                        RKDPOS: "",
		//                        RKOSTL: "",
		//                        RKSTR: "",
		//                        RNPLNR: "",
		//                        RPROJ: "",
		//                        RPRZNR: "",
		//                        SBUDGET_PD: "",
		//                        SEBELN: "",
		//                        SEBELP: "",
		//                        SKOSTL: "",
		//                        SPLIT: 0,
		//                        SPRZNR: "",
		//                        STATKEYFIG: "",
		//                        STATUS: "",
		//                        S_FUNC_AREA: "",
		//                        S_FUND: "",
		//                        S_GRANT_NBR: "",
		//                        TASKCOMPONENT: "",
		//                        TASKCOUNTER: "",
		//                        TASKLEVEL: "",
		//                        TASKTYPE: "",
		//                        TCURR: "",
		//                        TRFGR: "",
		//                        TRFST: "",
		//                        UNIT: "",
		//                        UVORN: "",
		//                        VERSL: "",
		//                        VORNR: "",
		//                        VTKEN: "",
		//                        WABLNR: "",
		//                        WAERS: "",
		//                        WERKS: "",
		//                        WORKDATE: null,
		//                        WORKITEMID: "",
		//                        WTART: ""
		//                    },
		//                    AssignmentId: "",
		//                    AssignmentName: "",
		//                    AssignmentOperation: "C",
		//                    AssignmentStatus: "",
		//                    Counter: "",
		//                    Pernr: t.empID,
		//                    ProfileId: "",
		//                    ValidityStartDate: "",
		//                    ValidityEndDate: ""
		//                };
		//                var s = [];
		//                var c = 0;
		//                var w = t.byId("worklistTableId");
		//                var I = w.getItems();
		//                var f = "";
		//                for (var i = 0; i < I.length; i++) {
		//                    if (I[i].getProperty("selected") == true) {
		//                        c++;
		//                        for (var j = 0; j < t.profileFields.length - 2; j++) {
		//                            if (I[i].getCells()[j].getCustomData()[0].getValue() == "NAME") {
		//                                if (I[i].getCells()[j].getValue() === "") {
		//                                    I[i].getCells()[j].setValueState(sap.ui.core.ValueState.Error);
		//                                    f = "X";
		//                                }
		//                                b["AssignmentName"] = I[i].getCells()[j].getValue();
		//                            } else if (I[i].getCells()[j].getCustomData()[0].getValue() == "APPROVER") {
		//                                b["ApproverName"] = I[i].getCells()[j].getValue();
		//                            } else if (I[i].getCells()[j].getCustomData()[0].getValue() == "AssignmentStatus") {
		//                                b["AssignmentStatus"] = I[i].getCells()[j].getValue() ? "1" : "";
		//                            } else if (I[i].getCells()[j].getCustomData()[0].getValue() == "RANGE") {
		//                                b["ValidityStartDate"] = t.formatter.formatToBackendString(I[i].getCells()[j].getDateValue()) + "T00:00:00";
		//                                b["ValidityEndDate"] = t.formatter.formatToBackendString(I[i].getCells()[j].getSecondDateValue()) + "T00:00:00";
		//                            } else if (I[i].getCells()[j].getCustomData()[0].getValue() == "CPR_TEXT") {
		//                            } else if (I[i].getCells()[j].getCustomData()[0].getValue() == "CPR_OBJTEXT") {
		//                            } else {
		//                                b.AssignmentFields[I[i].getCells()[j].getCustomData()[0].getValue()] = I[i].getCells()[j].getText();
		//                            }
		//                            if (b.AssignmentFields.BWGRL === "") {
		//                                b.AssignmentFields.BWGRL = "0.00";
		//                            }
		//                            if (b.AssignmentFields.PRICE === "") {
		//                                b.AssignmentFields.PRICE = "0.00";
		//                            }
		//                            if (b.AssignmentFields.OFMNW === "") {
		//                                b.AssignmentFields.OFMNW = "0.00";
		//                            }
		//                            if (b.AssignmentFields.PEDD !== null) {
		//                                b.AssignmentFields.PEDD = this.formatter.formatToBackendString(new Date(b.AssignmentFields.PEDD)) + "T00:00:00";
		//                            }
		//                        }
		//                        var k = $.extend(true, {}, b);
		//                        s.push(k);
		//                    }
		//                }
		//                if (c < 1) {
		//                    var m = t.oBundle.getText("noSelectionMade");
		//                    sap.m.MessageToast.show(m, { duration: 3000 });
		//                } else if (f === "X") {
		//                    var q = t.oBundle.getText("fillRequiredEntries");
		//                    sap.m.MessageToast.show(q, { duration: 3000 });
		//                } else {
		//                    t.performImportAssignments(s);
		//                    t._oPopover.close();
		//                    t._oPopover.destroy();
		//                }
		//            },
		//            onNavBack: function (a) {
		//                var N = l.byId(t.getView().getId(), "NavC");
		//                N.back();
		//            },
		//            onValueHelp: this.onValueHelp.bind(this),
		//            switchState: this.formatter.switchState.bind(this),
		//            dynamicBindingColumnsWorklist: this.dynamicBindingColumnsWorklist.bind(this),
		//            dynamicBindingRowsWorklist: this.dynamicBindingRowsWorklist.bind(this)
		//        };
		//        this._oPopover = sap.ui.xmlfragment(this.getView().getId(), "hcm.fab.mytimesheet.view.fragments.WorklistPopover", d);
		//        this.getView().addDependent(this._oPopover);
		//        jQuery.sap.delayedCall(0, this, function () {
		//            this._oPopover.open();
		//        });
		//    },
		//    adminlistPopover: function () {
		//        var t = this;
		//        var d = {
		//            handleClose: function (a) {
		//                t._oAdminlistPopover.close();
		//                t._oAdminlistPopover.destroy();
		//            },
		//            handleConfirm: function (a) {
		//                var b = {
		//                    ApproverId: "",
		//                    ApproverName: "",
		//                    AssignmentFields: {
		//                        AENAM: "",
		//                        ALLDF: "",
		//                        APDAT: null,
		//                        APNAM: "",
		//                        ARBID: "",
		//                        ARBPL: "",
		//                        AUERU: "",
		//                        AUFKZ: "",
		//                        AUTYP: "",
		//                        AWART: "",
		//                        BEGUZ: "",
		//                        BELNR: "",
		//                        BEMOT: "",
		//                        BUDGET_PD: "",
		//                        BUKRS: "",
		//                        BWGRL: "0.0",
		//                        CATSAMOUNT: "0.0",
		//                        CATSHOURS: "0.00",
		//                        CATSQUANTITY: "0.0",
		//                        CPR_EXTID: "",
		//                        CPR_GUID: "",
		//                        CPR_OBJGEXTID: "",
		//                        CPR_OBJGUID: "",
		//                        CPR_OBJTYPE: "",
		//                        ENDUZ: "",
		//                        ERNAM: "",
		//                        ERSDA: null,
		//                        ERSTM: "",
		//                        ERUZU: "",
		//                        EXTAPPLICATION: "",
		//                        EXTDOCUMENTNO: "",
		//                        EXTSYSTEM: "",
		//                        FUNC_AREA: "",
		//                        FUND: "",
		//                        GRANT_NBR: "",
		//                        HRBUDGET_PD: "",
		//                        HRCOSTASG: "",
		//                        HRFUNC_AREA: "",
		//                        HRFUND: "",
		//                        HRGRANT_NBR: "",
		//                        HRKOSTL: "",
		//                        HRLSTAR: "",
		//                        KAPAR: "",
		//                        KAPID: "",
		//                        KOKRS: "",
		//                        LAEDA: null,
		//                        LAETM: "",
		//                        LGART: "",
		//                        LOGSYS: "",
		//                        LONGTEXT: "",
		//                        LONGTEXT_DATA: "",
		//                        LSTAR: "",
		//                        LSTNR: "",
		//                        LTXA1: "",
		//                        MEINH: "",
		//                        OFMNW: "0.0",
		//                        OTYPE: "",
		//                        PAOBJNR: "",
		//                        PEDD: null,
		//                        PERNR: "",
		//                        PLANS: "",
		//                        POSID: "",
		//                        PRAKN: "",
		//                        PRAKZ: "",
		//                        PRICE: "0.0",
		//                        RAPLZL: "",
		//                        RAUFNR: "",
		//                        RAUFPL: "",
		//                        REASON: "",
		//                        REFCOUNTER: "",
		//                        REINR: "",
		//                        RKDAUF: "",
		//                        RKDPOS: "",
		//                        RKOSTL: "",
		//                        RKSTR: "",
		//                        RNPLNR: "",
		//                        RPROJ: "",
		//                        RPRZNR: "",
		//                        SBUDGET_PD: "",
		//                        SEBELN: "",
		//                        SEBELP: "",
		//                        SKOSTL: "",
		//                        SPLIT: 0,
		//                        SPRZNR: "",
		//                        STATKEYFIG: "",
		//                        STATUS: "",
		//                        S_FUNC_AREA: "",
		//                        S_FUND: "",
		//                        S_GRANT_NBR: "",
		//                        TASKCOMPONENT: "",
		//                        TASKCOUNTER: "",
		//                        TASKLEVEL: "",
		//                        TASKTYPE: "",
		//                        TCURR: "",
		//                        TRFGR: "",
		//                        TRFST: "",
		//                        UNIT: "",
		//                        UVORN: "",
		//                        VERSL: "",
		//                        VORNR: "",
		//                        VTKEN: "",
		//                        WABLNR: "",
		//                        WAERS: "",
		//                        WERKS: "",
		//                        WORKDATE: null,
		//                        WORKITEMID: "",
		//                        WTART: ""
		//                    },
		//                    AssignmentId: "",
		//                    AssignmentName: "",
		//                    AssignmentOperation: "C",
		//                    AssignmentStatus: "",
		//                    Counter: "",
		//                    Pernr: t.empID,
		//                    ProfileId: "",
		//                    ValidityStartDate: "",
		//                    ValidityEndDate: ""
		//                };
		//                var s = 0;
		//                var c = [];
		//                var f = t.byId("adminlistTableId");
		//                var I = f.getItems();
		//                for (var i = 0; i < I.length; i++) {
		//                    if (I[i].getProperty("selected") == true) {
		//                        s++;
		//                        for (var j = 0; j < t.profileFields.length; j++) {
		//                            if (I[i].getCells()[j].getCustomData()[0].getValue() == "AssignmentName") {
		//                                b["AssignmentName"] = I[i].getCells()[j].getText();
		//                            } else if (I[i].getCells()[j].getCustomData()[0].getValue() == "APPROVER") {
		//                                b["ApproverName"] = I[i].getCells()[j].getText();
		//                            } else if (I[i].getCells()[j].getCustomData()[0].getValue() == "AssignmentStatus") {
		//                                b["AssignmentStatus"] = I[i].getCells()[j].getText() === "Active" ? "1" : "";
		//                            } else if (I[i].getCells()[j].getCustomData()[0].getValue() == "ValidityStartDate") {
		//                                b["ValidityStartDate"] = t.formatter.formatToBackendString(I[i].getCells()[j].getText()) + "T00:00:00";
		//                            } else if (I[i].getCells()[j].getCustomData()[0].getValue() == "ValidityEndDate") {
		//                                b["ValidityEndDate"] = t.formatter.formatToBackendString(I[i].getCells()[j].getText()) + "T00:00:00";
		//                            } else if (I[i].getCells()[j].getCustomData()[0].getValue() == "CPR_TEXT") {
		//                            } else if (I[i].getCells()[j].getCustomData()[0].getValue() == "CPR_OBJTEXT") {
		//                            } else {
		//                                if (I[i].getCells()[j].getCustomData()[2]) {
		//                                    b.AssignmentFields[I[i].getCells()[j].getCustomData()[0].getValue()] = I[i].getCells()[j].getCustomData()[2].getValue();
		//                                } else {
		//                                    b.AssignmentFields[I[i].getCells()[j].getCustomData()[0].getValue()] = I[i].getCells()[j].getText();
		//                                }
		//                            }
		//                            if (b.AssignmentFields.BWGRL === "") {
		//                                b.AssignmentFields.BWGRL = "0.00";
		//                            }
		//                            if (b.AssignmentFields.PRICE === "") {
		//                                b.AssignmentFields.PRICE = "0.00";
		//                            }
		//                            if (b.AssignmentFields.OFMNW === "") {
		//                                b.AssignmentFields.OFMNW = "0.00";
		//                            }
		//                            if (b.AssignmentFields.PEDD !== null) {
		//                                b.AssignmentFields.PEDD = this.formatter.formatToBackendString(new Date(b.AssignmentFields.PEDD)) + "T00:00:00";
		//                            }
		//                        }
		//                        var k = $.extend(true, {}, b);
		//                        c.push(k);
		//                    }
		//                }
		//                if (s < 1) {
		//                    var m = t.oBundle.getText("noSelectionMade");
		//                    sap.m.MessageToast.show(m, { duration: 3000 });
		//                } else {
		//                    t.performImportAssignments(c);
		//                    t._oAdminlistPopover.close();
		//                    t._oAdminlistPopover.destroy();
		//                }
		//            },
		//            onNavBack: function (a) {
		//                var N = l.byId(t.getView().getId(), "NavC");
		//                N.back();
		//            },
		//            dynamicBindingColumnsAdminlist: this.dynamicBindingColumnsAdminlist.bind(this),
		//            dynamicBindingRowsAdminlist: this.dynamicBindingRowsAdminlist.bind(this)
		//        };
		//        this._oAdminlistPopover = sap.ui.xmlfragment(this.getView().getId(), "hcm.fab.mytimesheet.view.fragments.AdminlistPopover", d);
		//        this.getView().addDependent(this._oAdminlistPopover);
		//        jQuery.sap.delayedCall(0, this, function () {
		//            this._oAdminlistPopover.open();
		//        });
		//    },
		//    clockTimesPopOver: function (E) {
		//        var t = this;
		//        var d = {
		//            handleClose: function (b) {
		//                t._oPopover.close();
		//                t._oPopover.destroy();
		//            },
		//            handleOk: function (b) {
		//                var i = E.getSource().getParent().getBindingContext("TimeData").getPath().split("/")[1];
		//                var a = t.getModel("TimeData").getData();
		//                if (t.clockTimeChange) {
		//                    a[i].TimeEntryDataFields.BEGUZ = t.formatter.convertTime(E.getSource().getParent().getAggregation("content")[0].getAggregation("content")[0].getDateValue());
		//                    a[i].TimeEntryDataFields.ENDUZ = t.formatter.convertTime(E.getSource().getParent().getAggregation("content")[0].getAggregation("content")[1].getDateValue());
		//                    if (a[i].Counter !== "") {
		//                        a[i].TimeEntryOperation = "U";
		//                    } else {
		//                        a[i].TimeEntryOperation = "C";
		//                    }
		//                    var m = new J(a);
		//                    t.setModel(m, "TimeData");
		//                }
		//                t._oPopover.close();
		//                t._oPopover.destroy();
		//            },
		//            handleChange: function (E) {
		//                t.clockTimeChange = true;
		//            },
		//            formatTime: this.formatter.formatTime.bind(this)
		//        };
		//        var a = $.extend(true, [], this.getModel("TimeData").getData());
		//        var m = new J(a);
		//        this.setModel(m, "oldModel");
		//        this._oPopover = sap.ui.xmlfragment(this.getView().getId(), "hcm.fab.mytimesheet.view.fragments.ClockTimesPopOver", d);
		//        this._oPopover.bindElement("TimeData>" + E.getSource().getBindingContext("TimeData").getPath());
		//        this.getView().addDependent(this._oPopover);
		//        jQuery.sap.delayedCall(0, this, function () {
		//            this._oPopover.open(E.getSource());
		//        });
		//    },
		//    readOnlyTemplate: function () {
		//        this.oReadOnlyTemplate = new sap.m.ColumnListItem({
		//            cells: [
		//                new sap.m.ObjectStatus({
		//                    text: {
		//                        parts: [
		//                            {
		//                                path: "TimeData>totalHours",
		//                                type: "sap.ui.model.odata.type.Decimal",
		//                                formatOptions: {
		//                                    parseAsString: true,
		//                                    decimals: 2,
		//                                    maxFractionDigits: 2,
		//                                    minFractionDigits: 0
		//                                },
		//                                constraints: {
		//                                    precision: 4,
		//                                    scale: 2,
		//                                    minimum: "0",
		//                                    maximum: "10000"
		//                                }
		//                            },
		//                            {
		//                                path: "TimeData>target",
		//                                type: "sap.ui.model.odata.type.Decimal",
		//                                formatOptions: {
		//                                    parseAsString: true,
		//                                    decimals: 2,
		//                                    maxFractionDigits: 2,
		//                                    minFractionDigits: 0
		//                                },
		//                                constraints: {
		//                                    precision: 4,
		//                                    scale: 2,
		//                                    minimum: "0",
		//                                    maximum: "10000"
		//                                }
		//                            }
		//                        ],
		//                        formatter: e.concatStrings
		//                    },
		//                    visible: sap.ui.Device.system.phone ? false : true
		//                }),
		//                new sap.m.Link({
		//                    text: {
		//                        parts: [
		//                            { path: "TimeData>AssignmentName" },
		//                            { path: "TimeData>AssignmentId" },
		//                            { path: "TimeData>Counter" }
		//                        ],
		//                        formatter: this.formatter.assignmentName.bind(this)
		//                    },
		//                    press: this.onAssignmentQuickView.bind(this)
		//                }),
		//                new sap.m.ObjectNumber({
		//                    number: {
		//                        parts: [
		//                            { path: "TimeData>TimeEntryDataFields/CATSHOURS" },
		//                            { path: "TimeData>TimeEntryDataFields/CATSQUANTITY" },
		//                            { path: "TimeData>TimeEntryDataFields/CATSAMOUNT" }
		//                        ],
		//                        formatter: e.calHoursQuanAmount.bind(this)
		//                    },
		//                    unit: {
		//                        parts: [
		//                            { path: "TimeData>TimeEntryDataFields/UNIT" },
		//                            { path: "TimeData>TimeEntryDataFields/CATSHOURS" }
		//                        ],
		//                        formatter: e.getUnitTexts.bind(this)
		//                    }
		//                }),
		//                new sap.m.CheckBox({
		//                    editable: false,
		//                    visible: this.draftStatus,
		//                    selected: "{TimeData>SetDraft}"
		//                }),
		//                new sap.m.ObjectIdentifier({
		//                    text: {
		//                        path: "TimeData>TimeEntryDataFields/BEGUZ",
		//                        formatter: this.formatter.formatTime.bind(this)
		//                    },
		//                    visible: this.clockTimeVisible
		//                }),
		//                new sap.m.ObjectIdentifier({
		//                    text: {
		//                        path: "TimeData>TimeEntryDataFields/ENDUZ",
		//                        formatter: this.formatter.formatTime.bind(this)
		//                    },
		//                    visible: this.clockTimeVisible
		//                }),
		//                new sap.m.ObjectStatus({
		//                    text: {
		//                        path: "TimeData>TimeEntryDataFields/STATUS",
		//                        formatter: e.status
		//                    },
		//                    state: {
		//                        path: "TimeData>TimeEntryDataFields/STATUS",
		//                        formatter: e.state
		//                    }
		//                }),
		//                new sap.m.Button({
		//                    icon: "sap-icon://notification-2",
		//                    type: sap.m.ButtonType.Transparent,
		//                    press: this.displaylongtextPopover.bind(this),
		//                    visible: {
		//                        path: "TimeData>TimeEntryDataFields/LONGTEXT",
		//                        formatter: e.visibility
		//                    }
		//                })
		//            ],
		//            customData: [new sap.ui.core.CustomData({
		//                    key: "counter",
		//                    value: "{TimeData>Counter}"
		//                })]
		//        });
		//        this.oTable.bindItems({
		//            path: "TimeData>/",
		//            sorter: [new sap.ui.model.Sorter("HeaderData", false, true, this.compareRows)],
		//            template: this.oReadOnlyTemplate,
		//            templateShareable: true,
		//            groupHeaderFactory: this.getGroupHeader.bind(this)
		//        });
		//    },
		//    clockTimesToDoPopOver: function (E) {
		//        var t = this;
		//        var d = {
		//            handleClose: function (b) {
		//                t._oPopover.close();
		//                t._oPopover.destroy();
		//            },
		//            handleOk: function (b) {
		//                var i = E.getSource().getParent().getBindingContext("TodoList").getPath().split("/")[1];
		//                var a = t.getModel("TodoList").getData();
		//                if (t.clockTimeChange) {
		//                    a[i].TimeEntryDataFields.BEGUZ = t.formatter.convertTime(E.getSource().getParent().getAggregation("content")[0].getAggregation("content")[0].getDateValue());
		//                    a[i].TimeEntryDataFields.ENDUZ = t.formatter.convertTime(E.getSource().getParent().getAggregation("content")[0].getAggregation("content")[1].getDateValue());
		//                    if (a[i].Counter !== "") {
		//                        a[i].TimeEntryOperation = "U";
		//                    } else {
		//                        a[i].TimeEntryOperation = "C";
		//                    }
		//                    var m = new J(a);
		//                    t.setModel(m, "TodoList");
		//                }
		//                t._oPopover.close();
		//                t._oPopover.destroy();
		//            },
		//            handleChange: function (E) {
		//                t.clockTimeChange = true;
		//            },
		//            formatTime: this.formatter.formatTime.bind(this)
		//        };
		//        var a = $.extend(true, [], this.getModel("TodoList").getData());
		//        var m = new J(a);
		//        this.setModel(m, "oldModel");
		//        this._oPopover = sap.ui.xmlfragment(this.getView().getId(), "hcm.fab.mytimesheet.view.fragments.ClockTimesPopOver", d);
		//        this._oPopover.bindElement("TodoList>" + E.getSource().getBindingContext("TodoList").getPath());
		//        this.getView().addDependent(this._oPopover);
		//        jQuery.sap.delayedCall(0, this, function () {
		//            this._oPopover.open(E.getSource());
		//        });
		//    },
		//    clockTimeChange: function (E) {
		//        this.clockTimeChange = true;
		//    },
		//    showBusy: function () {
		//        this._nCounter++;
		//        if (this._nCounter === 1) {
		//            this.busyDialog.open();
		//        }
		//    },
		//    hideBusy: function (f) {
		//        if (this._nCounter === 0) {
		//            return;
		//        }
		//        this._nCounter = f ? 0 : Math.max(0, this._nCounter - 1);
		//        if (this._nCounter > 0) {
		//            return;
		//        }
		//        this.busyDialog.close();
		//    },
		//    onAssignmentPress: function (E) {
		//        var t = this;
		//        var v = this.getView();
		//        var a = this.byId("idTasks");
		//        a.setBusy(true);
		//        var m = new J();
		//        var d = this.getModel("ProfileFields").getData();
		//        var b = this.getModel("Tasks").getData();
		//        var c = parseInt(E.getSource().getBindingContext("TaskFields").getPath().split("/")[1]);
		//        var C = this.getModel("controls");
		//        var f = [];
		//        var j = [];
		//        var k = {
		//            name: null,
		//            status: false,
		//            containers: null
		//        };
		//        var A = new J();
		//        A.setData(b[c]);
		//        this.setGlobalModel(A, "selectedAssignment");
		//        C.setProperty("/createAssignment", false);
		//        C.setProperty("/editAssignment", false);
		//        C.setProperty("/displayAssignment", true);
		//        C.setProperty("/copyAssignment", false);
		//        C.setProperty("/assignmentTitle", this.oBundle.getText("displayAssignment"));
		//        this.setGlobalModel(C, "controls");
		//        var s = E.getSource().getAggregation("cells");
		//        var q = $.extend(true, [], this.getModel("ProfileFields").getData());
		//        for (var i = 0; i < s.length; i++) {
		//            var r = $.grep(q, function (u, c) {
		//                return u.FieldName == s[i].getCustomData("FieldName")[0].getValue();
		//            });
		//            if (s[i].getCustomData("FieldName")[0].getValue() !== "AssignmentStatus" && s[i].getCustomData("FieldName")[0].getValue() !== "AssignmentName" && s[i].getCustomData("FieldName")[0].getValue() !== "ValidityStartDate" && s[i].getCustomData("FieldName")[0].getValue() !== "ValidityEndDate" && s[i].getCustomData("FieldName")[0].getValue() !== "APPROVER") {
		//                if (b[c].AssignmentFields[s[i].getCustomData("FieldName")[0].getValue()] !== undefined) {
		//                    r[0].FieldValue = b[c].AssignmentFields[s[i].getCustomData("FieldName")[0].getValue()];
		//                }
		//                r[0].AssignmentId = s[i].getAggregation("customData")[1].getValue();
		//            } else {
		//                if (s[i].getCustomData("FieldName")[0].getValue() === "AssignmentStatus") {
		//                    r[0].FieldValue = s[i].getAggregation("customData")[2].getValue();
		//                    r[0].AssignmentId = s[i].getAggregation("customData")[1].getValue();
		//                } else if (s[i].getCustomData("FieldName")[0].getValue() === "AssignmentName") {
		//                    r[0].FieldValue = s[i].getText();
		//                    r[0].AssignmentId = s[i].getAggregation("customData")[1].getValue();
		//                } else if (s[i].getCustomData("FieldName")[0].getValue() === "ValidityStartDate") {
		//                    r[0].FieldValue = s[i].getText();
		//                    r[0].AssignmentId = s[i].getAggregation("customData")[1].getValue();
		//                } else if (s[i].getCustomData("FieldName")[0].getValue() === "ValidityEndDate") {
		//                    r[0].FieldValue = s[i].getText();
		//                    r[0].AssignmentId = s[i].getAggregation("customData")[1].getValue();
		//                } else if (s[i].getCustomData("FieldName")[0].getValue() === "APPROVER") {
		//                    r[0].FieldValue = b[c].ApproverId;
		//                }
		//            }
		//            if (s[i].getCustomData("FieldName")[0].getValue() !== "AssignmentName" && s[i].getCustomData("FieldName")[0].getValue() !== "AssignmentStatus" && s[i].getCustomData("FieldName")[0].getValue() !== "ValidityStartDate" && s[i].getCustomData("FieldName")[0].getValue() !== "ValidityEndDate") {
		//                f.push(r[0]);
		//            } else {
		//                if (s[i].getCustomData("FieldName")[0].getValue() === "AssignmentName") {
		//                    k.name = r[0].FieldValue;
		//                } else if (s[i].getCustomData("FieldName")[0].getValue() === "AssignmentStatus") {
		//                    k.status = r[0].FieldValue;
		//                } else if (s[i].getCustomData("FieldName")[0].getValue() === "ValidityStartDate") {
		//                    k.validFrom = new Date(r[0].FieldValue);
		//                } else if (s[i].getCustomData("FieldName")[0].getValue() === "ValidityEndDate") {
		//                    k.validTo = new Date(r[0].FieldValue);
		//                }
		//            }
		//            if ((f.length + 1) % 5 === 0 || i === s.length - 1) {
		//                j.push({ form: $.extend(true, [], f) });
		//                f = [];
		//            }
		//        }
		//        k.containers = j;
		//        m.setData(k);
		//        this.setGlobalModel(m, "EditedTask");
		//        a.setBusy(false);
		//        this.oRouter.navTo("editAssignment", {}, false);
		//    },
		//    onAssignmentWorklistPress: function (E) {
		//        var t = this;
		//        var c = E.getSource().getBindingContext();
		//        var d = this.getModel("WorklistFields").getData();
		//        var C = this.getModel("controls");
		//        var a = E.getSource().getBindingContext("WorklistFields").getPath().split("/")[1];
		//        var m = new J();
		//        var d = this.getModel("ProfileFields").getData();
		//        var b = this.getModel("WorklistFields").getData();
		//        var f = [];
		//        var j = [];
		//        var k = {
		//            name: null,
		//            status: false,
		//            containers: null
		//        };
		//        var C = this.getModel("controls");
		//        this.setGlobalModel(C, "controls");
		//        var s = E.getSource().getAggregation("cells");
		//        var q = $.extend(true, [], this.getModel("ProfileFields").getData());
		//        for (var i = 0; i < q.length; i++) {
		//            if (q[i].FieldName !== "AssignmentStatus") {
		//                if (b[a][q[i].FieldName]) {
		//                    q[i].FieldValue = b[a][q[i].FieldName];
		//                }
		//            }
		//            if (q[i].FieldName !== "AssignmentName" && q[i].FieldName !== "AssignmentStatus") {
		//                f.push(q[i]);
		//            } else {
		//                if (q[i].FieldName === "AssignmentName") {
		//                    k.name = q[i].FieldValue;
		//                } else {
		//                    k.status = q[i].FieldValue;
		//                }
		//            }
		//            if ((i + 1) % 5 === 0 || i === s.length - 1) {
		//                j.push({ form: $.extend(true, [], f) });
		//                f = [];
		//            }
		//        }
		//        k.containers = j;
		//        m.setData(k);
		//        C.setProperty("/createAssignment", false);
		//        C.setProperty("/editAssignment", false);
		//        C.setProperty("/displayAssignment", false);
		//        C.setProperty("/copyAssignment", false);
		//        C.setProperty("/importAssignment", true);
		//        C.setProperty("/assignmentTitle", this.oBundle.getText("displayAssignment"));
		//        this.setGlobalModel(C, "controls");
		//        this.setGlobalModel(m, "EditedTask");
		//        this.getRouter().navTo("editAssignment", {}, false);
		//    },
		//    onExit: function () {
		//        sap.ui.getCore().getMessageManager().removeAllMessages();
		//    },
		//    recordTemplate: function () {
		//        var t = this;
		//        var r = {
		//            AllowEdit: "",
		//            AllowRelease: "",
		//            AssignmentId: "",
		//            AssignmentName: "",
		//            CatsDocNo: "",
		//            Counter: "",
		//            Pernr: t.empID,
		//            RefCounter: "",
		//            RejReason: "",
		//            Status: "",
		//            target: "",
		//            TimeEntryDataFields: {
		//                AENAM: "",
		//                ALLDF: "",
		//                APDAT: null,
		//                APNAM: "",
		//                ARBID: "00000000",
		//                ARBPL: "",
		//                AUERU: "",
		//                AUFKZ: "",
		//                AUTYP: "00",
		//                AWART: "",
		//                BEGUZ: "000000",
		//                BELNR: "",
		//                BEMOT: "",
		//                BUDGET_PD: "",
		//                BUKRS: "",
		//                BWGRL: "0.0",
		//                CATSAMOUNT: "0.0",
		//                CATSHOURS: "0.00",
		//                CATSQUANTITY: "0.0",
		//                CPR_EXTID: "",
		//                CPR_GUID: "",
		//                CPR_OBJGEXTID: "",
		//                CPR_OBJGUID: "",
		//                CPR_OBJTYPE: "",
		//                ENDUZ: "000000",
		//                ERNAM: "",
		//                ERSDA: null,
		//                ERSTM: null,
		//                ERUZU: "",
		//                EXTAPPLICATION: "",
		//                EXTDOCUMENTNO: "",
		//                EXTSYSTEM: "",
		//                FUNC_AREA: "",
		//                FUND: "",
		//                GRANT_NBR: "",
		//                HRBUDGET_PD: "",
		//                HRCOSTASG: "0",
		//                HRFUNC_AREA: "",
		//                HRFUND: "",
		//                HRGRANT_NBR: "",
		//                HRKOSTL: "",
		//                HRLSTAR: "",
		//                KAPAR: "",
		//                KAPID: "00000000",
		//                KOKRS: "",
		//                LAEDA: null,
		//                LAETM: null,
		//                LGART: "",
		//                LOGSYS: "",
		//                LONGTEXT: "",
		//                LONGTEXT_DATA: "",
		//                LSTAR: "",
		//                LSTNR: "",
		//                LTXA1: "",
		//                MEINH: "",
		//                OFMNW: "0.0",
		//                OTYPE: "",
		//                PAOBJNR: "0000000000",
		//                PEDD: null,
		//                PERNR: "00000000",
		//                PLANS: "00000000",
		//                POSID: "",
		//                PRAKN: "",
		//                PRAKZ: "0000",
		//                PRICE: "0.0",
		//                RAPLZL: "00000000",
		//                RAUFNR: "",
		//                RAUFPL: "0000000000",
		//                REASON: "",
		//                REFCOUNTER: "000000000000",
		//                REINR: "0000000000",
		//                RKDAUF: "",
		//                RKDPOS: "000000",
		//                RKOSTL: "",
		//                RKSTR: "",
		//                RNPLNR: "",
		//                RPROJ: "00000000",
		//                RPRZNR: "",
		//                SBUDGET_PD: "",
		//                SEBELN: "",
		//                SEBELP: "00000",
		//                SKOSTL: "",
		//                SPLIT: 0,
		//                SPRZNR: "",
		//                STATKEYFIG: "",
		//                STATUS: "",
		//                S_FUNC_AREA: "",
		//                S_FUND: "",
		//                S_GRANT_NBR: "",
		//                TASKCOMPONENT: "",
		//                TASKCOUNTER: "",
		//                TASKLEVEL: "",
		//                TASKTYPE: "",
		//                TCURR: "",
		//                TRFGR: "",
		//                TRFST: "",
		//                UNIT: "",
		//                UVORN: "",
		//                VERSL: "",
		//                VORNR: "",
		//                VTKEN: "",
		//                WABLNR: "",
		//                WAERS: "",
		//                WERKS: "",
		//                WORKDATE: "",
		//                WORKITEMID: "000000000000",
		//                WTART: ""
		//            },
		//            TimeEntryOperation: ""
		//        };
		//        return r;
		//    },
		//    onEditTodoListMobile: function (E) {
		//        var t = this;
		//        var i = E.getSource().getParent().getBindingContext("TodoList").getPath().split("/")[1];
		//        var a = this.getModel("TodoList").getData();
		//        var m = new J(a[i]);
		//        this.setGlobalModel(m, "EditTodo");
		//        this.getRouter().navTo("editToDo", {}, false);
		//    },
		//    getFieldTexts: function (a) {
		//        var t = this;
		//        var b;
		//        var m = new sap.ui.model.json.JSONModel();
		//        var f = [];
		//        var c = new sap.ui.model.Filter({
		//            path: "Pernr",
		//            operator: sap.ui.model.FilterOperator.EQ,
		//            value1: this.empID
		//        });
		//        var d = new sap.ui.model.Filter({
		//            path: "FieldName",
		//            operator: sap.ui.model.FilterOperator.EQ,
		//            value1: a
		//        });
		//        f.push(c);
		//        f.push(d);
		//        var P = {
		//            urlParameters: "$expand=ValueHelpHits",
		//            filters: f,
		//            success: function (i, r) {
		//                b = i.results[0].ValueHelpHits.results;
		//                m.setData(b);
		//                t.setModel(m, a);
		//                t.setGlobalModel(m, a);
		//                t.oTaskTable.bindItems({
		//                    path: "TaskFields>/",
		//                    factory: t.dynamicBindingRows.bind(t)
		//                });
		//            },
		//            error: function (E) {
		//                t.oErrorHandler.processError(E);
		//            }
		//        };
		//        this.oDataModel.read("/ValueHelpCollection", P);
		//    },
		//    startTimeChange: function (E) {
		//        var t = this;
		//        var d = this.getModel("TimeData").getData();
		//        var i = E.getSource().getParent().getBindingContext("TimeData").getPath().split("/")[1];
		//        d[i].TimeEntryDataFields.BEGUZ = t.formatter.convertTime(E.getSource().getDateValue());
		//        if (d[i].Counter !== "") {
		//            d[i].TimeEntryOperation = "U";
		//        } else {
		//            d[i].TimeEntryOperation = "C";
		//        }
		//        var m = new J(d);
		//        t.setModel(m, "TimeData");
		//        this.getModel("controls").setProperty("/isOverviewChanged", true);
		//        this.getModel("controls").setProperty("/overviewDataChanged", true);
		//    },
		//    endTimeChange: function (E) {
		//        var t = this;
		//        var d = this.getModel("TimeData").getData();
		//        var c = this.getModel("controls");
		//        var i = E.getSource().getParent().getBindingContext("TimeData").getPath().split("/")[1];
		//        d[i].TimeEntryDataFields.ENDUZ = t.formatter.convertTime(E.getSource().getDateValue());
		//        if (d[i].Counter !== "") {
		//            d[i].TimeEntryOperation = "U";
		//        } else {
		//            d[i].TimeEntryOperation = "C";
		//        }
		//        var m = new J(d);
		//        t.setModel(m, "TimeData");
		//        this.getModel("controls").setProperty("/isOverviewChanged", true);
		//        this.getModel("controls").setProperty("/overviewDataChanged", true);
		//    },
		//    startTimeToDoChange: function (E) {
		//        var t = this;
		//        var d = this.getModel("TodoList").getData();
		//        var i = E.getSource().getParent().getBindingContext("TodoList").getPath().split("/")[1];
		//        d[i].TimeEntryDataFields.BEGUZ = t.formatter.convertTime(E.getSource().getDateValue());
		//        if (d[i].Counter !== "") {
		//            d[i].TimeEntryOperation = "U";
		//        } else {
		//            d[i].TimeEntryOperation = "C";
		//        }
		//        var m = new J(d);
		//        t.setModel(m, "TodoList");
		//    },
		//    stopTimeToDoChange: function (E) {
		//        var t = this;
		//        var d = this.getModel("TodoList").getData();
		//        var i = E.getSource().getParent().getBindingContext("TodoList").getPath().split("/")[1];
		//        d[i].TimeEntryDataFields.ENDUZ = t.formatter.convertTime(E.getSource().getDateValue());
		//        if (d[i].Counter !== "") {
		//            d[i].TimeEntryOperation = "U";
		//        } else {
		//            d[i].TimeEntryOperation = "C";
		//        }
		//        var m = new J(d);
		//        t.setModel(m, "TodoList");
		//    },
		//    noAssignmentsDialog: function () {
		//        var t = this;
		//    },
		//    handleConfirmationDiscard: function (E) {
		//        this._confirmationFunction();
		//    },
		//    showConfirmBox: function (E, a) {
		//        var t = this;
		//        var d = {
		//            handleClose: function (E) {
		//                t._oDialog.destroy();
		//            },
		//            handleConfirmationDiscard: function (E) {
		//                a();
		//                t._oDialog.destroy();
		//            }
		//        };
		//        this._oDialog = sap.ui.xmlfragment(this.getView().getId(), "hcm.fab.mytimesheet.view.fragments.CancelConfirmationPopOver", d);
		//        this.getView().addDependent(this._oDialog);
		//        this._oDialog.openBy(E.getSource());
		//    },
		//    onCancelConfirm: function (E) {
		//        var c = this.getModel("controls");
		//        if (c.getProperty("/isOverviewChanged") === true) {
		//            this.showConfirmBox(E, this.onCancel.bind(this));
		//            c.setProperty("/isOverviewChanged", false);
		//        } else {
		//            this.onCancel();
		//            c.setProperty("/isOverviewChanged", false);
		//        }
		//        c.setProperty("/overviewDataChanged", false);
		//        sap.ui.getCore().getMessageManager().removeAllMessages();
		//    },
		//    onTodoCancelConfirm: function (E) {
		//        var c = this.getModel("controls");
		//        if (c.getProperty("/isToDoChanged") === true) {
		//            this.showConfirmBox(E, this.onTodoCancel.bind(this));
		//            c.setProperty("/isToDoChanged", false);
		//        } else {
		//            this.onTodoCancel();
		//            c.setProperty("/isToDoChanged", false);
		//        }
		//        c.setProperty("/todoDataChanged", false);
		//        sap.ui.getCore().getMessageManager().removeAllMessages();
		//    },
		//    onCreateGroup: function (E) {
		//        var s = this.byId("idTasks").getSelectedContexts();
		//        var a = this.getModel("Tasks").getData();
		//        var b = {
		//            "groupId": null,
		//            "groupName": "",
		//            "count": 0,
		//            "Assignments": []
		//        };
		//        this.byId("idTasks").setBusy(true);
		//        for (var i = 0; i < s.length; i++) {
		//            var c = s[i].sPath.split("/")[1];
		//            b.Assignments.push({
		//                "AssignmentId": a[c].AssignmentId,
		//                "AssignmentName": a[c].AssignmentName,
		//                "ValidityStartDate": a[c].ValidityStartDate,
		//                "ValidityEndDate": a[c].ValidityEndDate
		//            });
		//        }
		//        var C = this.getModel("controls");
		//        C.setProperty("/displayGroup", false);
		//        C.setProperty("/GroupCancel", true);
		//        C.setProperty("/createGroup", true);
		//        C.setProperty("/displayGroupCancel", false);
		//        C.setProperty("/GroupCancel", true);
		//        this.setGlobalModel(C, "controls");
		//        this.setGlobalModel(new J(b), "createGroup");
		//        this.byId("idTasks").setBusy(false);
		//        this.getRouter().navTo("createGroup", {}, false);
		//    },
		//    getAssignmentGroups: function () {
		//        this.oTaskTable.setBusy(true);
		//        var t = this;
		//        var a = new sap.ui.model.Filter({
		//            path: "Pernr",
		//            operator: sap.ui.model.FilterOperator.EQ,
		//            value1: this.empID
		//        });
		//        var f = [];
		//        f.push(a);
		//        var P = {
		//            filters: f,
		//            urlParameters: "$expand=ToGrps",
		//            success: function (d, r) {
		//                t.tasks = d.results;
		//            },
		//            error: function (E) {
		//                t.oTaskTable.setBusy(false);
		//                t.oErrorHandler.processError(E);
		//            }
		//        };
		//        this.oDataModel.read("/AssignmentCollection", P);
		//    },
		//    onDisplayGroup: function (E) {
		//        var t = this;
		//        var c = this.getModel("controls");
		//        c.setProperty("/displayGroup", true);
		//        c.setProperty("/createGroup", false);
		//        c.setProperty("/editGroup", false);
		//        c.setProperty("/displayGroupCancel", false);
		//        c.setProperty("/GroupCancel", false);
		//        this.setGlobalModel(c, "controls");
		//        var A = this.getModel("AssignmentGroups").getData();
		//        var i = parseInt(E.getSource().getBindingContext("AssignmentGroups").getPath().split("/")[1]);
		//        this.setGlobalModel(new J(A[i]), "createGroup");
		//        this.getRouter().navTo("createGroup", {}, false);
		//    },
		//    onEditGroup: function (E) {
		//        var t = this;
		//        var c = this.getModel("controls");
		//        c.setProperty("/displayGroup", false);
		//        c.setProperty("/editGroup", true);
		//        c.setProperty("/displayGroupCancel", false);
		//        c.setProperty("/GroupCancel", true);
		//        this.setGlobalModel(c, "controls");
		//        var A = this.getModel("AssignmentGroups").getData();
		//        var i = parseInt(this.byId("idGroups").getSelectedItem().getBindingContext("AssignmentGroups").getPath().split("/")[1]);
		//        this.setGlobalModel(new J(A[i]), "createGroup");
		//        this.getRouter().navTo("createGroup", {}, false);
		//    },
		//    handleDateChange: function (E) {
		//        var t = this;
		//        var d = {
		//            handleConfirm: function (E) {
		//                var c = b.getDateValue();
		//                var f = b.getSecondDateValue();
		//                t.getTasks(false, c, f);
		//                t.filterAppliedFlag = "X";
		//                if (a) {
		//                    a.destroy();
		//                }
		//            },
		//            handleCancel: function (E) {
		//                if (a) {
		//                    a.destroy();
		//                }
		//            }
		//        };
		//        var a = sap.ui.xmlfragment(this.getView().getId(), "hcm.fab.mytimesheet.view.fragments.FilterAssignment", d);
		//        var b = a.getFilterItems()[0].getCustomControl();
		//        this.getView().addDependent(a);
		//        jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), a);
		//        a.open();
		//    },
		//    onGroupSelection: function (E) {
		//        var c = this.getModel("controls");
		//        var s = E.getParameter("selectedContexts");
		//        if (E.getParameters().listItem.getSelected() === true && this.byId("idGroups").getSelectedItems().length == 1) {
		//            c.setProperty("/EditGroup", true);
		//            c.setProperty("/DeleteGroup", true);
		//            c.setProperty("/createGroupButton", true);
		//        } else if (this.oTaskTable.getSelectedItems().length == 1) {
		//            c.setProperty("/EditGroup", true);
		//            c.setProperty("/DeleteGroup", true);
		//            c.setProperty("/createGroupButton", true);
		//        } else {
		//            c.setProperty("/EditGroup", false);
		//            if (this.byId("idGroups").getSelectedItems().length === 0) {
		//                c.setProperty("/DeleteGroup", false);
		//            } else {
		//                c.setProperty("/DeleteGroup", true);
		//            }
		//            c.setProperty("/createGroupButton", true);
		//        }
		//    },
		//    onGroupDelete: function (E) {
		//        var t = this;
		//        var a = [];
		//        var d = this.getModel("AssignmentGroups").getData();
		//        var s = this.byId("idGroups").getSelectedItems();
		//        for (var k = 0; k < s.length; k++) {
		//            var b = parseInt(s[k].getBindingContext("AssignmentGroups").getPath().split("/")[1]);
		//            if (d[b].Assignments) {
		//                for (var i = 0; i < d[b].Assignments.length; i++) {
		//                    var c = {
		//                        GrpId: d[b].groupId,
		//                        GrpName: d[b].groupName,
		//                        AssignmentId: d[b].Assignments[i].AssignmentId,
		//                        GrpOperation: "D"
		//                    };
		//                    a.push(c);
		//                }
		//            }
		//        }
		//        this.SubmitGroup(a);
		//    },
		//    SubmitGroup: function (a) {
		//        var t = this;
		//        var m = $.extend(true, {}, this.oDataModel);
		//        m.setChangeBatchGroups({
		//            "*": {
		//                groupId: "TimeGroup",
		//                changeSetId: "TimeGroup",
		//                single: false
		//            }
		//        });
		//        m.setDeferredGroups(["TimeGroup"]);
		//        m.refreshSecurityToken(function (d) {
		//            for (var i = 0; i < a.length; i++) {
		//                var b = {
		//                    properties: a[i],
		//                    changeSetId: "TimeGroup",
		//                    groupId: "TimeGroup"
		//                };
		//                m.createEntry("/AssignmentGrpsSet", b);
		//            }
		//            m.submitChanges({
		//                groupId: "TimeGroup",
		//                changeSetId: "TimeGroup",
		//                success: function (d, r) {
		//                    var c = t.oBundle.getText("deleteGroup");
		//                    sap.m.MessageToast.show(c, { duration: 3000 });
		//                    t.getTasks(false);
		//                },
		//                error: function (E) {
		//                    t.oErrorHandler.processError(E);
		//                }
		//            });
		//        }, true);
		//    },
		//    handleSearchAssignments: function (E) {
		//        var t = this;
		//        var f = [];
		//        var s = E.getSource().getValue();
		//        if (s !== "") {
		//            f.push(new F("AssignmentName", g.Contains, s));
		//            var r = this.byId("idTasks").getBinding("items").filter(f);
		//        } else {
		//            var r = this.byId("idTasks").getBinding("items").filter(f);
		//        }
		//    },
		//    handleSearchGroups: function (E) {
		//        var t = this;
		//        var f = [];
		//        var s = E.getSource().getValue();
		//        if (s !== "") {
		//            f.push(new F("groupName", g.Contains, s));
		//            var r = this.byId("idGroups").getBinding("items").filter(f);
		//        } else {
		//            var r = this.byId("idGroups").getBinding("items").filter(f);
		//        }
		//    },
		//    navigateToTasks: function () {
		//        var t = this;
		//        var c = this.getModel("controls");
		//        var m = t.oBundle.getText("confirmationSwitchTab");
		//        var C = !!this.getView().$().closest(".sapUiSizeCompact").length;
		//        if (c.getProperty("/isOverviewChanged") || c.getProperty("/overviewDataChanged")) {
		//            sap.m.MessageBox.warning(t.oBundle.getText("confirmationSwitchTabGeneral"), {
		//                title: t.oBundle.getText("confirm"),
		//                actions: [
		//                    sap.m.MessageBox.Action.OK,
		//                    sap.m.MessageBox.Action.CANCEL
		//                ],
		//                styleClass: C ? "sapUiSizeCompact" : "",
		//                onClose: function (a) {
		//                    if (a === "CANCEL") {
		//                        t.byId("ObjectPageLayout").setSelectedSection(t.byId("ObjectPageLayout").getSections()[0].getId());
		//                        return;
		//                    } else {
		//                        t.onCancel();
		//                        sap.ui.getCore().getMessageManager().removeAllMessages();
		//                        t.iconTabSelectionProcessing(t.byId("ObjectPageLayout").getSections()[2].getId());
		//                        t.byId("ObjectPageLayout").setSelectedSection(t.byId("ObjectPageLayout").getSections()[2].getId());
		//                    }
		//                }
		//            });
		//        } else if (!(c.getProperty("/isOverviewChanged") || c.getProperty("/overviewDataChanged"))) {
		//            t.onCancel();
		//            if (c.getProperty("/isToDoChanged") || c.getProperty("/todoDataChanged")) {
		//                c.setProperty("/showFooter", true);
		//            }
		//            t.iconTabSelectionProcessing(t.byId("ObjectPageLayout").getSections()[2].getId());
		//            this.byId("ObjectPageLayout").setSelectedSection(this.byId("ObjectPageLayout").getSections()[2].getId());
		//        }
		//    },
		//    onShowOverviewMessage: function (E) {
		//        var t = this;
		//        var c = this.getModel("controls");
		//        c.setProperty("/showOverviewMessage", true);
		//    },
		//    onCloseOverviewMessage: function (E) {
		//        var t = this;
		//        var c = this.getModel("controls");
		//        c.setProperty("/showOverviewMessage", false);
		//    },
		//    onShowAssignmentsMessage: function (E) {
		//        var t = this;
		//        var c = this.getModel("controls");
		//        c.setProperty("/showAssignmentsMessage", true);
		//    },
		//    onCloseAssignmentsMessage: function (E) {
		//        var t = this;
		//        var c = this.getModel("controls");
		//        c.setProperty("/showAssignmentsMessage", false);
		//    },
		//    onShowGroupMessage: function (E) {
		//        var t = this;
		//        var c = this.getModel("controls");
		//        c.setProperty("/showGroupMessage", true);
		//    },
		//    onCloseGroupMessage: function (E) {
		//        var t = this;
		//        var c = this.getModel("controls");
		//        c.setProperty("/showGroupMessage", false);
		//    }
	});
});