abort "Please use Ruby 1.9 or greater to build Ember.js!" if Gem::Version.new(RUBY_VERSION) < Gem::Version.new('1.9')

require 'bundler/setup'
require 'rake-pipeline'
require 'colored'

def pipeline
  Rake::Pipeline::Project.new("Assetfile")
end

desc "Build ember-validations.js"
task :dist do
  puts "Building Ember Validations..."
  pipeline.invoke
  puts "Done"
end

desc "Clean build artifacts from previous builds"
task :clean do
  puts "Cleaning build..."
  rm_rf "dist" # Make sure even things RakeP doesn't know about are cleaned
  rm_rf "tests/ember-validation-tests.js"
  rm_rf "tmp"
  puts "Done"
end

namespace :docs do
  def doc_args
    "#{Dir.glob("packages/ember-*").join(' ')} -E #{Dir.glob("packages/ember-*/tests").join(' ')} -t docs.emberjs.com"
  end

  desc "Preview Ember Docs (does not auto update)"
  task :preview do
    require "ember_docs/cli"
    EmberDocs::CLI.start("preview #{doc_args}".split(' '))
  end

  desc "Build Ember Docs"
  task :build do
    require "ember_docs/cli"
    EmberDocs::CLI.start("generate #{doc_args} -o docs".split(' '))
  end

  desc "Remove Ember Docs"
  task :clean do
    rm_r "docs"
  end
end

desc "Run tests with phantomjs"
task :test, [:suite] => :dist do |t, args|
  unless system("which phantomjs > /dev/null 2>&1")
    abort "PhantomJS is not installed. Download from http://phantomjs.org"
  end

  suites = {
    :default => ["package=all"],
    :all => ["package=all",
              "package=all&extendprototypes=true",
              "package=all&dist=build"]
  }

  if ENV['TEST']
    opts = [ENV['TEST']]
  else
    suite = args[:suite] || :default
    opts = suites[suite.to_sym]
  end

  unless opts
    abort "No suite named: #{suite}"
  end

  cmd = opts.map do |opt|
    "phantomjs tests/qunit/run-qunit.js \"file://localhost#{File.dirname(__FILE__)}/tests/index.html?#{opt}\""
  end.join(' && ')

  puts "Running: #{opts.join(", ")}"
  success = system(cmd)

  if success
    puts "Tests Passed".green
  else
    puts "Tests Failed".red
    exit(1)
  end
end
