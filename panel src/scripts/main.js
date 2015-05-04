//CC / CS
var PLUGIN_PS_V = "CC";

//store settings
var myInkSettings = {};

myInkSettings.output_text_color = "#ffffff";
myInkSettings.measures_color    = "#28e4b9";
myInkSettings.text_bubble_color = "#28e4b9";


//on user UI settings received
document.addEventListener('onInkUISettings', function (e) 
{    
    var splitUserSettings = e.settingsStr.toString().split(","); 

    setSwitchSetting( "layerDocumentation_printObj", splitUserSettings[0], "n" );
    setSwitchSetting( "layerDocumentation_printColor", splitUserSettings[1], "n" );
    setSwitchSetting( "layerDocumentation_printFx", splitUserSettings[2], "n" );
    setSwitchSetting( "text_bubble_styling", splitUserSettings[3], "n" );
    setSwitchSetting( "generate_xml", splitUserSettings[4], "n" );
    setColorPicker( "output_text_color", splitUserSettings[5], "n" );
    setColorPicker( "measures_color", splitUserSettings[6], "n" );
    setColorPicker( "text_bubble_color", splitUserSettings[7], "n" );
    setCounter("text_size",splitUserSettings[8], "n");
    setCounter("ruler_stroke",splitUserSettings[9], "n");

    //@status "on" (CSS mode) | "off" (PS mode)
    //if (splitUserSettings[8] == "css") {
    //    setInlineDocType( "on" );
    //} else {
    //    setInlineDocType( "off" );   
    //}

}, false);

//store user UI setting (on UI element change)
function storeUISettings() {
    var settingsArr = getUISettings();

    //Plugin for Photoshop CC
    if ( PLUGIN_PS_V == "CC" ) {
        try { 
            var inkSettingStr = "";
            for ( var i = 0; i < settingsArr.length; i ++ ) {
                inkSettingStr += settingsArr[i];
                if ( i != ( settingsArr.length - 1 ) ) {
                    inkSettingStr += ",";  
                }
            } 
            evalScript("$._ext_inkUISettings.setSettings('" + inkSettingStr + "')");
        }
        catch( e )
        {
            alert( "Ooops. Something went wrong. Please try again.");
        }
    }
    //Plugin for Photoshop CS6 -
    else {
        //not supported for now.
    }
}

function switchTab( n ) {
    document.getElementsByClassName("tab")[0].setAttribute( 'class', "tab off" );
    document.getElementsByClassName("tab")[1].setAttribute( 'class', "tab off" );
    document.getElementsByClassName("tab")[2].setAttribute( 'class', "tab off" );
    document.getElementsByClassName("tab")[n].setAttribute( 'class', "tab on" );

    document.getElementById("tab_content_0").style["display"] = "none";
    document.getElementById("tab_content_1").style["display"] = "none";
    document.getElementById("tab_content_2").style["display"] = "none";
    document.getElementById("tab_content_" + n.toString()).style["display"] = "block";
}


function getCounter(target) {
    return document.getElementById(target).innerHTML.toString();   
}
function setCounter(target, val, store) {
    document.getElementById(target).innerHTML = val.toString();

    if ( store == "y" ) {
        storeUISettings();   
    }  
}

//number step function called via UI
function stepTextSize(target, store) {
    var min = 10;
    var max = 32;
    var val = parseInt( getCounter("text_size") );
    var newVal;
    console.log(val);
    var direction = target.getAttribute('class').toString();
    if ( direction == "next" ) {
        newVal = val + 1; 
        if ( newVal > max ) {
            newVal = min;
        }
    } else {
        newVal = val - 1; 
        if ( newVal < min ) {
            newVal = max;
        }
    }
    setCounter("text_size",newVal, store);
}

//number step function called via UI
function stepRulerStroke(target, store) {
    var min = 1;
    var max = 4;
    var val = parseInt( getCounter("ruler_stroke") );
    var newVal;
    console.log(val);
    var direction = target.getAttribute('class').toString();
    if ( direction == "next" ) {
        newVal = val + 1; 
        if ( newVal > max ) {
            newVal = min;
        }
    } else {
        newVal = val - 1; 
        if ( newVal < min ) {
            newVal = max;
        }
    }
    setCounter("ruler_stroke",newVal, store);    
}

//set target color picker color and update settings
//argID is the attribute id and the div id as well.
function setColorPicker( argID, hex, store ) {
	var isValidHex  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hex);
	if ( ! isValidHex ) {
		hex = myInkSettings[argID];
	}
    //set new value
    document.getElementById(argID + "_preview").style["background-color"] = hex;
    document.getElementsByName(argID)[0].value                            = hex;
    myInkSettings[argID]                                                  = hex;

    if ( store == "y" ) {
        storeUISettings();   
    }

}
function getColorPicker( argID ) {
    return ( document.getElementsByName(argID)[0].value );
}

//triggered on color pick manual change.
function checkColorValue(e,store) {
	var validEvent = false;
	switch ( e.type.toString() ) {
		case 'blur':
			validEvent = true;
		break

		case 'keypress':
			if (e.keyCode == 13) {
				validEvent = true;
			}
			else {
				validEvent = false;	
			}
		break
		default:
			//invalid event.
			validEvent = false;
	}
	if ( validEvent ) {
		setColorPicker( e.target.name.toString(), e.target.value.toString(), store );
	}
    //false will stop the typing process.
    return true;
}

//get switch value
function getSwitchSetting( argId ) {
    var switchVal = "";
    var targetSwitch = document.getElementById(argId);
    if ( targetSwitch.getAttribute('class').toString() == "switch on" ) {
        switchVal = "on";
    }
    else {
        switchVal = "off";
    } 
    return switchVal;  
}

//argID is the attribute id and the div id as well.
//val is the switch value. 'on' or 'off'
//store: 'y' or 'n'. Store into user preferences or not.
function setSwitchSetting( argId, val, store ) {
    try {
        var targetSwitch     = document.getElementById(argId);
        myInkSettings[argId] = val;
        var switchDivAttr    = "switch " + val;
        targetSwitch.setAttribute( 'class', switchDivAttr );

        if ( store == "y" ) {
            storeUISettings();   
        }
    }
    catch (e) {
        alert( "Ooops. Something went wrong. Please try again.");
    }
}
function editSwitchSettings( argId, store ) {
	try 
    {
        var targetSwitch = document.getElementById(argId);
        if ( targetSwitch.getAttribute('class').toString() == "switch on" )
        {
            myInkSettings[argId] = "off";
            targetSwitch.setAttribute('class',"switch off");
        }
        else
        {
            myInkSettings[argId] = "on";
            targetSwitch.setAttribute('class',"switch on");   
        }

        if ( store == "y" ) {
            storeUISettings();   
        }
    }
    catch (e)
    {
    	alert( "Ooops. Something went wrong. Please try again.");
    }
}

//this is used to set the initial status at startup,
//following user preferences. It just set the appearence.
//@status "on" (CSS mode) | "off" (PS mode)
function setInlineDocType( status ) {
	var target        = document.getElementById( "inline_doc_type" );
	var targetPsLabel = document.getElementById( "inline_doc_type_ps_lbl" );
	var targetCssLabel = document.getElementById( "inline_doc_type_css_lbl" );

	var targetClassStatus = "hswitch " + status.toString();
	target.setAttribute( 'class', targetClassStatus );

	//switch the label focus
	if ( status == "off" ) {
        myInkSettings["inline_doc_type"] = "ps";
		targetPsLabel.setAttribute( 'class', 'l on' ); 
		targetCssLabel.setAttribute( 'class', 'r off' ); 
	}
	else {
        myInkSettings["inline_doc_type"] = "css";
		targetPsLabel.setAttribute( 'class', 'l off' ); 
		targetCssLabel.setAttribute( 'class', 'r on' ); 
	}
}
function getInlineDocType() {
    var myDocType = "";
    if ( document.getElementById( "inline_doc_type" ).getAttribute('class').toString() == "hswitch on" ) {
        myDocType = "css";
    }
    else {
        myDocType = "ps";
    }
    return myDocType;
}

//this is only used by the UI to switch on / off the button
function switchInlineDocType() 
{
	var target = document.getElementById( "inline_doc_type" );

	if ( target.getAttribute('class').toString() == "hswitch on" )
    {
        setInlineDocType( "off" );
    }
    else
    {
        setInlineDocType( "on" );   
    }
}

/* get all UI settings and return a string */
function getUISettings() {
    var uiSettings = [];

    //0: "layerDocumentation_printObj"
    uiSettings.push( getSwitchSetting( "layerDocumentation_printObj" ) );

    //1: "layerDocumentation_printColor"
    uiSettings.push( getSwitchSetting( "layerDocumentation_printColor" ) );

    //2: "layerDocumentation_printFx"
    uiSettings.push( getSwitchSetting( "layerDocumentation_printFx" ) );

    //3: "text_bubble_styling"
    uiSettings.push( getSwitchSetting( "text_bubble_styling" ) );

    //4: "generate_xml"
    uiSettings.push( getSwitchSetting( "generate_xml" ) );

    //5: "output_text_color"
    uiSettings.push( getColorPicker( "output_text_color" ) );

    //6: "measures_color"
    uiSettings.push( getColorPicker( "measures_color" ) );

    //7: "text_bubble_color"
    uiSettings.push( getColorPicker( "text_bubble_color" ) );

    //8: "text_size"
    uiSettings.push( getCounter("text_size") );

    //9: "ruler_stroke"
    uiSettings.push( getCounter("ruler_stroke") );

    //"inline_output_type"
    //uiSettings.push( getInlineDocType() );

    return uiSettings;  
}

//manage call to jsx action -> Ink()
function jsxcall_ink( args )
{

    //push settings on the bottom of the args array. InkUI.callInk will parse and send to Ink() the right arguments.
    //args.push( settings. )
    var toInk = getUISettings();

    //push ink arguments at the end of the array..
    for ( var i = 0; i < args.length; i ++ ) {
        toInk.push( args[i] );
    }

    //Plugin for Photoshop CC
    if ( PLUGIN_PS_V == "CC" )
    {
        try 
        { 
            var inkActionStr = "";
            for ( var i = 0; i < toInk.length; i ++ )
            {
                inkActionStr += toInk[i];

                if ( i != ( toInk.length - 1 ) )
                {
                    inkActionStr += ",";  
                }
            } 
            evalScript("$._ext_INK.run('" + inkActionStr + "')");
        }
        catch( e )
        {
            alert( "Ooops. Something went wrong. Please try again.");
        }
    }
    //Plugin for Photoshop CS6 -
    else
    {
        try 
        {   
            _AdobeInvokeFunctionInScriptFile("Ink.jsx", "InkUI", "callInk", toInk );
        } 
        catch ( e ) 
        {
            alert( "Ooops. Something went wrong. Please try again.");
        } 
    }
}