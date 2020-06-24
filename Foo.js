function Die({ value, clickHandler }) {
    return <button className="die" onClick={clickHandler}>{value}</button>
}