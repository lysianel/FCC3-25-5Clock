import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faSyncAlt, faArrowCircleUp, faArrowCircleDown } from '@fortawesome/free-solid-svg-icons'


//Set up block // Session or Break 
const Setup = (props) => {
	return(
		<div className="setup">
			<div id={props.type + "-label"}>
				{props.type.charAt(0).toUpperCase()+props.type.slice(1)} Length
			</div>
			<div id={props.type + "-decrement"} onClick={props.decrease}>
				<FontAwesomeIcon className="icon" icon={faArrowCircleDown} />
			</div>
			<div id={props.type + "-length"}>
				{props.length}
			</div>
			<div id={props.type + "-increment"} onClick={props.increase}>
				<FontAwesomeIcon className="icon" icon={faArrowCircleUp} />
			</div>
		</div>
	)
}

// Timer block
const Timer = (props) => {
	//format the time left in mm:ss
	let minutes = Math.floor(props.timeLeft/60); 
	let seconds = (props.timeLeft - minutes *60);

	minutes = minutes < 10 ? ('0' + minutes) : minutes;
	seconds = seconds < 10 ? ('0' + seconds) : seconds;

	return(
		<div id="timer">
			<div id="timer-label">
				{props.currentType.toUpperCase()}
			</div>
			<div id="time-left">
				{minutes + ":" + seconds}
			</div>
		</div>
	)
}

// Default Settings
const defaultState = {
	sessionLength:25,
	breakLength:5,
	currentType:"session",
	timeLeft:25*60,
	run:false
}

// Clock Component 
class Clock extends Component{

	constructor(props){
		super(props);

		this.state=defaultState;

		this.increaseLength=this.increaseLength.bind(this);
		this.decreaseLength=this.decreaseLength.bind(this);
		this.startStop=this.startStop.bind(this);
		this.timeout=this.timeout.bind(this);
		this.time=this.time.bind(this);
		this.reset=this.reset.bind(this);

	}

	//increase session or break duration 
	increaseLength(event){
		if (event.currentTarget.id == "session-increment"){
			if (this.state.sessionLength < 60 ){
				this.setState({
					sessionLength:this.state.sessionLength + 1,
					timeLeft: this.state.timeLeft + 60
				})
			}
		}
		else {
			if (this.state.breakLength < 60 ){
				this.setState({
					breakLength:this.state.breakLength + 1,
				})
			}
		}
	}

	//decrease session or break duration 
	decreaseLength(event){
		if (event.currentTarget.id == "session-decrement"){
			if (this.state.sessionLength > 1 ){
				this.setState({
					sessionLength:this.state.sessionLength - 1,
					timeLeft: this.state.timeLeft - 60
				})
			}
		}
		else {
			if (this.state.breakLength > 1 ){
				this.setState({
					breakLength:this.state.breakLength - 1,
				})
			}
		}
	}

	//start and stop the timer
	startStop(){

			this.setState({
				run:!this.state.run
			})

			this.time();
	}

	// manage timeout : beep, change session/break, reset time and start timer
	timeout(){

		document.querySelector("audio").play();

		if (this.state.currentType ==="session"){
					this.setState({
						timeLeft:this.state.breakLength * 60, 
						currentType:"break"
					})
				}
				else {
					this.setState({
						timeLeft:this.state.sessionLength * 60, 
						currentType:"session"
					})
				}

		this.time();
		
	}

	//timer
	time(){
				
		let timer=window.setInterval(()=>{
			//run with enough time left
			if (this.state.timeLeft > 0 && this.state.run){
				this.setState({
					timeLeft: this.state.timeLeft-1,
				})
			}

			//timeout -> stop and switch to next type
			else if (this.state.timeLeft===0){
				clearInterval(timer);
				this.timeout();
			}

			//pause
			else {
				clearInterval(timer);
			}
		},1000);
	}

	//reset audio and state
	reset(){
		let audio = document.querySelector("audio")
		audio.pause();
		audio.currentTime=0;
		this.setState(defaultState);
	}

	render(){
		return(
			<div className="clock">
				<h1>25 + 5 Clock</h1>
				<Setup
					type="session"
					length={this.state.sessionLength} 
					increase={this.increaseLength}
					decrease={this.decreaseLength}
				/>
				<Setup
					type="break"
					length={this.state.breakLength} 
					increase={this.increaseLength}
					decrease={this.decreaseLength}
				/>
				<Timer 
					currentType={this.state.currentType}
					timeLeft= {this.state.timeLeft}
				/>
				<div id="start_stop" onClick={this.startStop}>
					<FontAwesomeIcon className="icon" icon={faPlay} />
					<FontAwesomeIcon className="icon" icon={faPause} />
				</div>
				<div id="reset" onClick={this.reset}>
					<FontAwesomeIcon className="icon" icon={faSyncAlt} />
				</div>
				<audio id="beep" src="https://raw.githubusercontent.com/lysianel/FCC3-25-5Clock/master/25_5_clock/public/beep.mp3"></audio>
			</div>
		);
	}
}

export default Clock;