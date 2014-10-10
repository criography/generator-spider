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
    this.root = '';
    this.config = require(process.cwd()+ '/spidersock.json');
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
      this.componentSlug  = sanitize(props.componentSlug.replace(/\s+/g, '-').toLowerCase());
      this.componentGroup = props.componentGroup;
      this.componentType  = props.componentType;

      this.root =  './' + ( this.config['installer-path'] ? this.config['installer-path'] : 'components/' ) + this.componentType + '/' + this.componentGroup + '/' + this.componentSlug + '/';
      this.destinationRoot(this.root);

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      var _controller =this.readFileAsString(this.sourceRoot() + '/_controller.scss');
      var _scss_core = this.readFileAsString(this.sourceRoot() + '/_component.scss');
      var _scss_theme = this.readFileAsString(this.sourceRoot() + '/_theme.scss');
     
      this.src.copy('README.md', 'README.md');
      this.mkdir('theme');
      this.mkdir('core/lib');
 
      this.writeFileFromString(
        _controller.split('/core/').join('/core/' +  this.componentSlug), 
        '_controller.scss'
      );

      this.writeFileFromString(
        _scss_theme.split('{{Name}}').join( this.componentName), 
        'theme/_' + this.componentSlug + '-theme.scss'
      );

      this.writeFileFromString(
        _scss_core.split('{{Name}}').join( this.componentName), 
        'core/' + this.componentSlug + '.scss'
      );


    }


  },



  end: function () {
    //this.installDependencies();
  }
});

module.exports = SpiderGenerator;
