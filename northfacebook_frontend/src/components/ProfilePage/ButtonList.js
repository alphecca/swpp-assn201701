import React from 'react'
import { connect } from 'react-redux'
import { toChangePW, toChangeDesc } from '../../actions/index.js'

class ButtonList extends React.Component{
    render(){
        let curruser= this.props.curruser;
        let profuser= this.props.profuser;
        const onPostClick1 = (curruser, profuser)=> {
            console.log("[1]curruser: "+curruser+"profuser"+profuser);
            if(curruser !== profuser)
               alert("You cannot change other's password");
            else
                this.props.onClick1()
        }
        const onPostClick2 = (curruser, profuser)=> {
             console.log("[2]curruser: "+curruser+"profuser"+profuser);
             if(curruser !== profuser )
                 alert("You cannot change other's details");
             else
                 this.props.onClick2()
        } 
        return(
            <div>
               <button id="change_pw_button_field" onClick={onPostClick1}>비밀번호 바꾸기</button>
               <button id="change_detail_button_field" onClick={onPostClick2}>소개글 바꾸기</button>
            </div>
        ); 
    }
}

//               <button id="change_photo_button_field" onClick={()=>alert("PHOTO")}>사진 바꾸기</button>
//               <button id="add_article_button_field" onClick={}>글작성하기</button>
//               <button id="remove_account_button_field" onClick={}>탈북하겠소</button>
//               <button id="friends_list_button_field" onClick={}>동무 목록</button>
//               <button id="friends_add_button_field" onClick={}>동무 요청</button>
//               <button id="friends_cancel_button_field" onClick={}>동무 해제</button>

let mapStateToProps = (state) => {
    return{
        curruser: Object.assign(state.authorization).split(":")[0],
        profuser: Object.assign(state.authorization).split(":")[0]//TODO 
    }
}

let mapDispatchToProps = (dispatch) => {
    return{
        onClick1: () => dispatch(toChangePW()),
        onClick2: () => dispatch(toChangeDesc())
    }
}

export default ButtonList = connect(undefined, mapDispatchToProps)(ButtonList)

