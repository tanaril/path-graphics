server "www.path-graphics.com", :app, :web, :db, :primary => true

# =============================================================================
# SCM OPTIONS
# =============================================================================
set :scm, :git          # or :git
set :repository,  "git@github.com:tanaril/path-graphics.git"
set :branch, 'master'

# =============================================================================
# REQUIRED VARIABLES
# =============================================================================
set :current_dir, "release"
set :application, "PATH GRAPHICS"

# =============================================================================
# SSH OPTIONS
# =============================================================================
set :deploy_to, "/home/path-graphics"
set :user, "path-graphics"
set :use_sudo, false           # optional
set :ssh_options, { :forward_agent => true }

# =============================================================================
# RELEASE
# =============================================================================
set :keep_releases, 3
set :deploy_via, :copy
set :copy_cache, false

set :copy_exclude, [
    ".git",
    ".gitignore",
    "deployment",
    "documentation"
]

# =============================================================================
# TASKS
# =============================================================================

after "deploy:create_symlink", "deploy:cleanup"
after "deploy:cleanup", "deploy:restart"

def remote_file_exists?(full_path)
  'true' ==  capture("if [ -e #{full_path} ]; then echo 'true'; fi").strip
end

namespace :deploy do

    task :update_code, :except => { :no_release => true } do
      on_rollback { run "rm -rf #{release_path}; true" }
      strategy.deploy!
      finalize_update
    end

    task :finalize_update do
        transaction do
            run "chmod -R g+w #{latest_release}" if fetch(:group_writable, true)
            run "mkdir -r #{release_path}/cache/ngx_pagespeed_cache"
        end
    end

    task :create_symlink, :except => { :no_release => true } do
        on_rollback do
          if previous_release
            #run "rm -f #{current_path}; ln -s #{previous_release} #{current_path}; true"
          else
            logger.important "no previous release to rollback to, rollback of symlink skipped"
          end
        end

        run "rm -f #{current_path} && ln -s #{latest_release} #{current_path}"
    end

    task :restart do
        #run "pkill -QUIT -f 'php-fpm: pool #{php_pool}'"
    end
end

def with_user(new_user, &block)
  old_user = user
  set :user, new_user
  close_sessions
  yield
  set :user, old_user
  close_sessions
end

def close_sessions
  sessions.values.each { |session| session.close }
  sessions.clear
end
