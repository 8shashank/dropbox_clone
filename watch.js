
module.exports = (function() {

    var sync = require('./lib/sync/sync');
    var chokidar = require('chokidar');

    function Watcher(config, dir1, dir2, pipeline) {

        if (typeof dir !== 'string')
          throw new TypeError('directory argument required');

        if (typeof onChange !== 'function')
          throw new TypeError('onChange must be a function');

        this.checkForChanges = function() {
            sync.compare(dir1, dir2,
                    sync.filesMatchNameAndSize, function(rslt) {
                rslt.srcPath = dir1;
                rslt.trgPath = dir2;
                pipeline.exec(rslt);
            });
        }

        function changeDetected(path, config) {
            onChange(path, config);
            console.log('Watcher detected ', change, ' at path ', path);
            self.checkForChanges();
        }

        chokidar.watch(dir, config)
          .on('all', changeDetected)
          .on('error', function(error) {
            console.log('Uncaught error', error);
          })
          .on('ready', function() {
            console.log('watching', dir);
          });
    }

    Watcher.prototype = Object.create(null);
    Watcher.prototype.constructor = Watcher;

    return Watcher;
})();

