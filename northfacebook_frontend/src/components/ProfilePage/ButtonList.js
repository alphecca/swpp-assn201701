import React from 'react'
import { connect } from 'react-redux'
import { gotoFriend, addFriend, gotoWall } from '../../actions'
import ChangeIntroPage from './ChangeIntroPage.js';
import ChangePWPage from './ChangePWPage.js';
import EscapePage from './EscapePage.js';

class ButtonList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
           showComponent1 : false,
           showComponent2 : false,
           showComponent3 : false,
       };
    }
    render(){
        let curruser= this.props.curruser;
        let profuser= this.props.profuser;
        const onPostClick1 = () => {
            if("\""+curruser+"\"" !== JSON.stringify(profuser))
               alert("남의 려권 입니다.");
            else{
        //        this.props.onClick1();
                if(this.state.showComponent1) this.setState({showComponent1 : false,});
                else this.setState({showComponent1 : true,});
            }
        }
        const onPostClick2 = () => {
             if("\""+curruser+"\"" !== JSON.stringify(profuser))
                 alert("남의 려권 입니다.");
             else{
          //       this.props.onClick2()
                 if(this.state.showComponent2) this.setState({showComponent2 : false,});
                 else this.setState({showComponent2 : true,});
             }
        }
        const onPostClick3 = () => {
            if("\""+curruser+"\"" !== JSON.stringify(profuser))
                alert("탈Book할거면 너나해ㅡㅡ");
            else{
           //     this.props.onClick3()
                if(this.state.showComponent3) this.setState({showComponent3 : false,});
                else this.setState({showComponent3: true,});
            }
        }
        const onPostClick4 = () => {
            this.props.onClick4(profuser);
        }
        const onPostClick5 = () => {
            this.props.onClick5(profuser);
        }
        const onPostClick6 = () => {
            this.props.onClick6(profuser);
        }
        return(
            <div>
               <div id="profile_photo_field">
                   *TODO :profile_photo_field @ButtonList.js
               </div>
               <div id="change_pw_field">
                   <button id="change_pw_button_field" onClick={onPostClick1}>암호 바꾸기!</button>
                   {this.state.showComponent1 ? <ChangePWPage />: null }
               </div>
               <div id="change_detail_field">
                   <button id="change_detail_button_field" onClick={onPostClick2}>소개글 바꾸기!</button>
                   {this.state.showComponent2 ? <ChangeIntroPage />: null }
               </div>
               <div id="escape_account_field">
                   <button id="escape_account_button_field" onClick={onPostClick3}>이곳을 나가겠소!</button>
                   {this.state.showComponent3 ? <EscapePage /> : null }
               </div>
               <div id="friend_list_field">
                   <button id="friend_list_button_field" onClick={onPostClick4}>★나의 동무들★</button>
                   <button id="friend_add_button_field" onClick={onPostClick5}>동무 추가 요청</button>
               </div>
               <div id="goto_wall_field">
                   <button id="goto_wall_button_field" onClick={onPostClick6}>담벼락 보기</button>
               </div>
            </div>
        );
    }
}

let mapStateToProps = (state) => {
    return{
        curruser: Object.assign(state.authorization).split(":")[0],
        profuser: state.profile_user !== null ? Object.assign(state.profile_user.user) : null
    }
}

let mapDispatchToProps = (dispatch) => {
    return{
//        onClick1: () => dispatch(toChangePW()),
//        onClick2: () => dispatch(toChangeIntro()),
//        onClick3: () => dispatch(toEscape()),
        onClick4: (profuser) => dispatch(gotoFriend(profuser)),
        onClick5: (profuser) => dispatch(addFriend(profuser)),
        onClick6: (profuser) => dispatch(gotoWall(profuser))
    }
}
export default ButtonList = connect(mapStateToProps, mapDispatchToProps)(ButtonList)

