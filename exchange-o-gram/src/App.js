import React, { Component } from 'react';
import dummyData from './dummy-data.js';
import SearchBar from './components/SearchBar/SearchBar.js';
import Authenticate from './authenticate/Authenticate.js';
import styled from 'styled-components';
//import './App.css';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 880px;
  margin: 0 auto;
`;

class App extends Component {
  constructor(){
    super();
    this.state = {
      posts: [],
      user: '',
      displayLoginWarning: false
    }

    window.onbeforeunload = this.saveData;
  }

  saveData = ()=>{
    localStorage.setItem("exchange_o_gram", JSON.stringify(this.state.posts));
  }

  componentDidMount(){
    const loadedData = JSON.parse(localStorage.getItem("exchange_o_gram"));
    
    let data;
    if(loadedData === null || loadedData.length === 0){
      data = dummyData;
    }

    else{
      data = loadedData;
    }

    // On first run and refresh show all containers
    data.forEach(obj=>{
      obj.isHidden = false;
    })

    this.setState({
      posts: data
    });
  }

  setUser = (username)=>{
    this.setState({
      user: username
    })
  }

  logoutUser = ()=>{
    this.setState({
      user: ''
    })
  }

  addNewComment = (comment, index)=>{
    const data = this.state.posts;
    const commentObj = {
      username: this.state.user,
      text: comment
    }
    data[index].comments.push(commentObj);
    this.setState({
      posts: data
    });
  }

  addLike = (index)=>{
    const data = this.state.posts;
    data[index].likes++;
    this.setState({
      posts: data
    })
  }

  searchPosts = (username)=>{
    if(!this.state.user){
      this.setState({
        displayLoginWarning: true
      })
      return;
    }
    const data = this.state.posts;
    data.forEach(obj=>{
      if(obj.username === username || username === 'all'){
        obj.isHidden = false;
      }
      else{
        obj.isHidden = true;
      }
    });
    this.setState({
      posts: data
    });
  }

  deleteComment = (postIndex, commentIndex)=>{
    const data = this.state.posts;
    data[postIndex].comments.splice(commentIndex, 1);
    this.setState({
      posts: data
    });
  }

  render() {
    return (
      <AppContainer>
        <SearchBar searchPosts={this.searchPosts} logoutUser={this.logoutUser}/>
        <Authenticate posts={this.state.posts} displayInfo={this.state.displayLoginWarning} addNewComment={this.addNewComment} addLike={this.addLike} searchPosts={this.searchPosts} deleteComment={this.deleteComment} setUser={this.setUser}/>
      </AppContainer>
    );
  }
}

export default App;
