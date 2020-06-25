//someone else's online version is here: https://cardgames.io/yahtzee/


import React, { useState } from "react";

import ScoreBoardOne from "./ScoreBoardOne";
import HighScoresTable from "./HighScoresTable";
import Dice from "./Dice"

import { scoreDiceFor, scoresKeys, calculateTotalledScores, isYahtzee } from "./Scoring";
import { saveHighScore, loadHighScores, wipeHighScores } from "./localStorageUtils";

import "./YahtzeeApp.css"



function YahtzeeApp() {

    const isDebug = false;

    const MAX_REROLLS = 3;

    const [numRerollsRemaining, setNumRerollsRemaining] = useState(MAX_REROLLS);
    const [dice, setDice] = useState(makeInitialDice());
    const [scores, setScores] = useState(makeInitialScores());
    const [turnNumber, setTurnNumber] = useState(0);
    const [hasGameStarted, setHasGameStarted] = useState(false);

    const highScores = loadHighScores();

    function startNewGame() {
        setNumRerollsRemaining(MAX_REROLLS);
        setDice(makeInitialDice());
        setScores(makeInitialScores());
        setTurnNumber(0);
        setHasGameStarted(true);
    }

    function makeInitialDice() {
        return [
            { ix: 0, isLocked: false, value: randomDieValue() },
            { ix: 1, isLocked: false, value: randomDieValue() },
            { ix: 2, isLocked: false, value: randomDieValue() },
            { ix: 3, isLocked: false, value: randomDieValue() },
            { ix: 4, isLocked: false, value: randomDieValue() }
        ]
    }

    function makeInitialScores() {
        const res = {};
        scoresKeys().forEach(k => res[k] = null);
        return res;
    };

    function startNewTurn() {
        setNumRerollsRemaining(MAX_REROLLS);
        setTurnNumber(x => x + 1);
        unlockAllDice();
    }

    function isGameOver(withScores = scores) {
        return Object.values(withScores).every(v => v !== null);
    }

    function acceptSuggestion(scoreKey, scoreValue, diceValues) {
        const newScores = { ...scores };
        if (newScores[scoreKey] === null) {

            //If the dice show a yahtzee but you already scored one...
            if (isYahtzee(diceValues) && newScores["yahtzee"]) {
                //Award Bonus for second yahtzee
                //TODO: implement joker rules, too
                newScores["yahtzee"] += 100;
            }

            newScores[scoreKey] = scoreValue;

            setScores(newScores);
            if (isGameOver(newScores)) {
                const total = calculateTotalledScores(newScores).grandTotal;
                console.log("saving high scores from acceptSuggestion")
                saveHighScore(total);
            } else {
                startNewTurn();
            }

        }
    }

    function randomDieValue() {
        return pick([1, 2, 3, 4, 5, 6]);
    }

    function pick(arr) {
        const ix = Math.floor(Math.random() * arr.length);
        return arr[ix];
    }

    function attemptReroll() {
        if (numRerollsRemaining > 0) {
            rerollUnlockeds();
            //TODO: check double click can't sent this under zero by queueing updates
            setNumRerollsRemaining(old => old - 1);
        }
    }

    function rerollUnlockeds() {
        const newDice = [...dice];
        const toRoll = newDice.filter(die => !die.isLocked);
        const changedDice = toRoll.map(die => rerollOne(die));
        changedDice.forEach(die => newDice[die.ix] = die);
        setDice(newDice);
    }


    function cheatRollYahtzee() {
        const newDice = [...dice].map(die => { return { ...die, value: 1 } });
        setDice(newDice);
    }

    function unlockOne(die) {
        const newDie = { ...die };
        newDie.isLocked = false;
        return newDie;
    }

    function unlockAllDice() {
        const newDice = dice.map(die => unlockOne(die));
        setDice(newDice);
    }

    function rerollOne(die) {
        const newDie = { ...die };
        newDie.value = randomDieValue();
        return newDie;
    }

    function toggleLocked(die) {
        const newDice = [...dice];
        newDice[die.ix] = { ...die, isLocked: !die.isLocked };
        setDice(newDice);
    }


    const diceValues = dice.map(die => die.value);

    const suggestedScores = Object.fromEntries(Object.entries(scores).map(([k, v]) => [k, scoreDiceFor(k, diceValues)]));

    const totalledScores = calculateTotalledScores(scores);

    const hasTurnStarted = numRerollsRemaining !== MAX_REROLLS;
    return (
        <div className="yahtzee-app">
            <h1>Yahtzee</h1>
            <div className="container">
                <div className='pane left'>

                    <Dice
                        dice={dice}
                        gameInPlay={hasGameStarted && !isGameOver()}
                        numRerollsRemaining={numRerollsRemaining}
                        toggleLocked={toggleLocked}
                        attemptReroll={attemptReroll}
                        hasTurnStarted={hasTurnStarted}

                    />
                    <h3>{!hasGameStarted || isGameOver() ? <StartGameControl startGameFn={() => startNewGame()} /> : `Turn ${turnNumber}`}
                        {isGameOver() ? <GameOver /> : null}</h3>
                </div>

                <ScoreBoardOne
                    scores={scores}
                    totals={totalledScores}
                    hasGameStarted={hasGameStarted}
                    suggestedScores={suggestedScores}
                    acceptSuggestion={acceptSuggestion}
                    hasTurnStarted={hasTurnStarted}
                    diceValues={dice.map(die => die.value)}
                />
                <HighScoresTable highScores={highScores}
                    saveHighScoreNow={() => saveHighScore(totalledScores.grandTotal)}
                    wipeHighScores={wipeHighScores} />
                {isDebug && <button onClick={cheatRollYahtzee}>Cheat!</button>}
            </div>
        </div>
    );
}

function StartGameControl({ startGameFn }) {
    return (
        <div className="start-game-panel">
            <button onClick={startGameFn}>Start Game!</button>
        </div>
    )
}

function GameOver() {
    return <div><h2>Game Over</h2></div>
}



export default YahtzeeApp;