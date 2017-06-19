import React from 'react'
import Text from './Text.js'
import { connect } from 'react-redux'

class TextList extends React.Component {
    render() {
        const list = this.props.texts;
        return (
                <div id="text_list_field" className="TextList">
                {list.map(text => <Text key={text.id} {...text}/>)}
                </div>
               )
    }
}

let mapStateToProps = (state) => {
    console.log(state.load);
    return {
        texts: Object.assign(state.texts).slice(0,state.load+10).reverse().map(text => JSON.parse(JSON.stringify(
                            {
                                text: text,
                                id: text.id
                            }
                            )
                           )
                       )
    }
}

TextList = connect(mapStateToProps)(TextList)

export default TextList
