import React, {Component} from 'react';
import '../style.css';
import RaisedButton from 'material-ui/RaisedButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

const numberOfQuestions=10;

class App extends Component{
	constructor(props) {
	  super(props);
	  this.state={
      started:false,
      currentAnswer:null,
      answerArray:[],
      done:false,
      score:0,
    };
	}

  nextQuestion(){
    if(this.state.currentAnswer === this.state.currentCorrect){
      this.setState({score:this.state.score+1});
    }
    const qN=this.state.questionNumber+1
    if(qN<=numberOfQuestions-1){
      this.setState({questionNumber:qN,currentAnswer:0},()=>{
        this.makeMultipleQuestionArray(this.state.questions.results[this.state.questionNumber].correct_answer,this.state.questions.results[this.state.questionNumber].incorrect_answers);
      });
    }else{
      this.setState({done:true,started:false});
    }
  }

  startQuiz(amount){
    fetch('https://opentdb.com/api.php?amount='+amount+'&type=multiple').then((response)=>{
      response.json().then((data)=>{
        var d = new Date();
        var time = d.getTime();
        this.setState({questions:data,started:true,questionNumber:0,startTime:time,done:false,score:0,currentAnswer:null});
        this.makeMultipleQuestionArray(data.results[this.state.questionNumber].correct_answer,data.results[this.state.questionNumber].incorrect_answers);
        
      });
    });
  }

  //returns a randomized array of buttons for multiple questions
  makeMultipleQuestionArray(correct,incorrect){
    var correctPos=Math.floor((Math.random() * 3) + 0);
    var incorrectVal=0;
    var obj;
    var arr=[];
    for(var i = 0; i <= 3; i++) {
      if(i !== correctPos){
        obj=incorrect[incorrectVal].replace(/&amp/g,'&').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&#039;/g,"'").replace(/&eacute;/g,"Ë");
        arr.push(obj);
        incorrectVal++;
      }else{
        obj=correct.replace(/&amp/g,'&').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&#039;/g,"'").replace(/&eacute;/g,"Ë");
        arr.push(obj);
      }
    }
    console.log('arr:',arr)
    this.setState({currentCorrect:correctPos,currentAnswer:0,answerArray:arr});
  }

	render(){
    console.log(this.state);
    var item;
    if(!this.state.started){
      if(this.state.done){
        var d = new Date();
        var time = d.getTime();
        item=<div className="scoreBoard">
          <h2>You finished!</h2>
          <h1>Your score: {this.state.score}</h1>
          <h2>It took you: {(((time-this.state.startTime)/1000)/60).toFixed(2)} minutes</h2>
          <RaisedButton label="Play again" primary={true} className="startButton" onClick={()=>this.startQuiz(numberOfQuestions)}/>
        </div>
      }else{
        item=<RaisedButton label="Start" primary={true} className="startButton" onClick={()=>this.startQuiz(numberOfQuestions)}/>
      }
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
        <div>question {this.state.questionNumber+1}/{numberOfQuestions}</div>
        <h3 className="questionTitle">{title}</h3>
        <RadioButtonGroup className="answerGroup" defaultSelected="0" onChange={(value)=>{
          this.setState({currentAnswer:value});
        }}>
          {selectors}
        </RadioButtonGroup>
        <div>
          <RaisedButton label="next question" primary={true} className="startButton" onClick={()=>this.nextQuestion()}/>
        </div>
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