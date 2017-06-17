import React from 'react'
import AddArticle from './AddArticle.js'
import SignOut from '../TimeLinePage/SignOut.js'
import { connect } from 'react-redux'

class AddArticlePage extends React.Component {
    render(){
        if (!this.props.loading) {
            return (
                    <div>
                        <SignOut />
                    </div>
                    )
        }
      return(
            <div className="AddArticlePage">
              <SignOut />
              <AddArticle />
            </div>
      )
    }
}

let mapStateToProps = (state) => {
    return {
        loading: state.loading,
    }
}

AddArticlePage = connect(mapStateToProps)(AddArticlePage);

export default AddArticlePage;
