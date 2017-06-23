module.exports = function (grunt) {

    var source = './takeoff/';

    var sassFiles = {};

    sassFiles[source + 'build/css/main.css'] = source + 'sass/main.scss';
    sassFiles[source + 'build/css/main-legacy.css'] = source + 'sass/main-legacy.scss';


    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        target: grunt.option('target') || 'public',

        //  JAVASCRIPT TASKS

        babel: {
            options: {
              presets: ['es2015']
            },
            dist: {
                files: [{
                    expand: true,
                    src: source + 'js/components/*.js',
                    dest: source +'build/',
                    ext: '.js'
                }]
            }
        },

        eslint: {
            target: [ source + 'js/main.js', source + 'js/components/*.js']
        },

        concat: {
            main: {
                src: [
                    source + 'js/libs/*.js',
                    source + 'build/js/components/*.js',
                    source + 'js/main.js',
                    source + '!js/**/_*.js'  //  Exclude files that start with an underscore
                ],
                dest: source + 'build/js/main.js'
            },
            polyfill: {     //  Polyfills for < IE9
                src: [
                    source + 'js/polyfill/*.js'
                ],
                dest: source + 'build/js/polyfill.js'
            }
        },

        uglify: {
            main: {
                files: {
                    '<%= target %>/js/main.min.js': source + 'build/js/main.js'
                }
            },
            polyfill: {
                files: {
                    '<%= target %>/js/polyfill.min.js': source + 'build/js/polyfill.js'
                }
            },
            singles: {
                files: [{
                  expand: true,
                  cwd: source + 'js/singles',
                  src: '**/*.js',
                  dest: '<%= target %>/js'
              }]
            }
        },

        //  CSS TASKS

        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: sassFiles
            }
        },

        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({
                        browsers: ['last 2 versions']
                    })
                ]
            },
            dist: {
                src: source + 'build/css/*.css'
            }
        },

        cssmin: {
            minify: {
                expand: true,
                cwd: source + 'build/css/',
                src: ['*.css', '!*.min.css'],
                dest: '<%= target %>/css/',
                ext: '.min.css'
            }
        },

        // shell commands for use in Grunt tasks
        shell: {
            jekyllBuild: {
                command: 'jekyll build'
            },
            jekyllServe: {
                command: 'jekyll serve'
            }
        },

        concurrent: {
            serve: [
                'watch',
                'shell:jekyllServe'
            ],
            options: {
                logConcurrentOutput: true
            }
        },


        //  IMAGE TASKS

        responsive_images: {
            dev: {
                options: {
                    sizes: [{
                        width: 420,
                        name: 'sml'
                    }, {
                        width: 820,
                        name: 'lrg'
                    }]
                },
                files: [{
                    expand: true,
                    cwd: source + 'img/responsive',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: source + 'build/img/responsive'
                }]
            }
        },

        imagemin: {
            dynamic: {
                options: {
                    pngquant: true,
                    force: true
                },
                files: [{
                    expand: true,
                    cwd: source +'img/',
                    src: ['**/*.{png,jpg,gif,ico}'],
                    dest: source + 'build/img/'
                }]
            }
        },

        svgmin: {
            options: {
                plugins: [
                    { removeXMLProcInst: false },
                    { removeViewBox: false },
                    { cleanupIDs: false },
                    { removeUselessStrokeAndFill: false }
                ]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: source + 'img/svg',
                    src: ['**/*.svg'],
                    dest: source + 'build/img/svg/'
                }]
            }
        },

        svg2png: {
            all: {
                files: [{
                    cwd: source + 'img/svg/',
                    src: ['**/*.svg', '!grayscale.svg'],
                    dest: source + 'img/svg/fallback/'
                }]
            }
        },


        //  ICON TASKS

        webfont: {
            icons: {
                src: source + 'icons/svg/**/*.svg',
                dest: source + 'build/fonts',
                destCss: source + 'sass/core',
                options: {
                    htmlDemo: false,
                    relativeFontPath: source + '/fonts/',
                    stylesheet: 'scss',
                    template: source + 'icons/css/custom.css',
                    codepointsFile: source + 'icons/css/codepoints.json'
                }
            }
        },

        svgstore: {
            options: {
                prefix: 'symbol-'
            },
            icons: {
                files: {
                    '<%= target %>/img/svg/svgstore.svg': 'img/svg/store/**/*.svg'
                }
            }
        },

        // Browersync

        browserSync: {
            proxy: {
                target: "http://*.*.statik.be",
                ws: true,
                port: 3001
            },
            options: {
                watchTask: true
            }
        },


        //  GENERAL TASKS

        clean: {
            img: {
                src: [source + 'build/img', '<%= target %>/img']
            },
            fonts: {
                src: [source + 'build/fonts', '<%= target %>/fonts']
            },
            options: {
                'force': true
            }
        },

        copy: {
            images: {
                cwd: source + 'build/img/',
                src: '**/*.*',
                expand: true,
                dest: '<%= target %>/img',
                filter: 'isFile'
            },
            fonts: {
                cwd: source + 'build/fonts/',
                src: '**/*.*',
                expand: true,
                dest: '<%= target %>/fonts/',
                filter: 'isFile'
            },
            svgs: {
                cwd: source + 'build/img/svg',
                src: '**/*.*',
                expand: true,
                dest: '<%= target %>/img/svg',
                filter: 'isFile'
            },
            html: {
                cwd: source + 'html',
                src: '**/*.*',
                expand: true,
                dest: '<%= target %>/static/',
                filter: 'isFile'
            },
            jekyll: {
              cwd: 'jekyll-dist',
              src: '**/*.*',
              expand: true,
              dest: '<%= target %>',
              filter: 'isFile'
            }
        },

        notify: {
            css: {
                options: {
                    title: '✓ Task complete!',
                    message: 'CSS'
                }
            },
            js: {
                options: {
                    title: '✓ Task complete!',
                    message: 'Javascript'
                }
            },
            img: {
                options: {
                    title: '✓ Task complete!',
                    message: 'Images'
                }
            },
            fonts: {
                options: {
                    title: '✓ Task complete!',
                    message: 'Fonts'
                }
            },
            icons: {
                options: {
                    title: '✓ Task complete!',
                    message: 'Icons'
                }
            },
            jekyll: {
                options: {
                    message: '✓ Jekyll copy task complete'
                }
            }
        },

        watch: {
            options: {
                livereload: false
            },
            js: {
                files: [source + 'js/**/*.js'],
                tasks: ['js', 'notify:js'],
                options: {
                    spawn: false,
                },
            },
            css: {
                files: [source + 'sass/**/*.scss'],
                tasks: ['css', 'notify:css'],
                options: {
                    spawn: false,
                }
            },
            images: {
                files: [source + 'img/**/*.{png,jpg,gif,ico,svg}'],
                tasks: ['img', 'notify:img']
            },
            html: {
                files: [source + 'html/**/*.html'],
                tasks: ['copy:html']
            },
            jekyll: {
                files: ['jekyll/**/*.*'],
                tasks: ['jekyll']
            },
            fonts: {
                files: [source + 'fonts/**', 'icons/**'],
                tasks: ['fonts', 'notify:fonts']
            }
        }
    });

    //  PLUGINS
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    //  COMBINED TASKS
    grunt.registerTask('default', ['build', 'copy:html', 'browserSync', 'watch']);
    grunt.registerTask('js', ['eslint', 'babel', 'concat', 'uglify']);
    grunt.registerTask('img', ['clean:img', 'responsive_images', 'imagemin', 'svg2png', 'svgmin', 'copy:images', 'copy:svgs']);
    grunt.registerTask('fonts', ['clean:fonts', 'webfont', 'copy:fonts']);
    grunt.registerTask('css', ['sass', 'postcss', 'cssmin']);
    grunt.registerTask('jekyll', ['shell:jekyllBuild', 'copy:jekyll', 'notify:jekyll']);
    grunt.registerTask('build', ['fonts', 'css', 'js', 'img', 'jekyll']);

};
