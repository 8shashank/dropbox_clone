var assert = require("assert");
var fs = require("fs");
var expect = require('chai').expect;
var dnode=require('dnode');
var dropboxIgnore="_.dropboxignore";
//var syncClient=require('../lib/sync/sync-client');
//var syncServer=require('../lib/sync/sync-server');

describe('sync', function()
{
    describe('#fsHandlers', function () {
        var sync=require('../lib/sync/sync');
        before(function() {
            fs.mkdirSync("test-temp");
            fs.mkdirSync("test-temp/folder1");
            fs.mkdirSync("test-temp/folder2");
            fs.writeFileSync("test-temp/folder1/test.txt");
        });

        after(function() {
            fs.unlinkSync("test-temp/folder1/test.txt");
            fs.rmdirSync("test-temp/folder1");
            fs.rmdirSync("test-temp/folder2");
            fs.rmdirSync("test-temp");
        });

        it('should have the localFs handler notify the callback when the write is complete', function (done) {
            var handler = sync.getHandler('file');

            handler.writeFile("test-temp/folder1/test.txt","",function(){
                done();
            });
        });
        it('should have the localFs handler notify callback when stat is complete', function(done){
            var handler=sync.getHandler('file');

            handler.stat("test-temp/folder1/", function(){
                done();
            });

        });
        it('should have the localFs handler notify the callback when the read is complete', function (done) {
            var handler = sync.getHandler('file');

            handler.readFile("test-temp/folder1/test.txt",function(){
                done();
            });
        });
        it('should correctly identify a simple file that is not in the target directory', function () {
            sync.compare("test-temp/folder1","test-temp/folder2",sync.filesMatchNameAndSize,function(result){
                expect(result.syncToTrg).to.include("test.txt");
            });
        });

        it('should automatically create a localFS handler mapped to the file protocol', function () {
            // should we test this
            assert('file' in sync.fsHandlers);

            // or should we test this
            assert(sync.getHandler('file'));

            expect(true).to.not.equal(false);
        });

    });
});

describe('sync-driver', function(){
    var syncDriver=require('../lib/sync/sync-driver');
    var sync=require('../lib/sync/sync');
    var argv=
    {
        directory1: "test-temp/folder1",
        directory2:"test-temp/folder2"
    };

    //When both files have a dropboxIgnore
    describe('#checkForChanges1', function(){
        var argv=
        {
            directory1: "test-temp/folder1",
            directory2:"test-temp/folder2"
        };

        before(function() {
            fs.mkdirSync("test-temp");
            fs.mkdirSync("test-temp/folder1");
            fs.mkdirSync("test-temp/folder2");
            fs.writeFileSync("test-temp/folder1/test.txt");

            fs.writeFileSync("test-temp/folder1/ignoreme11.txt", "folder 1");
            fs.writeFileSync("test-temp/folder1/ignoreme12.txt");
            fs.writeFileSync("test-temp/folder2/ignoreme21.txt");
            fs.writeFileSync("test-temp/folder2/ignoreme11.txt", "folder 2");

            fs.writeFileSync("test-temp/folder1/"+dropboxIgnore, "ignoreme11.txt\nignoreme12.txt\nignoreme21.txt");
            fs.writeFileSync("test-temp/folder2/"+dropboxIgnore, "ignoreme21.txt");
        });

        after(function(){
             fs.unlinkSync("test-temp/folder1/test.txt");
             fs.unlinkSync("test-temp/folder2/test.txt");

             fs.unlinkSync("test-temp/folder1/ignoreme11.txt");
             fs.unlinkSync("test-temp/folder1/ignoreme12.txt");
             fs.unlinkSync("test-temp/folder2/ignoreme21.txt");
             fs.unlinkSync("test-temp/folder2/ignoreme11.txt");

             fs.unlinkSync("test-temp/folder1/"+dropboxIgnore);
             fs.unlinkSync("test-temp/folder2/"+dropboxIgnore);

             fs.rmdirSync("test-temp/folder1");
             fs.rmdirSync("test-temp/folder2");
             fs.rmdirSync("test-temp");
        });

        it('should have test.txt synced to folder2', function(){
            syncDriver.checkForChanges(sync,argv);
            var files=fs.readdirSync("test-temp/folder2");
            expect(files).to.include("test.txt");
        });

        //This file is present in folder1 but not in folder2.
        it('should not sync ignoreme12.txt to folder2', function(){
            syncDriver.checkForChanges(sync,argv);
            expect(fs.readdirSync("test-temp/folder2")).to.not.include("ignoreme12.txt");
        })

        //This file is present in both folders
        it('should not sync ignoreme11.txt to or from folder2', function(){
            syncDriver.checkForChanges(sync,argv);
            expect(fs.readFileSync("test-temp/folder2/ignoreme11.txt", {encoding: 'utf8'})).to.not.include("folder1");
            expect(fs.readFileSync("test-temp/folder1/ignoreme11.txt", {encoding: 'utf8'})).to.not.include("folder2");
        })

        //This file is ignored in folder1 but not present there
        it('should not sync ignoreme21.txt to folder1', function(){
            syncDriver.checkForChanges(sync,argv);
            expect(fs.readdirSync("test-temp/folder1")).to.not.include("ignoreme21.txt");
        })
    })

    //When only one folder has a dropboxIgnore
    describe('#checkForChanges#2', function(){
        var argv=
        {
            directory1: "test-temp-2/folder1",
            directory2:"test-temp-2/folder2"
        };

        before(function(){
            fs.mkdirSync("test-temp-2");
            fs.mkdirSync("test-temp-2/folder1");
            fs.mkdirSync("test-temp-2/folder2");
            fs.writeFileSync("test-temp-2/folder1/test11.txt","folder1");
            fs.writeFileSync("test-temp-2/folder1/test12.txt");
            fs.writeFileSync("test-temp-2/folder1/"+dropboxIgnore, "test11.txt");
        });

        after(function(){
            fs.unlinkSync("test-temp-2/folder1/test11.txt");
            fs.unlinkSync("test-temp-2/folder1/test12.txt");
            fs.unlinkSync("test-temp-2/folder2/test12.txt");
            fs.unlinkSync("test-temp-2/folder1/"+dropboxIgnore);
            fs.rmdirSync("test-temp-2/folder1");
            fs.rmdirSync("test-temp-2/folder2");
            fs.rmdirSync("test-temp-2");
        });

        it('should sync test12.txt to folder2', function(){
            syncDriver.checkForChanges(sync,argv);
            expect(fs.readdirSync("test-temp-2/folder1")).to.include("test12.txt");
        });

        it('should not sync test11.txt to folder2', function(){
            syncDriver.checkForChanges(sync,argv);
            expect(fs.readdirSync("test-temp-2/folder2")).to.not.include("test11.txt");
        });

        it('should not sync dropboxIgnore file to folder2', function(){
            syncDriver.checkForChanges(sync,argv);
            expect(fs.readdirSync("test-temp-2/folder2")).to.not.include("_.dropboxignore");
        })
    })
});

describe('pipeline', function(){
    var Pipeline=require('../lib/sync/pipeline').Pipeline;
    var action1={exec: function(num){ return num + 1;}};
    var action2={exec: function(num) {return num * 3;}};

    it('should include exec function', function(){
        expect(Pipeline.prototype.hasOwnProperty("exec")).to.be.true;
    });

    it('should include addAction function', function(){
        expect(Pipeline.prototype.hasOwnProperty("addAction")).to.be.true;
    });

    it('action should have exec function', function(){
        var pipeline=new Pipeline();
        var badFunction=function(){
            pipeline.addAction({test:function(){console.log("This should throw")}});
        };
        expect(badFunction).to.throw("Actions must have an exec() function");
    });

    it('Pipeline should execute all actions', function(){
        var pipeline=new Pipeline();
        pipeline.addAction(action1);
        pipeline.addAction(action2);
        var num=5;
        var result=pipeline.exec(num).result;
        expect(result).to.equal((num+1)*3);
    });

    it('Pipeline should remember history', function(){
        var pipeline=new Pipeline();
        pipeline.addAction(action1);
        pipeline.addAction(action2);
        var num=5;
        var history=pipeline.exec(num).history;
        assert(history.length===3);
        assert(history[0]===num);
        assert(history[1]===++num);
        assert(history[2]===(num*3));
        expect(true).to.not.equal(false);
    });

    it('Pipeline should remember actions', function(){
        var pipeline=new Pipeline();
        pipeline.addAction(action1);
        pipeline.addAction(action2);
        expect(pipeline.actions.length).to.equal(2);
    });
});

describe('sync server/client', function(){
    var options = {
        port: 5004,
        host: "127.0.0.1"
    };

    it('Server should be connectable', function(done){
        var server=require('../lib/sync/sync-server');
        var port = options.port;
        var host = options.host;

        var d = dnode({},{weak:false});
        var conn = d.connect(host,port);

        conn.on('remote', function (remote) {
            done();
            d.end();
        });
    });

    it('dnode handler should have all required functions', function(done){
        var server=require('../lib/sync/sync-server');
        var client=require('../lib/sync/sync-client');

        client.connect(options, function(handler){
            expect(typeof handler.list).to.equal("function");
            expect(typeof handler.writeFile).to.equal("function");
            expect(typeof handler.readFile).to.equal("function");
            expect(typeof handler.deleteFile).to.equal("function");
            expect(typeof handler.stat).to.equal("function");
            done();
        })
    });
});
