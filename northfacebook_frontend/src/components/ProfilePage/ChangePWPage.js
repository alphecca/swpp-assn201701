import React from 'react';
import {connect} from 'react-redux';
import { toChangePW } from '../../actions/index.js';

class ChangePWPage extends React.Component {
    render() {
        const onChangeSubmit = () => {
            if(this.currpw.value === "")
                alert("Enter the current password");
            else if(this.newpw.value === "")
                alert("Enter the new password");
            else if(this.newpwre.value === "")
                alert("Enter the new password verification");
            else if(this.newpw.value !== this.newpwre.value)
                alert("New password does not match");
            else this.props.onClick(this.currpw.value, this.newpw.value)
        } 
        return (
                <div>
                    <div className="TimeLine">
                        <span>{this.props.profile_user}동무는 비밀번호를 바꾸는가?</span>
                        <br />
                        현재 비밀번호<input type="curr_pw" ref={ node=>{this.currpw = node;} } id="curr_pw" className="field" />
                        <br />
                        바꿀 비밀번호<input type="new_pw" ref={ node=> {this.newpw = node;}} id="new_pw" className="field" />
                        <br />
                        비밀번호 확인<input type="new_pw_RE" ref = { node =>{this.newpwre = node;} } id="new_pw_RE" className="field" />
                        <br />
                        <button type="submit" id="change_pw" onClick={onChangeSubmit}>바꾼다!</button>
                    </div>
                </div>
               )
    }
}

let mapStateToProps = (state) => {
    return {
        profile_user:Object.assign(state.authorization).split(":")[0],
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        onClick: (oldpw, newpw) => {
            console.log("ask for pw change");
            dispatch(toChangePW(oldpw, newpw));
        }
    }
}


export default ChangePWPage = connect(mapStateToProps)(ChangePWPage);

