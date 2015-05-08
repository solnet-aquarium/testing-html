var expect = require('chai').expect,
  validate = require('html-tag-validator'),
  fs = require('fs'),
  path = require('path'),
  walk = require('walk').walk;

describe('html validity', function(done) {
  it('should all be structurally valid', function(done) {
    this.timeout(20000);
    var walker = walk(path.join(__dirname, '/../src/'));

    walker.on('file', function(root, fileStats, walkerNext) {
      if (!/html$/.test(fileStats.name)) {
        return walkerNext();
      }

      var filePath = path.join(root, fileStats.name);
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
        if (error) {
          var message = "\n\n" + filePath + "\n\n" + error.message + "\nLine: " + error.line + " Column: " + error.column + "\n\n";
          expect(error).to.equal(null, message);
        }
      });
      walkerNext();
    });

    walker.on('end', function() {
      done();
    });
  });
});

