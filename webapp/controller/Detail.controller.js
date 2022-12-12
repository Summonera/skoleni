sap.ui.define([
	"cd/skoleni/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(
	Controller,
	JSONModel
) {
	"use strict";

	return Controller.extend("cd.skoleni.controller.Detail", {
		onInit: function() {
			this.getView().addStyleClass(this.getDensityStyle());
			this.getOwnerComponent().getRouter().getRoute("RouteDetail").attachPatternMatched(this.patternMatched, this);
			this.initDetailModel();
		},

		patternMatched: function(oEvent){
			var sPath = "/" + oEvent.getParameters().arguments.index;
			this.sPath = sPath;

			var oParams = {
				path: sPath
			}
			this.getView().getModel("detailModel").setProperty("/path", sPath);
			this.getView().bindElement(oParams);
		},

		initDetailModel: function(){
			var oData = {
				edit: false,
				path: ""
			};
			var oJSONModel = new JSONModel(oData);
			this.getView().setModel(oJSONModel,"detailModel");
		},

		handleChangeState: function(){
			var oModel = this.getView().getModel("detailModel");
			var bEdit = oModel.getProperty("/edit");

			if(bEdit){
				this.handleUpdateEntry(oModel);
			}else{
				oModel.setProperty("/edit", !bEdit);
			}
			
			/*this.sHeadId = this.getView().getModel().getProperty(this.sPath + "/HeadId");
			this.sState = this.getView().getModel().getProperty(this.sPath + "/State");
			var sPath = "/SetState"
			this.getView().getModel().callFunction(sPath, {
				method:"POST",
				urlParameters: {
					HeadKey: this.sHeadId,
					State: this.sState
				}
			})*/
		},

		handleUpdateEntry: function(oModel){
			var oData = this.getView().getElementBinding().getBoundContext().getObject();
			this.getView().getModel().update(this.sPath,oData, {
				success: function(){
					oModel.setProperty("/edit", false);
				}.bind(this),
			});
		},

		handleUpdateEntry2: function(oModel){
			var bChanged = this.getView().getModel().hasPendingChanges();
			if(bChanged){
				this.getView().getModel().submitChanges({
					success: function(){
						oModel.setProperty("/edit", false);
					}
				});
			}
		},



		handleNavButtonPress: function(){
			this.getOwnerComponent().getRouter().navTo("RouteMain");
		},

		//#region Funkce pro ColorPalette objekt
		handleColorSelect: function(oEvent){
			var sPath = this.getView().getModel("detailModel").getProperty("/path");
			var sColor = oEvent.getParameters().value;
			var oModel = this.getView().getModel("mainModel");
			oModel.setProperty(sPath + "/barva", sColor);
		},
		//#endregion

	});
});