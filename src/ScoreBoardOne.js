import React from "react";
import "./YahtzeeApp.css"
import { scoresKeysUpper, scoresKeysLower } from "./Scoring";

function ScoreBoardOne({ scores, suggestedScores, totals, acceptSuggestion, hasGameStarted }) {
    const { topSum, grandTotal, bonus } = totals;
    return (<div className="scoreboard">
        {

            scoresKeysUpper().map(k => (
                <ScoreLine
                    key={k}
                    name={k}
                    value={scores[k]}
                    hasGameStarted={hasGameStarted}
                    suggestedValue={suggestedScores[k]}
                    acceptSuggestion={acceptSuggestion}
                ></ScoreLine>
            ))
        }
        <div className="score-line total-line">
            <span className="label">Top Sum</span>
            <span className="value">{topSum}</span>
        </div>
        <div className="score-line total-line">
            <span className="label">Bonus</span>
            <span className="value">{bonus}</span>
        </div>
        {
            scoresKeysLower().map(k => (
                <ScoreLine
                    key={k}
                    name={k}
                    value={scores[k]}
                    hasGameStarted={hasGameStarted}
                    suggestedValue={suggestedScores[k]}
                    acceptSuggestion={acceptSuggestion}
                ></ScoreLine>
            ))
        }
        <div className="score-line total-line">
            <span className="label">Total</span>
            <span className="value">{grandTotal}</span>
        </div>
    </div>);
}

function ScoreLine({ name, value, suggestedValue, acceptSuggestion, hasGameStarted }) {
    const fixed = value !== null;
    const unclickable = !hasGameStarted || fixed;
    const suggestedValueOrBlank = suggestedValue > 0 ? suggestedValue : "";
    return <div className="score-line">
        <span className="label">{name}</span>
        <span
            className={fixed ? "value" : "suggested-value"}
            onClick={() => unclickable ? null : acceptSuggestion(name, suggestedValue)}
        >{
                hasGameStarted ? (fixed ? value : suggestedValueOrBlank) : null
            }</span>


    </div>
}
export default ScoreBoardOne;