import React, { Component } from "react";

export default class MyErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log("Error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Oops! An error occured!</div>;
    }
    return this.props.children;
  }
}
