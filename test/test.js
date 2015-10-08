var assert = require("assert");
var fs = require("fs");
var expect = require('chai').expect;
var dropboxIgnore="_.dropboxignore";

describe('dropboxURIs', function(){
    var uris = require("../lib/sync/dropboxuris");
    describe('getProtocol', function(){
        it('should correctly parse protocols from full uris', function(){
            expect(uris.getProtocol("foo://asdf.com?asdf3=2")).to.equal("foo");
        });

        it('should default to file if no scheme is present in uri', function(){
            expect(uris.getProtocol("/foo/bar")).to.equal("file");
        });
    });

    describe('getPath', function(){
        it('should correctly parse path from full uris', function(){
            expect(uris.getPath("foo:///foo/bar")).to.equal("/foo/bar");
        });

        it('should correctly parse path if no protocol in uri', function(){
            expect(uris.getPath("/foo/bar")).to.equal("/foo/bar");
        });
    });

});

describe('base64utils', function(){
    var base64utils=require('../lib/sync/base64utils');

    before(function(){
        fs.mkdirSync("test-temp");
        fs.writeFileSync("test-temp/test.txt", "testing");
        fs.writeFileSync("test-temp/test2.txt");
    });

    after(function(){
        fs.unlinkSync("test-temp/test2.txt");
        fs.unlinkSync("test-temp/test.txt");
        fs.rmdirSync("test-temp");
    });

    it('Should decode base64 correctly', function(){
        expect(base64utils.readBase64Encoded("test-temp/test.txt")).to.equal(new Buffer("testing").toString("base64"));
    });

    it('Should encode base64 correctly', function(){
        base64utils.writeFromBase64Encoded(new Buffer("testing").toString("base64"), "test-temp/test2.txt");
        expect(fs.readFileSync('test-temp/test2.txt','utf8')).to.equal("testing");
    });
});

describe('sync', function()
{
    var sync=require('../lib/sync/sync');

    describe('#fsHandlers', function () {
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
        
        var handler=sync.getHandler('file');
        
        //Checking if handler above would have returned undefined
        it('should automatically create a localFS handler mapped to the file protocol', function () {
            expect(sync.getHandler('file')).to.not.be.undefined;
        });

        it('should have the localFs handler notify the callback when the write is complete', function (done) {
            handler.writeFile("test-temp/folder1/test.txt","",function(){
                done();
            });
        });
        it('should have the localFs handler notify callback when stat is complete', function(done){
            handler.stat("test-temp/folder1/", function(){
                done();
            });

        });
        it('should have the localFs handler notify the callback when the read is complete', function (done) {
            handler.readFile("test-temp/folder1/test.txt",function(){
                done();
            });
        });

        it('should correctly identify a simple file that is not in the target directory', function () {
            sync.compare("test-temp/folder1","test-temp/folder2",sync.filesMatchNameAndSize,function(result){
                expect(result.syncToTrg).to.include("test.txt");
            });
        });

    });

    describe('#comparisons', function(){
        var stat1 = {size:120};
        var stat2 = {size:200};
        var stat3 = {size:120};

        it('Should return falsy value such as undefined if second file is undefined', function(){
            expect(sync.filesMatchName(stat1,undefined)).to.not.be.ok;
        });

        it('Files having different sizes should not match', function(){
            expect(sync.filesMatchNameAndSize(stat1,stat2)).to.not.equal.true;

        });

        it('Files having same sizes should match', function(){
            expect(sync.filesMatchNameAndSize(stat1,stat3)).to.not.equal.true;
        });

    })
});

describe('sync-driver', function(){
    var syncDriver=require('../lib/sync/sync-driver');
    var sync=require('../lib/sync/sync');

    //When both files have a dropboxIgnore
    describe('#checkForChanges1', function(){
        var mainFolder="test-temp-1";
        var argv=
        {
            directory1: mainFolder+"/folder1",
            directory2:mainFolder+"/folder2"
        };

        var folder1=argv.directory1;
        var folder2=argv.directory2;

        before(function() {
            fs.mkdirSync(mainFolder);
            fs.mkdirSync(folder1);
            fs.mkdirSync(folder2);
            fs.writeFileSync(folder1+"/test.txt");

            fs.writeFileSync(folder1+"/ignoreme11.txt", "folder 1");
            fs.writeFileSync(folder1+"/ignoreme12.txt");
            fs.writeFileSync(folder2+"/ignoreme21.txt");
            fs.writeFileSync(folder2+"/ignoreme11.txt", "folder 2");

            fs.writeFileSync(folder1+"/"+dropboxIgnore, "ignoreme11.txt\nignoreme12.txt\nignoreme21.txt");
            fs.writeFileSync(folder2+"/"+dropboxIgnore, "ignoreme21.txt");
            syncDriver.checkForChanges(sync,argv);
        });

        after(function(){
            fs.unlinkSync(folder1+"/test.txt");
            fs.unlinkSync(folder2+"/test.txt");

            fs.unlinkSync(folder1+"/ignoreme11.txt");
            fs.unlinkSync(folder1+"/ignoreme12.txt");
            fs.unlinkSync(folder2+"/ignoreme21.txt");
            fs.unlinkSync(folder2+"/ignoreme11.txt");

            fs.unlinkSync(folder1+"/"+dropboxIgnore);
            fs.unlinkSync(folder2+"/"+dropboxIgnore);

             fs.rmdirSync(folder1);
             fs.rmdirSync(folder2);
             fs.rmdirSync(mainFolder);
        });

        it('should have test.txt synced to folder2', function(){
            var files=fs.readdirSync(folder2);
            expect(files).to.include("test.txt");
        });

        //This file is present in folder1 but not in folder2.
        it('should not sync ignoreme12.txt to folder2', function(){
            expect(fs.readdirSync(folder2)).to.not.include("ignoreme12.txt");
        });

        //This file is present in both folders
        it('should not sync ignoreme11.txt to or from folder2', function(){
            expect(fs.readFileSync(folder2+"/ignoreme11.txt", {encoding: 'utf8'})).to.not.include("folder1");
            expect(fs.readFileSync(folder1+"/ignoreme11.txt", {encoding: 'utf8'})).to.not.include("folder2");
        });

        //This file is ignored in folder1 but not present there
        it('should not sync ignoreme21.txt to folder1', function(){
            expect(fs.readdirSync(folder1)).to.not.include("ignoreme21.txt");
        });
    });

    //When only one folder has a dropboxIgnore
    describe('#checkForChanges#2', function(){
        var mainFolder="test-temp-2";
        var argv=
        {
            directory1: mainFolder+"/folder1",
            directory2:mainFolder+"/folder2"
        };

        var folder1=argv.directory1;
        var folder2=argv.directory2;

        before(function(){
            fs.mkdirSync(mainFolder);
            fs.mkdirSync(folder1);
            fs.mkdirSync(folder2);
            fs.writeFileSync(folder1+"/test11.txt","folder1");
            fs.writeFileSync(folder1+"/test12.txt");
            fs.writeFileSync(folder1+""+"/"+dropboxIgnore, "test11.txt");
            syncDriver.checkForChanges(sync,argv);
        });

        after(function(){
            fs.unlinkSync(folder1+"/test11.txt");
            fs.unlinkSync(folder1+"/test12.txt");
            fs.unlinkSync(folder2+"/test12.txt");
            fs.unlinkSync(folder1+""+"/"+dropboxIgnore);
            fs.rmdirSync(folder1);
            fs.rmdirSync(folder2);
            fs.rmdirSync(mainFolder);
        });

        it('should sync test12.txt to folder2', function(){
            expect(fs.readdirSync(folder2)).to.include("test12.txt");
        });

        it('should not sync test11.txt to folder2', function(){
            expect(fs.readdirSync(folder2)).to.not.include("test11.txt");
        });

        it('should not sync dropboxIgnore file to folder2', function(){
            expect(fs.readdirSync(folder2)).to.not.include("_.dropboxignore");
        })
    })
});

describe('pipeline', function(){
    var Pipeline=require('../lib/sync/pipeline').Pipeline;
    var action1={exec: function(num){ return num + 1;}};
    var action2={exec: function(num) {return num * 3;}};
    var testNum=5;

    it('Pipeline should only accept action with exec function', function(){
        var pipeline=new Pipeline();
        var badFunction=function(){
            pipeline.addAction({test:function(){console.log("This should throw")}});
        };
        expect(badFunction).to.throw("Actions must have an exec() function");
    });

    it('Pipeline should remember actions', function(){
        var pipeline=new Pipeline();
        pipeline.addAction(action1);
        pipeline.addAction(action2);
        expect(pipeline.actions.length).to.equal(2);
    });

    it('Pipeline should calculate and return a result object', function(){
        var pipeline=new Pipeline();
        pipeline.addAction(action1);
        assert(pipeline.exec(testNum).result===action1.exec(testNum));
    });

    it('Pipeline should execute all actions', function(){
        var pipeline=new Pipeline();
        pipeline.addAction(action1);
        pipeline.addAction(action2);
        var result=pipeline.exec(testNum).result;
        expect(result).to.equal(action2.exec(action1.exec(testNum)));
    });

    it('Pipeline should remember history', function(){
        var pipeline=new Pipeline();
        pipeline.addAction(action1);
        pipeline.addAction(action2);
        var action1result=action1.exec(testNum);

        var history=pipeline.exec(testNum).history;
        assert(history.length===3);
        assert(history[0]===testNum);
        assert(history[1]===action1result);
        assert(history[2]===action2.exec(action1result));
        expect(true).to.not.equal(false);
    });
});

describe('sync server/client', function(){
    var options = {
        port: 5004,
        host: "127.0.0.1"
    };

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
        });
    });
});