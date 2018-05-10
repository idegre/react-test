import React, {Component} from 'react';
import '../style.css';
import RaisedButton from 'material-ui/RaisedButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Question from './question'

const numberOfQuestions=10;

class App extends Component{
	constructor(props) {
	  super(props);
	  this.state={
      started:false,
      currentAnswer:null,
      answerArray:[],
    };
	}

	componentDidMount(){
	}

  nextQuestion(){
    this.setState({questionNumber:this.state.questionNumber+1},()=>{
      this.makeMultipleQuestionArray(this.state.questions.results[this.state.questionNumber].correct_answer,this.state.questions.results[this.state.questionNumber].incorrect_answers);
    });
  }

  startQuiz(amount){
    fetch('https://opentdb.com/api.php?amount='+amount+'&type=multiple').then((response)=>{
      response.json().then((data)=>{
        this.setState({questions:data,started:true,questionNumber:0});
        this.makeMultipleQuestionArray(data.results[this.state.questionNumber].correct_answer,data.results[this.state.questionNumber].incorrect_answers);
        //here i need to start a watch
      });
    });
  }

  //returns a randomized array of buttons for multiple questions
  makeMultipleQuestionArray(correct,incorrect){
    var correctPos=Math.floor((Math.random() * 3) + 0);
    var incorrectVal=0;
    var obj;
    var arr=[];
    for(var i=0;i<=3;i++){
      if(i!=correctPos){
        arr.push(incorrect[incorrectVal]);
        incorrectVal++;
      }else{
        arr.push(correct)
      }
    }
    this.setState({currentCorrect:correctPos,currentAnswer:0,answerArray:arr});
    console.log()
  }

	render(){
    console.log(this.state);
    var item;
    if(!this.state.started){
      item=<RaisedButton label="Start" primary={true} className="startButton" onClick={()=>this.startQuiz(numberOfQuestions)}/>
    }else{
      var question=this.state.questions.results[this.state.questionNumber];
      var title=question.question.replace(/&amp/g,'&').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&#039;/g,"'").replace(/&eacute;/g,"Ë");
      var selectors=[];
      for (var i = 0; i<=this.state.answerArray.length-1; i++) {
        selectors.push(<RadioButton
        key={i}
        value={i}
        label={this.state.answerArray[i]}
        />);
      }
      item=<div>
      <h3 className="questionTitle">{title}</h3>
      <RadioButtonGroup defaultSelected={0} className="answerGroup" onChange={(value)=>{
        this.setState({currentAnswer:value});
      }}>
        {selectors}
      </RadioButtonGroup>
      <RaisedButton label="skip question" secondary={true} className="startButton" onClick={()=>this.nextQuestion()}/>
      </div>
    }
    return(
			<div className="container">
			  {item}
			</div>
		)
	}
}

export default App;