import React, {Component} from 'react';
import axios from 'axios';
import {notifActions} from 'redux-notif';
const {notifSend} = notifActions;
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

/*Components*/
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';


class Report extends Component {

    static propTypes = {
        victim: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {Negative: false, Verbal: false, Hate: false, Reason: ''}
    }

    submit() {

        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const config = {
            headers: {Authorization: token}
        };
        const URL = '/api/report/submit';
        axios.post(URL, {
            VictimEmail: this.props.victim.Author,
            Negative: this.state.Negative,
            Verbal: this.state.Verbal,
            Hate: this.state.Hate,
            Reason: this.state.Reason,
            Comment: this.props.victim.Text,
            ArticleId: this.props.aid
        }, config).then(response => {
            this.props.notif({message:'Thanks for reporting!', kind:'success' ,dismissAfter: 1000});
            this.props.handleReportClose();
        }).catch(err => {
            this.props.notif({message:'Please sign in', kind:'error', dismissAfter: 1000});
        })


    }

    toggleNegative() {
        this.setState({Negative: !this.state.Negative})
    }

    toggleVerbal() {
        this.setState({Verbal: !this.state.Verbal})
    }

    toggleHate() {
        this.setState({Hate: !this.state.Hate})
    }

    onCommentChange(e) {
        this.setState({Reason: e.target.value});
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.props.handleReportClose}
            />,
            <FlatButton
                label="Submit"
                disabled={this.state.Reason.length > 3 ? false : true}
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.submit.bind(this)}
            />
        ];

        return (

            <Dialog
                actions={actions}
                modal={false}
                open={this.props.open}
                onRequestClose={this.props.handleReportClose}>
                <h1>Report, <span style={{fontSize:'16px'}}>{this.props.victim.Author}</span></h1>
                <img src={`/api/userapi/getavatar?email=${this.props.victim.Author}`}
                     className="profile-avatar" style={{float:'right'}}/>
                <span className="divider"/>
                <List>
                    <ListItem
                        leftCheckbox={<Checkbox checked={this.state.Negative} onCheck={this.toggleNegative.bind(this)} />}
                        primaryText="Negative Attitude"
                        secondaryText="(Being passive aggressive)"
                    />
                    <ListItem
                        leftCheckbox={<Checkbox checked={this.state.Verbal} onCheck={this.toggleVerbal.bind(this)} /> }
                        primaryText="Verbal Abuse"
                        secondaryText="(Harassment, offensive language)"
                    />
                    <ListItem
                        leftCheckbox={<Checkbox checked={this.state.Hate} onCheck={this.toggleHate.bind(this)} /> }
                        primaryText="Hate Speech"
                        secondaryText="(Racism, sexism, homophobia, etc.)"
                    />
                </List>
                <TextField
                    floatingLabelText="Tell us exactly why"
                    errorText={this.state.Reason.length > 3 ? "" : "Required"}
                    multiLine={true}
                    rows={1}
                    value={this.state.Reason}
                    onChange={this.onCommentChange.bind(this)}
                />
            </Dialog>

        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        notif: bindActionCreators(notifSend, dispatch)
    }
}

export default connect(null, mapDispatchToProps)(Report)