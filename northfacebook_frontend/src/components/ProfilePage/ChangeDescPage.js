import React from 'react'
import { connect } from 'react-redux'

class ChangeDescriptionPage extends React.Component{
    render(){
        return(
            <div>
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
        profile_user:Object.assign(state.authorization).split(":")[0],
    }
}

let mapDispatchToProps = (dispatch) => {
    return{
    }
}

export default ChangeDescriptionPage = connect(mapDispatchToProps)(ChangeDescriptionPage)

