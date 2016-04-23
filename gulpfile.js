var gulp = require('gulp');
var webpack = require('webpack-stream');

gulp.task('default', function() {
  return gulp.src('src/knowledge-partition.js')
    .pipe(webpack({
      output: {
        filename: 'index.js'
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
          }
        ]
      }
    }))
    .pipe(gulp.dest(''));
});
