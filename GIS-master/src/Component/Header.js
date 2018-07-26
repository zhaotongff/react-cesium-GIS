import React,{Component} from 'react'

class Header extends Component{
	render(){
		return(
			<header className="App-header">
	            <h1 className="App-title">白金组</h1>
	            <h3 className="App-title">gis可视化设计项目</h3>
	            <p className="App-logo-name">中国移动</p>
	            <span className='welcome'>欢迎你，admin</span>
	        </header>
		)
	}
}

export default Header