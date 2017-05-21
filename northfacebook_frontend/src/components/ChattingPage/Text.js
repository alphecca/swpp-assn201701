import React from 'react'
import PropTypes from 'prop-types'
//import { connect } from 'react-redux'
import './styles.css'

class Text extends React.Component {
    render() {
        // const timeId = "t"+this.props.text.id+"_time_field";
        // const createdTime = this.props.text.created_time;
        const writerId = "t"+this.props.text.id+"_writer_field";
        const username = this.props.text.writer;
        const textId = "t"+this.props.text.id+"_text_field";
        const textMessage = this.props.text.text;
        const componentId = "t"+this.props.text.id+"_field";

        return (
                <div id={componentId} className="Text">
                    <span id={writerId}>{username}</span>
                    : <span id={textId}>{textMessage}</span>
                </div>
            )
    }
}

Text.propTypes = {
    text: PropTypes.object,
}

export default Text
