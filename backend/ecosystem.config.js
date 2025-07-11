module.exports = {
  apps : [
{
    script: 'index.js',
    watch: false,
    instances: '2',
    autorestart: true,
	max_memory_restart: '2048M',
	vizion: false,
	exec_mode: 'cluster',
    node_args: '--max_old_space_size=2048'
  },
{
	script: 'upd.js',
	watch: false,
	instances: '1'
}
],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
