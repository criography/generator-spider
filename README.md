### How to use

First make sure you have [Yeoman](http://yeoman.io) running, if not get it by running this command in your terminal:
```bash
npm install -g yo
```

To install generator-spider from npm, run:

```bash
npm install -g generator-spider
```

Finally, initiate the generator:

```bash
yo spider
```
### Dependencies
In order for the whole thing to work, the project root has to contain ***spidersock.json*** file, which should look like this:
```json
{
	"name": "Project Name",
	"version": "1.0.0",
	"description": "Wordpress website for Client A",
	"installer-path": "wp-content/themes/theme-name/_incs/components/",
	"builders": {
		"scss": {
			"marker": "/* --spiders:{{type}}s-- */",
			"controllers": [
				"wp-content/themes/theme-name/_incs/scss/stylesheet.scss"
			]
		}
	},
	"devDependencies": {
	},
	"author": "Your Name",
	"license": "BSD"
}
```
Few things to note:
1. marker value defaults to what's shown above, so it's technically optional.
2. your controller SCSS should follow this or similar structure:
```scss
/* COMPONENTS: ATOMS */
@import "atoms/group/component-name/controller";
/* --spiders:atoms-- */


/* COMPONENTS: MOLECULES */
@import "molecules/group/component-name/controller";
/* --spiders:molecules-- */


/* COMPONENTS: ORGANISMS */
@import "organisms/group/component-name/controller";
/* --spiders:organisms-- */
```

## License

MIT


