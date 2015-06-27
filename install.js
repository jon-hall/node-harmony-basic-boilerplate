var fsx = require('fs-extra'),
    path = require('path'),
    globby = require('globby'),
    execSync = require('child_process').execSync,
    _ = require('underscore'),
    inquirer = require("inquirer");

var ilpnRegex = /^[a-zA-Z]([\w_\-]*[0-9a-zA-Z])?$/,
    isLegalPackageName = ilpnRegex.test.bind(ilpnRegex),
    igrsRegex = /^[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+$/,
    isGithubRepoShorthand = igrsRegex.test.bind(igrsRegex);

inquirer.prompt([{
    type: 'input',
    name: 'packageName',
    message: 'Package name',
    default: '',
    validate: isLegalPackageName
}, {
    type: 'input',
    name: 'packageVersion',
    message: 'Package version',
    default: '0.0.1'
}, {
    type: 'input',
    name: 'packageDescription',
    message: 'Package description',
    default: ''
}, {
    type: 'confirm',
    name: 'cli',
    message: 'Make a command line interface',
    default: false
}, {
    type: 'input',
    name: 'repo',
    message: 'Git repository',
    default: ''
}, {
    type: 'confirm',
    name: 'repoSsh',
    message: 'Use git over SSH',
    default: false,
    when: function(a) {
        return !!isGithubRepoShorthand(a.repo);
    }
}, {
    type: 'input',
    name: 'keywords',
    message: 'Package keywords',
    default: ''
}, {
    type: 'input',
    name: 'author',
    message: 'Package author',
    default: ''
}, {
    type: 'input',
    name: 'license',
    message: 'Package license',
    default: 'ISC'
}], function(answers) {
    var globs = ['./*.*', './**/*.*', '!.node_modules/*.*',
        '!.node_modules/**/*.*', '!./*.tpl', '!./package.json', '!./.npmignore',
        '!./README.md', '!./LICENSE'],
        dest = path.resolve(__dirname, '../..');

    // Modify package.json using tpl + answers and copy to dest
    var pkg = fsx.readFileSync(path.join(__dirname, 'package.json.tpl'), {encoding: 'utf8'});
    pkg = _.template(pkg.toString())(answers);
    fsx.writeFileSync(path.join(dest, 'package.json'), pkg);

    // Modify README.md using tpl + answers and copy to dest
    var readme = fsx.readFileSync(path.join(__dirname, 'README.md.tpl'), {encoding: 'utf8'});
    readme = _.template(readme.toString())(answers);
    fsx.writeFileSync(path.join(dest, 'README.md'), readme);

    // Don't copy cli.js if they don't want a CLI
    if(!answers.cli) {
        globs.push('!./cli.js');
    }

    // Remove dev items from .gitignore and copy to dest
    var gi = fsx.readFileSync(path.join(__dirname, '.npmignore'), {encoding: 'utf8'});
    gi = gi.toString().replace(/\*\.backup/g, '');
    fsx.writeFileSync(path.join(dest, '.gitignore'), gi);

    // Copy all required files to parent's parent directory (e.g. above node_modules)
    copyGlobsSync(globs, dest);

    // Perform a 'git init' in the dest directory
    execSync('git init', {cwd: dest});

    // Run 'git remote add origin' if repo supplied
    if(answers.repo) {
        if(isGithubRepoShorthand(answers.repo)) {
            if(answers.repoSsh) {
                answers.repo = 'git@github.com:' + answers.repo + '.git';
            } else {
                answers.repo = 'https://github.com/' + answers.repo + '.git';
            }
        }
        execSync('git remote add origin ' + answers.repo, {cwd: dest});
    }
});

function copyGlobsSync(globs, dest) {
    var files = globby.sync(globs);
    files.forEach(function(f) {
        fsx.copySync(f, path.resolve(dest, f));
    });
}
