import { cyan700,
	teal500,
	redA200, grey400, grey500,
	white, blueGrey800, grey900, blueGrey400
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';

export default {
	spacing: {
		 iconSize: 28,
		 desktopGutter: 26,
		 desktopGutterMore: 34,
		 desktopGutterLess: 16,
		 desktopGutterMini: 10,
		 desktopKeylineIncrement: 64,
		 desktopDropDownMenuItemHeight: 32,
		 desktopDropDownMenuFontSize: 15,
		 desktopDrawerMenuItemHeight: 48,
		 desktopSubheaderHeight: 48,
		 desktopToolbarHeight: 56
	},
	fontFamily: 'Roboto, sans-serif',
	palette: {
		primary1Color: blueGrey800,
		primary2Color: grey900,
		primary3Color: blueGrey400,
		accent1Color: blueGrey400,
		accent2Color: grey500,
		accent3Color: blueGrey800,
		textColor: blueGrey800,
		alternateTextColor: blueGrey800,
		canvasColor: white,
		borderColor: grey400,
		disabledColor: fade(blueGrey800, 0.25),
		pickerHeaderColor: blueGrey800,
		clockCircleColor: fade(blueGrey800, 0.10),
		shadowColor: grey900
	},
		tabs: {
				backgroundColor: white
		},
		textField :{
				textColor: blueGrey800,
				hintColor: grey500
		}
}
