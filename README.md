# recycling-map-essen

## build deps

`npm install babel-cli babel-preset-es2015 uglify-js node-sass`

### js

`babel recycling-maps.js | uglifyjs -c -m > recycling-maps.min.js`
`babel segmented-circle-icon.js | uglifyjs -c -m > segmented-circle-icon.min.js`

### css

`sass -t compressed style.scss:style.css`
