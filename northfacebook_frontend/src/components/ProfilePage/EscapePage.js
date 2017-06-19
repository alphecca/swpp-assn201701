import React from 'react'
import { connect } from 'react-redux'
import { toEscape } from '../../actions/index.js';
class EscapePage extends React.Component{
    render(){
        const onChangeSubmit = ()=>{
            this.props.onClick(this.props.profile_user);
        }
        return(
            <div className="Change">
                <h3>정말로 탈BOOK 하시겠습니까?</h3>
                <button type="submit" id="escape_book" onClick={onChangeSubmit}>탈BOOK!</button>
            </div>
        );
    }
}
let mapStateToProps = (state) => {
    return{
        profile_user:Object.assign(state.authorization).split(":")[0],
    }
}
let mapDispatchToProps = (dispatch) =>{
    return{
        onClick:(profuser)=>dispatch(toEscape(profuser)),
    }
}
export default EscapePage = connect(mapStateToProps, mapDispatchToProps)(EscapePage)

