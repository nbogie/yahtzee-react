import _ from "lodash";

const sum = (vs) => vs.reduce((acc, item) => acc + item, 0)
const identityFn = a => a;


export function scoresKeys() {
    return "ones twos threes fours fives sixes three-of-a-kind four-of-a-kind full-house small-straight large-straight chance yahtzee".split(" ");
}

export function scoresKeysUpper() {
    return scoresKeys().slice(0, 6);
}
export function scoresKeysLower() {
    return scoresKeys().slice(6);
}


const forNumber = (n, values) => {
    return sum(values.filter(v => v === n));
}
const forOnes = values => forNumber(1, values);
const forTwos = values => forNumber(2, values);
const forThrees = values => forNumber(3, values);
const forFours = values => forNumber(4, values);
const forFives = values => forNumber(5, values);
const forSixes = values => forNumber(6, values);
const forThreeOfAKind = values => hasNOfAKind(values, 3) ? sum(values) : 0;
const forFourOfAKind = values => hasNOfAKind(values, 4) ? sum(values) : 0;
const forYahtzee = values => hasNOfAKind(values, 5) ? 50 : 0; //TODO: fancy multiple-yahtzee rules
const forChance = sum;
const forFullHouse = (values) => {
    const groupSizes = _.sortBy(_.values(_.groupBy(values, identityFn)).map(gp => gp.length), identityFn);
    return (_.isEqual(groupSizes, [2, 3]) || _.isEqual(groupSizes, [5])) ? 25 : 0
}

const forSmallStraight = (values) => {
    const eligible = hasLargeStraight(values) || hasSmallStraight(values);
    return eligible ? 30 : 0
};

const forLargeStraight = (values) => {
    const eligible = hasLargeStraight(values);
    return eligible ? 40 : 0
};


const hasNOfAKind = (values, n) => _.max(_.values(_.groupBy(values, identityFn)).map(gps => gps.length)) >= n;


const hasLargeStraight = (values) => {
    const ordered = _.sortBy(_.uniq(values));
    return _.isEqual(ordered, [1, 2, 3, 4, 5]) || _.isEqual(ordered, [2, 3, 4, 5, 6]);
}

const hasSmallStraight = (values) => {
    if (hasLargeStraight(values)) {
        return true;
    }
    return (
        _.difference([1, 2, 3, 4], values).length === 0 ||
        _.difference([2, 3, 4, 5], values).length === 0 ||
        _.difference([3, 4, 5, 6], values).length === 0

    );
};

export const isYahtzee = values => hasNOfAKind(values, 5);

export function scoreDiceFor(key, values) {
    const lookup = {
        "ones": forOnes,
        "twos": forTwos,
        "threes": forThrees,
        "fours": forFours,
        "fives": forFives,
        "sixes": forSixes,
        "three-of-a-kind": forThreeOfAKind,
        "four-of-a-kind": forFourOfAKind,
        "full-house": forFullHouse,
        "small-straight": forSmallStraight,
        "large-straight": forLargeStraight,
        "yahtzee": forYahtzee,
        "chance": forChance,
    };
    const scoringFn = lookup[key] ?? (() => -1);

    return scoringFn(values);
};

export function calculateTotalledScores(scores) {
    const topSum = sum(scoresKeysUpper().map(k => scores[k]));
    const bonus = topSum >= 63 ? 35 : 0;
    const grandTotal = topSum + bonus + sum(Object.values(scores));
    return { grandTotal, topSum, bonus };
}