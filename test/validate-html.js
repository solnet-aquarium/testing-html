var expect = require('chai').expect,
    validate = require('html-tag-validator'),
    fs = require('fs'),
    path = require('path'),
    walk = require('walk').walkSync;

describe('html validity', function() {
    it('should all be structurally valid', function(done) {

        var fileCount = 0,
            validationCount = 0;

        walk(path.join(__dirname, '/../src/'), {
            listeners: {
                file: function(root, fileStats, walkerNext) {
                    if (!/html$/.test(fileStats.name)) {
                        return walkerNext();
                    }
                    fileCount += 1;
                    walkerNext();
                }
            }
        });

        walk(path.join(__dirname, '/../src/'), {
            listeners: {
                file: function(root, fileStats, walkerNext) {
                    if (!/html$/.test(fileStats.name)) {
                        return walkerNext();
                    }

                    var filePath = path.join(root, fileStats.name);
                    console.log(filePath);
                    content = fs.readFileSync(filePath, 'utf-8');
                    validate(content, {
                        attributes: {
                            _: {
                                mixed: [
                                    /^((ng\-)|(^\[[\S]+\]$)|(^\([\S]+\)$))/
                                ]
                            }
                        }
                    }, function(error) {
                        var message = null;
                        if (error) {
                            message = "\n\n" + filePath + "\n\n" + error.message + "\nLine: " + error.line + " Column: " + error.column + "\n\n";
                        }
                        expect(error).to.equal(null, message);
                    });
                    if (fileCount == validationCount) {
                        done();
                    }
                    walkerNext();
                }
            }
        });
    });
});
