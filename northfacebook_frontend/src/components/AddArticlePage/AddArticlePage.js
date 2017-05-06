import React from 'react'
import AddArticle from './AddArticle.js'
import SignOut from './SignOut.js'

class AddArticlePage extends React.Component {
    render(){
      return(
            <div>
              <SignOut />
              <AddArticle />
            </div>
      )
    }
}

export default AddArticlePage;
