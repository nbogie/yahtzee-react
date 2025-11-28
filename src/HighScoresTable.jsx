import React from "react";
import moment from "moment";

const debugOn = false;

export default function HighScoresTable({ highScores, saveHighScoreNow, wipeHighScores }) {
    return (<div className="high-scores-table">
        <h3>High Scores</h3>
        {
            highScores.map(([score, date], ix) =>
                <HighScoreRow key={ix} score={score} date={date} />
            )
        }
        {debugOn && (
            <div className="high-scores-controls">
                <button onClick={saveHighScoreNow}>Save high score now! (debugging)</button>
                <button onClick={wipeHighScores}>Wipe ALL high score data! (debugging)</button>
            </div>)}
    </div>)
}

function HighScoreRow({ score, date }) {
    return (
        <div className='high-score-row'>
            <span className="high-score-value">{score}</span>
            <span className="high-score-date">{moment(date).fromNow()}</span>
        </div>
    )
}
