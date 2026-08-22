import { build as viteBuild } from 'vite';
import * as esbuild from 'esbuild';

async function runBuild() {
  console.log('🚀 Starting Vite client build...');
  await viteBuild();
  console.log('✅ Vite client build completed successfully.');

  console.log('🚀 Starting esbuild backend bundle...');
  await esbuild.build({
    entryPoints: ['server.ts'],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    packages: 'external',
    sourcemap: true,
    outfile: 'dist/server.cjs'
  });
  console.log('✅ esbuild server bundle created at dist/server.cjs.');
  console.log('🎉 Full production build complete and ready for Render!');
}

runBuild().catch((err) => {
  console.error('❌ Build process encountered an error:', err);
  process.exit(1);
});
