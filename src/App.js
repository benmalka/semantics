import React, { Component } from 'react';
import logo from './logo.svg';
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
  changeGroupName(id, newName){
    let data = this.state
    data.groups[newName] = data.groups[data.groupId[id]]
    delete data.groups[data.groupId[id]]
    data.groupId[id] = newName
    this.setState(data)
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Semantics!!</h1>
        </header>
        <div className="Calc-main">
          <div className="Calc-params">
            <Group groupId={0} groupName={this.state.groupId[0]} onChangeGroup={(id, str) => this.createGroup(id, str)} 
                   onChangeGroupName={(id, name) => this.changeGroupName(id, name)}/>
            <Group groupId={1} groupName={this.state.groupId[1]} onChangeGroup={(id, str) => this.createGroup(id, str)} 
                   onChangeGroupName={(id, name) => this.changeGroupName(id, name)}/>
            <Group groupId={2} groupName={this.state.groupId[2]} onChangeGroup={(id, str) => this.createGroup(id, str)} 
                   onChangeGroupName={(id, name) => this.changeGroupName(id, name)}/>
          </div>
          <div className='Calc-info'>
            <Info groupNameA={this.state.groupId[0]} groupNameB={this.state.groupId[1]} groupA={this.state.groups[this.state.groupId[0]]} 
                  groupB={this.state.groups[this.state.groupId[1]]}/>
          </div>
          {/*<div className='Calc-calculator'>
            <Calculator groupNameA={this.state.group_name_a} groupNameB={this.state.group_name_b} groupA={this.state.group_a} 
                        groupB={this.state.group_b}/>
    </div>*/}
          <EQWindow groups={this.state.groups}/>
        </div>
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
  checkIsIn(){
    const {groupA, groupB} = this.props;
    if ((groupA.length === groupB.length && groupA.every((item) => groupB.includes(item))) ||  (groupA.length === 1 && groupA[0] === '' && groupB.length === 0) || 
             (groupB.length === 1 && groupB[0] === '' && groupA.length === 0)){
      this.symbol = EQ
    }
    else if (groupA.length !== groupB.length && !groupA.every((item) => groupB.includes(item))) {
      this.symbol = NOT_EQ
    }
    else if (groupA.every((item) => groupB.includes(item))){
      this.symbol = SUBGROUP
    }
    else{
      this.symbol = NOT_SUBGROUP
    }
  }
  getSet(set){
    // const {groupA, groupB} = this.props
    if (set.length === 0 || (set.length === 1 && set[0] === '')){
      return EMPTY
    }
    // else if (set.length === groupA.length && set.every((val) => groupA.includes(val))){
    //   return this.props.groupNameA
    // }
    // else if (set.length === groupB.length && set.every((val) => groupB.includes(val))){
    //   return this.props.groupNameB
    // }
    else{
      return `{${set.toString()}}`
    }
  }
  render(){
    this.checkIsIn()

    return (
        <div className="Info-main">
          <a>{`${this.props.groupNameA} = ${this.getSet(this.props.groupA)}`}</a>
          <a>{`${this.props.groupNameB} = ${this.getSet(this.props.groupB)}`}</a>
          <a>{`${this.props.groupNameA} ${this.symbol} ${this.props.groupNameB}`}</a>
        </div>
    )
  }
}

class Calculator extends Component{
  constructor(props){
    super(props)
    this.operators = [UNION, INTERSECTION, MINOS]
    this.state = {
      score: EMPTY
    }
  }
  calcScore(operator){
    const {groupA, groupB} = this.props
    let tmp;
    switch (operator){
      case INTERSECTION: {
        tmp = groupA.filter((val) => groupB.includes(val));
        break 
      }
      case MINOS: {
        tmp = groupA.filter((val) => !groupB.includes(val));
        break
      }
      case UNION: {
        tmp = groupA.concat(groupB);
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
        break
      }
    }
    if (tmp.length === 0){
      tmp = EMPTY
    }
    else if (tmp.every((val) => groupA.includes(val)) && tmp.length === groupA.length){
      tmp = this.props.groupNameA
    }
    else if (tmp.every((val) => groupB.includes(val)) && tmp.length === groupB.length){
      tmp = this.props.groupNameB
    }
    this.setState({
      score: tmp
    })
  }
  rednerOption(val, index){
    return(<option key={index} value={val}>{val}</option>)
  }
  componentDidMount(){
    this.calcScore(UNION)
  }
  render(){
    const a = typeof this.state.score === 'object' ? `= {${this.state.score.toString()}}` : `= ${this.state.score.toString()}`
    return (
      <div>
        <a>{this.props.groupNameA} </a>
        <select onChange={(e) => this.calcScore(e.target.value)}>
          {this.operators.map((val, index) => this.rednerOption(val, index))}
        </select>
        <a> {this.props.groupNameB} </a>
        <a>{a}</a>
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
    this.setState({
      textbox: this.state.textbox + text
    })
  }
  render(){
    let result = this.parseText(this.calucEQ(this.state.textbox))
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        <div className="Eq-main">
          <div style={{width: '50%',zIndex: '100', display: 'flex', flexDirection: 'row-reverse', margin: '0 0 0 120px'}}>
            <textarea className="Eq-textbox" onChange={(e) => this.setState({textbox: e.target.value})} value={this.state.textbox}>{this.state.textbox}</textarea>
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
