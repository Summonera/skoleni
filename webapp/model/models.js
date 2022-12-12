sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
],
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device) {
        "use strict";

        return {
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },

            createDummyJSONModel: function(){
                var oModel = new JSONModel(this.getJSONData());
                return oModel;
            },

            getJSONData: function(){
                var oData = [{
                    jmeno: "Dominik",
                    auto: "Škoda",
                    model: "Karoq",
                    barva: "green",
                    hodnoceni: 4,
                    nove: false
                },{
                    jmeno: "Sára",
                    auto: "BMW",
                    model: "X6",
                    barva: "black",
                    hodnoceni: 3,
                    nove: true
                },{
                    jmeno: "Jan",
                    auto: "Mercedes",
                    model: "S200",
                    barva: "blue",
                    hodnoceni: 2,
                    nove: true
                },{
                    jmeno: "Markéta",
                    auto: "Audi",
                    model: "R3",
                    barva: "yellow",
                    hodnoceni: 5,
                    nove: false
                }]; 
                
                return oData;
            },
        };
    });