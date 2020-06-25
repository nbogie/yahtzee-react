import React from "react"
import _ from "lodash";

function Die({ die, clickHandler, disabled }) {
    return (
        <button
            disabled={disabled}
            className={"die" + (die.isLocked ? " locked" : " unlocked")}
            onClick={clickHandler}>{die.value}</button>
    )
}

function Dice({ dice, gameInPlay, hasTurnStarted, numRerollsRemaining, toggleLocked, attemptReroll }) {
    const [lockedDice, liveDice] = _.partition(dice, (die) => die.isLocked);
    const canReroll = gameInPlay && numRerollsRemaining > 0;

    const rollWord = hasTurnStarted ? "Re-roll" : "Roll";


    return (

        <div className="dice">

            {
                !hasTurnStarted ?
                    (
                        <div className="unstarted-dice dice-box">
                            {
                                liveDice.map(die =>
                                    <Die
                                        key={die.ix}
                                        die={die}
                                        disabled={true}
                                        clickHandler={() => null}></Die>
                                )
                            }
                        </div>
                    ) : (
                        <>
                            <div className="live-dice dice-box">
                                {
                                    liveDice.map(die =>
                                        <Die
                                            disabled={false}
                                            key={die.ix}
                                            die={die}
                                            clickHandler={() => toggleLocked(die)}></Die>
                                    )
                                }
                            </div>
                            <div className="locked-dice dice-box">
                                {
                                    lockedDice.map(die =>
                                        <Die
                                            disabled={false}
                                            key={die.ix}
                                            die={die}
                                            clickHandler={() => toggleLocked(die)}></Die>
                                    )
                                }
                            </div>
                        </>
                    )
            }
            <button
                className="roll-button"
                disabled={!canReroll}
                onClick={attemptReroll}>{rollWord}
            </button>
            {rollWord + "s"} remaining: <span className="rerolls-remaining">{numRerollsRemaining}</span>

        </div >
    )

}

export default Dice;