abort "Please use Ruby 1.9 to build Ember.js!" if RUBY_VERSION !~ /^1\.9/

require 'bundler/setup'
require 'rake-pipeline'

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
  puts "Done"
end

