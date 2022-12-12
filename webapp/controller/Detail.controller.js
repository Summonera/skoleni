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
			var oParams = {
				path: sPath,
				model: "mainModel"
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
			oModel.setProperty("/edit", !bEdit);
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