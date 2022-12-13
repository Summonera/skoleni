sap.ui.define([],
    function () {
        "use strict";

        return {
            showDeleteButton: function(bNove){
                // return !bNove;
                if(bNove ===  false){
                    return true;
                }else{
                    return false;
                }
            }, 

            showDeleteButton1: function(iHodnoceni, sAuto){
                if(iHodnoceni > 3 && (sAuto === "Škoda" || sAuto === "Mercedes") ){
                    return true;
                }
                return false;
            },

            setButtonType: function(sAuto){
                switch(sAuto){
                    case 'Škoda':
                        return 'Emphasized';
                    case 'Mercedes':
                        return 'Accept';
                    case 'BMW':
                        return 'Transparent';
                    default:
                        return 'Reject';
                }
            },

            showItemsCount: function(oItems){
                return oItems.length;
            },
        };
    });