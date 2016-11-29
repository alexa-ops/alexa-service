'use strict';

const _ = require('lodash');

const getTotalText = (total) => `The number of E C 2 instances currently is ${total}`;

const getServerlessText = () =>
    `You have no E C 2 instances running.
    Congratulations, you are now Serverless.`;

const getRunningText = (count) => `The number of E C 2 instances currently running is ${count}`;

const getCountText = (count) => {
    if(!count.groups) {
        return count.total > 0 ?
                getTotalText(count.total) :
                getServerlessText()
    }

    // maybe can be done by pickBy ??
    const runningGroup = _.find(count.groups, (g) => g.key === 'running');

    const runningCount = runningGroup ? runningGroup.value : 0;

    return runningCount > 0 ?
            getRunningText(runningCount) :
            getServerlessText()

}

module.exports = {
    getCountText,
}
