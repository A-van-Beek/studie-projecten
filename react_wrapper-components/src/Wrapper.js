import "./Wrapper.css";

function Wrapper(props) {
    const classes = "wrapper " + props.className;

    return <div className={classes}>{props.children}</div>
}

export default Wrapper;