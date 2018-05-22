import React, { Component } from 'react';
import git_logo from './Git-Icon-Black.png';
import './App.css';

const EMPTY = String.fromCharCode(8709)
const NOT_SUBGROUP = String.fromCharCode(8836)
const SUBGROUP = String.fromCharCode(8834)
const EQ = '='
const NOT_EQ = String.fromCharCode(8800)
const UNION = String.fromCharCode(9697)
const INTERSECTION = String.fromCharCode(9696)
const MINOS = '-'
const OPERATOS = [UNION, INTERSECTION, MINOS]


class App extends Component {
  constructor(props){
    super(props)
    this.nextLetter = 'D'
    this.state = {
      groupId: ['A', 'B', 'C'],
      groups: {'A': [], 'B': [], 'C': []},
    }
  }
  createGroup(id, group_str){
    let data = this.state.groups
    data[this.state.groupId[id]] = group_str.split(',')
    this.setState({
      groups: data
    })
  }
  addNewGroup(){
    let tmp = this.state
    tmp.groupId.push(this.nextLetter)
    tmp.groups[this.nextLetter] = []
    this.nextLetter = String.fromCharCode(this.nextLetter.charCodeAt(0) + 1)
    this.setState(tmp)
  }
  changeGroupName(id, newName){
    let data = this.state
    if (data.groupId.includes(newName) && newName !== '') return;
    if (!Object.keys(data.groups).includes(data.groupId[id])) data.groups[data.groupId[id]] = [];
    data.groups[newName] = data.groups[data.groupId[id]]
    delete data.groups[data.groupId[id]]
    data.groupId[id] = newName
    this.setState(data)
  }
  renderGroup(item, index){
    return (<Group key={index + '10'} groupId={index} 
                   groupName={item} 
                   onChangeGroup={(id, str) => this.createGroup(id, str)} 
                   onChangeGroupName={(id, name) => this.changeGroupName(id, name)}/>)
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Semantics!!</h1>
        </header>
        <div className="Calc-main">
          <div className="Calc-params">
            {this.state.groupId.map((item, index) => this.renderGroup(item, index))}
            <button className='Group-add' onClick={() => this.addNewGroup()}>Add set</button>
          </div>
          <div className='Calc-info'>
            <Info groups={this.state.groups}/>
          </div>
          <EQWindow groups={this.state.groups}/>
        </div>
        <div style={{display: 'flex'}}>
          <a href='https://github.com/benmalka/semantics' className='Git-a' target="_blank" rel="noopener noreferrer">
            <div className='Git' >
              <img src={git_logo} style={{height: 25, width: 25}} alt=''/> Fork me on Github </div>
          </a>
        </div>
        <br/>
        <footer> Powered by BenMalka&trade;</footer>
      </div>
    );
  }
}

class Group extends Component{
  
  constructor(props){
    super(props)
    this.state = {
      set_name: null
    }
  }
  render(){
    const a = "Parameter {"
    const b = '}'
    return (
      <div className="input_div">
        <a>Name</a>
        <input className="Group-input-name" onChange={(e) => this.props.onChangeGroupName(this.props.groupId, e.target.value)} value={this.props.groupName}/>
        <a>{a}</a><input onChange={(e) => this.props.onChangeGroup(this.props.groupId,e.target.value)}/><a>{b}</a>
        <a>{this.state.set_name}</a>
      </div>
      )
  }
}

class Info extends Component{
  constructor(props){
    super(props)
    this.symbol = EQ
    this.state = {
      set_name: null
    }
  }
  checkIsIn(groupA, groupB){
    if ((groupA.length === groupB.length && groupA.every((item) => groupB.includes(item))) ||  (groupA.length === 1 && groupA[0] === '' && groupB.length === 0) || 
             (groupB.length === 1 && groupB[0] === '' && groupA.length === 0)){
      return EQ
    }
    else if (groupA.length !== groupB.length && !groupA.every((item) => groupB.includes(item))) {
      return NOT_EQ
    }
    else if (groupA.every((item) => groupB.includes(item))){
      return SUBGROUP
    }
    else{
      return NOT_SUBGROUP
    }
  }
  getSet(set){
    if (set.length === 0 || (set.length === 1 && set[0] === '')){
      return EMPTY
    }
    else{
      return `{${set.toString()}}`
    }
  }
  renderEqs(item, index){
    return (<div key={index + '-' + item} >
            {Object.keys(this.props.groups).map((_item, index) => {
              if (_item === item) return;
              return (<a key={index + '/' + item}>{`${item} ${this.checkIsIn(this.props.groups[item], this.props.groups[_item])} ${_item}; `}</a>) 
            })}
            </div>)
  }
  renderGroupValue(item, index){
    return (<a key={index}>{`${item} = ${this.getSet(this.props.groups[item])}`}</a>)
  }
  render(){
    return (
        <div className="Info-main">
          {Object.keys(this.props.groups).map((item, index) => this.renderGroupValue(item, index))}
          <br/>
          {Object.keys(this.props.groups).map((item, index) => this.renderEqs(item, index))}
        </div>
    )
  }
}

class EQWindow extends Component{
  constructor(props){
    super(props)
    this.state = {
      textbox: '',
    }
  }
  getGroup(group_name){
    return this.props.groups[group_name]
  }
  calculate(group_a, group_b, operator){
    let tmp;
    if (!group_a){
      group_a = []
    }
    if (!group_b){
      group_b = []
    }
    switch (operator){
      case INTERSECTION: {
        tmp = group_a.filter((val) => group_b.includes(val));
        break 
      }
      case MINOS: {
        tmp = group_a.filter((val) => !group_b.includes(val));
        break
      }
      case UNION: {
        tmp = group_a.concat(group_b);
        let tmp2 = [];
        tmp.forEach((val) => {
          if (!tmp2.includes(val)){
            tmp2.push(val);
          }
        })
        tmp = tmp2
        break
      }
      default:{
        tmp = group_a
        break
      }
    }
    return tmp
  }
  calucEQ(text){
    let group_a = null
    let group_b = null
    let operator = null
    for (let i = 0; i < text.length; i++){
      if (text[i] === '('){
        let res;
        if (group_a){
          res= this.calucEQ(text.slice(i+1))
          group_b = res[0]
          i += (res[1]+1)
        }
        else{
          res = this.calucEQ(text.slice(i+1))
          group_a = res[0]
          i += (res[1]+1)
        }
      }
      else if (text[i] === ')'){
        return [this.calculate(group_a, group_b, operator) , i]
      }
      else if (OPERATOS.includes(text[i])){
        operator = text[i]
      }
      else{
        if (group_a){
          group_b = this.getGroup(text[i])
        }
        else{
          group_a = this.getGroup(text[i])
        }
      }
    }
    return this.calculate(group_a, group_b, operator)
  }
  parseText(text){
    if (!text || typeof text !== 'object' || text.length === 0){
      return `= ${EMPTY}`
    }
    else{
      return `= {${text.toString()}}`
    }
  }
  addSymboleToText(text){
    let tb = this.refs.Eqtextbox
    let tmp_text = ''
    if (tb.selectionStart === tb.selectionEnd){
      tmp_text = this.state.textbox.substring(0, tb.selectionStart) + text + this.state.textbox.substring(tb.selectionStart)
    }
    else (
      tmp_text = this.state.textbox.substring(0, tb.selectionStart) + text + this.state.textbox.substring(tb.selectionEnd)
    )
    tb.focus()
    this.setState({
      textbox: tmp_text
    })
  }
  render(){
    let result = this.parseText(this.calucEQ(this.state.textbox))
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        <div className="Eq-main">
          <div style={{width: '50%',zIndex: '100', display: 'flex', flexDirection: 'row-reverse', margin: '0 0 0 57px'}}>
            <textarea className="Eq-textbox" 
                      ref='Eqtextbox' 
                      onChange={(e) => this.setState({textbox: e.target.value})} 
                      value={this.state.textbox}>{this.state.textbox}</textarea>
          </div>
          <div style={{width: '50%', display: 'flex', margin: '0 0 0 -120px'}}>
            <a style={{display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 0 0 120px'}}>{result}</a>
          </div>
        </div>
        <Keyborad keys={OPERATOS} onKeyStroke={(text) => this.addSymboleToText(text)}/>
      </div>
    )
  }
}

class Keyborad extends Component{
  renderKey(item, index){
    return (<button key={index} className='Keybox' onClick={() => this.props.onKeyStroke(item)}> {item}</button>)
  }
  render(){
    return(
      <div className="Keybox-main">
        {this.props.keys.map((item, index) => this.renderKey(item, index))}
      </div>
    )
  }

}

export default App;
