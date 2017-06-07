import React from 'react'
import AddArticle from './AddArticle.js'
import SignOut from '../TimeLinePage/SignOut.js'

class AddArticlePage extends React.Component {
    render(){
      return(
            <div className="AddArticlePage">
              <SignOut />
              <AddArticle />
            </div>
      )
    }
}

export default AddArticlePage;
