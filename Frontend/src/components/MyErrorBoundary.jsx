import React, { Component } from "react";

export default class MyErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  //This function gets called whenever it's children have an error.It's here to update the state.
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  //This function is to run certain code when error occurs.
  componentDidCatch(error, errorInfo) {
    console.log("Error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      //You can also take the fallback part as a prop
      // return this.props.fallback
      return (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            color: "white",
            backgroundColor: "#0a66c2",
            padding: "1rem",
            borderRadius: "0.65rem",
            fontSize: "2rem",
          }}
        >
          {this.props.fallback}
        </div>
      );
    }
    return this.props.children;
  }
}
