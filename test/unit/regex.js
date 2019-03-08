const assert = require('assert');

const regex = require('../../tools/regex');

describe('regex', () => {
    describe('database', () => {
		it('success', () => {
			assert(regex.validateDatabase({}));
		});
	});

	describe('email', () => {
		it('success', () => {
			assert(regex.validateEmail('griff170@purdue.edu'));
		});

		describe('syntax', () => {
			it('empty string', () => {
				assert(!regex.validateEmail(''));
			});

			it('no @', () => {
				assert(!regex.validateEmail('griff170purdue.edu'));
			});

			it('no local-part', () => {
				assert(!regex.validateEmail('@purdue.edu'));
			});
	
			it('no domain', () => {
				assert(!regex.validateEmail('griff170@'));
			});
		});

		describe('not a string', () => {
			it('nothing', () => {
				assert(!regex.validateEmail());
			});

			it('number', () => {
				assert(!regex.validateEmail(null));
			});

			it('undefined', () => {
				assert(!regex.validateEmail(undefined));
			});

			it('number', () => {
				assert(!regex.validateEmail(1));
			});

			it('array', () => {
				assert(!regex.validateEmail([]));
			});

			it('object', () => {
				assert(!regex.validateEmail({}));
			});
		});
	});

	describe('username', () => {
		it('success', () => {
			assert(regex.validateUsername('todd'));
		});

		it('too short', () => {
			assert(!regex.validateUsername('to'));
		});

		it('too long', () => {
			assert(!regex.validateUsername('toddtoddtoddtoddtoddt'));
        });
        
        describe('has whitespace', () => {
			it('space', () => {
                assert(!regex.validateUsername('todd todd'));
            });

            it('tab', () => {
                assert(!regex.validateUsername('todd\ttodd'));
            });

            it('newline', () => {
                assert(!regex.validateUsername('todd\ntodd'));
            });

            it('return carriage', () => {
                assert(!regex.validateUsername('todd\rtodd'));
            });

            it('form feed', () => {
                assert(!regex.validateUsername('todd\ftodd'));
            });
		});

		describe('not a string', () => {
			it('nothing', () => {
				assert(!regex.validateUsername());
			});

			it('number', () => {
				assert(!regex.validateUsername(null));
			});

			it('undefined', () => {
				assert(!regex.validateUsername(undefined));
			});

			it('number', () => {
				assert(!regex.validateUsername(1));
			});

			it('array', () => {
				assert(!regex.validateUsername([]));
			});

			it('object', () => {
				assert(!regex.validateUsername({}));
			});
		});
	});

	describe('display_name', () => {
		it('success', () => {
			assert(regex.validateDisplayName('todd'));
		});

		it('too short', () => {
			assert(!regex.validateDisplayName(''));
		});

		it('too long', () => {
			assert(!regex.validateDisplayName('toddtoddtoddtoddtoddtoddtoddtod'));
		});

		describe('not a string', () => {
			it('nothing', () => {
				assert(!regex.validateDisplayName());
			});

			it('number', () => {
				assert(!regex.validateDisplayName(null));
			});

			it('undefined', () => {
				assert(!regex.validateDisplayName(undefined));
			});

			it('number', () => {
				assert(!regex.validateDisplayName(1));
			});

			it('array', () => {
				assert(!regex.validateDisplayName([]));
			});

			it('object', () => {
				assert(!regex.validateDisplayName({}));
			});
		});
	});

	describe('password', () => {
		it('success', () => {
			assert(regex.validatePassword('1234567890'));
		});

		it('too short', () => {
			assert(!regex.validatePassword('1234567'));
		});

		it('too long', () => {
			assert(!regex.validatePassword('1234567890123456789012345678901'));
        });

        describe('has whitespace', () => {
			it('space', () => {
                assert(!regex.validatePassword('todd todd'));
            });

            it('tab', () => {
                assert(!regex.validatePassword('todd\ttodd'));
            });

            it('newline', () => {
                assert(!regex.validatePassword('todd\ntodd'));
            });

            it('return carriage', () => {
                assert(!regex.validatePassword('todd\rtodd'));
            });

            it('form feed', () => {
                assert(!regex.validatePassword('todd\ftodd'));
            });
		});

		describe('not a string', () => {
			it('nothing', () => {
				assert(!regex.validatePassword());
			});

			it('number', () => {
				assert(!regex.validatePassword(null));
			});

			it('undefined', () => {
				assert(!regex.validatePassword(undefined));
			});

			it('number', () => {
				assert(!regex.validatePassword(1));
			});

			it('array', () => {
				assert(!regex.validatePassword([]));
			});

			it('object', () => {
				assert(!regex.validatePassword({}));
			});
		});
    });
    
    describe('emoji', () => {
        it('success with emoji', () => {
			assert(regex.validateEmoji('🍆'));
		});

		it('success with string', () => {
			assert(regex.validateEmoji('eggplant'));
        });

        it('not an emoji', () => {
			assert(!regex.validateEmoji('todd'));
        });

		describe('not a string', () => {
			it('nothing', () => {
				assert(!regex.validateEmoji());
			});

			it('number', () => {
				assert(!regex.validateEmoji(null));
			});

			it('undefined', () => {
				assert(!regex.validateEmoji(undefined));
			});

			it('number', () => {
				assert(!regex.validateEmoji(1));
			});

			it('array', () => {
				assert(!regex.validateEmoji([]));
			});

			it('object', () => {
				assert(!regex.validateEmoji({}));
			});
		});
	});

	describe('username_query', () => {
		it('success', () => {
			assert(regex.validateUsernameQuery('todd'));
		});

		it('too short', () => {
			assert(!regex.validateUsernameQuery(''));
		});

		it('too long', () => {
			assert(!regex.validateUsernameQuery('toddtoddtoddtoddtoddt'));
        });
        
        describe('has whitespace', () => {
			it('space', () => {
                assert(!regex.validateUsernameQuery('todd todd'));
            });

            it('tab', () => {
                assert(!regex.validateUsernameQuery('todd\ttodd'));
            });

            it('newline', () => {
                assert(!regex.validateUsernameQuery('todd\ntodd'));
            });

            it('return carriage', () => {
                assert(!regex.validateUsernameQuery('todd\rtodd'));
            });

            it('form feed', () => {
                assert(!regex.validateUsernameQuery('todd\ftodd'));
            });
		});

		describe('not a string', () => {
			it('nothing', () => {
				assert(!regex.validateUsernameQuery());
			});

			it('number', () => {
				assert(!regex.validateUsernameQuery(null));
			});

			it('undefined', () => {
				assert(!regex.validateUsernameQuery(undefined));
			});

			it('number', () => {
				assert(!regex.validateUsernameQuery(1));
			});

			it('array', () => {
				assert(!regex.validateUsernameQuery([]));
			});

			it('object', () => {
				assert(!regex.validateUsernameQuery({}));
			});
		});
	});
});
