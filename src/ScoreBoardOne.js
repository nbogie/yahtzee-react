import React from "react";
import "./YahtzeeApp.css"
import { scoresKeysUpper, scoresKeysLower } from "./Scoring";
const debugOn = false;

function ScoreBoardOne({ scores, suggestedScores, totals, acceptSuggestion, hasGameStarted, hasTurnStarted }) {
    function DebugPanel() {
        return (<>
            <div>{hasTurnStarted ? "turn started" : "turn not started"}</div>
            <div>{hasGameStarted ? "game started" : "game not started"}</div>
        </>
        );

    }
    const { topSum, grandTotal, bonus } = totals;
    return (
        <div className="scoreboard">
            {debugOn && <DebugPanel />}
            {

                scoresKeysUpper().map(k => (
                    <ScoreLine
                        key={k}
                        name={k}
                        value={scores[k]}
                        hasGameStarted={hasGameStarted}
                        hasTurnStarted={hasTurnStarted}
                        suggestedValue={suggestedScores[k]}
                        acceptSuggestion={acceptSuggestion}
                    ></ScoreLine>
                ))
            }
            <div className="score-line total-line overline">
                <span className="label">Sum</span>
                <span className="value">{topSum}</span>
            </div>
            <div className="score-line total-line  underline">
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
                        hasTurnStarted={hasTurnStarted}
                        suggestedValue={suggestedScores[k]}
                        acceptSuggestion={acceptSuggestion}
                    ></ScoreLine>
                ))
            }
            <div className="score-line total-line underline">
                <span className="label">Total</span>
                <span className="value">{grandTotal}</span>
            </div>
        </div>);
}

function ScoreLine({ name, value, suggestedValue, acceptSuggestion, hasGameStarted, hasTurnStarted }) {
    const fixed = value !== null;
    const unclickable = !hasGameStarted || !hasTurnStarted || fixed;
    const suggestedValueOrBlank = hasTurnStarted && suggestedValue > 0 ? suggestedValue : "";
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