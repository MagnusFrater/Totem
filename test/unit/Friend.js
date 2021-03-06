const assert = require('assert');

const db_tool = require('../../tools/db');
let db;

const User = require('../../models/User');
const Friend = require('../../models/Friend');

describe('Friend', () => {
	describe('add', () => {
		before(async () => {
            db = await db_tool.create(':memory:', true, false, true);

            const signup1 = await User.signup(db, 'griff170@purdue.edu', 'todd', 'goddtriffin', '12345678', 'eggplant', false);
            assert.strictEqual(signup1.code, 200, signup1.data);
            const signup2 = await User.signup(db, 'kplakyda@purdue.edu', 'kelp', 'keelpay', '87654321', 'eyes', false);
            assert.strictEqual(signup2.code, 200, signup2.data);
		});

		after(async () => {
			await db.destroy();
			db = null;
		});

		it('success', async () => {
			const result = await Friend.add(db, 'todd', 'kelp');
			assert.strictEqual(result.code, 200, result.data);
		});

		describe('validate parameters', () => {
			it('invalid database', async () => {
				const result = await Friend.add(null);
				assert.strictEqual(result.code, 500, result.data);
			});

			it('invalid username_1', async () => {
				const result = await Friend.add(db, null);
				assert.strictEqual(result.code, 400, result.data);
			});

			it('invalid username_2', async () => {
				const result = await Friend.add(db, 'null', null);
				assert.strictEqual(result.code, 400, result.data);
            });
		});
    });

    describe('requests', () => {
		before(async () => {
            db = await db_tool.create(':memory:', true, false, true);
            
            const signup1 = await User.signup(db, 'griff170@purdue.edu', 'todd', 'goddtriffin', '12345678', 'eggplant', false);
            assert.strictEqual(signup1.code, 200, signup1.data);
            const signup2 = await User.signup(db, 'kplakyda@purdue.edu', 'kelp', 'keelpay', '87654321', 'eyes', false);
            assert.strictEqual(signup2.code, 200, signup2.data);
            const signup3 = await User.signup(db, 'one@one.one', 'one', 'one_1', '12345678', 'one', false);
            assert.strictEqual(signup3.code, 200, signup3.data);
            const signup4 = await User.signup(db, 'two@two.two', 'two', 'two_2', '87654321', 'two', false);
            assert.strictEqual(signup4.code, 200, signup4.data);

            const friend1 = await Friend.add(db, 'todd', 'kelp');
            assert.strictEqual(friend1.code, 200, friend1.data);
            const friend2 = await Friend.add(db, 'todd', 'one');
            assert.strictEqual(friend2.code, 200, friend2.data);
		});

		after(async () => {
			await db.destroy();
			db = null;
		});

		it('success with zero friend requests', async () => {
            const result = await Friend.requests(db, 'two');

            assert.strictEqual(result.code, 200, result.data);
            assert.strictEqual(result.data.sent.length + result.data.received.length, 0, result.data);
        });
        
        it('success with one friend request', async () => {
            const result = await Friend.requests(db, 'kelp');

            assert.strictEqual(result.code, 200, result.data);
            assert.strictEqual(result.data.sent.length + result.data.received.length, 1, result.data);
        });
        
        it('success with two friend requests', async () => {
            const result = await Friend.requests(db, 'todd');

            assert.strictEqual(result.code, 200, result.data);
            assert.strictEqual(result.data.sent.length + result.data.received.length, 2, result.data);
		});

		describe('validate parameters', () => {
			it('invalid database', async () => {
				const result = await Friend.requests(null);
				assert.strictEqual(result.code, 500, result.data);
            });
            
            it('invalid username', async () => {
				const result = await Friend.requests(db, null);
				assert.strictEqual(result.code, 400, result.data);
			});
		});
    });

    describe('accept', () => {
		before(async () => {
            db = await db_tool.create(':memory:', true, false, true);
            
            const signup1 = await User.signup(db, 'griff170@purdue.edu', 'todd', 'goddtriffin', '12345678', 'eggplant', false);
            assert.strictEqual(signup1.code, 200, signup1.data);
            const signup2 = await User.signup(db, 'kplakyda@purdue.edu', 'kelp', 'keelpay', '87654321', 'eyes', false);
            assert.strictEqual(signup2.code, 200, signup2.data);

            const friend = await Friend.add(db, 'todd', 'kelp');
            assert.strictEqual(friend.code, 200, friend.data);
		});

		after(async () => {
			await db.destroy();
			db = null;
		});

		it('success', async () => {
			const result = await Friend.accept(db, 'kelp', 'todd');
			assert.strictEqual(result.code, 200, result.data);
		});

		describe('validate parameters', () => {
			it('invalid database', async () => {
				const result = await Friend.accept(null);
				assert.strictEqual(result.code, 500, result.data);
			});

			it('invalid username_1', async () => {
				const result = await Friend.accept(db, null);
				assert.strictEqual(result.code, 400, result.data);
			});

			it('invalid username_2', async () => {
				const result = await Friend.accept(db, 'null', null);
				assert.strictEqual(result.code, 400, result.data);
            });
		});
    });
    
    describe('get', () => {
		before(async () => {
            db = await db_tool.create(':memory:', true, false, true);
            
            const signup1 = await User.signup(db, 'griff170@purdue.edu', 'todd', 'goddtriffin', '12345678', 'eggplant', false);
            assert.strictEqual(signup1.code, 200, signup1.data);
            const signup2 = await User.signup(db, 'kplakyda@purdue.edu', 'kelp', 'keelpay', '87654321', 'eyes', false);
            assert.strictEqual(signup2.code, 200, signup2.data);
            const signup3 = await User.signup(db, 'one@one.one', 'one', 'one_1', '12345678', 'one', false);
            assert.strictEqual(signup3.code, 200, signup3.data);
            const signup4 = await User.signup(db, 'two@two.two', 'two', 'two_2', '87654321', 'two', false);
            assert.strictEqual(signup4.code, 200, signup4.data);

            const friend1 = await Friend.add(db, 'todd', 'kelp');
            assert.strictEqual(friend1.code, 200, friend1.data);
            const friend2 = await Friend.add(db, 'todd', 'one');
            assert.strictEqual(friend2.code, 200, friend2.data);

            const friend3 = await Friend.accept(db, 'kelp', 'todd');
            assert.strictEqual(friend3.code, 200, friend3.data);
            const friend4 = await Friend.accept(db, 'one', 'todd');
            assert.strictEqual(friend4.code, 200, friend4.data);
		});

		after(async () => {
			await db.destroy();
			db = null;
		});

		it('success with zero friends', async () => {
            const result = await Friend.get(db, 'two');
            
            assert.strictEqual(result.code, 200, result.data);
            assert.strictEqual(result.data.length, 0, result.data);
        });
        
        it('success with one friend', async () => {
            const result = await Friend.get(db, 'kelp');
            
            assert.strictEqual(result.code, 200, result.data);
            assert.strictEqual(result.data.length, 1, result.data);
        });
        
        it('success with two friends', async () => {
            const result = await Friend.get(db, 'todd');
            
            assert.strictEqual(result.code, 200, result.data);
            assert.strictEqual(result.data.length, 2, result.data);
		});

		describe('validate parameters', () => {
			it('invalid database', async () => {
				const result = await Friend.get(null);
				assert.strictEqual(result.code, 500, result.data);
            });
            
            it('invalid username', async () => {
				const result = await Friend.get(db, null);
				assert.strictEqual(result.code, 400, result.data);
			});
		});
    });

    describe('remove', () => {
		before(async () => {
            db = await db_tool.create(':memory:', true, false, true);

            const signup1 = await User.signup(db, 'griff170@purdue.edu', 'todd', 'goddtriffin', '12345678', 'eggplant', false);
            assert.strictEqual(signup1.code, 200, signup1.data);
            const signup2 = await User.signup(db, 'kplakyda@purdue.edu', 'kelp', 'keelpay', '87654321', 'eyes', false);
            assert.strictEqual(signup2.code, 200, signup2.data);
		});

		after(async () => {
			await db.destroy();
			db = null;
		});

		it('success', async () => {
            const friend = await Friend.add(db, 'todd', 'kelp');
            assert.strictEqual(friend.code, 200, friend.data);

			const result = await Friend.remove(db, 'todd', 'kelp');
			assert.strictEqual(result.code, 200, result.data);
		});

		describe('validate parameters', () => {
			it('invalid database', async () => {
				const result = await Friend.remove(null);
				assert.strictEqual(result.code, 500, result.data);
			});

			it('invalid username_1', async () => {
				const result = await Friend.remove(db, null);
				assert.strictEqual(result.code, 400, result.data);
			});

			it('invalid username_2', async () => {
				const result = await Friend.remove(db, 'null', null);
				assert.strictEqual(result.code, 400, result.data);
            });
		});
    });
});
