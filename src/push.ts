import fs from 'node:fs';
import path from 'node:path';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';

const dir = path.resolve('.');

async function run() {
  console.log('1. Initializing Git repository...');
  try {
    await git.init({ fs, dir });
    console.log('✓ Git repository initialized.');
  } catch (err: any) {
    console.log('Init note:', err.message);
  }

  console.log('\n2. Staging all project files...');
  async function addFilesRecursively(currentDir: string, relativePath: string = '') {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.system_generated' || entry.name === 'scratch') continue;
      const fullPath = path.join(currentDir, entry.name);
      const rel = relativePath ? `${relativePath}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        await addFilesRecursively(fullPath, rel);
      } else {
        await git.add({ fs, dir, filepath: rel });
      }
    }
  }

  await addFilesRecursively(dir);
  console.log('✓ All files staged.');

  console.log('\n3. Creating commit...');
  let sha;
  try {
    sha = await git.commit({
      fs,
      dir,
      author: {
        name: 'Its-prity',
        email: 'developer@midnight.network',
      },
      message: 'Initial commit: Midnight Privacy-Preserving Counter smart contract, unit tests, Compact specs, and interactive localhost dashboard'
    });
    console.log('✓ Commit created successfully:', sha);
  } catch (err: any) {
    console.log('Commit status:', err.message);
  }

  console.log('\n4. Setting remote origin to https://github.com/Its-prity/midnight.git...');
  try {
    await git.addRemote({
      fs,
      dir,
      remote: 'origin',
      url: 'https://github.com/Its-prity/midnight.git',
      force: true
    });
    console.log('✓ Remote origin set to https://github.com/Its-prity/midnight.git.');
  } catch (err: any) {
    console.log('Remote status:', err.message);
  }

  console.log('\n5. Attempting git push to origin...');
  const currentBranch = (await git.currentBranch({ fs, dir })) || 'master';
  console.log(`Current branch: ${currentBranch}`);

  const token = (process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '').trim();

  try {
    const pushResult = await git.push({
      fs,
      http,
      dir,
      remote: 'origin',
      ref: currentBranch,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      onAuth: () => ({ username: token })
    });
    console.log(`✅ Pushed successfully to https://github.com/Its-prity/midnight.git (${currentBranch} branch)!`);
    console.log(JSON.stringify(pushResult, null, 2));
  } catch (err: any) {
    console.log('\n⚠️ Push authentication status:');
    console.log(err.message);
  }
}

run().catch(console.error);
