/**
 * @TODO: install to spider_modules first, then move to components and add to project's bower.json
 * @TODO: create repository
 * @TODO: refactor all vars into object for better readability
 * @TODO: unify used I/O methods. Make everything async?
 * @TODO: make everything mustache, instead of split/join? Or not.
 * @TODO: handle JS controllers. Perhaps this should be managed through browserify?
 * @TODO: documentation
 * @TODO: separate methods and cleanup this fucking mess
 */

'use strict';
var util      = require('util');
var fs        = require('fs');
var path      = require('path');
var yeoman    = require('yeoman-generator');
var yosay     = require('yosay');
var sanitize  = require("sanitize-filename");
var chalk     = require('chalk');
var mustache  = require('mustache');



var SpiderGenerator = yeoman.generators.Base.extend({
	initializing : function(){
		this.pkg                      = require('../package.json');
		this.projectRoot              = process.cwd();
		this.sockConfigPath           = this.projectRoot + '/spidersock.json';
		this.sockConfig               = require(this.sockConfigPath);
		this.componentRoot            = '';
		this.componentPath            = '';
		this.projectControllerMarker  = '/* --spiders:{{type}}s-- */';
	},






	prompting : function(){
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
				type    : 'list',
				name    : 'componentType',
				message : 'What type of component is it?',
				choices : ['atom', 'molecule', 'organism', 'layout', 'page'],
				default : 'atom'
			},

			{
				type    : 'input',
				name    : 'componentDeps',
				message : 'Any git dependencies? (comma separated git repo URLs only)'
			}

		];

		this.prompt(prompts, function(props){
			this.componentName = props.componentName;
			this.componentSlug = sanitize(props.componentSlug.replace(/\s+/g, '-').toLowerCase());
			this.componentGroup = props.componentGroup;
			this.componentType = props.componentType;
			this.componentDeps = props.componentDeps;

			this.componentPath = this.componentType + 's/' + this.componentGroup + '/' + this.componentSlug;
			this.componentRoot = './' + ( this.sockConfig['installer-path'] || 'components/' ) + this.componentPath + '/';
			this.destinationRoot(this.componentRoot);

			done();
		}.bind(this));
	},






	writing : {
		app : function(){
			var self                = this;
			var _controller         = this.readFileAsString(this.sourceRoot() + '/_controller.scss');
			var _package            = this.readFileAsString(this.sourceRoot() + '/_package.json');
			var _spider             = this.readFileAsString(this.sourceRoot() + '/_spider.json');
			var _bower              = this.readFileAsString(this.sourceRoot() + '/_bower.json');
			var _scss_core          = this.readFileAsString(this.sourceRoot() + '/_component.scss');
			var _scss_theme         = this.readFileAsString(this.sourceRoot() + '/_theme.scss');



			/* create directory structure */
			this.mkdir('theme');
			this.mkdir('core/lib');


			/* copy templates */
			this.src.copy('README.md', 'README.md');
			this.src.copy('_bowerrc', '.bowerrc');


			/* create spider.json */
			this.writeFileFromString(
				mustache.render(
					_spider,
					{"type" : this.componentType, "name" : this.componentName, "group": this.componentGroup, "slug": this.componentSlug}
				),
				'spider.json'
			);
			console.log(chalk.green('   create ') + 'spider.json');


			/* create package.json */
			this.writeFileFromString(
				_package.split('{{name}}').join(this.componentName),
				'package.json'
			);
			console.log(chalk.green('   create ') + 'package.json');


			/* create bower.json */
			this.writeFileFromString(
				_bower.split('{{name}}').join(this.componentName),
				'bower.json'
			);
			console.log(chalk.green('   create ') + 'bower.json');


			/* generate controller SCSS file */
			this.writeFileFromString(
				_controller.split('{{slug}}').join(this.componentSlug),
				'_controller.scss'
			);
			console.log(chalk.green('   create ') + '_controller.scss');


			/* generate theme SCSS file */
			this.writeFileFromString(
				_scss_theme.split('{{Name}}').join(this.componentName),
				'theme/_' + this.componentSlug + '-theme.scss'
			);
			console.log(chalk.green('   create ') + this.componentSlug + '-theme.scss');


			/* generate core SCSS file */
			this.writeFileFromString(
				_scss_core.split('{{Name}}').join(this.componentName),
				'core/' + this.componentSlug + '.scss'
			);
			console.log(chalk.green('   create ') + this.componentSlug + '.scss');



			/* update spidersock.json */
			this.sockConfig.devDependencies[this.componentPath] = "{{repo}}";
			try{
				fs.writeFileSync(this.sockConfigPath, JSON.stringify(this.sockConfig, null, "\t"), 'utf8');
			} catch (err) {
				throw(err);
			}
			console.log(chalk.green('   updated ') + 'spidersock.json');




			/* update scss controller */
			/* only accept arrays */
			if(Array.isArray(this.sockConfig.builders.scss.controllers)){


				/* determine the right marker */
				this.projectControllerMarker = (this.sockConfig.builders.scss.marker || this.projectControllerMarker ).
					split('{{type}}').join(this.componentType);


				/* loop through all controllers */
				this.sockConfig.builders.scss.controllers.map(function(file){
					var _file = self.projectRoot + '/' + file;


					/* check if file exists */
					if( fs.existsSync(_file) ){
						var _projectController = self.readFileAsString(_file);

						/* inject reference to the component */
						self.writeFileFromString(
							_projectController.split(self.projectControllerMarker).join('@import "'+ self.componentPath +'/controller";' + "\n" + self.projectControllerMarker),
							_file
						);

						console.log(chalk.green('   updated project controller: ') + file );

					}else{
						console.log(chalk.red('   could not find "' + _file +'" controller. Skipping.'));
					}

				})
			}





		}


	},



	end : function(){
		var _deps;

		if(this.componentDeps!==''){
			_deps = this.componentDeps.split(',');
			console.log(chalk.green('   installing dependencies'));
			this.bowerInstall(_deps, { 'saveDev': true });
		}

	}
});

module.exports = SpiderGenerator;
