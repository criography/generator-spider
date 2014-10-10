'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var sanitize = require("sanitize-filename");


var SpiderGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
    this.root = process.cwd();
    this.config = require(this.root + '/spidersock.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Yo! Welcome to the SpiderSock component generator!'
    ));



    var prompts = [
    {
      type    : 'input',
      name    : 'componentName',
      message : 'Gimme thy component\'s name. [A-Za-z0-9 :-_]'
    },  

    {
      type    : 'input',
      name    : 'componentSlug',
      message : 'Gimme thy component\'s slug. [a-z0-9-_]'
    },    

    {
      type    : 'input',
      name    : 'componentGroup',
      message : 'Gimme thy component\'s functional group. [a-z0-9-_]'
    },

    {
      type: 'list',
      name: 'componentType',
      message: 'What type of component is it?',
      choices: ['atom', 'molecule', 'organism', 'layout', 'page'],
      default: 'atom'
    }

    ];

    this.prompt(prompts, function (props) {
      this.componentName  = props.componentName;
      this.componentSlug  = sanitize(props.componentSlug.replace(/\s+/g, '-').toLowerCase().split());
      this.componentGroup = props.componentGroup;
      this.componentType  = props.componentType;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      var self = this;
      var path = self.root + self.config['installer-path'] + '/components/' + self.componentType + '/' + self.componentGroup + '/' + self.componentSlug + '/';

      console.log(path);
      mkdirp(path, function (err) {
          if (err){
            throw (err);
          } 

          self.src.copy('README.md', 'package.json');
      });


    },

    projectfiles: function () {
      this.src.copy('editorconfig', '.editorconfig');
      this.src.copy('jshintrc', '.jshintrc');
    }
  },

  end: function () {
    this.installDependencies();
  }
});

module.exports = SpiderGenerator;
