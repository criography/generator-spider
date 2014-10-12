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
In order for the whole thing to work, the project root has to contain ***spidersock.json*** file, wchih should look like this:
```json
{
	"name": "Davy's Wine Merchants",
	"version": "1.0.0",
	"description": "Wordpress / Woocommerce ecommerce",
	"installer-path": "wp-content/themes/davy/_incs/components/",
	"builders": {
		"scss": {
			"marker": "/* --spiders:{{type}}s-- */",
			"controllers": [
				"wp-content/themes/davy/_incs/scss/shop.davy.scss"
			]
		}
	},
	"devDependencies": {
		"atom/inputs/input--select-autocomplete": "{{repo}}"
	},
	"author": "Marek Lenik",
	"license": "BSD"
}
```


## License

MIT


