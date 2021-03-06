const regex = require('../tools/regex');
const utils = require('../tools/utils');

// creates a new personal poll
async function createPersonal(db, display_name, theme, creator, duration, scope, image_1, image_2) {
    if (!regex.validateDatabase(db)) {
        return {
            code: 500,
            data: regex.getInvalidDatabaseResponse(db)
        };
    }

    if (!regex.validateDisplayName(display_name)) {
        return {
            code: 400,
            data: regex.getInvalidDisplayNameResponse(display_name)
        };
    }

    if (!regex.validateTheme(theme)) {
        return {
            code: 400,
            data: regex.getInvalidThemeResponse(theme)
        };
    }

    if (!regex.validateUsername(creator)) {
        return {
            code: 400,
            data: regex.getInvalidUsernameResponse(creator)
        };
    }

    duration = parseInt(duration);
    if (!regex.validateDuration(duration)) {
        return {
            code: 400,
            data: regex.getInvalidDurationResponse(duration)
        };
    }

    if (!regex.validateScope(scope)) {
        return {
            code: 400,
            data: regex.getInvalidScopeResponse(scope)
        };
    }

    // check if creator exists
    const creator_exists = await require('./User').usernameExists(db, creator);
    if (typeof creator_exists !== 'boolean') {
        return creator_exists;
    }

    if (!creator_exists) {
        return {
            code: 400,
            data: 'user does not exist: ' + creator
        };
    }

    // create start_time and end_time
    const start_time = utils.getDatetimeString();
    const end_time = utils.addMinutesToDatetime(start_time, duration);

    const result1 = await db('polls')
        .returning('id')
        .insert({
            display_name, theme,
            creator, duration, scope,
            image_1, image_2,
            state: 'active',
            type: 'personal',
            start_time, end_time
        })
        .catch(e => {
            return {
                code: 500,
                data: e.originalStack
            };
        });
    
    if (!!result1.code) {
        return result1;
    }

    const result2 = await require('./User').incrementPollsCreated(db, creator, 1);
    if (!!result2.code) {
        return result2;
    }

    return {
        code: 200,
        data: result1[0]
    };
}

// creates a new challenge poll
async function createChallenge(db, display_name, theme, creator, opponent, duration, scope, image) {
    if (!regex.validateDatabase(db)) {
        return {
            code: 500,
            data: regex.getInvalidDatabaseResponse(db)
        };
    }

    if (!regex.validateDisplayName(display_name)) {
        return {
            code: 400,
            data: regex.getInvalidDisplayNameResponse(display_name)
        };
    }

    if (!regex.validateTheme(theme)) {
        return {
            code: 400,
            data: regex.getInvalidThemeResponse(theme)
        };
    }

    if (!regex.validateUsername(creator)) {
        return {
            code: 400,
            data: regex.getInvalidUsernameResponse(creator)
        };
    }

    if (!regex.validateUsername(opponent)) {
        return {
            code: 400,
            data: regex.getInvalidUsernameResponse(opponent)
        };
    }

    duration = parseInt(duration);
    if (!regex.validateDuration(duration)) {
        return {
            code: 400,
            data: regex.getInvalidDurationResponse(duration)
        };
    }

    if (!regex.validateScope(scope)) {
        return {
            code: 400,
            data: regex.getInvalidScopeResponse(scope)
        };
    }

    if (creator === opponent) {
        return {
            code: 400,
            data: 'You cannot challenge yourself.'
        };
    }

    // check if creator exists
    const creator_exists = await require('./User').usernameExists(db, creator);
    if (typeof creator_exists !== 'boolean') {
        return creator_exists;
    }

    if (!creator_exists) {
        return {
            code: 400,
            data: 'user does not exist: ' + creator
        };
    }

    // check if opponent exists
    const opponent_exists = await require('./User').usernameExists(db, opponent);
    if (typeof opponent_exists !== 'boolean') {
        return opponent_exists;
    }

    if (!opponent_exists) {
        return {
            code: 400,
            data: 'user does not exist: ' + opponent
        };
    }

    // check to make sure the creator and opponent are friends
    const areFriends = await require('./Friend').areFriends(db, creator, opponent);
    if (!(typeof areFriends === 'boolean')) {
        return areFriends;
    }

    if (!areFriends) {
        return {
            code: 400,
            data: 'you can only send a challenge poll request to a friend'
        };
    }

    const result = await db('polls')
        .returning('id')
        .insert({
            display_name, theme,
            creator, opponent,
            duration, scope,
            image_1: image,
            type: 'challenge'
        })
        .catch(e => {
            return {
                code: 500,
                data: e.originalStack
            };
        });
    
    if (!!result.code) {
        return result;
    }

    return {
        code: 200,
        data: result[0]
    };
}

// returns all of your challenge requests
async function getChallengeRequests(db, username) {
    if (!regex.validateDatabase(db)) {
        return {
            code: 500,
            data: regex.getInvalidDatabaseResponse(db)
        };
    }

    if (!regex.validateUsername(username)) {
        return {
            code: 400,
            data: regex.getInvalidUsernameResponse(username)
        };
    }

    // check if username exists
    const username_exists = await require('./User').usernameExists(db, username);
    if (typeof username_exists !== 'boolean') {
        return username_exists;
    }

    if (!username_exists) {
        return {
            code: 400,
            data: 'user does not exist: ' + username
        };
    }

    const result = await db('polls')
        .where({
            opponent: username,
            state: 'pending',
            type: 'challenge'
        })
        .select('id', 'created_at', 'display_name', 'theme', 'creator', 'opponent', 'scope', 'duration')
        .catch(e => {
            return {
                code: 500,
                data: e.originalStack
            };
        });

    if (!!result.code) {
        return result;
    }

    return {
        code: 200,
        data: result
    };
}

// returns all of your challenge requests
async function getChallengeRequestsSent(db, username) {
    if (!regex.validateDatabase(db)) {
        return {
            code: 500,
            data: regex.getInvalidDatabaseResponse(db)
        };
    }

    if (!regex.validateUsername(username)) {
        return {
            code: 400,
            data: regex.getInvalidUsernameResponse(username)
        };
    }

    // check if username exists
    const username_exists = await require('./User').usernameExists(db, username);
    if (typeof username_exists !== 'boolean') {
        return username_exists;
    }

    if (!username_exists) {
        return {
            code: 400,
            data: 'user does not exist: ' + username
        };
    }

    const result = await db('polls')
        .where({
            creator: username,
            state: 'pending',
            type: 'challenge'
        })
        .select('id', 'created_at', 'display_name', 'theme', 'creator', 'opponent', 'scope', 'state', 'duration')
        .catch(e => {
            return {
                code: 500,
                data: e.originalStack
            };
        });

    if (!!result.code) {
        return result;
    }

    return {
        code: 200,
        data: result
    };
}

// rejects a challenge request
async function rejectChallengeRequest(db, id, username) {
    if (!regex.validateDatabase(db)) {
        return {
            code: 500,
            data: regex.getInvalidDatabaseResponse(db)
        };
    }

    if (!regex.validatePollId(id)) {
        return {
            code: 400,
            data: regex.getInvalidPollIdResponse(id)
        };
    }

    if (!regex.validateUsername(username)) {
        return {
            code: 400,
            data: regex.getInvalidUsernameResponse(username)
        };
    }

    // check if poll exists
    const poll_exists = await pollExists(db, id);
    if (typeof poll_exists !== 'boolean') {
        return poll_exists;
    }

    if (!poll_exists) {
        return {
            code: 400,
            data: 'no poll exists with id: ' + id
        };
    }

    // check if username exists
    const username_exists = await require('./User').usernameExists(db, username);
    if (typeof username_exists !== 'boolean') {
        return username_exists;
    }

    if (!username_exists) {
        return {
            code: 400,
            data: 'user does not exist: ' + username
        };
    }

    const result = await db('polls')
        .where({
            id,
            opponent: username,
            state: 'pending',
            type: 'challenge'
        })
        .del()
        .catch(e => {
            return {
                code: 500,
                data: e.originalStack
            };
        });
    
    if (!!result.code) {
        return result;
    }

    if (result !== 0) {
        return {
            code: 400,
            data: 'no pending challenge request found with id: ' + id
        };
    }

    return {
        code: 200,
        data: "success"
    };
}

// accepts a challenge request
async function acceptChallengeRequest(db, id, username, image) {
    if (!regex.validateDatabase(db)) {
        return {
            code: 500,
            data: regex.getInvalidDatabaseResponse(db)
        };
    }

    if (!regex.validatePollId(id)) {
        return {
            code: 400,
            data: regex.getInvalidPollIdResponse(id)
        };
    }

    if (!regex.validateUsername(username)) {
        return {
            code: 400,
            data: regex.getInvalidUsernameResponse(username)
        };
    }

    // check if poll exists
    const poll_exists = await pollExists(db, id);
    if (typeof poll_exists !== 'boolean') {
        return poll_exists;
    }

    if (!poll_exists) {
        return {
            code: 400,
            data: 'no poll exists with id: ' + id
        };
    }

    // check if username exists
    const username_exists = await require('./User').usernameExists(db, username);
    if (typeof username_exists !== 'boolean') {
        return username_exists;
    }

    if (!username_exists) {
        return {
            code: 400,
            data: 'user does not exist: ' + username
        };
    }

    const result = await db('polls')
        .where({
            id,
            opponent: username,
            state: 'pending',
            type: 'challenge'
        })
        .update({
            'image_2': image,
            state: 'ready'
        })
        .catch(e => {
            return {
                code: 500,
                data: e.originalStack
            };
        });

    if (!!result.code) {
        return result;
    }

    if (result !== 1) {
        return {
            code: 400,
            data: 'no pending challenge request found with id: ' + id
        };
    }

    return {
        code: 200,
        data: 'success'
    };
}

// returns all of your accepted challenge requests
async function getAcceptedChallengeRequests(db, username) {
    if (!regex.validateDatabase(db)) {
        return {
            code: 500,
            data: regex.getInvalidDatabaseResponse(db)
        };
    }

    if (!regex.validateUsername(username)) {
        return {
            code: 400,
            data: regex.getInvalidUsernameResponse(username)
        };
    }

    // check if username exists
    const username_exists = await require('./User').usernameExists(db, username);
    if (typeof username_exists !== 'boolean') {
        return username_exists;
    }

    if (!username_exists) {
        return {
            code: 400,
            data: 'user does not exist: ' + username
        };
    }

    const result = await db('polls')
        .where({
            creator: username,
            state: 'ready',
            type: 'challenge'
        })
        .select('id', 'created_at', 'display_name', 'theme', 'creator', 'opponent', 'scope', 'duration')
        .catch(e => {
            return {
                code: 500,
                data: e.originalStack
            };
        });

    if (!!result.code) {
        return result;
    }

    return {
        code: 200,
        data: result
    };
}

// starts a challenge poll
async function startChallenge(db, id, username) {
    if (!regex.validateDatabase(db)) {
        return {
            code: 500,
            data: regex.getInvalidDatabaseResponse(db)
        };
    }

    if (!regex.validatePollId(id)) {
        return {
            code: 400,
            data: regex.getInvalidPollIdResponse(id)
        };
    }

    if (!regex.validateUsername(username)) {
        return {
            code: 400,
            data: regex.getInvalidUsernameResponse(username)
        };
    }

    // check if poll exists
    const poll_exists = await pollExists(db, id);
    if (typeof poll_exists !== 'boolean') {
        return poll_exists;
    }

    if (!poll_exists) {
        return {
            code: 400,
            data: 'no poll exists with id: ' + id
        };
    }

    // check if username exists
    const username_exists = await require('./User').usernameExists(db, username);
    if (typeof username_exists !== 'boolean') {
        return username_exists;
    }

    if (!username_exists) {
        return {
            code: 400,
            data: 'user does not exist: ' + username
        };
    }

    // get poll duration
    const result0 = await db('polls')
        .where({
            id,
            creator: username,
            state: 'ready',
            type: 'challenge'
        })
        .select('duration')
        .catch(e => {
            return {
                code: 500,
                data: e.originalStack
            };
        });

    if (!!result0.code) {
        return result1;
    }

    if (result0.length !== 1) {
        return {
            code: 400,
            data: 'no ready challenge poll found with id: ' + id
        };
    }

    // create start_time and end_time
    const start_time = utils.getDatetimeString();
    const end_time = utils.addMinutesToDatetime(start_time, result0[0].duration);

    const result1 = await db('polls')
        .where({
            id,
            creator: username,
            state: 'ready',
            type: 'challenge'
        })
        .update({
            state: 'active',
            start_time, end_time
        })
        .catch(e => {
            return {
                code: 500,
                data: e.originalStack
            };
        });

    if (!!result1.code) {
        return result1;
    }

    if (result1 !== 1) {
        return {
            code: 400,
            data: 'no ready challenge poll found with id: ' + id
        };
    }
    
    const result2 = await require('./User').incrementPollsCreated(db, username, 1);
    if (!!result2.code) {
        return result2;
    }

    return {
        code: 200,
        data: 'success'
    };
}

// returns a list of private polls based on theme
async function searchPrivate(db, username, themes_query) {
    if (!regex.validateDatabase(db)) {
        return {
            code: 500,
            data: regex.getInvalidDatabaseResponse(db)
        };
    }

    if (!regex.validateUsername(username)) {
        return {
            code: 400,
            data: regex.getInvalidUsernameResponse(username)
        };
    }

    // check if username exists
    const username_exists = await require('./User').usernameExists(db, username);
    if (typeof username_exists !== 'boolean') {
        return username_exists;
    }

    if (!username_exists) {
        return {
            code: 400,
            data: 'user does not exist: ' + username
        };
    }

    if (!regex.validateThemesQuery(themes_query)) {
        return {
            code: 400,
            data: regex.getInvalidThemesQueryResponse(themes_query)
        };
    }

    // convert 'theme,theme,theme' into [theme, theme, theme]
    const themes = themes_query.split(',');

    // get a list of this user's friends by their username
    const friends = await require('./Friend').get(db, username);
    if (!!friends.code && friends.code !== 200) {
        return friends;
    }

    const friendUsernames = friends.data.map(f => f.username);
    friendUsernames.push(username);

    const result = await db('polls')
        .whereIn('theme', themes)
        .andWhere({
            state: 'active',
            scope: 'private'
        })
        .andWhere((builder) => {
            builder.
                whereIn('creator', friendUsernames)
                .orWhereIn('opponent', friendUsernames)
        })
        .select('id', 'created_at', 'display_name', 'theme', 'creator', 'opponent', 'image_1', 'image_2', 'votes_1', 'votes_2', 'state', 'type', 'duration', 'scope', 'start_time', 'end_time')
        .catch(e => {
            return {
                code: 500,
                data: e.originalStack
            };
        });

    if (!!result.code) {
        return result;
    }

    const addHistoryResult = await require('./Feed').addPollsHistory(db, username, result);
    if (!!addHistoryResult.code) {
        return addHistoryResult;
    }

    return {
        code: 200,
        data: addHistoryResult
    };
}

// returns a list of public polls based on theme
async function searchPublic(db, username, themes_query) {
    if (!regex.validateDatabase(db)) {
        return {
            code: 500,
            data: regex.getInvalidDatabaseResponse(db)
        };
    }

    if (!regex.validateUsername(username)) {
        return {
            code: 400,
            data: regex.getInvalidUsernameResponse(username)
        };
    }

    // check if username exists
    const username_exists = await require('./User').usernameExists(db, username);
    if (typeof username_exists !== 'boolean') {
        return username_exists;
    }

    if (!username_exists) {
        return {
            code: 400,
            data: 'user does not exist: ' + username
        };
    }

    if (!regex.validateThemesQuery(themes_query)) {
        return {
            code: 400,
            data: regex.getInvalidThemesQueryResponse(themes_query)
        };
    }

    const themes = themes_query.split(',');

    const result = await db('polls')
        .whereIn('theme', themes)
        .andWhere({
            state: 'active',
            scope: 'public'
        })
        .select('id', 'created_at', 'display_name', 'theme', 'creator', 'opponent', 'image_1', 'image_2', 'votes_1', 'votes_2', 'state', 'type', 'duration', 'scope', 'start_time', 'end_time')
        .catch(e => {
            return {
                code: 500,
                data: e.originalStack
            };
        });

    if (!!result.code) {
        return result;
    }

    const addHistoryResult = await require('./Feed').addPollsHistory(db, username, result);
    if (!!addHistoryResult.code) {
        return addHistoryResult;
    }

    return {
        code: 200,
        data: addHistoryResult
    };
}

// adds vote to poll choice
async function vote(db, id, username, vote) {
    if (!regex.validateDatabase(db)) {
        return {
            code: 500,
            data: regex.getInvalidDatabaseResponse(db)
        };
    }

    if (!regex.validatePollId(id)) {
        return {
            code: 400,
            data: regex.getInvalidPollIdResponse(id)
        };
    }

    if (!regex.validateUsername(username)) {
        return {
            code: 400,
            data: regex.getInvalidUsernameResponse(username)
        };
    }

    vote = parseInt(vote);
    if (!regex.validatePollVote(vote)) {
        return {
            code: 400,
            data: regex.getInvalidPollVoteResponse(vote)
        };
    }

    // check if poll exists
    const poll_exists = await pollExists(db, id);
    if (typeof poll_exists !== 'boolean') {
        return poll_exists;
    }

    if (!poll_exists) {
        return {
            code: 400,
            data: 'no poll exists with id: ' + id
        };
    }

    // check if username exists
    const username_exists = await require('./User').usernameExists(db, username);
    if (typeof username_exists !== 'boolean') {
        return username_exists;
    }

    if (!username_exists) {
        return {
            code: 400,
            data: 'user does not exist: ' + username
        };
    }

    // check to see if they're already voted on this poll
    const result1 = await db('history')
        .where({
            username,
            poll: id
        })
        .select('vote')
        .catch(e => {
            return {
                code: 500,
                data: e.originalStack
            };
        });

    if (!!result1.code) {
        return result1;
    }
    
    // if results exist, then this user has already voted on this poll
    if (result1.length > 0) {
        return {
            code: 400,
            data: 'already voted on poll: ' + id
        };
    }

    // increase the poll's respective vote count
    const result2 = await db('polls')
        .where({
            id,
            state: 'active'
        })
        .increment({
            votes_1: ((vote === 1)? 1 : 0),
            votes_2: ((vote === 2)? 1 : 0)
        })
        .catch(e => {
            return {
                code: 500,
                data: e.originalStack
            };
        });

    if (!!result2.code) {
        return result2;
    }

    if (result2 !== 1) {
        return {
            code: 400,
            data: 'no active poll exists with id: ' + id
        };
    }

    // store the user's new vote history
    const result3 = await db('history')
        .insert({
            username, vote,
            poll: id
        })
        .catch(e => {
            return {
                code: 500,
                data: e.originalStack
            };
        });
    
    if (!!result3.code) {
        return result3;
    }

    // get the creator and opponent of the poll
    const result4 = await db('polls')
        .where({
            id,
            state: 'active'
        })
        .select()
        .catch(e => {
            return {
                code: 500,
                data: e.originalStack
            };
        });

    if (!!result4.code) {
        return result4;
    }

    // increase the appropriate user's tiki_tally
    let result5 = {};
    if (result4[0].type === 'personal' || vote === 1) {
        result5 = await require('./User').incrementTikiTally(db, result4[0].creator, 1);
    } else {
        result5 = await require('./User').incrementTikiTally(db, result4[0].opponent, 1);
    }

    if (!!result5.code) {
        return result5;
    }

    return {
        code: 200,
        data: 'success'
    };
}

// returns a single poll's data by id
async function getById(db, username, id) {
    if (!regex.validateDatabase(db)) {
        return {
            code: 500,
            data: regex.getInvalidDatabaseResponse(db)
        };
    }

    if (!regex.validateUsername(username)) {
        return {
            code: 400,
            data: regex.getInvalidUsernameResponse(username)
        };
    }

    if (!regex.validatePollId(id)) {
        return {
            code: 400,
            data: regex.getInvalidPollIdResponse(id)
        };
    }

    // check if poll exists
    const poll_exists = await pollExists(db, id);
    if (typeof poll_exists !== 'boolean') {
        return poll_exists;
    }

    if (!poll_exists) {
        return {
            code: 400,
            data: 'no poll exists with id: ' + id
        };
    }

    // check if username exists
    const username_exists = await require('./User').usernameExists(db, username);
    if (typeof username_exists !== 'boolean') {
        return username_exists;
    }

    if (!username_exists) {
        return {
            code: 400,
            data: 'user does not exist: ' + username
        };
    }

    const result1 = await db('polls')
        .where('id', id)
        .select('id', 'created_at', 'display_name', 'theme', 'creator', 'opponent', 'image_1', 'image_2', 'votes_1', 'votes_2', 'state', 'type', 'duration', 'scope', 'start_time', 'end_time')
        .catch(e => {
            return {
                code: 500,
                data: e.originalStack
            };
        });

    if (!!result1.code) {
        return result1;
    }
    
    // if no results, then no poll exists with that id
    if (result1.length !== 1) {
        return {
            code: 400,
            data: 'no poll found with id: ' + id
        };
    }

    const poll = result1[0];

    // update poll to show whether or not the 
    // user calling this has already voted on it
    const result2 = await db('history')
        .where({
            username,
            poll: id
        })
        .select()
        .catch(e => {
            return {
                code: 500,
                data: e.originalStack
            };
        });

    if (!!result2.code) {
        return result2;
    }

    // if there is a result, then the user has already voted on it
    if (result2.length === 1) {
        poll.voted = result2[0].vote;
    }

    return {
        code: 200,
        data: poll
    };
}

// returns a list of polls created by a specific user
async function getByCreator(db, username_query) {
    if (!regex.validateDatabase(db)) {
        return {
            code: 500,
            data: regex.getInvalidDatabaseResponse(db)
        };
    }

    if (!regex.validateUsernameQuery(username_query)) {
        return {
            code: 400,
            data: regex.getInvalidUsernameQueryResponse(username_query)
        };
    }

    // check if username exists
    const username_exists = await require('./User').usernameExists(db, username_query);
    if (typeof username_exists !== 'boolean') {
        return username_exists;
    }

    if (!username_exists) {
        return {
            code: 400,
            data: 'user does not exist: ' + username_query
        };
    }

    const result = await db('polls')
        .where('creator', username_query)
        .select('id', 'created_at', 'display_name', 'theme', 'creator', 'opponent', 'image_1', 'image_2', 'votes_1', 'votes_2', 'state', 'type', 'duration', 'scope', 'start_time', 'end_time')
        .catch(e => {
            return {
                code: 500,
                data: e.originalStack
            };
        });

    if (!!result.code) {
        return result;
    }

    return {
        code: 200,
        data: result
    };
}

// returns true if a poll exists with the given id, false otherwise
async function pollExists(db, id) {
    const result = await db('polls')
        .where('id', id)
        .select()
        .catch(e => {
            return {
                code: 500,
                data: e.originalStack
            };
        });

    if (!!result.code) {
        return result;
    }

    return result.length === 1;
}

async function expirePolls(db) {
    const datetime = utils.getDatetimeString();

    // get all expired challenge polls to update user win_rate
    const result1 = await db('polls')
        .where({
            state: 'active',
            type: 'challenge'
        })
        .andWhere('end_time', '<', datetime)
        .select('id', 'creator', 'opponent', 'votes_1', 'votes_2')
        .catch(e => {
            return {
                code: 500,
                data: e.originalStack
            };
        });

    if (!!result1.code) {
        return result1;
    }

    // expire all types of polls
    const result2 = await db('polls')
        .where('state', 'active')
        .andWhere('end_time', '<', datetime)
        .update('state', 'expired')
        .catch(e => {
            return {
                code: 500,
                data: e.originalStack
            };
        });

    if (!!result2.code) {
        return result2;
    }

    for (let i=0; i<result1.length; i++) {
        const result3 = await db('users')
            .where('username', result1[i].creator)
            .increment({
                challenges_played: 1,
                challenges_won: ((result1[i].votes_1 >= result1[i].votes_2)? 1 : 0)
            })
            .catch(e => {
                return {
                    code: 500,
                    data: e.originalStack
                };
            });

        if (!!result3.code) {
            return result3;
        }

        const result4 = await db('users')
            .where('username', result1[i].opponent)
            .increment({
                challenges_played: 1,
                challenges_won: ((result1[i].votes_2 >= result1[i].votes_1)? 1 : 0)
            })
            .catch(e => {
                return {
                    code: 500,
                    data: e.originalStack
                };
            });

        if (!!result4.code) {
            return result4;
        }
    }

    return {
        code: 200,
        data: 'success'
    };
}

module.exports = {
    createPersonal, createChallenge,
    getChallengeRequests, getChallengeRequestsSent,
    rejectChallengeRequest,
    acceptChallengeRequest,
    getAcceptedChallengeRequests,
    startChallenge,
    searchPrivate, searchPublic,
    vote,
    getById, getByCreator,
    pollExists,
    expirePolls
}
