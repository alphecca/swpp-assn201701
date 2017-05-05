import React from 'react'
import {connect} from 'react-redux'

class Article extends React.Component {
    render() {
        return (
                <div>
                    <p id={this.props.writerId}>id: {this.props.username}</p>
                    <div id={this.props.textId} className="article_text">{this.props.articleText}</div>
                    <button id={this.props.likeButtonId} onClick={() => {alert(JSON.stringify(this.props.state))}}>Like</button>
                    <button id={this.props.editButtonId} onClick={this.props.onEditClick}>Edit</button>
                    <button id={this.props.deleteButtonId}>Delete</button>
                </div>
               )
    }
}

let mapStateToProps = (state) => {
    return {
        writerId: "writer",
        username: Object.assign(state.authorization).split(":")[0],
        textId: "text",
        articleText: "종강하고 싶다",
        likeButtonId: "like",
        editButtonId: "edit",
        deleteButtonId: "delete",
        state: Object.assign(state)
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        onEditClick: () => dispatch({type: 'SET_STATE', state: history.state})
    }
}

Article = connect(mapStateToProps, mapDispatchToProps)(Article)

export default Article
