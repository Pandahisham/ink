//INK
// Licence: GPL <http://www.gnu.org/licenses/gpl.html>
//------------------------------------------------------------------------------
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//------------------------------------------------------------------------------

var ColorBlender = 
{
	//1. Solid Fill
	//------------------------------
	//2. Gradient Fill
	//------------------------------
	//3. Layer color
	//------------------------------

	blend:function( layerColor, fxSolidFillColor, fxGradientFillColor, roundMyValues ) 
	{
		var myColors         = [];
		var continueBlending = true;

		//contains final blend results.
		var theBlend        = {};
		theBlend.colorItems = [];
		theBlend.type       = "";

		//final output
		var blendOutput        = {};
		blendOutput.type       = "";
		blendOutput.colorItems = [];
		blendOutput.css        = "";
		blendOutput.css_gr_lb  = "";

		//there are 2 different types.
		//[{rgba:{}, location:-1}], 'solid'
		//[{rgba:{}, location:0}, {rgba:{}, location:100}], 'gradient'
		function addToMyColors( colorItems, type ) 
		{
			myColors.push( { colorItems:colorItems, type:type } );
		}
		function createColorItem( rgba, location )
		{
			if ( location == undefined ) {
				location = -1;
			}
			return { rgba:rgba, location:location };
		}
		//this is for testing.
		var colorCode = "";

		//1. solid fill fx.
		if ( fxSolidFillColor.enabled && fxSolidFillColor.rgba.alpha > 0 ) 
		{
			addToMyColors( [ createColorItem( fxSolidFillColor.rgba, -1 ) ], 'solid' );
			colorCode += "s";

			if ( fxSolidFillColor.rgba.alpha == 1 ) 
			{
				continueBlending = false;
			}
		}

		//2. gradient fill fx	
		if ( continueBlending && fxGradientFillColor.enabled && fxGradientFillColor.alpha > 0 ) 
		{
			var gradientColorItems = [];
			for ( var i = 0; i < fxGradientFillColor.stops.length; i++ ) 
			{
				var gradientStopRGBAObj = { red:fxGradientFillColor.stops[i].red, 
											green:fxGradientFillColor.stops[i].green,
											blue:fxGradientFillColor.stops[i].blue,
											alpha:fxGradientFillColor.stops[i].alpha };

				gradientColorItems.push( createColorItem( gradientStopRGBAObj, fxGradientFillColor.stops[i].location ) );
			}
			addToMyColors( gradientColorItems, 'gradient' );
			colorCode += "g";
		}

		//3. layer color	
		if ( continueBlending && layerColor.enabled && layerColor.rgba != undefined ) 
		{
			if ( layerColor.rgba.alpha > 0 ) 
			{
				addToMyColors( [ createColorItem( layerColor.rgba, -1 ) ], 'solid' );
			}
			colorCode += "o";
		}


		for ( var i = 0; i < myColors.length; i++ ) 
		{
			if ( i == 0 ) {
				theBlend.colorItems = myColors[0].colorItems;
				theBlend.type       = myColors[0].type;
			}
			else {
				//theBlend is already gradient
				if ( theBlend.colorItems.length > myColors[i].colorItems.length ) 
				{
					for ( var k = 0; k < theBlend.colorItems.length; k++ ) 
					{
						//blend theBlend gradient stop with myColors[i].colorItems[0]
						//theBlend is always OVER.
						var blendStop = ColorUtils.blendRGBAColors( theBlend.colorItems[k].rgba, myColors[i].colorItems[0].rgba );
						theBlend.colorItems[k] = createColorItem( blendStop, theBlend.colorItems[k].location );
					}

				}
				//myColors[i] is gradient
				else if ( theBlend.colorItems.length < myColors[i].colorItems.length ) 
				{
					theBlend.type = "gradient";

					//we are gonna replace into theBlend on the fly so 
					//we need to register the original object.
					var origTheBlend        = {};
					origTheBlend.colorItems = [];
					origTheBlend.colorItems.push( theBlend.colorItems[0] );

					for ( var k = 0; k < myColors[i].colorItems.length; k++ ) 
					{
						//blend myColors[i].colorItems with theBlend.colorItems[0]
						var blendStop = ColorUtils.blendRGBAColors( origTheBlend.colorItems[0].rgba, myColors[i].colorItems[k].rgba );
						theBlend.colorItems[k] = createColorItem( blendStop, myColors[i].colorItems[k].location );
					}
				}
				//neither is gradient (solid)
				else {
					theBlend.type = "solid";
					var blendColor = ColorUtils.blendRGBAColors( theBlend.colorItems[0].rgba, myColors[i].colorItems[0].rgba );
					theBlend.colorItems[0] = createColorItem( blendColor, -1 );
				}
			}
		}

		//build final output.
		blendOutput.type = theBlend.type;

		if ( roundMyValues )
		{
			for ( var i = 0; i < theBlend.colorItems.length; i++ ) 
			{
				blendOutput.colorItems[i]            = theBlend.colorItems[i];
				blendOutput.colorItems[i].rgba.red   = Math.round( theBlend.colorItems[i].rgba.red );
				blendOutput.colorItems[i].rgba.green = Math.round( theBlend.colorItems[i].rgba.green );
				blendOutput.colorItems[i].rgba.blue  = Math.round( theBlend.colorItems[i].rgba.blue );
				blendOutput.colorItems[i].rgba.alpha = Math.round( theBlend.colorItems[i].rgba.alpha * 100 ) / 100;
			}	
		}
		else
		{
			blendOutput.colorItems = theBlend.colorItems;
		}

		if ( blendOutput.type == "gradient" )
		{
			//gradient fill.
			var cssColorsStops = [];
			for ( var i = 0; i < blendOutput.colorItems.length; i++ ) 
			{
				var cssColorStop      = {};
				cssColorStop.css      = Ps2CssUtils.rgbaObjToCSS( blendOutput.colorItems[i].rgba );
				cssColorStop.location = blendOutput.colorItems[i].location;
				cssColorsStops.push( cssColorStop );
			}

			blendOutput.css = Ps2CssUtils.gradientToCSS( fxGradientFillColor.angle, 
													     fxGradientFillColor.type, 
													     cssColorsStops,
													     false );

			blendOutput.css_gr_lb  = Ps2CssUtils.gradientToCSS( fxGradientFillColor.angle, 
														        fxGradientFillColor.type, 
														        cssColorsStops,
														        true );
		}
		else
		{
			//solid fill.
			if ( blendOutput.colorItems.length > 0 ) 
			{
				blendOutput.css = Ps2CssUtils.rgbaObjToCSS( blendOutput.colorItems[0].rgba );
			}
		}
		return blendOutput;
	}
};