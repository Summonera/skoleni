sap.ui.define([
    "cd/skoleni/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "cd/skoleni/model/formatter",
    "sap/m/MessageBox",
    "sap/m/Bar",
    "sap/m/MessageToast"

    //"../model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
        JSONModel,
        formatter, MessageBox, Bar, MessageToast) {
        "use strict";

        return Controller.extend("cd.skoleni.controller.Main", {
            formatter: formatter,
            onInit: function () {
            },

            onAfterRendering: function () {
                this.getView().addStyleClass(this.getDensityStyle());
            },

            handleRowPress: function (oEvent) {
                var iIndex = oEvent.getSource().getBindingContextPath().replace("/", "");
                var oParams = {
                    index: iIndex
                }
                this.getOwnerComponent().getRouter().navTo("RouteDetail", oParams);
            },

            handleTableUpdateFinished: function (oEvent) {
                var sTotal = oEvent.getParameters().total;

                /*var oTitle = this.getView().byId("idTitle");
                oTitle.setText("Záznamy ("+ sTotal + ")");*/

                var oData = { pocet: sTotal };
                var oJSONModel = new JSONModel(oData);
                this.getView().setModel(oJSONModel, "tableModel");
            },

            handleButtonPress: function (oEvent) {
                var oButton = oEvent.getSource();
                var sText = oButton.getText();
                window.alert(sText);
            },

            handleDeleteEntry: function (oEvent) {
                var oButton = oEvent.getSource();
                var oColumnListItem = oButton.getParent();
                var sPath = oColumnListItem.getBindingContextPath();
                var iIndex = sPath.replace("/", "");
                //var oColumnListItem = oEvent.getSource().getParent();
                var oData = this.getView().getModel("mainModel").getData();
                oData.splice(iIndex, 1);
                this.getView().getModel("mainModel").setProperty("/", oData);
                this.getView().getModel("mainModel").refresh(true);
            },

            handleDeleteEntryBE: function (oEvent) {
                var oButton = oEvent.getSource();
                var oColumnListItem = oButton.getParent();
                var sPath = oColumnListItem.getBindingContextPath();
                
                var oTable = this.getView().byId("idTable");
                oTable.setBusyIndicatorDelay(0);
                oTable.setBusy(true);

                this.getView().getModel().remove(sPath, {
                    refreshAfterChange: true,
                    success: function () {
                        oTable.setBusy(false);
                    }.bind(this),
                    error: function (oError) {
                        MessageToast.show("Vyskytla se chyba: " + oError.responseText);
                        oTable.setBusy(false);
                    }.bind(this),
                });
            },

            handleCreateNewEntryBE: function (oEvent) {
                if (!this.validateEntry()) return;
                var oNewEntry = this.getView().getModel("createModel").getData();
                var oData = this.sortData(oNewEntry);
                var sPath = "/EntCarSet";
                var oTable = sap.ui.getCore().byId("idDialog");
                oTable.setBusy(true);

                this.getView().getModel().create(sPath, oData, {
                    refreshAfterChange: true,
                    success: function () {
                        oTable.setBusy(false);
                        var oDialog = this.getDialog("NewEntryDialog");
                        oDialog.close();
                    }.bind(this),
                    error: function(){
                        oTable.setBusy(false);
                    }.bind(this)
                })
            },

            sortData: function (oEntry) {
                var oData = {
                    Name: oEntry.jmeno,
                    Mark: oEntry.auto,
                    Model: oEntry.model,
                    Color:  oEntry.barva,
                    Rating: oEntry.hodnoceni,
                    IsNew: oEntry.nove
                }
                return oData;
            },

            handleDeleteSelectedEntries: function (oEvent) {
                var oTable = this.getView().byId("idTable");
                //sap.ui.getCore().byId("idTable");
                var oSelectedItems = oTable.getSelectedItems();

                for (let i = oSelectedItems.length - 1; i >= 0; i--) {
                    var iIndex = oSelectedItems[i].getBindingContextPath().replace("/", "");
                    var oData = this.getView().getModel("mainModel").getData();
                    oData.splice(iIndex, 1);
                    this.getView().getModel("mainModel").setProperty("/", oData);
                }
                oTable.removeSelections();
                this.getView().getModel("mainModel").refresh(true);
            },

            handleDeleteSelectedEntriesBE: function (oEvent) {
                var oTable = this.getView().byId("idTable");
                var oSelectedItems = oTable.getSelectedItems();
                for (let i = oSelectedItems.length - 1; i >= 0; i--) {
                    var sEntryPath = oSelectedItems[i].getBindingContextPath();
                    this.getView().getModel().remove(sEntryPath,{
                        refreshAfterChange: true
                    });
                }
                oTable.removeSelections();
            },

            handleBeforeOpenDialog: function(){
                var oColorPalette = sap.ui.getCore().byId("idColorPalette");
                var oColors = ["#ff0000", "#00ff00", "#ffff00", "#00ffff", "#ffffff","#000000"];
                oColorPalette.setColors(oColors);
            },

            handleAddNewEntry: function (oEvent) {
                this.initCreateModel();
                var oDialog = this.getDialog("NewEntryDialog");
                oDialog.open();
            },

            initCreateModel: function () {
                var oEntry = {
                    jmeno: "",
                    auto: "",
                    model: "",
                    barva: "",
                    hodnoceni: 0,
                    nove: false
                };
                var oJSONModel = new JSONModel(oEntry);
                this.getView().setModel(oJSONModel, "createModel");
            },

            handleColorSelect: function (oEvent) {
                var sColor = oEvent.getParameters().value;
                var oModel = this.getView().getModel("createModel");
                oModel.setProperty("/barva", sColor);
            },

            handleCreateNewEntry: function () {
                if (!this.validateEntry()) return;
                var oNewEntry = this.getView().getModel("createModel").getData();
                var oData = this.getView().getModel("mainModel").getData();
                oData.push(oNewEntry);
                this.getView().getModel("mainModel").setProperty("/", oData);
                this.getView().getModel("mainModel").refresh(true);
                var oDialog = this.getDialog("NewEntryDialog");
                oDialog.close();
            },

            validateEntry: function () {
                var oEntry = this.getView().getModel("createModel").getData();
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var sText = oResourceBundle.getText("error_message");

                if (oEntry.auto === "" || oEntry.jmeno === ""
                    || oEntry.barva === "" || oEntry.model === "") {
                    MessageBox.error(sText);
                    return false;
                }

                return true;
            },

            handleCloseDialog: function (oEvent) {
                /*var oButton = oEvent.getSource();
                var oDialog = oButton.getParent().getParent();
                oDialog.close();*/

                var oDialog = this.getDialog("NewEntryDialog");
                oDialog.close();
            },
        });
    });
