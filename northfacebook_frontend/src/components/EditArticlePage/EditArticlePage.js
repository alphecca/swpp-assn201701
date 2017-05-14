import React from 'react'
import EditArticle from './EditArticle.js'
import SignOut from '../TimeLinePage/SignOut.js'
class EditArticlePage extends React.Component {
    render(){
      return(
            <div className="EditArticlePage">
              <SignOut />
              <EditArticle />
            </div>
      )
    }
}

export default EditArticlePage;
