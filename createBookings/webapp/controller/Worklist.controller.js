sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator,MessageToast) {
	"use strict";

	return BaseController.extend("com.createbookings.createBookings.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit : function () {
			var oViewModel;

			// keeps the search state
			this._aTableSearchState = [];

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
				shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
				tableNoDataText : this.getResourceBundle().getText("tableNoDataText")
			});
			this.setModel(oViewModel, "worklistView");

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
		onUpdateFinished : function (oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitle");
			}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress : function (oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},

		/**
		 * Event handler for navigating back.
		 * Navigate back in the browser history
		 * @public
		 */
		onNavBack : function() {
			// eslint-disable-next-line sap-no-history-manipulation
			history.go(-1);
		},


		onSearch : function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var aTableSearchState = [];
				var sQuery = oEvent.getParameter("query");

				if (sQuery && sQuery.length > 0) {
					aTableSearchState = [new Filter("CustomerName", FilterOperator.Contains, sQuery)];
				}
				this._applySearch(aTableSearchState);
			}

		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh : function () {
			var oTable = this.byId("table");
			oTable.getBinding("items").refresh();
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
		_showObject : function (oItem) {
			var that = this;

			oItem.getBindingContext().requestCanonicalPath().then(function (sObjectPath) {
				that.getRouter().navTo("object", {
					objectId_Old: oItem.getBindingContext().getProperty("BookingNo"),
					objectId : sObjectPath.slice("/Bookings".length) // /Products(3)->(3)
				});
			});
		},
		
		createNew:function()
		{
			if (!this._oDialog) {
				//sap.ui.xmlfragment(oView.getId(), "com.vinci.timesheet.admin.view.EmployeeDayDialog", this);
				this._oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.createbookings.createBookings.fragment.createNewBookingFragment", this);
			}
			this._oDialog.setModel(this.getView().getModel());
			this._oDialog.setModel(this.getView().getModel('i18n'), 'i18n');
			this.getView().addDependent(this._oDialog);
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();	
		},
		
			onCancel: function() {
			this._oDialog.close();
		},
		
		onBookMe:function(oEvent)
		{
			var that=this;
			var formValues=this.getView().byId("FormChange354").getFormContainers()[0];
			var filledValues=[];
			var bookingNo=Math.floor(Math.random() * 20);
			bookingNo=bookingNo.toString();
			for(var i=0; i<5; i++)
			{
				if( i===0 ||  i===1)
				{
					filledValues[i]=formValues.getFormElements()[i].getFields()[0].getSelectedKey();
				}
				else 
				{
					if(i===4)
					{
					filledValues[i]=formValues.getFormElements()[i].getFields()[0].getDateValue();
					}
					
					else
					{
						filledValues[i]=formValues.getFormElements()[i].getFields()[0].getValue();
							
					}
				}
				
				
			}
			
		var bookingValues = {

				"BookingNo": Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6),
				"NumberOfPassengers": parseInt(filledValues[2]),
				"CustomerName": filledValues[3],
				"DateOfTravel": filledValues[4],
				"Cost":1200
				
			};
			
	var oModel = this.getView().byId("table").getBinding("items").create(bookingValues)  ;                     		
	// oModel;


oModel.created().then(function () {
                    	MessageToast.show("Your journey has been booked");
                    	that.onCancel();
                }, function (oError) {
                		MessageToast.show("Sorry, We cant process this request at this point of time.");
                	that.onCancel();
                	
                    var shobhit;// handle rejection of entity creation; if oError.canceled === true then the transient entity has been deleted 
                });  	
	
			
			
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
		_applySearch: function(aTableSearchState) {
			var oTable = this.byId("table"),
				oViewModel = this.getModel("worklistView");
			oTable.getBinding("items").filter(aTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			}
		}

	});
});