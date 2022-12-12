sap.ui.define([
    "cd/skoleni/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "cd/skoleni/model/formatter",
    "sap/m/MessageBox",
    "sap/m/Bar"

    //"../model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
	JSONModel,
	formatter,MessageBox) {
        "use strict";

        return Controller.extend("cd.skoleni.controller.Main", {
            formatter: formatter,
            onInit: function () {
            },

            onAfterRendering: function(){
                this.getView().addStyleClass(this.getDensityStyle());
            },

            handleRowPress: function(oEvent){
                var iIndex = oEvent.getSource().getBindingContextPath().replace("/","");
                var oParams = {
                    index: iIndex
                }
                this.getOwnerComponent().getRouter().navTo("RouteDetail",oParams);
            },

            handleButtonPress: function(oEvent){
                var oButton = oEvent.getSource(); 
                var sText = oButton.getText();
                window.alert(sText);
            },

            handleDeleteEntry: function(oEvent){
                var oButton = oEvent.getSource();
                var oColumnListItem = oButton.getParent();
                var sPath = oColumnListItem.getBindingContextPath();
                var iIndex = sPath.replace("/","");
                //var oColumnListItem = oEvent.getSource().getParent();
                var oData = this.getView().getModel("mainModel").getData();
                oData.splice(iIndex,1);
                this.getView().getModel("mainModel").setProperty("/", oData);
                this.getView().getModel("mainModel").refresh(true);
            },

            handleDeleteSelectedEntries: function(oEvent){
                var oTable = this.getView().byId("idTable");
                //sap.ui.getCore().byId("idTable");
                var oSelectedItems = oTable.getSelectedItems();
                
                for (let i = oSelectedItems.length - 1; i >= 0; i--) {
                    var iIndex = oSelectedItems[i].getBindingContextPath().replace("/","");
                    var oData = this.getView().getModel("mainModel").getData();
                    oData.splice(iIndex,1);
                    this.getView().getModel("mainModel").setProperty("/", oData);
                }
                oTable.removeSelections();
                this.getView().getModel("mainModel").refresh(true);
            },

            handleAddNewEntry: function(oEvent){
                this.initCreateModel();
                var oDialog = this.getDialog("NewEntryDialog");
                oDialog.open();
            },

            initCreateModel: function(){
                var oEntry = {
                    jmeno: "",
                    auto: "",
                    model: "",
                    barva: "",
                    hodnoceni: 0,
                    nove: false
                };
                var oJSONModel = new JSONModel(oEntry);
                this.getView().setModel(oJSONModel,"createModel");
            },

            handleColorSelect: function(oEvent){
                var sColor = oEvent.getParameters().value;
                var oModel = this.getView().getModel("createModel");
                oModel.setProperty("/barva", sColor);
            },

            handleCreateNewEntry: function(){
                if(!this.validateEntry()) return;
                var oNewEntry = this.getView().getModel("createModel").getData();
                var oData = this.getView().getModel("mainModel").getData();
                oData.push(oNewEntry);
                this.getView().getModel("mainModel").setProperty("/", oData);
                this.getView().getModel("mainModel").refresh(true);
                var oDialog = this.getDialog("NewEntryDialog");
                oDialog.close();
            },

            validateEntry: function(){
                var oEntry = this.getView().getModel("createModel").getData();
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var sText = oResourceBundle.getText("error_message");

                if(oEntry.auto === "" || oEntry.jmeno === "" 
                || oEntry.barva === "" || oEntry.model === ""){
                    MessageBox.error(sText);
                    return false;
                }

                return true;
            },

            handleCloseDialog: function(oEvent){
                /*var oButton = oEvent.getSource();
                var oDialog = oButton.getParent().getParent();
                oDialog.close();*/

                var oDialog = this.getDialog("NewEntryDialog");
                oDialog.close();
            },
        });
    });
