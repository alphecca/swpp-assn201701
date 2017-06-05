import React from 'react'
import Article from '../TimeLinePage/Article.js'
import {connect} from 'react-redux'

class ReplyList extends React.Component {
    render() {
        var i,j;
        const list = this.props.articles;
        var ll=list.length;
        var table = {}; // id -> index
        var ordered_list = {}; // parnet_index -> index
        var rendered_list = [];
        for(i=0;i<ll;i++){
          if(list[i].article.depth===1){
            table[list[i].id]=i;
            ordered_list[i]=[];
          }
          else{
            ordered_list[table[list[i].article.parent]].push(i);
          }
        }
        for(i in ordered_list){
          rendered_list.push(list[i]);
          var oll=ordered_list[i].length;
          for(j=0;j<oll;j++)
            rendered_list.push(list[ordered_list[i][j]]);
        }
        return (
                <div id="reply_list_field">
                <p>Reply List</p>
                {rendered_list.map(article => <Article key={article.id} id={"r"+article.id+"_field"} {...article}/>)}
                </div>
               )
    }
}

let mapStateToProps = (state) => {

    return {
        articles: Object.assign(state.articles).reverse().map(article => JSON.parse(JSON.stringify({
            article: article,
            id: article.id
        })))
    }
}

ReplyList = connect(mapStateToProps)(ReplyList)

export default ReplyList
