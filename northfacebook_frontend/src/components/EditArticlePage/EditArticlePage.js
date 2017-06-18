import React from 'react'
import EditArticle from './EditArticle.js'
import SignOut from '../TimeLinePage/SignOut.js'
import { connect } from 'react-redux'

class EditArticlePage extends React.Component {
    render(){
        if (!this.props.loading) {
            return (
                    <div>
                        <SignOut />
                    </div>
                    )
        }
        return(
            <div className="EditArticlePage">
              <SignOut />
              <EditArticle />
            </div>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        loading: state.loading,
    }
}

EditArticlePage = connect(mapStateToProps)(EditArticlePage);

export default EditArticlePage;
