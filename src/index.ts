import * as core from '@actions/core';
import * as github from '@actions/github';
import { GitHubClientWrapper } from './github_client_wrapper';
import { FastForwardAction } from './fast_forward_action';

async function run(): Promise<void>{
  const github_token = core.getInput('GITHUB_TOKEN');
  
  const success_message = core.getInput('success_message') || "Fast-forward Succeeded!";
  const failure_message = core.getInput('failure_message') || "Fast-forward Failed!";
  const failure_message_same_stage_and_prod = core.getInput('failure_message_same_stage_and_prod') || failure_message;
  const failure_message_diff_stage_and_prod = core.getInput('failure_message_diff_stage_and_prod') || failure_message;
  
  const comment_messages = {
    success_message: success_message,
    failure_message: failure_message,
    failure_message_same_stage_and_prod: failure_message_same_stage_and_prod,
    failure_message_diff_stage_and_prod: failure_message_diff_stage_and_prod
  }

  const update_status = core.getInput('update_status');
  const set_status = update_status === 'true' ? true : false;

  const prod_branch = core.getInput('production_branch') || 'master';
  const stage_branch = core.getInput('staging_branch') || 'staging';

  const client = new GitHubClientWrapper(github.context , github_token);
  
  const pr = client.get_current_pull_request_number();
    const pullRequestData =  await client.get_pull_request(pr);
        const ffb = await client.get_pull_request_target_base_async(pr);
        const ffh = await client.get_pull_request_source_head_async(pr);
        core.setOutput("ffbase", ffb);
      core.setOutput("ffhead", ffh);
    core.setOutput("ffsha", pullRequestData.head.sha);

}

run();
