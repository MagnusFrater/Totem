const assert = require('assert');

const db_tool = require('../../tools/db');
let db;

const User = require('../../models/User');
const Friend = require('../../models/Friend');

describe('Friend', () => {
	describe('add', () => {
		before(async () => {
            db = await db_tool.create(':memory:', true, false, true);

            await User.signup(db, 'griff170@purdue.edu', 'todd', 'goddtriffin', '12345678', 'eggplant');
            await User.signup(db, 'kplakyda@purdue.edu', 'kelp', 'keelpay', '87654321', 'eyes');
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
    
    describe('remove', () => {
		before(async () => {
            db = await db_tool.create(':memory:', true, false, true);

            await User.signup(db, 'griff170@purdue.edu', 'todd', 'goddtriffin', '12345678', 'eggplant');
            await User.signup(db, 'kplakyda@purdue.edu', 'kelp', 'keelpay', '87654321', 'eyes');
		});

		after(async () => {
			await db.destroy();
			db = null;
		});

		it('success', async () => {
            await Friend.add(db, 'todd', 'kelp');

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
    
    describe('get', () => {
		before(async () => {
            db = await db_tool.create(':memory:', true, false, true);
            
            await User.signup(db, 'griff170@purdue.edu', 'todd', 'goddtriffin', '12345678', 'eggplant');
            await User.signup(db, 'kplakyda@purdue.edu', 'kelp', 'keelpay', '87654321', 'eyes');
            await User.signup(db, 'test1@test1.test1', 'test', 'test_one', '12345678', 'a');
            await User.signup(db, 'test2@test2.test2', 'test2', 'test_two', '87654321', 'a');

            await Friend.add(db, 'todd', 'kelp');
            await Friend.add(db, 'todd', 'test');
		});

		after(async () => {
			await db.destroy();
			db = null;
		});

		it('success with zero friends', async () => {
            const result = await Friend.get(db, 'test2');
            console.log(result);
            assert.strictEqual(result.code, 200, result.data);
            assert.strictEqual(result.data.length, 0, result.data);
        });
        
        it('success with one friend', async () => {
            const result = await Friend.get(db, 'kelp');
            console.log(result);
            assert.strictEqual(result.code, 200, result.data);
            assert.strictEqual(result.data.length, 1, result.data);
        });
        
        it('success with two friends', async () => {
            const result = await Friend.get(db, 'todd');
            console.log(result);
            assert.strictEqual(result.code, 200, result.data);
            assert.strictEqual(result.data.length, 2, result.data);
		});

		describe('validate parameters', () => {
			it('invalid database', async () => {
				const result = await Friend.get(null);
				assert.strictEqual(result.code, 500, result.data);
            });
            
            it('invalid username', async () => {
				const result = await Friend.remove(db, null);
				assert.strictEqual(result.code, 400, result.data);
			});
		});
    });
    
    describe('requests', () => {
		before(async () => {
			db = await db_tool.create(':memory:', true, false, true);
		});

		after(async () => {
			await db.destroy();
			db = null;
		});

		it.skip('success', async () => {
			const result = await Friend.requests(db);
			assert.strictEqual(result.code, 200, result.data);
		});

		describe('validate parameters', () => {
			it('invalid database', async () => {
				const result = await Friend.requests(null);
				assert.strictEqual(result.code, 500, result.data);
			});
		});
    });
    
    describe('respond', () => {
		before(async () => {
			db = await db_tool.create(':memory:', true, false, true);
		});

		after(async () => {
			await db.destroy();
			db = null;
		});

		it.skip('success', async () => {
			const result = await Friend.respond(db);
			assert.strictEqual(result.code, 200, result.data);
		});

		describe('validate parameters', () => {
			it('invalid database', async () => {
				const result = await Friend.respond(null);
				assert.strictEqual(result.code, 500, result.data);
			});
		});
    });
});
