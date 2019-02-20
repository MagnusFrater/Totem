const router = require('express').Router();

const Auth = require('../Auth');
const utils = require('../../tools/utils');
const Friend = require('../../models/Friend');

router.post('/', Auth.validate, async (req, res) => {
    const data = {
        username_1: req.jwt.sub,
        username_2: req.body.friend_username
    };

    if (!utils.validateObject(data)) {
        const result = {
            code: 400,
            data: 'mandatory body parameters: friend_username'
        };
        res.status(result.code).send(result);
        return;
    }

    const result = await Friend.add(
        req.app.locals.db,
        data.username_1, data.username_2
    );

    res.status(result.code).send(result);
});

router.get('/requests', Auth.validate, async (req, res) => {
    const data = {
        username: req.jwt.sub
    };

    if (!utils.validateObject(data)) {
        const result = {
            code: 400,
            data: 'invalid JWT'
        };
        res.status(result.code).send(result);
        return;
    }

    const result = await Friend.requests(
        req.app.locals.db,
        data.username
    );

    res.status(result.code).send(result);
});

router.put('/', Auth.validate, async (req, res) => {
    const data = {
        username_1: req.jwt.sub,
        username_2: req.body.friend_username
    };

    if (!utils.validateObject(data)) {
        const result = {
            code: 400,
            data: 'mandatory body parameters: friend_username'
        };
        res.status(result.code).send(result);
        return;
    }

    const result = await Friend.accept(
        req.app.locals.db,
        data.username_1, data.username_2
    );

    res.status(result.code).send(result);
});

router.get('/', Auth.validate, async (req, res) => {
    const data = {
        username: req.jwt.sub
    };

    if (!utils.validateObject(data)) {
        const result = {
            code: 400,
            data: 'invalid JWT'
        };
        res.status(result.code).send(result);
        return;
    }

    const result = await Friend.get(
        req.app.locals.db,
        data.username
    );

    res.status(result.code).send(result);
});

router.delete('/', Auth.validate, async (req, res) => {
    const data = {
        username_1: req.jwt.sub,
        username_2: req.body.friend_username
    };

    if (!utils.validateObject(data)) {
        const result = {
            code: 400,
            data: 'mandatory body parameters: friend_username'
        };
        res.status(result.code).send(result);
        return;
    }

    const result = await Friend.remove(
        req.app.locals.db,
        data.username_1, data.username_2
    );

    res.status(result.code).send(result);
});

module.exports = router;
