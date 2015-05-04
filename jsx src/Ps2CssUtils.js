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

var Ps2CssUtils = {
	borderToCSS:function( size, rgba )
	{
		return( size.toString() + "px solid " + Ps2CssUtils.rgbaObjToCSS( rgba ) );
	},
	//inset: true | false
	//rgba:red green blue alpha object
	//distance:x px
	//angle:-180 / +180
	shadowToCSS:function( inset, rgba, distance, angle, blur )
	{
		var xop = 1;
		var yop = 1;

		var minPoint = 0;
		var midPoint = 0;
		var maxPoint = 0;
		var lowop    = "x";

		if ( angle == 180 ) {
			angle = -180;
		}

		if ( angle >= -180 && angle < -90 ) 
		{
			minPoint = -180;
			midPoint = -135;
			maxPoint = -90;
			xop      = 1;
			yop      = -1;
			lowop    = "x";
		}
		else if ( angle >= -90 && angle < 0 ) 
		{
			minPoint = -90;
			midPoint = -45;
			maxPoint = 0;
			xop      = -1;
			yop      = -1;
			lowop    = "y";
		}
		else if ( angle >= 0 && angle < 90 ) 
		{
			minPoint = 0;
			midPoint = 45;
			maxPoint = 90;
			xop      = -1;
			yop      = 1;
			lowop    = "x";

		}
		else if ( angle >= 90 && angle < 180 ) 
		{
			minPoint = 90;
			midPoint = 135;
			maxPoint = 180;
			xop      = 1;
			yop      = 1;
			lowop    = "x";
		}

		var relangle = angle - minPoint;
		var relmax   = maxPoint - minPoint;
		var relmid   = midPoint - minPoint;

		var ratio1 = Math.abs( Math.round( ( relangle / relmax ) * 100 ) / 100 );
		var ratio2 = 1 - ratio1;
		var xratio = 0;
		var yratio = 0;

		if ( lowop == "x" ) 
		{
			if ( relangle <= (relmid / 2) ) 
			{	
				xratio = Math.max( ratio1, ratio2 );
				yratio = Math.min( ratio1, ratio2 );
			}
			else 
			{
				xratio = Math.min( ratio1, ratio2 );
				yratio = Math.max( ratio1, ratio2 );
			}
		}
		else 
		{
			if ( relangle <= (relmid / 2) ) 
			{
				yratio = Math.max( ratio1, ratio2 );
				xratio = Math.min( ratio1, ratio2 );
			}
			else
			{
				yratio = Math.min( ratio1, ratio2 );
				xratio = Math.max( ratio1, ratio2 );
			}
		}

		//might want to add a xratio * (xratio / 2) and yratio * (yratio / 2).
		var xdist = Math.round( distance * xratio ) * xop;
		var ydist = Math.round( distance * yratio ) * yop;

		var shadowCSSstr = "";
		if ( inset ) {
			shadowCSSstr += "inset ";
		}
		shadowCSSstr += xdist.toString() + "px ";
		shadowCSSstr += ydist.toString() + "px ";
		shadowCSSstr += blur.toString() + "px ";
		//spread.
		shadowCSSstr += "0px ";
		//color
		shadowCSSstr += Ps2CssUtils.rgbaObjToCSS( rgba );

		return( shadowCSSstr );
	},
	//angle: degrees, type: radial | linear
	gradientToCSS:function( angle, type, stops, linebreak ) 
	{
		var output = "";
		output += type + "-gradient(";
		if ( type != "radial" ) 
		{
			output += angle.toString() + "deg, ";
		}
		if ( linebreak ) {
			output += "\r";	
		}
		for ( var i = 0; i < stops.length; i++ ) {
			output += stops[i].css + " " + stops[i].location.toString() + "%";
			if ( i < ( stops.length - 1 ) ) {
				output += ", ";
				if ( linebreak )
				{	
					output += "\r";	
				}
			}
		}
		output +=  ")";
		return output;
	},
	rgbaToCSS:function( r,g,b,a ) 
	{
		var str = "rgba(" + ( r.toString() ) + "," + ( g.toString() ) + "," + ( b.toString() ) + "," + a.toString() + ")";
		return str;
	},
	rgbaObjToCSS:function( rgbaObj ) 
	{
		var str = "rgba(" + ( rgbaObj.red.toString() ) + "," + ( rgbaObj.green.toString() ) + "," + ( rgbaObj.blue.toString() ) + "," + rgbaObj.alpha.toString() + ")";
		return str;
	}
};
