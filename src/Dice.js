import React, { useState, useEffect } from "react";
import _ from "lodash";
import "./Dice.css"
function Die({ die, clickHandler }) {
    return (
        <button
            className={"die" + (die.isLocked ? " locked" : " unlocked")}
            onClick={clickHandler}>{die.value}</button>
    )
}

function Dice() {
    const [dice, setDice] = useState([
        { ix: 0, isLocked: false, value: 1 },
        { ix: 1, isLocked: false, value: 1 },
        { ix: 2, isLocked: false, value: 1 },
        { ix: 3, isLocked: false, value: 1 },
        { ix: 4, isLocked: false, value: 1 }]
    );

    function pick(arr) {
        const ix = Math.floor(Math.random() * arr.length);
        return arr[ix];
    }
    function rerollUnlockeds() {
        const toRoll = [...dice].filter(die => !die.isLocked);
        const newDice = toRoll.map(die => rerollOne(die));
        setDice(newDice);
    }

    function rerollOne(die) {
        const newDie = { ...die };
        newDie.value = pick([1, 2, 3, 4, 5, 6]);
        return newDie;
    }
    function toggleLocked(die) {
        const newDice = [...dice];
        newDice[die.ix] = { ...die, isLocked: !die.isLocked };
        console.log(newDice);
        setDice(newDice);
    }
    const [lockedDice, liveDice] = _.partition(dice, (die) => die.isLocked);

    return (
        <div className="dice">
            <div className="live-dice">
                {
                    liveDice.map(die =>
                        <Die die={die} clickHandler={() => toggleLocked(die)}></Die>
                    )
                }
            </div>
            <div className="locked-dice">
                {
                    lockedDice.map(die =>
                        <Die die={die} clickHandler={() => toggleLocked(die)}></Die>
                    )
                }

            </div>
            <button onClick={rerollUnlockeds}>Re-roll</button>
        </div>
    )

}
export default Dice;