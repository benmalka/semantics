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



class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      group_a: [],
      group_name_a: 'A',
      group_b: [],
      group_name_b: 'B'
    }
    this.createGroup = this.createGroup.bind(this);
  }
  CheckIsIn(group_a, group_b){

  }
  createGroup(id, group_str){
    let data = this.state
    data['group_' + id] = group_str.split(',')
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
            <Group groupId='a' groupName={this.state.group_name_a} onChangeGroup={this.createGroup} onChangeGroupName={(name) => this.setState({group_name_a: name})}/>
            <Group groupId='b' groupName={this.state.group_name_b} onChangeGroup={this.createGroup} onChangeGroupName={(name) => this.setState({group_name_b: name})}/>
          </div>
          <div className='Calc-info'>
            <Info groupNameA={this.state.group_name_a} groupNameB={this.state.group_name_b} groupA={this.state.group_a} 
                  groupB={this.state.group_b}/>
          </div>
          <div className='Calc-calculator'>
            <Calculator groupNameA={this.state.group_name_a} groupNameB={this.state.group_name_b} groupA={this.state.group_a} 
                        groupB={this.state.group_b}/>
          </div>
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
        <input onChange={e => this.props.onChangeGroupName(e.target.value)} value={this.props.groupName}/>
        <a>{a}</a><input onChange={e => this.props.onChangeGroup(this.props.groupId,e.target.value)}/><a>{b}</a>
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
    if (groupA.length !== groupB.length && !groupA.every((item) => groupB.includes(item))) {
      this.symbol = NOT_EQ
    }
    else if (groupA.length === groupB.length && groupA.every((item) => groupB.includes(item))){
      this.symbol = EQ
    }
    else if (groupA.every((item) => groupB.includes(item))){
      this.symbol = SUBGROUP
    }
    else{
      this.symbol = NOT_SUBGROUP
    }
  }
  getSet(set){
    const {groupA, groupB} = this.props
    if (set.length === 0){
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
export default App;
