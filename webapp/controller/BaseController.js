sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (
    Controller
) {
    "use strict";

    return Controller.extend("cd.skoleni.controller.BaseController", {
        getDensityStyle: function(){
			var oDeviceModel = this.getOwnerComponent().getModel("device");
			var bTouch = oDeviceModel.getProperty("/support/touch");
			if(bTouch){
				return "sapUiSizeCozy";
			}else{
				return "sapUiSizeCompact";
			}
		},

        oDialogs: [],
        getDialog: function(sName){
            if(this.oDialogs[sName] === undefined){
                this.oDialogs[sName] = sap.ui.xmlfragment("cd.skoleni.view.fragment." + sName, this);
                this.getView().addDependent(this.oDialogs[sName]);
                this.oDialogs[sName] .addStyleClass(this.getDensityStyle());
            }
            return this.oDialogs[sName];
        },

        
    });
});