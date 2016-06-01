import React from 'react';
import {NotifsComponent} from 'redux-notif';

/*Styles*/
import 'flexboxgrid';
import '../styles/stylesheet.less';
import '../styles/variables.less';
import 'hint.css/hint.min.css';
/*Components*/
import MasterWidget from '../containers/widgets/MasterWidget.jsx';
import Navbar from '../containers/Navbar.jsx';
import Search from '../containers/Search.jsx';
import Footer from './Footer.jsx';
import Tabs from '../containers/Tabs.jsx';
import NewDataNotification from '../containers/NewDataNotification';

const App = (props) => {

	return (
		<div>
			<div className="row center-xs">
				<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
					<NotifsComponent top/>
					<NewDataNotification/>
					<div className="ribbon"></div>
					<Navbar></Navbar>
					<MasterWidget></MasterWidget>
				</div>

				<div className="col-xs-12 col-sm-10 col-md-10 col-lg-6">
					<Search/>

				</div>

			</div>

			<div className="row center-xs">
				<div className="content col-xs-12 col-sm-10 col-md-10 col-lg-8">
					<Tabs/>
					<div className="row center-xs">
						<div className="col-xs-12 col-sm-12 col-md-12 col-lg-8">
							{props.children}
						</div>
					</div>


				</div>
			</div>
			<Footer></Footer>
		</div>






	);

}

export default App;
