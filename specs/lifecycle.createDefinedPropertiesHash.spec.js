/*jshint expr:true, strict:false*/
describe('#createDefinedPropertiesHash', function() {
    describe('GIVEN a sanitized structure struct', function() {
        var struct;
        beforeEach(function() {
            struct = {
                properties: {},
                interceptors: {}
            };
        });

        describe('AND a property a1 having a default value not writable', function() {
            var a1;
            beforeEach(function() {
                a1 = struct.properties.a1 = {
                    propName: 'a1',
                    value: 'v1',
                    writable: false
                };
            });
            describe('WHEN the defined properties are created', function() {
                var result;
                beforeEach(function() {
                    result = ceb._testing.createDefinedPropertiesHash(struct);
                });
                it('THEN the result is an object', function() {
                    expect(result).to.be.instanceOf(Object);
                });
                it('AND the defined property a1 has the value v1 and is readonly', function() {
                    expect(result.a1).to.be.eql({
                        enumerable: true,
                        configurable: false,
                        value: 'v1',
                        writable: false
                    });
                });
            });
        });

        describe('AND a property a1 having a default value', function() {
            var a1;
            beforeEach(function() {
                a1 = struct.properties.a1 = {
                    propName: 'a1',
                    value: 'v1'
                };
            });
            describe('WHEN the defined properties are created', function() {
                var result;
                beforeEach(function() {
                    result = ceb._testing.createDefinedPropertiesHash(struct);
                });
                it('THEN the result is an object', function() {
                    expect(result).to.be.instanceOf(Object);
                });
                it('AND the defined property a1 has the value v1 and is writable', function() {
                    expect(result.a1).to.be.eql({
                        enumerable: true,
                        configurable: false,
                        value: 'v1',
                        writable: true
                    });
                });
            });
        });

        describe('AND a property a1 having a setter and a getter', function() {
            var a1;
            beforeEach(function() {
                a1 = struct.properties.a1 = {
                    propName: 'a1',
                    set: sinon.spy(),
                    get: sinon.spy()
                };
            });
            describe('AND no interceptors', function() {
                describe('WHEN the defined properties are created', function() {
                    var result;
                    beforeEach(function() {
                        result = ceb._testing.createDefinedPropertiesHash(struct);
                    });
                    it('THEN the result is an object', function() {
                        expect(result).to.be.instanceOf(Object);
                    });
                    it('AND the defined property a1 is configurable and enumerable', function() {
                        expect(result.a1.enumerable).to.eq(true);
                        expect(result.a1.configurable).to.eq(false);
                    });
                    it('AND the defined property a1 has a setter', function() {
                        expect(result.a1.set).to.be.instanceOf(Function);
                        expect(result.a1.set).to.not.eq(a1.set);
                        expect(result.a1.set).to.not.eq(a1.set);
                    });
                    it('AND the defined property a1 has a getter', function() {
                        expect(result.a1.set).to.be.instanceOf(Function);
                        expect(result.a1.set).to.not.eq(a1.set);
                    });
                });
            });
            describe('AND interceptors for set and get', function() {
                beforeEach(function() {
                    struct.interceptors.a1 = {
                        set: [sinon.spy()],
                        get: [sinon.spy()]
                    };
                });
                describe('WHEN the defined properties are created', function() {
                    var result;
                    beforeEach(function() {
                        result = ceb._testing.createDefinedPropertiesHash(struct);
                    });
                    it('THEN the result is an object', function() {
                        expect(result).to.be.instanceOf(Object);
                    });
                    it('AND the defined property a1 is configurable and enumerable', function() {
                        expect(result.a1.enumerable).to.eq(true);
                        expect(result.a1.configurable).to.eq(false);
                    });
                    it('AND the defined property a1 has a setter', function() {
                        expect(result.a1.set).to.be.instanceOf(Function);
                        expect(result.a1.set).to.not.eq(a1.set);
                        expect(result.a1.set).to.not.eq(a1.set);
                    });
                    it('AND the defined property a1 has a getter', function() {
                        expect(result.a1.set).to.be.instanceOf(Function);
                        expect(result.a1.set).to.not.eq(a1.set);
                    });
                });
            });
        });

        describe('AND a property a1 bound an attribute', function() {
            var a1;
            beforeEach(function() {
                a1 = struct.properties.a1 = {
                    propName: 'a1',
                    attribute: true
                };
            });
            describe('WHEN the defined properties are created', function() {
                var result;
                beforeEach(function() {
                    result = ceb._testing.createDefinedPropertiesHash(struct);
                });
                it('THEN the result is an object', function() {
                    expect(result).to.be.instanceOf(Object);
                });
                it('AND the defined property a1 is configurable and enumerable', function() {
                    expect(result.a1.enumerable).to.eq(true);
                    expect(result.a1.configurable).to.eq(false);
                });
                it('AND the defined property a1 has a setter', function() {
                    expect(result.a1.set).to.be.instanceOf(Function);
                    expect(result.a1.set).to.not.eq(a1.set);
                    expect(result.a1.set).to.not.eq(a1.set);
                });
                it('AND the defined property a1 has a getter', function() {
                    expect(result.a1.set).to.be.instanceOf(Function);
                    expect(result.a1.set).to.not.eq(a1.set);
                });
            });
        });

        describe('AND a simply property', function() {
            var a1;
            beforeEach(function() {
                a1 = struct.properties.a1 = {
                    propName: 'a1'
                };
            });
            describe('WHEN the defined properties are created', function() {
                var result;
                beforeEach(function() {
                    result = ceb._testing.createDefinedPropertiesHash(struct);
                });
                it('THEN the defined property is enumerable but not configurable', function() {
                    expect(result.a1).to.eql({
                        configurable: false,
                        enumerable: true
                    });
                });
            });
        });

    });
});